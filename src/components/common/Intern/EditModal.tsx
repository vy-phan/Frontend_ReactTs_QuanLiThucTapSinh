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
import { User, UserRole, internSchema } from "@/@type/type";
import { useState } from "react";
import { Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ErrorMessage } from "../ErrorMessage";
import { z } from "zod";
import { updateUser } from "@/hooks/userApi";
import { toast } from "sonner";

type FormValues = z.infer<typeof internSchema>;

interface EditModalProps {
  user: User;
  onSuccess?: () => void;
}

export function EditModal({ user, onSuccess }: EditModalProps) {
  const [open, setOpen] = useState(false);
  // Add this function to format the date
  const formatDateForInput = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  // Update the defaultValues in useForm
  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(internSchema) as Resolver<FormValues>,
    defaultValues: {
      username: user.username,
      email: user.email,
      birth_year: user.birth_year,
      phone: user.phone,
      gender: (user.gender as "Nam" | "Nữ" | "Khác") || "Nam",
      role: user.role || UserRole.INTERN,
      is_verified: user.is_verified || false,
      start_date: formatDateForInput(user.start_date)
    }
  });

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue('start_date', e.target.value);
  };

  const onSubmit = async(data: FormValues) => {
    try {
      const jsonData = {
        username: data.username,
        email: data.email,
        birth_year: data.birth_year,
        phone: data.phone,
        gender: data.gender,
        role: data.role,
        is_verified: data.is_verified,
        start_date: data.start_date
      };

      console.log("Sending data to API:", jsonData);
      
      const response = await updateUser(user.id, jsonData);
      console.log("API Response:", response);
      
      if (response) {
        toast.success("Cập nhật thông tin thành công");
        onSuccess?.();
        setOpen(false);
      }
    } catch (error) {
      console.error("Full error details:", error);
      toast.error(`Cập nhật thông tin thất bại:`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className='bg-amber-400 hover:bg-amber-500' size="sm">
          Sửa
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Cập nhật thông tin</DialogTitle>
          <DialogDescription>
            Chỉnh sửa thông tin người dùng. Nhấn Lưu khi hoàn thành.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Column 1 */}
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

            {/* Column 2 */}
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="gender">Giới tính</Label>
                <Select
                  onValueChange={(value) => {
                    setValue('gender', value as "Nam" | "Nữ" | "Khác");
                  }}
                  defaultValue={user.gender || "Nam"}
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
                  defaultValue={formatDateForInput(user.start_date)}
                  {...register("start_date")}
                  onChange={handleDateChange}
                />
                {errors.start_date && <ErrorMessage message={errors.start_date.message || ''} />}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="is_verified">Xác thực</Label>
                <Select 
                  onValueChange={(value) => setValue('is_verified', value === 'true')}
                  defaultValue={user.is_verified ? "true" : "false"}
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
                <Select 
                  onValueChange={(value) => setValue('role', value as UserRole)}
                  defaultValue={user.role || UserRole.INTERN}
                >
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
