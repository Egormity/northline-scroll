import { useLayoutEffect, useRef } from 'react';
import '../styles/reading-progress.css';

export const ReadingProgress = () => {
  const line = useRef<HTMLSpanElement>(null);
  useLayoutEffect(() => {
    let frame = 0;
    let travel = 1;
    const update = () => {
      frame = 0;
      line.current?.style.setProperty(
        '--reading-progress',
        String(Math.max(0, Math.min(1, window.scrollY / travel))),
      );
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const measure = () => {
      travel = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      schedule();
    };
    const observer = new ResizeObserver(measure);
    observer.observe(document.body);
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', schedule, { passive: true });
    measure();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', schedule);
    };
  }, []);
  return (
    <span className="reading-progress" aria-hidden="true">
      <span ref={line} />
    </span>
  );
};
