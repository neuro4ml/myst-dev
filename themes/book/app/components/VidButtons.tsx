import React, { useState, useEffect } from 'react';
import { ArrowUpToLine, ArrowDownToLine } from 'lucide-react';

interface VidButtonsProps {
  firstIndex: number | null;
  divElements: HTMLElement[];
}

const VidButtons: React.FC<VidButtonsProps> = ({ firstIndex, divElements }) => {

  const scrollToElement = (index: number) => {
    const element = divElements[index]
    if (element) {
      console.log("Scrolling to element ", element, " at index ", index, "...");
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };
  
  const handleUpClick = () => {
    console.log(firstIndex);
    if (firstIndex != null) {
      scrollToElement(firstIndex > 0 ? firstIndex - 1 : divElements.length - 1)
    }
  };
  
  const handleDownClick = () => {
    console.log(firstIndex);
    if (firstIndex != null) {
      scrollToElement(firstIndex < divElements.length - 1 ? firstIndex + 1 : 0)
    }
  };
  
  return (
    <div className="flex justify-end h-full ml-2">
      <div className="flex flex-col justify-between items-center h-full w-12">
        <div className="flex-1" />
        <button onClick={handleUpClick} className="w-12 h-12 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white rounded-full flex items-center justify-center">
          <ArrowUpToLine size={24} />
        </button>
        <div className="flex-1" />
        <button onClick={handleDownClick} className="w-12 h-12 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white rounded-full flex items-center justify-center">
          <ArrowDownToLine size={24} />
        </button>
        <div className="flex-1" />
      </div>
    </div>
  );
};

export default VidButtons;