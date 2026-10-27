import { useRef, useState, type CSSProperties } from 'react';
import { ArrowLeft, ArrowRight, Compass } from 'lucide-react';
import { useMotion } from '../motion/MotionProvider';
import { useMediaQuery } from '../motion/useMediaQuery';
import { useSceneProgress } from '../motion/useSceneProgress';
import { fieldNotes } from './fieldNotesData';
import '../styles/note-deck.css';

export const FieldNoteDeck = () => {
  const deck = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState(0);
  const { reducedMotion } = useMotion();
  const pointer = useMediaQuery('(min-width: 761px) and (hover: hover) and (pointer: fine)');
  const enhanced = pointer && !reducedMotion;

  useSceneProgress(deck, (progress) => {
    deck.current?.style.setProperty('--deck-rise', enhanced ? `${(0.5 - progress) * 80}px` : '0px');
    deck.current?.style.setProperty('--deck-turn', enhanced ? `${(0.5 - progress) * 12}deg` : '0deg');
  }, { mode: 'viewport', enabled: enhanced });

  const turn = (direction: number) => setSelected((value) => (value + direction + fieldNotes.length) % fieldNotes.length);
  const resetTilt = () => {
    deck.current?.style.setProperty('--tilt-x', '0deg');
    deck.current?.style.setProperty('--tilt-y', '0deg');
  };

  return <div className={`note-deck ${enhanced ? 'is-responsive' : ''}`} ref={deck}
    onPointerMove={(event) => {
      if (!enhanced || event.pointerType !== 'mouse') return;
      const bounds = event.currentTarget.getBoundingClientRect();
      event.currentTarget.style.setProperty('--tilt-x', `${(0.5 - (event.clientY - bounds.top) / bounds.height) * 7}deg`);
      event.currentTarget.style.setProperty('--tilt-y', `${((event.clientX - bounds.left) / bounds.width - 0.5) * 9}deg`);
    }} onPointerLeave={resetTilt}>
    <div className="note-deck-stage" aria-label="A preview of the downloadable field notes">
      {fieldNotes.map((note, index) => {
        const depth = (index - selected + fieldNotes.length) % fieldNotes.length;
        return <article key={note.title} className="field-note-card deck-card" data-depth={depth}
          aria-hidden={depth !== 0} style={{ '--depth': depth } as CSSProperties}>
          <div className="note-card-top"><span>NORTHLINE / NOTES TO TAKE</span><Compass size={25} strokeWidth={1} /></div>
          <span className="note-card-number">0{index + 1}</span>
          <h3>{note.firstLine}<br /><em>{note.secondLine}</em></h3>
          <p>{note.lines.map((line) => <span key={line}>{line}<br /></span>)}</p>
          <div className="note-card-bottom"><span>{note.signoff}</span><span>↗</span></div>
        </article>;
      })}
    </div>
    <div className="note-deck-controls">
      <button type="button" onClick={() => turn(-1)} aria-label="Previous field note"><ArrowLeft size={17} /></button>
      <span aria-hidden="true">0{selected + 1} <span>/ 03</span><small>TURN A LITTLE THOUGHT OVER</small></span>
      <button type="button" onClick={() => turn(1)} aria-label="Next field note"><ArrowRight size={17} /></button>
    </div>
    <span className="sr-only" role="status">Field note {selected + 1} of {fieldNotes.length}: {fieldNotes[selected].title}</span>
  </div>;
};
