import React, { useEffect, useState } from 'react';
import VidButtons from './VidButtons';

interface VideoHierarchyProps {
  containerPairs: Map<HTMLElement, HTMLElement>;
}

const VideoHierarchy: React.FC<VideoHierarchyProps> = ({ containerPairs }) => {
  
  const [videoIndex, setVideoIndex] = useState<number | null>(null);
  const [videoElements, setVideoElements] = useState<HTMLElement[]>([]);

  useEffect(() => {

    const videoCopies: HTMLElement[] = Array.from(containerPairs.values());
    const videoElements: HTMLElement[] = Array.from(containerPairs.keys());
    setVideoElements(videoElements);

    let currentVideoIndex = videoIndex;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const original = entry.target as HTMLElement;
          if (containerPairs.has(original)) {
            const copy = containerPairs.get(original);

            if (copy) {
              const index = videoCopies.indexOf(copy);

              if (index >= 0) {
                if (entry.isIntersecting) {
                  if ((currentVideoIndex != null) ? (index <= currentVideoIndex) : true) {
                    // copy.style.transition = "all 0.3s ease-out";
                    // copy.style.opacity = "1";
                    // copy.style.position = "absolute";
                    // copy.style.width = "100%";
                    // copy.style.height = "auto";
                    // copy.style.padding = "5px";
                    // copy.style.border = "2px solid grey";
                    // copy.style.borderRadius = "5px";
                    // copy.style.marginTop = "0.2em";
                    // copy.style.marginBottom = "0.2em";
                    // copy.style.transform = "scaleY(1)";
                    copy.style.visibility = "visible";
                    copy.style.boxSizing = "border-box";
                    copy.style.position = "absolute";
                    copy.style.height = "100%";

                    currentVideoIndex = index;
                    
                  } 
                } else {
                  // copy.style.transition = "all 0s ease-in";
                  // copy.style.opacity = "0";
                  // copy.style.position = "absolute";
                  // copy.style.width = "";
                  // copy.style.height = "";
                  // copy.style.transform = "scaleY(0)";
                  copy.style.visibility = "hidden";

                  if(index == currentVideoIndex) {
                    currentVideoIndex = null;
                  }
                }
              }
            }
          }
          setVideoIndex(currentVideoIndex);
        });
      },
      { threshold: 0.1 }
    );

    containerPairs.forEach((copy, original) => {
      observer.observe(original);
    });



    // Cleanup on unmount
    return () => {
      observer.disconnect();
    };
  }, [containerPairs, videoIndex]);

  return (
    (videoIndex != null) ? (<VidButtons firstIndex={videoIndex} divElements={videoElements}/>) : null
  );
};

export default VideoHierarchy;