import { TodayTasksReminderProps } from "@/@type/type";
import React from "react";

const TodayTasksReminder: React.FC<TodayTasksReminderProps> = ({ todayEvents }) => {
  return (
    <div className="mb-6 px-6 pt-6">
      {/* Header với animation */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800 tracking-tight">Công việc hôm nay</h2>
          <p className="text-sm text-gray-500">{new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      {todayEvents.length > 0 ? (
        <div className="space-y-3">
          {/* Stats badge */}
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 border border-indigo-200">
              {todayEvents.length} công việc
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent"></div>
          </div>

          {/* Tasks list */}
          <div className="space-y-3">
            {todayEvents.map((event, idx) => (
              <div
                key={idx}
                className="group relative bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-300 hover:-translate-y-0.5"
              >
                {/* Task content */}
                <div className="flex items-start gap-4">
                  {/* Custom checkbox */}
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-5 h-5 rounded-full border-2 border-indigo-300 group-hover:border-indigo-500 transition-colors duration-200 cursor-pointer hover:bg-indigo-50">
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-200"></div>
                    </div>
                  </div>

                  {/* Task details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 text-base leading-snug group-hover:text-indigo-700 transition-colors duration-200">
                      {event.title}
                    </h3>
                    
                    {event.endDate && (
                      <div className="flex items-center gap-2 mt-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm text-gray-600 font-medium">
                          Hạn: {event.endDate instanceof Date ? event.endDate.toLocaleDateString('vi-VN') : event.endDate}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Priority indicator */}
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 opacity-60"></div>
                  </div>
                </div>

                {/* Hover effect overlay */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            ))}
          </div>

          {/* Bottom action hint */}
          <div className="flex items-center justify-center pt-4">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Nhấp vào công việc để xem chi tiết</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative overflow-hidden">
          {/* Empty state */}
          <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-3xl p-8 text-center border border-gray-100">
            {/* Decorative background elements */}
            <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-blue-100/50 to-purple-100/50 rounded-full blur-xl"></div>
            <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-br from-indigo-100/50 to-pink-100/50 rounded-full blur-xl"></div>
            
            {/* Icon */}
            <div className="relative mx-auto w-16 h-16 mb-4">
              <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl rotate-3 opacity-80"></div>
              <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center w-full h-full shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            {/* Text */}
            <h3 className="text-lg font-bold text-gray-700 mb-2">Tuyệt vời! 🎉</h3>
            <p className="text-gray-600 leading-relaxed max-w-sm mx-auto">
              Bạn không có công việc nào hôm nay. 
              <br />
              <span className="text-emerald-600 font-medium">Hãy tận hưởng ngày nghỉ của mình!</span>
            </p>

            {/* Decorative dots */}
            <div className="flex items-center justify-center gap-1 mt-6">
              <div className="w-2 h-2 rounded-full bg-green-300"></div>
              <div className="w-2 h-2 rounded-full bg-emerald-300"></div>
              <div className="w-2 h-2 rounded-full bg-teal-300"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodayTasksReminder;