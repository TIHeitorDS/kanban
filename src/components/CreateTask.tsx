import Input from "./Input";
import SubmitButton from "./SubmitButton";
import TaskMenu from "./TaskMenu";
import { useRef } from "react";

interface CreateTaskProps {
  isShowing?: boolean;
  onClose?: () => void;
  onCreate?: (data: { task: string; description: string; category: string; status: string }) => void;
}

export default function CreateTask({
  isShowing = true,
  onClose = () => {},
  onCreate = () => {},
}: CreateTaskProps) {
  const taskMenuRef = useRef<HTMLButtonElement | null>(null);

  if (taskMenuRef.current) {
    taskMenuRef.current.style.display = "none"; // Hide the button
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const data = {
      task: formData.get("task") as string,
      description: formData.get("description") as string,
      category: formData.get("category") as string,
      status: formData.get("status") as string,
    };

    onCreate(data);
  }

  return (
    <TaskMenu
      title="Criar tarefa"
      isShowing={isShowing}
      onClose={onClose}
      editButtonRef={taskMenuRef}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label=""
          placeholder="Título da tarefa"
          name="task"
          type="text"
          required={true}
        />

        <Input
          label=""
          placeholder="Descrição da tarefa"
          name="description"
          type="text"
          required={true}
        />

        <Input
          label=""
          placeholder="Categoria da tarefa (opcional)"
          name="category"
          type="text"
          required={false}
        />

        <div className="flex justify-center gap-4 font-medium mt-8 mb-12">
          {["To-do", "Doing", "Done"].map((status) => (
            <label
              key={status}
              className="flex items-center cursor-pointer rounded transition-colors"
            >
              <input
                type="radio"
                name="status"
                value={status}
                className="peer appearance-none w-4 h-4 rounded-full bg-white checked:bg-green checked:border-green mr-1"
                required
              />
              <span className="peer-checked:text-white peer-checked:font-bold rounded transition-all">
                {status}
              </span>
            </label>
          ))}
        </div>

        <SubmitButton title="Criar tarefa" />
      </form>
    </TaskMenu>
  );
}
