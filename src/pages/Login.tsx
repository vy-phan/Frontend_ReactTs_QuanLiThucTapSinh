import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { cn } from '../lib/utils';
import { loginSchema, LoginCredentials } from '@/@type/type';
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { useState } from 'react';
import { useAuth } from '../context/authContext'; 
import { useNavigate, useLocation } from 'react-router-dom';
import { z } from 'zod';

type FormData = z.infer<typeof loginSchema>;

const Login = () => {
  const [loginError, setLoginError] = useState<string | null>(null);
  const { login, isLoading: isAuthLoading } = useAuth(); 
  const navigate = useNavigate();
  const location = useLocation();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(loginSchema)
  });
  const from = location.state?.from?.pathname || '/'; 
  const onSubmit = async (data: FormData) => {
    setLoginError(null);
    const credentials: LoginCredentials = { email: data.email, password: data.password };

    try {
      await login(credentials); // Gọi hàm login từ context
      // Thành công: context đã cập nhật state, backend set cookie
      navigate(from, { replace: true }); // Điều hướng
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error: any) {
      // Lấy message lỗi từ API hoặc trả về thông báo chung
      setLoginError('Đăng nhập thất bại. Vui lòng kiểm tra email và mật khẩu.');
    } finally {
      // setLoading(false); // Không cần nếu dùng isAuthLoading
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-75 md:opacity-100"
        style={{
           backgroundImage: 'url("https://raw.githubusercontent.com/vy-phan/Frontend_ReactTs_QuanLiThucTapSinh/refs/heads/master/src/assets/background.png")', // Kiểm tra lại đường dẫn ảnh
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          zIndex: 0
        }}
      />

      <Card className={cn(
        "w-full max-w-md relative z-10",
        "bg-white/50 md:bg-white/20 backdrop-blur-md",
        "border border-gray-200 md:border-white/30",
        "shadow-lg md:shadow-xl",
        "rounded-lg"
      )}>
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-bold text-center text-black md:text-white">Đăng nhập</CardTitle>
          <CardDescription className="text-center text-black/70 md:text-white/80">
            Nhập thông tin đăng nhập của bạn để tiếp tục
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loginError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm"> {/* Thêm text-sm */}
              {loginError}
            </div>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-black md:text-white">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                className={cn(
                  "bg-white/40 md:bg-white/10 border-black/20 md:border-white/30 text-black md:text-white placeholder:text-black/50 md:placeholder:text-white/50",
                  errors.email && "border-red-500 ring-1 ring-red-500" // Giảm ring
                )}
                {...register("email")}
                disabled={isAuthLoading} // Disable khi context đang loading
              />
              {errors.email && <ErrorMessage message={errors.email.message || ''} />}
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-black md:text-white">
                Mật khẩu
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                className={cn(
                  "bg-white/40 md:bg-white/10 border-black/20 md:border-white/30 text-black md:text-white placeholder:text-black/50 md:placeholder:text-white/50",
                  errors.password && "border-red-500 ring-1 ring-red-500" // Giảm ring
                )}
                {...register("password")}
                disabled={isAuthLoading} // Disable khi context đang loading
              />
              {errors.password && <ErrorMessage message={errors.password.message || ''} />}
            </div>
            <Button
              type="submit"
              className={cn(
                "w-full bg-blue-600 hover:bg-blue-700 text-white border-none",
                isAuthLoading && "opacity-70 cursor-not-allowed" // Disable khi context đang loading
              )}
              disabled={isAuthLoading} // Disable khi context đang loading
            >
              {isAuthLoading ? "Đang xử lý..." : "Đăng nhập"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
