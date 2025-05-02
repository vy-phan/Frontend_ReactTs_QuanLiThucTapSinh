import { useEffect, useState } from "react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useParams } from "react-router-dom";
import { DroppableContainer } from "./TaskDetail/DroppableContainer";
import { SortableItem } from "./TaskDetail/SortableItem";
import { TaskDetailForm } from "./TaskDetail/TaskDetailForm";
import { useTaskDetail } from "../hooks/taskDetailApi";
import { TaskDetail as TaskDetailType } from "@/@type/type"; // Import type TaskDetail
import apiClient from "../lib/apiClient";  // Import apiClient
import { TASK_DETAIL_ENDPOINTS } from "../constants/api";

export const TaskDetail = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const { tabs, setTabs, fetchTaskDetail, updateTaskStatus } = useTaskDetail(taskId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", description: "", status: "Đã giao", assignees: "" });

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor));

  useEffect(() => {
    fetchTaskDetail(); 
  }, []);

  const handleAddTaskDetail = async () => {
    const payload = {
      ...newTask,
      task_id: taskId,
      assignees: newTask.assignees.split(",").map((a) => a.trim()).filter(Boolean),
    };

    try {
      await apiClient.post(TASK_DETAIL_ENDPOINTS.CREATE, payload, { withCredentials: true });
      setIsModalOpen(false);
      setNewTask({ title: "", description: "", status: "Đã giao", assignees: "" });
      fetchTaskDetail();
    } catch (err) {
      console.error("Lỗi thêm task detail:", err);
    }
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeId = active.id.toString();
    const overId = over.id.toString();

    const sourceTab = Object.keys(tabs).find((tab) => tabs[tab].some((t) => t.id.toString() === activeId));
    const destinationTab = overId;
    if (!sourceTab || !tabs[destinationTab] || sourceTab === destinationTab) return;

    const sourceTasks = [...tabs[sourceTab]];
    const movedTaskIndex = sourceTasks.findIndex((t) => t.id.toString() === activeId);
    const [movedTask] = sourceTasks.splice(movedTaskIndex, 1);
    movedTask.status = destinationTab;
    const destinationTasks = [...tabs[destinationTab], movedTask];

    setTabs({ ...tabs, [sourceTab]: sourceTasks, [destinationTab]: destinationTasks });
    updateTaskStatus(movedTask.id.toString(), destinationTab);
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-10 text-gray-700">Chi tiết công việc</h1>
      <div className="text-center mb-6">
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">+ Thêm Task Detail</button>
      </div>
      <TaskDetailForm 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        newTask={newTask} 
        setNewTask={setNewTask} 
        onSubmit={handleAddTaskDetail} 
      />
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="flex flex-wrap gap-6 justify-center">
          {Object.keys(tabs).map((tab) => (
            <div key={tab} className="bg-white rounded-xl shadow-lg p-4 w-full sm:w-[45%] md:w-[30%]">
              <h2 className="text-xl font-semibold text-center text-blue-600 mb-4">{tab}</h2>
              <DroppableContainer id={tab}>
                <SortableContext items={tabs[tab].map((t) => t.id.toString())} strategy={verticalListSortingStrategy}>
                  {tabs[tab].map((task: TaskDetailType) => (
                    <SortableItem key={task.id} task={task} />
                  ))}
                </SortableContext>
              </DroppableContainer>
            </div>
          ))}
        </div>
      </DndContext>
    </div>
  );
};
