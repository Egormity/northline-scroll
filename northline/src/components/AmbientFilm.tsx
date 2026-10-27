import { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { useMotion } from '../motion/MotionProvider';
import { useMediaQuery } from '../motion/useMediaQuery';
import { useFilmVisibility } from '../motion/useFilmVisibility';
import '../styles/films.css';

interface Props {
  name: string;
  source: string;
  poster: string;
  fallback: string;
  description: string;
}

export const AmbientFilm = ({ name, source, poster, fallback, description }: Props) => {
  const container = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const { reducedMotion } = useMotion();
  const desktop = useMediaQuery('(min-width: 761px)');
  const { nearby, playingAllowed } = useFilmVisibility(container, desktop && !reducedMotion);
  const [paused, setPaused] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const element = video.current;
    if (!element) return;
    let current = true;
    if (playingAllowed && !paused && !failed) {
      void element
        .play()
        .then(() => {
          if (!current) element.pause();
        })
        .catch(() => {
          if (current) setPaused(true);
        });
    } else element.pause();
    return () => {
      current = false;
      element.pause();
    };
  }, [playingAllowed, paused, nearby, failed]);

  useEffect(() => {
    if (!nearby) setReady(false);
  }, [nearby]);

  return (
    <div ref={container} className={`ambient-film ${playing ? 'is-playing' : ''}`} data-film={name}>
      <img
        src={`${import.meta.env.BASE_URL}${poster}`}
        alt={description}
        width="1280"
        height="704"
        loading="lazy"
        onError={(event) => {
          const image = event.currentTarget;
          if (!image.dataset.fallback) {
            image.dataset.fallback = 'true';
            image.src = `${import.meta.env.BASE_URL}${fallback}`;
          }
        }}
      />
      {nearby && !failed && (
        <video
          ref={video}
          src={`${import.meta.env.BASE_URL}${source}`}
          muted
          playsInline
          loop
          preload="metadata"
          className={ready ? 'is-ready' : ''}
          aria-hidden="true"
          tabIndex={-1}
          disablePictureInPicture
          onLoadedData={() => setReady(true)}
          onPlaying={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onError={() => {
            setFailed(true);
            setPlaying(false);
          }}
        />
      )}
      {nearby && !failed && (
        <button
          className="film-control"
          type="button"
          onClick={() => setPaused(!paused)}
          aria-label={`${paused ? 'Play' : 'Pause'} ${name} film`}
        >
          {paused ? <Play size={14} /> : <Pause size={14} />}
          <span>{paused ? 'Play film' : 'Pause film'}</span>
        </button>
      )}
      {failed && <span className="film-still-label">A still moment</span>}
    </div>
  );
};
