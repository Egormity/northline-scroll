import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUpRight, RotateCcw } from 'lucide-react';
import { useMotion } from '../motion/MotionProvider';
import { useMediaQuery } from '../motion/useMediaQuery';
import { useSceneProgress } from '../motion/useSceneProgress';
import { useVideoScrub } from '../motion/useVideoScrub';
import { beatOpacity, clamp01 } from '../motion/math';
import '../styles/chapters.css';
import '../styles/expedition.css';

const beats = [
  { label: 'A CHANGE OF PERSPECTIVE', title: 'Find the edge.', text: 'Where the land runs out, the day opens up. Stay a while. There is no next thing to get to.' },
  { label: 'ROOM TO WANDER', title: 'Take the long way.', text: 'Follow the water. Notice what changes and what stays. The best part rarely needs a destination.' },
  { label: 'SOMETHING TO TAKE HOME', title: 'Leave a little room.', text: 'For another path. Another quiet morning. A way of seeing you can carry back with you.' },
];

export const Journey = () => {
  const track = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const { reducedMotion, scrollTo } = useMotion();
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);
  const desktop = useMediaQuery('(min-width: 761px)');
  const enhanced = desktop && !reducedMotion;
  const [approached, setApproached] = useState(false);
  const { setProgress, ready, failed, retry } = useVideoScrub(video, enhanced && approached);

  useEffect(() => {
    if (!enhanced || !track.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setApproached(true); observer.disconnect(); }
    }, { rootMargin: '700px' });
    observer.observe(track.current);
    return () => observer.disconnect();
  }, [enhanced]);

  useSceneProgress(track, (progress) => {
    setProgress(progress);
    const element = track.current;
    if (!element) return;
    element.style.setProperty('--film-progress', String(progress));
    const opening = clamp01(progress / 0.24);
    element.style.setProperty('--film-inset', `${(1 - opening) * 4.5}%`);
    element.style.setProperty('--film-radius', `${(1 - opening) * 32}px`);
    element.style.setProperty('--film-scale', String(1.08 - progress * 0.08));
    beats.forEach((_beat, index) => {
      const local = progress * beats.length - index;
      const opacity = beatOpacity(progress, index, beats.length);
      const direction = local > 0.5 ? -1 : 1;
      element.style.setProperty(`--beat-${index}`, String(opacity));
      element.style.setProperty(`--beat-shift-${index}`, `${(1 - opacity) * direction * 46}px`);
    });
    const next = Math.min(beats.length - 1, Math.floor(progress * beats.length));
    if (next !== activeRef.current) {
      activeRef.current = next;
      setActive(next);
    }
  }, { enabled: enhanced });

  const goToBeat = (index: number) => {
    const element = track.current;
    if (!element || !enhanced) return;
    const stage = element.querySelector<HTMLElement>('[data-stage]');
    const travel = element.offsetHeight - (stage?.offsetHeight ?? window.innerHeight);
    scrollTo(element.getBoundingClientRect().top + window.scrollY + travel * ((index + 0.45) / beats.length));
  };

  return <section id="story" ref={track} className={`journey-track ${enhanced ? 'is-cinematic' : 'is-still'}`} aria-labelledby="journey-heading">
    <div className="journey-stage" data-stage>
      <div className="journey-media" aria-hidden="true">
        <img className="journey-poster" src={`${import.meta.env.BASE_URL}images/journey-poster.jpg`} alt="" width="1280" height="720" loading="lazy" />
        {enhanced && approached && <video ref={video} className={ready && !failed ? 'is-ready' : ''} src={`${import.meta.env.BASE_URL}media/journey.mp4`} poster={`${import.meta.env.BASE_URL}images/journey-poster.jpg`} muted playsInline preload="auto" disablePictureInPicture tabIndex={-1} />}
        <div className="journey-scrim" />
      </div>
      <div className="journey-kicker"><span>THE MOVING LANDSCAPE</span><span>A MOMENT, AT YOUR PACE</span></div>
      <div className="journey-accessible">
        <h2 id="journey-heading">One landscape. A slower pace.</h2>
        {beats.map((beat) => <article key={beat.title}><span>{beat.label}</span><h3>{beat.title}</h3><p>{beat.text}</p></article>)}
      </div>
      <div className="journey-visual-copy" aria-hidden="true">
        {beats.map((beat, index) => <div className={`journey-beat beat-${index}`} key={beat.title}><span>{beat.label}</span><h3>{beat.title}</h3><p>{beat.text}</p></div>)}
      </div>
      {enhanced && <>
        <div className="journey-chapter-number" aria-hidden="true">
          {beats.map((_beat, index) => <span className={`beat-${index}`} key={index}>0{index + 1}</span>)}
        </div>
        <nav className="journey-chapters" aria-label="Landscape chapters">
          {beats.map((beat, index) => <button key={beat.title} type="button" aria-label={`Go to chapter ${index + 1}: ${beat.title}`} aria-current={active === index ? 'step' : undefined} onClick={() => goToBeat(index)}><span>0{index + 1}</span><span>{beat.title}</span><i aria-hidden="true" /></button>)}
        </nav>
      </>}
      <div className="journey-bottom">
        <span className="journey-cue"><ArrowDown size={15} />{enhanced ? 'The story follows your scroll' : 'A quieter view of the journey'}</span>
        <a href={`${import.meta.env.BASE_URL}media/credits.txt`} target="_blank" rel="noreferrer">Film credits<ArrowUpRight size={14} /></a>
      </div>
      {failed && <div className="film-fallback" role="status">The still view is ready. <button type="button" onClick={retry}><RotateCcw size={12} />Retry the film</button></div>}
      <div className="journey-timeline" aria-hidden="true"><i /></div>
    </div>
  </section>;
};
