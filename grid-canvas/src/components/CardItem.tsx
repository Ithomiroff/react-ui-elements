import type { CSSProperties } from 'react';
import { useMemo } from 'react';
import type { Card } from '../types';

export type CardItemProps = {
  card: Card;
  cellWidth: number;
  cellHeight: number;
  gridGap: number;
  padding: number;
  onDragStart: (cardId: string, startX: number, startY: number) => void;
  onResizeStart: (cardId: string, edge: 'left' | 'right' | 'top' | 'bottom', startX: number, startY: number) => void;
  isActive: boolean;
};

export default function CardItem({
  card,
  cellWidth,
  cellHeight,
  gridGap,
  padding,
  onDragStart,
  onResizeStart,
  isActive,
}: CardItemProps) {
  const left = useMemo(() => padding + card.x * cellWidth + Math.floor(card.x) * gridGap, [card.x, cellWidth, gridGap, padding]);
  const top = useMemo(() => padding + card.y * cellHeight + Math.floor(card.y) * gridGap, [card.y, cellHeight, gridGap, padding]);
  const widthPx = useMemo(() => card.width * cellWidth + (Math.ceil(card.width) - 1) * gridGap, [card.width, cellWidth, gridGap]);
  const heightPx = useMemo(() => card.height * cellHeight + (Math.ceil(card.height) - 1) * gridGap, [card.height, cellHeight, gridGap]);

  const style: CSSProperties = {
    position: 'absolute',
    left,
    top,
    width: widthPx,
    height: heightPx,
    background: card.color || 'rgba(100, 149, 237, 0.85)',
    border: isActive ? '2px solid #fff' : '1px solid rgba(255,255,255,0.35)',
    borderRadius: 8,
    boxSizing: 'border-box',
    cursor: 'grab',
    userSelect: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: 14,
  };

  function handleMouseDown(e: React.MouseEvent) {
    e.stopPropagation();
    onDragStart(card.id, e.clientX, e.clientY);
  }

  function startResize(edge: 'left' | 'right' | 'top' | 'bottom') {
    return (e: React.MouseEvent) => {
      e.stopPropagation();
      onResizeStart(card.id, edge, e.clientX, e.clientY);
    };
  }

  const handleStyle: CSSProperties = {
    position: 'absolute',
    background: 'transparent',
  };

  return (
    <div style={style} onMouseDown={handleMouseDown}>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 8 }} />
      </div>
      {card.title}
      <div title="resize-left" onMouseDown={startResize('left')} style={{ ...handleStyle, left: -4, top: 0, bottom: 0, width: 8, cursor: 'ew-resize' }} />
      <div title="resize-right" onMouseDown={startResize('right')} style={{ ...handleStyle, right: -4, top: 0, bottom: 0, width: 8, cursor: 'ew-resize' }} />
      <div title="resize-top" onMouseDown={startResize('top')} style={{ ...handleStyle, top: -4, left: 0, right: 0, height: 8, cursor: 'ns-resize' }} />
      <div title="resize-bottom" onMouseDown={startResize('bottom')} style={{ ...handleStyle, bottom: -4, left: 0, right: 0, height: 8, cursor: 'ns-resize' }} />
    </div>
  );
}