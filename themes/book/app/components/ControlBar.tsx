import React, { useEffect, useState } from 'react';
import { ArrowRightFromLine } from 'lucide-react';

interface ControlBarProps {
  hideTOC?: boolean;
  setHideTOC?: React.Dispatch<React.SetStateAction<boolean>>;
  showSidebar?: boolean;
  setShowSidebar?: React.Dispatch<React.SetStateAction<boolean>>;
}

const ControlBar: React.FC<ControlBarProps> = ({hideTOC, setHideTOC, showSidebar, setShowSidebar}) => {
  
  const [openControls, setOpenControls] = useState<Boolean>(false);

  const buttonStyle = "w-fit h-12 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white rounded-full flex items-center justify-center transition";

  const handleOpen = () => {
    setOpenControls(!openControls);
  };

  const handleShowSidebar = () => {
    if(setShowSidebar) {
      setShowSidebar(!showSidebar);
    }
  };

  const handleHideTOC = () => {
    if(setHideTOC) {
      setHideTOC(!hideTOC);
    }
    
  };

  return (
    <div className="h-screen z-10 flex flex-row justify-center items-center relative">
      {openControls && (<div className="flex flex-col h-screen justify-center bg-gray-100">
        <button onClick={handleShowSidebar} className={buttonStyle}>
          Toggle Splitscreen
        </button>
        <button className={buttonStyle}>
          Show Lines
        </button>
        <button onClick={handleHideTOC} className={buttonStyle}>
          Show ToC
        </button>
      </div>
      )}
      <div className="openerProps">
        <button onClick={handleOpen} className={buttonStyle + " w-4 opacity-50 hover:opacity-100"} style={{borderRadius: "0% 50% 50% 0%"}}>
          <ArrowRightFromLine className="transition duraiton-700" style={{transform: `rotate(${openControls ? "-180deg" : "0"})`}}/>
        </button>
      </div>
    </div>
  );
};

export default ControlBar;
