import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Input from '../Input'; // Ajuste o caminho conforme necessário

describe('Input Component', () => {
  const mockOnChange = jest.fn();
  const defaultProps = {
    label: 'Nome do Usuário',
    name: 'username',
    value: '',
    onChange: mockOnChange,
  };

  beforeEach(() => {
    // Limpa o mock antes de cada teste para resetar as contagens de chamadas
    mockOnChange.mockClear();
  });

  test('deve renderizar o label e o input corretamente com as props fornecidas', () => {
    render(<Input {...defaultProps} placeholder="Digite seu nome" required={true} />);

    // Verifica o Label
    const labelElement = screen.getByText('Nome do Usuário');
    expect(labelElement).toBeInTheDocument();
    expect(labelElement).toHaveAttribute('for', 'username');

    // Verifica o Input usando o texto do label associado
    const inputElement = screen.getByLabelText('Nome do Usuário');
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute('type', 'text'); // Tipo padrão
    expect(inputElement).toHaveAttribute('id', 'username');
    expect(inputElement).toHaveAttribute('name', 'username');
    expect(inputElement).toHaveAttribute('placeholder', 'Digite seu nome');
    expect(inputElement).toHaveClass('bg-primary p-[10px] w-full ring-0 rounded-[8px] outline-0 outline-transparent focus:outline-green focus:outline-1 transition-all duration-300');
    expect(inputElement).toBeRequired();
    expect(inputElement).toHaveValue(''); // Valor inicial
  });

  test('deve usar o tipo "text" como padrão se nenhum tipo for fornecido', () => {
    render(<Input {...defaultProps} />);
    const inputElement = screen.getByLabelText('Nome do Usuário');
    expect(inputElement).toHaveAttribute('type', 'text');
  });

  test('deve aplicar o tipo fornecido ao input', () => {
    render(<Input {...defaultProps} type="email" />);
    const inputElement = screen.getByLabelText('Nome do Usuário');
    expect(inputElement).toHaveAttribute('type', 'email');
  });

  test('deve ter o atributo "required" como false por padrão', () => {
    render(<Input {...defaultProps} />);
    const inputElement = screen.getByLabelText('Nome do Usuário');
    expect(inputElement).not.toBeRequired();
  });

  test('deve exibir o valor passado na prop "value"', () => {
    render(<Input {...defaultProps} value="Texto Inicial" />);
    const inputElement = screen.getByLabelText('Nome do Usuário');
    expect(inputElement).toHaveValue('Texto Inicial');
  });

  test('deve chamar a função onChange quando o valor do input muda', () => {
    render(<Input {...defaultProps} />);
    const inputElement = screen.getByLabelText('Nome do Usuário');

    // Simula a digitação do usuário
    fireEvent.change(inputElement, { target: { value: 'novo texto' } });

    // Verifica se a função mock onChange foi chamada
    expect(mockOnChange).toHaveBeenCalledTimes(1);
    // Você também pode verificar com quais argumentos ela foi chamada, se necessário:
    // expect(mockOnChange).toHaveBeenCalledWith(expect.any(Object)); // O evento é um objeto
  });

  test('deve renderizar sem label se uma string vazia for passada como label', () => {
    // Embora o tipo da prop label seja string, e não string | undefined,
    // testar com string vazia pode ser útil se essa for uma entrada válida esperada.
    render(<Input {...defaultProps} label="" />);

    // Verifica se o label não está visível ou tem conteúdo vazio
    const labelElement = screen.queryByText('Nome do Usuário'); // Não deve encontrar o texto original
    expect(labelElement).not.toBeInTheDocument();

    // O input ainda deve ser acessível pelo seu nome/id, ou placeholder se houver
    const inputElement = screen.getByRole('textbox', { name: '' }); // `name` aqui refere-se ao "accessible name", que pode vir da label. Se a label é vazia, este pode falhar.
    // Alternativa:
    // const inputElement = document.querySelector(`input[name="${defaultProps.name}"]`);
    // expect(inputElement).toBeInTheDocument();
    // Ou, se tiver placeholder:
    // render(<Input {...defaultProps} label="" placeholder="Placeholder Test" />);
    // expect(screen.getByPlaceholderText('Placeholder Test')).toBeInTheDocument();

    // O mais robusto é verificar se o label está lá, mas vazio:
    const labelContainer = document.querySelector(`label[for="${defaultProps.name}"]`);
    expect(labelContainer).toBeInTheDocument();
    expect(labelContainer).toHaveTextContent(''); // Label está lá, mas sem texto
  });
});