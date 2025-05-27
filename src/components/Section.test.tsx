import { render, screen } from '@testing-library/react';
import  Section  from './Section';

describe('Section', () => {
  it('renderiza título e children', () => {
    render(<Section title="Minha Seção"><div>Conteúdo</div></Section>);
    expect(screen.getByText('Minha Seção')).toBeInTheDocument();
    expect(screen.getByText('Conteúdo')).toBeInTheDocument();
  });
});
