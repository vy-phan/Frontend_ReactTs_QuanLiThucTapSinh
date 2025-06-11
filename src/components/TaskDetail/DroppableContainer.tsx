import { useDroppable } from "@dnd-kit/core";
import React from "react";

export const DroppableContainer = ({ id, children }: { id: string; children: React.ReactNode }) => {
    const { setNodeRef, isOver } = useDroppable({ id });
    return (
        <div
            ref={setNodeRef}
            className={`min-h-[300px] transition-all duration-300 rounded-xl border-2 border-dashed ${isOver ? 'bg-blue-50 border-blue-400 shadow-lg scale-[1.01]' : 'bg-white border-gray-200'}`}
        >
            {children}
        </div>
    );
};
