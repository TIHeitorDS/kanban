import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SignUpForm from '../SignUpForm'; // Ajuste o caminho conforme necessário

// Mock para o componente Input
// Adicionamos aria-label para que getByLabelText funcione mesmo que a prop label do Input seja ""
// ou para que getByRole('textbox', { name: /.../i }) funcione.
jest.mock('../Input', () => (props) => (
  <div>
    {props.label && <label htmlFor={props.name}>{props.label}</label>}
    <input
      id={props.name}
      name={props.name}
      type={props.type}
      placeholder={props.placeholder}
      required={props.required}
      value={props.value}
      onChange={props.onChange}
      aria-label={props.label || props.placeholder} // Garante um nome acessível
    />
  </div>
));

// Mock para o componente SubmitButton
jest.mock('../SubmitButton', () => ({ title }) => (
  <button type="submit">{title}</button>
));

// O componente next/link renderiza uma tag <a>, então geralmente não precisamos mocká-lo
// para testes simples de verificação de href e texto, a menos que queiramos isolar
// completamente o comportamento de navegação.

describe('SignUpForm Component', () => {
  test('deve renderizar todos os campos do formulário, o botão e o link de login', () => {
    render(<SignUpForm />);

    // Verifica os inputs (usando o texto da label ou placeholder como nome acessível)
    expect(screen.getByLabelText('Nome')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Digite seu nome')).toBeInTheDocument();

    expect(screen.getByLabelText('E-mail')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Digite seu e-mail')).toBeInTheDocument();

    expect(screen.getByLabelText('Senha')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Digite sua senha')).toBeInTheDocument();

    // Verifica o botão de submit
    expect(screen.getByRole('button', { name: 'Criar conta' })).toBeInTheDocument();

    // Verifica o texto e o link de login
    expect(screen.getByText(/Já possui uma conta\?/i)).toBeInTheDocument();
    const loginLink = screen.getByRole('link', { name: /Faça login agora/i });
    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute('href', '/auth/login');
  });

  test('deve atualizar os campos de input quando o usuário digita', () => {
    render(<SignUpForm />);

    const nameInput = screen.getByLabelText('Nome');
    const emailInput = screen.getByLabelText('E-mail');
    const passwordInput = screen.getByLabelText('Senha');

    fireEvent.change(nameInput, { target: { value: 'João Silva' } });
    fireEvent.change(emailInput, { target: { value: 'joao.silva@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'senhaForte123' } });

    expect(nameInput).toHaveValue('João Silva');
    expect(emailInput).toHaveValue('joao.silva@example.com');
    expect(passwordInput).toHaveValue('senhaForte123');
  });

  test('inputs devem ter o atributo "required"', () => {
    render(<SignUpForm />);

    expect(screen.getByLabelText('Nome')).toBeRequired();
    expect(screen.getByLabelText('E-mail')).toBeRequired();
    expect(screen.getByLabelText('Senha')).toBeRequired();
  });

  // Teste de submissão do formulário
  // O componente SignUpForm fornecido não tem um manipulador onSubmit no <form>.
  // Se tivesse, você mockaria essa função e verificaria se ela é chamada.
  // Exemplo se houvesse um onSubmit:
  // test('deve chamar a função de submissão quando o formulário é enviado', () => {
  //   const mockSubmitHandler = jest.fn((e) => e.preventDefault()); // Previne o comportamento padrão do form
  //   // No seu componente: <form onSubmit={mockSubmitHandler} ...>
  //
  //   render(<SignUpForm />); // Supondo que SignUpForm aceitaria onSubmit como prop ou o teria internamente
  //
  //   // Preenche os campos (opcional, mas bom para simular um cenário real)
  //   fireEvent.change(screen.getByLabelText('Nome'), { target: { value: 'Teste' } });
  //   fireEvent.change(screen.getByLabelText('E-mail'), { target: { value: 'teste@example.com' } });
  //   fireEvent.change(screen.getByLabelText('Senha'), { target: { value: 'password' } });
  //
  //   // Clica no botão de submit
  //   fireEvent.click(screen.getByRole('button', { name: 'Criar conta' }));
  //
  //   // Verifica se o manipulador de submissão foi chamado
  //   expect(mockSubmitHandler).toHaveBeenCalledTimes(1);
  //   // Você também poderia verificar os dados enviados se o manipulador os recebesse
  // });

  // Por enquanto, como não há onSubmit, um teste simples é verificar a presença do botão:
  test('botão de submit deve estar presente', () => {
    render(<SignUpForm />);
    expect(screen.getByRole('button', { name: 'Criar conta' })).toBeInTheDocument();
  });
});