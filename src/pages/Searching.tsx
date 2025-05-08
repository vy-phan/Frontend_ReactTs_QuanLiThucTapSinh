import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useTask } from '@/hooks/taskApi';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/utils/dateUtils';

export default function Searching() {
  const [searchQuery, setSearchQuery] = useState('');
  const { tasks, fetchTask } = useTask();
  const [filteredTasks, setFilteredTasks] = useState<any[]>([]);

  useEffect(() => {
    fetchTask();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.length > 0) {
      const filtered = tasks.filter(task => 
        task.code.toLowerCase() === query.toLowerCase()
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
          placeholder="Nhập mã công việc..."
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
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full"
            >
              <div className="p-5 flex-grow">
                <div className="flex justify-between items-start mb-3">
                  <Badge variant="outline" className="bg-blue-100 text-blue-800 font-medium">
                    {task.code}
                  </Badge>
                  <div className="flex items-center">
                    <span className={`inline-block w-2 h-2 rounded-full mr-2 ${task.status === 'Hoàn thành' ? 'bg-green-500' : task.status === 'Đang thực hiện' ? 'bg-yellow-500' : 'bg-blue-500'}`}></span>
                    <span className="text-xs font-medium text-gray-600">{task.status}</span>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-800 mb-3 line-clamp-2">
                  {task.title}
                </h3>
                
                <div className="space-y-2 mb-4">
                  {task.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      <span className="font-medium">Mô tả:</span> {task.description}
                    </p>
                  )}
                  
                  {task.deadline && (
                    <p className="text-sm text-gray-600 flex items-center">
                      <svg className="h-4 w-4 text-gray-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="font-medium">Thời hạn:</span> {formatDate(task.deadline)}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 border-t border-gray-100">
                <div className="flex justify-end">
                  <button 
                    className="inline-flex items-center px-3 py-1.5 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    onClick={() => console.log('Join project:', task.id)}
                  >
                    <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Tham gia
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