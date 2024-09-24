import React, { useRef, useEffect, useState, useCallback } from "react";
import { GenericNode } from "myst-common";
import { MyST } from "myst-to-react";
import LineConnector from "./LineConnector";
import ImageModal from "./ImageModal";

interface SidebarMediaHandlerProps {
  showSidebar: boolean;
  containers: GenericNode[];
}

interface ModalImage {
  src: string;
  alt: string;
}

const SidebarMediaHandler: React.FC<SidebarMediaHandlerProps> = ({
  containers,
  showSidebar,
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
    copy.style.transition = "flex-basis 1s ease-out, flex-grow 1s ease-out"; 
    copy.style.padding = "3px";
    copy.style.border = "1px solid";
    copy.style.position = "relative";
    copy.style.flex = "1 0 10%"; // Allow flexibility in width and ensure it has a basis
    copy.style.boxSizing = "border-box"; // Include padding and border in width/height calculations
  };

  const sidebarRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLElement | null>(null); // Reference for the main element

  const updateContainerPairs = () => {
    const newContainerPairs = containerPairs;
    containers.forEach((container) => {
      const id = container.identifier;
      if (id) {
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
      let scale = Math.max(0.1, Math.sin(0.5 * Math.PI * Math.max(0, 1 - distanceFromCenter / maxDistance)));

      // Adjust properties based on scale
      copy.style.flexGrow = `${scale * 10}`; // Max growth factor
      copy.style.flexShrink = "0"; // Prevent shrinking
      copy.style.flexBasis = `${scale * 60}%`;

      // Adjust z-index based on visibility
      if (scale > 0) {
        copy.style.zIndex = "0";
        copy.style.display = "block";
      } else {
        copy.style.zIndex = "-10";
        copy.style.display = "none";
      }

      // Optional: add transition for smooth scaling
      copy.style.transition = 'all 0.3s ease-out';
    });
  };

  useEffect(updateContainerPairs, [containers]);

  useEffect(() => {
    containerPairs.forEach((copy, original) => {
      if (showSidebar) {
        original.style.height = "0";
        original.style.overflow = "hidden";
      } else {
        original.style.height = "initial";
      }
    });
  }, [showSidebar, containerPairs]);

  useEffect(() => {
    mainRef.current = document.querySelector('main'); // Select the main element

    const handleScroll = () => {
      console.log("Scroll event triggered on main");
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
  }, [containerPairs]);

  return (
    <div className="flex flex-row flex-wrap w-full h-full justify-center gap-0" ref={sidebarRef} style={{ maxHeight: "600px", alignItems: "flex-start" }}>
      <MyST ast={containers} />
      <LineConnector containerPairs={containerPairs} />
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
