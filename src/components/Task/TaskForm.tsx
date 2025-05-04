import React from "react";
import { Task } from "@/@type/type"; // Import interface Task

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  newTask: Task; // Sử dụng interface Task
  setNewTask: React.Dispatch<React.SetStateAction<Task>>;
  onSubmit: () => Promise<void>;
  isEdit?: boolean;
  setAttachments: React.Dispatch<React.SetStateAction<File[]>>; // Thêm prop để lưu attachments
}

export const TaskForm = ({
  isOpen,
  onClose,
  newTask,
  setNewTask,
  onSubmit,
  isEdit = false,
  setAttachments, // Nhận prop setAttachments
}: TaskFormProps) => {
  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files)); // Lưu danh sách file vào state
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{isEdit ? "Sửa Task" : "Thêm Task"}</h2>
        <div className="space-y-2">
          <input
            type="text"
            name="code"
            value={newTask.code}
            onChange={handleChange}
            placeholder="Mã công việc"
            className="w-full border p-2 rounded"
          />
          <input
            type="text"
            name="title"
            value={newTask.title}
            onChange={handleChange}
            placeholder="Tiêu đề"
            className="w-full border p-2 rounded"
          />
          <textarea
            name="description"
            value={newTask.description || ""}
            onChange={handleChange}
            placeholder="Mô tả"
            className="w-full border p-2 rounded"
          />
          <input
            type="datetime-local"
            name="deadline"
            value={newTask.deadline || ""}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          <select
            name="status"
            value={newTask.status}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="Đã giao">Đã giao</option>
            <option value="Đang thực hiện">Đang thực hiện</option>
            <option value="Hoàn thành">Hoàn thành</option>
          </select>
          {/* Input để tải lên file */}
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="w-full border p-2 rounded"
          />
        </div>
        <div className="flex justify-end mt-4 space-x-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
            Hủy
          </button>
          <button onClick={onSubmit} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            {isEdit ? "Lưu" : "Thêm"}
          </button>
        </div>
      </div>
    </div>
  );
};