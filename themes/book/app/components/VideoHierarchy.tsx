import React, { useEffect, useState } from 'react';
import VidButtons from './VidButtons';

interface VideoHierarchyProps {
  containerPairs: Map<HTMLElement, HTMLElement>;
}

const VideoHierarchy: React.FC<VideoHierarchyProps> = ({ containerPairs }) => {
  
  const [videoIndex, setVideoIndex] = useState<number | null>(null);
  const [videoElements, setVideoElements] = useState<HTMLElement[]>([]);

  const showCopy = (copy: HTMLElement) => {
    copy.style.visibility = "visible";
    copy.style.boxSizing = "border-box";
    copy.style.position = "absolute";
    copy.style.height = "100%";
  };

  const hideCopy = (copy: HTMLElement) => {
    copy.style.visibility = "hidden";
  };

  useEffect(() => {

    const videoCopies: HTMLElement[] = Array.from(containerPairs.values());
    const videoElements: HTMLElement[] = Array.from(containerPairs.keys());
    setVideoElements(videoElements);

    let currentVideoIndex = videoIndex;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const scrollableParent = document.querySelector('main') as HTMLElement;
          const original = entry.target as HTMLElement;
          if (containerPairs.has(original)) {
            const copy = containerPairs.get(original);

            if (copy) {
              const index = videoCopies.indexOf(copy);
              const isScrolledToBottom = scrollableParent.scrollTop + scrollableParent.clientHeight >= scrollableParent.scrollHeight;

              if (index >= 0) {
                if (isScrolledToBottom) {
                  if (index === videoIndex) {
                    showCopy(copy);
                  }
                  else {
                    hideCopy(copy);
                  }
                }
                else if (entry.isIntersecting) {
                  if ((currentVideoIndex != null) ? (index <= currentVideoIndex) : true) {
                    showCopy(copy);
                    currentVideoIndex = index;
                  } 
                  else {
                    hideCopy(copy);
                  }
                }  else {
                  hideCopy(copy);
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
    (videoIndex != null) ? (<VidButtons firstIndex={videoIndex} divElements={videoElements} setVideoIndex={setVideoIndex}/>) : null
  );
};

export default VideoHierarchy;