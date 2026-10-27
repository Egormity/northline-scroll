import { useCallback, useRef } from 'react';
import { ArrowDown, ArrowDownRight } from 'lucide-react';
import { useSceneProgress } from '../motion/useSceneProgress';

export const Hero = () => {
  const section = useRef<HTMLElement>(null);
  const photo = useRef<HTMLImageElement>(null);
  const update = useCallback((progress: number) => {
    photo.current?.style.setProperty('--hero-pan', `${Math.max(-40, Math.min(40, (progress - 0.5) * 100))}px`);
  }, []);
  useSceneProgress(section, update, { mode: 'viewport' });

  return (
    <section className="hero" id="home" ref={section} aria-labelledby="hero-title">
      <div className="hero-media" aria-hidden="true"><img className="hero-image" ref={photo} src={`${import.meta.env.BASE_URL}images/coast.webp`} alt="" fetchPriority="high" /><div className="hero-shade" /></div>
      <div className="hero-content">
        <p className="eyebrow hero-eyebrow"><span className="small-star">✳</span>A FIELD JOURNAL FROM THE QUIETER SIDE</p>
        <h1 id="hero-title">A little<br /><span>further.</span></h1>
        <div className="hero-introduction"><span className="fine-rule" /><p>Away from the everyday.<br />Closer to what matters.</p></div>
      </div>
      <div className="hero-side-note" aria-hidden="true">FRESH AIR. OPEN ENDS.</div>
      <div className="hero-bottom">
        <a className="journey-link" href="#story"><span className="round-arrow"><ArrowDown size={21} strokeWidth={1.4} /></span><span>Begin the journey<small>There is no hurry.</small></span></a>
        <div className="hero-edition"><span>THE NORTHLINE JOURNAL</span><p>A few moments worth<br />taking the long way for.</p><ArrowDownRight size={24} strokeWidth={1} /></div>
      </div>
    </section>
  );
};
