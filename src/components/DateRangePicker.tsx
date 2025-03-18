"use client";

import * as React from "react";
import {
  format,
  isAfter,
  isBefore,
  isSameDay,
  setMonth,
  setYear,
  addMonths,
  subDays,
  startOfMonth,
  endOfMonth,
  startOfDay,
  subMonths,
  isSameMonth,
  isSameYear,
} from "date-fns";
import { CalendarIcon, ChevronLeft, ChevronRight, Check } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card } from "@/components/ui/card";

type DatePickerWithRangeProps = React.HTMLAttributes<HTMLDivElement> & {
  dateRange?: DateRange;
  onDateRangeChange?: (range: DateRange | undefined) => void;
  minDate?: Date;
  maxDate?: Date;
};

type PresetOption = {
  label: string;
  value: string;
  getDateRange: (minDate: Date, maxDate: Date) => DateRange;
};

export function DatePickerWithRange({
  className,
  dateRange,
  onDateRangeChange,
  minDate: propMinDate,
  maxDate: propMaxDate,
  ...props
}: DatePickerWithRangeProps) {
  // Default min date to January 1, 2017 if not provided
  const minDate = React.useMemo(
    () => propMinDate || new Date(2017, 0, 1),
    [propMinDate],
  );

  // Default max date to today if not provided
  const maxDate = React.useMemo(() => propMaxDate || new Date(), [propMaxDate]);

  const [date, setDate] = React.useState<DateRange | undefined>(() => {
    if (dateRange) {
      // Ensure the provided dateRange is within min and max constraints
      const constrainedFrom = isBefore(dateRange.from, minDate)
        ? minDate
        : dateRange.from;
      const constrainedTo = isAfter(dateRange.to || constrainedFrom, maxDate)
        ? maxDate
        : dateRange.to || constrainedFrom;
      return { from: constrainedFrom, to: constrainedTo };
    }

    // Default to a range within the last week, respecting min/max constraints
    const today = new Date();
    const sevenDaysAgo = subDays(today, 6);
    const constrainedFrom = isBefore(sevenDaysAgo, minDate)
      ? minDate
      : sevenDaysAgo;
    const constrainedTo = isAfter(today, maxDate) ? maxDate : today;

    return { from: constrainedFrom, to: constrainedTo };
  });

  const [isOpen, setIsOpen] = React.useState(false);
  const [firstView, setFirstView] = React.useState<
    "calendar" | "month" | "year"
  >("calendar");
  const [secondView, setSecondView] = React.useState<
    "calendar" | "month" | "year"
  >("calendar");

  // Initialize calendar months within constraints
  const [firstMonth, setFirstMonth] = React.useState<Date>(() => {
    if (date?.from && !isBefore(date.from, minDate)) {
      return date.from;
    }
    return minDate;
  });

  const [secondMonth, setSecondMonth] = React.useState<Date>(() => {
    const nextMonth = addMonths(firstMonth, 1);
    if (isAfter(nextMonth, maxDate)) {
      return maxDate;
    }
    return nextMonth;
  });

  const today = startOfDay(new Date());

  // Preset options
  const presets: PresetOption[] = [
    {
      label: "Today",
      value: "today",
      getDateRange: (min, max) => {
        const day = today;
        if (isBefore(day, min)) return { from: min, to: min };
        if (isAfter(day, max)) return { from: max, to: max };
        return { from: day, to: day };
      },
    },
    {
      label: "Yesterday",
      value: "yesterday",
      getDateRange: (min, max) => {
        const day = subDays(today, 1);
        if (isBefore(day, min)) return { from: min, to: min };
        if (isAfter(day, max)) return { from: max, to: max };
        return { from: day, to: day };
      },
    },
    {
      label: "Last 7 Days",
      value: "last7days",
      getDateRange: (min, max) => {
        const from = subDays(today, 6);
        const constrainedFrom = isBefore(from, min) ? min : from;
        const constrainedTo = isAfter(today, max) ? max : today;
        return { from: constrainedFrom, to: constrainedTo };
      },
    },
    {
      label: "Last 30 Days",
      value: "last30days",
      getDateRange: (min, max) => {
        const from = subDays(today, 29);
        const constrainedFrom = isBefore(from, min) ? min : from;
        const constrainedTo = isAfter(today, max) ? max : today;
        return { from: constrainedFrom, to: constrainedTo };
      },
    },
    {
      label: "This Month",
      value: "thisMonth",
      getDateRange: (min, max) => {
        const from = startOfMonth(today);
        const constrainedFrom = isBefore(from, min) ? min : from;
        const constrainedTo = isAfter(today, max) ? max : today;
        return { from: constrainedFrom, to: constrainedTo };
      },
    },
    {
      label: "Last Month",
      value: "lastMonth",
      getDateRange: (min, max) => {
        const lastMonth = subMonths(today, 1);
        const from = startOfMonth(lastMonth);
        const to = endOfMonth(lastMonth);
        const constrainedFrom = isBefore(from, min) ? min : from;
        const constrainedTo = isAfter(to, max) ? max : to;
        return { from: constrainedFrom, to: constrainedTo };
      },
    },
    {
      label: "Custom Range",
      value: "customRange",
      getDateRange: (min, max) => {
        if (!date) return { from: min, to: max };
        const constrainedFrom = isBefore(date.from, min) ? min : date.from;
        const constrainedTo = isAfter(date.to || constrainedFrom, max)
          ? max
          : date.to || constrainedFrom;
        return { from: constrainedFrom, to: constrainedTo };
      },
    },
  ];

  const [activePreset, setActivePreset] = React.useState("last7days");

  // Handle preset selection
  const handlePresetSelect = (preset: PresetOption) => {
    if (preset.value === "customRange") {
      setActivePreset(preset.value);
      return;
    }

    const newRange = preset.getDateRange(minDate, maxDate);
    setDate(newRange);
    setActivePreset(preset.value);

    if (onDateRangeChange) {
      onDateRangeChange(newRange);
    }

    setIsOpen(false);
  };

  // Handle date selection
  const handleSelect = (day: Date) => {
    // Prevent selecting dates outside min/max range
    if (isBefore(day, minDate) || isAfter(day, maxDate)) {
      return;
    }

    if (!date?.from) {
      setDate({ from: day, to: undefined });
      return;
    }

    if (date.from && !date.to && !isBefore(day, date.from)) {
      const newRange = { from: date.from, to: day };
      setDate(newRange);
      if (onDateRangeChange) {
        onDateRangeChange(newRange);
      }
      return;
    }

    setDate({ from: day, to: undefined });
  };

  // Handle first month navigation
  const handleFirstMonthChange = (increment: number) => {
    const newMonth = addMonths(firstMonth, increment);

    // Prevent navigating before min date or after max date
    if (increment < 0 && isBefore(newMonth, minDate)) {
      const minDateMonth = new Date(minDate);
      minDateMonth.setDate(1);
      setFirstMonth(minDateMonth);
    } else if (increment > 0 && isAfter(newMonth, maxDate)) {
      const maxDateMonth = new Date(maxDate);
      maxDateMonth.setDate(1);
      setFirstMonth(maxDateMonth);
    } else {
      setFirstMonth(newMonth);
    }

    // Ensure second month is after first month and within max date
    const newSecondMonth = addMonths(newMonth, 1);
    if (isAfter(newSecondMonth, maxDate)) {
      setSecondMonth(maxDate);
    } else {
      setSecondMonth(newSecondMonth);
    }
  };

  // Handle second month navigation
  const handleSecondMonthChange = (increment: number) => {
    const newMonth = addMonths(secondMonth, increment);

    // Prevent navigating before first month + 1 or after max date
    if (increment < 0) {
      const minSecondMonth = addMonths(firstMonth, 1);
      if (isBefore(newMonth, minSecondMonth)) {
        setSecondMonth(minSecondMonth);
      } else {
        setSecondMonth(newMonth);
      }
    } else if (increment > 0 && isAfter(newMonth, maxDate)) {
      const maxDateMonth = new Date(maxDate);
      maxDateMonth.setDate(1);
      setSecondMonth(maxDateMonth);
    } else {
      setSecondMonth(newMonth);
    }
  };

  // Handle first month selection
  const handleFirstMonthSelect = (monthIndex: number) => {
    const newMonth = setMonth(firstMonth, monthIndex);

    // Check if the new month is before min date
    if (isBefore(newMonth, minDate) && isSameYear(newMonth, minDate)) {
      const minDateMonth = new Date(minDate);
      minDateMonth.setDate(1);
      setFirstMonth(minDateMonth);
    } else if (isAfter(newMonth, maxDate)) {
      const maxDateMonth = new Date(maxDate);
      maxDateMonth.setDate(1);
      setFirstMonth(maxDateMonth);
    } else {
      setFirstMonth(newMonth);
    }

    // Ensure second month is after first month and within max date
    const newSecondMonth = addMonths(newMonth, 1);
    if (isAfter(newSecondMonth, maxDate)) {
      setSecondMonth(maxDate);
    } else {
      setSecondMonth(newSecondMonth);
    }

    setFirstView("calendar");
  };

  // Handle second month selection
  const handleSecondMonthSelect = (monthIndex: number) => {
    const newMonth = setMonth(secondMonth, monthIndex);

    // Ensure second month is after first month and within max date
    if (
      isBefore(newMonth, addMonths(firstMonth, 1)) &&
      isSameYear(newMonth, firstMonth)
    ) {
      setSecondMonth(addMonths(firstMonth, 1));
    } else if (isAfter(newMonth, maxDate)) {
      const maxDateMonth = new Date(maxDate);
      maxDateMonth.setDate(1);
      setSecondMonth(maxDateMonth);
    } else {
      setSecondMonth(newMonth);
    }

    setSecondView("calendar");
  };

  // Handle first year selection
  const handleFirstYearSelect = (year: number) => {
    const newMonth = setYear(firstMonth, year);

    // Check if the new year is before min date or after max date
    if (isBefore(newMonth, minDate)) {
      const minDateMonth = new Date(minDate);
      minDateMonth.setDate(1);
      setFirstMonth(minDateMonth);
    } else if (isAfter(newMonth, maxDate)) {
      const maxDateMonth = new Date(maxDate);
      maxDateMonth.setDate(1);
      setFirstMonth(maxDateMonth);
    } else {
      setFirstMonth(newMonth);
    }

    // Ensure second month is after first month and within max date
    const newSecondMonth = addMonths(newMonth, 1);
    if (isAfter(newSecondMonth, maxDate)) {
      setSecondMonth(maxDate);
    } else {
      setSecondMonth(newSecondMonth);
    }

    setFirstView("calendar");
  };

  // Handle second year selection
  const handleSecondYearSelect = (year: number) => {
    const newMonth = setYear(secondMonth, year);

    // Ensure second month is after first month and within max date
    if (isBefore(newMonth, firstMonth)) {
      if (year === firstMonth.getFullYear()) {
        setSecondMonth(addMonths(firstMonth, 1));
      } else {
        setSecondMonth(setMonth(newMonth, 0)); // January of the selected year
      }
    } else if (isAfter(newMonth, maxDate)) {
      const maxDateMonth = new Date(maxDate);
      maxDateMonth.setDate(1);
      setSecondMonth(maxDateMonth);
    } else {
      setSecondMonth(newMonth);
    }

    setSecondView("calendar");
  };

  // Apply the selected date range
  const handleApply = () => {
    if (onDateRangeChange && date) {
      onDateRangeChange(date);
    }
    setIsOpen(false);
  };

  // Generate days for a month
  const generateDays = (month: Date) => {
    const year = month.getFullYear();
    const monthIndex = month.getMonth();
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

    // Get the first day of the month
    const firstDay = new Date(year, monthIndex, 1).getDay();
    // Adjust for Sunday as 0
    const startingDay = firstDay === 0 ? 6 : firstDay - 1;

    // Get days from previous month
    const prevMonthDays = [];
    const daysInPrevMonth = new Date(year, monthIndex, 0).getDate();
    for (let i = startingDay - 1; i >= 0; i--) {
      prevMonthDays.push({
        date: new Date(year, monthIndex - 1, daysInPrevMonth - i),
        isCurrentMonth: false,
      });
    }

    // Current month days
    const currentMonthDays = [];
    for (let i = 1; i <= daysInMonth; i++) {
      currentMonthDays.push({
        date: new Date(year, monthIndex, i),
        isCurrentMonth: true,
      });
    }

    // Next month days to fill the calendar
    const nextMonthDays = [];
    const totalDaysShown = 42; // 6 rows of 7 days
    const remainingDays =
      totalDaysShown - prevMonthDays.length - currentMonthDays.length;
    for (let i = 1; i <= remainingDays; i++) {
      nextMonthDays.push({
        date: new Date(year, monthIndex + 1, i),
        isCurrentMonth: false,
      });
    }

    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  };

  // Check if a date is in the selected range
  const isInRange = (day: Date) => {
    if (!date?.from || !date?.to) return false;
    return isAfter(day, date.from) && isBefore(day, date.to);
  };

  // Check if a date is the start or end of the range
  const isRangeEnd = (day: Date) => {
    if (!date?.from || !date?.to) return false;
    return isSameDay(day, date.from) || isSameDay(day, date.to);
  };

  // Check if a date is disabled (outside min/max range)
  const isDateDisabled = (day: Date) => {
    return isBefore(day, minDate) || isAfter(day, maxDate);
  };

  // Check if a month is disabled for selection
  const isMonthDisabled = (monthIndex: number, year: number) => {
    const monthDate = new Date(year, monthIndex, 1);
    return (
      isBefore(
        monthDate,
        new Date(minDate.getFullYear(), minDate.getMonth(), 1),
      ) ||
      isAfter(monthDate, new Date(maxDate.getFullYear(), maxDate.getMonth(), 1))
    );
  };

  // Check if a year is disabled for selection
  const isYearDisabled = (year: number) => {
    return year < minDate.getFullYear() || year > maxDate.getFullYear();
  };

  // Generate months for selection
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Generate years for selection based on min/max constraints
  const generateYears = () => {
    const minYear = minDate.getFullYear();
    const maxYear = maxDate.getFullYear();
    const years = [];

    for (let year = minYear; year <= maxYear; year++) {
      years.push(year);
    }

    return years;
  };

  const years = generateYears();

  return (
    <div
      className={cn("grid gap-2", className)}
      {...props}
    >
      <Popover
        open={isOpen}
        onOpenChange={setIsOpen}
      >
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "dd-MM-yyyy")} -{" "}
                  {format(date.to, "dd-MM-yyyy")}
                </>
              ) : (
                format(date.from, "dd-MM-yyyy")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0"
          align="start"
        >
          {activePreset === "customRange" ? (
            <div className="flex">
              {/* Left sidebar with presets */}
              <div className="w-48 border-r p-2 space-y-1">
                {presets.map((preset) => (
                  <div
                    key={preset.value}
                    className={cn(
                      "px-2 py-1 text-sm cursor-pointer hover:bg-muted rounded flex items-center justify-between",
                      activePreset === preset.value &&
                        "text-blue-600 font-medium",
                    )}
                    onClick={() => handlePresetSelect(preset)}
                  >
                    <span>{preset.label}</span>
                    {activePreset === preset.value && (
                      <Check className="h-4 w-4 text-blue-600" />
                    )}
                  </div>
                ))}
              </div>

              {/* Main calendar area */}
              <div className="p-4">
                <div className="flex flex-col">
                  {/* Calendar headers */}
                  <div className="flex justify-between mb-4">
                    {/* First month header */}
                    <div className="flex items-center justify-between w-[280px]">
                      <button
                        onClick={() => handleFirstMonthChange(-1)}
                        className={cn(
                          "p-1 rounded-full",
                          isSameMonth(firstMonth, minDate)
                            ? "text-muted-foreground cursor-not-allowed"
                            : "hover:bg-muted",
                        )}
                        disabled={isSameMonth(firstMonth, minDate)}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <div className="flex space-x-2">
                        {firstView === "calendar" ? (
                          <>
                            <button
                              onClick={() => setFirstView("month")}
                              className="px-4 py-1 rounded hover:bg-muted text-center font-medium"
                            >
                              {format(firstMonth, "MMM")}
                            </button>
                            <button
                              onClick={() => setFirstView("year")}
                              className="px-4 py-1 rounded hover:bg-muted text-center font-medium"
                            >
                              {format(firstMonth, "yyyy")}
                            </button>
                          </>
                        ) : firstView === "month" ? (
                          <Card className="p-2">
                            <div className="grid grid-cols-3 gap-2">
                              {months.map((month, index) => (
                                <button
                                  key={month}
                                  onClick={() => handleFirstMonthSelect(index)}
                                  disabled={isMonthDisabled(
                                    index,
                                    firstMonth.getFullYear(),
                                  )}
                                  className={cn(
                                    "px-4 py-2 rounded text-center",
                                    isMonthDisabled(
                                      index,
                                      firstMonth.getFullYear(),
                                    )
                                      ? "text-muted-foreground cursor-not-allowed"
                                      : "hover:bg-muted",
                                    firstMonth.getMonth() === index &&
                                      "bg-blue-600 text-white hover:bg-blue-700",
                                  )}
                                >
                                  {month}
                                </button>
                              ))}
                            </div>
                          </Card>
                        ) : (
                          <Card className="p-2">
                            <div className="grid grid-cols-3 gap-2">
                              {years.map((year) => (
                                <button
                                  key={year}
                                  onClick={() => handleFirstYearSelect(year)}
                                  disabled={isYearDisabled(year)}
                                  className={cn(
                                    "px-4 py-2 rounded text-center",
                                    isYearDisabled(year)
                                      ? "text-muted-foreground cursor-not-allowed"
                                      : "hover:bg-muted",
                                    firstMonth.getFullYear() === year &&
                                      "bg-blue-600 text-white hover:bg-blue-700",
                                  )}
                                >
                                  {year}
                                </button>
                              ))}
                            </div>
                          </Card>
                        )}
                      </div>
                      <div className="w-8"></div> {/* Spacer */}
                    </div>

                    {/* Second month header */}
                    <div className="flex items-center justify-between w-[280px] ml-4">
                      <div className="w-8"></div> {/* Spacer */}
                      <div className="flex space-x-2">
                        {secondView === "calendar" ? (
                          <>
                            <button
                              onClick={() => setSecondView("month")}
                              className="px-4 py-1 rounded hover:bg-muted text-center font-medium"
                            >
                              {format(secondMonth, "MMM")}
                            </button>
                            <button
                              onClick={() => setSecondView("year")}
                              className="px-4 py-1 rounded hover:bg-muted text-center font-medium"
                            >
                              {format(secondMonth, "yyyy")}
                            </button>
                          </>
                        ) : secondView === "month" ? (
                          <Card className="p-2">
                            <div className="grid grid-cols-3 gap-2">
                              {months.map((month, index) => {
                                const isDisabled =
                                  isMonthDisabled(
                                    index,
                                    secondMonth.getFullYear(),
                                  ) ||
                                  (secondMonth.getFullYear() ===
                                    firstMonth.getFullYear() &&
                                    index <= firstMonth.getMonth());
                                return (
                                  <button
                                    key={month}
                                    onClick={() =>
                                      handleSecondMonthSelect(index)
                                    }
                                    disabled={isDisabled}
                                    className={cn(
                                      "px-4 py-2 rounded text-center",
                                      isDisabled
                                        ? "text-muted-foreground cursor-not-allowed"
                                        : "hover:bg-muted",
                                      secondMonth.getMonth() === index &&
                                        "bg-blue-600 text-white hover:bg-blue-700",
                                    )}
                                  >
                                    {month}
                                  </button>
                                );
                              })}
                            </div>
                          </Card>
                        ) : (
                          <Card className="p-2">
                            <div className="grid grid-cols-3 gap-2">
                              {years.map((year) => {
                                const isDisabled =
                                  isYearDisabled(year) ||
                                  year < firstMonth.getFullYear();
                                return (
                                  <button
                                    key={year}
                                    onClick={() => handleSecondYearSelect(year)}
                                    disabled={isDisabled}
                                    className={cn(
                                      "px-4 py-2 rounded text-center",
                                      isDisabled
                                        ? "text-muted-foreground cursor-not-allowed"
                                        : "hover:bg-muted",
                                      secondMonth.getFullYear() === year &&
                                        "bg-blue-600 text-white hover:bg-blue-700",
                                    )}
                                  >
                                    {year}
                                  </button>
                                );
                              })}
                            </div>
                          </Card>
                        )}
                      </div>
                      <button
                        onClick={() => handleSecondMonthChange(1)}
                        className={cn(
                          "p-1 rounded-full",
                          isSameMonth(secondMonth, maxDate)
                            ? "text-muted-foreground cursor-not-allowed"
                            : "hover:bg-muted",
                        )}
                        disabled={isSameMonth(secondMonth, maxDate)}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Calendar grids - only show when both views are in calendar mode */}
                  {firstView === "calendar" && secondView === "calendar" && (
                    <div className="flex">
                      {/* First month */}
                      <div className="mr-4">
                        <div className="grid grid-cols-7 mb-1">
                          {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map(
                            (day) => (
                              <div
                                key={day}
                                className="h-8 w-8 flex items-center justify-center text-sm font-medium text-muted-foreground"
                              >
                                {day}
                              </div>
                            ),
                          )}
                        </div>
                        <div className="grid grid-cols-7">
                          {generateDays(firstMonth).map((day, i) => (
                            <div
                              key={i}
                              className={cn(
                                "h-8 w-8 flex items-center justify-center text-sm rounded-md",
                                !day.isCurrentMonth && "text-muted-foreground",
                                isDateDisabled(day.date)
                                  ? "text-muted-foreground opacity-50 cursor-not-allowed"
                                  : "cursor-pointer hover:bg-muted",
                                isRangeEnd(day.date) &&
                                  "bg-blue-600 text-white",
                                isInRange(day.date) && "bg-blue-100",
                                date?.from &&
                                  isSameDay(day.date, date.from) &&
                                  "bg-blue-600 text-white",
                                date?.to &&
                                  isSameDay(day.date, date.to) &&
                                  "bg-blue-600 text-white",
                              )}
                              onClick={() =>
                                !isDateDisabled(day.date) &&
                                handleSelect(day.date)
                              }
                            >
                              {format(day.date, "d")}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Second month */}
                      <div>
                        <div className="grid grid-cols-7 mb-1">
                          {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map(
                            (day) => (
                              <div
                                key={day}
                                className="h-8 w-8 flex items-center justify-center text-sm font-medium text-muted-foreground"
                              >
                                {day}
                              </div>
                            ),
                          )}
                        </div>
                        <div className="grid grid-cols-7">
                          {generateDays(secondMonth).map((day, i) => (
                            <div
                              key={i}
                              className={cn(
                                "h-8 w-8 flex items-center justify-center text-sm rounded-md",
                                !day.isCurrentMonth && "text-muted-foreground",
                                isDateDisabled(day.date)
                                  ? "text-muted-foreground opacity-50 cursor-not-allowed"
                                  : "cursor-pointer hover:bg-muted",
                                isRangeEnd(day.date) &&
                                  "bg-blue-600 text-white",
                                isInRange(day.date) && "bg-blue-100",
                                date?.from &&
                                  isSameDay(day.date, date.from) &&
                                  "bg-blue-600 text-white",
                                date?.to &&
                                  isSameDay(day.date, date.to) &&
                                  "bg-blue-600 text-white",
                              )}
                              onClick={() =>
                                !isDateDisabled(day.date) &&
                                handleSelect(day.date)
                              }
                            >
                              {format(day.date, "d")}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Selected date range and apply button */}
                <div className="flex justify-between items-center p-2 border-t mt-4">
                  <div className="text-sm">
                    {date?.from && date?.to ? (
                      <span>
                        Selected:{" "}
                        <span className="text-blue-600 font-medium">
                          {format(date.from, "dd-MM-yyyy")}
                        </span>{" "}
                        to{" "}
                        <span className="text-blue-600 font-medium">
                          {format(date.to, "dd-MM-yyyy")}
                        </span>
                      </span>
                    ) : (
                      <span>Select a date range</span>
                    )}
                  </div>
                  <Button
                    onClick={handleApply}
                    className="bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            // Simple dropdown for preset options
            <div className="p-2 w-64">
              {presets.map((preset) => (
                <div
                  key={preset.value}
                  className={cn(
                    "px-3 py-2 text-sm cursor-pointer hover:bg-muted rounded flex items-center justify-between",
                    activePreset === preset.value &&
                      "text-blue-600 font-medium",
                  )}
                  onClick={() => handlePresetSelect(preset)}
                >
                  <span>{preset.label}</span>
                  {activePreset === preset.value && (
                    <Check className="h-4 w-4 text-blue-600" />
                  )}
                </div>
              ))}
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  );
}
