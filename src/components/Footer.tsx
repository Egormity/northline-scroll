import { ArrowUp, ArrowUpRight } from 'lucide-react';
import { Wordmark } from './Header';

export const Footer = () => (
  <footer className="site-footer section-shell">
    <div className="footer-top"><a href="#home" className="footer-brand" aria-label="Northline home"><Wordmark /></a><a href="#home" className="back-to-top">Back to the beginning<span className="round-arrow"><ArrowUp size={18} /></span></a></div>
    <div className="footer-statement" aria-hidden="true">Stay curious.</div>
    <div className="footer-bottom"><p>An imagined journey.<br className="mobile-break" /> A study in scrolling.</p><div><a href={`${import.meta.env.BASE_URL}media/credits.txt`} target="_blank" rel="noreferrer">Image & film credits<ArrowUpRight size={13} /></a><a href="https://github.com/Egormity/northline-scroll" target="_blank" rel="noreferrer">The source<ArrowUpRight size={13} /></a></div><span>MADE TO BE EXPLORED</span></div>
  </footer>
);
