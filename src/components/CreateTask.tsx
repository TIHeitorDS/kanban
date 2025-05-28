import Input from "./Input";
import SubmitButton from "./SubmitButton";
import TaskMenu from "./TaskMenu";
import { FormEventHandler, useRef, useState } from "react";

export default function CreateTask({ isShowing = true, onClose = () => {} }) {
  const taskMenuRef = useRef<HTMLButtonElement | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("to-do");

  const options = ["To-do", "Doing", "Done"];

  if (taskMenuRef.current) {
    taskMenuRef.current.style.display = "none"; // Hide the button
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newTask = {
      userId: "user-test-123", // Você pode querer mudar isso para um ID dinâmico
      title,
      description,
      category,
      status,
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await fetch(
        "https://2mqnmicei7.execute-api.us-east-1.amazonaws.com/dev/tasks/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": "admin-test-999", // Adicionando o cabeçalho necessário
            "x-user-role": "admins",
          },
          body: JSON.stringify(newTask),
        }
      );

      if (!res.ok) {
        const errorData = await res.json(); // Tentar obter mais detalhes do erro
        throw new Error(errorData.message || "Erro ao criar tarefa");
      }
      onClose();
    } catch (err: any) {
      alert("Erro ao criar tarefa: " + err.message);
    }
  };
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
          {options.map((item) => (
            <label
              key={item}
              className="flex items-center cursor-pointer rounded transition-colors"
            >
              <input
                type="radio"
                name="status"
                value={item.toLowerCase()}
                checked={status === item.toLowerCase()}
                onChange={(e) => setStatus(e.target.value)}
                className="peer appearance-none w-4 h-4 rounded-full bg-white checked:bg-green checked:border-green mr-1"
                required
              />
              {item}
            </label>
          ))}
        </div>

        <SubmitButton title="Criar tarefa" />
      </form>
    </TaskMenu>
  );
}
