import { render, screen } from '@testing-library/react';
import DetailTask from './DetailTask';

describe('DetailTask', () => {
  const task = { title: 'Tarefa 1', description: 'Descrição da tarefa' };

  it('mostra título e descrição', () => {
    render(<DetailTask task={task} isShowing={true} />);
    expect(screen.getByText('Tarefa 1')).toBeInTheDocument();
    expect(screen.getByText('Descrição da tarefa')).toBeInTheDocument();
  });
});
