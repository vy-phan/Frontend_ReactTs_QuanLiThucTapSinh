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
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AddModal } from '@/components/common/Intern/AddModal';

const Intern = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');


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

  // const handleAddUser = async (userData: Omit<User, 'id'>) => {
  //   try {
  //     await createUser(userData);
  //     fetchUsers(); // Refresh the list
  //   } catch (error) {
  //     throw error;
  //   }
  // };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <Card>
        <CardHeader className="border-b">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl">Quản lý Người dùng</CardTitle>
            <div className="flex gap-2">
              <Input
                placeholder="Tìm kiếm người dùng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
              <AddModal />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p>Đang tải dữ liệu...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Tên người dùng</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Vai trò</TableHead>
                  <TableHead>Xác minh</TableHead>
                  <TableHead>Ngày bắt đầu</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell className="font-medium">{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-sm font-medium ${user.role === UserRole.MANAGER
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                        : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        }`}>
                        {user.role === UserRole.MANAGER ? 'Quản lý' : 'Thực tập sinh'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        // variant={user.is_verified ? 'default' : 'destructive'}
                        className={user.is_verified
                          ? 'bg-green-500 hover:bg-green-600 text-white'
                          : 'bg-yellow-500 hover:bg-yellow-600 text-white'
                        }
                      >
                        {user.is_verified ? 'Đã xác minh' : 'Chưa xác minh'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.start_date ? new Date(user.start_date).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button 
                          className="bg-blue-500 hover:bg-blue-600 text-white" 
                          size="sm"
                        >
                          Xem
                        </Button>
                        <Button className='bg-amber-400 hover:bg-amber-500' size="sm">
                          Sửa
                        </Button>
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
                          className={user.role === UserRole.MANAGER ? 'opacity-50 cursor-not-allowed' : ''}
                        >
                          Xóa
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Intern;
