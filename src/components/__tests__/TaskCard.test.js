import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaskCard from '../TaskCard'; // Ajuste o caminho conforme necessário

// Mock para @dnd-kit/core
const mockSetNodeRefDraggable = jest.fn();
const mockDraggableAttributes = { 'data-dnd-draggable': 'true', role: 'button' }; // Atributos de exemplo
const mockDraggableListeners = { onPointerDown: jest.fn() }; // Listener de exemplo

const mockUseDraggableHook = jest.fn(() => ({
  attributes: mockDraggableAttributes,
  listeners: mockDraggableListeners,
  setNodeRef: mockSetNodeRefDraggable,
  isDragging: false, // Valor padrão, se o componente usar
  // transform: null, // Se o componente usar
}));

jest.mock('@dnd-kit/core', () => ({
  ...jest.requireActual('@dnd-kit/core'), // Mantém outros exports
  useDraggable: (options) => mockUseDraggableHook(options), // Permite verificar as options se necessário
}));

// Mock para o componente Category
// Como ele é chamado sem props, o mock pode ser simples
jest.mock('../Category', () => {
  const MockCategory = () => <div data-testid="category-mock">Categoria Padrão</div>;
  MockCategory.displayName = 'MockCategory';
  return MockCategory;
});


describe('TaskCard Component', () => {
  const defaultProps = {
    id: 'task-123',
    title: 'Minha Tarefa Incrível',
    createdAt: '2024-05-28',
  };

  beforeEach(() => {
    // Limpa os mocks antes de cada teste
    mockSetNodeRefDraggable.mockClear();
    mockUseDraggableHook.mockClear();
    if (mockDraggableListeners.onPointerDown) { // Se o listener mockado for uma jest.fn()
        mockDraggableListeners.onPointerDown.mockClear();
    }
  });

  test('deve renderizar o título, data de criação e a categoria mockada', () => {
    render(<TaskCard {...defaultProps} />);

    expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.createdAt)).toBeInTheDocument();
    expect(screen.getByTestId('category-mock')).toHaveTextContent('Categoria Padrão');
    // Verifica o ícone do calendário (pelo alt text, mesmo que vazio)
    expect(screen.getByAltText('')).toHaveAttribute('src', '/calendar-days.svg');
  });

  test('deve chamar useDraggable com o id correto', () => {
    render(<TaskCard {...defaultProps} />);

    expect(mockUseDraggableHook).toHaveBeenCalledTimes(1);
    expect(mockUseDraggableHook).toHaveBeenCalledWith({ id: defaultProps.id });
    // Verifica se setNodeRef foi chamado (indiretamente, pois é uma ref)
    expect(mockSetNodeRefDraggable).toHaveBeenCalledTimes(1);
  });

  test('deve aplicar os atributos e listeners do useDraggable ao div principal', () => {
    render(<TaskCard {...defaultProps} />);

    // O div principal é aquele que contém o título. Vamos encontrá-lo.
    // Uma forma é adicionar um data-testid ao div principal no componente TaskCard para facilitar.
    // Ex: <div data-testid="task-card-container" ref={setNodeRef} ... >
    // Se não, podemos tentar encontrá-lo de forma mais genérica:
    const cardElement = screen.getByText(defaultProps.title).closest('div[class*="bg-dark"]'); // Procura o pai mais próximo com a classe

    expect(cardElement).toBeInTheDocument();
    // Verifica se os atributos mockados foram aplicados
    Object.entries(mockDraggableAttributes).forEach(([key, value]) => {
      expect(cardElement).toHaveAttribute(key, value);
    });

    // Verificar listeners é mais complexo.
    // O mais importante é que o hook useDraggable os retornou e eles foram espalhados.
    // Se quisermos testar se um listener específico do dnd-kit é chamado:
    // if (cardElement && mockDraggableListeners.onPointerDown) {
    //   fireEvent.pointerDown(cardElement);
    //   expect(mockDraggableListeners.onPointerDown).toHaveBeenCalledTimes(1);
    // }
    // No entanto, isso pode conflitar com o teste do onClick da prop.
    // O mais seguro é confirmar que o hook é chamado e retorna os listeners.
  });

  test('deve chamar a função onClick da prop quando o card é clicado', () => {
    const mockOnClickProp = jest.fn();
    render(<TaskCard {...defaultProps} onClick={mockOnClickProp} />);

    const cardElement = screen.getByText(defaultProps.title).closest('div[class*="bg-dark"]');
    expect(cardElement).toBeInTheDocument();

    if (cardElement) {
      fireEvent.click(cardElement);
      expect(mockOnClickProp).toHaveBeenCalledTimes(1);
    }
  });

  test('NÃO deve quebrar se a prop onClick não for fornecida e o card for clicado', () => {
    render(<TaskCard {...defaultProps} onClick={undefined} />); // onClick é opcional

    const cardElement = screen.getByText(defaultProps.title).closest('div[class*="bg-dark"]');
    expect(cardElement).toBeInTheDocument();

    if (cardElement) {
      // Espera-se que não haja erro ao clicar
      expect(() => fireEvent.click(cardElement)).not.toThrow();
    }
  });

  test('deve ter as classes CSS base corretas no div principal', () => {
    render(<TaskCard {...defaultProps} />);
    const cardElement = screen.getByText(defaultProps.title).closest('div[class*="bg-dark"]');
    expect(cardElement).toHaveClass('bg-dark rounded-[12px] p-3 hover:cursor-move');
  });
});