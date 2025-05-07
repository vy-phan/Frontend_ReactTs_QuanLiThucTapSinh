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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map((task) => (
            <div key={task.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200">
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base text-gray-800 truncate">{task.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">#{task.code}</p>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`text-sm px-3 py-1 ${
                      task.status === 'Hoàn thành' ? 'bg-green-100 text-green-800' :
                      task.status === 'Đang thực hiện' ? 'bg-blue-400 text-white' :
                      'bg-yellow-300 text-gray-800'
                    }`}
                  >
                    {task.status}
                  </Badge>
                </div>
                
                {task.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{task.description}</p>
                )}
                
                {task.deadline && (
                  <div className="flex items-center text-sm text-gray-600 mb-4">
                    <span className="mr-1">⏰</span>
                    <span>{formatDate(task.deadline)}</span>
                  </div>
                )}
                
                <div className="flex justify-end">
                  <button 
                    className="text-sm bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-full transition-colors"
                    onClick={() => console.log('Join project:', task.id)}
                  >
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