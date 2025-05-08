import { z } from 'zod';

//=============================================================================
//
//              định nghĩa kiểu dữ liệu đối tượng
//
//=============================================================================


export enum UserRole {
  MANAGER = 'MANAGER',
  INTERN = 'INTERN',
}

export interface User {
  id: number;
  username: string;
  email: string;
  birth_year?: number;
  phone?: string;
  password?: string;  
  gender?: string;
  avatar?: string;
  start_date?: string; // ISO format string
  cv_link?: string;
  role: UserRole | null; // Sử dụng Enum Role
  is_verified?: boolean;
  created_at?: string; // ISO format string
}
export interface Attachment {
  id: number;
  file_path: string;
  uploaded_at: string | null; // ISO format or null
}

export interface Task {
  id: number;
  code: string;
  title: string;
  description: string | null;
  deadline: string | null; // ISO format or null
  status: string;
  created_by: number;
  created_at: string | null; // ISO format or null
  attachments: Attachment[] | null; // Danh sách tệp đính kèm
}




export interface TaskDetail {
  id: string;
  title: string;
  description: string;
  status: 'Đã giao' | 'Đang thực hiện' | 'Hoàn thành';  // Trạng thái của task
  createdAt: string;
  updatedAt: string;
  assignees: { id: number; username: string }[]; // Thêm danh sách người làm
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  role: UserRole | null; // Thêm role vào context để dễ dàng kiểm tra phân quyền
  isLoading: boolean; // Trạng thái check auth ban đầu
  login: (credentials: LoginCredentials) => Promise<User>; // Login trả về User
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>; // Hàm kiểm tra trạng thái login
}

export interface LayoutProps {
  children: React.ReactNode;
}

export interface ProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
}

export const roleConfig = {
  [UserRole.MANAGER]: {
    label: 'Quản lý',
    variant: 'default' as const,
    className: 'bg-blue-500 text-white'
  },
  [UserRole.INTERN]: {
    label: 'Thực tập sinh',
    variant: 'secondary' as const,
    className: 'bg-green-500 text-white'
  }
};

//=============================================================================
//
//                      định nghĩa kiểu dữ liệu khi nhập
//
//=============================================================================

export const loginSchema = z.object({
  email: z.string()
    .min(1, { message: "Email là bắt buộc" })
    .email({ message: "Email không hợp lệ" }),
  password: z.string()
    .min(1, { message: "Mật khẩu là bắt buộc" })
    .min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" })
});

// Schema validation
export const internSchema = z.object({
  username: z.string().min(1, "Tên đăng nhập là bắt buộc"),
  email: z.string().email("Email không hợp lệ").min(1, "Email là bắt buộc"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự").optional(),
  birth_year: z.number().int().optional(),
  phone: z.string().optional(),
  gender: z.enum(['Nam', 'Nữ', 'Khác']).default('Nam'),
  avatar: z.instanceof(File).optional(),
  start_date: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: "Ngày không hợp lệ"
  }).optional(),
  role: z.nativeEnum(UserRole).default(UserRole.INTERN),
  is_verified: z.boolean().default(false),
});


export interface ErrorMessageProps {
  message: string;
  className?: string;
}


//=============================================================================
//
//           định nghĩa kiểu dữ liệu sẽ trả về từ API
//
//=============================================================================

export interface LoginCredentials {
  email: string;
  password?: string;
}

// Kiểu dữ liệu trả về từ API login của bạn
export interface LoginApiResponse {
  success: boolean;
  message: string;
  data?: {
    access_token: string; // Frontend không cần dùng trực tiếp
    refresh_token: string; // Frontend không cần dùng trực tiếp
    user: User;
    role: UserRole | null; // Backend trả về role
  }
}

// Kiểu dữ liệu trả về từ API /auth/me/
export interface MeApiResponse {
  success: boolean;
  data: User; // Endpoint /me trả về thông tin user
  message?: string;
}

// Kiểu dữ liệu trả về từ API refresh (chỉ cần biết thành công hay không)
export interface RefreshApiResponse {
  success: boolean;
  message: string;
  data?: {
    access_token: string; // Frontend không cần dùng trực tiếp
  }
}

// Kiểu dữ liệu trả về từ API logout
export interface LogoutApiResponse {
  success: boolean;
  message: string;
}

export interface TaskStatusUpdateResponse {
  success: boolean;  // Kết quả của thao tác cập nhật trạng thái
  message: string;  // Thông báo hoặc lỗi
}
