import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/authContext";
import {
    Users,
    ClipboardList,
    CheckCircle,
    Clock,
    ArrowUpRight,
    ArrowDownRight,
    TrendingUp,
    Activity
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
            <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-violet-500 via-purple-500 to-blue-500 text-white shadow-2xl hover:shadow-violet-500/25 transition-all duration-500 hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0 relative z-10">
                    <CardTitle className="text-sm font-semibold text-white/90 tracking-wide uppercase">Tổng người dùng</CardTitle>
                    <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl group-hover:bg-white/30 transition-all duration-300">
                        <Users className="h-6 w-6 text-white" />
                    </div>
                </CardHeader>
                <CardContent className="relative z-10">
                    <div className="text-3xl font-bold mb-2 text-white">{stats.totalUsers.toLocaleString()}</div>
                    <div className="flex items-center mb-4">
                        <div className={`flex items-center text-sm font-medium ${stats.userGrowth >= 0 ? 'text-green-200' : 'text-red-200'}`}>
                            {stats.userGrowth >= 0 ? (
                                <ArrowUpRight className="h-4 w-4 mr-1" />
                            ) : (
                                <ArrowDownRight className="h-4 w-4 mr-1" />
                            )}
                            <span>{Math.abs(stats.userGrowth).toFixed(1)}% so với tháng trước</span>
                        </div>
                    </div>
                    <div className="relative h-2 bg-white/20 rounded-full overflow-hidden">
                        <div
                            className="absolute top-0 left-0 h-full bg-white/60 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: '75%' }}
                        />
                        <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-white/80 to-white/40 rounded-full animate-pulse" style={{ width: '75%' }} />
                    </div>
                </CardContent>
            </Card>
        );
    }, [user?.role, stats.totalUsers, stats.userGrowth]);

    const renderTaskCards = useMemo(() => (
        <>
            <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-blue-50 to-indigo-100 hover:from-blue-100 hover:to-indigo-200 shadow-xl hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 hover:scale-105">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-transparent rounded-full -translate-y-16 translate-x-16" />
                <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0 relative z-10">
                    <CardTitle className="text-sm font-semibold text-slate-600 tracking-wide">Công việc đang tiến hành</CardTitle>
                    <div className="p-2.5 bg-blue-500/10 backdrop-blur-sm rounded-xl group-hover:bg-blue-500/20 transition-all duration-300">
                        <Clock className="h-5 w-5 text-blue-600" />
                    </div>
                </CardHeader>
                <CardContent className="relative z-10">
                    <div className="text-3xl font-bold text-slate-800 mb-2">{stats.inProgressTasks.toLocaleString()}</div>
                    <div className="flex items-center mb-4">
                        <div className={`flex items-center text-sm font-medium ${stats.inProgressTasksChange >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                            {stats.inProgressTasksChange >= 0 ? (
                                <TrendingUp className="h-4 w-4 mr-1" />
                            ) : (
                                <ArrowDownRight className="h-4 w-4 mr-1" />
                            )}
                            <span>{Math.abs(stats.inProgressTasksChange)}% so với tuần trước</span>
                        </div>
                    </div>
                    <div className="relative h-2.5 bg-slate-200 rounded-full overflow-hidden">
                        <div
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-1000 ease-out shadow-sm"
                            style={{ width: '45%' }}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-emerald-50 to-green-100 hover:from-emerald-100 hover:to-green-200 shadow-xl hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-500 hover:scale-105">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-400/10 to-transparent rounded-full -translate-y-16 translate-x-16" />
                <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0 relative z-10">
                    <CardTitle className="text-sm font-semibold text-slate-600 tracking-wide">Công việc hoàn thành</CardTitle>
                    <div className="p-2.5 bg-emerald-500/10 backdrop-blur-sm rounded-xl group-hover:bg-emerald-500/20 transition-all duration-300">
                        <CheckCircle className="h-5 w-5 text-emerald-600" />
                    </div>
                </CardHeader>
                <CardContent className="relative z-10">
                    <div className="text-3xl font-bold text-slate-800 mb-2">{stats.completedTasks.toLocaleString()}</div>
                    <div className="flex items-center mb-4">
                        <div className={`flex items-center text-sm font-medium ${stats.completedTasksChange >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                            {stats.completedTasksChange >= 0 ? (
                                <TrendingUp className="h-4 w-4 mr-1" />
                            ) : (
                                <ArrowDownRight className="h-4 w-4 mr-1" />
                            )}
                            <span>{Math.abs(stats.completedTasksChange)}% so với tuần trước</span>
                        </div>
                    </div>
                    <div className="relative h-2.5 bg-slate-200 rounded-full overflow-hidden">
                        <div
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full transition-all duration-1000 ease-out shadow-sm"
                            style={{ width: '80%' }}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-amber-50 to-yellow-100 hover:from-amber-100 hover:to-yellow-200 shadow-xl hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-500 hover:scale-105">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-400/10 to-transparent rounded-full -translate-y-16 translate-x-16" />
                <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0 relative z-10">
                    <CardTitle className="text-sm font-semibold text-slate-600 tracking-wide">Công việc đang chờ</CardTitle>
                    <div className="p-2.5 bg-amber-500/10 backdrop-blur-sm rounded-xl group-hover:bg-amber-500/20 transition-all duration-300">
                        <ClipboardList className="h-5 w-5 text-amber-600" />
                    </div>
                </CardHeader>
                <CardContent className="relative z-10">
                    <div className="text-3xl font-bold text-slate-800 mb-2">{stats.pendingTasks.toLocaleString()}</div>
                    <div className="flex items-center mb-4">
                        <div className={`flex items-center text-sm font-medium ${stats.pendingTasksChange >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                            {stats.pendingTasksChange >= 0 ? (
                                <TrendingUp className="h-4 w-4 mr-1" />
                            ) : (
                                <ArrowDownRight className="h-4 w-4 mr-1" />
                            )}
                            <span>{Math.abs(stats.pendingTasksChange)}% so với tuần trước</span>
                        </div>
                    </div>
                    <div className="relative h-2.5 bg-slate-200 rounded-full overflow-hidden">
                        <div
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-1000 ease-out shadow-sm"
                            style={{ width: '20%' }}
                        />
                    </div>
                </CardContent>
            </Card>
        </>
    ), [stats.inProgressTasks, stats.completedTasks, stats.pendingTasks, stats.inProgressTasksChange, stats.completedTasksChange, stats.pendingTasksChange]);

    return (
        <div className="bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
            <div className="container mx-auto p-6 lg:p-8">
                {/* Header Section */}
                <div className="mb-10 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 rounded-3xl -z-10" />
                    <div className="relative z-10 text-center lg:text-left py-8 px-6">
                        <div className="flex items-center justify-center lg:justify-start mb-4">
                            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg mr-4">
                                <Activity className="h-8 w-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                                    Tổng Quan
                                </h1>
                                <p className="text-slate-600 mt-2 text-lg">Theo dõi hiệu suất và tiến độ công việc của bạn</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                    {renderUserCard}
                    {renderTaskCards}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;