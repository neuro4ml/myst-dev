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

  return (
    <section className="h-full flex flex-col border-l px-1">
      <div className="pt-5"></div>
      <div className="pt-5"></div>
      <div className="pt-5"></div>

      <div className="flex-grow overflow-auto px-4">
        <div className="sidebarMediaBox cursor-pointer hover:no-underline">
          <SidebarMediaHandler showSidebar={showSidebar} containers={sidebarMedia} />
        </div>
      </div>

      <div className="flex-shrink-0">
        <SidebarVideoHandler showSidebar={showSidebar} containers={sidebarVideos} />
      </div>
    </section>
  );
  
};

export default SidebarMedia;
