export const API_BASE_URL = "http://localhost:5000/api/v1/";

export const AUTH_ENDPOINTS = {
  LOGIN: "/auth/login/",
  REFRESH: "/auth/refresh/",
  LOGOUT: "/auth/logout/",
  ME: "/auth/me/",
  VALIDATE: "/auth/validate/",
};

export const USER_ENDPOINTS = {
  GET_ALL: "/user/",
  GET_BY_ID: (id: number | string) => `/user/${id}`,
  CREATE: "/user/",
  UPDATE: (id: number | string) => `/user/${id}`,
  DELETE: (id: number | string) => `/user/${id}`,
};

export const TASK_ENDPOINTS = {
  GET_ALL: "/task/",
  GET_BY_ID: (id: number | string) => `/task/${id}`,
  CREATE: "/task/",
  UPDATE: (id: number | string) => `/task/${id}`,
  DELETE: (id: number | string) => `/task/${id}`,
  DOWNLOAD_ATTACHMENT: (id: number | string) => `/task/attachment/${id}/`,
};

export const TASK_DETAIL_ENDPOINTS = {
  GET_ALL: "/task_detail/",
  GET_BY_TASK_ID: (id: number | string) => `task_detail/${id}`,
  CREATE: "/task_detail/",
  UPDATE: (id: number | string) => `/task_detail/${id}`,
  DELETE: (id: number | string) => `/task_detail/${id}`,
  UPDATE_STATUS: (id: number | string, status: string) =>
    `/task_detail/${id}/status/${status}/`,
  GET_ASSIGNEESS_BY_TASKDETAIL_ID: (id: number | string) =>`task_detail/${id}/assignees`,
};
