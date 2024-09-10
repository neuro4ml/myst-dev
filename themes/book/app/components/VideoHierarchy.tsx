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
              
              console.log("Index of: ", index, " and current is: ", currentVideoIndex);
              if (index >= 0) {
                console.log("CurrentVideoIndex != null?: ", currentVideoIndex != null);
                console.log("entry.isIntersecting?: ", entry.isIntersecting);
                if (currentVideoIndex != null) {
                  console.log("index <= currentVideoIndex: ", index <= currentVideoIndex);
                }
                if ((currentVideoIndex != null) ? ( entry.isIntersecting && (index <= currentVideoIndex)) : true) {
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

                  console.log("Rewriting current: ", currentVideoIndex, " to: ", index);

                  currentVideoIndex = index;
                  
                } else {
                  copy.style.transition = "all 0s ease-in";
                  copy.style.opacity = "0";
                  copy.style.position = "absolute";
                  copy.style.width = "0";
                  copy.style.height = "0";
                  copy.style.transform = "scaleY(0)";

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
    <VidButtons firstIndex={videoIndex} divElements={videoElements}/>
  );
};

export default VideoHierarchy;