import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogOverlay,
} from "../ui/dialog";

export const TaskDetailForm = ({
    isOpen,
    onClose,
    newTask,
    setNewTask,
    onSubmit,
}: {
    isOpen: boolean;
    onClose: () => void;
    newTask: any;
    setNewTask: (val: any) => void;
    onSubmit: () => void;
}) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewTask({ ...newTask, [name]: value });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogOverlay />
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Thêm Task Detail</DialogTitle>
                </DialogHeader>
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
                <DialogFooter>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={onSubmit}
                        className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                    >
                        Thêm
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
