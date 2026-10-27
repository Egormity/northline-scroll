import { useRef } from 'react';
import { useMotion } from '../motion/MotionProvider';
import { useMediaQuery } from '../motion/useMediaQuery';
import { useSceneProgress } from '../motion/useSceneProgress';
import { clamp01 } from '../motion/math';
import { AmbientFilm } from './AmbientFilm';
import '../styles/forest.css';

const motes = Array.from({ length: 24 }, (_, index) => ({
  x: (index * 41 + 13) % 100,
  y: (index * 29 + 7) % 100,
  size: 2 + (index % 4),
  speed: 0.5 + (index % 5) / 4,
}));

export const ForestChapter = () => {
  const track = useRef<HTMLElement>(null);
  const { reducedMotion } = useMotion();
  const enhanced = useMediaQuery('(min-width: 761px)') && !reducedMotion;
  useSceneProgress(
    track,
    (progress) => {
      const element = track.current;
      if (!element) return;
      if (!enhanced) {
        element.style.setProperty('--forest-radius', '85%');
        element.style.setProperty('--forest-title-shift', '0px');
        element.style.setProperty('--forest-copy-opacity', '1');
        return;
      }
      element.style.setProperty('--forest-radius', `${22 + clamp01(progress * 1.5) * 63}%`);
      element.style.setProperty('--forest-title-shift', `${(1 - progress) * 40}px`);
      element.style.setProperty(
        '--forest-copy-opacity',
        String(0.35 + clamp01(progress * 2) * 0.65),
      );
      element.querySelectorAll<HTMLElement>('.forest-mote').forEach((mote, index) => {
        mote.style.transform = `translate3d(${Math.sin(progress * 3 + index) * 22}px,${-progress * 170 * motes[index].speed}px,0)`;
      });
    },
    { enabled: enhanced },
  );
  return (
    <section
      id="under-the-canopy"
      ref={track}
      className={`forest-chapter ${enhanced ? 'is-unfolding' : ''}`}
      aria-labelledby="forest-heading"
    >
      <div className="forest-stage" data-stage>
        <div className="forest-orbit forest-orbit-outer" aria-hidden="true" />
        <div className="forest-orbit forest-orbit-inner" aria-hidden="true" />
        <div className="forest-window">
          <AmbientFilm
            name="forest"
            source="media/forest-light.mp4"
            poster="images/forest-light-poster.jpg"
            fallback="images/forest.webp"
            description="Soft light falling through a misty green forest."
          />
          <div className="forest-shade" aria-hidden="true" />
        </div>
        {enhanced && (
          <div className="forest-motes" aria-hidden="true">
            {motes.map((mote, index) => (
              <i
                key={index}
                className="forest-mote"
                style={{
                  left: `${mote.x}%`,
                  top: `${mote.y}%`,
                  width: mote.size,
                  height: mote.size,
                }}
              />
            ))}
          </div>
        )}
        <div className="forest-copy">
          <span className="eyebrow">04 / UNDER THE CANOPY</span>
          <h2 id="forest-heading">
            A quieter
            <br />
            <em>kind of wonder.</em>
          </h2>
          <p>
            The further in you go, the less you need.
            <br />A little light. A little air. The way ahead.
          </p>
        </div>
        <div className="forest-bottom">
          <span>LOOK CLOSER.</span>
          <span>THERE IS ALWAYS MORE TO NOTICE.</span>
        </div>
      </div>
    </section>
  );
};
