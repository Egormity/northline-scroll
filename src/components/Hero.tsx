import { useCallback, useRef } from 'react';
import { ArrowDown, ArrowDownRight } from 'lucide-react';
import { useSceneProgress } from '../motion/useSceneProgress';
import { useMotion } from '../motion/MotionProvider';
import { useMediaQuery } from '../motion/useMediaQuery';
import { clamp01 } from '../motion/math';
import '../styles/arrival.css';

export const Hero = () => {
  const section = useRef<HTMLElement>(null);
  const { reducedMotion } = useMotion();
  const desktop = useMediaQuery('(min-width: 761px)');
  const enhanced = desktop && !reducedMotion;
  const update = useCallback((progress: number) => {
    const element = section.current;
    if (!element) return;
    const start = window.innerHeight / (element.offsetHeight + window.innerHeight);
    const departure = clamp01((progress - start) / (1 - start));
    element.style.setProperty('--hero-departure', departure.toFixed(5));
  }, []);
  useSceneProgress(section, update, { mode: 'viewport', enabled: enhanced });

  return (
    <section
      className={`hero ${enhanced ? 'hero-motion' : ''}`}
      id="home"
      ref={section}
      aria-labelledby="hero-title"
    >
      <div className="hero-media" aria-hidden="true">
        <img
          className="hero-image"
          src={`${import.meta.env.BASE_URL}images/coast.webp`}
          alt=""
          fetchPriority="high"
        />
        <div className="hero-shade" />
      </div>
      <div className="hero-content">
        <p className="eyebrow hero-eyebrow">
          <span className="small-star">✳</span>A FIELD JOURNAL FROM THE QUIETER SIDE
        </p>
        <h1 id="hero-title">
          <span className="hero-title-line">A little</span>
          <span className="hero-title-line hero-title-emphasis">further.</span>
        </h1>
        <div className="hero-introduction">
          <span className="fine-rule" />
          <p>
            Away from the everyday.
            <br />
            Closer to what matters.
          </p>
        </div>
      </div>
      <div className="hero-side-note" aria-hidden="true">
        FRESH AIR. OPEN ENDS.
      </div>
      <div className="hero-compass" aria-hidden="true">
        <span className="compass-north">N</span>
        <svg className="compass-dial" viewBox="0 0 144 144" fill="none">
          <circle cx="72" cy="72" r="62" />
          <circle cx="72" cy="72" r="51" strokeDasharray="1 8" />
          <path d="M72 4v15M72 125v15M4 72h15M125 72h15M24 24l9 9M111 111l9 9M24 120l9-9M111 33l9-9" />
          <path className="compass-needle" d="m72 34 10 38-10 38-10-38Z" />
          <circle cx="72" cy="72" r="3" />
        </svg>
        <span className="compass-caption">FOLLOW YOUR CURIOSITY</span>
      </div>
      <div className="hero-bottom">
        <a className="journey-link" href="#story">
          <span className="round-arrow">
            <ArrowDown size={21} strokeWidth={1.4} />
          </span>
          <span>
            Begin the journey<small>There is no hurry.</small>
          </span>
        </a>
        <div className="hero-edition">
          <span>THE NORTHLINE JOURNAL</span>
          <p>
            A few moments worth
            <br />
            taking the long way for.
          </p>
          <ArrowDownRight size={24} strokeWidth={1} />
        </div>
      </div>
    </section>
  );
};
