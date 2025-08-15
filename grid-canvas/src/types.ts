export type GridRect = {
  x: number; // left in grid cells (can be 0.5 steps)
  y: number; // top in grid cells (can be 0.5 steps)
  width: number; // in grid cells (can be 0.5 steps)
  height: number; // in grid cells (can be 0.5 steps)
};

export type Card = GridRect & {
  id: string;
  title?: string;
  color?: string;
};

export type DragMode =
  | 'move'
  | 'resize-left'
  | 'resize-right'
  | 'resize-top'
  | 'resize-bottom'
  | null;