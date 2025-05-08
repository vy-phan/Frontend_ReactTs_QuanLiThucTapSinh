import { useState, useEffect } from "react";
import apiClient from "../lib/apiClient";  // Đảm bảo apiClient đã được import
import { TASK_DETAIL_ENDPOINTS } from "../constants/api";
import { TaskDetail } from "@/@type/type"; // Import kiểu TaskDetail
import { useAuth } from "../context/authContext"; // Import AuthContext để lấy thông tin người dùng
import { toast } from "sonner"
import Task from "@/pages/Task";

export const useTaskDetail = (taskId: string | undefined) => {
  const { user } = useAuth(); // Lấy thông tin người dùng hiện tại
  console.log("Userádasdasd:", user?.id); // Kiểm tra thông tin người dùng
  const [tabs, setTabs] = useState<Record<string, TaskDetail[]>>({
    "Đã giao": [],
    "Đang thực hiện": [],
    "Hoàn thành": [],
  });

  // Hàm lấy chi tiết task
  const fetchTaskDetail = async () => {
    try {
      const response = await apiClient.get<{ success: boolean; data: TaskDetail[] }>(
        TASK_DETAIL_ENDPOINTS.GET_BY_TASK_ID(taskId || "")
      );
      const taskList = response.data.data;

      // Đợi tất cả các lời gọi API lấy danh sách assignees hoàn tất
      const tasksWithAssignees = await Promise.all(
        taskList.map(async (task) => {
          const assigneesResponse = await apiClient.get<{
            success: boolean;
            data: { id: number; username: string }[];
          }>(`/task_detail/${task.id}/assignees`);
          console.log(`Assignees cho task ${task.id}:`, assigneesResponse.data.data);
          return { ...task, assignees: assigneesResponse.data.data || [] };
        })
      );

      // Sau khi tất cả các lời gọi API hoàn tất, kiểm tra vai trò của người dùng
      if (user?.role !== "MANAGER") {
        // Nếu không phải MANAGER, chỉ hiển thị các task_detail mà user được giao
        const filteredTasks = tasksWithAssignees.filter((task) =>
          Array.isArray(task.assignees) &&
          task.assignees.some((assignee) => Number(assignee.id) === Number(user?.id))
        );

        setTabs({
          "Đã giao": filteredTasks.filter((task) => task.status === "Đã giao"),
          "Đang thực hiện": filteredTasks.filter((task) => task.status === "Đang thực hiện"),
          "Hoàn thành": filteredTasks.filter((task) => task.status === "Hoàn thành"),
        });
      } else {
        // Nếu là MANAGER, hiển thị tất cả các task_detail
        const grouped: Record<string, TaskDetail[]> = {
          "Đã giao": [],
          "Đang thực hiện": [],
          "Hoàn thành": [],
        };
        tasksWithAssignees.forEach((task: TaskDetail) => {
          grouped[task.status].push(task);
        });
        setTabs(grouped);
      }
    } catch (err) {
      console.error("Lỗi khi lấy chi tiết task:", err);
    }
  };

  // Gọi fetchTaskDetail khi taskId và user đã sẵn sàng
  useEffect(() => {
    if (taskId && user) {
      fetchTaskDetail();
    }
  }, [taskId, user]);



  // Hàm cập nhật trạng thái task
  const updateTaskStatus = async (taskId: string, status: string) => {
    try {
      const response = await apiClient.put<{ success: boolean; message: string }>(
        TASK_DETAIL_ENDPOINTS.UPDATE(taskId),
        { status }
      );
      if (!response.data.success) {
        throw new Error(response.data.message || "Cập nhật trạng thái thất bại");
      } else {
        console.log("Cập nhật trạng thái thành công:", response.data.message);
        toast.success(`Cập nhật trạng thái thành công! ${status}`);
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
  // Kiểm tra lại trước khi gửi
  console.log("Trước khi gửi task:", newTask);

  const payload = {
    ...newTask,
    task_id: taskId,
    assignees: newTask.assignees
    // Loại bỏ giá trị rỗng
  };

  console.log("Payload gửi lên server:", payload);

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
    toast.success(`Thêm task detail thành công! ${response.data.message}`);
    return response.data;
  } catch (err) {
    console.error("Lỗi thêm task detail:", err);
    throw err;
  }
};





//api update task detail
export const updateTaskDetail = async (taskId: string, updatedTask: any) => {
  const payload = {
    ...updatedTask,
  }
  try {
    const response = await apiClient.put<{ success: boolean; message: string }>(
      TASK_DETAIL_ENDPOINTS.UPDATE(taskId),
      payload,
      { withCredentials: true }
    );
    if (!response.data.success) {
      throw new Error(response.data.message || "Cập nhật task detail thất bại");
    }
    console.log("Cập nhật task detail thành công:", response.data.message);
    toast.success(`Cập nhật task detail thành công! ${response.data.message}`);
    return response.data;
  } catch (err) {
    console.error("Lỗi cập nhật task detail:", err);
    throw err;
  }
}

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

//hàm lấy danh sách assignees theo task_detail_id
export const getAssigneesByTaskDetailId = async (taskDetailId: string) => {
  try {
    const response = await apiClient.get<{ success: boolean; data: any[] }>(
      TASK_DETAIL_ENDPOINTS.GET_ASSIGNEESS_BY_TASKDETAIL_ID(taskDetailId)
    );
    if (!response.data.success) {
      throw new Error("Không lấy được danh sách assignees");
    }
    return response.data.data;
  } catch (err) {
    console.error("Lỗi khi lấy danh sách assignees:", err);
    throw err;
  }
};