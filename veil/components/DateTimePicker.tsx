/**
 * Custom DateTimePicker Component
 * Matches Veil's design language: neutral colors, rounded corners, Inter Tight font
 */
"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconChevronLeft,
  IconChevronRight,
  IconCalendar,
  IconX,
} from "@tabler/icons-react";

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
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(value ? new Date(value) : null);
  const [hour, setHour] = useState(selectedDate ? selectedDate.getHours() : 12);
  const [minute, setMinute] = useState(selectedDate ? selectedDate.getMinutes() : 0);
  const containerRef = useRef<HTMLDivElement>(null);

  const minDate = min ? new Date(min) : new Date();

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
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

    // Empty slots for days before first day
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  // Check if a day is disabled
  const isDayDisabled = (day: number) => {
    const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    date.setHours(23, 59, 59);
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

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-2 z-50 bg-white rounded-xl border border-neutral-200 shadow-xl p-4 w-72"
          >
            {/* Month navigation */}
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={goToPrevMonth}
                className="p-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
              >
                <IconChevronLeft className="w-4 h-4 text-neutral-600" stroke={1.5} />
              </button>
              <span className="font-satoshi text-sm font-semibold text-neutral-900">
                {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
              </span>
              <button
                type="button"
                onClick={goToNextMonth}
                className="p-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
              >
                <IconChevronRight className="w-4 h-4 text-neutral-600" stroke={1.5} />
              </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {DAYS.map((day) => (
                <div key={day} className="text-center font-interTight text-[10px] text-neutral-400 font-medium py-1">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1 mb-4">
              {days.map((day, i) => (
                <div key={i} className="aspect-square">
                  {day && (
                    <button
                      type="button"
                      onClick={() => handleSelectDay(day)}
                      disabled={isDayDisabled(day)}
                      className={`w-full h-full rounded-lg font-interTight text-xs font-medium transition-all ${
                        isDaySelected(day)
                          ? "bg-neutral-900 text-white"
                          : isToday(day)
                          ? "bg-neutral-100 text-neutral-900"
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
            <div className="border-t border-neutral-100 pt-4 mb-4">
              <div className="flex items-center justify-center gap-2">
                <select
                  value={hour}
                  onChange={(e) => setHour(parseInt(e.target.value))}
                  className="px-3 py-2 rounded-lg bg-neutral-50 border border-neutral-200 font-interTight text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
                >
                  {Array.from({ length: 24 }, (_, i) => (
                    <option key={i} value={i}>
                      {i.toString().padStart(2, "0")}
                    </option>
                  ))}
                </select>
                <span className="font-satoshi text-neutral-400 font-medium">:</span>
                <select
                  value={minute}
                  onChange={(e) => setMinute(parseInt(e.target.value))}
                  className="px-3 py-2 rounded-lg bg-neutral-50 border border-neutral-200 font-interTight text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent"
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
                className="flex-1 py-2 rounded-lg border border-neutral-200 font-interTight text-xs font-medium text-neutral-600 hover:bg-neutral-50 transition-colors"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={handleApply}
                disabled={!selectedDate}
                className="flex-1 py-2 rounded-lg bg-neutral-900 text-white font-interTight text-xs font-medium hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Apply
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
