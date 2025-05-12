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
import { useEffect, useState, useMemo, useCallback } from 'react';
import { getAllUsers } from '@/hooks/userApi';

interface DashboardProps {
    userTasks: any[];
}

interface DashboardStats {
    totalUsers: number;
    userGrowth: number;
    inProgressTasks: number;
    inProgressTasksChange: number;
    completedTasks: number;
    completedTasksChange: number;
    pendingTasks: number;
    pendingTasksChange: number;
}

const Dashboard = ({ userTasks }: DashboardProps) => {
    const { user } = useAuth();

    // Memoize task counts to avoid recalculating on every render
    const taskCounts = useMemo(() => ({
        inProgress: userTasks.filter(task => task.status === 'Đang thực hiện').length,
        completed: userTasks.filter(task => task.status === 'Hoàn thành').length,
        pending: userTasks.filter(task => task.status === 'Đã giao').length
    }), [userTasks]);

    const [stats, setStats] = useState<DashboardStats>({
        totalUsers: 0,
        userGrowth: 0,
        inProgressTasks: taskCounts.inProgress,
        inProgressTasksChange: -3.2,
        completedTasks: taskCounts.completed,
        completedTasksChange: 8.7,
        pendingTasks: taskCounts.pending,
        pendingTasksChange: 2.3,
    });

    // Memoized fetch function
    const fetchUserCount = useCallback(async () => {
        try {
            const users = await getAllUsers();
            setStats(prev => ({
                ...prev,
                totalUsers: users.length,
                // Calculate actual growth percentage if previous data is available
                userGrowth: prev.totalUsers > 0 
                    ? ((users.length - prev.totalUsers) / prev.totalUsers) * 100
                    : 0
            }));
        } catch (error) {
            console.error('Failed to fetch users:', error);
        }
    }, []);

    // Update stats when task counts change
    useEffect(() => {
        setStats(prev => ({
            ...prev,
            inProgressTasks: taskCounts.inProgress,
            completedTasks: taskCounts.completed,
            pendingTasks: taskCounts.pending
        }));
    }, [taskCounts]);

    // Fetch user count on mount
    useEffect(() => {
        fetchUserCount();
    }, [fetchUserCount]);

    // Memoize card components to prevent unnecessary re-renders
    const renderUserCard = useMemo(() => {
        if (user?.role !== 'MANAGER') return null;
        
        return (
            <Card className="overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium text-gray-500">Tổng người dùng</CardTitle>
                    <Users className="h-5 w-5 text-indigo-500" />
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
                            className="h-full bg-indigo-500 rounded-full"
                            style={{ width: '75%' }}
                        />
                    </div>
                </CardContent>
            </Card>
        );
    }, [user?.role, stats.totalUsers, stats.userGrowth]);

    const renderTaskCards = useMemo(() => (
        <>
            <Card className="overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium text-gray-500">Công việc đang tiến hành</CardTitle>
                    <Clock className="h-5 w-5 text-blue-500" />
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
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: '45%' }}
                        />
                    </div>
                </CardContent>
            </Card>
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
            <Card className="overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-sm font-medium text-gray-500">Công việc đang chờ</CardTitle>
                    <ClipboardList className="h-5 w-5 text-yellow-500" />
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
                            className="h-full bg-yellow-500 rounded-full"
                            style={{ width: '20%' }}
                        />
                    </div>
                </CardContent>
            </Card>
        </>
    ), [stats.inProgressTasks, stats.completedTasks, stats.pendingTasks]);

    return (
        <div className="container mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Tổng Quan</h1>
                <p className="text-gray-500 mt-1">Xem tổng quan về người dùng và tình trạng công việc</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {renderUserCard}
                {renderTaskCards}
            </div>
        </div>
    );
};

export default Dashboard;