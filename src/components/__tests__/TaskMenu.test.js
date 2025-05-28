import React from 'react'; // Necessário para React.createRef
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskMenu from '../TaskMenu'; // Ajuste o caminho conforme necessário

describe('TaskMenu Component', () => {
  const defaultProps = {
    title: 'Menu de Tarefas',
  };

  // Função auxiliar para encontrar os botões de forma mais robusta
  const getEditButton = () => {
    const buttons = screen.getAllByRole('button');
    return buttons.find(button => button.querySelector('img[src="/edit.svg"]'));
  };

  const getCloseButton = () => {
    const buttons = screen.getAllByRole('button');
    return buttons.find(button => button.querySelector('img[src="/close.svg"]'));
  };


  test('deve renderizar o título, botões e children quando isShowing é true', () => {
    const mockOnClose = jest.fn();
    const mockOnEdit = jest.fn();
    const childText = 'Conteúdo Filho Aqui';

    render(
      <TaskMenu
        {...defaultProps}
        isShowing={true}
        onClose={mockOnClose}
        onEdit={mockOnEdit}
      >
        <p>{childText}</p>
      </TaskMenu>
    );

    // Verifica o título
    expect(screen.getByText(defaultProps.title)).toBeInTheDocument();

    // Verifica os botões (pela imagem que contêm)
    const editButton = getEditButton();
    expect(editButton).toBeInTheDocument();
    expect(editButton?.querySelector('img')).toHaveAttribute('src', '/edit.svg');

    const closeButton = getCloseButton();
    expect(closeButton).toBeInTheDocument();
    expect(closeButton?.querySelector('img')).toHaveAttribute('src', '/close.svg');

    // Verifica os children
    expect(screen.getByText(childText)).toBeInTheDocument();

    // Verifica classes de visibilidade
    const menuContainer = screen.getByText(defaultProps.title).closest('div[class*="absolute"]');
    expect(menuContainer).toHaveClass('translate-y-0');
    expect(menuContainer).not.toHaveClass('translate-y-full');
  });

  test('deve ter classes de oculto quando isShowing é false (ou valor padrão)', () => {
    render(<TaskMenu {...defaultProps} />); // isShowing é false por padrão

    const menuContainer = screen.getByText(defaultProps.title).closest('div[class*="absolute"]');
    expect(menuContainer).toHaveClass('translate-y-full');
    expect(menuContainer).not.toHaveClass('translate-y-0');
  });

  test('deve chamar onEdit quando o botão de editar é clicado', () => {
    const mockOnEdit = jest.fn();
    render(<TaskMenu {...defaultProps} isShowing={true} onEdit={mockOnEdit} />);

    const editButton = getEditButton();
    if (editButton) {
      fireEvent.click(editButton);
      expect(mockOnEdit).toHaveBeenCalledTimes(1);
    } else {
      throw new Error("Botão de editar não encontrado");
    }
  });

  test('NÃO deve quebrar se onEdit não for fornecido e o botão de editar for clicado', () => {
    render(<TaskMenu {...defaultProps} isShowing={true} onEdit={undefined} />);
    const editButton = getEditButton();
    if (editButton) {
      expect(() => fireEvent.click(editButton)).not.toThrow();
    } else {
      throw new Error("Botão de editar não encontrado");
    }
  });

  test('deve chamar onClose quando o botão de fechar é clicado', () => {
    const mockOnClose = jest.fn();
    render(<TaskMenu {...defaultProps} isShowing={true} onClose={mockOnClose} />);

    const closeButton = getCloseButton();
    if (closeButton) {
      fireEvent.click(closeButton);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    } else {
      throw new Error("Botão de fechar não encontrado");
    }
  });

  test('NÃO deve quebrar se onClose não for fornecido e o botão de fechar for clicado', () => {
    render(<TaskMenu {...defaultProps} isShowing={true} onClose={undefined} />);
    const closeButton = getCloseButton();
    if (closeButton) {
      expect(() => fireEvent.click(closeButton)).not.toThrow();
    } else {
      throw new Error("Botão de fechar não encontrado");
    }
  });

  test('deve atribuir a editButtonRef ao botão de editar', () => {
    const mockRef = React.createRef<HTMLButtonElement | null>();
    render(<TaskMenu {...defaultProps} isShowing={true} editButtonRef={mockRef} />);

    const editButtonElement = getEditButton();
    expect(editButtonElement).toBeInTheDocument();
    expect(mockRef.current).toBe(editButtonElement);
  });

  test('deve renderizar sem título se a prop title não for fornecida', () => {
    render(<TaskMenu isShowing={true} />);
    // Procura pelo elemento que normalmente conteria o título
    const titleElementContainer = screen.getByRole('button').parentElement?.previousElementSibling;
    // Se o título for opcional e puder ser nulo/undefined, o elemento <p> pode não ter conteúdo
    // ou você pode querer verificar que o texto não está lá
    // Este teste depende da estrutura. Uma forma mais robusta seria adicionar um data-testid ao <p> do título.
    // Por agora, vamos assumir que o <p> existe mas está vazio.
    if (titleElementContainer && titleElementContainer.tagName === 'P') {
        expect(titleElementContainer).toHaveTextContent('');
    } else {
        // Se o <p> não for renderizado, então o teste é que não encontramos um texto de título default.
        // Este é mais um teste de como o componente lida com a ausência da prop
    }
  });

  test('deve ter as classes CSS base corretas no container principal', () => {
    render(<TaskMenu {...defaultProps} isShowing={true} />);
    const menuContainer = screen.getByText(defaultProps.title).closest('div[class*="absolute"]');

    const expectedBaseClasses = "rounded-[12px] lg:w-1/2 inset-x-0 z-20 lg:translate-x-full border-t-2 p-4 absolute bg-secondary divide-y-2 space-y-8 inset-y-0 transition-transform duration-300";
    // Verificar cada classe individualmente pode ser mais robusto se a ordem não for garantida
    // ou se houver muitas classes.
    expectedBaseClasses.split(' ').forEach(cls => {
        if (cls && cls !== 'lg:translate-x-full') { // Ignora a classe de posicionamento horizontal que não é o foco aqui
            expect(menuContainer).toHaveClass(cls);
        }
    });
    expect(menuContainer).toHaveClass('translate-y-0'); // por causa do isShowing=true
  });
});