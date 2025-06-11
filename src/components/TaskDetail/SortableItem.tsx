import { formatDate } from "@/utils/dateUtils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export const SortableItem = ({ task }: { task: any }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id.toString() });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition: transition || 'box-shadow 0.25s cubic-bezier(0.4,0,0.2,1), transform 0.25s cubic-bezier(0.4,0,0.2,1)',
        opacity: isDragging ? 0.92 : 1,
        backgroundColor: '#fff',
        borderRadius: '0.75rem',
        position: 'relative' as const,
        overflow: 'hidden' as const,
        boxShadow: isDragging ? '0 8px 32px 0 rgba(0, 120, 255, 0.18), 0 2px 8px 0 rgba(0,0,0,0.12)' : '0 1px 4px 0 rgba(0,0,0,0.07)',
        zIndex: isDragging ? 20 : 1,
        scale: isDragging ? '1.025' : '1',
        border: isDragging ? '2px solid #3b82f6' : undefined,
    };

    // Determine status color
    const getStatusColor = () => {
        switch(task.status) {
            case "Đã giao": return "border-l-amber-500";
            case "Đang thực hiện": return "border-l-blue-500";
            case "Hoàn thành": return "border-l-emerald-500";
            default: return "border-l-gray-300";
        }
    };

    return (
        <div 
            ref={setNodeRef} 
            style={style} 
            {...attributes} 
            {...listeners}
            className={`border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 p-4 mb-3 border-l-4 ${getStatusColor()} ${isDragging ? 'ring-2 ring-blue-400/60 cursor-grabbing' : 'cursor-grab active:cursor-grabbing'}`}
        >
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-md font-bold text-gray-800">{task.title}</h3>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-medium">
                    ID: {task.id}
                </span>
            </div>
            
            <p className="text-sm text-gray-600 mb-3">{task.description}</p>
            
            <div className="flex flex-wrap justify-between items-center text-xs text-gray-500 mt-3 pt-2 border-t border-gray-100">
                <div className="flex items-center gap-1 w-[48%] min-w-[48%]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    <span className="break-words">Cập nhật {formatDate(task.updated_at)}</span>
                </div>
                
                <div className="flex items-center gap-1 w-[48%] min-w-[48%] justify-end">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                    <span className="break-words text-left">
                        {task.assignees && task.assignees.length > 0
                            ? task.assignees.map((assignee: any) => assignee.username).join(", ")
                            : "Chưa có"}
                    </span>
                </div>
            </div>
        </div>
    );
};