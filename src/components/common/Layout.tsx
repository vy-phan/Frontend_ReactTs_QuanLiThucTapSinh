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
import avatarImage from '@/assets/avatar.svg';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background transition-all duration-300 ease-in-out">
        <Sidebar className="shadow-md transition-all duration-300 ease-in-out flex flex-col bg-[#0f1729] border-r border-[#1d283a]">
          <SidebarHeader className="p-4">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-white">
                  <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
                  <path d="M3 9V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4" />
                </svg>
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
              </SidebarMenu>
            </div>
            <div className="px-2 py-2">
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
              <div className="w-8 h-8 rounded-full overflow-hidden">
                <img src={avatarImage} alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">shadcn</span>
                <span className="text-xs text-sidebar-foreground/70">m@example.com</span>
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