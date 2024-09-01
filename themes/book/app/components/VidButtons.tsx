import React, { useState, useEffect } from 'react';
import { ArrowUpToLine, ArrowDownToLine } from 'lucide-react';

interface VidButtonsProps {
  divElements: HTMLDivElement[];
}

const VidButtons: React.FC<VidButtonsProps> = ({ divElements }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFirstClick, setIsFirstClick] = useState(true);

  const scrollToElement = (index: number) => {
    if (divElements[index]) {
      console.log(`Scrolling to element ${divElements[index]} at index ${index}...`);
      divElements[index]?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };
  
  const handleUpClick = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex > 0 ? prevIndex - 1 : divElements.length - 1;
      scrollToElement(newIndex);
      return newIndex;
    });
  };
  
  const handleDownClick = () => {
    if (isFirstClick) {
      setCurrentIndex(0);
      scrollToElement(0);
      setIsFirstClick(false);
    } else {    
      setCurrentIndex((prevIndex) => {
        const newIndex = prevIndex < divElements.length - 1 ? prevIndex + 1 : 0;
        scrollToElement(newIndex);
        return newIndex;
      });
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