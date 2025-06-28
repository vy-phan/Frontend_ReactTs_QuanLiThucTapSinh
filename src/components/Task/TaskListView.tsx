import React, { useState } from "react";
import { Task as TaskType } from "@/@type/type";
import { Link } from "react-router-dom";

interface TaskListViewProps {
  tasks: TaskType[];
  onEdit: (task: TaskType) => void;
  onDelete: (task: TaskType) => void;
}

export const TaskListView: React.FC<TaskListViewProps> = ({ tasks, onEdit, onDelete }) => {
  const [filterStatus, setFilterStatus] = useState<string>("Tất cả");

  const statusColors = {
    "Đã giao": "bg-amber-50 border-amber-200 text-amber-700",
    "Đang thực hiện": "bg-blue-50 border-blue-200 text-blue-700",
    "Đã hoàn thành": "bg-emerald-50 border-emerald-200 text-emerald-700"
  };

  const statusOptions = ["Tất cả", ...Object.keys(statusColors)];

  const getStatusColor = (status: string) => {
    return statusColors[status as keyof typeof statusColors] || "bg-gray-50 border-gray-200 text-gray-700";
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN');
    } catch {
      return dateString;
    }
  };

  // Lọc danh sách công việc theo trạng thái
  const filteredTasks = filterStatus === "Tất cả"
    ? tasks
    : tasks.filter(task => task.status === filterStatus);

  return (
    <>
      <div className="w-full">
        {/* Bộ lọc trạng thái */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6 gap-2 sm:gap-4">
          <label className="font-semibold text-gray-700 text-sm flex-shrink-0">
            <span className="inline-flex items-center">
              <svg className="w-4 h-4 mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7h18M3 12h18M3 17h18" />
              </svg>
              Lọc theo trạng thái:
            </span>
          </label>
          <div className="relative">
            <select
              className="appearance-none border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all shadow-sm"
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
            >
              {statusOptions.map(status => (
          <option key={status} value={status}>{status}</option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </div>
        </div>
        {/* Table Container */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {filteredTasks.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-slate-50 to-gray-50">
                  <tr>
                    <th className="px-2 md:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                      Mã công việc
                    </th>
                    <th className="px-2 md:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                      Tiêu đề
                    </th>
                    <th className="px-2 md:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap hidden sm:table-cell">
                      Mô tả
                    </th>
                    <th className="px-2 md:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                      Thời hạn
                    </th>
                    <th className="px-2 md:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap hidden sm:table-cell">
                      Người tạo
                    </th>
                    <th className="px-2 md:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                      Trạng thái
                    </th>
                    <th className="px-2 md:px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredTasks.map((task, index) => (
                    <tr
                      key={task.id}
                      className={`hover:bg-gray-50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                        }`}
                    >
                      <td className="px-2 md:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            {task.code}
                          </span>
                        </div>
                      </td>
                      <td className="px-2 md:px-6 py-4 max-w-[120px] md:max-w-[200px] truncate">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {task.title}
                        </div>
                      </td>
                      <td className="px-2 md:px-6 py-4 hidden sm:table-cell max-w-[120px] md:max-w-[250px] truncate" title={task.description || ''}>
                        <div className="text-sm text-gray-600 truncate">
                          {task.description}
                        </div>
                      </td>
                      <td className="px-2 md:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span className="text-sm text-gray-900 font-medium">
                            {formatDate(task.deadline || '')}
                          </span>
                        </div>
                      </td>
                      <td className="px-2 md:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-900">
                            {task.created_by_username}
                          </span>
                        </div>
                      </td>
                      <td className="px-2 md:px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
                          <div className="w-2 h-2 rounded-full bg-current mr-2 opacity-60"></div>
                          {task.status}
                        </span>
                      </td>
                      <td className="px-2 md:px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex flex-col md:flex-row items-center justify-center space-y-1 md:space-y-0 md:space-x-2">
                          <Link
                            to={`/task_detail/${task.id}`}
                            className="inline-flex items-center px-2 md:px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg text-green-700 bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                            <span className="hidden md:inline ml-1">Chi tiết</span>
                          </Link>
                          <button
                            className="inline-flex items-center px-2 md:px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                            onClick={() => onEdit(task)}
                          >
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            <span className="hidden md:inline">Sửa</span>
                          </button>
                          <button
                            className="inline-flex items-center px-2 md:px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
                            onClick={() => onDelete(task)}
                          >
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            <span className="hidden md:inline">Xóa</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Không có công việc phù hợp</h3>
              <p className="text-gray-500 text-center max-w-md">
                Không tìm thấy công việc với trạng thái đã chọn.
              </p>
            </div>
          )}
        </div>
        {/* Stats Footer */}
        {filteredTasks.length > 0 && (
          <div className="mt-4 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500 bg-gray-50 px-4 md:px-6 py-3 rounded-lg space-y-2 md:space-y-0">
            <span>Tổng cộng: <span className="font-semibold text-gray-900">{filteredTasks.length}</span> công việc</span>
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <div className="w-2 h-2 bg-amber-400 rounded-full mr-2"></div>
                Đã giao: {filteredTasks.filter(t => t.status === "Đã giao").length}
              </span>
              <span className="flex items-center">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                Đang thực hiện: {filteredTasks.filter(t => t.status === "Đang thực hiện").length}
              </span>
              <span className="flex items-center">
                <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></div>
                Đã hoàn thành: {filteredTasks.filter(t => t.status === "Đã hoàn thành").length}
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};