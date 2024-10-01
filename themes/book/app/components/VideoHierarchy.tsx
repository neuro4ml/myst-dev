import React, { useEffect, useState } from 'react';
import VidButtons from './VidButtons';

interface VideoHierarchyProps {
  containerPairs: Map<HTMLElement, HTMLElement>;
}

const VideoHierarchy: React.FC<VideoHierarchyProps> = ({ containerPairs }) => {

  const [videoIndex, setVideoIndex] = useState<number | null>(null);
  const [videoElements, setVideoElements] = useState<HTMLElement[]>([]);

  const playVideo = (element: HTMLIFrameElement) => {
    console.log("Playing ", element);
    if (element.contentWindow) {
      element.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
    }
  };
  
  const pauseVideo = (element: HTMLIFrameElement) => {
    console.log("Pausing ", element);
    if (element.contentWindow) {
      element.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
    }
  };

  const showCopy = (copy: HTMLElement) => {
    copy.style.display = "block";
    copy.style.width = "100%";
    copy.style.height = `${copy.offsetWidth * (9 / 16)}px`;  // Maintain 16:9 aspect ratio
    if(copy.offsetWidth >= 10) {
      playVideo(copy as HTMLIFrameElement);
    }
    else {
      pauseVideo(copy as HTMLIFrameElement);
    }
    
  };

  const hideCopy = (copy: HTMLElement) => {
    pauseVideo(copy as HTMLIFrameElement);
    copy.style.display = "none";
    copy.style.width = "0";
    copy.style.height = "0";
  };

  const setStyling = () => {
    containerPairs.forEach((copy, original) => {
      copy.style.height = `${copy.offsetWidth * (9 / 16)}px`;
      console.log("Setting height of ", copy, " to ", copy.offsetWidth * (9 / 16));
      if(copy.offsetWidth >= 10) {
        playVideo(copy as HTMLIFrameElement);
      }
      else {
        pauseVideo(copy as HTMLIFrameElement);
      }
    });
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
                    console.log("SHOWING COPY ", index);
                    showCopy(copy);
                  } else {
                    hideCopy(copy);
                  }
                } else if (entry.isIntersecting) {
                  if ((currentVideoIndex != null) ? (index <= currentVideoIndex) : true) {
                    showCopy(copy);
                    currentVideoIndex = index;
                  } else {
                    hideCopy(copy);
                  }
                } else {
                  hideCopy(copy);
                  if (index == currentVideoIndex) {
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

  // Use ResizeObserver to handle size changes in the split pane
  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      setStyling();  // Adjust styles on element resize
    });

    containerPairs.forEach((copy) => {
      resizeObserver.observe(copy);  // Observe size changes for each container element
    });

    return () => {
      resizeObserver.disconnect();  // Clean up observer on unmount
    };
  }, [containerPairs]);

  return (
    (videoIndex != null) ? (
      <VidButtons firstIndex={videoIndex} divElements={videoElements} setVideoIndex={setVideoIndex} />
    ) : null
  );
};

export default VideoHierarchy;
