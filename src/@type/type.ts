import { z } from 'zod';


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

export type FormData = z.infer<typeof loginSchema>;

export interface ErrorMessageProps {
  message: string;
  className?: string;
}


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
gender?: string;
avatar?: string;
start_date?: string; // ISO format string
cv_link?: string;
role: UserRole | null; // Sử dụng Enum Role
is_verified?: boolean;
created_at?: string; // ISO format string
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