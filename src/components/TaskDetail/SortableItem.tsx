import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export const SortableItem = ({ task }: { task: any }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id.toString() });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.8 : 1,
        border: "1px solid #e5e7eb",
        backgroundColor: "#fff",
        padding: "16px",
        marginBottom: "12px",
        borderRadius: "12px",
        boxShadow: isDragging
            ? "0 4px 12px rgba(0, 0, 0, 0.15)"
            : "0 2px 6px rgba(0, 0, 0, 0.1)",
        cursor: "grab",
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <h3 className="text-md font-bold">{task.title}</h3>
            <p className="text-sm text-gray-500">{task.description}</p>
            <p className="text-xs text-gray-400 mt-2">
                Cập nhật: {new Date(task.updated_at).toLocaleString()}
            </p>
            <div className="mt-2 text-sm text-gray-600">
                <strong>Người làm:</strong>{" "}
                {task.assignees && task.assignees.length > 0
                    ? task.assignees.map((assignee: any) => assignee.username).join(", ")
                    : "Chưa có"}
            </div>
        </div>
    );
};