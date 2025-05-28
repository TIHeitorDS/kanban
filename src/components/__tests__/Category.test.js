import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Category from '../Category'; // Ajuste o caminho conforme necessário

describe('Category Component', () => {
  test('deve renderizar a categoria fornecida', () => {
    const testCategory = 'Tecnologia';
    render(<Category category={testCategory} />);

    const categoryElement = screen.getByText(testCategory);
    expect(categoryElement).toBeInTheDocument();
    expect(categoryElement).toHaveClass(
      'bg-purple py-1 px-3 rounded-[12px] font-medium text-sm'
    );
  });

  test('deve renderizar "Sem categoria" se nenhuma categoria for fornecida', () => {
    render(<Category />);

    const categoryElement = screen.getByText('Sem categoria');
    expect(categoryElement).toBeInTheDocument();
    expect(categoryElement).toHaveClass(
      'bg-purple py-1 px-3 rounded-[12px] font-medium text-sm'
    );
  });

  test('deve renderizar "Sem categoria" se a categoria fornecida for uma string vazia', () => {
    render(<Category category="" />);

    const categoryElement = screen.getByText('Sem categoria');
    expect(categoryElement).toBeInTheDocument();
  });
});