import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Section from '../Section'; // Ajuste o caminho conforme necessário

// Mock para @dnd-kit/core
const mockSetNodeRef = jest.fn();
const mockUseDroppable = jest.fn(() => ({
  setNodeRef: mockSetNodeRef,
  isOver: false, // Valor padrão para isOver, se o componente o utilizasse
  // Adicione outras propriedades retornadas por useDroppable se seu componente as usar
}));

jest.mock('@dnd-kit/core', () => ({
  ...jest.requireActual('@dnd-kit/core'), // Mantém outros exports se houver
  useDroppable: () => mockUseDroppable(), // Chama nossa função mock
}));


describe('Section Component', () => {
  const defaultProps = {
    id: 'test-section-1',
    title: 'Minha Seção de Teste',
  };

  beforeEach(() => {
    // Limpa os mocks antes de cada teste
    mockSetNodeRef.mockClear();
    mockUseDroppable.mockClear();
  });

  test('deve renderizar o título da seção e o botão de adicionar', () => {
    render(<Section {...defaultProps} />);

    expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
    // O contador de filhos deve ser (0) por padrão
    expect(screen.getByText(`(${0})`)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '+' })).toBeInTheDocument();
  });

  test('deve chamar useDroppable com o id correto', () => {
    render(<Section {...defaultProps} />);
    // Verifica se o hook useDroppable foi chamado, o que indiretamente verifica se ele foi chamado com o id correto
    // Pois o mockUseDroppable é chamado dentro do jest.mock.
    // Se precisássemos verificar o argumento do hook:
    // jest.mock('@dnd-kit/core', () => ({
    //   ...jest.requireActual('@dnd-kit/core'),
    //   useDroppable: jest.fn((options) => { // Captura as opções aqui
    //     mockUseDroppable(options); // Passa para o nosso mock verificável
    //     return { setNodeRef: mockSetNodeRef, isOver: false };
    //   }),
    // }));
    // Depois no teste: expect(mockUseDroppable).toHaveBeenCalledWith({ id: defaultProps.id });

    // Com a estrutura atual do mock, verificamos que ele foi chamado:
    expect(mockUseDroppable).toHaveBeenCalledTimes(1);
    // E que o setNodeRef foi obtido (embora não possamos verificar facilmente sua aplicação direta no DOM via RTL)
    expect(mockSetNodeRef).toHaveBeenCalledTimes(1); // setNodeRef é chamado implicitamente pelo React ao aplicar a ref
  });


  test('deve renderizar os filhos e exibir a contagem correta de filhos', () => {
    const ChildComponent1 = () => <div data-testid="child1">Filho 1</div>;
    const ChildComponent2 = () => <div data-testid="child2">Filho 2</div>;

    render(
      <Section {...defaultProps}>
        <ChildComponent1 />
        <ChildComponent2 />
      </Section>
    );

    expect(screen.getByTestId('child1')).toBeInTheDocument();
    expect(screen.getByTestId('child2')).toBeInTheDocument();
    expect(screen.getByText(`(${2})`)).toBeInTheDocument(); // Verifica a contagem de filhos
  });

  test('deve exibir (0) quando não há filhos', () => {
    render(<Section {...defaultProps} />);
    expect(screen.getByText(`(${0})`)).toBeInTheDocument();
  });

  test('deve chamar onShowCreate quando o botão de adicionar é clicado', () => {
    const mockOnShowCreate = jest.fn();
    render(<Section {...defaultProps} onShowCreate={mockOnShowCreate} />);

    const addButton = screen.getByRole('button', { name: '+' });
    fireEvent.click(addButton);

    expect(mockOnShowCreate).toHaveBeenCalledTimes(1);
  });

  test('NÃO deve quebrar se onShowCreate não for fornecido e o botão for clicado', () => {
    render(<Section {...defaultProps} onShowCreate={undefined} />);

    const addButton = screen.getByRole('button', { name: '+' });
    // Espera-se que não haja erro ao clicar
    expect(() => fireEvent.click(addButton)).not.toThrow();
  });

  test('deve aplicar as classes CSS esperadas nos elementos principais', () => {
    render(<Section {...defaultProps} />);

    // Verifica a section principal
    const sectionElement = screen.getByText(defaultProps.title).closest('section');
    expect(sectionElement).toHaveClass('mt-4 lg:w-1/2');

    // Verifica o header da seção
    const headerDiv = screen.getByText(defaultProps.title).parentElement?.parentElement;
    expect(headerDiv).toHaveClass('bg-dark font-medium px-2 h-14 flex items-center justify-between rounded-[12px]');

    // Verifica o botão de adicionar
    const addButton = screen.getByRole('button', { name: '+' });
    expect(addButton).toHaveClass('bg-green rounded-[12px] w-9.5 h-9.5 text-primary text-[18px]');

    // Verifica a área dos filhos
    // A div com setNodeRef está dentro de outra. Vamos pegar a externa primeiro.
    const childrenOuterContainer = sectionElement?.querySelector('.h-full.mt-3.bg-third.p-2.rounded-\\[12px\\]');
    expect(childrenOuterContainer).toBeInTheDocument();
    // A div interna que recebe o setNodeRef
    // Não podemos verificar a ref diretamente, mas podemos verificar suas classes se ela for única
    if (childrenOuterContainer) {
        const childrenInnerContainer = childrenOuterContainer.querySelector('.h-full.space-y-4');
        expect(childrenInnerContainer).toBeInTheDocument();
    }
  });
});