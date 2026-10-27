import { useEffect, useState, type RefObject } from 'react';

export const useFilmVisibility = (container: RefObject<HTMLElement | null>, enabled: boolean) => {
  const [nearby, setNearby] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(() => !document.hidden);
  useEffect(() => {
    const element = container.current;
    if (!enabled || !element) {
      setVisible(false);
      return;
    }
    const preload = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNearby(true);
          preload.disconnect();
        }
      },
      { rootMargin: '180px' },
    );
    const playback = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting && entry.intersectionRatio >= 0.15),
      {
        threshold: 0.15,
      },
    );
    preload.observe(element);
    playback.observe(element);
    const visibility = () => setPageVisible(!document.hidden);
    document.addEventListener('visibilitychange', visibility);
    return () => {
      preload.disconnect();
      playback.disconnect();
      document.removeEventListener('visibilitychange', visibility);
    };
  }, [container, enabled]);
  return { nearby: enabled && nearby, playingAllowed: enabled && visible && pageVisible };
};
