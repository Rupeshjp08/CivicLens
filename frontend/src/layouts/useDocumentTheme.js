import { useEffect } from 'react';

export function useDocumentTheme(theme) {
  useEffect(() => {
    const root = document.documentElement;
    const previous = root.getAttribute('data-theme');
    root.setAttribute('data-theme', theme);

    return () => {
      if (previous) {
        root.setAttribute('data-theme', previous);
      } else {
        root.removeAttribute('data-theme');
      }
    };
  }, [theme]);
}
