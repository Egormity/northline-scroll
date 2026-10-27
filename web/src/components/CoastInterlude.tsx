import { useRef } from 'react';
import { useSceneProgress } from '../motion/useSceneProgress';
import { useMediaQuery } from '../motion/useMediaQuery';
import { AmbientFilm } from './AmbientFilm';
import '../styles/films.css';

export const CoastInterlude = () => {
  const section = useRef<HTMLElement>(null);
  const desktop = useMediaQuery('(min-width: 761px)');
  useSceneProgress(
    section,
    (progress) => {
      section.current?.style.setProperty('--coast-inset', `${Math.abs(progress - 0.5) * 12}%`);
      section.current?.style.setProperty('--coast-title-x', `${(progress - 0.5) * -160}px`);
    },
    { mode: 'viewport', enabled: desktop },
  );
  return (
    <section
      id="open-water"
      ref={section}
      className="coast-interlude"
      aria-labelledby="coast-heading"
    >
      <div className="coast-caption section-shell">
        <span className="eyebrow">03 / THE SPACE BETWEEN</span>
        <span className="eyebrow">NO SIGNAL. EVERY SENSE.</span>
      </div>
      <div className="coast-frame">
        <AmbientFilm
          name="coast"
          source="media/coast-flight.mp4"
          poster="images/coast-flight-poster.jpg"
          fallback="images/coast.webp"
          description="A quiet northern coastline, open water and rugged cliffs."
        />
        <div className="coast-shade" aria-hidden="true" />
        <h2 id="coast-heading">
          Let the world
          <br />
          <em>get a little wider.</em>
        </h2>
      </div>
      <div className="coast-afterword section-shell">
        <span>THE HORIZON DOESN'T HAVE A DEADLINE.</span>
        <p>
          Watch the water move. Or keep moving with it.
          <br />
          For once, either is the right answer.
        </p>
      </div>
    </section>
  );
};
