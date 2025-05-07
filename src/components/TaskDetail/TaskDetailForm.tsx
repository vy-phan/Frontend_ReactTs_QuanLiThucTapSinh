import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { getAllUsers } from "../../hooks/userApi";
import Select from "react-select";
import { MultiValue } from "react-select";

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
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewTask({ ...newTask, [name]: value });
    };

    // Sửa lại: lưu id thay vì username
    const handleAssigneesChange = (selectedOptions: MultiValue<{ value: string; label: string }>) => {
        const selectedIds = selectedOptions.map(option => option.label);
        setNewTask({ ...newTask, assignees: selectedIds });
        console.log("Selected Assignees:", selectedIds); // Log để kiểm tra
    };

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const response = await getAllUsers();
                setUsers(response);
            } catch (err) {
                console.error("Lỗi khi lấy danh sách người dùng:", err);
            } finally {
                setLoading(false);
            }
        };

        if (isOpen) {
            fetchUsers();
        }
    }, [isOpen]);

    const userOptions = users.map(u => ({
        value: u.id,
        label: u.username,
    }));

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="overflow-visible">
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
                    <Select
                        isMulti
                        options={userOptions}
                        value={userOptions.filter(option => newTask.assignees?.includes(option.label))}
                        onChange={handleAssigneesChange}
                        placeholder="Chọn người thực hiện..."
                        noOptionsMessage={() => "Không tìm thấy người dùng"}
                        className="w-full"
                        isLoading={loading}
                    />
                </div>
                <DialogFooter className="pt-4">
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