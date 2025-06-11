import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import GradientText from "@/components/ui/GradientText";

interface CalendarMonthProps {
  goToPrevMonth: () => void;
  goToNextMonth: () => void;
  monthDisplay: React.ReactNode;
  calendarDays: Date[];
  date: Date;
  isToday: (day: Date) => boolean;
  renderEvents: (day: Date) => React.ReactNode;
}

const CalendarMonth: React.FC<CalendarMonthProps> = ({
  goToPrevMonth,
  goToNextMonth,
  monthDisplay,
  calendarDays,
  date,
  isToday,
  renderEvents,
}) => {
  return (
    <>
      {/* Header remains the same but uses memoized components */}
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

        {monthDisplay}

        <div className="flex rounded-lg bg-gray-800 p-2 shadow-inner">
          <GradientText
            colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
            animationSpeed={7}
            showBorder={false}
            className="text-md font-bold"
          >
            Tháng
          </GradientText>
        </div>
      </div>

      {/* Calendar grid - updated */}
      <div className="p-4">
        {/* Weekday headers - static so no need for memo */}
        <div className="grid grid-cols-7 text-center mb-2">
          {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map((day, index) => (
            <div key={index} className="text-sm font-semibold text-gray-600 py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => {
            const isCurrentMonth = day.getMonth() === date.getMonth();
            const isTodayDate = isToday(day);

            return (
              <div
                key={index}
                className={`
                  rounded-lg p-2 min-h-28 transition-all duration-200
                  ${isCurrentMonth ? "bg-white" : "bg-gray-50 text-gray-400"}
                  ${index % 7 === 0 ? "border-l border-gray-100" : ""}
                  hover:shadow-sm hover:bg-gray-50
                `}
              >
                <div className="text-right mb-1">
                  <span className={`
                    inline-flex items-center justify-center w-6 h-6 rounded-full
                    ${isTodayDate ? "bg-blue-600 text-white font-bold" : ""}
                    ${!isTodayDate && isCurrentMonth ? "hover:bg-gray-200" : ""}
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
    </>
  );
};

export default CalendarMonth;
