import React from "react";
import { Task as TaskType } from "@/@type/type";
import { TaskItem } from "./TaskItem";

interface TaskBoardColumnsProps {
  groupedTasks: Record<string, TaskType[]>;
  statusColors: Record<string, string>;
  onEdit: (task: TaskType) => void;
  onDelete: (task: TaskType) => void;
}

export const TaskBoardColumns: React.FC<TaskBoardColumnsProps> = ({ groupedTasks, statusColors, onEdit, onDelete }) => {
  return (
    <div className="flex flex-wrap gap-6 justify-center">
      {Object.keys(groupedTasks).map((status) => (
        <div
          key={status}
          className={`bg-white rounded-xl shadow-lg p-5 w-full sm:w-[45%] md:w-[30%] border-t-4 ${statusColors[status as keyof typeof statusColors] || "border-gray-200"} transition-all duration-300 hover:shadow-xl min-w-[250px]`}
        >
          <h2 className={`text-xl font-semibold text-center mb-5 py-2 rounded-lg ${statusColors[status as keyof typeof statusColors] || "bg-gray-100 text-gray-700"}`}>
            {status}
          </h2>

          {groupedTasks[status].length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
              <p>Không có công việc</p>
            </div>
          ) : (
            <div className="space-y-4">
              {groupedTasks[status].map((task: TaskType) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
