import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Modal from './Modal';

describe('The Modal component', () => {
  const mockClose = jest.fn();
  const defaultProps = {
    title: 'Test Title',
    isVisible: true,
    close: () => mockClose(),
  };
  it('should display a title', () => {
    render(
      <Modal {...defaultProps}>
        <>Children</>
      </Modal>,
    );
    const modalTitle = screen.getByText('Test Title');
    expect(modalTitle).toBeInTheDocument();
  });

  it('should fall back to `Modal` if no title given', () => {
    render(
      <Modal {...defaultProps} title={undefined}>
        <>Children</>
      </Modal>,
    );
    const modalTitle = screen.getByText('Modal');
    expect(modalTitle).toBeInTheDocument();
  });

  it('should run close function on X', async () => {
    render(
      <Modal {...defaultProps}>
        <>Children</>
      </Modal>,
    );
    const closeBtn = screen.getByRole('button', { name: 'Close Modal' });
    await userEvent.click(closeBtn);
    expect(mockClose).toHaveBeenCalled();
  });
});
