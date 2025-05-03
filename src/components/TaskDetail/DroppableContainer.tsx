import { useDroppable } from "@dnd-kit/core";
import React from "react";

export const DroppableContainer = ({ id, children }: { id: string; children: React.ReactNode }) => {
    const { setNodeRef } = useDroppable({ id });
    return (
        <div ref={setNodeRef} className="min-h-[300px]">
            {children}
        </div>
    );
};
