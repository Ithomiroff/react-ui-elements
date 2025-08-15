import { useEffect, useRef } from 'react';

export type GridCanvasProps = {
  columns: number;
  rows: number;
  gridGap?: number; // px between cells
  backgroundColor?: string;
  lineColor?: string;
  containerPadding?: number; // px
};

export default function GridCanvas({
  columns,
  rows,
  gridGap = 0,
  backgroundColor = '#0f1420',
  lineColor = 'rgba(255,255,255,0.12)',
  containerPadding = 0,
}: GridCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current!;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;

    function draw() {
      const width = container.clientWidth;
      const height = container.clientHeight;
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, width, height);

      const cellWidth = (width - containerPadding * 2 - (columns - 1) * gridGap) / columns;
      const cellHeight = (height - containerPadding * 2 - (rows - 1) * gridGap) / rows;

      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 1;

      for (let c = 0; c <= columns; c++) {
        const x = containerPadding + c * (cellWidth + gridGap);
        ctx.beginPath();
        ctx.moveTo(x, containerPadding);
        ctx.lineTo(x, height - containerPadding);
        ctx.stroke();
      }

      for (let r = 0; r <= rows; r++) {
        const y = containerPadding + r * (cellHeight + gridGap);
        ctx.beginPath();
        ctx.moveTo(containerPadding, y);
        ctx.lineTo(width - containerPadding, y);
        ctx.stroke();
      }
    }

    draw();

    const resizeObserver = new ResizeObserver(() => draw());
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, [columns, rows, gridGap, backgroundColor, lineColor, containerPadding]);

  return (
    <div ref={containerRef} style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <canvas ref={canvasRef} />
    </div>
  );
}