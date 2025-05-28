import Category from "./Category";
import TaskMenu from "./TaskMenu";
import { Task } from "../utils/definitions";

export default function DetailTask({
  isShowing = false,
  onEdit,
  onClose,
  task,
}: {
  isShowing?: boolean;
  onEdit?: () => void;
  onClose?: () => void;
  task: Task;
}) {
  return (
    <TaskMenu
      isShowing={isShowing}
      onClose={onClose}
      onEdit={onEdit}
      title={task.title}
    >
      <div>
        <div className="flex items-center gap-[10px] mb-4">
          <Category category={task.category} />

          <div className="flex items-center gap-2">
            <span className="h-4 w-4 bg-green rounded-full"></span>

            <p>{task.status}</p>
          </div>
        </div>

        <p className="font-light">{task.description}</p>
      </div>
    </TaskMenu>
  );
}
