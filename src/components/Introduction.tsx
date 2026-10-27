import { ArrowDownRight } from 'lucide-react';
import { useRef } from 'react';
import { useMotion } from '../motion/MotionProvider';
import { useMediaQuery } from '../motion/useMediaQuery';
import { useSceneProgress } from '../motion/useSceneProgress';
import { clamp01 } from '../motion/math';
import '../styles/arrival.css';

export const Introduction = () => {
  const section = useRef<HTMLElement>(null);
  const { reducedMotion } = useMotion();
  const desktop = useMediaQuery('(min-width: 761px)');
  const enhanced = desktop && !reducedMotion;
  useSceneProgress(
    section,
    (progress) => {
      const element = section.current;
      if (!element) return;
      const reveal = (offset: number) => clamp01((progress - offset) / 0.25);
      element.style.setProperty('--intro-line-one', reveal(0.03).toFixed(5));
      element.style.setProperty('--intro-line-two', reveal(0.07).toFixed(5));
      element.style.setProperty('--intro-line-three', reveal(0.11).toFixed(5));
      element.style.setProperty('--intro-image-reveal', reveal(0.02).toFixed(5));
      element.style.setProperty('--intro-copy-reveal', reveal(0.08).toFixed(5));
      element.style.setProperty('--intro-image-pan', `${(progress - 0.5) * 60}px`);
    },
    { mode: 'viewport', enabled: enhanced },
  );

  return (
    <section
      className={`introduction section-shell ${enhanced ? 'intro-motion' : ''}`}
      ref={section}
      id="intro"
      aria-labelledby="intro-title"
      tabIndex={-1}
    >
      <div className="intro-topline">
        <p className="eyebrow">A NOTE BEFORE WE GO</p>
        <span className="tiny-mark" aria-hidden="true">
          ✳
        </span>
      </div>
      <div className="intro-grid">
        <div className="intro-heading">
          <h2 id="intro-title">
            <span className="intro-title-line line-one">Some places</span>
            <span className="intro-title-line line-two">ask you to</span>
            <em className="intro-title-line line-three">do less.</em>
          </h2>
          <span className="intro-dash" />
        </div>
        <div className="intro-copy">
          <p>
            To put the list away. To follow the path a little longer. To notice how the light moves
            across a place when you give it time.
          </p>
          <p>
            Northline is an imagined escape into that feeling. A small collection of open
            landscapes, quiet corners, and moments with nothing to prove.
          </p>
          <a className="text-link" href="#story">
            Let the landscape lead
            <ArrowDownRight size={20} />
          </a>
        </div>
        <figure className="intro-figure">
          <div className="intro-photo-window">
            <img
              src={`${import.meta.env.BASE_URL}images/forest.webp`}
              alt="A quiet path winding into a green forest"
              loading="lazy"
              width="600"
              height="800"
            />
            <span className="intro-photo-corner" aria-hidden="true">
              01 /<br />
              GET LOST A LITTLE.
            </span>
          </div>
          <figcaption>
            <span>THE ART OF TAKING YOUR TIME</span>
            <span>FIELD NOTE / 01</span>
          </figcaption>
        </figure>
      </div>
      <div className="intro-bottomline">
        <span>A change of scenery.</span>
        <span>A change of pace.</span>
      </div>
    </section>
  );
};
