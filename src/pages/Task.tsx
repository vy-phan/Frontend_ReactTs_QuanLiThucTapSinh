import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTask } from "../hooks/taskApi"; // Import hook quản lý task
import { useAuth } from "../context/authContext"; // Import AuthContext
import { Task as TaskType } from "@/@type/type"; // Interface Task đã được định nghĩa
import { toast } from "sonner";
import { AddModal } from "../components/Task/AddModal"; // Import AddModal
import { EditTask } from "../components/Task/EditTask"; // Import EditTask
import { TASK_ENDPOINTS } from "../constants/api"; // Import endpoint API
import apiClient from "../lib/apiClient"; // Import apiClient
import { useLocation } from "react-router-dom";
import { Suspense } from 'react';
import { TaskItem } from '@/components/Task/TaskItem';


export const Task = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const errorMessage = queryParams.get("error");

  const { taskId } = useParams<{ taskId: string }>();
  const { tasks, fetchTask, addTask, updateTask, deleteTask } = useTask(taskId);
  const { user } = useAuth(); // Lấy thông tin người dùng hiện tại từ AuthContext
  const [attachments, setAttachments] = useState<File[]>([]); // State để lưu file đính kèm
  const [newTask, setNewTask] = useState<TaskType>({
    id: 0,
    code: "",
    title: "",
    description: "",
    deadline: "",
    status: "Đã giao",
    created_by: user?.id || 0, // Sử dụng id của người dùng hiện tại
    created_at: "",
    attachments: [],
  });
  const [editingTask, setEditingTask] = useState<TaskType | null>(null); // State để lưu task đang chỉnh sửa
  const [isModalOpen, setIsModalOpen] = useState(false); // State để quản lý modal
  const [selectedTask, setSelectedTask] = useState<TaskType | null>(null); // Task được chọn để xóa
  const [incompleteDetailsCount, setIncompleteDetailsCount] = useState(0); // Số lượng task_detail chưa hoàn thành

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
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800 bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 py-2">
          Danh sách công việc
        </h1>

        <div className="flex justify-center items-center mb-8">
          <AddModal
            onSubmit={addTask}
            newTask={newTask}
            setNewTask={setNewTask}
            setAttachments={setAttachments}
          />
        </div>

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

        {/* Hiển thị task theo cột trạng thái */}
        <div className="flex flex-wrap gap-6 justify-center">
        <Suspense fallback={<div>Loading tasks...</div>}>        
          {Object.keys(groupedTasks).map((status) => (
            <div
              key={status}
              className={`bg-white rounded-xl shadow-lg p-5 w-full sm:w-[45%] md:w-[30%] border-t-4 ${statusColors[status as keyof typeof statusColors] || "border-gray-200"} transition-all duration-300 hover:shadow-xl`}
            >
              <h2 className={`text-xl font-semibold text-center mb-5 py-2 rounded-lg ${statusColors[status as keyof typeof statusColors] || "bg-gray-100 text-gray-700"}`}>
                {status}
              </h2>

              {groupedTasks[status].length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                  <p>Không có công việc</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {groupedTasks[status].map((task: TaskType) => (
                    <TaskItem 
                      key={task.id}
                      task={task}
                      user={user}
                      onEdit={setEditingTask}
                      onDelete={openDeleteModal}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </Suspense>
        </div>
      </div>
    </div>
  );
};

export default Task;
