import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/authContext";
import {
    Users,
    ClipboardList,
    CheckCircle,
    Clock,
    ArrowUpRight,
    ArrowDownRight
} from "lucide-react";
import { useEffect, useState } from 'react';
import { getAllUsers } from '@/hooks/userApi';

interface DashboardProps {
  userTasks: any[];
}

const Dashboard = ({ userTasks }: DashboardProps) => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        userGrowth: 0,
        inProgressTasks: userTasks.filter(task => task.status === 'Đang thực hiện').length,
        inProgressTasksChange: -3.2,
        completedTasks: userTasks.filter(task => task.status === 'Hoàn thành').length,
        completedTasksChange: 8.7,
        pendingTasks: userTasks.filter(task => task.status === 'Đã giao').length,
        pendingTasksChange: 2.3,
    });

    // Update stats when userTasks changes
    useEffect(() => {
      setStats(prev => ({
        ...prev,
        inProgressTasks: userTasks.filter(task => task.status === 'Đang thực hiện').length,
        completedTasks: userTasks.filter(task => task.status === 'Hoàn thành').length,
        pendingTasks: userTasks.filter(task => task.status === 'Đã giao').length
      }));
    }, [userTasks]);

    useEffect(() => {
        const fetchUserCount = async () => {
            try {
                const users = await getAllUsers();
                setStats(prev => ({
                    ...prev,
                    totalUsers: users.length
                }));
            } catch (error) {
                console.error('Failed to fetch users:', error);
            }
        };
        
        fetchUserCount();
    }, []);

    const { user } = useAuth()

    return (
        <div className="container mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Tổng Quan</h1>
                <p className="text-gray-500 mt-1">Xem tổng quan về người dùng và tình trạng công việc</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Card 1: Tổng người dùng */}
                {
                    user?.role === 'MANAGER' ? (
                        <Card className="overflow-hidden">
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                <CardTitle className="text-sm font-medium text-gray-500">Tổng người dùng</CardTitle>
                                <Users className="h-5 w-5 text-blue-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
                                <div className="flex items-center mt-1">
                                    <div className={`flex items-center text-xs ${stats.userGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                        {stats.userGrowth >= 0 ? (
                                            <ArrowUpRight className="h-3 w-3 mr-1" />
                                        ) : (
                                            <ArrowDownRight className="h-3 w-3 mr-1" />
                                        )}
                                        <span>{Math.abs(stats.userGrowth)}% so với tháng trước</span>
                                    </div>
                                </div>
                                <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-500 rounded-full"
                                        style={{ width: '75%' }}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    ) : (null)
                }


                {/* Card 2: Công việc đang tiến hành */}
                <Card className="overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium text-gray-500">Công việc đang tiến hành</CardTitle>
                        <Clock className="h-5 w-5 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.inProgressTasks.toLocaleString()}</div>
                        <div className="flex items-center mt-1">
                            <div className={`flex items-center text-xs ${stats.inProgressTasksChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {stats.inProgressTasksChange >= 0 ? (
                                    <ArrowUpRight className="h-3 w-3 mr-1" />
                                ) : (
                                    <ArrowDownRight className="h-3 w-3 mr-1" />
                                )}
                                <span>{Math.abs(stats.inProgressTasksChange)}% so với tuần trước</span>
                            </div>
                        </div>
                        <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-yellow-500 rounded-full"
                                style={{ width: '45%' }}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Card 3: Công việc hoàn thành */}
                <Card className="overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium text-gray-500">Công việc hoàn thành</CardTitle>
                        <CheckCircle className="h-5 w-5 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.completedTasks.toLocaleString()}</div>
                        <div className="flex items-center mt-1">
                            <div className={`flex items-center text-xs ${stats.completedTasksChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {stats.completedTasksChange >= 0 ? (
                                    <ArrowUpRight className="h-3 w-3 mr-1" />
                                ) : (
                                    <ArrowDownRight className="h-3 w-3 mr-1" />
                                )}
                                <span>{Math.abs(stats.completedTasksChange)}% so với tuần trước</span>
                            </div>
                        </div>
                        <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-green-500 rounded-full"
                                style={{ width: '80%' }}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Card 4: Công việc đang chờ */}
                <Card className="overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium text-gray-500">Công việc đang chờ</CardTitle>
                        <ClipboardList className="h-5 w-5 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.pendingTasks.toLocaleString()}</div>
                        <div className="flex items-center mt-1">
                            <div className={`flex items-center text-xs ${stats.pendingTasksChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {stats.pendingTasksChange >= 0 ? (
                                    <ArrowUpRight className="h-3 w-3 mr-1" />
                                ) : (
                                    <ArrowDownRight className="h-3 w-3 mr-1" />
                                )}
                                <span>{Math.abs(stats.pendingTasksChange)}% so với tuần trước</span>
                            </div>
                        </div>
                        <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-purple-500 rounded-full"
                                style={{ width: '20%' }}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>


        </div>
    );
};

export default Dashboard;