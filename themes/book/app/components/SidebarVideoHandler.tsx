import React, { useRef, useEffect, useState } from "react";
import { GenericNode } from "myst-common";
import { MyST } from "myst-to-react";
import VidButtons from "./VidButtons";

interface SidebarVideoHandlerProps {
  showSidebar: boolean;
  containers: GenericNode[];
}

const SidebarVideoHandler: React.FC<SidebarVideoHandlerProps> = ({
  containers,
  showSidebar,
}) => {
  const [containerPairs, setContainerPairs] = useState<Map<HTMLElement, HTMLElement>>(new Map());
  const [firstElemIndex, setFirstElemIndex] = useState<number | null>(null);
  const [orderedVideoCopies, setOrderedVideoCopies] = useState<HTMLElement[]>([]);
  const [idCount, setIdCount] = useState<number>(0);

  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const newContainerPairs = new Map<HTMLElement, HTMLElement>();
    const newOrderedVideoCopies: HTMLElement[] = []; // Create a new array instead of mutating state directly

    const iframes = document.querySelectorAll('iframe');

    iframes.forEach((iframe) => {
      iframe.id = "iframe_node_" + idCount;
      setIdCount(idCount + 1);
      if (sidebarRef.current && sidebarRef.current.contains(iframe)) {
        iframe.id += "_COPY";
        const originalElement = document.getElementById(iframe.id + "_ORIGINAL");
        if (originalElement) {
          newContainerPairs.set(originalElement, iframe);
          newOrderedVideoCopies.push(iframe);
        }
        iframe.style.position = 'relative';
      } else {
        iframe.id += "_ORIGINAL";
        const copyElement = document.getElementById(iframe.id + "_COPY");
        if (copyElement) {
          newContainerPairs.set(iframe, copyElement);
        }
        iframe.style.visibility = 'hidden';
        const topDiv = iframe.parentElement?.parentElement;
        if (topDiv) {
          topDiv.style.maxHeight = '0px';
        }
      }

    });

    setContainerPairs(newContainerPairs);
    setOrderedVideoCopies(newOrderedVideoCopies); // Set state to the new array

  }, [containers, sidebarRef]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        let updatedFirstElemIndex = firstElemIndex;

        entries.forEach((entry) => {
          const original = entry.target as HTMLElement;
          if (containerPairs.has(original)) {
            const copy = containerPairs.get(original);

            if (copy) {
              const currentIndex = orderedVideoCopies.indexOf(copy);
              const videoElem = copy.firstElementChild;

              if (entry.isIntersecting && (updatedFirstElemIndex === null || currentIndex <= updatedFirstElemIndex)) {
                copy.style.opacity = '1';
                //copy.style.position = 'static';
                copy.style.width = '';
                copy.style.height = '';
                copy.style.padding = '5px';
                copy.style.border = '2px solid grey';
                copy.style.borderRadius = '5px';
                copy.style.margin = '0';

                if (videoElem instanceof HTMLVideoElement) {
                  videoElem.play().catch(error => {
                    console.error("Error playing video:", error);
                  });
                }

                updatedFirstElemIndex = currentIndex;
              } else {
                copy.style.opacity = '0';
                //copy.style.position = 'absolute';
                copy.style.width = '0';
                copy.style.height = '0';

                if (videoElem instanceof HTMLVideoElement) {
                  videoElem.pause();
                }

                if (currentIndex === updatedFirstElemIndex) {
                  updatedFirstElemIndex = null;
                }
              }
            }
          }
        });

        if (updatedFirstElemIndex !== firstElemIndex) {
          setFirstElemIndex(updatedFirstElemIndex);
        }
      },
      { threshold: 0.1 }
    );

    containerPairs.forEach((_, originalElement) => {
      observer.observe(originalElement);
    });

    return () => {
      observer.disconnect();
    };
  }, [containerPairs, firstElemIndex, orderedVideoCopies]); // Include firstElemIndex and orderedVideoCopies in the dependencies

  return (
    <div className="flex flex-column" ref={sidebarRef}>
      <MyST ast={containers} />
      {(firstElemIndex != null) && <VidButtons firstIndex={firstElemIndex} divElements={orderedVideoCopies}/>}
    </div>
  );
};

export default SidebarVideoHandler;
