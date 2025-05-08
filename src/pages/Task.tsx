import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTask } from "../hooks/taskApi"; // Import hook quản lý task
import { useAuth } from "../context/authContext"; // Import AuthContext
import { Task as TaskType } from "@/@type/type"; // Interface Task đã được định nghĩa
import { toast } from "sonner";
import { AddModal } from "../components/Task/AddModal"; // Import AddModal
import { EditTask } from "../components/Task/EditTask"; // Import EditTask
import { Link } from "react-router-dom";
import { formatDate } from "../utils/dateUtils"; // Import hàm formatDate
import { TASK_ENDPOINTS } from "../constants/api"; // Import endpoint API
import apiClient from "../lib/apiClient"; // Import apiClient
import { Badge } from "@/components/ui/badge";

export const Task = () => {
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

  const handleAddTask = async () => {
    try {
      await addTask(newTask);
      toast.success("Thêm task thành công");
      fetchTask();
      setNewTask({
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
      setAttachments([]);
    } catch (err) {
      console.error("Lỗi thêm task:", err);
      toast.error("Thêm task thất bại");
    }
  };

  return (
    <div className="p-8 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800 bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 py-2">
          Danh sách công việc
        </h1>
        
        <div className="flex justify-center items-center mb-8">  
          <AddModal
            onSubmit={handleAddTask}
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-2">
          {tasks.map((task: TaskType) => (
            <div
              key={task.id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full"
            >
              <div className="p-5 flex-grow">
                <div className="flex justify-between items-start mb-3">
                  <Badge variant="outline" className="bg-blue-100 text-blue-800 font-medium">
                    {task.code}
                  </Badge>
                  <div className="flex items-center">
                    <span className={`inline-block w-2 h-2 rounded-full mr-2 ${task.status === 'Hoàn thành' ? 'bg-green-500' : task.status === 'Đang thực hiện' ? 'bg-yellow-500' : 'bg-blue-500'}`}></span>
                    <span className="text-xs font-medium text-gray-600">{task.status}</span>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-800 mb-3 line-clamp-2">
                  {task.title}
                </h3>
                
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-gray-600 line-clamp-2">
                    <span className="font-medium">Mô tả:</span> {task.description}
                  </p>
                  
                  <p className="text-sm text-gray-600 flex items-center">
                    <svg className="h-4 w-4 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="font-medium">Thời hạn :   </span> {formatDate(task.deadline?.toString() || "")}
                  </p>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 border-t border-gray-100">
                <div className="flex justify-end space-x-2">
                  <Link
                    to={`/task_detail/${task.id}`}
                    className="inline-flex items-center px-3 py-1.5 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Xem chi tiết
                  </Link>

                  <button
                    onClick={() => setEditingTask(task)}
                    className="inline-flex items-center px-3 py-1.5 rounded-lg bg-amber-500 text-white text-sm font-medium hover:bg-amber-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-amber-300"
                  >
                    <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Sửa
                  </button>
                  <button
                    onClick={() => openDeleteModal(task)}
                    className="inline-flex items-center px-3 py-1.5 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-300"
                  >
                    <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Task;
