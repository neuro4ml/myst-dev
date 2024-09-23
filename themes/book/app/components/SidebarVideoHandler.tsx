import React, { useRef, useEffect, useState } from "react";
import { GenericNode } from "myst-common";
import { MyST } from "myst-to-react";

import VideoHierarchy from "./VideoHierarchy";
import { FileChartColumnIncreasing } from "lucide-react";
import LineConnector from "./LineConnector";
interface SidebarVideoHandlerProps {
  showSidebar: boolean;
  containers: GenericNode[];
}

const SidebarVideoHandler: React.FC<SidebarVideoHandlerProps> = ({
  containers,
  showSidebar,
}) => {
  const [containerPairs, setContainerPairs] = useState<Map<HTMLElement, HTMLElement>>(new Map());
  const [originalIdCount, setOriginalIdCount] = useState<number>(0);
  const [copyIdCount, setCopyIdCount] = useState<number>(0);
  const [videoCopyList, setvideoCopyList] = useState<HTMLElement[]>([]);

  const sidebarRef = useRef<HTMLDivElement>(null);

  // const showTopVideo = () => {

  //   let newTopVideoIndex = null;
  //   let index = 0;
  //   containerPairs.forEach((copy, original) => {
  //     (newTopVideoIndex != null) ?
  //     if(index <)
  //     index++;
  //   });
  // };

  useEffect(() => {
    const newContainerPairs = containerPairs;
    let currentCopyIdCount = copyIdCount;
    let currentOriginalIdCount = originalIdCount;
    let currentVideoCopyList = videoCopyList;

    const iframes = document.querySelectorAll('iframe');

    iframes.forEach((iframe) => {

      const topDiv = iframe.parentElement;
      const topTopDiv = iframe.parentElement?.parentElement;
      const topTopTopDiv = iframe.parentElement?.parentElement?.parentElement;

      if (sidebarRef.current && sidebarRef.current.contains(iframe)) {
        
        const id = "iframe_node_" + currentCopyIdCount++;

        iframe.id = id + "_COPY";

        currentVideoCopyList.push(iframe);

        const originalElement = document.getElementById(id + "_ORIGINAL");
        if (originalElement) {
          console.log("Matching original found!!!");
          newContainerPairs.set(originalElement, iframe);
        }

        if (topDiv && topTopDiv) {
          topDiv.replaceWith(iframe);
          topTopDiv.style.position = "relative";
          topTopDiv.style.overflow = "hidden";
          topTopDiv.style.width = "100%";
          topTopDiv.style.maxWidth = "100%";
          topTopDiv.style.justifyContent = "right";
        }

        if (topTopTopDiv) {
          topTopTopDiv.style.minHeight = "25%";
        }

      } else {

        const id = "iframe_node_" + currentOriginalIdCount++;

        iframe.id = id + "_ORIGINAL";

        const copyElement = document.getElementById(id + "_COPY");
        if (copyElement) {
          console.log("Matching copy found!!!");
          newContainerPairs.set(iframe, copyElement);
        }

        iframe.style.visibility = 'hidden';

        iframe.style.height = "1px";
        
        console.log(topDiv);
        console.log(topTopDiv);
        if (topDiv && topTopDiv) {
          // topTopDiv.style.height = "1px";
          // topTopDiv.style.overflow = "hidden";
          topDiv.style.paddingBottom = "";

        }
      }

    });

    console.log("New container pairs: ", newContainerPairs);
    setContainerPairs(newContainerPairs);
    setOriginalIdCount(currentOriginalIdCount);
    setCopyIdCount(currentCopyIdCount);
    setvideoCopyList(currentVideoCopyList);

  }, [containers, sidebarRef]);

  useEffect(() => {
    containerPairs.forEach((copy, original) => {
      const topDiv = original.parentElement?.parentElement;
      if (showSidebar) {
        original.style.height = "1px";
        original.style.overflow = "hidden";
      } else {
        original.style.height = "initial";
      }
    });
  }, [showSidebar, containerPairs]);

  return (
    <div className="flex flex-column" ref={sidebarRef}>
      <MyST ast={containers} />
      <VideoHierarchy containerPairs = {containerPairs} />
      <LineConnector containerPairs={containerPairs} />

    </div>
  );
};

export default SidebarVideoHandler;
