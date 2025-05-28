import Category from "./Category";
import { useDraggable } from "@dnd-kit/core";

export default function TaskCard({
  id,
  title,
  createdAt,
  onClick = () => {},
  category = "sem categoria",
}: {
  id: string;
  title: string;
  createdAt: string;
  category?: string;
  onClick?: () => void;
}) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className="bg-dark rounded-[12px] p-3 hover:cursor-move"
      {...attributes}
      {...listeners}
      onClick={onClick}
    >
      <Category category={category} />

      <div className="divide-y-2 divide-white space-y-4">
        <div className="py-4">
          <p className="font-bold text-3xl">{title}</p>
        </div>

        <div className="flex items-center gap-2">
          <img src="/calendar-days.svg" alt="" />

          <p>{createdAt}</p>
        </div>
      </div>
    </div>
  );
}
