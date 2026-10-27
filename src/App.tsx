import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Introduction } from './components/Introduction';
import { Journey } from './components/Journey';
import { Gallery } from './components/Gallery';
import { FieldNotes } from './components/FieldNotes';
import { Footer } from './components/Footer';

export const App = () => (
  <>
    <a className="skip-link" href="#intro">Skip to the journal</a>
    <Header />
    <main>
      <Hero />
      <Introduction />
      <Journey />
      <Gallery />
      <FieldNotes />
    </main>
    <Footer />
  </>
);
