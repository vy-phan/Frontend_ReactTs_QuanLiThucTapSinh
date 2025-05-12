import { memo } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Task as TaskType } from "@/@type/type";
import { formatDate } from "@/utils/dateUtils";
import { useAuth } from "@/context/authContext"; // Import AuthContext để lấy thông tin người dùng

interface TaskItemProps {
  task: TaskType;
  
  onEdit: (task: TaskType) => void;
  onDelete: (task: TaskType) => void;
}

export const TaskItem = memo(
  ({ task,  onEdit, onDelete }: TaskItemProps) => {
    const { user } = useAuth(); // Lấy thông tin người dùng hiện tại từ AuthContext
    return (
      <div className="bg-white rounded-lg shadow-sm hover:shadow transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full relative group min-w-[200px]">
        <div className="p-4 flex-grow">
          <div className="flex justify-between items-start mb-2">
            <Badge
              variant="outline"
              className="bg-blue-100 text-blue-800 font-medium"
            >
              {task.code}
            </Badge>
          </div>

          <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
            {task.title}
          </h3>

          <div className="space-y-2 mb-3">
            <p className="text-sm text-gray-600 line-clamp-2">
              <span className="font-medium">Mô tả:</span> {task.description}
            </p>

            <p className="text-sm text-gray-600 flex items-center">
              <svg
                className="h-4 w-4 text-gray-500 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="font-medium">Thời hạn:</span>{" "}
              {formatDate(task.deadline?.toString() || "")}
            </p>
            <p>Người tạo: {task.created_by_username}</p>
          </div>
        </div>

        <div className="bg-gray-50 p-3 border-t border-gray-100">
          <div className="flex justify-start space-x-2">
            <Link
              to={`/task_detail/${task.id}`}
              className="inline-flex items-center px-2 min-[200px]:px-3 py-1 min-[200px]:py-1.5 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
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
              <span className="hidden min-[200px]:inline ml-1">Chi tiết</span>
            </Link>

            {(task.created_by === user?.id || user?.role === "MANAGER") && (
              <>
                <button
                  onClick={() => onEdit(task)}
                  className="hidden min-[200px]:inline-flex items-center px-3 py-1.5 rounded-lg bg-amber-500 text-white text-sm font-medium hover:bg-amber-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-amber-300"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  <span className="ml-1">Sửa</span>
                </button>
                <button
                  onClick={() => onDelete(task)}
                  className="hidden min-[200px]:inline-flex items-center px-3 py-1.5 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-300"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  <span className="ml-1">Xóa</span>
                </button>
                
                {/* Mobile view - icon only buttons */}
                <button
                  onClick={() => onEdit(task)}
                  className="min-[200px]:hidden inline-flex items-center justify-center p-2 rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition-colors duration-200"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => onDelete(task)}
                  className="min-[200px]:hidden inline-flex items-center justify-center p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors duration-200"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
);
