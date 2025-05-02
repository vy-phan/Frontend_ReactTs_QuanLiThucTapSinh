import { ProfileDialogProps, roleConfig } from '@/@type/type';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/utils/dateUtils';

export const ProfileDialog = ({ open, onOpenChange, user }: ProfileDialogProps) => {
    const renderRoleBadge = () => {
        if (!user?.role) return null;
        const config = roleConfig[user.role];
        return (
            <Badge
                variant={config.variant}
                className={`mt-1 ${config.className}`}
            >
                {config.label}
            </Badge>
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[650px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl">Thông tin {user?.role === "MANAGER" ? "quản lí" : "thực tập sinh"}</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-6 py-4">
                    {/* Avatar Section */}
                    <div className="flex items-center gap-4">
                        <Avatar className="h-20 w-20">
                            <AvatarImage src={user?.avatar} />
                            <AvatarFallback>
                                {user?.username?.charAt(0).toUpperCase() || 'U'}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="text-xl font-semibold">{user?.username || 'N/A'}</h3>
                            <p className="text-muted-foreground">{user?.email || 'N/A'}</p>
                            {renderRoleBadge()}
                        </div>
                    </div>

                    {/* Personal Info Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <h4 className="font-medium text-sm text-muted-foreground">Thông tin cá nhân</h4>
                            <div className="space-y-1">
                                <p><span className="font-medium">Năm sinh:</span> {user?.birth_year || 'N/A'}</p>
                                <p><span className="font-medium">Giới tính:</span> {user?.gender || 'N/A'}</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h4 className="font-medium text-sm text-muted-foreground">Thông tin liên hệ</h4>
                            <div className="space-y-1">
                                <p><span className="font-medium">Số điện thoại:</span> {user?.phone || 'N/A'}</p>
                                <p>
                                    <span className="font-medium">CV:</span>
                                    {user?.cv_link ? (
                                        <a
                                            href={user.cv_link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="ml-2 text-blue-500 hover:underline"
                                        >
                                            Xem CV
                                        </a>
                                    ) : ' N/A'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Dates Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <h4 className="font-medium text-sm text-muted-foreground">Ngày bắt đầu thực tập</h4>
                            <p>{formatDate(user?.start_date)}</p>
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-medium text-sm text-muted-foreground">Ngày tạo tài khoản</h4>
                            <p>{formatDate(user?.created_at)}</p>
                        </div>
                    </div>

                    {/* Verification Status */}
                    <div className="flex items-center gap-2">
                        <h4 className="font-medium text-sm text-muted-foreground">Trạng thái xác minh:</h4>
                        <Badge
                            variant="outline"
                            className={user?.is_verified
                                ? 'bg-green-500 text-white hover:bg-green-600'
                                : 'bg-red-400 text-gray-800 hover:bg-red-600'
                            }
                        >
                            {user?.is_verified ? 'Đã xác minh' : 'Chưa xác minh'}
                        </Badge>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};