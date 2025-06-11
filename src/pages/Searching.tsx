import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useTask } from '@/hooks/taskApi';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/utils/dateUtils';
import { useNavigate } from 'react-router-dom';

export default function Searching() {
  const [searchQuery, setSearchQuery] = useState('');
  const { tasks, fetchTask } = useTask();
  const [filteredTasks, setFilteredTasks] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTask();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.length > 0) {
      const filtered = tasks.filter(task => 
        task.code.toLowerCase().includes(query.toLowerCase()) ||
        task.title.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredTasks(filtered);
    } else {
      setFilteredTasks([]);
    }
  };

  return (
    <div className="w-full px-4"> {/* Changed from max-w-md mx-auto */}
      <div className="relative mb-6 w-full"> {/* Added w-full */}
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <Input
          type="text"
          placeholder="Nhập mã hoặc tên công việc..."  // Updated placeholder
          value={searchQuery}
          onChange={handleSearch}
          className="pl-10 w-full" // Added w-full
        />
      </div>

      {filteredTasks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className="backdrop-blur-md bg-white/70 dark:bg-slate-800/70 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col h-full ring-1 ring-gray-100 dark:ring-gray-700 hover:ring-2 hover:ring-blue-200 dark:hover:ring-blue-400"
              style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.85) 60%, rgba(230,244,255,0.7) 100%)' }}
            >
              <div className="p-6 flex-grow">
                <div className="flex justify-between items-start mb-4">
                  <Badge variant="outline" className="bg-gradient-to-r from-blue-200 to-blue-100 text-blue-900 font-semibold shadow-sm px-3 py-1">
                    {task.code}
                  </Badge>
                  <div className="flex items-center">
                    <span className={`inline-block w-2 h-2 rounded-full mr-2 shadow ${task.status === 'Đã hoàn thành' ? 'bg-green-500' : task.status === 'Đang thực hiện' ? 'bg-blue-500' : 'bg-yellow-500'}`}></span>
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{task.status}</span>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 drop-shadow-sm">
                  {task.title}
                </h3>
                
                <div className="space-y-2 mb-5">
                  {task.description && (
                    <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                      <span className="font-medium">Mô tả:</span> {task.description}
                    </p>
                  )}
                  
                  {task.deadline && (
                    <p className="text-sm text-gray-700 dark:text-gray-300 flex items-center">
                      <svg className="h-4 w-4 text-blue-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="font-medium">Thời hạn:</span> {formatDate(task.deadline)}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="bg-gray-100/70 dark:bg-slate-900/50 p-5 border-t border-gray-200 dark:border-gray-700 backdrop-blur-sm">
                <div className="flex justify-end">
                  <button 
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-400 shadow-lg text-white text-base font-semibold hover:from-blue-600 hover:to-blue-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2"
                    onClick={() => navigate(`/task_detail/${task.id}`)}
                  >
                    <svg className="h-5 w-5 mr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Chi tiết
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-10"> {/* Changed from text-center */}
          {searchQuery ? 'Không tìm thấy công việc nào' : 'Nhập mã công việc để tìm kiếm'}
        </div>
      )}
    </div>
  );
}