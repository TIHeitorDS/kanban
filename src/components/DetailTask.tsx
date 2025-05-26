import Category from "./Category";
import TaskMenu from "./TaskMenu";

export default function DetailTask({
  isShowing = false,
  onClose,
}: {
  isShowing?: boolean;
  onClose?: () => void;
}) {
  return (
    <TaskMenu
      isShowing={isShowing}
      onClose={onClose}
      title="Detalhes da tarefa"
    >
      <div>
        <div className="flex items-center gap-[10px] mb-4">
          <Category />

          <div className="flex items-center gap-2">
            <span className="h-4 w-4 bg-green rounded-full"></span>

            <p>To-do</p>
          </div>
        </div>

        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi
          reiciendis eos autem, nisi incidunt quae repellat nostrum accusamus
          atque deleniti. Tempora nam dolor illum velit libero culpa cumque
          fugit sint!
        </p>
      </div>
    </TaskMenu>
  );
}
