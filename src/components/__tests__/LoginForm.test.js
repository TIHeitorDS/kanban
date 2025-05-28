import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import LoginForm from "../LoginForm"; // Ajuste o caminho se necessário

// Mock para 'next/navigation' (para a função redirect)
const mockRedirect = jest.fn();
jest.mock("next/navigation", () => ({
  ...jest.requireActual("next/navigation"), // Mantém outros exports se houver
  redirect: (path) => mockRedirect(path),
  usePathname: jest.fn().mockReturnValue("/auth/login"), // Mock para usePathname se Link depender dele
}));

// Mock para a server action 'loginUser'
// Esta é a função que será efetivamente chamada pela lógica interna do useActionState
// quando o formAction for invocado.
const mockLoginUserImplementation = jest.fn();
jest.mock("@/lib/actions/login", () => ({
  loginUser: (prevState, formData) =>
    mockLoginUserImplementation(prevState, formData),
}));

// (Opcional) Mock para seus componentes customizados se eles forem complexos
// Se Input e SubmitButton forem simples wrappers de elementos HTML,
// o mock pode não ser estritamente necessário para testar LoginForm.
// Exemplo:
jest.mock("../Input", () => (props) => (
  <div>
    <label htmlFor={props.name}>{props.label}</label>
    <input data-testid={`input-${props.name}`} {...props} id={props.name} />
  </div>
));
jest.mock("../SubmitButton", () => ({ title }) => (
  <button type="submit">{title}</button>
));

describe("LoginForm Component", () => {
  beforeEach(() => {
    // Limpa os mocks antes de cada teste
    mockRedirect.mockClear();
    mockLoginUserImplementation.mockClear();
  });

  test("deve renderizar todos os elementos do formulário corretamente", () => {
    render(<LoginForm />);

    // Verifica inputs (usando label como seletor principal)
    // Assumindo que seu componente Input associa a label ao input corretamente (ex: via htmlFor/id)
    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/digite seu e-mail/i)
    ).toBeInTheDocument();

    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/digite sua senha/i)
    ).toBeInTheDocument();

    // Verifica botão de submit
    expect(screen.getByRole("button", { name: /entrar/i })).toBeInTheDocument();

    // Verifica link de cadastro
    expect(screen.getByText(/não possui uma conta\?/i)).toBeInTheDocument();
    const signUpLink = screen.getByRole("link", { name: /cadastre-se agora/i });
    expect(signUpLink).toBeInTheDocument();
    expect(signUpLink).toHaveAttribute("href", "/auth/signup");
  });

  test("deve atualizar os campos de input quando o usuário digita", () => {
    render(<LoginForm />);

    const emailInput = screen.getByLabelText(/e-mail/i);
    const passwordInput = screen.getByLabelText(/senha/i);

    fireEvent.change(emailInput, { target: { value: "teste@exemplo.com" } });
    fireEvent.change(passwordInput, { target: { value: "senha123" } });

    expect(emailInput).toHaveValue("teste@exemplo.com");
    expect(passwordInput).toHaveValue("senha123");
  });

  test("deve chamar a action loginUser e redirecionar em caso de sucesso", async () => {
    // Configura o mock da action para retornar um estado de sucesso
    mockLoginUserImplementation.mockImplementationOnce(
      (prevState, formData) => {
        // Podemos verificar os dados do formulário aqui se quisermos
        expect(formData.get("email")).toBe("usuario@exemplo.com");
        expect(formData.get("password")).toBe("senhasegura");
        return { sucsess: true }; // Este é o novo estado que useActionState receberá
      }
    );

    render(<LoginForm />);

    const emailInput = screen.getByLabelText(/e-mail/i);
    const passwordInput = screen.getByLabelText(/senha/i);
    const submitButton = screen.getByRole("button", { name: /entrar/i });

    // Simula a digitação e o clique
    fireEvent.change(emailInput, { target: { value: "usuario@exemplo.com" } });
    fireEvent.change(passwordInput, { target: { value: "senhasegura" } });
    fireEvent.click(submitButton); // Dispara o formAction

    // Aguarda a action ser chamada e o estado ser atualizado
    await waitFor(() => {
      expect(mockLoginUserImplementation).toHaveBeenCalledTimes(1);
    });

    // Aguarda o useEffect disparar o redirect
    await waitFor(() => {
      expect(mockRedirect).toHaveBeenCalledWith("/");
    });
    expect(mockRedirect).toHaveBeenCalledTimes(1);
  });

  test("deve exibir mensagem de erro em caso de falha no login", async () => {
    const mensagemDeErro = "Credenciais inválidas ou usuário não encontrado.";
    // Configura o mock da action para retornar um estado de erro
    mockLoginUserImplementation.mockImplementationOnce(
      (prevState, formData) => {
        return { error: mensagemDeErro };
      }
    );

    render(<LoginForm />);

    const emailInput = screen.getByLabelText(/e-mail/i);
    const passwordInput = screen.getByLabelText(/senha/i);
    const submitButton = screen.getByRole("button", { name: /entrar/i });

    fireEvent.change(emailInput, { target: { value: "errado@exemplo.com" } });
    fireEvent.change(passwordInput, { target: { value: "senhaerrada" } });
    fireEvent.click(submitButton);

    // Aguarda a action ser chamada
    await waitFor(() => {
      expect(mockLoginUserImplementation).toHaveBeenCalledTimes(1);
    });

    // Aguarda a mensagem de erro ser exibida
    await waitFor(() => {
      expect(screen.getByText(mensagemDeErro)).toBeInTheDocument();
    });

    // Verifica que o redirect não foi chamado
    expect(mockRedirect).not.toHaveBeenCalled();
  });

  test('inputs devem ter o atributo "required"', () => {
    render(<LoginForm />);

    expect(screen.getByLabelText(/e-mail/i)).toBeRequired();
    expect(screen.getByLabelText(/senha/i)).toBeRequired();
  });
});
