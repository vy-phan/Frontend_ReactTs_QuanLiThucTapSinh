import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { loginUser, logoutUser, checkUserAuthStatus } from '../hooks/authApi';
import { setGlobalLogoutHandler } from '../lib/apiClient';
import { AuthContextType, LayoutProps, LoginCredentials, User, UserRole } from '@/@type/type';


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<LayoutProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Hàm xử lý logout phía client (giữ nguyên)
  const handleLogoutClientSide = useCallback(() => {
    setUser(null);
    setRole(null);
    setIsAuthenticated(false);
    console.log("User logged out (client state cleared)");
  }, []);

  // Hàm check auth status (sử dụng hàm từ hook)
  const checkAuthStatus = useCallback(async () => {
    try {
      const currentUser = await checkUserAuthStatus(); // Gọi hàm từ hook
      setUser(currentUser);
      setRole(currentUser.role);
      setIsAuthenticated(true);
      console.log("Auth status checked: User is authenticated", currentUser);
    } catch (error) {
      console.log("Auth status checked: User is not authenticated", error);
      handleLogoutClientSide(); // Đảm bảo state sạch
    } finally {
      if (isLoading) {
           setIsLoading(false);
      }
    }
  }, [handleLogoutClientSide, isLoading]); // Thêm isLoading vào dependency

  useEffect(() => {
    setGlobalLogoutHandler(handleLogoutClientSide); // Set handler cho interceptor
    checkAuthStatus(); 
  }, [checkAuthStatus, handleLogoutClientSide]); // Chỉ chạy 1 lần khi mount

  // Hàm login (sử dụng hàm từ hook)
  const login = async (credentials: LoginCredentials): Promise<User> => {
    setIsLoading(true); // Set loading cho hành động login cụ thể
    try {
      const loggedInUser = await loginUser(credentials); // Gọi hàm từ hook
      setUser(loggedInUser);
      setRole(loggedInUser.role);
      setIsAuthenticated(true);
      setIsLoading(false); // Kết thúc loading cho login
      return loggedInUser;
    } catch (error) {
      console.error('Login failed:', error);
      handleLogoutClientSide();
      setIsLoading(false); // Kết thúc loading cho login (kể cả khi lỗi)
      throw error; // Ném lỗi ra
    }
  };

  // Hàm logout (sử dụng hàm từ hook)
  const logout = async () => {
    setIsLoading(true); // Set loading cho hành động logout
    try {
      await logoutUser(); // Gọi API từ hook
    } catch (error) {
        console.error("Logout API call failed:", error);
    } finally {
      handleLogoutClientSide(); // Luôn xóa state client
      setIsLoading(false); // Kết thúc loading cho logout
    }
  };

  const contextValue: AuthContextType = {
    isAuthenticated,
    user,
    role,
    isLoading, // Sử dụng isLoading này để biết trạng thái check ban đầu
    login,
    logout,
    checkAuthStatus,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook useAuth (giữ nguyên hoặc tạo file riêng hooks/useAuth.ts)
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};