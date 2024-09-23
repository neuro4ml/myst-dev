// ContainerHider.tsx
import React, { useEffect, useRef, useState, useCallback } from 'react';

interface LinePair {
  originalElement: HTMLElement;
  copyElement: HTMLElement;
}

interface ModalImage {
  src: string;
  alt: string;
}

const ContainerHider: React.FC = () => {
  const copyRefs = useRef<Map<string, HTMLElement>>(new Map());
  const originalRefs = useRef<Map<string, HTMLElement>>(new Map());
  const [linePairs, setLinePairs] = useState<LinePair[]>([]);
  const [modalImage, setModalImage] = useState<ModalImage | null>(null);

  const openModal = useCallback((src: string, alt: string) => {
    setModalImage({ src, alt });
  }, []);

  const closeModal = useCallback(() => {
    setModalImage(null);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const newPairs: LinePair[] = [];
        
        entries.forEach((entry) => {
          const id = entry.target.textContent?.trim();
          if (id && !id.startsWith('vid')) {
            const copy = copyRefs.current.get(id);
            const original = originalRefs.current.get(id);

            if (copy && original) {
              console.log("PArent Width: " + parent.innerWidth);
              if (parent.innerWidth) {
                original.style.color = 'red';
                original.style.visibility = 'hidden';
                original.style.marginBottom = `-${original.offsetHeight}px`;
              }
              else {
                original.style.visibility = 'visible';
                original.style.marginBottom = '0';
              }
              
              if (entry.isIntersecting) {
                copy.style.transition = 'all 0.3s ease-out';
                copy.style.opacity = '1';
                copy.style.position = 'static';
                copy.style.width = '';
                copy.style.height = '';
                copy.style.padding = '5px';
                copy.style.border = '2px solid grey';
                copy.style.borderRadius = '5px';
                copy.style.marginTop = '0.2em';
                copy.style.marginBottom = '0.2em';
                copy.style.transform = 'scaleY(1)';
                
                newPairs.push({ originalElement: original, copyElement: copy });

                // Add click event listener to open modal
                copy.onclick = () => {
                  const img = copy.querySelector('img');
                  if (img) {
                    openModal(img.src, img.alt);
                  }
                };
              } else {
                copy.style.transition = 'all 0s ease-in';
                copy.style.opacity = '0';
                copy.style.position = 'absolute';
                copy.style.width = '0';
                copy.style.height = '0';
                copy.style.transform = 'scaleY(0)';

                // Remove click event listener
                copy.onclick = null;

                setLinePairs((prevPairs) =>
                  prevPairs.filter(pair => pair.copyElement !== copy)
                );
              }
            }
          }
        });

        setLinePairs((prevPairs) => {
          const updatedPairs = newPairs.filter(pair => !prevPairs.some(p => p.originalElement === pair.originalElement && p.copyElement === pair.copyElement));
          return [...prevPairs, ...updatedPairs];
        });
      },
      { threshold: 0.1 }
    );

    const texts = document.querySelectorAll('div');
    texts.forEach((text) => {
      const id = text.textContent?.trim();
      if (id) {
        const copy = document.getElementById(id);
        if (copy) {
          copyRefs.current.set(id, copy as HTMLElement);
        }
        originalRefs.current.set(id, text as HTMLElement);
        observer.observe(text);
      }
    });

    return () => {
      copyRefs.current.forEach((copy, id) => {
        const text = Array.from(texts).find(t => t.textContent?.trim() === id);
        if (text) {
          observer.unobserve(text);
        }
      });
    };
  }, [openModal]);

  return (
    <>
      {/* <LineConnector pairs={linePairs} />
      {modalImage && (
        <ImageModal
          src={modalImage.src}
          alt={modalImage.alt}
          onClose={closeModal}
        />
      )} */}
    </>
  );
};

export default ContainerHider;