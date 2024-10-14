interface ForecastCardProps {
  children?: React.ReactNode;
  onDragStart: (event: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
  bgImageUrl?: string;
}

export type { ForecastCardProps };
