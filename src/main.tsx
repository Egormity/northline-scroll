import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { MotionProvider } from './motion/MotionProvider';
import './styles/index.css';

createRoot(document.getElementById('root')!).render(<StrictMode><MotionProvider><App /></MotionProvider></StrictMode>);
