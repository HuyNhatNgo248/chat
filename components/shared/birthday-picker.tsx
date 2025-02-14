import React, { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BirthdayPickerProps {
  setSelectedBirthday: React.Dispatch<React.SetStateAction<Date | undefined>>;
  selectedBirthday: Date | undefined;
}

const BirthdayPicker: React.FC<BirthdayPickerProps> = ({
  setSelectedBirthday,
  selectedBirthday,
}) => {
  const [year, setYear] = useState<string>("");
  const [month, setMonth] = useState<string>("");
  const [day, setDay] = useState<string>("");

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const currentDay = currentDate.getDate();

  const years = Array.from({ length: 100 }, (_, i) =>
    (currentYear - i).toString()
  );
  const months = Array.from({ length: 12 }, (_, i) =>
    (i + 1).toString().padStart(2, "0")
  );

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };

  const [days, setDays] = useState<string[]>([]);

  useEffect(() => {
    if (year && month) {
      const daysInMonth = getDaysInMonth(parseInt(year), parseInt(month));
      setDays(
        Array.from({ length: daysInMonth }, (_, i) =>
          (i + 1).toString().padStart(2, "0")
        )
      );
    }
  }, [year, month]);

  useEffect(() => {
    if (year && month && day) {
      const selectedDate = new Date(`${year}-${month}-${day}`);
      if (selectedDate > currentDate) {
        setMonth("");
        setDay("");
        setSelectedBirthday(undefined);
      } else {
        setSelectedBirthday(selectedDate);
      }
    } else if (!year || !month || !day) {
      setSelectedBirthday(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, month, day, setSelectedBirthday]);

  const isDateDisabled = (
    selectedYear: number,
    selectedMonth: number,
    selectedDay: number
  ) => {
    if (selectedYear > currentYear) return true;
    if (selectedYear === currentYear && selectedMonth > currentMonth)
      return true;
    if (
      selectedYear === currentYear &&
      selectedMonth === currentMonth &&
      selectedDay > currentDay
    )
      return true;
    return false;
  };

  const handleYearChange = (newYear: string) => {
    setYear(newYear);
    setMonth("");
    setDay("");
  };

  const handleMonthChange = (newMonth: string) => {
    setMonth(newMonth);
    if (year === currentYear.toString() && parseInt(newMonth) > currentMonth) {
      setDay("");
    }
  };

  useEffect(() => {
    if (selectedBirthday) {
      setYear(selectedBirthday.getFullYear().toString());
      setMonth((selectedBirthday.getMonth() + 1).toString().padStart(2, "0"));
      setDay(selectedBirthday.getDate().toString().padStart(2, "0"));
    }
  }, [selectedBirthday]);

  return (
    <div className="flex space-x-2">
      <Select onValueChange={handleYearChange} value={year}>
        <SelectTrigger className="w-32 border border-gray-100 ring-gray-100 focus:border-text-muted focus:ring-text-muted">
          <SelectValue placeholder="Year" />
        </SelectTrigger>
        <SelectContent className="bg-gray-300 max-h-80">
          {years.map((y) => (
            <SelectItem key={y} value={y} disabled={parseInt(y) > currentYear}>
              {y}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select onValueChange={handleMonthChange} value={month}>
        <SelectTrigger className="w-32 border border-gray-100 ring-gray-100 focus:border-text-muted focus:ring-text-muted">
          <SelectValue placeholder="Month" />
        </SelectTrigger>
        <SelectContent className="bg-gray-300 max-h-80">
          {months.map((m) => (
            <SelectItem
              key={m}
              value={m}
              disabled={
                year === currentYear.toString() && parseInt(m) > currentMonth
              }
            >
              {m}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select onValueChange={setDay} value={day}>
        <SelectTrigger className="w-32 border border-gray-100 ring-gray-100 focus:border-text-muted focus:ring-text-muted">
          <SelectValue placeholder="Day" />
        </SelectTrigger>
        <SelectContent className="bg-gray-300 max-h-80">
          {days.map((d) => (
            <SelectItem
              key={d}
              value={d}
              disabled={isDateDisabled(
                parseInt(year),
                parseInt(month),
                parseInt(d)
              )}
            >
              {d}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default BirthdayPicker;
