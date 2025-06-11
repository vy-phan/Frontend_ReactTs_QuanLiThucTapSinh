import { useCallback, useEffect, useState, useMemo, cache } from "react";
import CalendarMonth from "@/components/common/CalendarMonth";
import TimelineView from "@/components/common/TimelineView";
import Dashboard from "@/components/common/Dashboard";
import TodayTasksReminder from "@/components/common/TodayTasksReminder";
import { useAuth } from "@/context/authContext";
import { getTaskDetailsByUserId } from "@/hooks/taskDetailApi";
import { useTask } from "@/hooks/taskApi";

const Home = () => {
  const { user } = useAuth();
  // Khởi tạo ngày hiện tại là ngày thực tế của hệ thống
  const [date, setDate] = useState<Date>(new Date());
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
    setDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  }, []);

  const goToNextMonth = useCallback(() => {
    setDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
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
                <span className="font-medium">Hạn chót:</span> {taskDetail.deadline ? new Date(taskDetail.deadline).toLocaleString('vi-VN', { year: 'numeric', month: 'numeric', day: 'numeric' }) : 'Không có'}
              </p>
            </div>
          )}
        </div>
      );
    });
  }, [getEventsForDate, formatDate, userTasksDetails]);

  // Memoized calendar days
  const calendarDays = useMemo(() => generateCalendarDays(), [generateCalendarDays]);

  // Memoized month display
  const monthDisplay = useMemo(() => (
    <div className="text-2xl font-bold text-gray-800">
      {getVietnameseMonth(date.getMonth())} <span className="text-blue-600">{date.getFullYear()}</span>
    </div>
  ), [date, getVietnameseMonth]);

  const [viewMode, setViewMode] = useState<'calendar' | 'timeline'>(() => {
    return (localStorage.getItem('viewMode') as 'calendar' | 'timeline') || 'calendar';
  });

  useEffect(() => {
    localStorage.setItem('viewMode', viewMode);
  }, [viewMode]);

  return (
    <div className="w-full max-w-6xl mx-auto bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <Dashboard userTasks={userTasksDetails} />

      {/* Toggle for calendar/timeline view */}
      <div className="flex justify-end p-4 gap-2">
        <button
          className={`px-4 py-2 rounded-lg border font-semibold transition-colors duration-150 border-green-600 text-green-600 hover:bg-green-50 group relative`}
          onClick={() => window.location.reload()}
        >
          Làm mới dữ liệu
          <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            Chưa thấy dữ liệu? Nhấn để tải lại nhanh hơn
          </span>
        </button>
        <button
          className={`px-4 py-2 rounded-lg border font-semibold transition-colors duration-150 ${viewMode === 'calendar' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-600 border-blue-600 hover:bg-blue-50'}`}
          onClick={() => setViewMode('calendar')}
        >
          Lịch tháng
        </button>
        <button
          className={`px-4 py-2 rounded-lg border font-semibold transition-colors duration-150 ${viewMode === 'timeline' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-600 border-blue-600 hover:bg-blue-50'}`}
          onClick={() => setViewMode('timeline')}
        >
          Dòng thời gian
        </button>
      </div>

      {/* Công việc hôm nay */}
      {(() => {
        const today = new Date();
        const todayEvents = events.filter(event => {
          const start = event.startDate;
          const end = event.endDate || event.startDate;
          // So sánh theo ngày, bỏ qua giờ/phút/giây
          const todayStr = today.toISOString().split('T')[0];
          const startStr = start.toISOString().split('T')[0];
          const endStr = end.toISOString().split('T')[0];
          return todayStr >= startStr && todayStr <= endStr;
        });
        return (
          <TodayTasksReminder todayEvents={todayEvents} />
        );
      })()}


      {/* Calendar or Timeline view */}
      {viewMode === 'calendar' ? (
        <CalendarMonth
          goToPrevMonth={goToPrevMonth}
          goToNextMonth={goToNextMonth}
          monthDisplay={monthDisplay}
          calendarDays={calendarDays}
          date={date}
          isToday={isToday}
          renderEvents={renderEvents}
        />
      ) : (
        <TimelineView events={userTasksDetails.map(task => ({
          ...task,
          id: task.id.toString(),
          title: task.title || task.description?.substring(0, 15) + '...',
          startDate: new Date(task.created_at),
          endDate: new Date(task.deadline),
          type: task.status === 'Hoàn thành' ? 'success' : task.status === 'Đang thực hiện' ? 'primary' : 'warning',
        }))} />
      )}
    </div>
  );
};

export default Home;