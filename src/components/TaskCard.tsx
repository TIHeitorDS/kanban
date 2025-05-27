import Category from "./Category";
import { useDraggable } from "@dnd-kit/core";

export default function TaskCard({
  id,
  title,
  createdAt,
}: {
  id: string;
  title: string;
  createdAt: string;
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
    >
      <Category />

      <div className="divide-y-2 divide-white space-y-4">
        <div className="py-4">
          <p className="font-bold text-3xl">{title}</p>

          <p className="font-light">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi, vel
            dolores ad deleniti sint debitis qui, velit libero reiciendis
            sapiente aperiam dolor magnam quas nihil, beatae ipsum non
            aspernatur quam.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <img src="/calendar-days.svg" alt="" />

          <p>{createdAt}</p>
        </div>
      </div>
    </div>
  );
}
