import { useRef, useEffect } from "react";

import "./Graph.css";

type PropTypes = {
  fn: (x: number) => number | void;
  strokeStyle?: string;
  lineWidth?: number;
  backgroundColor?: string;
  width?: number;
  height?: number;
  xMin?: number;
  xMax?: number;
  yMin?: number;
  yMax?: number;
  interval?: number;
};

export default function Graph({
  fn = () => undefined,
  xMin = -10,
  xMax = 10,
  yMin = -10,
  yMax = 10,
  width = 1000,
  height = 1000,
  strokeStyle = "#fbf",
  lineWidth = 5,
  backgroundColor = "transparent",
  interval = 1,
}: PropTypes) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext?.("2d");
    if (!ctx || !canvas) return;

    // initialize canvas
    canvas.width = width;
    canvas.height = height;
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;
    const { width: w, height: h } = canvas;
    ctx.clearRect(0, 0, w, h);

    // draw graph
    const xScale = w / (xMax - xMin);
    const yScale = h / (yMax - yMin);
    for (let x = xMin; x <= xMax; x += interval / xScale) {
      if (
        typeof x !== "number" ||
        isNaN(x) ||
        x === Infinity ||
        x === -Infinity
      )
        continue;

      const y = fn(x);
      if (
        typeof y !== "number" ||
        isNaN(y) ||
        y === Infinity ||
        y === -Infinity
      )
        continue;

      const coords = {
        x: (x - xMin) * xScale,
        y: h - (y - yMin) * yScale,
      };
      ctx.lineTo(coords.x, coords.y);
    }

    ctx.stroke();
  }, [fn, xMin, xMax, yMin, yMax]);

  return (
    <canvas className="Graph" style={{ backgroundColor }} ref={canvasRef} />
  );
}
