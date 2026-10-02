import React from 'react';

interface GridBackgroundProps {
  zoom: number;
  pan: { x: number; y: number };
}

export const GridBackground: React.FC<GridBackgroundProps> = ({ zoom, pan }) => {
  const gridSize = 32 * zoom;
  const majorGridSize = gridSize * 4;
  const offsetX = pan.x % gridSize;
  const offsetY = pan.y % gridSize;
  const majorOffsetX = pan.x % majorGridSize;
  const majorOffsetY = pan.y % majorGridSize;

  // Grid becomes subtly more prominent when zoomed in, less when zoomed out
  const opacity = Math.min(Math.max(zoom * 0.04, 0.02), 0.08);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern
            id="subtle-dot-grid"
            width={gridSize}
            height={gridSize}
            patternUnits="userSpaceOnUse"
            x={offsetX}
            y={offsetY}
          >
            <circle cx="1" cy="1" r={Math.max(0.75 * zoom, 0.5)} fill="#ffffff" fillOpacity={opacity} />
          </pattern>
          <pattern
            id="major-cross-grid"
            width={majorGridSize}
            height={majorGridSize}
            patternUnits="userSpaceOnUse"
            x={majorOffsetX}
            y={majorOffsetY}
          >
            <path
              d={`M ${majorGridSize / 2 - 4} ${majorGridSize / 2} h 8 M ${majorGridSize / 2} ${majorGridSize / 2 - 4} v 8`}
              stroke="#ffffff"
              strokeOpacity={opacity * 1.5}
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#subtle-dot-grid)" />
        <rect width="100%" height="100%" fill="url(#major-cross-grid)" />
      </svg>
    </div>
  );
};
