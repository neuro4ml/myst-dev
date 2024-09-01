import React, { useEffect, useRef, useState } from 'react';
import LineConnector from './LineConnector';
import VidButtons from './VidButtons';

const VidHider: React.FC = () => {
  const copyRefs = useRef<Map<string, HTMLElement>>(new Map());
  const originalRefs = useRef<Map<string, HTMLElement>>(new Map());
  const [linePairs, setLinePairs] = useState<{ originalElement: HTMLElement; copyElement: HTMLElement }[]>([]);
  const [firstElemIndex, setFirstElemIndex] = useState<number | null>(null);
  const [orderedVidContents, setOrderedVidContents] = useState<HTMLDivElement[]>([]);

  useEffect(() => {
    const orderedVidIds = [...document.querySelectorAll('div')]
      .filter(div => div.textContent?.trim().toLowerCase().startsWith('vid'))

    setOrderedVidContents(orderedVidIds);

    const observer = new IntersectionObserver(
      (entries) => {
        let newFirstElemIndex = firstElemIndex;
        const newPairs: { originalElement: HTMLElement; copyElement: HTMLElement }[] = [];
        
        entries.forEach((entry) => {
          const id = entry.target.textContent?.trim();
          if (id && id.startsWith('vid')) {
            const copy = copyRefs.current.get(id);
            const original = originalRefs.current.get(id);

            const currentIndex = orderedVidIds.indexOf(original as HTMLDivElement);
            // console.log("current index is: " + currentIndex);

            if (copy && original && (currentIndex != null)) {             
              
              (original as HTMLElement).style.color = 'red';
              (original as HTMLElement).style.visibility = 'hidden';
              (original as HTMLElement).style.marginBottom = `-${(original as HTMLElement).offsetHeight}px`;

              const videoElem = copy.firstElementChild;

              if (entry.isIntersecting && (newFirstElemIndex === null || currentIndex <= newFirstElemIndex)) {
                
                // Show the copy and update original
                (copy as HTMLElement).style.opacity = '1';
                (copy as HTMLElement).style.position = 'static';
                (copy as HTMLElement).style.width = '';
                (copy as HTMLElement).style.height = '';
                (copy as HTMLElement).style.padding = '5px';
                (copy as HTMLElement).style.border = '2px solid grey';
                (copy as HTMLElement).style.borderRadius = '5px';
                (copy as HTMLElement).style.margin = '0';

                
                // Check if the copy is a video element before playing
                if (videoElem instanceof HTMLVideoElement) {
                  //console.log("Child is video element");
                  videoElem.play().catch(error => {
                    console.error("Error playing video:", error);
                  });
                }

                newPairs.push({ originalElement: original as HTMLElement, copyElement: copy as HTMLElement });
                // console.log("Old first element is: " + newFirstElemIndex);
                newFirstElemIndex = currentIndex;
                // console.log("New first element is: " + newFirstElemIndex);
            
              } 
              else {
                // console.log("Hiding element index: " + currentIndex);
                // Hide the copy if it's no longer intersecting
                (copy as HTMLElement).style.opacity = '0';
                (copy as HTMLElement).style.position = 'absolute';
                (copy as HTMLElement).style.width = '0';
                (copy as HTMLElement).style.height = '0';

                // Check if the copy is a video element before pausing
                if (videoElem instanceof HTMLVideoElement) {
                  videoElem.pause();
                }

                if (currentIndex == newFirstElemIndex) {
                  newFirstElemIndex = null;
                }
              }
            }
          }
        });

        // Update the state with new pairs and firstElemIndex
        setLinePairs(prevPairs => {
          const updatedPairs = [...prevPairs.filter(pair => 
            newPairs.some(p => p.originalElement === pair.originalElement && p.copyElement === pair.copyElement)
          ), ...newPairs];
          
          // Filter out pairs that are below the new firstElemIndex
          return updatedPairs.filter(pair => 
            orderedVidIds.indexOf(pair.originalElement as HTMLDivElement) <= newFirstElemIndex!
          );
        });
        
        setFirstElemIndex(newFirstElemIndex);
      },
      { threshold: 0.1 }
    );

    const texts = document.querySelectorAll('div');
    texts.forEach((text) => {
      const id = text.textContent?.trim();
      if (id && id.startsWith('vid')) {
        const copy = document.getElementById(id);
        if (copy) {
          copyRefs.current.set(id, copy as HTMLElement);
        }
        originalRefs.current.set(id, text as HTMLElement);
        observer.observe(text);
      }
    });

    return () => {
      texts.forEach((text) => observer.unobserve(text));
    };
  }, [firstElemIndex]);

  return (
    <>
      <LineConnector pairs={linePairs} />
      {(firstElemIndex != null) && <VidButtons divElements={orderedVidContents}/>}
      
    </>
  );
};

export default VidHider;