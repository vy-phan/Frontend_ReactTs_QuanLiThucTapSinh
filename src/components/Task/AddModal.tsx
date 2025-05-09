import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
      // if (localAttachments.length > 0) {
      const formData = new FormData();
      formData.append("code", newTask.code);
      formData.append("title", newTask.title);
      formData.append("description", newTask.description || "");
      formData.append(
        "deadline",
        newTask.deadline ? new Date(newTask.deadline).toISOString() : ""
      );
      formData.append("status", newTask.status);
      formData.append("created_by", newTask.created_by.toString());

      localAttachments.forEach((file) => formData.append("attachments", file));

      console.log("FormData gửi lên:", Array.from(formData.entries())); // Log dữ liệu FormData
      await onSubmit(formData); // Gửi FormData qua props `onSubmit`

      setOpen(false);

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
        <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Thêm Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden rounded-xl">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
          <DialogTitle className="text-xl font-bold">Thêm Task mới</DialogTitle>
          <DialogDescription className="text-blue-100 mt-1">
            Điền đầy đủ thông tin cho task mới. Nhấn Lưu khi hoàn thành.
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
                  value={newTask.code}
                  onChange={handleChange}
                  className="border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 rounded-md"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="title" className="font-medium text-gray-700">Tiêu đề</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Nhập tiêu đề"
                  value={newTask.title}
                  onChange={handleChange}
                  className="border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 rounded-md"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description" className="font-medium text-gray-700">Mô tả</Label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Nhập mô tả"
                  value={newTask.description || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-3 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 min-h-[100px]"
                />
              </div>
            </div>

            {/* Cột 2 */}
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="deadline" className="font-medium text-gray-700">Hạn chót</Label>
                <Input
                  id="deadline"
                  name="deadline"
                  type="datetime-local"
                  value={newTask.deadline || ""}
                  onChange={handleChange}
                  min={new Date().toISOString().slice(0, 16)}
                  className="border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 rounded-md"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status" className="font-medium text-gray-700">Trạng thái</Label>
                <select
                  id="status"
                  name="status"
                  value={newTask.status}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded-md focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                >
                  <option value="Đã giao">Đã giao</option>
                  <option value="Đang thực hiện">Đang thực hiện</option>
                  <option value="Hoàn thành">Hoàn thành</option>
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="attachments" className="font-medium text-gray-700">Tệp đính kèm</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center hover:border-blue-500 transition-colors duration-200">
                  <Input
                    id="attachments"
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label htmlFor="attachments" className="cursor-pointer flex flex-col items-center justify-center">
                    <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span className="mt-2 text-sm text-gray-600">Kéo thả file hoặc click để chọn</span>
                    <span className="mt-1 text-xs text-gray-500">{localAttachments.length > 0 ? `${localAttachments.length} file đã chọn` : "Chưa có file nào được chọn"}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="pt-4 border-t border-gray-100">
            <Button type="submit" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
              Lưu thông tin
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
