import React, { useEffect, useState } from "react";
import Select from "react-select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogOverlay,
} from "../ui/dialog";
import { getAllUsers } from "../../hooks/userApi";
import {  getAssigneesByTaskDetailId} from "../../hooks/taskDetailApi";

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
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setTaskToEdit({ ...taskToEdit, [name]: value });
    };

    const handleAssigneesChange = (selectedOptions: any) => {
        // Khi người dùng chọn, chúng ta lấy danh sách các user đã chọn
        const selectedUsernames = selectedOptions ? selectedOptions.map((option: any) => option.label) : [];
        setTaskToEdit({ ...taskToEdit, assignees: selectedUsernames });  // Cập nhật assignees với danh sách tên người dùng
    };

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const response = await getAllUsers();
                setUsers(response);  // Giả sử response là mảng các user với các trường id và username
            } catch (err) {
                console.error("Lỗi khi lấy danh sách người dùng:", err);
            } finally {
                setLoading(false);
            }
        };

        // Lấy danh sách assignees của task detail khi mở form sửa
        const fetchAssignees = async () => {
            if (taskToEdit && taskToEdit.id) {
                try {
                    const assignees = await getAssigneesByTaskDetailId(taskToEdit.id);
                    // Nếu trả về là mảng user, lấy username hoặc id tùy backend trả về
                    setTaskToEdit((prev: any) => ({
                        ...prev,
                        assignees: assignees.map((u: any) => u.username) // hoặc u.id nếu bạn lưu id
                    }));
                } catch (err) {
                    console.error("Lỗi khi lấy assignees:", err);
                }
            }
        };

        if (isOpen) {
            fetchUsers();
            fetchAssignees();
        }
    // eslint-disable-next-line
    }, [isOpen, taskToEdit?.id]);

    if (!taskToEdit) {
        return null; // Render nothing if taskToEdit is null
    }

    const userOptions = users.map((user) => ({
        value: user.username,  // Tên người dùng sẽ được lưu lại trong value
        label: user.username,  // Hiển thị tên người dùng trong UI
    }));

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
                    <Select
                        isMulti
                        options={userOptions}
                        // Kiểm tra trước khi sử dụng 'includes' để tránh lỗi
                        value={userOptions.filter((option) =>
                            taskToEdit.assignees && taskToEdit.assignees.includes(option.label) // Kiểm tra nếu assignees tồn tại
                        )}
                        onChange={handleAssigneesChange}
                        placeholder="Chọn người thực hiện..."
                        isLoading={loading}
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