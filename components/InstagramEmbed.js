import { useEffect, useRef } from 'react';

// Renders a real, live Instagram post via Meta's official embed widget.
// This is intentional: it shows Tony's actual work with no downloading,
// re-hosting, or stock-photo substitution.
export default function InstagramEmbed({ postId, permalink }) {
    const ref = useRef(null);
  const embedPermalink = permalink || `https://www.instagram.com/p/${postId}/`;

  useEffect(() => {
        const process = () => {
                if (!window.instgrm) return;
                window.instgrm.Embeds.process();
                window.setTimeout(() => window.instgrm?.Embeds?.process(), 350);
        };

                if (window.instgrm) {
                        process();
                } else {
                        const existing = document.getElementById('ig-embed-script');
                        if (!existing) {
                                  const script = document.createElement('script');
                                  script.id = 'ig-embed-script';
                                  script.src = 'https://www.instagram.com/embed.js';
                                  script.async = true;
                                  script.onload = process;
                                  document.body.appendChild(script);
                        } else {
                                  existing.addEventListener('load', process);
                        }
                }
  }, [postId, permalink]);

  return (
        <div ref={ref} className="ig-embed-wrap w-full flex justify-center">
          <blockquote
          className="instagram-media"
          data-instgrm-permalink={embedPermalink}
        data-instgrm-version="14"
        style={{ margin: 0, width: '100%', maxWidth: 420, minWidth: 280 }}
      />
        </div>
  );
}
