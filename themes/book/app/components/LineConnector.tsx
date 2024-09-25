import React, { useEffect, useRef, useCallback, useState } from 'react';

interface LineConnectorProps {
  containerPairs: Map<HTMLElement, HTMLElement>;
}

const LineConnector: React.FC<LineConnectorProps> = ({ containerPairs }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const hoverStartTimes = useRef<Map<HTMLElement, number>>(new Map());
  const [hoveredElements, setHoveredElements] = useState<Set<HTMLElement>>(new Set());

  const updateHoverState = useCallback(() => {
    const figures = document.querySelectorAll('figure');
    const newHoveredElements = new Set<HTMLElement>();

    figures.forEach((figure) => {
      if (figure.matches(':hover')) {
        newHoveredElements.add(figure as HTMLElement);
      }
    });

    setHoveredElements(newHoveredElements);
  }, []);

  const drawLines = useCallback((timestamp: number) => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    
    if (!canvas || !context) {
      console.error('Canvas or context is not available');
      return;
    }

    canvas.width = document.documentElement.scrollWidth;
    canvas.height = document.documentElement.scrollHeight;

    context.clearRect(0, 0, canvas.width, canvas.height);

    containerPairs.forEach((copy, original) => {
      if (original && copy && hoveredElements.has(copy)) {

        if (!hoverStartTimes.current.has(copy)) {
          hoverStartTimes.current.set(copy, timestamp);
        }

        const originalRect = original.getBoundingClientRect();
        const copyRect = copy.getBoundingClientRect();

        const startX = originalRect.left + window.pageXOffset + originalRect.width / 5;
        const startY = originalRect.top + window.pageYOffset + originalRect.height / 2;
        const endX = copyRect.left + window.pageXOffset;
        const endY = copyRect.top + window.pageYOffset + copyRect.height / 2;
        const radius = 0.2 * (endY - startY);
        const midX = (endX + startX) / 2;
        const midY = (endY + startY) / 2;
        const midX1 = (midX + startX) / 2;
        const midY1 = (midY + startY) / 2 - radius;
        const midX2 = (endX + midX) / 2;
        const midY2 = (endY + midY) / 2 + radius;

        const maxAlpha = 0.4;
        const transitionDuration = 150; // 0.15 seconds
        const hoverStartTime = hoverStartTimes.current.get(copy) || 0;
        const elapsed = Math.min((timestamp - hoverStartTime) / transitionDuration, 1);
        const alpha = elapsed * maxAlpha;

        context.beginPath();
        context.strokeStyle = 'grey';
        context.lineWidth = 2;
        context.globalAlpha = alpha;
        context.moveTo(startX, startY);
        context.quadraticCurveTo(midX1, midY1, midX, midY);
        context.quadraticCurveTo(midX2, midY2, endX, endY);
        context.stroke();
      } else {

        hoverStartTimes.current.delete(copy);
      }
    });
  }, [containerPairs, hoveredElements]);

  const animateLines = useCallback((timestamp: number) => {
    drawLines(timestamp);
    animationFrameRef.current = requestAnimationFrame(animateLines);
  }, [drawLines]);

  useEffect(() => {
    animationFrameRef.current = requestAnimationFrame(animateLines);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [animateLines]);

  useEffect(() => {
    window.addEventListener('mousemove', updateHoverState);
    window.addEventListener('resize', updateHoverState);

    return () => {
      window.removeEventListener('mousemove', updateHoverState);
      window.removeEventListener('resize', updateHoverState);
    };
  }, [updateHoverState]);

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
