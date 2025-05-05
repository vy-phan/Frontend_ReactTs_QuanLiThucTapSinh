import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserRole, internSchema } from "@/@type/type";
import { useState } from "react";
import { Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ErrorMessage } from "../ErrorMessage";
import { z } from "zod";
import { createUser } from "@/hooks/userApi";
import { toast } from "sonner";

// Add this interface at the top of the file
type FormValues = z.infer<typeof internSchema>;

export function AddModal() {
  const [open, setOpen] = useState(false);
  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    setValue
  } = useForm<FormValues>({
    resolver: zodResolver(internSchema) as Resolver<FormValues>,
    defaultValues: {
      role: UserRole.INTERN,
      is_verified: false,
      start_date: new Date().toISOString().split('T')[0]
    }
  });

  // Handle date input properly
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue('start_date', e.target.value);
  };

  const onSubmit = async(data: any) => {
    try {
      const reponnse = await createUser(data);
      if (reponnse) {
        toast.success("Thêm người dùng thành công");
        window.location.reload(); 
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-black">Thêm người dùng</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Tạo người dùng mới</DialogTitle>
          <DialogDescription>
            Điền đầy đủ thông tin cho người dùng mới. Nhấn Lưu khi hoàn thành.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Cột 1 */}
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="username">Tên đăng nhập</Label>
                <Input 
                  id="username" 
                  placeholder="vd: nguyenvana" 
                  {...register("username")}
                />
                {errors.username && <ErrorMessage message={errors.username.message || ''} />}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="vd: nguyenvana@example.com" 
                  {...register("email")}
                />
                {errors.email && <ErrorMessage message={errors.email.message || ''} />}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="Ít nhất 6 ký tự" 
                  {...register("password")}
                />
                {errors.password && <ErrorMessage message={errors.password.message || ''} />}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="birth_year">Năm sinh</Label>
                <Input 
                  id="birth_year" 
                  type="number" 
                  min={1900}
                  max={(new Date().getFullYear())-17}
                  placeholder="vd: 2000" 
                  {...register("birth_year", {
                    valueAsNumber: true
                  })}
                />
                {errors.birth_year && <ErrorMessage message={errors.birth_year.message || ''} />}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input 
                  id="phone" 
                  placeholder="vd: 0987654321" 
                  {...register("phone")}
                />
              </div>
            </div>

            {/* Cột 2 */}
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="gender">Giới tính</Label>
                <Select
                  onValueChange={(value) => {
                    setValue('gender', value as "Nam" | "Nữ" | "Khác");
                  }}
                  defaultValue="Nam"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn giới tính" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Nam">Nam</SelectItem>
                    <SelectItem value="Nữ">Nữ</SelectItem>
                    <SelectItem value="Khác">Khác</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && <ErrorMessage message={errors.gender.message || ''} />}
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="start_date">Ngày bắt đầu</Label>
                <Input 
                  id="start_date" 
                  type="date" 
                  {...register("start_date")}
                  onChange={handleDateChange}
                />
                {errors.start_date && <ErrorMessage message={errors.start_date.message || ''} />}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="is_verified">Xác thực</Label>
                <Select 
                {...register("is_verified")}
                onValueChange={(value) => setValue('is_verified', value === 'true')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Đã xác thực</SelectItem>
                    <SelectItem value="false">Chưa xác thực</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="role">Vai trò</Label>
                <Select {...register("role")} defaultValue={UserRole.INTERN}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn vai trò" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={UserRole.MANAGER}>Quản lý</SelectItem>
                    <SelectItem value={UserRole.INTERN}>Thực tập sinh</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Lưu thông tin</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}