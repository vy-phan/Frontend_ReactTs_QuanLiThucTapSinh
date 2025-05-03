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
import { internSchema, User, UserRole } from "@/@type/type";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";


type InternFormData = z.infer<typeof internSchema>;

interface InternModalProps {
  onSave: (userData: Omit<User, 'id'>) => void;
  isManager?: boolean; // Thêm prop để kiểm tra có phải manager không
}

export function InternModal({ onSave, isManager = false }: InternModalProps) {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<InternFormData>({
    resolver: zodResolver(internSchema),
    defaultValues: {
      role: UserRole.INTERN,
      is_verified: false,
    }
  });

  const onSubmit = (data: InternFormData) => {
    const formData = {
      ...data,
      role: UserRole.INTERN,
      created_at: new Date().toISOString(),
    };
    // Convert File objects to strings before saving
    const processedFormData = {
      ...formData,
      avatar: formData.avatar ? URL.createObjectURL(formData.avatar) : undefined,
      cv_link: formData.cv_link ? URL.createObjectURL(formData.cv_link) : undefined
    };
    onSave(processedFormData);
    setOpen(false);
    reset();
  };

  const handleFileChange = (field: 'avatar' | 'cv_link', e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setValue(field, e.target.files[0]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Thêm người dùng</Button>
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
                  {...register("username")}
                />
                {errors.username && <span className="text-red-500 text-sm">{errors.username.message}</span>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                />
                {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                />
                {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="birth_year">Năm sinh</Label>
                <Input
                  id="birth_year"
                  type="number"
                  {...register("birth_year", { valueAsNumber: true })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input
                  id="phone"
                  {...register("phone")}
                />
              </div>
            </div>

            {/* Cột 2 */}
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="gender">Giới tính</Label>
                <Select
                  onValueChange={(value) => setValue("gender", value)}
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
              </div>
              <div className="grid gap-2">
                <Label htmlFor="avatar">Ảnh đại diện</Label>
                <Input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange('avatar', e)}
                />
                {watch("avatar") && (
                  <span className="text-sm text-gray-500">{watch("avatar")?.name}</span>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="start_date">Ngày bắt đầu</Label>
                <Input
                  id="start_date"
                  type="date"
                  {...register("start_date")}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cv_link">File CV</Label>
                <Input
                  id="cv_link"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileChange('cv_link', e)}
                />
                {watch("cv_link") && (
                  <span className="text-sm text-gray-500">{watch("cv_link")?.name}</span>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="is_verified">Xác thực</Label>
                <Select
                  onValueChange={(value) => setValue("is_verified", value === "true")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Trạng thái xác thực" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Đã xác thực</SelectItem>
                    <SelectItem value="false">Chưa xác thực</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {/* Thêm select cho vai trò nếu là manager */}
            {isManager && (
              <div className="grid gap-2">
                <Label htmlFor="role">Vai trò</Label>
                <Select
                  onValueChange={(value) => setValue("role", value as UserRole)}
                  defaultValue={UserRole.INTERN}
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
            )}
          </div>
          <DialogFooter>
            <Button type="submit">Lưu thông tin</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}