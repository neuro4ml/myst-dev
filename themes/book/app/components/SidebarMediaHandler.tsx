import React, { useRef, useEffect, useState, useCallback } from "react";
import { GenericNode } from "myst-common";
import { MyST } from "myst-to-react";
import LineConnector from "./LineConnector";
import ImageModal from "./ImageModal";
import VideoHierarchy from "./VideoHierarchy";

interface SidebarMediaHandlerProps {
  showSidebar: boolean;
  containers: GenericNode[];
  showLines: boolean;
}

interface ModalImage {
  src: string;
  alt: string;
}

const SidebarMediaHandler: React.FC<SidebarMediaHandlerProps> = ({
  containers,
  showSidebar,
  showLines
}) => {
  const [containerPairs, setContainerPairs] = useState<Map<HTMLElement, HTMLElement>>(new Map());
  const [modalImage, setModalImage] = useState<ModalImage | null>(null);

  const openModal = useCallback((src: string, alt: string) => {
    setModalImage({ src, alt });
  }, []);

  const closeModal = useCallback(() => {
    setModalImage(null);
  }, []);

  const styleCopy = (copy: HTMLElement) => {
    copy.style.transition = "transform 0.3s ease-out"; 
    copy.style.position = "relative";
    copy.style.height = "fit-content";
    copy.style.maxWidth = "max-content";
    copy.style.overflow = "hidden";

  };

  const sidebarRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLElement | null>(null); // Reference for the main element

  const updateContainerPairs = () => {
    const newContainerPairs = containerPairs;
    containers.forEach((container) => {
      let id = container.identifier;
      if (id) {

        // * Handles edge-case for id starting with a number
        const firstChar = id.charAt(0);
        if(firstChar >= '0' && firstChar <= '9'){
          const oldId = id;
          id = "id-" + oldId;
        }
        // *

        const element = document.getElementById(id);
        if (element) {
          if (sidebarRef.current && sidebarRef.current.contains(element)) {
            element.id += "_COPY";
            styleCopy(element);
            const originalElement = document.getElementById(id + "_ORIGINAL");
            if (originalElement) {
              newContainerPairs.set(originalElement, element);
            }
          } else {
            element.id += "_ORIGINAL";
            const element2 = document.getElementById(id);
            if (element2 && sidebarRef.current && sidebarRef.current.contains(element2)) {
              element2.id += "_COPY";
              styleCopy(element2);
              const originalElement = document.getElementById(id + "_ORIGINAL");
              if (originalElement) {
                newContainerPairs.set(originalElement, element2);
              }
            }
          }
        }
      }
    });

    setContainerPairs(newContainerPairs);
  };

  const updateCopyStyles = () => {
    const viewportHeight = mainRef.current?.clientHeight || window.innerHeight;
    const centerY = viewportHeight / 2;

    containerPairs.forEach((copy, original) => {
      const rect = original.getBoundingClientRect();
      const originalCenterY = rect.top + rect.height / 2;
      const distanceFromCenter = Math.abs(centerY - originalCenterY);
      const maxDistance = viewportHeight / 2;

      // Calculate the scale factor (0.1 to 1)
      let scale = Math.sin(0.5 * Math.PI * Math.max(0, 1 - distanceFromCenter / maxDistance));

      


      // Adjust z-index based on visibility
      if (scale > 0) {

        copy.style.transform = `scale(${scale})`
        copy.style.width = `${scale * 100}%`;
        copy.style.display = "block";
        copy.style.padding = "3px";
        copy.style.border = "1px solid";
        copy.style.margin = "1px";

        const figcaptions = copy.querySelectorAll('figcaption');
        figcaptions.forEach((figcaption) => {
            figcaption.style.maxHeight = `${scale * 2}em`;  // Maximum 2 lines of text at the current scale
        });

        copy.onclick = () => {
          const img = copy.querySelector("img");
          if (img) {
            openModal(img.src, img.alt);
          }
        };
      } else {
        copy.style.display = "none";

        copy.onclick = null;
      }

    });
  };

  useEffect(updateContainerPairs, [containers]);

  useEffect(() => {
    containerPairs.forEach((copy, original) => {
      if (showSidebar) {
        original.style.height = "0";
        original.style.overflow = "hidden";
        original.style.padding = "0";
        original.style.border = "0";
        original.style.margin = "0";
      } else {
        original.style.height = "initial";
        original.style.maxWidth = "80%";
        original.style.padding = "3px";
        original.style.border = "1px solid";
        original.style.margin = "1rem auto";
        
      }
    });
  }, [showSidebar, containerPairs]);

  useEffect(() => {
    mainRef.current = document.querySelector('main'); // Select the main element

    const handleScroll = () => {
      updateCopyStyles();
    };

    if (mainRef.current) {
      mainRef.current.addEventListener('scroll', handleScroll);
      mainRef.current.addEventListener('resize', updateCopyStyles);
    }

    updateCopyStyles(); // Initial call to set styles

    return () => {
      if (mainRef.current) {
        mainRef.current.removeEventListener('scroll', handleScroll);
        mainRef.current.removeEventListener('resize', updateCopyStyles);
      }
    };
  }, [containerPairs, openModal]);

  return (
    <div className="flex flex-col items-center" ref={sidebarRef}>
      <MyST ast={containers} />
      <LineConnector containerPairs={containerPairs} showLines={showLines}/>
      {modalImage && (
        <ImageModal
          src={modalImage.src}
          alt={modalImage.alt}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default SidebarMediaHandler;
