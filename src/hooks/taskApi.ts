import { useState, useEffect, cache } from "react";
import apiClient from "../lib/apiClient";
import { TASK_ENDPOINTS } from "../constants/api";
import { Task } from "@/@type/type";
import { useAuth } from "../context/authContext";
import { toast } from "sonner";

// Cache wrapper for API calls
const cachedFetch = cache(async (url: string) => {
  const response = await apiClient.get(url);
  if (!response.data.success) {
    throw new Error(response.data.message || "Request failed");
  }
  return response.data.data;
});

export const useTask = (taskId?: string) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Optimized fetch function with React 19 cache
  const fetchTask = cache(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await cachedFetch(TASK_ENDPOINTS.GET_ALL);
      setTasks(data);
    } catch (err) {
      console.error("Error loading tasks:", err);
      setError("Could not load tasks");
    } finally {
      setLoading(false);
    }
  });

  // Optimized fetch by ID
  const fetchTaskById = cache(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await cachedFetch(`${TASK_ENDPOINTS.GET_ALL}/${id}`);
      setTasks(Array.isArray(data) ? data : [data]);
    } catch (err) {
      console.error("Error loading task:", err);
      setError("Could not load task");
    } finally {
      setLoading(false);
    }
  });

  // Add task with automatic cache update
  const addTask = async (newTask: Task | FormData) => {
   if(user?.is_verified === true || user?.role === "MANAGER"){ try {
      const isFormData = newTask instanceof FormData;
      const response = await apiClient.post(TASK_ENDPOINTS.CREATE, newTask, {
        headers: isFormData
          ? { "Content-Type": "multipart/form-data" }
          : { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (!response.data.success) {
        throw new Error(response.data.message || "Add task failed");
      }

      // Update local state and invalidate cache
      setTasks((prev) => [...prev, response.data.data]);
      cachedFetch(TASK_ENDPOINTS.GET_ALL); // This will refetch fresh data
      toast.success("Thêm task thành công");
    } catch (err) {
      console.error("Error adding task:", err);
      throw err;
    }}
    else{
      toast.error("Bạn chưa xác thực tài khoản");
    }
  };

  // Similar optimizations for update and delete
  const updateTask = async (id: string, updatedTask: Partial<Task>) => {
    try {
      const response = await apiClient.put(
        TASK_ENDPOINTS.UPDATE(id),
        updatedTask,
        {
          withCredentials: true,
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Update failed");
      }

      setTasks((prev) =>
        prev.map((task) =>
          task.id.toString() === id ? response.data.data : task
        )
      );
      cachedFetch(TASK_ENDPOINTS.GET_ALL);
    } catch (err) {
      console.error("Error updating task:", err);
      throw err;
    }
  };

  const deleteTask = async (id: string | number) => {
    try {
      const response = await apiClient.delete(TASK_ENDPOINTS.DELETE(id), {
        withCredentials: true,
      });

      if (!response.data.success) {
        throw new Error(response.data.message || "Delete failed");
      }

      setTasks((prev) =>
        prev.filter((task) => task.id.toString() !== id.toString())
      );
      cachedFetch(TASK_ENDPOINTS.GET_ALL);
    } catch (err) {
      console.error("Error deleting task:", err);
      throw err;
    }
  };

  // Automatic fetch on mount
  useEffect(() => {
    if (taskId) {
      fetchTaskById(taskId);
    } else {
      fetchTask();
    }
  }, [taskId]);

  return {
    tasks,
    loading,
    error,
    fetchTask,
    fetchTaskById,
    addTask,
    updateTask,
    deleteTask,
  };
};
