import { GenericNode } from "myst-common";
import { MyST } from "myst-to-react";
import React, { useEffect, useRef, useState } from "react";
import SidebarMediaHandler from "./SidebarMediaHandler";
import SidebarVideoHandler from "./SidebarVideoHandler";

interface SidebarMediaProps {
  showSidebar: boolean;
  showLines: boolean;
  sidebarMedia: GenericNode[];
  sidebarVideos: GenericNode[];
}

const SidebarMedia: React.FC<SidebarMediaProps> = ({ showSidebar, sidebarMedia, sidebarVideos, showLines }) => {

  return (
    <section className="h-full flex flex-col border-l px-1">
      <div className="pt-5"></div>
      <div className="pt-5"></div>
      <div className="pt-5"></div>

      <div className="flex-grow overflow-auto px-4">
        <div className="sidebarMediaBox cursor-pointer hover:no-underline">
          <SidebarMediaHandler showSidebar={showSidebar} containers={sidebarMedia} showLines={showLines} />
        </div>
      </div>

      <div className="flex-shrink-0" style={{margin: "0 0 auto 0"}}>
        <SidebarVideoHandler showSidebar={showSidebar} containers={sidebarVideos} showLines={showLines}/>
      </div>
    </section>
  );
  
};

export default SidebarMedia;
