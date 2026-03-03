/**
 * Custom DateTimePicker Component
 * Matches Veil's design language: neutral colors, rounded corners, Inter Tight font
 * Uses portal to avoid overflow clipping issues
 */
"use client";

import { useState, useRef, useEffect } from "react";
import { IconChevronLeft, IconChevronRight, IconCalendar } from "@tabler/icons-react";
import { createPortal } from "react-dom";

interface DateTimePickerProps {
  value: string;
  onChange: (value: string) => void;
  min?: string;
  placeholder?: string;
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export default function DateTimePicker({ value, onChange, min, placeholder = "Select date & time" }: DateTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(value ? new Date(value) : null);
  const [hour, setHour] = useState(() => selectedDate ? selectedDate.getHours() : 12);
  const [minute, setMinute] = useState(() => selectedDate ? selectedDate.getMinutes() : 0);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0, openUpward: false });
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  const minDate = min ? new Date(min) : new Date();

  // Set mounted for portal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Update dropdown position when opened
  useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const dropdownHeight = 420; // Approximate height of dropdown
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      const openUpward = spaceBelow < dropdownHeight && spaceAbove > spaceBelow;
      
      setDropdownPosition({
        top: openUpward 
          ? rect.top + window.scrollY - dropdownHeight - 8 
          : rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
        width: Math.max(rect.width, 280),
        openUpward,
      });
    }
  }, [isOpen]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (containerRef.current && !containerRef.current.contains(target) && !target.closest('.datetime-dropdown')) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get days in month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get first day of month (0 = Sunday)
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const days: (number | null)[] = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  // Check if a day is disabled (before min date)
  const isDayDisabled = (day: number) => {
    const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), day, 23, 59, 59);
    return date < minDate;
  };

  // Check if a day is selected
  const isDaySelected = (day: number) => {
    if (!selectedDate) return false;
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === viewDate.getMonth() &&
      selectedDate.getFullYear() === viewDate.getFullYear()
    );
  };

  // Check if a day is today
  const isToday = (day: number) => {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === viewDate.getMonth() &&
      today.getFullYear() === viewDate.getFullYear()
    );
  };

  // Select a day
  const handleSelectDay = (day: number) => {
    if (isDayDisabled(day)) return;
    const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day, hour, minute);
    setSelectedDate(newDate);
  };

  // Navigate months
  const goToPrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  // Apply the selection
  const handleApply = () => {
    if (selectedDate) {
      const finalDate = new Date(selectedDate);
      finalDate.setHours(hour, minute);
      onChange(finalDate.toISOString().slice(0, 16));
    }
    setIsOpen(false);
  };

  // Clear selection
  const handleClear = () => {
    setSelectedDate(null);
    onChange("");
    setIsOpen(false);
  };

  // Format display value
  const formatDisplayValue = () => {
    if (!value) return "";
    const date = new Date(value);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const days = generateCalendarDays();

  const dropdown = isOpen && mounted ? createPortal(
    <div
      className="datetime-dropdown fixed z-[9999] bg-white rounded-xl border border-neutral-200 shadow-2xl p-3"
      style={{
        top: dropdownPosition.top,
        left: dropdownPosition.left,
        width: dropdownPosition.width,
        maxWidth: "calc(100vw - 32px)",
      }}
    >
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={goToPrevMonth}
          className="p-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
        >
          <IconChevronLeft className="w-4 h-4 text-neutral-600" stroke={2} />
        </button>
        <span className="font-satoshi text-xs font-semibold text-neutral-900">
          {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
        </span>
        <button
          type="button"
          onClick={goToNextMonth}
          className="p-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
        >
          <IconChevronRight className="w-4 h-4 text-neutral-600" stroke={2} />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {DAYS.map((day) => (
          <div key={day} className="text-center font-interTight text-[9px] text-neutral-400 font-semibold py-0.5 uppercase">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-0.5 mb-3">
        {days.map((day, i) => (
          <div key={i} className="flex items-center justify-center h-7">
            {day !== null && (
              <button
                type="button"
                onClick={() => handleSelectDay(day)}
                disabled={isDayDisabled(day)}
                className={`w-7 h-7 rounded-md font-interTight text-[11px] font-medium transition-all flex items-center justify-center ${
                  isDaySelected(day)
                    ? "bg-neutral-900 text-white"
                    : isToday(day)
                    ? "bg-neutral-100 text-neutral-900 ring-1 ring-neutral-300"
                    : isDayDisabled(day)
                    ? "text-neutral-300 cursor-not-allowed"
                    : "text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                {day}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Time picker */}
      <div className="border-t border-neutral-100 pt-3 mb-3">
        <div className="flex items-center justify-center gap-1.5">
          <span className="text-[10px] text-neutral-400 font-interTight font-medium mr-2">Time:</span>
          <select
            value={hour}
            onChange={(e) => setHour(parseInt(e.target.value))}
            className="px-2 py-1.5 rounded-md bg-neutral-50 border border-neutral-200 font-interTight text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
          >
            {Array.from({ length: 24 }, (_, i) => (
              <option key={i} value={i}>
                {i.toString().padStart(2, "0")}
              </option>
            ))}
          </select>
          <span className="font-satoshi text-neutral-900 font-bold">:</span>
          <select
            value={minute}
            onChange={(e) => setMinute(parseInt(e.target.value))}
            className="px-2 py-1.5 rounded-md bg-neutral-50 border border-neutral-200 font-interTight text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-neutral-900"
          >
            {Array.from({ length: 60 }, (_, i) => (
              <option key={i} value={i}>
                {i.toString().padStart(2, "0")}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleClear}
          className="flex-1 py-2 rounded-lg border border-neutral-200 font-interTight text-[11px] font-medium text-neutral-600 hover:bg-neutral-50 transition-colors"
        >
          Clear
        </button>
        <button
          type="button"
          onClick={handleApply}
          disabled={!selectedDate}
          className="flex-1 py-2 rounded-lg bg-neutral-900 text-white font-interTight text-[11px] font-medium hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Apply
        </button>
      </div>
    </div>,
    document.body
  ) : null;

  return (
    <div ref={containerRef} className="relative">
      {/* Input field */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-50 border border-neutral-200 text-neutral-900 cursor-pointer hover:border-neutral-300 transition-colors flex items-center justify-between"
      >
        <span className={`font-interTight text-xs ${value ? "text-neutral-900" : "text-neutral-400"}`}>
          {value ? formatDisplayValue() : placeholder}
        </span>
        <IconCalendar className="w-4 h-4 text-neutral-400" stroke={1.5} />
      </div>

      {dropdown}
    </div>
  );
}
