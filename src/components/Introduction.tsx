import { ArrowDownRight } from 'lucide-react';

export const Introduction = () => (
  <section className="introduction section-shell" id="intro" aria-labelledby="intro-title" tabIndex={-1}>
    <div className="intro-topline"><p className="eyebrow">A NOTE BEFORE WE GO</p><span className="tiny-mark" aria-hidden="true">✳</span></div>
    <div className="intro-grid">
      <div className="intro-heading"><h2 id="intro-title">Some places<br />ask you to<br /><em>do less.</em></h2><span className="intro-dash" /></div>
      <div className="intro-copy"><p>To put the list away. To follow the path a little longer. To notice how the light moves across a place when you give it time.</p><p>Northline is an imagined escape into that feeling. A small collection of open landscapes, quiet corners, and moments with nothing to prove.</p><a className="text-link" href="#story">Let the landscape lead<ArrowDownRight size={20} /></a></div>
      <figure className="intro-figure"><img src={`${import.meta.env.BASE_URL}images/forest.webp`} alt="A quiet path winding into a green forest" loading="lazy" width="600" height="800" /><figcaption><span>THE ART OF TAKING YOUR TIME</span><span>FIELD NOTE / 01</span></figcaption></figure>
    </div>
    <div className="intro-bottomline"><span>A change of scenery.</span><span>A change of pace.</span></div>
  </section>
);
