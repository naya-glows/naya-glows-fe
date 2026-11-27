"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Ported from cevver-mvp-fe's src/components/UI/Calendar (its "free
// navigation" mode — markedDates/onDateClick, not the event-sorted mode)
// and adapted: Tailwind instead of SCSS modules, this site's own palette,
// plus a selected-date highlight the source component didn't have (it only
// distinguished "today" and "has an event", with nothing to show which day
// the viewer had actually picked).

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function toDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

type CalendarDay = {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isDisabled: boolean;
};

export default function MonthCalendar({
  selectedDate,
  onSelectDate,
  isDateDisabled,
  minDate,
  maxDate,
}: {
  /** YYYY-MM-DD, or null if nothing picked yet. */
  selectedDate: string | null;
  onSelectDate: (dateKey: string) => void;
  /** Return true to grey out and disable a date (e.g. Sundays). */
  isDateDisabled?: (date: Date) => boolean;
  minDate?: Date;
  maxDate?: Date;
}) {
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const selected = useMemo(() => (selectedDate ? new Date(`${selectedDate}T00:00:00`) : null), [selectedDate]);

  const [viewYear, setViewYear] = useState(selected?.getFullYear() ?? today.getFullYear());
  const [viewMonth, setViewMonth] = useState(selected?.getMonth() ?? today.getMonth());

  const canGoPrev = !minDate || new Date(viewYear, viewMonth, 1) > new Date(minDate.getFullYear(), minDate.getMonth(), 1);
  const canGoNext = !maxDate || new Date(viewYear, viewMonth, 1) < new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);

  const navigate = (delta: -1 | 1) => {
    let y = viewYear;
    let m = viewMonth + delta;
    if (m > 11) {
      m = 0;
      y += 1;
    } else if (m < 0) {
      m = 11;
      y -= 1;
    }
    setViewYear(y);
    setViewMonth(m);
  };

  const cells = useMemo<CalendarDay[]>(() => {
    const firstOfMonth = new Date(viewYear, viewMonth, 1);
    const startDow = firstOfMonth.getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const result: CalendarDay[] = [];

    for (let i = startDow - 1; i >= 0; i--) {
      const daysInPrev = new Date(viewYear, viewMonth, 0).getDate();
      const date = new Date(viewYear, viewMonth - 1, daysInPrev - i);
      result.push({ date, isCurrentMonth: false, isToday: false, isSelected: false, isDisabled: true });
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(viewYear, viewMonth, d);
      const outOfRange = (minDate && date < minDate) || (maxDate && date > maxDate);
      result.push({
        date,
        isCurrentMonth: true,
        isToday: isSameDay(date, today),
        isSelected: selected ? isSameDay(date, selected) : false,
        isDisabled: Boolean(outOfRange) || Boolean(isDateDisabled?.(date)),
      });
    }

    const remainder = result.length % 7;
    if (remainder !== 0) {
      for (let d = 1; d <= 7 - remainder; d++) {
        const date = new Date(viewYear, viewMonth + 1, d);
        result.push({ date, isCurrentMonth: false, isToday: false, isSelected: false, isDisabled: true });
      }
    }

    return result;
  }, [viewYear, viewMonth, today, selected, minDate, maxDate, isDateDisabled]);

  return (
    <div className="bg-white/70 border border-white/60 rounded-2xl p-4 sm:p-5">
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          disabled={!canGoPrev}
          aria-label="Previous month"
          className="w-8 h-8 rounded-full flex items-center justify-center text-[#16241a]/60 hover:bg-[#d4e8d0] transition-colors disabled:opacity-25 disabled:hover:bg-transparent"
        >
          <ChevronLeft size={16} />
        </button>
        <p className="text-sm font-semibold">
          {MONTH_NAMES[viewMonth]} <span className="text-[#16241a]/45 font-normal">{viewYear}</span>
        </p>
        <button
          type="button"
          onClick={() => navigate(1)}
          disabled={!canGoNext}
          aria-label="Next month"
          className="w-8 h-8 rounded-full flex items-center justify-center text-[#16241a]/60 hover:bg-[#d4e8d0] transition-colors disabled:opacity-25 disabled:hover:bg-transparent"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-7 mb-1">
        {DAY_LABELS.map((d) => (
          <span key={d} className="text-[10px] font-semibold uppercase tracking-wide text-[#16241a]/40 text-center py-1">
            {d}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((cell, i) => (
          <button
            key={i}
            type="button"
            disabled={cell.isDisabled}
            onClick={() => onSelectDate(toDateKey(cell.date))}
            className={`aspect-square rounded-lg text-sm flex items-center justify-center transition-colors ${
              !cell.isCurrentMonth
                ? "text-transparent pointer-events-none"
                : cell.isSelected
                  ? "bg-[#16241a] text-white font-semibold"
                  : cell.isDisabled
                    ? "text-[#16241a]/20 cursor-not-allowed"
                    : cell.isToday
                      ? "text-[#4f7957] font-semibold hover:bg-[#d4e8d0]"
                      : "text-[#16241a]/80 hover:bg-[#d4e8d0]/50"
            }`}
          >
            {cell.date.getDate()}
          </button>
        ))}
      </div>
    </div>
  );
}
