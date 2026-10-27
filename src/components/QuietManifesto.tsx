import { useRef } from 'react';
import { useSceneProgress } from '../motion/useSceneProgress';
import { useMediaQuery } from '../motion/useMediaQuery';
import { clamp01 } from '../motion/math';
import '../styles/manifesto.css';

const words = [
  'Less',
  'noise.',
  'More',
  'sky.',
  'A',
  'little',
  'room',
  'to',
  'feel',
  'far',
  'away.',
];

export const QuietManifesto = () => {
  const section = useRef<HTMLElement>(null);
  const desktop = useMediaQuery('(min-width: 761px)');
  useSceneProgress(
    section,
    (progress) => {
      section.current?.querySelectorAll<HTMLElement>('[data-word]').forEach((word, index) => {
        const reveal = clamp01((progress - 0.16) * 2.4 * words.length - index);
        word.style.setProperty('--word-reveal', String(reveal));
      });
      section.current?.style.setProperty('--line-travel', `${(progress - 0.5) * -110}px`);
    },
    { mode: 'viewport', enabled: desktop },
  );

  return (
    <section
      id="a-little-room"
      ref={section}
      className="quiet-manifesto section-shell"
      aria-labelledby="manifesto-heading"
    >
      <div className="manifesto-topline">
        <span className="eyebrow">01 / A DIFFERENT KIND OF DISTANCE</span>
        <span aria-hidden="true">↗</span>
      </div>
      <h2 id="manifesto-heading">
        <span className="sr-only">{words.join(' ')}</span>
        <span aria-hidden="true">
          {words.map((word, index) => (
            <span data-word key={`${word}-${index}`}>
              {word}{' '}
            </span>
          ))}
        </span>
      </h2>
      <div className="manifesto-bottom">
        <p>
          There is a place between leaving and arriving.
          <br />
          Give yourself permission to stay there.
        </p>
        <span className="manifesto-rule" aria-hidden="true" />
        <span className="eyebrow">TAKE NOTHING BUT A MOMENT</span>
      </div>
      <div className="manifesto-watermark" aria-hidden="true">
        OUT OF OFFICE · INTO THE OPEN ·
      </div>
    </section>
  );
};
