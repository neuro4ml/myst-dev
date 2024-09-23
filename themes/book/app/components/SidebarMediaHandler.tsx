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
    // Set flex-related properties for responsive layout
    copy.style.maxHeight = "100%";
    copy.style.minWidth = "18vw";
    copy.style.flex = "1 1 calc(33.333% - 10px)"; // Adjust flex basis for responsiveness
    copy.style.margin = "5px"; // Margin between items
    copy.style.objectFit = "cover";
    copy.style.verticalAlign = "bottom";
    copy.style.transition = "all 0.3s ease-out"; // For smooth transitions
  };

  const sidebarRef = useRef<HTMLDivElement>(null);

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
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const original = entry.target as HTMLElement;
          if (containerPairs.has(original)) {
            const copy = containerPairs.get(original);

            if (copy) {
              if (entry.isIntersecting) {
                // When the copy becomes visible
                copy.style.opacity = "1";
                copy.style.position = "relative";
                copy.style.transform = "scale(1)";
                copy.style.zIndex = "0";
                copy.onclick = () => {
                  const img = copy.querySelector('img');
                  if (img) {
                    openModal(img.src, img.alt);
                  }
                };
              } else {
                // When the copy is out of view
                copy.style.opacity = "0";
                copy.style.position = "absolute";
                copy.style.transform = "scale(0.8)";
                copy.style.zIndex = "-10";
                copy.onclick = null;
              }
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    containerPairs.forEach((_, originalElement) => {
      observer.observe(originalElement);
    });

    return () => {
      observer.disconnect();
    };
  }, [containerPairs, openModal]);

  return (
    <div className="flex flex-wrap justify-start" ref={sidebarRef} style={{ gap: "10px" }}>
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
