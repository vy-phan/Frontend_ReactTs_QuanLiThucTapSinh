import { useEffect, useState } from "react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useParams } from "react-router-dom";
import { DroppableContainer } from "../components/TaskDetail/DroppableContainer";
import { SortableItem } from "../components/TaskDetail/SortableItem";
import { TaskDetailForm } from "../components/TaskDetail/TaskDetailForm";
import { TaskDetailEditForm } from "../components/TaskDetail/TaskDetailEditForm";
import { useTaskDetail, addTaskDetail, delete_taskDetail, updateTaskDetail } from "../hooks/taskDetailApi";
import { useTask } from "../hooks/taskApi";
import { TaskDetail as TaskDetailType } from "@/@type/type";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/authContext";

const TaskDetail = () => {
  const navigate = useNavigate();
  const { taskId } = useParams<{ taskId: string }>();
  const { tasks, fetchTaskById } = useTask(taskId);
  const task = Array.isArray(tasks) ? tasks[0] : tasks as any; // fallback nếu tasks là object
  const { user } = useAuth()
  const { tabs, setTabs, fetchTaskDetail, updateTaskStatus } = useTaskDetail(taskId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", description: "", status: "Đã giao", assignees: "" });
  const [taskToEdit, setTaskToEdit] = useState<any>(null);

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor));

  useEffect(() => {
    fetchTaskDetail();
    fetchTaskById(taskId || "");
  }, []);

  const handleAddTaskDetail = async () => {
    try {
      await addTaskDetail(taskId || "", newTask);
      setIsModalOpen(false);
      setNewTask({ title: "", description: "", status: "Đã giao", assignees: "" });
      toast.success("Thêm thành công!");
      fetchTaskDetail();
    } catch (err) {
      console.error("Lỗi thêm task detail:", err);
    }
  };

  const handleEditTaskDetail = async () => {
    try {
      await updateTaskDetail(taskToEdit.id.toString(), taskToEdit);
      setIsEditModalOpen(false);
      setTaskToEdit(null);
      fetchTaskDetail();
      toast.success("Sửa thành công!");
    } catch (err) {
      console.error("Lỗi cập nhật task detail:", err);
    }
  };

  const handleDeleteTaskDetail = async (taskId: string) => {
    try {
      await delete_taskDetail(taskId);
      toast.success("Xóa thành công");
      fetchTaskDetail();
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
    <div className="p-8 bg-gradient-to-b from-blue-50 to-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Quay lại
        </button>
        <h1 className="text-3xl font-bold text-blue-800 drop-shadow-sm">Chi tiết công việc</h1>
        <div className="w-20"></div> {/* This is a spacer to balance the layout */}
      </div>

      {/* thông tin của mỗi task  */}
      {task ? (
        
        <div className="mb-8 bg-white shadow-lg rounded-xl p-6 max-w-3xl mx-auto border border-blue-100 hover:shadow-xl transition-all duration-300">
          <h2 className="text-xl font-semibold text-blue-700 mb-3 flex items-center gap-2">
            <span className="bg-blue-100 p-1 rounded-full w-8 h-8 flex items-center justify-center text-blue-700 text-sm">#</span>
            {task.title}
          </h2>
          <p className="text-gray-600 mb-3 pl-2 border-l-2 border-blue-200">{task.description}</p>
          <div className="flex items-center text-sm text-gray-500 mt-4">
            Thời gian hết hạn :
            <span className="bg-blue-50 px-3 py-1 rounded-full text-blue-700 font-medium">
              {task.deadline ? new Date(task.deadline).toLocaleString() : "Không có thời hạn"}
            </span>
          </div>
        </div>
       
      ) : (
        <p className="text-center text-red-500 mb-6 bg-red-50 py-3 rounded-lg max-w-md mx-auto border border-red-100">Không tìm thấy thông tin task.</p>
      )}

      {/* thông tin của attachment */}
      {task && (
        <>
          {task.attachments && task.attachments.length > 0 ? (
            <div className="mb-8 bg-white shadow-lg rounded-xl p-6 max-w-3xl mx-auto border border-blue-100 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Tệp tin đính kèm</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {task.attachments.map((attachment: any) => (
                  <div
                    key={attachment.id}
                    className="flex items-center p-3 bg-gray-50 hover:bg-blue-50 rounded-md transition-colors duration-200 border border-gray-200"
                  >
                    <div className="mr-3 p-2 bg-blue-100 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                    </div>
                    <a
                      href={attachment.file_path}
                      className="text-blue-600 hover:text-blue-800 font-medium truncate flex-1"
                      target="_blank"
                      rel="noopener noreferrer"
                      title={attachment.file_path.split('/').pop()}
                    >
                      {attachment.file_path.split('/').pop()}
                    </a>
                    <span className="text-xs text-gray-500 ml-2">
                      {attachment.file_path.split('.').pop()?.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="mb-8 bg-white shadow-lg rounded-xl p-6 max-w-3xl mx-auto border border-blue-100 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-3">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              <p className="text-gray-500 font-medium">Không có file đính kèm</p>
            </div>
          )}
        </>
      )}



      <div className="text-center mb-8">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2 mx-auto"
        >
          Thêm Task Detail
        </button>
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
          {Object.keys(tabs).map((tab) => {
            const statusColors = {
              "Đã giao": "bg-amber-50 border-amber-200 text-amber-700",
              "Đang thực hiện": "bg-blue-50 border-blue-200 text-blue-700",
              "Hoàn thành": "bg-emerald-50 border-emerald-200 text-emerald-700"
            };

            return (
              <div
                key={tab}
                className={`bg-white rounded-xl shadow-lg p-5 w-full sm:w-[45%] md:w-[30%] border-t-4 ${statusColors[tab as keyof typeof statusColors] || "border-gray-200"} transition-all duration-300 hover:shadow-xl`}
              >
                <h2 className={`text-xl font-semibold text-center mb-5 py-2 rounded-lg ${statusColors[tab as keyof typeof statusColors] || "bg-gray-100 text-gray-700"}`}>
                  {tab}
                </h2>
                <DroppableContainer id={tab}>
                  <SortableContext items={tabs[tab].map((t) => t.id.toString())} strategy={verticalListSortingStrategy}>
                    {tabs[tab].length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-40 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                        <p>Kéo task vào đây</p>
                      </div>
                    ) : (
                      tabs[tab].map((task: TaskDetailType) => (
                        <div key={task.id} className="relative group mb-4">
                          <SortableItem task={task} />

                          {/* {(task as any).created_by === user?.id && ( */}
                            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <button
                                onClick={() => {
                                  setTaskToEdit(task);
                                  setIsEditModalOpen(true);
                                }}
                                className="bg-amber-500 text-white p-1.5 rounded-md hover:bg-amber-600 transition-colors"
                                title="Sửa"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /></svg>
                              </button>
                              <button
                                onClick={() => handleDeleteTaskDetail(task.id.toString())}
                                className="bg-red-500 text-white p-1.5 rounded-md hover:bg-red-600 transition-colors"
                                title="Xóa"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                              </button>
                            </div>
                          {/* ) */}
                          {/* } */}
                        </div>
                      ))
                    )}
                  </SortableContext>
                </DroppableContainer>
              </div>
            );
          })}
        </div>
      </DndContext>
    </div>
  );
};

export default TaskDetail;
