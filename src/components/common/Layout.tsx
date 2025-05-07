import { Link } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { LayoutDashboard, CheckSquare, Plus, Image } from 'lucide-react';
import { LayoutProps } from '@/@type/type';
import { logoutUser } from '@/hooks/authApi';
import { useAuth } from '@/context/authContext';
import { getAvatarUrl } from '@/utils/displayAvatar';
import { useState } from 'react';
import { ProfileDialog } from './ProfileDialog';
import { Toaster } from 'sonner';
import { ChangePasswordDialog } from './ChangePasswordDialog';


const Layout = ({ children }: LayoutProps) => {
  // Lấy thông tin user từ auth context
  const { user } = useAuth();
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [isChangePasswordDialogOpen, setIsChangePasswordDialogOpen] = useState(false);

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background transition-all duration-300 ease-in-out">
        <Sidebar className="shadow-md transition-all duration-300 ease-in-out flex flex-col bg-[#0f1729] border-r border-[#1d283a]">
          <SidebarHeader className="p-4">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-black">
                <img src='/src/assets/react.svg' />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold">Acme Inc</span>
                <span className="text-xs text-sidebar-foreground/70">Enterprise</span>
              </div>
            </div>
          </SidebarHeader>
          <SidebarSeparator className="mb-2" />
          <SidebarContent>
            <div className="px-2 py-2">
              {/* tach 1  */}
              <h2 className="px-4 text-xs font-semibold tracking-tight">Quản lí</h2>
              <SidebarMenu className="mt-2">
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Playground">
                    <Link to="/">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Home</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Starred">
                    <Link to="/task">
                      <CheckSquare className="mr-2 h-4 w-4" />
                      <span>Công việc</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                {
                  user?.role === 'MANAGER' && (
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild tooltip="Settings">
                        <Link to="/intern">
                          <Image className="mr-2 h-4 w-4" />
                          <span>Thực tập</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                }
              </SidebarMenu>
            </div>

            <div className="px-2 py-2">
              {/* tach 2 */}
              <h2 className="px-4 text-xs font-semibold tracking-tight">Tiện ích</h2>
              <SidebarMenu className="mt-2">
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Tiện ích">
                    <Link to="/search">
                      <Plus className="mr-2 h-4 w-4" />
                      <span>Tìm kiếm</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </div>
          </SidebarContent>
          <SidebarFooter className="mt-auto p-4">
            <div className="relative">
              <button
                className="flex items-center gap-2 w-full rounded-md px-2 py-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                onClick={(e) => {
                  e.stopPropagation();
                  const dropdown = document.getElementById('avatar-dropdown');
                  dropdown?.classList.toggle('hidden');
                }}
              >
                <div className="w-10 h-10 rounded-full overflow-hidden">
                  <img
                    src={getAvatarUrl(user?.avatar)}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/src/assets/avatar.png'; // Updated path
                    }}
                  />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium">{user?.username || 'Guest'}</span>
                  <span className="text-xs text-sidebar-foreground/70">{user?.email || 'Guest@example.com'}</span>
                </div>
              </button>
              <div
                id="avatar-dropdown"
                className="absolute bottom-full left-0 mb-2 w-full bg-sidebar-accent rounded-md shadow-lg py-1 hidden border border-[#2d3748]"
              >
                <button
                  className="block px-4 py-2 text-sm hover:bg-[#1e40af] w-full text-left transition-colors duration-200"
                  onClick={() => setIsProfileDialogOpen(true)}
                >
                  Thông tin cá nhân
                </button>
                <button
                  className="block px-4 py-2 text-sm hover:bg-[#1e40af] w-full text-left transition-colors duration-200"
                  onClick={() => setIsChangePasswordDialogOpen(true)}

                >
                  Đổi mật khẩu
                </button>
                <button
                  className="block px-4 py-2 text-sm hover:bg-[#1e40af] w-full text-left transition-colors duration-200"
                  onClick={async () => {
                    try {
                      await logoutUser();
                      // Thêm logic redirect sau khi logout nếu cần
                      window.location.href = '/login';
                    } catch (error) {
                      console.error('Logout failed:', error);
                    }
                  }}
                >
                  Đăng xuất
                </button>

                {/* Profile Dialog */}
                <ProfileDialog
                  open={isProfileDialogOpen}
                  onOpenChange={() => setIsProfileDialogOpen(false)}
                  user={user}
                />

                <ChangePasswordDialog
                  open={isChangePasswordDialogOpen}
                  onOpenChange={setIsChangePasswordDialogOpen}
                  userId={user?.id || 0}
                />


              </div>
            </div>
          </SidebarFooter>
        </Sidebar>


        <SidebarInset className="transition-all duration-300 ease-in-out">
          <div className="p-4 transition-all duration-300">
            <div className="flex items-center justify-between bg-card/50 p-2 rounded-lg shadow-sm transition-all duration-300">
              <SidebarTrigger className="hover:bg-sidebar-primary/10 transition-all duration-200" />
              <div className="flex items-center justify-end gap-2 relative ml-auto">

              </div>
            </div>
            <main className="mt-6 transition-all duration-300">
              {children}
            </main>
            <Toaster />

          </div>
        </SidebarInset>

      </div>
    </SidebarProvider>
  );
};

export default Layout;