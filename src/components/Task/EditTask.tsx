import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Task } from "@/@type/type"; // Import interface Task
import { toast } from "sonner";
import { TASK_ENDPOINTS } from "@/constants/api";
import apiClient from "@/lib/apiClient";

interface EditTaskProps {
  onSubmit: (data: Task) => Promise<void>;
  editingTask: Task;
  setEditingTask: React.Dispatch<React.SetStateAction<Task | null>>;
}

export const EditTask: React.FC<EditTaskProps> = ({
    onSubmit,
    editingTask,
    setEditingTask,
  }) => {
    const [localTask, setLocalTask] = useState<Task>(editingTask); // State để lưu task đang chỉnh sửa
    const [attachments, setAttachments] = useState<File[]>([]); // State to store new attachments
  
    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
      const { name, value } = e.target;
      setLocalTask((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        setAttachments(Array.from(e.target.files));
      }
    };
  
    const handleSubmit = async () => {
      try {
        console.log("Dữ liệu chỉnh sửa gửi lên:", localTask); // Log dữ liệu chỉnh sửa
        await onSubmit(localTask); // Gửi dữ liệu chỉnh sửa
        setEditingTask(null); // Đóng modal và reset state
        toast.success("Cập nhật task thành công");
      } catch (error) {
        console.error("Lỗi khi cập nhật task:", error);
        toast.error("Cập nhật task thất bại");
      }
    };

    const handleAttachmentUpload = async () => {
      try {
        const formData = new FormData();
        attachments.forEach((file) => formData.append("attachments", file));

        const response = await apiClient.post(TASK_ENDPOINTS.ADD_ATTACHMENTS(localTask.id), formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        console.log("Attachments uploaded successfully:", response.data);
        toast.success("Attachments uploaded successfully");
      } catch (error) {
        console.error("Error uploading attachments:", error);
        toast.error("Failed to upload attachments");
      }
    };

    const handleAttachmentDelete = async (attachmentId: number) => {
      try {
        await apiClient.delete(TASK_ENDPOINTS.DELETE_ATTACHMENT_BY_ID(attachmentId));
        console.log("Attachment deleted successfully");
        toast.success("Attachment deleted successfully");
      } catch (error) {
        console.error("Error deleting attachment:", error);
        toast.error("Failed to delete attachment");
      }
    };
  
    return (
      <Dialog
        open={!!editingTask} // Modal mở khi `editingTask` không phải null
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setEditingTask(null); // Đóng modal và reset state
          }
        }}
      >
        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden rounded-xl">
          <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-6 text-white">
            <DialogTitle className="text-xl font-bold">Chỉnh sửa Task</DialogTitle>
            <DialogDescription className="text-amber-100 mt-1">
              Cập nhật thông tin task. Nhấn Lưu khi hoàn thành.
            </DialogDescription>
          </div>
          
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="p-6 space-y-6"
          >
            <div className="grid grid-cols-2 gap-6">
              {/* Cột 1 */}
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="code" className="font-medium text-gray-700">Mã công việc</Label>
                  <Input
                    id="code"
                    name="code"
                    placeholder="Nhập mã công việc"
                    value={localTask.code}
                    onChange={handleChange}
                    className="border-gray-300 focus:border-amber-500 focus:ring focus:ring-amber-200 focus:ring-opacity-50 rounded-md"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="title" className="font-medium text-gray-700">Tiêu đề</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Nhập tiêu đề"
                    value={localTask.title}
                    onChange={handleChange}
                    className="border-gray-300 focus:border-amber-500 focus:ring focus:ring-amber-200 focus:ring-opacity-50 rounded-md"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description" className="font-medium text-gray-700">Mô tả</Label>
                  <textarea
                    id="description"
                    name="description"
                    placeholder="Nhập mô tả"
                    value={localTask.description || ""}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-3 rounded-md focus:border-amber-500 focus:ring focus:ring-amber-200 focus:ring-opacity-50 min-h-[100px]"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="deadline" className="font-medium text-gray-700">Hạn chót</Label>
                  <Input
                    id="deadline"
                    name="deadline"
                    type="datetime-local"
                    value={localTask.deadline || ""}
                    onChange={handleChange}
                    className="border-gray-300 focus:border-amber-500 focus:ring focus:ring-amber-200 focus:ring-opacity-50 rounded-md"
                  />
                </div>
              </div>
  
              {/* Cột 2 */}
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="status" className="font-medium text-gray-700">Trạng thái</Label>
                  <select
                    id="status"
                    name="status"
                    value={localTask.status}
                    onChange={handleChange}
                    className="w-full border border-gray-300 p-2 rounded-md focus:border-amber-500 focus:ring focus:ring-amber-200 focus:ring-opacity-50"
                  >
                    <option value="Đã giao">Đã giao</option>
                    <option value="Đang thực hiện">Đang thực hiện</option>
                    <option value="Đã hoàn thành">Hoàn thành</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Attachments Section */}
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="attachments" className="font-medium text-gray-700">
                  Tệp đính kèm
                </Label>
                <Input
                  id="attachments"
                  name="attachments"
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="border-gray-300 focus:border-amber-500 focus:ring focus:ring-amber-200 focus:ring-opacity-50 rounded-md"
                />
                <Button
                  type="button"
                  onClick={handleAttachmentUpload}
                  className="mt-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                >
                  Tải lên tệp đính kèm
                </Button>
              </div>

              {/* List existing attachments */}
              {editingTask.attachments?.map((attachment) => (
                <div key={attachment.id} className="flex items-center justify-between">
                  <span>{attachment.file_path.split('_').slice(-1)[0]}</span> {/* Display cleaned file name */}
                  <Button
                    type="button"
                    onClick={() => handleAttachmentDelete(attachment.id)}
                    className="text-red-500 hover:underline"
                  >
                    Xóa
                  </Button>
                </div>
              ))}
            </div>

            <DialogFooter className="pt-4 border-t border-gray-100 flex justify-end space-x-3">
              <Button
                type="button"
                onClick={() => setEditingTask(null)}
                className="px-4 py-2 rounded-lg border bg-white border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
              >
                Lưu thông tin
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  };