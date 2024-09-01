import React, { useEffect, useRef, useCallback } from 'react';

interface LineConnectorProps {
  pairs: { originalElement: HTMLElement; copyElement: HTMLElement }[];
}

const LineConnector: React.FC<LineConnectorProps> = ({ pairs }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const drawLines = useCallback(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    
    if (!canvas || !context) {
      console.error('Canvas or context is not available');
      return;
    }

    // Set canvas dimensions to match the document, not just the viewport
    canvas.width = document.documentElement.scrollWidth;
    canvas.height = document.documentElement.scrollHeight;

    // Clear canvas before drawing
    context.clearRect(0, 0, canvas.width, canvas.height);

    pairs.forEach(({ originalElement, copyElement }) => {

      
      const figures = document.querySelectorAll('figure');
      let hovering = false;
    
      for (const figure of figures) {
        if (figure.matches(':hover')) {
          if (figure === copyElement) {
            hovering = true;
            break;
          }
        }
      }

      if (originalElement && copyElement && hovering) {
        const originalRect = originalElement.getBoundingClientRect();
        const copyRect = copyElement.getBoundingClientRect();

        // Calculate positions relative to the document, not the viewport
        
        const startX = originalRect.left + window.pageXOffset + originalRect.width / 5;
        const startY = originalRect.top + window.pageYOffset + originalRect.height / 2;
        const endX = copyRect.left + window.pageXOffset;
        const endY = copyRect.top + window.pageYOffset + copyRect.height / 2;
        const radius = 0.2*(endY-startY);
        const midX = (endX + startX)/2;
        const midY = (endY + startY)/2;
        const midX1 = (midX + startX)/2;
        const midY1 = (midY + startY)/2 - radius;
        const midX2 = (endX + midX)/2;
        const midY2 = (endY + midY)/2 + radius;

        context.beginPath();
        context.strokeStyle = 'grey';
        context.lineWidth = 2;
        context.globalAlpha = 0.4;
        context.moveTo(startX, startY);
        context.quadraticCurveTo(midX1, midY1, midX, midY)
        context.quadraticCurveTo(midX2, midY2, endX, endY)
        context.stroke();
      }
    });
  }, [pairs]);

  const animateLines = useCallback(() => {
    drawLines();
    animationFrameRef.current = requestAnimationFrame(animateLines);
  }, [drawLines]);

  useEffect(() => {
    // Start the animation loop
    animateLines();

    // Clean up function
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [animateLines]);

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = document.documentElement.scrollWidth;
        canvasRef.current.height = document.documentElement.scrollHeight;
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 10,
      }}
    />
  );
};

export default LineConnector;