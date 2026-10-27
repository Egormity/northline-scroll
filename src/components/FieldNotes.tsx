import { ArrowDownToLine, Check, Compass, Wind } from 'lucide-react';
import { useEffect, useState } from 'react';

const fieldGuide = `NORTHLINE — NOTES TO TAKE\nA fictional field journal for a quieter day\n\n01 / FIND THE EDGE\nLeave a little space in the day. Look for a familiar place you can see with fresh eyes.\n\n02 / TAKE THE LONG WAY\nLet curiosity set the pace. Notice a texture, a sound, or a change in the light.\n\n03 / LEAVE A LITTLE ROOM\nFind a comfortable place to pause. Keep one small memory instead of a full itinerary.\n\nA PAGE FOR YOUR OWN NOTES\nA place I would like to return to:\n\nA small thing I noticed:\n\nSomething I can leave behind for a while:\n\nAbout this journal\nNorthline is an imagined journey and an interactive website design study. Its scenery and narrative are illustrative, not a real route or destination guide.\n\nWebsite source: https://github.com/Egormity/northline-scroll\n`;

export const FieldNotes = () => {
  const [downloaded, setDownloaded] = useState(false);
  useEffect(() => {
    if (!downloaded) return;
    const timeout = window.setTimeout(() => setDownloaded(false), 4500);
    return () => window.clearTimeout(timeout);
  }, [downloaded]);

  const download = () => {
    const url = URL.createObjectURL(new Blob([fieldGuide], { type: 'text/plain;charset=utf-8' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'northline-field-notes.txt';
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setDownloaded(true);
  };

  return (
    <section className="field-notes section-shell" id="field-notes" aria-labelledby="notes-title" tabIndex={-1}>
      <div className="notes-topline"><p className="eyebrow">A LITTLE SOMETHING TO TAKE WITH YOU</p><Wind size={25} strokeWidth={1} aria-hidden="true" /></div>
      <div className="notes-layout">
        <div className="notes-copy"><h2 id="notes-title">Less itinerary.<br /><em>More possibility.</em></h2><p>A few thoughts for your next quiet moment.<br />Save them, make them your own, leave room for the unexpected.</p><button className="download-button" type="button" onClick={download}>{downloaded ? <Check size={17} /> : <ArrowDownToLine size={17} />}<span>Download the field notes</span><span className="download-format">TXT</span></button><span className="download-status" role="status">{downloaded ? 'Your field notes are ready to keep.' : 'A small note. No sign-up. Yours to keep.'}</span></div>
        <div className="field-note-card" aria-label="A preview of the downloadable field notes"><div className="note-card-top"><span>NORTHLINE / NOTES TO TAKE</span><Compass size={25} strokeWidth={1} /></div><span className="note-card-number">03</span><h3>Leave a<br /><em>little room.</em></h3><p>For a slower morning.<br />For a different way home.<br />For nothing in particular.</p><div className="note-card-bottom"><span>KEEP THIS FEELING.</span><span>↗</span></div></div>
      </div>
    </section>
  );
};
