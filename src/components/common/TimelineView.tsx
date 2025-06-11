import React from "react";

interface TimelineEvent {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  type: string;
  [key: string]: any;
}

interface TimelineViewProps {
  events: TimelineEvent[];
}

const formatDate = (date: Date) => {
  return date.toLocaleDateString("vi-VN", { year: "numeric", month: "2-digit", day: "2-digit" });
};

const getDateDiff = (a: Date, b: Date) => {
  return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
};

const TimelineView: React.FC<TimelineViewProps> = ({ events }) => {
  if (events.length === 0) return <div className="p-6 text-gray-500">Không có công việc nào.</div>;

  // Find min/max dates
  const minDate = new Date(Math.min(...events.map(e => e.startDate.getTime())));
  const maxDate = new Date(Math.max(...events.map(e => e.endDate.getTime())));
  const totalDays = Math.max(1, getDateDiff(minDate, maxDate));

  // Today marker
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isTodayInRange = today >= minDate && today <= maxDate;
  const todayPercent = ((getDateDiff(minDate, today)) / totalDays) * 100;

  // Generate axis ticks (every 3-7 days, depending on range)
  const tickCount = Math.min(7, totalDays + 1);
  const tickInterval = Math.max(1, Math.round(totalDays / (tickCount - 1)));
  const ticks: Date[] = [];
  for (let i = 0; i < tickCount; i++) {
    const d = new Date(minDate);
    d.setDate(minDate.getDate() + i * tickInterval);
    if (d > maxDate) ticks.push(new Date(maxDate));
    else ticks.push(d);
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        {/* Time axis */}
        <div className="relative h-12 flex items-end">
          <div className="absolute left-0 right-0 top-6 h-2 bg-gradient-to-r from-blue-100 via-gray-200 to-blue-100 rounded-full shadow" />
          {/* Today marker */}
          {isTodayInRange && (
            <div
              className="absolute z-10 flex flex-col items-center group"
              style={{ left: `${todayPercent}%`, transform: 'translateX(-50%)' }}
            >
              {/* Tooltip on hover */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none mb-2">
                <div className="px-3 py-1 rounded bg-rose-600 text-white text-xs font-semibold shadow-lg">
                  {formatDate(today)}
                </div>
              </div>
              <div className="text-xs font-bold text-rose-600 mb-1">Hôm nay</div>
              <div className="w-4 h-4 bg-rose-500 rounded-full shadow-lg ring-4 ring-rose-300 animate-pulse border-2 border-white cursor-pointer" />
              <div className="w-1 h-8 bg-rose-400 rounded-full mt-1" />
            </div>
          )}
          {/* Tick markers */}
          {ticks.map((date, idx) => (
            <div
              key={idx}
              className="absolute flex flex-col items-center"
              style={{ left: `${(getDateDiff(minDate, date) / totalDays) * 100}%`, transform: 'translateX(-50%)' }}
            >
              <div className="text-xs text-gray-600 mb-1 whitespace-nowrap font-semibold drop-shadow">{formatDate(date)}</div>
              <div className="w-3 h-3 bg-blue-500 rounded-full shadow-lg border-2 border-white" />
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-6">
        {events.map(event => {
          const startPercent = ((getDateDiff(minDate, event.startDate)) / totalDays) * 100;
          const endPercent = ((getDateDiff(minDate, event.endDate)) / totalDays) * 100;
          const barLeft = Math.min(startPercent, endPercent);
          const barWidth = Math.abs(endPercent - startPercent);
          let barColor = 'from-blue-400 to-blue-300';
          if (event.type === 'success') barColor = 'from-green-400 to-green-300';
          else if (event.type === 'warning') barColor = 'from-yellow-400 to-yellow-200';

          return (
            <div key={event.id} className="flex items-center gap-4 group">
              <div className="flex-1 relative h-10">
                {/* Timeline bar with gradient and hover effect */}
                <div
                  className={`absolute h-4 rounded-full shadow-lg bg-gradient-to-r ${barColor} transition-all duration-200 group-hover:scale-y-110 group-hover:shadow-2xl cursor-pointer`}
                  style={{ left: `${barLeft}%`, width: `${barWidth || 2}%`, minWidth: 16, top: 10, zIndex: 1 }}
                  title={`${formatDate(event.startDate)} - ${formatDate(event.endDate)}`}
                />
                {/* Start/End dots with glow and hover effect */}
                <div
                  className="absolute w-4 h-4 rounded-full border-2 border-white shadow-lg bg-white group-hover:ring-2 group-hover:ring-blue-400"
                  style={{ left: `${startPercent}%`, top: 12, zIndex: 2, boxShadow: '0 0 8px 2px rgba(59,130,246,0.4)' }}
                />
                <div
                  className="absolute w-4 h-4 rounded-full border-2 border-white shadow-lg bg-white group-hover:ring-2 group-hover:ring-blue-400"
                  style={{ left: `${endPercent}%`, top: 12, zIndex: 2, boxShadow: '0 0 8px 2px rgba(59,130,246,0.4)' }}
                />
              </div>
              <div className="min-w-[240px]">
                <div className="font-bold text-base mb-1 text-gray-800 group-hover:text-blue-700 transition-colors duration-200">
                  {event.title}
                </div>
                <div className="text-xs text-gray-600 space-y-1 bg-white/70 rounded-lg px-3 py-2 shadow group-hover:shadow-lg border border-gray-100">
                  {event.description && <div><span className="font-medium">Mô tả:</span> {event.description}</div>}
                  <div><span className="font-medium">Trạng thái:</span> <span className={`font-semibold ${event.type==='success'?'text-green-600':event.type==='warning'?'text-yellow-600':'text-blue-600'}`}>{event.status}</span></div>
                  <div><span className="font-medium">Bắt đầu:</span> {formatDate(event.startDate)}</div>
                  <div><span className="font-medium">Kết thúc:</span> {formatDate(event.endDate)}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TimelineView;
