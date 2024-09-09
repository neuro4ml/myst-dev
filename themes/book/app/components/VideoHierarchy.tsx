import React, { useEffect } from 'react';

interface VideoHierarchyProps {
  containerPairs: Map<HTMLElement, HTMLElement>;
}

const VideoHierarchy: React.FC<VideoHierarchyProps> = ({ containerPairs }) => {
  useEffect(() => {
    // containerPairs.forEach((copy, original) => {
    //   if (copy.id !== "iframe_node_0_COPY") {
    //     copy.style.display = "none";
    //   }
    // });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const original = entry.target as HTMLElement;
          if (containerPairs.has(original)) {
            const copy = containerPairs.get(original);

            if (copy) {
              if (entry.isIntersecting && (copy.id == ("iframe_node_0_COPY" || "iframe_node_1_COPY"))) {
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

    containerPairs.forEach((copy, original) => {
      observer.observe(original);
    });

    return () => {
      observer.disconnect();
    };
  }, [containerPairs]);

  return null;
};

export default VideoHierarchy;