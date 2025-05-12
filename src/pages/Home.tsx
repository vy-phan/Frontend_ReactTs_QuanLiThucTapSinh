import { useCallback, useEffect, useState, useMemo, cache } from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import GradientText from "@/components/ui/GradientText";
import Dashboard from "@/components/common/Dashboard";
import { useAuth } from "@/context/authContext";
import { getTaskDetailsByUserId } from "@/hooks/taskDetailApi";
import { useTask } from "@/hooks/taskApi";

const Home = () => {
  const { user } = useAuth();
  const [date, setDate] = useState<Date>(new Date(2025, 4, 1));
  const [userTasksDetails, setUserTasksDetails] = useState<any[]>([]);
  const { tasks, fetchTask } = useTask();

  // Cached version of expensive calculations
  const getVietnameseMonth = cache((monthIndex: number) => {
    const monthNames = [
      "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
      "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
    ];
    return monthNames[monthIndex];
  });

  // Memoized fetch function with React 19 cache
  const fetchTasks = useCallback(async () => {
    try {
      await fetchTask();
      if (user?.id) {
        const userTasksDetails = await getTaskDetailsByUserId(user.id);
        const mergedTasks = userTasksDetails.map(taskDetail => {
          const matchingTask = tasks.find(task => task.id === taskDetail.task_id);
          return {
            ...taskDetail,
            deadline: matchingTask?.deadline || null
          };
        });
        setUserTasksDetails(mergedTasks);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  }, [user?.id, fetchTask, tasks]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Memoized calendar events
  const events = useMemo(() => userTasksDetails.map(task => ({
    id: task.id.toString(),
    title: task.title || task.description.substring(0, 15) + '...',
    startDate: new Date(task.created_at),
    endDate: new Date(task.deadline),
    type: task.status === 'Hoàn thành' ? 'success' :
      task.status === 'Đang thực hiện' ? 'primary' : 'warning'
  })), [userTasksDetails]);

  // Memoized formatDate function
  const formatDate = useCallback((date: Date): string => {
    return date.toISOString().split('T')[0];
  }, []);

  // Memoized getEventsForDate
  const getEventsForDate = useCallback((date: Date): any[] => {
    return events.filter(event => {
      const formattedDate = formatDate(date);
      const formattedStart = formatDate(event.startDate);
      const formattedEnd = formatDate(event.endDate);
      return formattedDate >= formattedStart && formattedDate <= formattedEnd;
    });
  }, [events, formatDate]);

  // Memoized generateCalendarDays
  const generateCalendarDays = useCallback(() => {
    const year = date.getFullYear();
    const month = date.getMonth();
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
  }, [date]);

  // Memoized isToday check
  const isToday = useCallback((day: Date) => {
    const today = new Date();
    return day.getDate() === today.getDate() &&
      day.getMonth() === today.getMonth() &&
      day.getFullYear() === today.getFullYear();
  }, []);

  // Memoized navigation handlers
  const goToPrevMonth = useCallback(() => {
    setDate(prev => new Date(prev.setMonth(prev.getMonth() - 1)));
  }, []);

  const goToNextMonth = useCallback(() => {
    setDate(prev => new Date(prev.setMonth(prev.getMonth() + 1)));
  }, []);

  // Memoized renderEvents
  const renderEvents = useCallback((day: Date) => {
    const dayEvents = getEventsForDate(day);
    const formattedDay = formatDate(day);
    const isNewMonth = day.getDate() === 1;

    return dayEvents.map(event => {
      const isStartDate = formattedDay === formatDate(event.startDate);
      const isEndDate = formattedDay === formatDate(event.endDate);
      const isMiddleDay = !isStartDate && !isEndDate;
      const showTitle = !isMiddleDay || isNewMonth;

      // Find the full task details
      const taskDetail = userTasksDetails.find(t => t.id.toString() === event.id);

      return (
        <div
          key={event.id}
          className={`text-xs py-1 px-2 my-1 rounded-md flex items-center transition-all duration-200 hover:translate-x-1 min-h-[28px] relative group ${isMiddleDay
              ? event.type === 'warning'
                ? 'bg-yellow-100 shadow-sm hover:shadow-yellow-200'
                : event.type === 'success'
                  ? 'bg-green-100 shadow-sm hover:shadow-green-200'
                  : 'bg-blue-100 shadow-sm hover:shadow-blue-200'
              : event.type === 'warning'
                ? 'bg-yellow-100 border-l-4 border-yellow-500 shadow-sm hover:shadow-yellow-200'
                : event.type === 'success'
                  ? 'bg-green-100 border-l-4 border-green-500 shadow-sm hover:shadow-green-200'
                  : 'bg-blue-100 border-l-4 border-blue-500 shadow-sm hover:shadow-blue-200'
            }`}
        >
          {showTitle ? (
            <span className="font-medium">{event.title}</span>
          ) : (
            <span className="opacity-0">Placeholder</span>
          )}

          {/* Tooltip on hover */}
          {taskDetail && (
            <div className="absolute z-50 bottom-full mb-2 w-64 p-3 bg-white shadow-lg rounded-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <h3 className="font-bold text-gray-800 mb-1">{taskDetail.title}</h3>
              <p className="text-gray-600 text-sm mb-1">
                <span className="font-medium">Mô tả:</span> {taskDetail.description}
              </p>
              <p className="text-gray-600 text-sm mb-1">
                <span className="font-medium">Trạng thái:</span> {taskDetail.status}
              </p>
              <p className="text-gray-600 text-sm">
                <span className="font-medium">Hạn chót:</span> {taskDetail.deadline ? new Date(taskDetail.deadline).toLocaleString('vi-VN', {  year: 'numeric', month: 'numeric', day: 'numeric' }) : 'Không có'}
              </p>
            </div>
          )}
        </div>
      );
    });
  }, [getEventsForDate, formatDate]);

  // Memoized calendar days
  const calendarDays = useMemo(() => generateCalendarDays(), [generateCalendarDays]);

  // Memoized month display
  const monthDisplay = useMemo(() => (
    <div className="text-2xl font-bold text-gray-800">
      {getVietnameseMonth(date.getMonth())} <span className="text-blue-600">{date.getFullYear()}</span>
    </div>
  ), [date, getVietnameseMonth]);

  return (
    <div className="w-full max-w-6xl mx-auto bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <Dashboard userTasks={userTasksDetails} />
      
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

        {/* Giao diện cuốn lích */}
        <div className="text-2xl font-bold text-gray-800">
          {getVietnameseMonth(date.getMonth())} <span className="text-blue-600">{date.getFullYear()}</span>
        </div>

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
          {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((day, index) => (
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

export default Home;