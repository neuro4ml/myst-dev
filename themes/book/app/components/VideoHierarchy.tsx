import React, { useEffect, useState } from 'react';
import VidButtons from './VidButtons';

interface VideoHierarchyProps {
  containerPairs: Map<HTMLElement, HTMLElement>;
}

const VideoHierarchy: React.FC<VideoHierarchyProps> = ({ containerPairs }) => {

  const [videoIndex, setVideoIndex] = useState<number | null>(null);
  const [videoElements, setVideoElements] = useState<HTMLElement[]>([]);

  const showCopy = (copy: HTMLElement) => {
    // Make the element visible and reset styles
    copy.style.visibility = "visible";
    copy.style.display = "block";
    copy.style.width = "100%";

    // Set height to auto first, to allow proper recalculation
    copy.style.height = "auto";

    // Use a small timeout to ensure layout recalculation happens before setting the height
    setTimeout(() => {
      // After layout recalculates, apply the correct aspect ratio
      copy.style.height = `min(30vh, ${copy.offsetWidth * (9 / 16)}px)`;
    }, 0);
  };

  const hideCopy = (copy: HTMLElement) => {
    copy.style.visibility = "hidden";
    copy.style.width = "0";
    copy.style.height = "0";
    copy.style.display = "none";  // Hide completely
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

              hideCopy(copy); // Hide initially

              if (index >= 0) {
                if (isScrolledToBottom) {
                  if (index === videoIndex) {
                    console.log("SHOWING COPY ", index);
                    showCopy(copy);  // Show only if scrolled to bottom
                  } else {
                    hideCopy(copy);
                  }
                } else if (entry.isIntersecting) {
                  if (currentVideoIndex == null || index <= currentVideoIndex) {
                    showCopy(copy);  // Show when intersecting and valid index
                    currentVideoIndex = index;
                  } else {
                    hideCopy(copy);
                  }
                } else {
                  hideCopy(copy);  // Hide when not intersecting
                  if (index === currentVideoIndex) {
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

    return () => {
      observer.disconnect();
    };
  }, [containerPairs, videoIndex]);

  return (
    (videoIndex != null) ? (
      <VidButtons firstIndex={videoIndex} divElements={videoElements} setVideoIndex={setVideoIndex}/>
    ) : null
  );
};

export default VideoHierarchy;
