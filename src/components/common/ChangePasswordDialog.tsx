import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { updateUser } from '@/hooks/userApi';
import { loginUser } from '@/hooks/authApi';
import { toast } from 'sonner';
import { useAuth } from '@/context/authContext';
import { z } from 'zod';
import { ErrorMessage } from './ErrorMessage';

interface ChangePasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: number;
}

export const ChangePasswordDialog = ({ open, onOpenChange, userId }: ChangePasswordDialogProps) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();


  const handleReauthenticate = async () => {
    setIsLoading(true);
    try {
      await loginUser({ email: user?.email || '', password: currentPassword });
      setIsAuthenticated(true);
      toast.success('Xác thực thành công');
    } catch (error) {
      toast.error('Mật khẩu hiện tại không đúng');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    try {
      // Validate new password
      const passwordSchema = z.string().min(6, "mật Khẩu phải có ít nhất 6 ký tự");
      passwordSchema.parse(newPassword);

      if (newPassword !== confirmPassword) {
        toast.error('Mật khẩu mới không khớp');
        return;
      }

      setIsLoading(true);
      const formData = new FormData();
      formData.append('password', newPassword);

      await updateUser(userId, formData);
      toast.success('Đổi mật khẩu thành công');
      onOpenChange(false);
      resetForm();
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Zod validation error - show error message
        return;
      }
      toast.error('Đổi mật khẩu thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setIsAuthenticated(false);
  };

  return (
    <Dialog open={open} onOpenChange={(open) => {
      if (!open) resetForm();
      onOpenChange(open);
    }}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Đổi mật khẩu</DialogTitle>
        </DialogHeader>

        {!isAuthenticated ? (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Nhập mật khẩu hiện tại</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Mật khẩu hiện tại"
              />
            </div>
            <Button
              onClick={handleReauthenticate}
              disabled={!currentPassword || isLoading}
              className="w-full"
            >
              {isLoading ? 'Đang xác thực...' : 'Xác thực'}
            </Button>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">Mật khẩu mới</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Mật khẩu mới (ít nhất 6 ký tự)"
              />
              {newPassword && newPassword.length < 6 && (
                <ErrorMessage message="Mật khẩu phải có ít nhất 6 ký tự" />
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Xác nhận mật khẩu mới"
              />
              {confirmPassword && newPassword !== confirmPassword && (
                <ErrorMessage message="Mật khẩu không khớp" />
              )}
            </div>
            <Button
              onClick={handleChangePassword}
              disabled={!newPassword || !confirmPassword || newPassword.length < 6 || newPassword !== confirmPassword || isLoading}
              className="w-full"
            >
              {isLoading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};