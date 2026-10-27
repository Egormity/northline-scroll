import { useLayoutEffect, useRef, type RefObject } from 'react';
import { useMotion } from './MotionProvider';
import { sceneProgress } from './math';

interface Options {
  mode?: 'sticky' | 'viewport';
  enabled?: boolean;
}

export const useSceneProgress = (
  ref: RefObject<HTMLElement | null>,
  onProgress: (progress: number) => void,
  { mode = 'sticky', enabled = true }: Options = {},
) => {
  const { reducedMotion } = useMotion();
  const callback = useRef(onProgress);
  useLayoutEffect(() => {
    callback.current = onProgress;
  });
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (!enabled || reducedMotion) {
      callback.current(0);
      element.dataset.progress = '0';
      return;
    }
    let frame = 0;
    let start = 0;
    let travel = 0;
    let last = -1;
    let measureNeeded = true;
    let disposed = false;
    const update = () => {
      frame = 0;
      if (disposed) return;
      const remeasured = measureNeeded;
      if (measureNeeded) {
        const rect = element.getBoundingClientRect();
        const top = rect.top + window.scrollY;
        const stage = element.querySelector<HTMLElement>('[data-stage]');
        const inset = stage ? parseFloat(getComputedStyle(stage).top) || 0 : 0;
        start = mode === 'viewport' ? top - window.innerHeight : top - inset;
        travel =
          mode === 'viewport'
            ? rect.height + window.innerHeight
            : rect.height - (stage?.offsetHeight ?? window.innerHeight);
        measureNeeded = false;
      }
      const progress = sceneProgress(window.scrollY, start, travel);
      if (progress === last && !remeasured) return;
      last = progress;
      element.dataset.progress = progress.toFixed(5);
      callback.current(progress);
    };
    const schedule = () => {
      if (!disposed && !frame) frame = requestAnimationFrame(update);
    };
    const measure = () => {
      measureNeeded = true;
      schedule();
    };
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    observer.observe(document.body);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', measure);
    document.addEventListener('load', measure, true);
    void document.fonts.ready.then(measure);
    update();
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', measure);
      document.removeEventListener('load', measure, true);
    };
  }, [enabled, mode, reducedMotion, ref]);
};
