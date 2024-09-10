import React, { useRef, useEffect, useState } from "react";
import { GenericNode } from "myst-common";
import { MyST } from "myst-to-react";
import VidButtons from "./VidButtons";
import hideContainerPairs from "./hideContainerPairs";
import VideoHierarchy from "./VideoHierarchy";
import { FileChartColumnIncreasing } from "lucide-react";
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

      if (sidebarRef.current && sidebarRef.current.contains(iframe)) {
        
        const id = "iframe_node_" + currentCopyIdCount++;

        iframe.id = id + "_COPY";

        currentVideoCopyList.push(iframe);

        const originalElement = document.getElementById(id + "_ORIGINAL");
        if (originalElement) {
          console.log("Matching original found!!!");
          newContainerPairs.set(originalElement, iframe);
        }

        iframe.style.position = 'relative';

      } else {

        const id = "iframe_node_" + currentOriginalIdCount++;

        iframe.id = id + "_ORIGINAL";

        const copyElement = document.getElementById(id + "_COPY");
        if (copyElement) {
          console.log("Matching copy found!!!");
          newContainerPairs.set(iframe, copyElement);
        }

        iframe.style.visibility = 'hidden';

        const maxHeight = "80vh"

        iframe.style.maxHeight = "80vh";
        const topDiv = iframe.parentElement;
        const topTopDiv = iframe.parentElement?.parentElement;
        if (topDiv && topTopDiv) {
          topTopDiv.style.marginBottom = `-${topDiv.offsetHeight}px`;
          topTopDiv.style.maxHeight = '80vh';
          //topDiv.style.all = 'unset';
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
    console.log("VIDEO EFFECT LAUNCH");
    containerPairs.forEach((copy, original) => {
      const topDiv = original.parentElement?.parentElement;
      if (showSidebar) {
        console.log("HIDING:", original);
        original.style.visibility = "hidden";
        original.style.marginBottom = `-${original.offsetHeight}px`;
        if (topDiv) {
          topDiv.style.marginBottom = `-${topDiv.offsetHeight}px`;
        }
      } else {
        console.log("SHOWING:", original);
        original.style.visibility = "visible";
        original.style.marginBottom = `0px`;
        if (topDiv) {
          topDiv.style.marginBottom = `-0px`;
        }
      }
    });
  }, [showSidebar, containerPairs]);

  return (
    <div className="flex flex-column" ref={sidebarRef}>
      <MyST ast={containers} />
      <VideoHierarchy containerPairs = {containerPairs} />
      {/* {(firstElemIndex != null) && <VidButtons firstIndex={firstElemIndex} divElements={containerPairs.keys}/>} */}
    </div>
  );
};

export default SidebarVideoHandler;
