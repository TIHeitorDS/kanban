import Input from "./Input";
import SubmitButton from "./SubmitButton";
import TaskMenu from "./TaskMenu";
import { useRef, useState } from "react";

export default function CreateTask({ isShowing = true, onClose = () => {} }) {
  const taskMenuRef = useRef<HTMLButtonElement | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  if (taskMenuRef.current) {
    taskMenuRef.current.style.display = "none"; // Hide the button
  }

  return (
    <TaskMenu
      title="Criar tarefa"
      isShowing={isShowing}
      onClose={onClose}
      editButtonRef={taskMenuRef}
    >
      <form action="" className="space-y-4">
        <Input
          label=""
          placeholder="Título da tarefa"
          name="task"
          type="text"
          required={true}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <Input
          label=""
          placeholder="Descrição da tarefa"
          name="task"
          type="text"
          required={true}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <Input
          label=""
          placeholder="Categoria da tarefa (opcional)"
          name="category"
          type="text"
          required={true}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
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
