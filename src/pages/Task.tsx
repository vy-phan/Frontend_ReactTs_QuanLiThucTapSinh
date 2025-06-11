import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTask } from "../hooks/taskApi";   
import { useAuth } from "../context/authContext";   
import { Task as TaskType } from "@/@type/type";  
import { toast } from "sonner";
import { AddModal } from "../components/Task/AddModal"; 
import { EditTask } from "../components/Task/EditTask"; 
import { TASK_ENDPOINTS } from "../constants/api"; 
import apiClient from "../lib/apiClient"; 
import { useLocation } from "react-router-dom";
import { Suspense, useState } from 'react';
import { TaskBoardColumns } from '@/components/Task/TaskBoardColumns';
import { TaskListView } from '@/components/Task/TaskListView';


export const Task = () => {
  const location = useLocation();
  const [viewMode, setViewMode] = useState<'board' | 'list'>(() => {
    return (localStorage.getItem('task_view_mode') as 'board' | 'list') || 'board';
  });
  const queryParams = new URLSearchParams(location.search);
  const errorMessage = queryParams.get("error");

  const { taskId } = useParams<{ taskId: string }>();
  const { tasks, fetchTask, addTask, updateTask, deleteTask } = useTask(taskId);
  const { user } = useAuth(); 
  const [, setAttachments] = useState<File[]>([]); 
  const [newTask, setNewTask] = useState<TaskType>({
    id: 0,
    code: "",
    title: "",
    description: "",
    deadline: "",
    status: "Đã giao",
    created_by: user?.id || 0, 
    created_at: "",
    attachments: [],
  });
  const [editingTask, setEditingTask] = useState<TaskType | null>(null); 
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [selectedTask, setSelectedTask] = useState<TaskType | null>(null); 
  const [incompleteDetailsCount, setIncompleteDetailsCount] = useState(0); 
  const checkPermission = user?.role === "MANAGER" || user?.is_verified === true;

  useEffect(() => {
    fetchTask();
  }, [taskId]);

  // Đồng bộ `created_by` khi `user` thay đổi
  useEffect(() => {
    if (user) {
      setNewTask((prev) => ({
        ...prev,
        created_by: user.id, // Cập nhật id của người tạo
      }));
    }
  }, [user]);

  const fetchIncompleteDetailsCount = async (taskId: number) => {
    try {
      const response = await apiClient.get<{ success: boolean; count: number }>(
        TASK_ENDPOINTS.COUNT_INCOMPLETE_DETAILS(taskId)
      );

      if (!response.data.success) {
        throw new Error(
          "Không thể lấy số lượng chi tiết công việc chưa hoàn thành"
        );
      }

      setIncompleteDetailsCount(response.data.count);
    } catch (err) {
      console.error(
        "Lỗi khi lấy số lượng chi tiết công việc chưa hoàn thành:",
        err
      );
      toast.error("Không thể lấy số lượng chi tiết công việc chưa hoàn thành");
    }
  };

  const openDeleteModal = (task: TaskType) => {
    setSelectedTask(task); // Lưu task được chọn
    fetchIncompleteDetailsCount(task.id); // Lấy số lượng chi tiết công việc chưa hoàn thành
    setIsModalOpen(true); // Hiển thị modal
  };

  const closeDeleteModal = () => {
    setIsModalOpen(false); // Đóng modal
    setSelectedTask(null); // Xóa task được chọn
    setIncompleteDetailsCount(0); // Reset số lượng chi tiết công việc chưa hoàn thành
  };

  const handleDeleteTask = async () => {
    if (!selectedTask) return;

    try {
      await deleteTask(selectedTask.id.toString());
      toast.success("Xóa task thành công");
      fetchTask();
    } catch (err) {
      console.error("Lỗi xóa task:", err);
      toast.error("Xóa task thất bại");
    } finally {
      closeDeleteModal(); // Đóng modal sau khi xóa
    }
  };

  const handleUpdateTask = async (updatedTask: TaskType) => {
    try {
      await updateTask(updatedTask.id.toString(), updatedTask);
      toast.success("Cập nhật task thành công");
      fetchTask();
      setEditingTask(null); // Đóng modal chỉnh sửa
    } catch (err) {
      console.error("Lỗi cập nhật task:", err);
      toast.error("Cập nhật task thất bại");
    }
  };


  // Nhóm các task theo trạng thái
  const groupedTasks = tasks.reduce((acc: Record<string, TaskType[]>, task: TaskType) => {
    const status = task.status || "Đã giao";
    if (!acc[status]) {
      acc[status] = [];
    }
    acc[status].push(task);
    return acc;
  }, {
    "Đã giao": [],
    "Đang thực hiện": [],
    "Đã hoàn thành": []
  });

  // Màu sắc cho từng trạng thái
  const statusColors = {
    "Đã giao": "bg-amber-50 border-amber-200 text-amber-700",
    "Đang thực hiện": "bg-blue-50 border-blue-200 text-blue-700",
    "Đã hoàn thành": "bg-emerald-50 border-emerald-200 text-emerald-700"
  };

  return (
    <div className="p-8 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
      {errorMessage && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-800 rounded">
          {errorMessage}
        </div>
      )}

      {/* Tiêu đề */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <h1 className="text-3xl font-bold text-center sm:text-left text-gray-800 bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 py-2">
            Danh sách công việc
          </h1>
          <div className="flex justify-center sm:justify-end gap-2">
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border font-semibold transition-colors duration-150 border-green-600 text-green-600 hover:bg-green-50 group relative`}
              onClick={() => window.location.reload()}
            >
              Làm mới dữ liệu
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                Chưa thấy dữ liệu? Nhấn để tải lại nhanh hơn
              </span>
            </button>
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-150 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-semibold text-sm ${viewMode === 'board' ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'}`}
              onClick={() => {
                setViewMode('board');
                localStorage.setItem('task_view_mode', 'board');
              }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="3" y="4" width="7" height="16" rx="2" className={viewMode === 'board' ? 'fill-white/80' : 'fill-blue-100'} stroke="currentColor" />
                <rect x="14" y="4" width="7" height="9" rx="2" className={viewMode === 'board' ? 'fill-white/80' : 'fill-blue-100'} stroke="currentColor" />
              </svg>
              Board
            </button>
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-150 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400/50 font-semibold text-sm ${viewMode === 'list' ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'}`}
              onClick={() => {
                setViewMode('list');
                localStorage.setItem('task_view_mode', 'list');
              }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              List
            </button>
          </div>
        </div>

        {checkPermission && (
          <div className="flex justify-center items-center mb-8">
            <AddModal
              onSubmit={addTask}
              newTask={newTask}
              setNewTask={setNewTask}
              setAttachments={setAttachments}
            />
          </div>
        )}

        {editingTask && (
          <EditTask
            onSubmit={handleUpdateTask}
            editingTask={editingTask}
            setEditingTask={setEditingTask}
          />
        )}

        {/* Modal xác nhận xóa */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-300">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-[450px] border border-gray-200 transform transition-all duration-300 scale-100">
              <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">Xác nhận xóa</h2>
              <div className="py-4">
                <p className="text-gray-700 mb-4">
                  Bạn có chắc chắn muốn xóa task{" "}
                  <span className="font-semibold text-blue-600">{selectedTask?.title}</span>{" "}
                  không?
                </p>
                {incompleteDetailsCount > 0 && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded">
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <span className="text-red-600 font-medium">
                        Chúng ta còn {incompleteDetailsCount} chi tiết công việc chưa hoàn thành!
                      </span>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex justify-end space-x-3 mt-2">
                <button
                  onClick={closeDeleteModal}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Hủy
                </button>
                <button
                  onClick={handleDeleteTask}
                  className="px-4 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-300"
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        )}

        <Suspense fallback={<div>Loading tasks...</div>}>
          {viewMode === 'board' ? (
            <TaskBoardColumns
              groupedTasks={groupedTasks}
              statusColors={statusColors}
              onEdit={setEditingTask}
              onDelete={openDeleteModal}
            />
          ) : (
            <TaskListView
              tasks={tasks}
              onEdit={setEditingTask}
              onDelete={openDeleteModal}
            />
          )}
        </Suspense>
      </div>
    </div>
  );
};

export default Task;
