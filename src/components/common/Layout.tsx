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
import { LayoutDashboard, CheckSquare, Plus, FileText, Image } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
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
              <h2 className="px-4 text-xs font-semibold tracking-tight">Platform</h2>
              <SidebarMenu className="mt-2">
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Playground" isActive>
                    <Link to="/">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Home</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="History">
                    <Link to="/history">
                      <FileText className="mr-2 h-4 w-4" />
                      <span>History</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Starred">
                    <Link to="/starred">
                      <CheckSquare className="mr-2 h-4 w-4" />
                      <span>Starred</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Settings">
                    <Link to="/settings">
                      <Image className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="task detail">
                    <Link to="/task-detail">
                      <Image className="mr-2 h-4 w-4" />
                      <span>Task detail</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </div>
            
            <div className="px-2 py-2">
              {/* tach 2 */}
              <h2 className="px-4 text-xs font-semibold tracking-tight">Documentation</h2>
              <SidebarMenu className="mt-2">
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Documentation">
                    <Link to="/docs">
                      <Plus className="mr-2 h-4 w-4" />
                      <span>Documentation</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </div>
          </SidebarContent>
          <SidebarFooter className="mt-auto p-4">
            <Link to="/profile" className="flex items-center gap-2 rounded-md px-2 py-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <img src='https://i.pinimg.com/236x/69/c4/2f/69c42f0fda1f02d565f835fe92ca6944.jpg' alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">Thai Leader</span>
                <span className="text-xs text-sidebar-foreground/70">m@example.com</span>
                <span className='text-xs' >xin chào mọi người</span>
              </div>
            </Link>
          </SidebarFooter>
        </Sidebar>


        <SidebarInset className="transition-all duration-300 ease-in-out">
          <div className="p-4 transition-all duration-300">
            <div className="flex items-center justify-between bg-card/50 p-2 rounded-lg shadow-sm transition-all duration-300">
              <SidebarTrigger className="hover:bg-sidebar-primary/10 transition-all duration-200" />
              <div className="flex items-center gap-2">
                {/* User profile or other header elements can go here */}
              </div>
            </div>
            <main className="mt-6 transition-all duration-300">
              {children}
            </main>

          </div>
        </SidebarInset>

      </div>
    </SidebarProvider>
  );
};

export default Layout;