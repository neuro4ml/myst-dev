import React, { useEffect, useRef } from 'react';
import ReactDOMServer from 'react-dom/server';
import { EllipsisVertical } from 'lucide-react';

const GutterStyle: React.FC<{}> = () => {
  const guttersRef = useRef<HTMLDivElement[]>([]); // Create a ref to store gutter elements

  useEffect(() => {
    const gutters = document.querySelectorAll<HTMLElement>('.gutter');
    console.log("Gutters:", gutters);
    gutters.forEach((gutter) => {
      const gutterContents = document.createElement('div');
      gutterContents.style.display = "flex";
      gutterContents.style.height = "100%";
      gutterContents.style.width = "100%";
      gutterContents.style.alignItems = "center";
      gutterContents.style.backgroundColor = "rgb(59 130 246)";
      gutterContents.innerHTML = ReactDOMServer.renderToStaticMarkup(<EllipsisVertical size={"100%"} />);
      gutter.appendChild(gutterContents);
    });
  }, []);



  return (
    <>
    </>
  );
};

export default GutterStyle;
