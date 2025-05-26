import Input from "./Input";
import SubmitButton from "./SubmitButton";
import TaskMenu from "./TaskMenu";

export default function EditTask({ isShowing = true, onClose = () => {} }) {
  return (
    <TaskMenu title="Editar tarefa" isShowing={isShowing} onClose={onClose}>
      <form action="" className="space-y-4">
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
          name="task"
          type="text"
          required={true}
        />

        <Input
          label=""
          placeholder="Categoria da tarefa (opcional)"
          name="category"
          type="text"
          required={true}
        />

        <div className="flex justify-between font-medium mt-8 mb-12">
          {["To-do", "Doing", "Done"].map((status) => (
            <label
              key={status}
              className="flex items-center cursor-pointer rounded transition-colors"
            >
              <input
                type="radio"
                name="status"
                value={status}
                className="peer appearance-none w-4 h-4 rounded-full bg-white checked:bg-green checked:border-green mr-3"
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
