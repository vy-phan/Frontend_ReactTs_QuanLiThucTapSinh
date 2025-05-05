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
  
    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
      const { name, value } = e.target;
      setLocalTask((prev) => ({ ...prev, [name]: value }));
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
  
    return (
      <Dialog
        open={!!editingTask} // Modal mở khi `editingTask` không phải null
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setEditingTask(null); // Đóng modal và reset state
          }
        }}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa Task</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin task. Nhấn Lưu khi hoàn thành.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              {/* Cột 1 */}
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="code">Mã công việc</Label>
                  <Input
                    id="code"
                    name="code"
                    placeholder="Nhập mã công việc"
                    value={localTask.code}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="title">Tiêu đề</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Nhập tiêu đề"
                    value={localTask.title}
                    onChange={handleChange}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Mô tả</Label>
                  <textarea
                    id="description"
                    name="description"
                    placeholder="Nhập mô tả"
                    value={localTask.description || ""}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="deadline">Hạn chót</Label>
                  <Input
                    id="deadline"
                    name="deadline"
                    type="datetime-local"
                    value={localTask.deadline || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
  
              {/* Cột 2 */}
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="status">Trạng thái</Label>
                  <select
                    id="status"
                    name="status"
                    value={localTask.status}
                    onChange={handleChange}
                    className="w-full border p-2 rounded"
                  >
                    <option value="Đã giao">Đã giao</option>
                    <option value="Đang thực hiện">Đang thực hiện</option>
                    <option value="Hoàn thành">Hoàn thành</option>
                  </select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Lưu thông tin</Button>
              <Button
                type="button"
                onClick={() => setEditingTask(null)} // Đóng modal và reset state
                className="bg-gray-500 text-white"
              >
                Hủy
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  };