import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { useMediaQuery } from './useMediaQuery';

type ScrollOptions = { immediate?: boolean; offset?: number; onComplete?: () => void };
interface MotionContextValue {
  reducedMotion: boolean;
  systemReducedMotion: boolean;
  toggleMotion: () => void;
  scrollTo: (target: HTMLElement | number, options?: ScrollOptions) => void;
  setScrollLocked: (locked: boolean) => void;
}
const MotionContext = createContext<MotionContextValue | null>(null);
const preferenceKey = 'northline.reduced-motion';

const readPreference = () => {
  try {
    return localStorage.getItem(preferenceKey) === 'true';
  } catch {
    return false;
  }
};

export const MotionProvider = ({ children }: { children: ReactNode }) => {
  const systemReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const [userReduced, setUserReduced] = useState(readPreference);
  const [locked, setScrollLocked] = useState(false);
  const lock = useRef(false);
  const controller = useRef<Lenis | null>(null);
  const reducedMotion = systemReducedMotion || userReduced;

  useLayoutEffect(() => {
    document.documentElement.dataset.motion = reducedMotion ? 'reduced' : 'full';
    return () => {
      delete document.documentElement.dataset.motion;
    };
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return;
    const lenis = new Lenis({
      autoRaf: true,
      smoothWheel: true,
      syncTouch: false,
      lerp: 0.12,
      anchors: false,
    });
    controller.current = lenis;
    if (lock.current) lenis.stop();
    return () => {
      lenis.destroy();
      controller.current = null;
    };
  }, [reducedMotion]);

  useLayoutEffect(() => {
    lock.current = locked;
    if (!locked) {
      controller.current?.start();
      return;
    }
    const previous = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    controller.current?.stop();
    return () => {
      document.documentElement.style.overflow = previous;
      controller.current?.start();
    };
  }, [locked]);

  const toggleMotion = useCallback(() => {
    setUserReduced((value) => {
      const next = !value;
      try {
        localStorage.setItem(preferenceKey, String(next));
      } catch {
        /* Session preference still works. */
      }
      return next;
    });
  }, []);

  const scrollTo = useCallback((target: HTMLElement | number, options: ScrollOptions = {}) => {
    if (lock.current) return;
    // Own coordinates and the header offset here; element targets would also
    // apply Lenis's CSS offsets and its cached position after native focus jumps.
    const top =
      typeof target === 'number' ? target : target.getBoundingClientRect().top + window.scrollY;
    if (controller.current) {
      controller.current.scrollTo(top, {
        offset: options.offset ?? 0,
        immediate: options.immediate,
        onComplete: options.onComplete,
      });
    } else {
      window.scrollTo({ top: top + (options.offset ?? 0), behavior: 'instant' });
      options.onComplete?.();
    }
  }, []);

  useEffect(() => {
    const navigate = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const link = (event.target as Element).closest<HTMLAnchorElement>('a[href]');
      if (!link || link.target || link.hasAttribute('download')) return;
      const destination = new URL(link.href, window.location.href);
      if (
        destination.origin !== location.origin ||
        destination.pathname !== location.pathname ||
        !destination.hash
      )
        return;
      let id: string;
      try {
        id = decodeURIComponent(destination.hash.slice(1));
      } catch {
        return;
      }
      const target = document.getElementById(id);
      if (!target || lock.current) return;
      event.preventDefault();
      if (location.hash !== destination.hash) history.pushState(null, '', destination.hash);
      const headerHeight = document.querySelector('header')?.getBoundingClientRect().height ?? 72;
      scrollTo(target, {
        offset: -headerHeight,
        onComplete: () => {
          const hadTabIndex = target.hasAttribute('tabindex');
          if (!hadTabIndex) target.setAttribute('tabindex', '-1');
          target.focus({ preventScroll: true });
          if (!hadTabIndex)
            target.addEventListener('blur', () => target.removeAttribute('tabindex'), {
              once: true,
            });
        },
      });
    };
    document.addEventListener('click', navigate);
    return () => document.removeEventListener('click', navigate);
  }, [scrollTo]);

  const value = useMemo(
    () => ({ reducedMotion, systemReducedMotion, toggleMotion, scrollTo, setScrollLocked }),
    [reducedMotion, systemReducedMotion, toggleMotion, scrollTo],
  );
  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>;
};

export const useMotion = () => {
  const value = useContext(MotionContext);
  if (!value) throw new Error('MotionProvider is missing.');
  return value;
};
