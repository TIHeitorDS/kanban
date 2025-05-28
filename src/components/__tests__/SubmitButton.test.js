import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SubmitButton from '../SubmitButton'; // Ajuste o caminho conforme necessário

describe('SubmitButton Component', () => {
  test('deve renderizar o botão com o título correto', () => {
    const buttonTitle = 'Enviar Formulário';
    render(<SubmitButton title={buttonTitle} />);

    // Busca o botão pelo seu texto (que é o title) e pela role 'button'
    const buttonElement = screen.getByRole('button', { name: buttonTitle });
    expect(buttonElement).toBeInTheDocument();
  });

  test('deve ter o atributo type="submit"', () => {
    render(<SubmitButton title="Qualquer Título" />);

    const buttonElement = screen.getByRole('button', { name: 'Qualquer Título' });
    expect(buttonElement).toHaveAttribute('type', 'submit');
  });

  test('deve ter as classes CSS corretas aplicadas', () => {
    render(<SubmitButton title="Estilo Teste" />);

    const buttonElement = screen.getByRole('button', { name: 'Estilo Teste' });
    expect(buttonElement).toHaveClass('bg-green text-primary w-full py-[10px] rounded-full');
  });

  test('deve renderizar títulos diferentes corretamente', () => {
    const firstTitle = 'Login';
    const { rerender } = render(<SubmitButton title={firstTitle} />);
    expect(screen.getByRole('button', { name: firstTitle })).toBeInTheDocument();

    const secondTitle = 'Cadastrar';
    rerender(<SubmitButton title={secondTitle} />);
    expect(screen.getByRole('button', { name: secondTitle })).toBeInTheDocument();
    // Verifica se o botão com o título antigo não está mais lá (a menos que você tenha múltiplos botões)
    expect(screen.queryByRole('button', { name: firstTitle })).not.toBeInTheDocument();
  });
});