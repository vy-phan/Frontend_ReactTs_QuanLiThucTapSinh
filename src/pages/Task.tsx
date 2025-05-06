import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTask } from "../hooks/taskApi"; // Import hook quản lý task
import { useAuth } from "../context/authContext"; // Import AuthContext
import { Task as TaskType } from "@/@type/type"; // Interface Task đã được định nghĩa
import { toast } from "sonner";
import { AddModal } from "../components/Task/AddModal"; // Import AddModal
import { EditTask } from "../components/Task/EditTask"; // Import EditTask
import { Link } from "react-router-dom";
// import dateUtil
import { formatDate } from "../utils/dateUtils"; 

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

  const handleAddTask = async (data: FormData | TaskType) => {
    try {
      let formData: FormData;

      if (data instanceof FormData) {
        formData = data;
      } else {
        formData = new FormData();
        formData.append("code", data.code);
        formData.append("title", data.title);
        formData.append("description", data.description || "");
        formData.append(
          "deadline",
          data.deadline ? new Date(data.deadline).toISOString() : ""
        );
        formData.append("status", data.status);
        formData.append("created_by", data.created_by.toString());

        if (attachments.length > 0) {
          attachments.forEach((file) => formData.append("attachments", file));
        }
      }

      console.log("Dữ liệu gửi lên:", Array.from(formData.entries()));
      await addTask(formData);

      fetchTask();
    } catch (err) {
      console.error("Lỗi thêm task:", err);
    }
  };

  const handleUpdateTask = async (updatedTask: TaskType) => {
    try {
      await updateTask(updatedTask.id.toString(), updatedTask);
      toast.success("Cập nhật task thành công");
      fetchTask();
      setEditingTask(null);
    } catch (err) {
      console.error("Lỗi cập nhật task:", err);
      toast.error("Cập nhật task thất bại");
    }
  };
  // Tạo thông báo xác nhận xóa task
  const confirmDeleteTask = (taskId: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa task này?")) {
      handleDeleteTask(taskId);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      console.log("Bắt đầu xóa task với ID:", taskId);
      await deleteTask(taskId);
      toast.success("Xóa task thành công");
      fetchTask();
    } catch (err) {
      console.error("Lỗi xóa task:", err);
      if (err instanceof Error) {
        toast.error(err.message || "Xóa task thất bại");
      } else {
        toast.error("Xóa task thất bại");
      }
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

      <div className="flex flex-wrap gap-6 justify-center">
        {tasks.map((task: TaskType) => (
          <div
            key={task.id}
            className="bg-white rounded-xl shadow-lg p-4 w-full sm:w-[45%] md:w-[30%]"
          >
            <div className="mb-4 p-2 bg-gray-50 rounded-md">
              <h3 className="text-lg font-medium"><span className="text-black-700 text-sm font-semibold">{task.title}</span></h3>
              <p className="text-sm text-gray-600">Mô tả: <span className="text-black-700 text-sm font-semibold">{task.description}</span></p>
              <p className="text-sm text-gray-600">Trạng thái: <span className="text-black-700 text-sm font-semibold">{task.status}</span></p>
              <p className="text-sm text-gray-700">
                Người tạo:
                <span className="text-black-700 text-sm font-semibold">
                  {" "}
                  <span className="text-black-700 text-sm font-semibold">{task.created_by_username || "Không xác định"}</span>
                </span>
              </p>
              <p className="text-sm text-gray-600">
  Thời hạn:{" "}
  <span className="text-black-700 text-sm font-semibold">
    {formatDate(task.deadline?.toString() || "")}
  </span>
</p>
              {/* Phiên ra giờ phút, thứ ngày tháng năm cho người dùng dễ đọc Ví dụ: 4 giờ 30 phút, ngày... tháng.... năm ...*/}
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
                onClick={() => confirmDeleteTask(task.id.toString())} // Gọi hàm xác nhận xóa
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
