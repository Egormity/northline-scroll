import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import { useMotion } from '../motion/MotionProvider';
import { useMediaQuery } from '../motion/useMediaQuery';
import { useSceneProgress } from '../motion/useSceneProgress';
import { GalleryDialog } from '../motion/GalleryDialog';
import { galleryImages } from '../motion/galleryData';
import '../styles/chapters.css';
import '../styles/expedition.css';

export const Gallery = () => {
  const track = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const cardCenters = useRef<number[]>([]);
  const viewportWidth = useRef(0);
  const [distance, setDistance] = useState(0);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const [opened, setOpened] = useState<number | null>(null);
  const { reducedMotion, scrollTo } = useMotion();
  const desktop = useMediaQuery('(min-width: 761px)');
  const enhanced = desktop && !reducedMotion;
  const selectActive = useCallback((index: number) => {
    if (activeRef.current === index) return;
    activeRef.current = index;
    setActive(index);
  }, []);

  useLayoutEffect(() => {
    const element = track.current!;
    const view = viewport.current!;
    const row = rail.current!;
    const measure = () => {
      const travel = enhanced ? Math.max(0, row.scrollWidth - view.clientWidth) : 0;
      viewportWidth.current = view.clientWidth;
      cardCenters.current = Array.from(row.children, (child) => {
        const card = child as HTMLElement;
        return card.offsetLeft + card.offsetWidth / 2;
      });
      setDistance(travel);
      if (travel > 0) element.style.height = `${stage.current!.offsetHeight + travel}px`;
      else element.style.removeProperty('height');
      if (!enhanced) { row.style.transform = ''; view.scrollLeft = 0; }
    };
    const observer = new ResizeObserver(measure);
    observer.observe(view);
    observer.observe(row);
    window.addEventListener('resize', measure);
    measure();
    return () => { observer.disconnect(); window.removeEventListener('resize', measure); element.style.removeProperty('height'); };
  }, [enhanced]);

  useSceneProgress(track, (progress) => {
    if (!rail.current || !enhanced) return;
    const offset = progress * distance;
    rail.current.style.transform = `translate3d(${-offset}px,0,0)`;
    Array.from(rail.current.children).forEach((child, index) => {
      const relative = (cardCenters.current[index] - offset - viewportWidth.current / 2) / Math.max(1, viewportWidth.current);
      (child as HTMLElement).style.setProperty('--photo-pan', `${Math.max(-24, Math.min(24, relative * -38))}px`);
    });
    track.current?.style.setProperty('--gallery-progress', String(progress));
    selectActive(Math.round(progress * (galleryImages.length - 1)));
  }, { enabled: enhanced && distance > 0 });

  const goTo = useCallback((index: number, immediate = false) => {
    const card = rail.current?.children[index] as HTMLElement | undefined;
    const view = viewport.current;
    if (!card || !view) return;
    if (enhanced && distance > 0) {
      const offset = Math.max(0, Math.min(distance, card.offsetLeft + card.offsetWidth / 2 - view.clientWidth / 2));
      view.scrollLeft = 0;
      scrollTo(track.current!.getBoundingClientRect().top + window.scrollY + offset, { immediate });
    } else if (!reducedMotion) {
      view.scrollTo({ left: card.offsetLeft, behavior: immediate ? 'instant' : 'smooth' });
    }
    selectActive(index);
  }, [distance, enhanced, reducedMotion, scrollTo, selectActive]);

  return <section id="journal" className={`gallery-track ${enhanced && distance > 0 ? 'is-horizontal' : ''}`} ref={track} aria-labelledby="gallery-heading">
    <div className="gallery-stage" ref={stage} data-stage>
      <div className="gallery-heading"><div><span className="chapter-eyebrow">COLLECT THE MOMENTS</span><h2 id="gallery-heading">Small moments.<br /><em>Wide horizons.</em></h2></div><div className="gallery-intro"><p>A few things worth slowing down for.<br />Open a photograph. Stay a little longer.</p><div className="gallery-navigation"><button type="button" aria-label="Previous journal image" disabled={active === 0} onClick={() => goTo(active - 1)}><ArrowLeft size={18} /></button><button type="button" aria-label="Next journal image" disabled={active === galleryImages.length - 1} onClick={() => goTo(active + 1)}><ArrowRight size={18} /></button></div></div></div>
      <div className="gallery-viewport" ref={viewport} data-lenis-prevent={!enhanced ? '' : undefined} onScroll={() => {
        if (enhanced || !rail.current || !viewport.current) return;
        const current = viewport.current.scrollLeft;
        const cards = Array.from(rail.current.children) as HTMLElement[];
        const nearest = cards.reduce((best, card, index) => Math.abs(card.offsetLeft - current) < Math.abs(cards[best].offsetLeft - current) ? index : best, 0);
        selectActive(nearest);
      }}>
        <div className="gallery-rail" ref={rail}>
          {galleryImages.map((item, index) => <button className="journal-card" type="button" key={item.image} aria-label={`Open photograph: ${item.title}`} onFocus={(event) => { if (event.currentTarget.matches(':focus-visible')) goTo(index, true); }} onClick={() => setOpened(index)}>
            <div className="journal-photo"><img src={`${import.meta.env.BASE_URL}images/${item.image}`} alt={item.alt} loading="lazy" width="1600" height="1100" /><span className="journal-photo-number" aria-hidden="true">0{index + 1}</span><span className="journal-photo-action"><ArrowUpRight size={23} /></span><span className="journal-photo-label">{item.label}</span></div>
            <div className="journal-caption"><h3>{item.title}</h3><span>{item.text}</span></div>
          </button>)}
        </div>
      </div>
      <div className="gallery-footnote"><span>LANDSCAPES FOR A LITTLE DAYDREAMING</span><span className="gallery-position" aria-hidden="true">{galleryImages.map((_item, index) => <i className={active === index ? 'is-active' : ''} key={index} />)}</span><span>THE NORTHLINE JOURNAL</span></div>
      <div className="gallery-travel" aria-hidden="true"><i /></div>
    </div>
    {opened !== null && <GalleryDialog index={opened} onChange={setOpened} onClose={() => setOpened(null)} />}
  </section>;
};
