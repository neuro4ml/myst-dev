import React, { useRef, useEffect, useState } from "react";
import { GenericNode } from "myst-common";
import { MyST } from "myst-to-react";

import VideoHierarchy from "./VideoHierarchy";
import { FileChartColumnIncreasing } from "lucide-react";
import LineConnector from "./LineConnector";

interface SidebarVideoHandlerProps {
  showSidebar: boolean;
  containers: GenericNode[];
  showLines: boolean;
}

const SidebarVideoHandler: React.FC<SidebarVideoHandlerProps> = ({
  containers,
  showSidebar,
  showLines,
}) => {
  const [containerPairs, setContainerPairs] = useState<Map<HTMLElement, HTMLElement>>(new Map());
  const [originalIdCount, setOriginalIdCount] = useState<number>(0);
  const [copyIdCount, setCopyIdCount] = useState<number>(0);
  const [videoCopyList, setVideoCopyList] = useState<HTMLElement[]>([]);

  const sidebarRef = useRef<HTMLDivElement>(null);

  // Function to handle video styles and positioning
  const setStyling = () => {
    containerPairs.forEach((copy, original) => {

      // Explicitly ensure all copies are set to relative and not absolute
      copy.style.position = "relative";  // Ensure it's relative, not absolute
      copy.style.maxWidth = "400px";
      copy.style.width = "100%";
      copy.style.padding = "3px";
      copy.style.border = "1px solid";

      original.style.position = "relative";
      original.style.maxWidth = "80%";
      
      if (showSidebar) {
        // Hide the original when sidebar is shown
        original.style.height = "1px";
        original.style.overflow = "hidden";
        original.style.visibility = "hidden";
        original.style.margin = "0";
      } else {
        // Show original when sidebar is hidden
        original.style.height = `${original.offsetWidth * (9 / 16)}px`;
        original.style.visibility = "visible";
        original.style.margin = "1rem auto";
      }
    });
  };

  useEffect(() => {
    // Set video pairs only once on page load
    if (containerPairs.size > 0) return;

    const newContainerPairs = new Map<HTMLElement, HTMLElement>();
    let currentCopyIdCount = copyIdCount;
    let currentOriginalIdCount = originalIdCount;
    let currentVideoCopyList = videoCopyList;

    const iframes = document.querySelectorAll('iframe');

    iframes.forEach((iframe) => {
      
      const topDiv = iframe.parentElement;
      const topTopDiv = iframe.parentElement?.parentElement;

      if (sidebarRef.current && sidebarRef.current.contains(iframe)) {

        // Videos inside the sidebar
        const id = "iframe_node_" + currentCopyIdCount++;
        iframe.id = id + "_COPY";
        currentVideoCopyList.push(iframe);

        const originalElement = document.getElementById(id + "_ORIGINAL");
        if (originalElement) {
          newContainerPairs.set(originalElement, iframe);
        }

        // Make sure the video containers are styled properly
        if (topDiv && topTopDiv) {
          topDiv.replaceWith(iframe);
          topDiv.style.overflow = "hidden";
        }
      } else {
        // Videos outside the sidebar (originals)
        const id = "iframe_node_" + currentOriginalIdCount++;
        iframe.id = id + "_ORIGINAL";

        const copyElement = document.getElementById(id + "_COPY");
        if (copyElement) {
          newContainerPairs.set(iframe, copyElement);
        }

        // Ensure the original video is hidden when not in the sidebar
        iframe.style.visibility = 'hidden';
        iframe.style.height = "1px";

        if (topDiv && topTopDiv) {
          topDiv.style.paddingBottom = "";
        }
      }
    });

    setContainerPairs(newContainerPairs);
    setOriginalIdCount(currentOriginalIdCount);
    setCopyIdCount(currentCopyIdCount);
    setVideoCopyList(currentVideoCopyList);
  }, []); // Run only once on page load

  // Apply the styling on sidebar show/hide
  useEffect(() => {
    setStyling();
  }, [showSidebar, containerPairs]);

  return (
    <div id="sidebarVideoBox" className=" w-fit mt-auto px-4 py-2 flex flex-column overflow-hidden items-center" style={{paddingRight: "4rem"}}ref={sidebarRef}>
      <MyST ast={containers} />
      <VideoHierarchy containerPairs={containerPairs} />
      <LineConnector containerPairs={containerPairs} showLines={showLines} />
    </div>
  );
};

export default SidebarVideoHandler;
