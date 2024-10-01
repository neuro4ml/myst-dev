import React, { useState } from 'react';
import { ArrowRightFromLine } from 'lucide-react';

interface ControlBarProps {
  hideTOC?: boolean;
  setHideTOC?: React.Dispatch<React.SetStateAction<boolean>>;
  showSidebar?: boolean;
  setShowSidebar?: React.Dispatch<React.SetStateAction<boolean>>;
  showLines?: boolean;
  setShowLines?: React.Dispatch<React.SetStateAction<boolean>>;
}

const ControlBar: React.FC<ControlBarProps> = ({ hideTOC, setHideTOC, showSidebar, setShowSidebar, showLines, setShowLines }) => {
  const [openControls, setOpenControls] = useState<Boolean>(false);
  const [isFullyOpen, setIsFullyOpen] = useState<boolean>(true);

  const buttonStyle = "w-fit h-12 p-4 m-2 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white rounded-full flex items-center justify-center transition";
  const openerStyle = "w-4 h-12 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white rounded-full flex items-center justify-center transition opacity-50 hover:opacity-100";

  const handleOpen = () => {
    if (openControls) {
      setTimeout(() => {
        setIsFullyOpen(false);
      }, 300);
    } else {
      setIsFullyOpen(true);
    }
    setOpenControls(!openControls);
  };

  const handleShowSidebar = () => {
    if (setShowSidebar) {
      setShowSidebar(!showSidebar);
    }
  };

  const handleHideTOC = () => {
    if (setHideTOC) {
      setHideTOC(!hideTOC);
    }
  };

  const handleShowLines = () => {
    if (setShowLines) {
      setShowLines(!showLines);
    }
  };

  return (
    <div className="h-screen z-10 flex flex-row justify-center items-center relative">
      <div
        id="controlBarContent"
        className={`flex flex-col justify-start h-screen bg-gray-100 dark:bg-stone-800 transition-all duration-300 ease-in-out overflow-hidden`}
        style={{
          width: openControls ? '10rem' : '0px',
        }}
      >
        <div className="pt-5"></div>
        <div className="pt-5"></div>
        <div className="pt-5"></div>
        <div
          className={`w-full flex flex-col items-center transition-opacity duration-300 ease-in-out ${openControls ? 'opacity-100' : 'opacity-0'}`}
        >
          <button onClick={handleShowSidebar} className={buttonStyle}>
            Toggle Splitscreen
          </button>
          <button className={buttonStyle}>Show Lines</button>
          <button onClick={handleHideTOC} className={buttonStyle}>
            Show ToC
          </button>
        </div>
      </div>

      <div className="openerProps">
        <button onClick={handleOpen} className={openerStyle} style={{ borderRadius: "0% 50% 50% 0%" }}>
          <ArrowRightFromLine
            className="transition duration-700"
            style={{ transform: `rotate(${openControls ? "-180deg" : "0"})` }}
          />
        </button>
      </div>
    </div>
  );
};

export default ControlBar;
