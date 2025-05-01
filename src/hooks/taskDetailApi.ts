import axios from "axios";
import API_BASE_URL from "../constants/api";
export const getTaskDetail = async (id: string) => {
  const res = await axios.get(`${API_BASE_URL}/api/task_detail/${id}`);
  return res.data;
};
