import { Dialog } from "@headlessui/react";
import React from "react";

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
        <Dialog open={isOpen} onClose={onClose} className="fixed z-10 inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen bg-black bg-opacity-30">
                <Dialog.Panel className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
                    <Dialog.Title className="text-lg font-semibold mb-4">Thêm Task Detail</Dialog.Title>
                    <div className="space-y-3">
                        <input name="title" placeholder="Tiêu đề" value={newTask.title} onChange={handleInputChange} className="w-full border px-3 py-2 rounded" />
                        <textarea name="description" placeholder="Mô tả" value={newTask.description} onChange={handleInputChange} className="w-full border px-3 py-2 rounded" />
                        <input name="assignees" placeholder="Người thực hiện (cách nhau bằng dấu phẩy)" value={newTask.assignees} onChange={handleInputChange} className="w-full border px-3 py-2 rounded" />
                    </div>
                    <div className="mt-6 flex justify-end gap-3">
                        <button onClick={onClose} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400">Hủy</button>
                        <button onClick={onSubmit} className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Thêm</button>
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
};
