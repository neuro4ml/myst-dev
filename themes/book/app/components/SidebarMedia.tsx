import { GenericNode } from "myst-common";
import { MyST } from "myst-to-react";
import React, { useEffect, useRef, useState } from "react";
import VideoVolume from "./VideoVolume";

interface SidebarMediaProps {
  showSidebar: boolean;
  containers: GenericNode[];
}

const SidebarMedia: React.FC<SidebarMediaProps> = ({ showSidebar, containers }) => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [sidebarMedia, setSidebarMedia] = useState<GenericNode[]>([]);
  const [sidebarVideos, setSidebarVideos] = useState<GenericNode[]>([]);
  const [containerPairs] = useState(new Map<HTMLElement, HTMLElement>());

  // Effect for processing containers and categorizing them
  useEffect(() => {
    const mediaArray: GenericNode[] = [];
    const videosArray: GenericNode[] = [];

    containers.forEach((container) => {
      const child = container.children && container.children[0];
      if (child && child.type === 'image' && child.url) {
        const isMP4 = child.url.toLowerCase().endsWith('.mp4');
        if (isMP4) {
          videosArray.push(container);
        } else {
          mediaArray.push(container);
        }
      } else {
        mediaArray.push(container);
      }
    });

    setSidebarMedia(mediaArray);
    setSidebarVideos(videosArray);

    // Process container pairs
    containers.forEach((container) => {
      const id = container.identifier;
      
      if (id) {
        const element = document.getElementById(id);
        if (element) {
          if (sidebarRef.current && sidebarRef.current.contains(element)) {
            element.id = id + "_COPY";
            const originalElement = document.getElementById(id + "_ORIGINAL");
            if (originalElement) { 
              containerPairs.set(originalElement, element);
            }
          } else {
            element.id = id + "_ORIGINAL";
          }
        }
      }
    });
    
    console.log([...containerPairs.entries()]);

  }, [containers, containerPairs]); // Re-run when containers or containerPairs change

  // Effect for handling visibility based on showSidebar
  useEffect(() => {
    const originals: HTMLElement[] = [];
    containers.forEach((container) => {
      const id = container.identifier;
      if (id) {
        const element = document.getElementById(id + "_ORIGINAL");
        if (element) {
          originals.push(element);
        }
      }
    });

    // Apply visibility classes based on showSidebar
    originals.forEach((original) => {
      if (showSidebar) {
        original.style.visibility = 'hidden';
        original.style.marginBottom = `-${original.offsetHeight}px`;
      } else {
        original.style.visibility = 'visible';
        original.style.marginBottom = '0px';
      }
      
      if (original.children[0] instanceof HTMLVideoElement) {
        const originalVideo = original.children[0] as HTMLVideoElement;
        originalVideo.loop = false;
        originalVideo.muted = false;
        originalVideo.autoplay = true;
      }
    });

  }, [showSidebar, containers]); // Re-run when showSidebar or containers change

  return (
    <section className={`${showSidebar ? 'w-4/12' : 'w-[0px]'} h-full flex flex-col border-l px-1`} ref={sidebarRef}>
      <div className="pt-5"></div>
      <div className="pt-5"></div>
      <div className="pt-5"></div>
      <div className="flex-grow overflow-auto px-4">
        <div className="rightColumnText cursor-pointer hover:no-underline">
          <MyST ast={sidebarMedia} />
        </div>
      </div>
      <div className="rightColumnMediaPlayer mt-auto px-4 py-2 flex flex-column">
        <VideoVolume ast={sidebarVideos} />
      </div>
    </section>
  );
};

export default SidebarMedia;
