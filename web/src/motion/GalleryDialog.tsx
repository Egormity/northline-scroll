import { useEffect, useRef } from 'react';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import { useMotion } from './MotionProvider';
import { galleryImages } from './galleryData';

interface Props {
  index: number;
  onChange: (index: number) => void;
  onClose: () => void;
}

export const GalleryDialog = ({ index, onChange, onClose }: Props) => {
  const ref = useRef<HTMLDialogElement>(null);
  const { setScrollLocked } = useMotion();
  const item = galleryImages[index];
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const dialog = ref.current!;
    setScrollLocked(true);
    dialog.showModal();
    return () => {
      dialog.close();
      setScrollLocked(false);
      previous?.focus({ preventScroll: true });
    };
  }, [setScrollLocked]);
  return (
    <dialog
      ref={ref}
      className="gallery-dialog"
      aria-labelledby="photograph-title"
      data-lenis-prevent
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      onKeyDown={(event) => {
        if (event.key === 'ArrowRight') {
          event.preventDefault();
          onChange((index + 1) % galleryImages.length);
        }
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          onChange((index + galleryImages.length - 1) % galleryImages.length);
        }
      }}
    >
      <div className="gallery-dialog-card">
        <button
          className="photograph-close"
          type="button"
          aria-label="Close photograph"
          onClick={onClose}
          autoFocus
        >
          <X size={22} />
        </button>
        <img src={`${import.meta.env.BASE_URL}images/${item.image}`} alt={item.alt} />
        <div className="photograph-caption">
          <div>
            <span>{item.label}</span>
            <h2 id="photograph-title">{item.title}</h2>
            <p>{item.text}</p>
          </div>
          <div className="photograph-arrows">
            <button
              type="button"
              aria-label="Previous photograph"
              onClick={() => onChange((index + galleryImages.length - 1) % galleryImages.length)}
            >
              <ArrowLeft size={19} />
            </button>
            <button
              type="button"
              aria-label="Next photograph"
              onClick={() => onChange((index + 1) % galleryImages.length)}
            >
              <ArrowRight size={19} />
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
};
