import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import GridCanvas from './GridCanvas';
import CardItem from './CardItem';
import type { Card, DragMode } from '../types';
import { snapToHalf, tryMove, tryResize } from '../utils/gridMath';
import type { GridSpec } from '../utils/gridMath';

const GRID: GridSpec = { cols: 12, rows: 24 };

const GRID_GAP_PX = 8;
const PADDING_PX = 8;

export default function Board() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [cards, setCards] = useState<Card[]>(() => [
    { id: 'a', x: 0, y: 0, width: 3, height: 3, title: 'A', color: 'rgba(76,175,80,0.85)' },
    { id: 'b', x: 4, y: 2, width: 3, height: 3, title: 'B', color: 'rgba(244, 67, 54,0.85)' },
  ]);

  const [activeId, setActiveId] = useState<string | null>(null);
  const [dragMode, setDragMode] = useState<DragMode>(null);
  const startMouse = useRef<{ x: number; y: number } | null>(null);
  const startCard = useRef<Card | null>(null);

  const [cellSize, setCellSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 });

  const computeCellSize = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const width = el.clientWidth;
    const height = el.clientHeight;
    const w = (width - PADDING_PX * 2 - (GRID.cols - 1) * GRID_GAP_PX) / GRID.cols;
    const h = (height - PADDING_PX * 2 - (GRID.rows - 1) * GRID_GAP_PX) / GRID.rows;
    setCellSize({ w, h });
  }, []);

  useEffect(() => {
    computeCellSize();
    const ro = new ResizeObserver(() => computeCellSize());
    const el = containerRef.current;
    if (el) ro.observe(el);
    return () => ro.disconnect();
  }, [computeCellSize]);

  const onDragStart = useCallback((cardId: string, x: number, y: number) => {
    setActiveId(cardId);
    setDragMode('move');
    startMouse.current = { x, y };
    const c = cards.find((c) => c.id === cardId)!;
    startCard.current = { ...c };
  }, [cards]);

  const onResizeStart = useCallback((cardId: string, edge: 'left' | 'right' | 'top' | 'bottom', x: number, y: number) => {
    setActiveId(cardId);
    setDragMode(edge === 'left' ? 'resize-left' : edge === 'right' ? 'resize-right' : edge === 'top' ? 'resize-top' : 'resize-bottom');
    startMouse.current = { x, y };
    const c = cards.find((c) => c.id === cardId)!;
    startCard.current = { ...c };
  }, [cards]);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragMode || !startMouse.current || !startCard.current) return;
    const dxPx = e.clientX - startMouse.current.x;
    const dyPx = e.clientY - startMouse.current.y;
    const dxCells = snapToHalf(dxPx / cellSize.w);
    const dyCells = snapToHalf(dyPx / cellSize.h);

    setCards((prev) => {
      const idx = prev.findIndex((c) => c.id === activeId);
      if (idx === -1) return prev;
      const card = prev[idx];
      let updated = { ...card };

      if (dragMode === 'move') {
        const moved = tryMove(startCard.current!, dxCells, dyCells, GRID, prev);
        updated = { ...updated, ...moved };
      } else if (dragMode === 'resize-left') {
        updated = { ...updated, ...tryResize(startCard.current!, 'left', dxCells, GRID, prev) };
      } else if (dragMode === 'resize-right') {
        updated = { ...updated, ...tryResize(startCard.current!, 'right', dxCells, GRID, prev) };
      } else if (dragMode === 'resize-top') {
        updated = { ...updated, ...tryResize(startCard.current!, 'top', dyCells, GRID, prev) };
      } else if (dragMode === 'resize-bottom') {
        updated = { ...updated, ...tryResize(startCard.current!, 'bottom', dyCells, GRID, prev) };
      }

      const next = [...prev];
      next[idx] = updated;
      return next;
    });
  }, [activeId, dragMode, cellSize.w, cellSize.h]);

  const endInteraction = useCallback(() => {
    setDragMode(null);
    startMouse.current = null;
    startCard.current = null;
  }, []);

  const addCard = useCallback(() => {
    setCards((prev) => {
      const id = Math.random().toString(36).slice(2, 7);
      const newCard: Card = { id, x: 0, y: 0, width: 3, height: 3, title: id.toUpperCase() };
      return [...prev, newCard];
    });
  }, []);

  const { cellWidth, cellHeight } = useMemo(() => ({ cellWidth: cellSize.w, cellHeight: cellSize.h }), [cellSize]);

  return (
    <div
      ref={containerRef}
      onMouseMove={onMouseMove}
      onMouseUp={endInteraction}
      onMouseLeave={endInteraction}
      style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', background: '#0f1420' }}
    >
      <GridCanvas columns={GRID.cols} rows={GRID.rows} gridGap={GRID_GAP_PX} containerPadding={PADDING_PX} />
      <div style={{ position: 'absolute', inset: 0 }}>
        {cards.map((c) => (
          <CardItem
            key={c.id}
            card={c}
            cellWidth={cellWidth}
            cellHeight={cellHeight}
            gridGap={GRID_GAP_PX}
            padding={PADDING_PX}
            onDragStart={onDragStart}
            onResizeStart={onResizeStart}
            isActive={activeId === c.id}
          />
        ))}
      </div>

      <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 8 }}>
        <button onClick={addCard}>Добавить карточку 3x3</button>
        <span style={{ opacity: 0.8 }}>Сетка: 12 x 24, шаг 0.5 клетки</span>
      </div>
    </div>
  );
}