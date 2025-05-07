import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, X } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface MultiSelectProps {
  options: { _id: string; name: string }[];
  selected: string[];
  onChange: (selectedIds: string[]) => void;
  placeholder?: string;
  className?: string;
  emptyMessage?: string;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Chọn các mục...",
  className,
  emptyMessage = "Không tìm thấy kết quả",
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  // Đảm bảo selected là mảng nếu không có giá trị
  const safeSelected = Array.isArray(selected) ? selected : [];

  const handleSelect = (value: string) => {
    const id = value; // vì value đang là _id
    if (safeSelected.includes(id)) {
      onChange(safeSelected.filter((item) => item !== id));
    } else {
      onChange([...safeSelected, id]);
    }
  };

  const handleRemove = (id: string) => {
    onChange(safeSelected.filter((item) => item !== id));
  };

  const selectedItems = options.filter((option) =>
    safeSelected.includes(option._id)
  );

  return (
    <div className={cn("space-y-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedItems.length > 0
              ? `${selectedItems.length} người được chọn`
              : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0 z-50" align="start" side="bottom">
          <Command>
            <CommandInput placeholder="Tìm người..." />
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup className="max-h-60 overflow-auto">
              {options.map((option) => (
                <CommandItem
                  key={option._id}
                  value={option._id} // dùng đúng giá trị
                  onSelect={handleSelect}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      safeSelected.includes(option._id)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {option.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedItems.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {selectedItems.map((item) => (
            <div
              key={item._id}
              className="flex items-center gap-1 rounded bg-blue-100 px-2 py-1 text-sm text-blue-800"
            >
              <span>{item.name}</span>
              <button
                type="button"
                onClick={() => handleRemove(item._id)}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
