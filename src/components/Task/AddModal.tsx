import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Task } from "@/@type/type"; // Import interface Task
import { toast } from "sonner";

interface AddModalProps {
  onSubmit: (data: FormData | Task) => Promise<void>;
  newTask: Task;
  setNewTask: React.Dispatch<React.SetStateAction<Task>>;
  setAttachments: React.Dispatch<React.SetStateAction<File[]>>;
}

export const AddModal: React.FC<AddModalProps> = ({
  onSubmit,
  newTask,
  setNewTask,
  setAttachments,
}) => {
  const [open, setOpen] = useState(false);
  const [localAttachments, setLocalAttachments] = useState<File[]>([]); // State to store file attachments

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setLocalAttachments(files); // Lưu danh sách file vào state cục bộ
      setAttachments(files); // Đồng bộ với state bên ngoài nếu cần
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (localAttachments.length > 0) {
        // Nếu có file đính kèm, sử dụng FormData
        const formData = new FormData();
        formData.append("code", newTask.code);
        formData.append("title", newTask.title);
        formData.append("description", newTask.description || "");
        formData.append(
          "deadline",
          newTask.deadline ? new Date(newTask.deadline).toISOString() : ""
        );
        formData.append("status", newTask.status);
        formData.append("created_by", newTask.created_by.toString()); // Thêm ID người tạo

        // Thêm file đính kèm vào FormData
        localAttachments.forEach((file) =>
          formData.append("attachments", file)
        );

        console.log("FormData gửi lên:", Array.from(formData.entries())); // Log dữ liệu FormData
        await onSubmit(formData); // Gửi FormData
      } else {
        // Nếu không có file đính kèm, gửi dữ liệu từ form
        console.log("Dữ liệu từ form gửi lên:", newTask); // Log dữ liệu từ form
        await onSubmit(newTask);
      }

      setOpen(false);

      // Reset form và file đính kèm
      setNewTask({
        id: 0,
        code: "",
        title: "",
        description: "",
        deadline: "",
        status: "Đã giao",
        created_by: 0,
        created_at: "",
        attachments: [],
      });
      setLocalAttachments([]);
      setAttachments([]);
      toast.success("Thêm task thành công");
    } catch (error) {
      console.error("Lỗi khi thêm task:", error);
      toast.error("Thêm task thất bại");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-black">Thêm Task</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Thêm Task mới</DialogTitle>
          <DialogDescription>
            Điền đầy đủ thông tin cho task mới. Nhấn Lưu khi hoàn thành.
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
                  value={newTask.code}
                  onChange={handleChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="title">Tiêu đề</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Nhập tiêu đề"
                  value={newTask.title}
                  onChange={handleChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Mô tả</Label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Nhập mô tả"
                  value={newTask.description || ""}
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
                  value={newTask.deadline || ""}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Cột 2 */}
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="attachments">Tệp đính kèm</Label>
                <Input
                  id="attachments"
                  type="file"
                  multiple
                  onChange={handleFileChange}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Lưu thông tin</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
