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
        <Button variant="default" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
          Chi tiết
        </Button>
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
