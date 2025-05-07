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
      console.log("Bắt đầu xóa task với ID:", selectedTask.id);
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
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-10 text-gray-700">
        Danh sách công việc
      </h1>
      <div className="text-center mb-6">
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-lg font-bold mb-4">Xác nhận xóa</h2>
            <p className="text-gray-700 mb-6">
              Bạn có chắc chắn muốn xóa task{" "}
              <span className="font-semibold">{selectedTask?.title}</span>{" "}
              không? <br />
              {incompleteDetailsCount > 0 && (
                <span className="text-red-600 font-bold">
                  Chúng ta còn {incompleteDetailsCount} chi tiết công việc chưa
                  hoàn thành!
                </span>
              )}
              
              
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={closeDeleteModal}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
              >
                Hủy
              </button>
              <button
                onClick={handleDeleteTask}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-6 justify-center">
        {tasks.map((task: TaskType) => (
          <div
            key={task.id}
            className="bg-white rounded-xl shadow-lg p-4 w-full sm:w-[45%] md:w-[30%]"
          >
            <div className="mb-4 p-2 bg-gray-50 rounded-md">
              <h3 className="text-lg font-medium">
                <span className="text-black-700 text-sm font-semibold">
                  {task.title}
                </span>
              </h3>
              <p className="text-sm text-gray-600">
                Mô tả:{" "}
                <span className="text-black-700 text-sm font-semibold">
                  {task.description}
                </span>
              </p>
              <p className="text-sm text-gray-600">
                Trạng thái:{" "}
                <span className="text-black-700 text-sm font-semibold">
                  {task.status}
                </span>
              </p>
              <p className="text-sm text-gray-600">
                Thời hạn:{" "}
                <span className="text-black-700 text-sm font-semibold">
                  {formatDate(task.deadline?.toString() || "")}
                </span>
              </p>
            </div>
            <div className="flex justify-end space-x-2 mt-2">
              <Link
                to={`/task_detail/${task.id}`}
                className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
              >
                Xem chi tiết
              </Link>

              <button
                onClick={() => setEditingTask(task)} // Mở modal chỉnh sửa
                className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
              >
                Sửa
              </button>
              <button
                onClick={() => openDeleteModal(task)} // Mở modal xác nhận xóa
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
              >
                Xóa
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Task;
