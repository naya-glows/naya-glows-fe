"use client";

import { useMemo, useState } from "react";
import type { AdminOrderRow } from "../../../store/adminApi";

const ACCENT = "#4f7957";
const DAYS = 14;
const WIDTH = 640;
const HEIGHT = 220;
const PAD = { top: 16, right: 12, bottom: 24, left: 44 };

type Point = { date: Date; total: number };

function compactNgn(n: number): string {
  if (n >= 1_000_000) return `₦${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`;
  if (n >= 1_000) return `₦${(n / 1_000).toFixed(n % 1_000 === 0 ? 0 : 1)}K`;
  return `₦${Math.round(n)}`;
}

function buildDailyRevenue(orders: AdminOrderRow[]): Point[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days: Point[] = Array.from({ length: DAYS }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - (DAYS - 1 - i));
    return { date, total: 0 };
  });
  for (const order of orders) {
    if (order.status !== "PAID") continue;
    const created = new Date(order.createdAt);
    created.setHours(0, 0, 0, 0);
    const day = days.find((d) => d.date.getTime() === created.getTime());
    if (day) day.total += order.total;
  }
  return days;
}

// Daily paid-order revenue, last 14 days — the one trend worth a glance on
// an overview page (change over time, a single series, so no legend box:
// the card title already says what's plotted — see dataviz skill's
// marks-and-anatomy.md).
export default function RevenueChart({ orders }: { orders: AdminOrderRow[] }) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const points = useMemo(() => buildDailyRevenue(orders), [orders]);
  const maxValue = Math.max(...points.map((p) => p.total), 1);
  // Round the axis ceiling up to a clean step so gridline labels read as
  // tidy numbers rather than whatever the data happened to peak at.
  const niceMax = (() => {
    const magnitude = Math.pow(10, Math.floor(Math.log10(maxValue)));
    const steps = [1, 2, 2.5, 5, 10];
    for (const s of steps) {
      if (maxValue <= s * magnitude) return s * magnitude;
    }
    return 10 * magnitude;
  })();

  const plotWidth = WIDTH - PAD.left - PAD.right;
  const plotHeight = HEIGHT - PAD.top - PAD.bottom;
  const xFor = (i: number) => PAD.left + (i / (DAYS - 1)) * plotWidth;
  const yFor = (value: number) => PAD.top + plotHeight - (value / niceMax) * plotHeight;

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${xFor(i)} ${yFor(p.total)}`).join(" ");
  const areaPath = `${linePath} L ${xFor(DAYS - 1)} ${PAD.top + plotHeight} L ${xFor(0)} ${PAD.top + plotHeight} Z`;

  const gridSteps = [0, 0.25, 0.5, 0.75, 1];
  const total14d = points.reduce((sum, p) => sum + p.total, 0);
  const last = points[points.length - 1];

  const handlePointerMove = (e: React.PointerEvent<SVGRectElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = e.clientX - rect.left;
    const ratio = Math.min(1, Math.max(0, relX / rect.width));
    const index = Math.round(ratio * (DAYS - 1));
    setHoverIndex(index);
  };

  const hovered = hoverIndex !== null ? points[hoverIndex] : null;

  return (
    <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-2xl p-6 mt-6">
      <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
        <div>
          <h2 className="text-base font-semibold text-[#16241a]">Revenue, last 14 days</h2>
          <p className="text-sm text-[#16241a]/50">Paid orders only, by the day they were created.</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-semibold text-[#16241a]">{compactNgn(total14d)}</p>
          <p className="text-xs text-[#16241a]/45">total this period</p>
        </div>
      </div>

      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full h-auto"
        role="img"
        aria-label={`Daily paid-order revenue for the last ${DAYS} days, totalling ${compactNgn(total14d)}`}
      >
        {/* Hairline gridlines + Y ticks */}
        {gridSteps.map((step) => {
          const y = PAD.top + plotHeight - step * plotHeight;
          return (
            <g key={step}>
              <line x1={PAD.left} y1={y} x2={WIDTH - PAD.right} y2={y} stroke="#16241a" strokeOpacity={0.08} strokeWidth={1} />
              <text x={PAD.left - 8} y={y} textAnchor="end" dominantBaseline="middle" fontSize={10} fill="#16241a" fillOpacity={0.4}>
                {compactNgn(step * niceMax)}
              </text>
            </g>
          );
        })}

        {/* Area wash */}
        <path d={areaPath} fill={ACCENT} fillOpacity={0.1} stroke="none" />
        {/* Line */}
        <path d={linePath} fill="none" stroke={ACCENT} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />

        {/* X labels: first, middle, last */}
        {[0, Math.floor((DAYS - 1) / 2), DAYS - 1].map((i) => (
          <text
            key={i}
            x={xFor(i)}
            y={HEIGHT - 6}
            textAnchor={i === 0 ? "start" : i === DAYS - 1 ? "end" : "middle"}
            fontSize={10}
            fill="#16241a"
            fillOpacity={0.45}
          >
            {points[i].date.toLocaleDateString("en-NG", { month: "short", day: "numeric" })}
          </text>
        ))}

        {/* End marker + direct end-label */}
        <circle cx={xFor(DAYS - 1)} cy={yFor(last.total)} r={4} fill={ACCENT} stroke="#fff" strokeWidth={2} />
        <text
          x={xFor(DAYS - 1) - 8}
          y={yFor(last.total) - 10}
          textAnchor="end"
          fontSize={11}
          fontWeight={600}
          fill="#16241a"
        >
          {compactNgn(last.total)}
        </text>

        {/* Crosshair */}
        {hoverIndex !== null && (
          <line
            x1={xFor(hoverIndex)}
            y1={PAD.top}
            x2={xFor(hoverIndex)}
            y2={PAD.top + plotHeight}
            stroke="#16241a"
            strokeOpacity={0.25}
            strokeWidth={1}
          />
        )}
        {hovered && (
          <circle cx={xFor(hoverIndex!)} cy={yFor(hovered.total)} r={4} fill={ACCENT} stroke="#fff" strokeWidth={2} />
        )}

        {/* Hover hit area — the full plot width, snapping to nearest day */}
        <rect
          x={PAD.left}
          y={PAD.top}
          width={plotWidth}
          height={plotHeight}
          fill="transparent"
          onPointerMove={handlePointerMove}
          onPointerLeave={() => setHoverIndex(null)}
        />
      </svg>

      {hovered && (
        <div className="mt-2 text-xs text-[#16241a]/70">
          <span className="font-semibold text-[#16241a]">{compactNgn(hovered.total)}</span>{" "}
          — {hovered.date.toLocaleDateString("en-NG", { weekday: "short", month: "short", day: "numeric" })}
        </div>
      )}
    </div>
  );
}
