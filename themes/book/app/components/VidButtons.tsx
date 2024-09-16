import React, { useState, useEffect } from 'react';
import { ArrowUpToLine, ArrowDownToLine } from 'lucide-react';

interface VidButtonsProps {
  firstIndex: number | null;
  divElements: HTMLElement[];
}

const VidButtons: React.FC<VidButtonsProps> = ({ firstIndex, divElements }) => {

  const allowCyclicButtons = false;

  const scrollToElement = (index: number) => {
    const element = divElements[index];
  
    if (element) {
      console.log("Scrolling to element ", element, " at index ", index, "...");

      const scrollableParent = element.parentElement?.parentElement?.parentElement?.parentElement as HTMLElement;
  
      if (scrollableParent) {
        console.log("Scroll PArent: ", scrollableParent);

        const elementRect = element.getBoundingClientRect();
        const parentRect = scrollableParent.getBoundingClientRect();

        const offsetTop = elementRect.top - parentRect.top;
  
        const offset = 10;
  
        scrollableParent.scrollTo({
          top: scrollableParent.scrollTop + offsetTop - offset,
          behavior: 'smooth',
        });
      }
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
    <div className="flex justify-end h-full ml-2 mr-2 z-10">
      <div className="flex flex-col justify-between items-center h-full w-12">
        <div className="flex-1" />
        <div className="flex-1" />
        {(firstIndex != null) ? 
          ( (divElements[firstIndex - 1] || allowCyclicButtons) &&
          <button onClick={handleUpClick} className="w-12 h-12 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white rounded-full flex items-center justify-center">
            <ArrowUpToLine size={24} />
          </button> ) :
          null
        }
        <div className="flex items-center justify-center text-xl text-white font-semibold bg-blue-500 rounded-full p-1">
          {(firstIndex != null) ? (firstIndex + 1) : (null)}
        </div>
        {(firstIndex != null) ? 
          ( (divElements[firstIndex + 1] || allowCyclicButtons) &&
          <button onClick={handleDownClick} className="w-12 h-12 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white rounded-full flex items-center justify-center">
            <ArrowDownToLine size={24} />
          </button> ) :
          null
        }
        <div className="flex-1" />
        <div className="flex-1" />
      </div>
    </div>
  );
};

export default VidButtons;