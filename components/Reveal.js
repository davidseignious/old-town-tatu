import { useEffect, useRef, useState } from 'react';

// Fades/slides children into view the first time they cross into the
// viewport. Deliberately subtle and one-shot (no scroll-jank, no re-trigger).
export default function Reveal({ children, className = '', delay = 0 }) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

  useEffect(() => {
        const node = ref.current;
        if (!node) return;
        const observer = new IntersectionObserver(
                (entries) => {
                          entries.forEach((entry) => {
                                      if (entry.isIntersecting) {
                                                    setVisible(true);
                                                    observer.unobserve(node);
                                      }
                          });
                },
          { threshold: 0.15 }
              );
        observer.observe(node);
        return () => observer.disconnect();
  }, []);

  return (
        <div
        ref={ref}
        className={`reveal ${visible ? 'in-view' : ''} ${className}`}
      style={{ transitionDelay: visible ? `${delay}ms` : '0ms' }}
    >
{children}
</div>
  );
}
