import { useDroppable } from "@dnd-kit/core";
import React from "react";

export default function Section({
  id,
  title,
  onShowCreate,
  children,
}: {
  id: string;
  title: string;
  onShowCreate?: () => void;
  children?: React.ReactNode;
}) {
  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <section className="mt-4 lg:w-1/2">
      <div className="bg-dark font-medium px-2 h-14 flex items-center justify-between rounded-[12px]">
        <p className="font-urbanist text-xl">
          {title}{" "}
          <span className="text-white/20">
            ({React.Children.count(children)})
          </span>
        </p>

        <button
          onClick={onShowCreate}
          className="bg-green rounded-[12px] w-9.5 h-9.5 text-primary text-[18px]"
        >
          +
        </button>
      </div>

      <div className="h-fit mt-3 bg-third p-2 rounded-[12px]">
        <div ref={setNodeRef} className="space-y-4">
          {children}
        </div>
      </div>
    </section>
  );
}
