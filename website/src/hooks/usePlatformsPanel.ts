import { useEffect, useRef, useState } from 'react';

export function usePlatformsPanel() {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLAnchorElement>(null);

  const close = () => {
    if (!open && !closing) return;
    setOpen(false);
    setClosing(true);
  };

  const toggle = (event: React.MouseEvent) => {
    event.preventDefault();
    if (open || closing) {
      close();
    } else {
      setClosing(false);
      setOpen(true);
    }
  };

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const onAnimationEnd = () => {
      if (closing) setClosing(false);
    };

    panel.addEventListener('animationend', onAnimationEnd);
    return () => panel.removeEventListener('animationend', onAnimationEnd);
  }, [closing]);

  useEffect(() => {
    const onDocumentClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (panelRef.current?.contains(target)) return;
      if (toggleRef.current?.contains(target)) return;
      close();
    };

    document.addEventListener('click', onDocumentClick);
    return () => document.removeEventListener('click', onDocumentClick);
  });

  const panelClassName = ['platforms-panel', open ? 'open' : '', closing ? 'closing' : '']
    .filter(Boolean)
    .join(' ');

  return { open, closing, panelRef, toggleRef, toggle, close, panelClassName };
}
