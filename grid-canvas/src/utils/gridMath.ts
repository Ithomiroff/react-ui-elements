import type { Card, GridRect } from '../types';

export type GridSpec = {
  cols: number; // 12
  rows: number; // 24
};

export function snapToHalf(value: number): number {
  return Math.round(value * 2) / 2;
}

export function clampRectToBounds(rect: GridRect, grid: GridSpec): GridRect {
  const clamped: GridRect = { ...rect };
  if (clamped.x < 0) clamped.x = 0;
  if (clamped.y < 0) clamped.y = 0;
  if (clamped.x + clamped.width > grid.cols) clamped.x = snapToHalf(grid.cols - clamped.width);
  if (clamped.y + clamped.height > grid.rows) clamped.y = snapToHalf(grid.rows - clamped.height);
  clamped.x = Math.max(0, Math.min(clamped.x, grid.cols - clamped.width));
  clamped.y = Math.max(0, Math.min(clamped.y, grid.rows - clamped.height));
  return {
    x: snapToHalf(clamped.x),
    y: snapToHalf(clamped.y),
    width: snapToHalf(Math.min(clamped.width, grid.cols)),
    height: snapToHalf(Math.min(clamped.height, grid.rows)),
  };
}

export function rectsOverlap(a: GridRect, b: GridRect): boolean {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

export function isAreaFree(candidate: GridRect, cards: Card[], ignoreId?: string): boolean {
  return !cards.some((c) => c.id !== ignoreId && rectsOverlap(candidate, c));
}

export function tryMove(card: Card, dx: number, dy: number, grid: GridSpec, cards: Card[]): GridRect {
  const target: GridRect = {
    x: snapToHalf(card.x + dx),
    y: snapToHalf(card.y + dy),
    width: card.width,
    height: card.height,
  };
  const bounded = clampRectToBounds(target, grid);
  if (isAreaFree(bounded, cards, card.id)) return bounded;
  // attempt axis-aligned moves if diagonal blocked
  const onlyX = clampRectToBounds({ ...target, y: card.y }, grid);
  if (isAreaFree(onlyX, cards, card.id)) return onlyX;
  const onlyY = clampRectToBounds({ ...target, x: card.x }, grid);
  if (isAreaFree(onlyY, cards, card.id)) return onlyY;
  return { x: card.x, y: card.y, width: card.width, height: card.height };
}

export function tryResize(
  card: Card,
  edge: 'left' | 'right' | 'top' | 'bottom',
  delta: number,
  grid: GridSpec,
  cards: Card[],
): GridRect {
  let candidate: GridRect = { x: card.x, y: card.y, width: card.width, height: card.height };

  if (edge === 'right') {
    candidate.width = snapToHalf(Math.max(0.5, Math.min(grid.cols - card.x, card.width + delta)));
  } else if (edge === 'left') {
    const newX = snapToHalf(Math.max(0, Math.min(card.x + card.width - 0.5, card.x + delta)));
    const newWidth = snapToHalf(card.width + (card.x - newX));
    candidate.x = newX;
    candidate.width = newWidth;
  } else if (edge === 'bottom') {
    candidate.height = snapToHalf(Math.max(0.5, Math.min(grid.rows - card.y, card.height + delta)));
  } else if (edge === 'top') {
    const newY = snapToHalf(Math.max(0, Math.min(card.y + card.height - 0.5, card.y + delta)));
    const newHeight = snapToHalf(card.height + (card.y - newY));
    candidate.y = newY;
    candidate.height = newHeight;
  }

  candidate = clampRectToBounds(candidate, grid);
  if (candidate.width < 0.5 || candidate.height < 0.5) return card;
  if (isAreaFree(candidate, cards, card.id)) return candidate;
  return card;
}