import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogOverlay,
} from "../ui/dialog";

export const TaskDetailEditForm = ({
    isOpen,
    onClose,
    taskToEdit,
    setTaskToEdit,
    onSubmit,
}: {
    isOpen: boolean;
    onClose: () => void;
    taskToEdit: any;
    setTaskToEdit: (val: any) => void;
    onSubmit: () => void;
}) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setTaskToEdit({ ...taskToEdit, [name]: value });
    };

    if (!taskToEdit) {
        return null; // Render nothing if taskToEdit is null
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogOverlay />
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Sửa Task Detail</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                    <input
                        name="title"
                        placeholder="Tiêu đề"
                        value={taskToEdit.title}
                        onChange={handleInputChange}
                        className="w-full border px-3 py-2 rounded"
                    />
                    <textarea
                        name="description"
                        placeholder="Mô tả"
                        value={taskToEdit.description}
                        onChange={handleInputChange}
                        className="w-full border px-3 py-2 rounded"
                    />
                    <input
                        name="assignees"
                        placeholder="Thêm người thực hiện (cách nhau bằng dấu phẩy)"
                        value={taskToEdit.assignees}
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
                        Lưu
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
