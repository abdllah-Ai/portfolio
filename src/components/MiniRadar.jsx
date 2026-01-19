// src/components/MiniRadar.jsx
// Radar chart for skills overview
import React from 'react';

export default function MiniRadar({ data = [], size = 200 }) {
  if (!data.length) return null;

  const center = size / 2;
  const radius = (size - 60) / 2;
  const angleStep = (2 * Math.PI) / data.length;

  // Calculate points for the polygon
  const points = data.map((item, i) => {
    const angle = i * angleStep - Math.PI / 2; // Start from top
    const value = (item.value / 100) * radius;
    return {
      x: center + value * Math.cos(angle),
      y: center + value * Math.sin(angle),
      labelX: center + (radius + 25) * Math.cos(angle),
      labelY: center + (radius + 25) * Math.sin(angle),
      label: item.label,
      value: item.value,
    };
  });

  // Create polygon path
  const polygonPath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ') + ' Z';

  // Create grid circles
  const gridLevels = [25, 50, 75, 100];

  return (
    <svg width={size} height={size} className="mx-auto">
      <defs>
        <linearGradient id="radarFill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--acc-to)" stopOpacity="0.3" />
          <stop offset="100%" stopColor="var(--acc-from)" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id="radarStroke" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--acc-to)" />
          <stop offset="100%" stopColor="var(--acc-to)" />
        </linearGradient>
      </defs>

      {/* Grid circles */}
      {gridLevels.map((level) => (
        <circle
          key={level}
          cx={center}
          cy={center}
          r={(level / 100) * radius}
          fill="none"
          stroke="var(--border)"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
      ))}

      {/* Axis lines */}
      {data.map((_, i) => {
        const angle = i * angleStep - Math.PI / 2;
        return (
          <line
            key={i}
            x1={center}
            y1={center}
            x2={center + radius * Math.cos(angle)}
            y2={center + radius * Math.sin(angle)}
          stroke="var(--border)"
            strokeWidth="1"
          />
        );
      })}

      {/* Data polygon */}
      <path
        d={polygonPath}
        fill="url(#radarFill)"
        stroke="url(#radarStroke)"
        strokeWidth="2"
      />

      {/* Data points */}
      {points.map((point, i) => (
        <circle
          key={i}
          cx={point.x}
          cy={point.y}
          r="4"
          fill="var(--acc-to)"
        />
      ))}

      {/* Labels */}
      {points.map((point, i) => (
        <text
          key={i}
          x={point.labelX}
          y={point.labelY}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-[10px]"
          fill="var(--muted)"
        >
          {point.label.length > 12 ? point.label.slice(0, 10) + '…' : point.label}
        </text>
      ))}
    </svg>
  );
}
