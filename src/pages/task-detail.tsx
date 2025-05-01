import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    useDroppable,
} from "@dnd-kit/core";
import {
    SortableContext,
    verticalListSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Dialog } from "@headlessui/react";
import { useParams } from "react-router-dom";
import API_BASE_URL from "../constants/api";

// Droppable container
const DroppableContainer = ({ id, children }: { id: string; children: React.ReactNode }) => {
    const { setNodeRef } = useDroppable({ id });
    return (
        <div ref={setNodeRef} className="min-h-[300px]">
            {children}
        </div>
    );
};

// Item component
const SortableItem = ({ task }: { task: any }) => {
    const { id } = task;
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: id.toString() });

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
        </div>
    );
};

const TaskDetail = () => {
    const [tabs, setTabs] = useState<Record<string, any[]>>({
        "Đã giao": [],
        "Đang thực hiện": [],
        "Hoàn thành": [],
    });

const { taskId } = useParams<{ taskId: string }>();

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor)
    );

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTask, setNewTask] = useState({
        title: "",
        description: "",
        status: "Đã giao",
        assignees: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewTask({ ...newTask, [name]: value });
    };

    const fetchTaskDetail = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/api/v1/task_detail/${taskId}`);
            const taskList = res.data.data;

            const grouped: Record<string, any[]> = {
                "Đã giao": [],
                "Đang thực hiện": [],
                "Hoàn thành": [],
            };

            taskList.forEach((task: any) => {
                const status = task.status || "Đã giao";
                if (!grouped[status]) grouped[status] = [];
                grouped[status].push(task);
            });

            setTabs(grouped);
        } catch (err) {
            console.error("Lỗi khi load task detail:", err);
        }
    };

    useEffect(() => {
        fetchTaskDetail();
    }, []);

    const handleAddTaskDetail = async () => {
        const payload = {
            ...newTask,
            task_id: taskId,
            assignees: newTask.assignees
                .split(",")
                .map((a) => a.trim())
                .filter(Boolean),
        };

        try {
            await axios.post(`${API_BASE_URL}/api/v1/task_detail`, payload);
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

        const sourceTab = Object.keys(tabs).find((tab) =>
            tabs[tab].some((t) => t.id.toString() === activeId)
        );

        const destinationTab = overId;
        if (!sourceTab || !tabs[destinationTab]) return;
        if (sourceTab === destinationTab) return;

        const sourceTasks = [...tabs[sourceTab]];
        const movedTaskIndex = sourceTasks.findIndex(
            (t) => t.id.toString() === activeId
        );
        const [movedTask] = sourceTasks.splice(movedTaskIndex, 1);
        movedTask.status = destinationTab;

        const destinationTasks = [...tabs[destinationTab], movedTask];

        setTabs({
            ...tabs,
            [sourceTab]: sourceTasks,
            [destinationTab]: destinationTasks,
        });

        axios.put(`${API_BASE_URL}/api/task_detail/${movedTask.id}`, {
            status: destinationTab,
        }).catch(err => console.error("Lỗi cập nhật trạng thái:", err));
    };

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold text-center mb-10 text-gray-700">
                Chi tiết công việc
            </h1>
            <h2>${}</h2>
            <div className="text-center mb-6">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                    + Thêm Task Detail
                </button>
            </div>

            {isModalOpen && (
                <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="fixed z-10 inset-0 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen bg-black bg-opacity-30">
                        <Dialog.Panel className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
                            <Dialog.Title className="text-lg font-semibold mb-4">Thêm Task Detail</Dialog.Title>
                            <div className="space-y-3">
                                <input
                                    name="title"
                                    placeholder="Tiêu đề"
                                    value={newTask.title}
                                    onChange={handleInputChange}
                                    className="w-full border px-3 py-2 rounded"
                                />
                                <textarea
                                    name="description"
                                    placeholder="Mô tả"
                                    value={newTask.description}
                                    onChange={handleInputChange}
                                    className="w-full border px-3 py-2 rounded"
                                />
                               
                                <input
                                    name="assignees"
                                    placeholder="Người thực hiện (cách nhau bằng dấu phẩy)"
                                    value={newTask.assignees}
                                    onChange={handleInputChange}
                                    className="w-full border px-3 py-2 rounded"
                                />
                            </div>
                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={handleAddTaskDetail}
                                    className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                                >
                                    Thêm
                                </button>
                            </div>
                        </Dialog.Panel>
                    </div>
                </Dialog>
            )}

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <div className="flex flex-wrap gap-6 justify-center">
                    {Object.keys(tabs).map((tab) => (
                        <div
                            key={tab}
                            className="bg-white rounded-xl shadow-lg p-4 w-full sm:w-[45%] md:w-[30%]"
                        >
                            <h2 className="text-xl font-semibold text-center text-blue-600 mb-4">
                                {tab}
                            </h2>
                            <DroppableContainer id={tab}>
                                <SortableContext
                                    items={tabs[tab].map((t) => t.id.toString())}
                                    strategy={verticalListSortingStrategy}
                                >
                                    {tabs[tab].map((task) => (
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

export default TaskDetail;
