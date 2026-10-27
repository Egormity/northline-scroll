import { ArrowDownRight } from 'lucide-react';
import '../styles/chapter-index.css';

const chapters = [
  { id: 'a-little-room', title: 'A little room' },
  { id: 'the-route', title: 'The route' },
  { id: 'open-water', title: 'Open water' },
  { id: 'under-the-canopy', title: 'Under the canopy' },
];

export const ChapterIndex = () => (
  <nav className="chapter-index section-shell" aria-label="Explore the chapters">
    {chapters.map((chapter, index) => (
      <a key={chapter.id} href={`#${chapter.id}`}>
        <span>0{index + 1}</span>
        <span>{chapter.title}</span>
        <ArrowDownRight size={16} aria-hidden="true" />
      </a>
    ))}
  </nav>
);
