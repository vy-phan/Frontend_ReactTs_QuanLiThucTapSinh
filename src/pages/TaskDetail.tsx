import { useEffect, useState } from "react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useParams } from "react-router-dom";
import { DroppableContainer } from "../components/TaskDetail/DroppableContainer";
import { SortableItem } from "../components/TaskDetail/SortableItem";
import { TaskDetailForm } from "../components/TaskDetail/TaskDetailForm";
import { TaskDetailEditForm } from "../components/TaskDetail/TaskDetailEditForm"; // Import TaskDetailEditForm
import { useTaskDetail, addTaskDetail, delete_taskDetail, updateTaskDetail } from "../hooks/taskDetailApi"; // Import updateTaskDetail
import { TaskDetail as TaskDetailType } from "@/@type/type"; // Import type TaskDetail

 const TaskDetail = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const { tabs, setTabs, fetchTaskDetail, updateTaskStatus } = useTaskDetail(taskId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // State for edit modal
  const [newTask, setNewTask] = useState({ title: "", description: "", status: "Đã giao", assignees: "" });
  const [taskToEdit, setTaskToEdit] = useState<any>(null); // State for the task being edited

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor));

  useEffect(() => {
    fetchTaskDetail();
  }, []);

  const handleAddTaskDetail = async () => {
    try {
      await addTaskDetail(taskId || "", newTask); // Use the centralized API function
      setIsModalOpen(false);
      setNewTask({ title: "", description: "", status: "Đã giao", assignees: "" });
      fetchTaskDetail(); // Refresh the task details
    } catch (err) {
      console.error("Lỗi thêm task detail:", err);
    }
  };

  const handleEditTaskDetail = async () => {
    try {
      await updateTaskDetail(taskToEdit.id.toString(), taskToEdit); // Use the centralized API function
      setIsEditModalOpen(false);
      setTaskToEdit(null);
      fetchTaskDetail(); // Refresh the task details
    } catch (err) {
      console.error("Lỗi cập nhật task detail:", err);
    }
  };

  const handleDeleteTaskDetail = async (taskId: string) => {
    try {
      await delete_taskDetail(taskId); // Call the delete function
      fetchTaskDetail(); // Refresh the task details
    } catch (err) {
      console.error("Lỗi xóa task detail:", err);
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
      <TaskDetailEditForm 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        taskToEdit={taskToEdit} 
        setTaskToEdit={setTaskToEdit} 
        onSubmit={handleEditTaskDetail} 
      />
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="flex flex-wrap gap-6 justify-center">
          {Object.keys(tabs).map((tab) => (
            <div key={tab} className="bg-white rounded-xl shadow-lg p-4 w-full sm:w-[45%] md:w-[30%]">
              <h2 className="text-xl font-semibold text-center text-blue-600 mb-4">{tab}</h2>
              <DroppableContainer id={tab}>
                <SortableContext items={tabs[tab].map((t) => t.id.toString())} strategy={verticalListSortingStrategy}>
                  {tabs[tab].map((task: TaskDetailType) => (
                    <div key={task.id} className="relative">
                      <SortableItem task={task} />
                      <button
                        onClick={() => handleDeleteTaskDetail(task.id.toString())}
                        className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      >
                        Xóa
                      </button>
                      <button
                        onClick={() => {
                          setTaskToEdit(task); // Set the task to edit
                          setIsEditModalOpen(true); // Open the edit modal
                        }}
                        className="absolute top-2 right-12 bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                      >
                        Sửa
                      </button>
                    </div>
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
export default TaskDetail;