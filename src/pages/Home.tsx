import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import GradientText from "@/components/ui/GradientText";
import Dashboard from "@/components/common/Dashboard";

const CalendarUI = () => {
  const [date, setDate] = useState<Date>(new Date(2025, 4, 1)); // May 2025

  // Fake events data
  const events = [
    {
      id: "1",
      title: "Event Conf.",
      date: new Date(2025, 4, 7),
      type: "danger"
    },
    {
      id: "2",
      title: "Meeting",
      date: new Date(2025, 4, 8),
      type: "success"
    },
    {
      id: "3",
      title: "Workshop",
      date: new Date(2025, 4, 9),
      type: "primary"
    }
  ];

  // Helper to format date as YYYY-MM-DD
  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  // Get events for a specific date
  const getEventsForDate = (date: Date): any[] => {
    return events.filter(event =>
      formatDate(event.date) === formatDate(date)
    );
  };

  // Generate days for the calendar grid
  const generateCalendarDays = () => {
    const year = date.getFullYear();
    const month = date.getMonth();

    // Get the first day of the month
    const firstDayOfMonth = new Date(year, month, 1);
    const firstDayWeekday = firstDayOfMonth.getDay();
    const daysFromPrevMonth = firstDayWeekday;
    const startDate = new Date(year, month, 1 - daysFromPrevMonth);
    const days = [];
    for (let i = 0; i < 42; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      days.push(currentDate);
    }

    return days;
  };

  // Format month name in Vietnamese
  const getVietnameseMonth = (monthIndex: number) => {
    const monthNames = [
      "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
      "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
    ];
    return monthNames[monthIndex];
  };

  // Navigate to previous month
  const goToPrevMonth = () => {
    const newDate = new Date(date);
    newDate.setMonth(date.getMonth() - 1);
    setDate(newDate);
  };

  // Navigate to next month
  const goToNextMonth = () => {
    const newDate = new Date(date);
    newDate.setMonth(date.getMonth() + 1);
    setDate(newDate);
  };

  // Check if a date is today
  const isToday = (day: Date) => {
    const today = new Date();
    return day.getDate() === today.getDate() &&
      day.getMonth() === today.getMonth() &&
      day.getFullYear() === today.getFullYear();
  };

  // Updated renderEvents function
  const renderEvents = (day: Date) => {
    const dayEvents = getEventsForDate(day);

    return dayEvents.map(event => (
      <div
        key={event.id}
        className={`text-xs py-1 px-2 my-1 rounded-md flex items-center transition-all duration-200 hover:translate-x-1 ${
          event.type === 'danger' 
            ? 'bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 shadow-sm hover:shadow-red-200' 
            : event.type === 'success' 
              ? 'bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-500 shadow-sm hover:shadow-green-200'
              : 'bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500 shadow-sm hover:shadow-blue-200'
        }`}
      >
        <span
          className={`mr-2 inline-block w-2 h-2 rounded-full ${
            event.type === 'danger' ? 'bg-red-500' :
            event.type === 'success' ? 'bg-green-500' :
            'bg-blue-500'
          }`}
        ></span>
        <span className="font-medium">{event.title}</span>
      </div>
    ));
  };

  return (
    <div className="w-full max-w-6xl mx-auto bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <Dashboard/>

      {/* Header with navigation - updated */}
      <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-9 w-9 rounded-full hover:bg-gray-100 transition-colors"
            onClick={goToPrevMonth}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-9 w-9 rounded-full hover:bg-gray-100 transition-colors"
            onClick={goToNextMonth}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="text-2xl font-bold text-gray-800">
          {getVietnameseMonth(date.getMonth())} <span className="text-blue-600">{date.getFullYear()}</span>
        </div>

        <div className="flex rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 p-2 shadow-inner">
          <GradientText
            colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
            animationSpeed={7}
            showBorder={false}
            className="text-sm font-bold"
          >
            Tháng
          </GradientText>
        </div>
      </div>

      {/* Calendar grid - updated */}
      <div className="p-4">
        {/* Weekday headers - updated */}
        <div className="grid grid-cols-7 text-center mb-2">
          {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((day, index) => (
            <div key={index} className="text-sm font-semibold text-gray-600 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days - updated */}
        <div className="grid grid-cols-7 gap-1">
          {generateCalendarDays().map((day, index) => {
            const isCurrentMonth = day.getMonth() === date.getMonth();
            const isTodayDate = isToday(day);

            return (
              <div
                key={index}
                className={`
                  rounded-lg p-2 min-h-28 transition-all duration-200
                  ${isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-400'}
                  ${index % 7 === 0 ? 'border-l border-gray-100' : ''}
                  hover:shadow-sm hover:bg-gray-50
                `}
              >
                <div className="text-right mb-1">
                  <span className={`
                    inline-flex items-center justify-center w-6 h-6 rounded-full
                    ${isTodayDate ? 'bg-blue-600 text-white font-bold' : ''}
                    ${!isTodayDate && isCurrentMonth ? 'hover:bg-gray-200' : ''}
                  `}>
                    {day.getDate()}
                  </span>
                </div>
                <div className="space-y-1">
                  {isCurrentMonth && renderEvents(day)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CalendarUI;