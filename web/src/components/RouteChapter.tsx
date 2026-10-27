import { useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useMediaQuery } from '../motion/useMediaQuery';
import { useMotion } from '../motion/MotionProvider';
import { useSceneProgress } from '../motion/useSceneProgress';
import { clamp01 } from '../motion/math';
import { routePath, routeStops } from './routeData';
import '../styles/route.css';

export const RouteChapter = () => {
  const track = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const { reducedMotion, scrollTo } = useMotion();
  const enhanced = useMediaQuery('(min-width: 761px)') && !reducedMotion;
  useSceneProgress(
    track,
    (progress) => {
      const reveal = enhanced ? clamp01(progress * 1.2) : 1;
      track.current?.style.setProperty('--route-offset', String(1 - reveal));
      const next = Math.min(routeStops.length - 1, Math.floor(progress * routeStops.length));
      if (next !== activeRef.current) {
        activeRef.current = next;
        setActive(next);
      }
    },
    { enabled: enhanced },
  );

  const selectStop = (index: number) => {
    const element = track.current;
    if (!element || !enhanced) return;
    const stage = element.querySelector<HTMLElement>('[data-stage]')!;
    const travel = element.offsetHeight - stage.offsetHeight;
    scrollTo(
      window.scrollY +
        element.getBoundingClientRect().top +
        travel * ((index + 0.45) / routeStops.length),
    );
  };

  return (
    <section
      id="the-route"
      ref={track}
      className={`route-chapter ${enhanced ? 'is-tracing' : ''}`}
      aria-labelledby="route-heading"
    >
      <div className="route-stage section-shell" data-stage>
        <div className="route-heading">
          <span className="eyebrow">02 / A LINE WORTH FOLLOWING</span>
          <h2 id="route-heading">
            Not every route
            <br />
            needs a <em>destination.</em>
          </h2>
          <p>
            A coast. A forest. A place to sit.
            <br />A small map for a bigger daydream.
          </p>
        </div>
        <div className="route-map" aria-hidden="true">
          <svg viewBox="0 0 800 450" fill="none">
            <defs>
              <pattern id="map-dots" width="24" height="24" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="currentColor" opacity=".18" />
              </pattern>
            </defs>
            <rect width="800" height="450" fill="url(#map-dots)" />
            {[0, 1, 2, 3, 4].map((line) => (
              <path
                key={line}
                transform={`translate(${line * 18} ${line * -13})`}
                d="M-60 340 C40 230 140 440 230 305 S320 30 440 130 S600 370 710 160 S850 70 920 170"
                className="contour-line"
              />
            ))}
            <path d={routePath} className="route-base" />
            <path d={routePath} pathLength="1" className="route-line" />
            {routeStops.map((stop, index) => (
              <g
                key={stop.title}
                className={active === index ? 'map-stop is-current' : 'map-stop'}
                transform={`translate(${stop.x} ${stop.y})`}
              >
                <circle r="18" className="map-stop-halo" />
                <circle r="5" />
                <text y="-29" textAnchor="middle">
                  0{index + 1}
                </text>
              </g>
            ))}
            <g className="map-compass" transform="translate(720 355)">
              <path d="M0 -27 L7 0 L0 27 L-7 0 Z" />
              <text y="-38" textAnchor="middle">
                N
              </text>
            </g>
            <text x="42" y="405" className="map-caption">
              AN IMAGINED PATH / NOT FOR NAVIGATION
            </text>
          </svg>
        </div>
        <ol className="route-stops">
          {routeStops.map((stop, index) => (
            <li key={stop.title} className={active === index ? 'is-current' : ''}>
              <div className="route-stop-label">
                <span>0{index + 1}</span>
                <span>{stop.time}</span>
              </div>
              <h3>
                {enhanced ? (
                  <button
                    type="button"
                    onClick={() => selectStop(index)}
                    aria-current={active === index ? 'step' : undefined}
                  >
                    {stop.title}
                    <ArrowUpRight size={18} />
                  </button>
                ) : (
                  stop.title
                )}
              </h3>
              <p>{stop.detail}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};
