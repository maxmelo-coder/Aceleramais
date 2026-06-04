'use client';
import React from 'react';
import type { ChartDataPoint } from '@/lib/types';

// ── Bar Chart (vertical) ─────────────────────────────────────
interface BarChartProps {
  data: ChartDataPoint[];
  height?: number;
  maxValue?: number;
  unit?: string;
  color?: string;
}

export function BarChart({ data, height = 200, maxValue, unit = '', color = '#2E8C99' }: BarChartProps) {
  const max = maxValue ?? Math.max(...data.map(d => d.value)) * 1.1;
  const barWidth = 100 / (data.length * 2);

  return (
    <div className="w-full" style={{ height }}>
      <svg viewBox={`0 0 400 ${height}`} className="w-full h-full" preserveAspectRatio="none">
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map(p => (
          <line key={p} x1="0" y1={height * (1 - p / 100)} x2="400" y2={height * (1 - p / 100)}
            stroke="#E8EAED" strokeWidth="1" />
        ))}
        {data.map((d, i) => {
          const x = (i / data.length) * 400 + (400 / data.length) * 0.15;
          const barH = (d.value / max) * (height - 30);
          const y = height - 30 - barH;
          const bw = (400 / data.length) * 0.7;
          const fill = d.color ?? color;
          return (
            <g key={d.label}>
              <rect x={x} y={y} width={bw} height={barH} fill={fill} rx="3" opacity="0.9" />
              <text x={x + bw / 2} y={y - 4} textAnchor="middle" fontSize="11" fill="#374151" fontWeight="600">
                {d.value > 0 ? `${d.value}${unit}` : ''}
              </text>
              <text x={x + bw / 2} y={height - 6} textAnchor="middle" fontSize="10" fill="#6B7280">
                {d.label.length > 10 ? d.label.slice(0, 10) + '…' : d.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ── Horizontal Bar Chart ─────────────────────────────────────
interface HBarChartProps { data: ChartDataPoint[]; maxValue?: number; unit?: string; }

export function HBarChart({ data, maxValue, unit = '%' }: HBarChartProps) {
  const max = maxValue ?? 100;
  return (
    <div className="space-y-3">
      {data.map(d => (
        <div key={d.label}>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-700 font-medium">{d.label}</span>
            <span className="text-gray-500 font-semibold">{d.value}{unit}</span>
          </div>
          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${(d.value / max) * 100}%`, backgroundColor: d.color ?? '#2E8C99' }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Donut Chart ──────────────────────────────────────────────
interface DonutChartProps {
  data: ChartDataPoint[];
  size?: number;
  centerLabel?: string;
  centerValue?: string;
}

export function DonutChart({ data, size = 160, centerLabel, centerValue }: DonutChartProps) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const r = 56;
  const cx = size / 2;
  const cy = size / 2;
  const strokeW = 22;
  const circumference = 2 * Math.PI * r;

  let offset = 0;
  const segments = data.map((d, i) => {
    const pct = d.value / total;
    const dashLen = pct * circumference;
    const dashOffset = circumference - offset;
    offset += dashLen;
    return { ...d, dashLen, dashOffset, rotate: (offset / circumference) * 360 - (dashLen / circumference) * 360 };
  });

  const colors = ['#2E8C99', '#F48B1B', '#4BAAB6', '#FFA94D', '#226E79', '#D4720E'];

  return (
    <div className="flex items-center gap-6">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="flex-shrink-0">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#F3F4F6" strokeWidth={strokeW} />
        {(() => {
          let startAngle = -90;
          return segments.map((seg, i) => {
            const angle = (seg.value / total) * 360;
            const startRad = (startAngle * Math.PI) / 180;
            const endRad = ((startAngle + angle) * Math.PI) / 180;
            const x1 = cx + r * Math.cos(startRad);
            const y1 = cy + r * Math.sin(startRad);
            const x2 = cx + r * Math.cos(endRad);
            const y2 = cy + r * Math.sin(endRad);
            const largeArc = angle > 180 ? 1 : 0;
            startAngle += angle;
            return (
              <path
                key={seg.label}
                d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`}
                fill={seg.color ?? colors[i % colors.length]}
                opacity="0.9"
              />
            );
          });
        })()}
        <circle cx={cx} cy={cy} r={r - strokeW / 2 + 4} fill="white" />
        {centerValue && (
          <>
            <text x={cx} y={cy - 4} textAnchor="middle" fontSize="18" fontWeight="700" fill="#060606">{centerValue}</text>
            {centerLabel && <text x={cx} y={cy + 14} textAnchor="middle" fontSize="10" fill="#6B7280">{centerLabel}</text>}
          </>
        )}
      </svg>
      <div className="space-y-2 flex-1 min-w-0">
        {data.map((d, i) => (
          <div key={d.label} className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: d.color ?? colors[i % colors.length] }} />
            <span className="text-gray-600 truncate flex-1">{d.label}</span>
            <span className="font-semibold text-gray-800">{d.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Line Chart ───────────────────────────────────────────────
interface LineChartProps { data: ChartDataPoint[]; height?: number; color?: string; maxValue?: number; }

export function LineChart({ data, height = 140, color = '#2E8C99', maxValue }: LineChartProps) {
  const max = maxValue ?? Math.max(...data.map(d => d.value)) * 1.15;
  const w = 400;
  const pad = 30;
  const innerW = w - pad * 2;
  const innerH = height - pad * 2;

  const pts = data.map((d, i) => ({
    x: pad + (i / (data.length - 1)) * innerW,
    y: pad + (1 - d.value / max) * innerH,
    ...d,
  }));

  const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const area = `${path} L ${pts[pts.length - 1].x} ${pad + innerH} L ${pts[0].x} ${pad + innerH} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${height}`} className="w-full" style={{ height }}>
      {[0, 33, 66, 100].map(p => (
        <line key={p} x1={pad} y1={pad + (1 - p / 100) * innerH} x2={w - pad} y2={pad + (1 - p / 100) * innerH}
          stroke="#E8EAED" strokeWidth="1" strokeDasharray="4 2" />
      ))}
      <path d={area} fill={color} opacity="0.1" />
      <path d={path} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={4} fill={color} />
          <text x={p.x} y={p.y - 8} textAnchor="middle" fontSize="11" fill="#374151" fontWeight="600">
            {p.value > 0 ? p.value : ''}
          </text>
          <text x={p.x} y={height - 4} textAnchor="middle" fontSize="10" fill="#6B7280">{p.label}</text>
        </g>
      ))}
    </svg>
  );
}

// ── Gauge / Progress Ring ─────────────────────────────────────
interface GaugeProps { value: number; max?: number; label?: string; color?: string; size?: number; }

export function Gauge({ value, max = 100, label, color = '#F48B1B', size = 120 }: GaugeProps) {
  const pct = Math.min(value / max, 1);
  const r = 44;
  const cx = size / 2;
  const cy = size / 2;
  const circ = 2 * Math.PI * r;
  const dash = pct * circ;

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#E8EAED" strokeWidth="10" />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={`${dash} ${circ - dash}`}
          strokeDashoffset={circ / 4}
          strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cy})`}
        />
        <text x={cx} y={cy + 6} textAnchor="middle" fontSize="20" fontWeight="700" fill="#060606">{value}</text>
      </svg>
      {label && <p className="text-xs text-gray-500 text-center mt-1">{label}</p>}
    </div>
  );
}

// ── Radar Chart (simple polygon) ──────────────────────────────
interface RadarChartProps { data: ChartDataPoint[]; size?: number; }

export function RadarChart({ data, size = 200 }: RadarChartProps) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 30;
  const n = data.length;
  const max = 100;

  const angleStep = (2 * Math.PI) / n;
  const getPoint = (index: number, value: number) => {
    const angle = index * angleStep - Math.PI / 2;
    return {
      x: cx + (value / max) * r * Math.cos(angle),
      y: cy + (value / max) * r * Math.sin(angle),
    };
  };

  const gridPoints = (level: number) =>
    data.map((_, i) => getPoint(i, level)).map(p => `${p.x},${p.y}`).join(' ');

  const valuePoints = data.map((d, i) => getPoint(i, d.value)).map(p => `${p.x},${p.y}`).join(' ');

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {[20, 40, 60, 80, 100].map(level => (
        <polygon key={level} points={gridPoints(level)} fill="none" stroke="#E8EAED" strokeWidth="1" />
      ))}
      {data.map((_, i) => {
        const p = getPoint(i, 100);
        return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="#E8EAED" strokeWidth="1" />;
      })}
      <polygon points={valuePoints} fill="#2E8C99" fillOpacity="0.2" stroke="#2E8C99" strokeWidth="2" />
      {data.map((d, i) => {
        const pt = getPoint(i, d.value);
        const lp = getPoint(i, 115);
        return (
          <g key={d.label}>
            <circle cx={pt.x} cy={pt.y} r={3} fill="#2E8C99" />
            <text x={lp.x} y={lp.y + 4} textAnchor="middle" fontSize="9" fill="#374151" fontWeight="600">
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
