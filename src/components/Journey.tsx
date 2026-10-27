import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUpRight, RotateCcw } from 'lucide-react';
import { useMotion } from '../motion/MotionProvider';
import { useMediaQuery } from '../motion/useMediaQuery';
import { useSceneProgress } from '../motion/useSceneProgress';
import { useVideoScrub } from '../motion/useVideoScrub';
import { beatOpacity } from '../motion/math';
import '../styles/chapters.css';

const beats = [
  { label: 'A CHANGE OF PERSPECTIVE', title: 'Find the edge.', text: 'Where the land runs out, the day opens up. Stay a while. There is no next thing to get to.' },
  { label: 'ROOM TO WANDER', title: 'Take the long way.', text: 'Follow the water. Notice what changes and what stays. The best part rarely needs a destination.' },
  { label: 'SOMETHING TO TAKE HOME', title: 'Leave a little room.', text: 'For another path. Another quiet morning. A way of seeing you can carry back with you.' },
];

export const Journey = () => {
  const track = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const { reducedMotion } = useMotion();
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
    beats.forEach((_beat, index) => element.style.setProperty(`--beat-${index}`, String(beatOpacity(progress, index, beats.length))));
  }, { enabled: enhanced });

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
      <div className="journey-bottom">
        <span className="journey-cue"><ArrowDown size={15} />{enhanced ? 'The story follows your scroll' : 'A quieter view of the journey'}</span>
        <a href={`${import.meta.env.BASE_URL}media/credits.txt`} target="_blank" rel="noreferrer">Film credits<ArrowUpRight size={14} /></a>
      </div>
      {failed && <div className="film-fallback" role="status">The still view is ready. <button type="button" onClick={retry}><RotateCcw size={12} />Retry the film</button></div>}
      <div className="journey-timeline" aria-hidden="true"><i /></div>
    </div>
  </section>;
};
