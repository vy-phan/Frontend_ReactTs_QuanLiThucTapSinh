import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { User, UserRole } from "@/@type/type";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/utils/dateUtils";
import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@radix-ui/react-dialog";

interface DetailModalProps {
  user: User;
  onOpenChange?: (open: boolean) => void;
}

export function DetailModal({ user }: DetailModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="relative group">
          <Button
            variant="default"
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
          >
            {/* Icon chỉ hiển thị trên mobile */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 sm:hidden"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            <span className="hidden sm:inline">Chi tiết</span>
          </Button>
          <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 px-2 py-1 rounded bg-blue-500 text-white text-xs opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap z-10">
            Chi tiết
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Thông tin chi tiết</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage
                src={user?.avatar ? user?.avatar : '/src/assets/avatar.png'}
              />
              <AvatarFallback>
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* User Info */}
          <div className="grid grid-cols-2 gap-4">
            {/* Column 1 */}
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label>Tên đăng nhập</Label>
                <div className="p-2 border rounded">{user.username}</div>
              </div>
              <div className="grid gap-2">
                <Label>Email</Label>
                <div className="p-2 border rounded">{user.email}</div>
              </div>
              <div className="grid gap-2">
                <Label>Năm sinh</Label>
                <div className="p-2 border rounded">{user.birth_year || 'N/A'}</div>
              </div>
              <div className="grid gap-2">
                <Label>Số điện thoại</Label>
                <div className="p-2 border rounded">{user.phone || 'N/A'}</div>
              </div>
              {/* CV Link */}
              <div className="grid gap-2">
                <Label>CV</Label>
                {user.cv_link ? (
                  <Button
                    variant="outline"
                    asChild
                    className="w-full justify-start"
                  >
                    <a
                      href={user.cv_link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Xem CV
                    </a>
                  </Button>
                ) : (
                  <div className="p-2 border rounded">Chưa có</div>
                )}
              </div>
            </div>

            {/* Column 2 */}
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label>Giới tính</Label>
                <div className="p-2 border rounded">{user.gender || 'N/A'}</div>
              </div>
              <div className="grid gap-2">
                <Label>Ngày bắt đầu</Label>
                <div className="p-2 border rounded">{formatDate(user.start_date)}</div>
              </div>
              <div className="grid gap-2">
                <Label>Vai trò</Label>
                <div className="p-2 border rounded">
                  <Badge
                    variant={user.role === UserRole.MANAGER ? 'default' : 'secondary'}
                    className={
                      user.role === UserRole.MANAGER
                        ? 'bg-blue-500 text-white'
                        : 'bg-green-500 text-white'
                    }
                  >
                    {user.role === UserRole.MANAGER ? 'Quản lý' : 'Thực tập sinh'}
                  </Badge>
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Trạng thái xác minh</Label>
                <div className="p-2 border rounded">
                  <Badge
                    variant="outline"
                    className={
                      user.is_verified
                        ? 'bg-green-500 text-white hover:bg-green-600'
                        : 'bg-red-400 text-gray-800 hover:bg-red-600'
                    }
                  >
                    {user.is_verified ? 'Đã xác minh' : 'Chưa xác minh'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>


        </div>
      </DialogContent>
    </Dialog>
  );
}
