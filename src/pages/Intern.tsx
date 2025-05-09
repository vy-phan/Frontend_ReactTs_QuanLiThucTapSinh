import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getAllUsers, deleteUser } from '@/hooks/userApi';
import { User, UserRole } from '@/@type/type';
import { toast } from 'sonner';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AddModal } from '@/components/common/Intern/AddModal';
import { EditModal } from '@/components/common/Intern/EditModal';
import { DetailModal } from '@/components/common/Intern/DetailModal';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs,TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, RefreshCw } from 'lucide-react';

const Intern = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number | string) => {
    try {
      await deleteUser(id);
      toast.success('Đã xóa người dùng thành công');
      fetchUsers();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete user');
    }
  };

  // Stats calculation
  const totalUsers = users.length;
  const verifiedUsers = users.filter(user => user.is_verified).length;

  // Filter users based on active tab and search term
  const getFilteredUsers = () => {
    let filtered = users;
    
    // Filter by tab
    if (activeTab === 'verified') {
      filtered = filtered.filter(user => user.is_verified);
    } else if (activeTab === 'unverified') {
      filtered = filtered.filter(user => !user.is_verified);
    } else if (activeTab === 'managers') {
      filtered = filtered.filter(user => user.role === UserRole.MANAGER);
    } else if (activeTab === 'interns') {
      filtered = filtered.filter(user => user.role === UserRole.INTERN);
    }
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  };

  const filteredUsers = getFilteredUsers();

  return (
    <div className="p-6 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Main Content Card */}
        <Card className="shadow-sm border border-gray-200 overflow-hidden">
          <CardHeader className="border-b bg-white py-4">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div>
                <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Quản lý Người dùng</CardTitle>
                <CardDescription className="text-gray-500 mt-1">Quản lý tất cả người dùng trong hệ thống</CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Tìm kiếm người dùng..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 w-full sm:w-64 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={fetchUsers} 
                    className="hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <AddModal />
                </div>
              </div>
            </div>
          </CardHeader>

          {/* Tabs */}
          <div className="px-6 pt-4 border-b">
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-gray-100">
                <TabsTrigger value="all" className="data-[state=active]:bg-white">Tất cả</TabsTrigger>
                <TabsTrigger value="verified" className="data-[state=active]:bg-white">Đã xác minh</TabsTrigger>
                <TabsTrigger value="unverified" className="data-[state=active]:bg-white">Chưa xác minh</TabsTrigger>
                <TabsTrigger value="managers" className="data-[state=active]:bg-white">Quản lý</TabsTrigger>
                <TabsTrigger value="interns" className="data-[state=active]:bg-white">Thực tập sinh</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <CardContent className="p-0">
            {loading ? (
              <div className="p-6 space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 hover:bg-gray-50">
                      <TableHead className="font-semibold">ID</TableHead>
                      <TableHead className="font-semibold">Người dùng</TableHead>
                      <TableHead className="font-semibold">Email</TableHead>
                      <TableHead className="font-semibold">Vai trò</TableHead>
                      <TableHead className="font-semibold">Xác minh</TableHead>
                      <TableHead className="font-semibold">Ngày bắt đầu</TableHead>
                      <TableHead className="text-right font-semibold">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                          Không tìm thấy người dùng nào
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user) => (
                        <TableRow key={user.id} className="hover:bg-gray-50 transition-colors">
                          <TableCell>{user.id}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-9 w-9 border border-gray-200">
                                <AvatarImage 
                                  src={user?.avatar || '/src/assets/avatar.png'}
                                  alt={user?.username}
                                />
                                <AvatarFallback className="bg-blue-100 text-blue-600">
                                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-gray-900">{user.username}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-600">{user.email}</TableCell>
                          <TableCell>
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${user.role === UserRole.MANAGER
                              ? 'bg-purple-100 text-purple-800 border border-purple-200'
                              : 'bg-green-100 text-green-800 border border-green-200'
                              }`}>
                              {user.role === UserRole.MANAGER ? 'Quản lý' : 'Thực tập sinh'}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={`${user.is_verified
                                ? 'bg-green-500 hover:bg-green-600 text-white'
                                : 'bg-yellow-500 hover:bg-yellow-600 text-white'
                                } shadow-sm`}
                            >
                              {user.is_verified ? 'Đã xác minh' : 'Chưa xác minh'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {user.start_date ? (
                              <div className="flex flex-col">
                                <span className="text-gray-900">
                                  {new Date(user.start_date).toLocaleDateString('vi-VN')}
                                </span>
                           
                              </div>
                            ) : 'N/A'}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-2 justify-end">
                              <DetailModal user={user} />
                              <EditModal
                                user={user}
                                onSuccess={fetchUsers}
                              />
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => {
                                  if (user.role === UserRole.MANAGER) {
                                    toast.error('Không thể xóa tài khoản quản lý');
                                    return;
                                  }
                                  if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
                                    handleDelete(user.id);
                                  }
                                }}
                                className={`${user.role === UserRole.MANAGER ? 'opacity-50 cursor-not-allowed' : ''} shadow-sm`}
                              >
                                Xóa
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
          <CardFooter className="border-t py-3 px-6 bg-gray-50">
            <div className="text-sm text-gray-500">Hiển thị {filteredUsers.length} trên tổng số {totalUsers} người dùng</div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Intern;
