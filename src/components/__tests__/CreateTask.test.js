import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CreateTask from '../CreateTask'; // Ajuste o caminho conforme necessário

// Mock para a função fetch global
global.fetch = jest.fn();

// Mock para window.alert
global.alert = jest.fn();

// Mock para os componentes customizados
// Se eles tiverem lógica complexa, mocks mais detalhados podem ser necessários.
// Por agora, mocks simples que renderizam os inputs/botões básicos.
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
const mockTaskMenuOnClose = jest.fn();
jest.mock('../TaskMenu', () => (props) => (
  <div data-testid="task-menu" style={{ display: props.isShowing ? 'block' : 'none' }}>
    <h1>{props.title}</h1>
    {/* Para simular o botão de fechar do TaskMenu se ele existir e chamar onClose */}
    {/* <button onClick={props.onClose} data-testid="task-menu-close-button">Close Menu</button> */}
    {props.children}
  </div>
));


describe('CreateTask Component', () => {
  beforeEach(() => {
    // Limpa todos os mocks antes de cada teste
    fetch.mockClear();
    alert.mockClear();
    mockTaskMenuOnClose.mockClear(); // Se você mockou onClose para TaskMenu como no exemplo
    // Se você tem uma prop onClose no CreateTask, e quer usá-la:
    // props.onClose.mockClear(); // (considerando que props.onClose é um jest.fn())
  });

  const renderComponent = (props = {}) => {
    const defaultProps = {
      isShowing: true,
      onClose: jest.fn(), // Mock para a prop onClose do CreateTask
      ...props,
    };
    return render(<CreateTask {...defaultProps} />);
  };

  test('deve renderizar o formulário quando isShowing é true', () => {
    renderComponent();

    expect(screen.getByTestId('task-menu')).toBeVisible();
    expect(screen.getByPlaceholderText('Título da tarefa')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Descrição da tarefa')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Categoria da tarefa (opcional)')).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'To-do' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Doing' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Done' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Criar tarefa' })).toBeInTheDocument();
  });

  test('não deve renderizar o formulário (ou estar oculto) quando isShowing é false', () => {
    renderComponent({ isShowing: false });
    expect(screen.getByTestId('task-menu')).not.toBeVisible();
  });

  test('deve atualizar os campos de input e o estado do status', () => {
    renderComponent();

    const titleInput = screen.getByPlaceholderText('Título da tarefa');
    const descriptionInput = screen.getByPlaceholderText('Descrição da tarefa');
    const categoryInput = screen.getByPlaceholderText('Categoria da tarefa (opcional)');
    const doingRadio = screen.getByRole('radio', { name: 'Doing' });

    fireEvent.change(titleInput, { target: { value: 'Nova Tarefa' } });
    fireEvent.change(descriptionInput, { target: { value: 'Descrição detalhada' } });
    fireEvent.change(categoryInput, { target: { value: 'Trabalho' } });
    fireEvent.click(doingRadio);

    expect(titleInput).toHaveValue('Nova Tarefa');
    expect(descriptionInput).toHaveValue('Descrição detalhada');
    expect(categoryInput).toHaveValue('Trabalho');
    expect(doingRadio).toBeChecked();
  });

  test('deve submeter o formulário, chamar a API e a função onClose em caso de sucesso', async () => {
    const mockOnCloseProp = jest.fn();
    renderComponent({ onClose: mockOnCloseProp });

    // Configura o mock do fetch para um sucesso
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Tarefa criada com sucesso!' }), // Resposta da API
    });

    // Preenche o formulário
    fireEvent.change(screen.getByPlaceholderText('Título da tarefa'), { target: { value: 'Tarefa Teste API' } });
    fireEvent.change(screen.getByPlaceholderText('Descrição da tarefa'), { target: { value: 'Testando API' } });
    fireEvent.change(screen.getByPlaceholderText('Categoria da tarefa (opcional)'), { target: { value: 'Teste' } });
    fireEvent.click(screen.getByRole('radio', { name: 'Doing' }));

    // Submete o formulário
    fireEvent.click(screen.getByRole('button', { name: 'Criar tarefa' }));

    // Verifica se o fetch foi chamado corretamente
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(
        'https://2mqnmicei7.execute-api.us-east-1.amazonaws.com/dev/tasks/',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': 'admin-test-999',
            'x-user-role': 'admins',
          },
          body: expect.stringContaining(JSON.stringify({ // stringContaining para flexibilidade com createdAt
            userId: 'user-test-123',
            title: 'Tarefa Teste API',
            description: 'Testando API',
            category: 'Teste',
            status: 'doing', // valor do radio button é em minúsculas
            // createdAt será verificado com stringContaining
          }).slice(0, -2)) // Remove o } final para o stringContaining funcionar bem com o createdAt
        })
      );
    });

    // Verifica se a função onClose (da prop do CreateTask) foi chamada
    expect(mockOnCloseProp).toHaveBeenCalledTimes(1);
    expect(alert).not.toHaveBeenCalled(); // Não deve haver alerta de erro
  });

  test('deve exibir um alerta de erro se a API falhar', async () => {
    const mockOnCloseProp = jest.fn();
    const errorMessage = 'Falha na API';
    renderComponent({ onClose: mockOnCloseProp });

    // Configura o mock do fetch para um erro
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: errorMessage }), // Corpo do erro da API
    });

    // Preenche e submete
    fireEvent.change(screen.getByPlaceholderText('Título da tarefa'), { target: { value: 'Tarefa Erro' } });
    fireEvent.click(screen.getByRole('button', { name: 'Criar tarefa' }));

    // Verifica se o fetch foi chamado
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    // Verifica se o alert foi chamado com a mensagem de erro
    await waitFor(() => {
        expect(alert).toHaveBeenCalledWith('Erro ao criar tarefa: ' + errorMessage);
    });


    // Verifica se onClose (da prop) não foi chamado em caso de erro
    expect(mockOnCloseProp).not.toHaveBeenCalled();
  });

  test('deve exibir um alerta de erro genérico se a API falhar sem mensagem detalhada', async () => {
    const mockOnCloseProp = jest.fn();
    renderComponent({ onClose: mockOnCloseProp });

    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({}), // Resposta de erro sem 'message'
    });

    fireEvent.click(screen.getByRole('button', { name: 'Criar tarefa' }));

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    await waitFor(() => {
        expect(alert).toHaveBeenCalledWith('Erro ao criar tarefa: Erro ao criar tarefa');
    });
    expect(mockOnCloseProp).not.toHaveBeenCalled();
  });

  test('deve exibir um alerta de erro se o fetch em si falhar (ex: problema de rede)', async () => {
    const mockOnCloseProp = jest.fn();
    const networkErrorMessage = 'Falha de rede';
    renderComponent({ onClose: mockOnCloseProp });

    fetch.mockRejectedValueOnce(new Error(networkErrorMessage)); // Simula falha de rede

    fireEvent.click(screen.getByRole('button', { name: 'Criar tarefa' }));

    await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
    await waitFor(() => {
        expect(alert).toHaveBeenCalledWith('Erro ao criar tarefa: ' + networkErrorMessage);
    });
    expect(mockOnCloseProp).not.toHaveBeenCalled();
  });


  // Teste sobre a ref taskMenuRef. A lógica `if (taskMenuRef.current)` é executada no render.
  // No ambiente de teste, a ref pode não se comportar exatamente como no navegador para manipulação direta de estilo.
  // A forma como está no componente (taskMenuRef.current.style.display = "none") é uma manipulação direta do DOM
  // que o React geralmente desaconselha. Seria melhor controlar a visibilidade via props/estado.
  // Contudo, se o objetivo é testar o efeito dessa manipulação (mesmo que não ideal), seria complexo.
  // O mock do TaskMenu já recebe `editButtonRef={taskMenuRef}`, mas testar o `style.display`
  // diretamente aplicado por essa ref dentro do CreateTask é um pouco fora do escopo do RTL,
  // que foca no que o usuário vê e interage.

  // O mock do TaskMenu já lida com a prop `isShowing`, então o comportamento do menu em si já é testado.
  // A manipulação da ref `editButtonRef` dentro do `CreateTask` para esconder um botão que *pertence* ao `TaskMenu`
  // é uma quebra de encapsulamento. O `TaskMenu` deveria ser responsável por seus próprios elementos.
});