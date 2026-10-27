import { useEffect, useState } from 'react';
import { ArrowUpRight, Pause, Waves } from 'lucide-react';
import { useMotion } from '../motion/MotionProvider';
import { ReadingProgress } from './ReadingProgress';

export const Wordmark = () => <span className="wordmark"><svg viewBox="0 0 28 28" fill="none" aria-hidden="true"><path d="M3 23V5L23 23V5M3 5L23 23" stroke="currentColor" strokeWidth="1.5" /><path d="M8 2v24M18 2v24" stroke="currentColor" strokeWidth=".65" opacity=".5" /></svg><span>NORTHLINE<span className="wordmark-dot" aria-hidden="true">•</span></span></span>;

export const Header = () => {
  const [onHero, setOnHero] = useState(true);
  const { reducedMotion, systemReducedMotion, toggleMotion } = useMotion();

  useEffect(() => {
    const hero = document.getElementById('home');
    if (!hero) return;
    const observer = new IntersectionObserver(([entry]) => setOnHero(entry.isIntersecting), { rootMargin: '-76px 0px 0px 0px' });
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return (
    <header className={`site-header ${onHero ? 'on-hero' : 'is-solid'}`}>
      <a className="brand-link" href="#home" aria-label="Northline home"><Wordmark /></a>
      <nav className="main-nav" aria-label="Main navigation">
        <a href="#story">The story</a>
        <a href="#journal">Field journal<ArrowUpRight className="mobile-nav-arrow" size={13} /></a>
        <a href="#field-notes">Notes to take</a>
      </nav>
      <button className="motion-button" type="button" onClick={toggleMotion} disabled={systemReducedMotion} aria-pressed={reducedMotion} aria-label={systemReducedMotion ? 'Reduced motion follows your system preference' : reducedMotion ? 'Enable motion' : 'Reduce motion'} title={systemReducedMotion ? 'Reduced motion follows your system preference' : reducedMotion ? 'Enable the scrolling effects' : 'Use a quieter, reduced-motion layout'}>
        {reducedMotion ? <Pause size={15} /> : <Waves size={17} />}<span>Motion {reducedMotion ? 'off' : 'on'}</span>
      </button>
      <ReadingProgress />
    </header>
  );
};
