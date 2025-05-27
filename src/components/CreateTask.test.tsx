import { render, screen, fireEvent } from "@testing-library/react";
import CreateTask from "./CreateTask";

describe("CreateTask", () => {
  it("calls onCreate with form data when submitted", () => {
    const mockOnCreate = jest.fn();
    render(<CreateTask isShowing={true} onCreate={mockOnCreate} />);

    fireEvent.change(screen.getByPlaceholderText("Título da tarefa"), {
      target: { value: "Nova tarefa" },
    });
    fireEvent.change(screen.getByPlaceholderText("Descrição da tarefa"), {
      target: { value: "Descrição da tarefa" },
    });
    fireEvent.change(screen.getByPlaceholderText("Categoria da tarefa (opcional)"), {
      target: { value: "Categoria 1" },
    });
    fireEvent.click(screen.getByLabelText("To-do")); // seleciona status

    fireEvent.click(screen.getByRole("button", { name: /criar tarefa/i }));

    expect(mockOnCreate).toHaveBeenCalledWith({
      task: "Nova tarefa",
      description: "Descrição da tarefa",
      category: "Categoria 1",
      status: "To-do",
    });
  });
});
