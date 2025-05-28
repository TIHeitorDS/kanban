import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DetailTask from '../DetailTask'; // Ajuste o caminho conforme necessário
// Supondo que a definição de Task esteja em ../utils/definitions
// Se não for esse o caso, não é estritamente necessário para o mock do objeto task
// import { Task } from '../utils/definitions';

// Mock para o componente Category
jest.mock('../Category', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const CategoryComponent = ({ category }) => (
    <div data-testid="category-mock">{category || 'Sem categoria'}</div>
  );
  CategoryComponent.displayName = 'MockCategory'; // Adiciona um displayName para melhor debugging
  return CategoryComponent;
});


// Mock para o componente TaskMenu
// Guardamos as props `onClose` e `onEdit` para poder chamá-las no teste, se necessário
let mockTaskMenuOnClose = jest.fn();
let mockTaskMenuOnEdit = jest.fn();

jest.mock('../TaskMenu', () => {
  const TaskMenuComponent = (props) => {
    // Atribui as funções mockadas para que possam ser chamadas externamente nos testes
    mockTaskMenuOnClose = props.onClose;
    mockTaskMenuOnEdit = props.onEdit;

    if (!props.isShowing) {
      return null; // Ou <div data-testid="task-menu" style={{ display: 'none' }}>...</div>
    }
    return (
      <div data-testid="task-menu">
        <h1 data-testid="task-menu-title">{props.title}</h1>
        {/* Botões mock para simular o TaskMenu chamando onClose/onEdit */}
        {props.onClose && <button data-testid="task-menu-close-btn" onClick={props.onClose}>Close</button>}
        {props.onEdit && <button data-testid="task-menu-edit-btn" onClick={props.onEdit}>Edit</button>}
        <div>{props.children}</div>
      </div>
    );
  };
  TaskMenuComponent.displayName = 'MockTaskMenu';
  return TaskMenuComponent;
});

// Objeto Task de exemplo para os testes
const sampleTask = {
  id: '1',
  title: 'Reunião de Alinhamento Semanal',
  description: 'Discutir os próximos passos do projeto Kanban e alinhar as expectativas da equipe.',
  category: 'Reuniões',
  status: 'To-do',
  // Adicione outros campos conforme a sua definição de Task
};

describe('DetailTask Component', () => {
  beforeEach(() => {
    // Limpa os mocks de função antes de cada teste
    mockTaskMenuOnClose.mockClear();
    mockTaskMenuOnEdit.mockClear();
  });

  test('deve renderizar os detalhes da tarefa corretamente quando isShowing é true', () => {
    const mockOnClose = jest.fn();
    const mockOnEdit = jest.fn();

    render(
      <DetailTask
        isShowing={true}
        onClose={mockOnClose}
        onEdit={mockOnEdit}
        task={sampleTask}
      />
    );

    // Verifica se o TaskMenu está visível e com o título correto
    expect(screen.getByTestId('task-menu')).toBeInTheDocument();
    expect(screen.getByTestId('task-menu-title')).toHaveTextContent(sampleTask.title);

    // Verifica o componente Category mockado
    expect(screen.getByTestId('category-mock')).toHaveTextContent(sampleTask.category);

    // Verifica o status da tarefa
    expect(screen.getByText(sampleTask.status)).toBeInTheDocument();
    // Poderia também verificar o ícone de status se ele tivesse um seletor específico
    // Ex: expect(screen.getByTestId('status-icon-green')).toBeInTheDocument();

    // Verifica a descrição da tarefa
    expect(screen.getByText(sampleTask.description)).toBeInTheDocument();
  });

  test('NÃO deve renderizar o conteúdo do TaskMenu (ou estar oculto) quando isShowing é false', () => {
    render(
      <DetailTask
        isShowing={false}
        onClose={jest.fn()}
        onEdit={jest.fn()}
        task={sampleTask}
      />
    );

    // Se o mock do TaskMenu retorna null quando isShowing é false:
    expect(screen.queryByTestId('task-menu')).not.toBeInTheDocument();
    // Se o mock do TaskMenu usa style={{ display: 'none' }}:
    // expect(screen.getByTestId('task-menu')).not.toBeVisible();
  });

  test('deve passar as funções onClose e onEdit para o TaskMenu', () => {
    const mockOnCloseProp = jest.fn();
    const mockOnEditProp = jest.fn();

    render(
      <DetailTask
        isShowing={true}
        onClose={mockOnCloseProp}
        onEdit={mockOnEditProp}
        task={sampleTask}
      />
    );

    // Verifica se os botões mockados no TaskMenu existem (indicando que as props foram passadas)
    const closeButton = screen.getByTestId('task-menu-close-btn');
    const editButton = screen.getByTestId('task-menu-edit-btn');
    expect(closeButton).toBeInTheDocument();
    expect(editButton).toBeInTheDocument();

    // Simula o clique nos botões mockados dentro do TaskMenu
    fireEvent.click(closeButton);
    expect(mockOnCloseProp).toHaveBeenCalledTimes(1);

    fireEvent.click(editButton);
    expect(mockOnEditProp).toHaveBeenCalledTimes(1);
  });

  test('deve renderizar "Sem categoria" se task.category não for fornecido', () => {
    const taskSemCategoria = {
      ...sampleTask,
      category: undefined, // ou ""
    };
    render(<DetailTask isShowing={true} task={taskSemCategoria} />);
    expect(screen.getByTestId('category-mock')).toHaveTextContent('Sem categoria');
  });
});