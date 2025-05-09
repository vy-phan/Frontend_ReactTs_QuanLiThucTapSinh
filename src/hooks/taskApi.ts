import { useState, useEffect } from "react";
import apiClient from "../lib/apiClient"; // Đảm bảo apiClient đã được import
import { TASK_ENDPOINTS } from "../constants/api"; // Đường dẫn API cho task
import { Task } from "@/@type/type"; // Interface Task đã được định nghĩa
import { useAuth } from "@/context/authContext";

// Hook quản lý task
export const useTask = (
  taskId?: string
): {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  fetchTask: () => Promise<void>;
  addTask: (newTask: Task | FormData) => Promise<void>;
  updateTask: (taskId: string, updatedTask: Partial<Task>) => Promise<void>;
  deleteTask: (id: number | string) => Promise<void>;
} => {
  const [tasks, setTasks] = useState<Task[]>([]); // Danh sách task
  const [loading, setLoading] = useState<boolean>(false); // Trạng thái loading
  const [error, setError] = useState<string | null>(null); // Lỗi nếu có
  const{ user } = useAuth()  

  // Lấy danh sách task hoặc task theo ID
  const fetchTask = async () => {
  setLoading(true);
  setError(null);
  try {
    // Lấy danh sách tất cả các task
    const response = await apiClient.get<{ success: boolean; data: Task[] }>(
      TASK_ENDPOINTS.GET_ALL
    );
    const allTasks = response.data.data;


    // Nếu người dùng là MANAGER, hiển thị tất cả task
    if (user?.role === "MANAGER") {
      setTasks(allTasks);
      return;
    }

    // Lấy tất cả các task_detail
    const taskDetailsResponse = await Promise.all(
      allTasks.map(async (task) => {
        const taskDetailResponse = await apiClient.get<{
          success: boolean;
          data: { id: number; task_id: number; title: string; status: string }[];
        }>(`/task_detail/${task.id}`);
        return taskDetailResponse.data.data.map((detail) => ({
          ...detail,
          task_id: task.id,
        }));
      })
    );

    // Gộp tất cả các task_detail từ các task
    const allTaskDetails = taskDetailsResponse.flat();

    // Lấy danh sách assignees cho từng task_detail
    const taskDetailsWithAssignees = await Promise.all(
      allTaskDetails.map(async (detail) => {
        const assigneesResponse = await apiClient.get<{
          success: boolean;
          data: { id: number; username: string }[];
        }>(`/task_detail/${detail.id}/assignees`);

        return {
          ...detail,
          assignees: assigneesResponse.data.data || [],
        };
      })
    );

    // Lọc các task_detail mà user hiện tại là assignee
    const userTaskDetails = taskDetailsWithAssignees.filter((detail) =>
      detail.assignees.some((assignee) => assignee.id === user?.id)
    );

    // Lấy danh sách các task chứa các task_detail mà user hiện tại liên quan
    const userTasks = allTasks.filter((task) =>
      userTaskDetails.some((detail) => detail.task_id === task.id)
    );

    setTasks(userTasks);
  } catch (err) {
    console.error("Lỗi khi load task:", err);
    setError("Không thể tải danh sách công việc.");
  } finally {
    setLoading(false);
  }
};

  // Thêm task mới
  const addTask = async (newTask: Task | FormData) => {
    try {
      console.log("Dữ liệu gửi lên:", newTask);

      // Kiểm tra nếu dữ liệu là FormData
      const isFormData = newTask instanceof FormData;

      const response = await apiClient.post<{
        success: boolean;
        message: string;
        data: Task;
      }>(TASK_ENDPOINTS.CREATE, newTask, {
        headers: isFormData
          ? { "Content-Type": "multipart/form-data" } // Nếu là FormData, đặt Content-Type
          : { "Content-Type": "application/json" }, // Nếu là JSON
        withCredentials: true,
      });

      if (!response.data.success) {
        throw new Error(response.data.message || "Thêm task thất bại");
      }

      console.log("Thêm task thành công:", response.data.message);

      // Cập nhật danh sách task nếu cần
      setTasks((prev) => [...prev, response.data.data]);
    } catch (err) {
      console.error("Lỗi thêm task:", err);
      throw err;
    }
  };

  // Sửa task
  const updateTask = async (taskId: string, updatedTask: Partial<Task>) => {
    try {
      const response = await apiClient.put<{
        success: boolean;
        message: string;
        data: Task;
      }>(TASK_ENDPOINTS.UPDATE(taskId), updatedTask, { withCredentials: true });
      if (!response.data.success) {
        throw new Error(response.data.message || "Cập nhật task thất bại");
      }
      console.log("Cập nhật task thành công:", response.data.message);
      setTasks((prev) =>
        prev.map((task) =>
          task.id.toString() === taskId ? response.data.data : task
        )
      ); // Cập nhật task trong danh sách
    } catch (err) {
      console.error("Lỗi cập nhật task:", err);
      throw err;
    }
  };

  // Xóa task
  const deleteTask = async (id: number | string): Promise<void> => {
    try {
      console.log("Gửi yêu cầu xóa task với ID:", id); // Log ID task
      const response = await apiClient.delete<{
        success: boolean;
        message: string;
      }>(
        TASK_ENDPOINTS.DELETE(id), // Gửi yêu cầu đến endpoint xóa
        {
          withCredentials: true, // Gửi cookie hoặc token nếu cần
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Xóa task thất bại");
      }

      console.log("Xóa task thành công:", response.data.message);

      // Cập nhật danh sách task sau khi xóa
      setTasks((prev) =>
        prev.filter((task) => task.id.toString() !== id.toString())
      );
    } catch (err: any) {
      console.error("Lỗi xóa task:", err);

      // Kiểm tra lỗi từ server
      if (err.response && err.response.data) {
        const errorMessage = err.response.data.error || "Xóa task thất bại";
        throw new Error(errorMessage);
      }

      // Lỗi không xác định
      throw new Error("Không thể kết nối đến server");
    }
  };

  // Tự động fetch task khi `taskId` thay đổi
  useEffect(() => {
    fetchTask();
  }, [taskId]);

  return { tasks, loading, error, fetchTask, addTask, updateTask, deleteTask };
};