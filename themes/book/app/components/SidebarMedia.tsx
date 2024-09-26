import { GenericNode } from "myst-common";
import { MyST } from "myst-to-react";
import React, { useEffect, useRef, useState } from "react";
import SidebarMediaHandler from "./SidebarMediaHandler";
import SidebarVideoHandler from "./SidebarVideoHandler";

interface SidebarMediaProps {
  showSidebar: boolean;
  sidebarMedia: GenericNode[];
  sidebarVideos: GenericNode[];
}

const SidebarMedia: React.FC<SidebarMediaProps> = ({ showSidebar, sidebarMedia, sidebarVideos }) => {

  // Effect for processing containers and categorizing them
  // useEffect(() => {
  //   const mediaArray: GenericNode[] = [];
  //   const videosArray: GenericNode[] = [];

  //   containers.forEach((container) => {
  //     const child = container.children && container.children[0];
  //     if (child && child.type === 'image' && child.url) {
  //       const isMP4 = child.url.toLowerCase().endsWith('.mp4');
  //       if (isMP4) {
  //         videosArray.push(container);
  //       } else {
  //         mediaArray.push(container);
  //       }
  //     } else {
  //       mediaArray.push(container);
  //     }
  //   });

  //   setSidebarMedia(mediaArray);
  //   setSidebarVideos(videosArray);

  // }, [containers]); // Re-run when containers or containerPairs change

  // Effect for handling visibility based on showSidebar
  // useEffect(() => {
  //   const originals: HTMLElement[] = [];
  //   sidebarMedia.forEach((container) => {
  //     const id = container.identifier;
  //     if (id) {
  //       const element = document.getElementById(id + "_ORIGINAL");
  //       if (element) {
  //         originals.push(element);
  //       }
  //     }
  //   });

  //   // Apply visibility classes based on showSidebar
  //   originals.forEach((original) => {
  //     if (showSidebar) {
  //       original.style.visibility = 'hidden';
  //       original.style.marginBottom = `-${original.offsetHeight}px`;
  //     } else {
  //       original.style.visibility = 'visible';
  //       original.style.marginBottom = '0px';
  //     }
      
  //     // if (original.children[0] instanceof HTMLVideoElement) {
  //     //   const originalVideo = original.children[0] as HTMLVideoElement;
  //     //   originalVideo.loop = false;
  //     //   originalVideo.muted = false;
  //     //   originalVideo.autoplay = true;
  //     // }
  //   });

  //}, [showSidebar, sidebarMedia, sidebarVideos]); // Re-run when showSidebar or containers change

  return (
    <section className="h-full flex flex-col border-l px-1">
      {/* Optional padding at the top */}
      <div className="pt-5"></div>
      <div className="pt-5"></div>
      <div className="pt-5"></div>
  
      {/* Make this div scrollable while allowing flex-grow for dynamic resizing */}
      <div className="flex-grow overflow-auto px-4">
        {/* SidebarMediaHandler */}
        <div className="sidebarMediaBox cursor-pointer hover:no-underline">
          <SidebarMediaHandler showSidebar={showSidebar} containers={sidebarMedia} />
        </div>
      </div>
  
      {/* SidebarVideoHandler */}
      <div className="flex-shrink-0">
        <SidebarVideoHandler showSidebar={showSidebar} containers={sidebarVideos} />
      </div>
    </section>
  );
  
};

export default SidebarMedia;
