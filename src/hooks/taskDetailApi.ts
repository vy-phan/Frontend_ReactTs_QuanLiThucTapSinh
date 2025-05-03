import { useState, useEffect } from "react";
import apiClient from "../lib/apiClient";  // Đảm bảo apiClient đã được import
import { TASK_DETAIL_ENDPOINTS } from "../constants/api";
import { TaskDetail } from "@/@type/type"; // Import kiểu TaskDetail

export const useTaskDetail = (taskId: string | undefined) => {
  const [tabs, setTabs] = useState<Record<string, TaskDetail[]>>({
    "Đã giao": [],
    "Đang thực hiện": [],
    "Hoàn thành": [],
  });

  // Hàm lấy chi tiết task
  const fetchTaskDetail = async () => {
    try {
      const response = await apiClient.get<{ success: boolean; data: TaskDetail[] }>(TASK_DETAIL_ENDPOINTS.GET_BY_TASK_ID(taskId || ""));
      const taskList = response.data.data;
      const grouped: Record<string, TaskDetail[]> = {
        "Đã giao": [],
        "Đang thực hiện": [],
        "Hoàn thành": [],
      };

      taskList.forEach((task: TaskDetail) => {
        const status = task.status || "Đã giao";
        if (!grouped[status]) grouped[status] = [];
        grouped[status].push(task);
      });

      setTabs(grouped);
    } catch (err) {
      console.error("Lỗi khi load task detail:", err);
    }
  };

  // Hàm cập nhật trạng thái task
  const updateTaskStatus = async (taskId: string, status: string) => {
    try {
      const response = await apiClient.put<{ success: boolean; message: string }>(
        TASK_DETAIL_ENDPOINTS.UPDATE(taskId),
        { status }
      );
      if (!response.data.success) {
        throw new Error(response.data.message || "Cập nhật trạng thái thất bại");
      }else{
        console.log("Cập nhật trạng thái thành công:", response.data.message);
        alert(`Cập nhật trạng thái thành công! ${status}`);
      }
    } catch (err) {
      console.error("Lỗi cập nhật trạng thái:", err);
    }
  };

  useEffect(() => {
    if (taskId) {
      fetchTaskDetail();
    }
  }, [taskId]);

  return { tabs, setTabs, fetchTaskDetail, updateTaskStatus };
};

export const addTaskDetail = async (taskId: string, newTask: any) => {
  const payload = {
    ...newTask,
    task_id: taskId,
    assignees: newTask.assignees.split(",").map((a: string) => a.trim()).filter(Boolean),
  };

  try {
    const response = await apiClient.post<{ success: boolean; message: string }>(
      TASK_DETAIL_ENDPOINTS.CREATE,
      payload,
      { withCredentials: true }
    );
    if (!response.data.success) {
      throw new Error(response.data.message || "Thêm task detail thất bại");
    }
    console.log("Thêm task detail thành công:", response.data.message);
    alert(`Thêm task detail thành công! ${response.data.message}`);
    return response.data;
  } catch (err) {
    console.error("Lỗi thêm task detail:", err);
    throw err;
  }
};

export const delete_taskDetail = async (taskId: string) => {
  try {
    const response = await apiClient.delete<{ success: boolean; message: string }>(TASK_DETAIL_ENDPOINTS.DELETE(taskId));
    if (!response.data.success) {
      throw new Error(response.data.message || "Xóa task detail thất bại");
    }
  } catch (err) {
    console.error("Lỗi xóa task detail:", err);
  }
}
