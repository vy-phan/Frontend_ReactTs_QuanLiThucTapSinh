import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TaskForm } from "../components/Task/TaskForm";
import { useTask } from "../hooks/taskApi"; // Import hook quản lý task
import { useAuth } from "../context/authContext"; // Import AuthContext
import { Task as TaskType } from "@/@type/type"; // Interface Task đã được định nghĩa

export const Task = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const { tasks, fetchTask, addTask, updateTask, deleteTask } = useTask(taskId);
  const { user } = useAuth(); // Lấy thông tin người dùng hiện tại từ AuthContext
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]); // State để lưu file đính kèm
  const [newTask, setNewTask] = useState<TaskType>({
    id: 0,
    code: "",
    title: "",
    description: "",
    deadline: "",
    status: "Đã giao",
    created_by: 0,
    created_at: "",
    attachments: [],
  });
  const [editTask, setEditTask] = useState<TaskType | null>(null);

  useEffect(() => {
    fetchTask();
  }, [taskId]);

  const handleAddTask = async () => {
    try {
      const formData = new FormData();
      formData.append("code", newTask.code);
      formData.append("title", newTask.title);
      formData.append("description", newTask.description || "");
      formData.append("deadline", newTask.deadline ? new Date(newTask.deadline).toISOString() : "");
      formData.append("status", newTask.status);
      formData.append("created_by", user?.id?.toString() || "0");

      // Thêm các file đính kèm vào FormData
      attachments.forEach((file) => formData.append("attachments", file));

      console.log("Dữ liệu gửi lên:", {
        code: newTask.code,
        title: newTask.title,
        description: newTask.description,
        deadline: newTask.deadline,
        status: newTask.status,
        created_by: user?.id,
        attachments: attachments.map((file) => file.name),
      });

      await addTask(formData); // Gửi FormData lên backend
      setIsAddModalOpen(false);
      setAttachments([]); // Reset file sau khi thêm

      // Reset form
      setNewTask({
        id: 0,
        code: "",
        title: "",
        description: "",
        deadline: "",
        status: "Đã giao",
        created_by: 0,
        created_at: "",
        attachments: [],
      });
    } catch (err) {
      console.error("Lỗi thêm task:", err);
    }
  };

  const handleEditTask = (task: TaskType) => {
    setEditTask(task);
    setIsEditModalOpen(true);
  };

  const handleUpdateTask = async () => {
    if (editTask) {
      try {
        const taskToUpdate = {
          ...editTask,
          deadline: editTask.deadline ? new Date(editTask.deadline).toISOString() : "",
        };

        console.log("Dữ liệu cập nhật:", taskToUpdate);
        await updateTask(editTask.id.toString(), taskToUpdate);
        setIsEditModalOpen(false);
        setEditTask(null);
      } catch (err) {
        console.error("Lỗi cập nhật task:", err);
      }
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
    } catch (err) {
      console.error("Lỗi xóa task:", err);
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-10 text-gray-700">Danh sách công việc</h1>
      <div className="text-center mb-6">
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          + Thêm Task
        </button>
      </div>

      {/* Modal thêm task */}
      <TaskForm
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        newTask={newTask}
        setNewTask={setNewTask}
        onSubmit={handleAddTask}
        setAttachments={setAttachments} // Truyền hàm setAttachments vào TaskForm
      />

      {/* Modal sửa task */}
      <TaskForm
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditTask(null);
        }}
        newTask={editTask || newTask}
        setNewTask={(task) => setEditTask(task as TaskType | null)}
        onSubmit={handleUpdateTask}
        isEdit={true}
        setAttachments={setAttachments} // Truyền hàm setAttachments vào TaskForm
      />

      {/* Hiển thị danh sách task */}
      <div className="flex flex-wrap gap-6 justify-center">
        {tasks.map((task: TaskType) => (
          <div key={task.id} className="bg-white rounded-xl shadow-lg p-4 w-full sm:w-[45%] md:w-[30%]">
            <div className="mb-4 p-2 bg-gray-50 rounded-md">
              <h3 className="text-lg font-medium">{task.title}</h3>
              <p className="text-sm text-gray-600">Mô tả: {task.description}</p>
              <p className="text-sm text-gray-600">Trạng thái: {task.status}</p>
              <p className="text-sm text-gray-600">Người tạo: {task.created_by}</p>
              <p className="text-sm text-gray-600">
                Hạn chót: {task.deadline ? new Date(task.deadline).toLocaleString() : "Không có"}
              </p>
            </div>
            <div className="flex justify-end space-x-2 mt-2">
              <button
                onClick={() => handleEditTask(task)}
                className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
              >
                Sửa
              </button>
              <button
                onClick={() => handleDeleteTask(task.id.toString())}
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