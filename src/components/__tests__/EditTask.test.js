import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import EditTask from '../EditTask'; // Ajuste o caminho conforme necessário

// Mock para os componentes customizados
jest.mock('../Input', () => (props) => (
  <input
    placeholder={props.placeholder}
    name={props.name}
    type={props.type}
    required={props.required}
    value={props.value}
    onChange={props.onChange}
    aria-label={props.placeholder} // Para facilitar a busca se não houver label visível
  />
));

jest.mock('../SubmitButton', () => ({ title }) => (
  <button type="submit">{title}</button>
));

// TaskMenu é um wrapper, vamos mocká-lo para renderizar seus children
// e passar as props relevantes para os testes de visibilidade e onClose.
// Se EditTask precisar de uma prop onEdit no TaskMenu, adicione-a aqui.
let mockTaskMenuOnClose = jest.fn();
jest.mock('../TaskMenu', () => {
  const TaskMenuComponent = (props) => {
    mockTaskMenuOnClose = props.onClose; // Permite chamar externamente no teste

    if (!props.isShowing) {
      return null;
    }
    return (
      <div data-testid="task-menu" >
        <h1>{props.title}</h1>
        {/* Botão mock para simular o TaskMenu chamando onClose */}
        {props.onClose && <button data-testid="task-menu-close-btn" onClick={props.onClose}>Close Menu</button>}
        <div>{props.children}</div>
      </div>
    );
  };
  TaskMenuComponent.displayName = 'MockTaskMenu';
  return TaskMenuComponent;
});


describe('EditTask Component', () => {
  beforeEach(() => {
    // Limpa todos os mocks antes de cada teste
    mockTaskMenuOnClose.mockClear();
  });

  // Helper para renderizar o componente com props padrão/sobrescritas
  const renderComponent = (props = {}) => {
    const defaultProps = {
      isShowing: true,
      onClose: jest.fn(), // Mock para a prop onClose do EditTask
      // Adicione aqui uma task inicial se o EditTask carregar dados de uma tarefa existente
      // task: { title: 'Tarefa Existente', description: 'Descrição', category: 'Categoria', status: 'Doing' }
      ...props,
    };
    return render(<EditTask {...defaultProps} />);
  };


  test('deve renderizar o formulário "Editar tarefa" quando isShowing é true', () => {
    renderComponent();

    expect(screen.getByTestId('task-menu')).toBeInTheDocument(); // Ou .toBeVisible() se o mock usar display:none
    // Verifica o título através do mock do TaskMenu
    const taskMenu = screen.getByTestId('task-menu');
    expect(taskMenu.querySelector('h1')).toHaveTextContent('Editar tarefa');


    expect(screen.getByPlaceholderText('Título da tarefa')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Descrição da tarefa')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Categoria da tarefa (opcional)')).toBeInTheDocument();

    // Verifica os botões de rádio para status
    expect(screen.getByRole('radio', { name: 'To-do' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Doing' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Done' })).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Salvar alterações' })).toBeInTheDocument();
  });

  test('não deve renderizar o formulário (ou estar oculto) quando isShowing é false', () => {
    renderComponent({ isShowing: false });
    expect(screen.queryByTestId('task-menu')).not.toBeInTheDocument(); // Se o mock retorna null
    // Ou expect(screen.getByTestId('task-menu')).not.toBeVisible(); se o mock usa display: none
  });

  test('deve atualizar os campos de input e o estado do status', () => {
    renderComponent();

    const titleInput = screen.getByPlaceholderText('Título da tarefa');
    const descriptionInput = screen.getByPlaceholderText('Descrição da tarefa');
    const categoryInput = screen.getByPlaceholderText('Categoria da tarefa (opcional)');
    const doingRadio = screen.getByRole('radio', { name: 'Doing' });

    fireEvent.change(titleInput, { target: { value: 'Título Editado' } });
    fireEvent.change(descriptionInput, { target: { value: 'Descrição Editada' } });
    fireEvent.change(categoryInput, { target: { value: 'Categoria Editada' } });
    fireEvent.click(doingRadio);

    expect(titleInput).toHaveValue('Título Editado');
    expect(descriptionInput).toHaveValue('Descrição Editada');
    expect(categoryInput).toHaveValue('Categoria Editada');
    expect(doingRadio).toBeChecked();
  });

  test('deve chamar a função onClose do TaskMenu quando o botão de fechar mockado é clicado', () => {
    const mockOnCloseProp = jest.fn();
    renderComponent({ onClose: mockOnCloseProp });

    // Simula o clique no botão de fechar DENTRO do mock do TaskMenu
    const closeButtonInMenu = screen.getByTestId('task-menu-close-btn');
    fireEvent.click(closeButtonInMenu);

    expect(mockOnCloseProp).toHaveBeenCalledTimes(1);
  });

  // Teste para a submissão do formulário
  // Como o formulário atual não tem um onSubmit explícito que chama uma API ou
  // outra lógica (como no CreateTask), o teste de submissão pode ser mais simples
  // ou focado em chamar um mock de função se você adicionar um manipulador onSubmit.
  test('deve permitir a submissão do formulário (verificar se o botão de submit existe)', () => {
    // Se você adicionar uma função onSubmit ao <form> no EditTask,
    // você pode mocká-la e verificar se ela é chamada.
    // Ex: const mockHandleSubmit = jest.fn();
    // <form onSubmit={mockHandleSubmit} ... >
    renderComponent();
    const submitButton = screen.getByRole('button', { name: 'Salvar alterações' });
    expect(submitButton).toBeInTheDocument();

    // Para testar a submissão real, você precisaria de um manipulador no <form>
    // fireEvent.click(submitButton);
    // expect(mockHandleSubmit).toHaveBeenCalled();
  });


  // Nota sobre taskMenuRef:
  // A lógica `if (taskMenuRef.current) { taskMenuRef.current.style.display = "none"; }`
  // é uma manipulação direta do DOM. Conforme discutido anteriormente,
  // testar o efeito exato disso via RTL é complicado e menos ideal do que
  // controlar a visibilidade via props/estado. O mock do TaskMenu já lida com
  // a prop `isShowing`, que é a forma preferencial de controlar a visibilidade do menu.
  // Se o `editButtonRef` for passado ao `TaskMenu` para que o `TaskMenu` use essa ref,
  // então o `TaskMenu` seria responsável por essa lógica, não o `EditTask`.
});