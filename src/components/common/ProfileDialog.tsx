import { ProfileDialogProps, User } from '@/@type/type';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/utils/dateUtils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { updateUser } from '@/hooks/userApi';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const ProfileDialog = ({ open, onOpenChange, user }: ProfileDialogProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<Partial<User>>(user || {});
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [cvFile, setCvFile] = useState<File | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'avatar' | 'cv_link') => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (field === 'avatar') {
                setAvatarFile(file);
                setFormData(prev => ({ ...prev, avatar: URL.createObjectURL(file) }));
            } else {
                setCvFile(file);
            }
        }
    };

    const handleSubmit = async () => {
        try {
            const formDataToSend = new FormData();
            
            // Add all form data
            Object.entries(formData).forEach(([key, value]) => {
                if (value !== undefined && value !== null && 
                    !['start_date', 'created_at', 'is_verified', 'role'].includes(key)) {
                    formDataToSend.append(key, value.toString());
                }
            });

            // Add files if they exist
            if (avatarFile) formDataToSend.append('avatar', avatarFile);
            if (cvFile) formDataToSend.append('cv_link', cvFile);

            await updateUser(user?.id || 0, formDataToSend);
            toast.success('Cập nhật thông tin thành công');
            window.location.reload(); 
            setIsEditing(false);
            onOpenChange(false);
        } catch (error) {
            toast.error('Cập nhật thông tin thất bại');
            console.error(error);
        }
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
                            <AvatarImage src={isEditing && avatarFile ? URL.createObjectURL(avatarFile) : user?.avatar} />
                            <AvatarFallback>
                                {user?.username?.charAt(0).toUpperCase() || 'U'}
                            </AvatarFallback>
                        </Avatar>
                        {isEditing && (
                            <div className="space-y-2">
                                <Label htmlFor="avatar">Thay đổi ảnh đại diện</Label>
                                <Input 
                                    id="avatar" 
                                    type="file" 
                                    accept="image/*"
                                    onChange={(e) => handleFileChange(e, 'avatar')}
                                />
                            </div>
                        )}
                    </div>

                    {/* Personal Info Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <h4 className="font-medium text-sm text-muted-foreground">Thông tin cá nhân</h4>
                            <div className="space-y-1">
                                {isEditing ? (
                                    <>
                                        <div className="space-y-1">
                                            <Label htmlFor="username">Tên đăng nhập</Label>
                                            <Input 
                                                id="username" 
                                                name="username" 
                                                value={formData.username || ''}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label htmlFor="birth_year">Năm sinh</Label>
                                            <Input 
                                                id="birth_year" 
                                                name="birth_year" 
                                                type="number"
                                                value={formData.birth_year || ''}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        {isEditing ? (
                                            <>
                                                <div className="space-y-1">
                                                    <Label htmlFor="gender">Giới tính</Label>
                                                    <Select
                                                        value={formData.gender || 'Nam'}
                                                        onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
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
                                            </>
                                        ) : (
                                            <p><span className="font-medium">Giới tính:</span> {user?.gender || 'N/A'}</p>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <p><span className="font-medium">Tên đăng nhập:</span> {user?.username || 'N/A'}</p>
                                        <p><span className="font-medium">Năm sinh:</span> {user?.birth_year || 'N/A'}</p>
                                        <p><span className="font-medium">Giới tính:</span> {user?.gender || 'N/A'}</p>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h4 className="font-medium text-sm text-muted-foreground">Thông tin liên hệ</h4>
                            <div className="space-y-1">
                                {isEditing ? (
                                    <>
                                        <div className="space-y-1">
                                            <Label htmlFor="email">Email</Label>
                                            <Input 
                                                id="email" 
                                                name="email" 
                                                type="email"
                                                value={formData.email || ''}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label htmlFor="phone">Số điện thoại</Label>
                                            <Input 
                                                id="phone" 
                                                name="phone" 
                                                value={formData.phone || ''}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label htmlFor="cv_link">CV</Label>
                                            <Input 
                                                id="cv_link" 
                                                type="file" 
                                                accept=".pdf,.doc,.docx"
                                                onChange={(e) => handleFileChange(e, 'cv_link')}
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <p><span className="font-medium">Email:</span> {user?.email || 'N/A'}</p>
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
                                    </>
                                )}
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

                <div className="flex justify-end gap-2">
                    {isEditing ? (
                        <>
                            <Button variant="outline" onClick={() => setIsEditing(false)}>
                                Hủy
                            </Button>
                            <Button onClick={handleSubmit}>
                                Lưu thay đổi
                            </Button>
                        </>
                    ) : (
                        <Button onClick={() => setIsEditing(true)}>
                            Chỉnh sửa thông tin
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};