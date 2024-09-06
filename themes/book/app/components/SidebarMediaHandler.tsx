import React, { useRef, useEffect, useState } from "react";
import { GenericNode } from "myst-common";
import { MyST } from "myst-to-react";
import VideoVolume from "./VideoVolume";

interface SidebarMediaHandlerProps {
  showSidebar: boolean;
  containers: GenericNode[];
}

const SidebarMediaHandler: React.FC<SidebarMediaHandlerProps> = ({
  containers,
  showSidebar,
}) => {
  const [containerPairs, setContainerPairs] = useState<
    Map<HTMLElement, HTMLElement>
  >(new Map());

  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const newContainerPairs = new Map<HTMLElement, HTMLElement>();

    containers.forEach((container) => {
      const id = container.identifier;
      
      if (id) {
        
        const element = document.getElementById(id);
        if (element) {
          
          if (sidebarRef.current && sidebarRef.current.contains(element)) {
            element.id += "_COPY";
            const originalElement = document.getElementById(id + "_ORIGINAL");
            if (originalElement) {
              newContainerPairs.set(originalElement, element);
            }
          } else {
            element.id += "_ORIGINAL";
            const element2 = document.getElementById(id);
            if ((element2 != null) && sidebarRef.current && sidebarRef.current.contains(element2)) {
              element2.id += "_COPY";
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
  }, [containers, sidebarRef]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const original = entry.target as HTMLElement;
          if (containerPairs.has(original)) {
            const copy = containerPairs.get(original);

            if (copy) {
              if (entry.isIntersecting) {
                copy.style.transition = "all 0.3s ease-out";
                copy.style.opacity = "1";
                copy.style.position = "static";
                copy.style.width = "";
                copy.style.height = "";
                copy.style.padding = "5px";
                copy.style.border = "2px solid grey";
                copy.style.borderRadius = "5px";
                copy.style.marginTop = "0.2em";
                copy.style.marginBottom = "0.2em";
                copy.style.transform = "scaleY(1)";
              } else {
                copy.style.transition = "all 0s ease-in";
                copy.style.opacity = "0";
                copy.style.position = "absolute";
                copy.style.width = "0";
                copy.style.height = "0";
                copy.style.transform = "scaleY(0)";
              }
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    // Observing all original elements
    containerPairs.forEach((_, originalElement) => {
      observer.observe(originalElement);
    });

    // Cleanup on unmount or when containerPairs changes
    return () => {
      observer.disconnect();
    };
  }, [containerPairs]); // Depend on containerPairs to rerun the effect

  return (
    <div ref={sidebarRef}>
      <VideoVolume ast={containers} />
    </div>
  );
};

export default SidebarMediaHandler;
