import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Introduction } from './components/Introduction';
import { Journey } from './components/Journey';
import { Gallery } from './components/Gallery';
import { FieldNotes } from './components/FieldNotes';
import { Footer } from './components/Footer';
import { QuietManifesto } from './components/QuietManifesto';
import { RouteChapter } from './components/RouteChapter';
import { CoastInterlude } from './components/CoastInterlude';
import { ForestChapter } from './components/ForestChapter';
import { ChapterIndex } from './components/ChapterIndex';

export const App = () => (
  <>
    <a className="skip-link" href="#intro">
      Skip to the journal
    </a>
    <Header />
    <main>
      <Hero />
      <Introduction />
      <ChapterIndex />
      <QuietManifesto />
      <Journey />
      <RouteChapter />
      <CoastInterlude />
      <Gallery />
      <ForestChapter />
      <FieldNotes />
    </main>
    <Footer />
  </>
);
