import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { MenuBar } from '@/components';

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: mockPush,
      prefetch: () => null,
    };
  },
}));

describe('Menu Bar', () => {
  it('should go home when Home is clicked', async () => {
    render(<MenuBar />);
    const homeBtn = screen.getByRole('button', { name: 'Home' });
    await userEvent.click(homeBtn);
    expect(mockPush).toHaveBeenCalledWith('/tracker/');
  });

  it('should go to the Food List when Food DB is clicked', async () => {
    render(<MenuBar />);
    const foodDbBtn = screen.getByRole('button', { name: 'View Food Database' });
    await userEvent.click(foodDbBtn);
    expect(mockPush).toHaveBeenCalledWith('/foodlist/');
  });
});
