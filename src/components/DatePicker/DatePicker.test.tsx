import { render, screen } from '@testing-library/react';
import { DatePicker } from '@/components';
import moment from 'moment';
import userEvent from '@testing-library/user-event';

describe('Datepicker Component', () => {
  const mockSetDisplayDate = jest.fn();
  const mockDate = moment('2024-09-21');

  it('should display the date passed in', () => {
    const formattedDate = 'Sep 21st';
    const formattedDay = 'Saturday';

    render(<DatePicker date={mockDate} setDisplayDate={mockSetDisplayDate} />);

    const date = screen.getByText(formattedDate);
    const day = screen.getByText(formattedDay);

    expect(date);
    expect(day);
  });

  it('should handle moving date backwards', async () => {
    render(<DatePicker date={mockDate} setDisplayDate={mockSetDisplayDate} />);
    const yesterday = mockDate.clone().subtract(1, 'day');
    const backBtn = screen.getByRole('button', { name: 'Previous Day' });
    await userEvent.click(backBtn);
    expect(mockSetDisplayDate).toHaveBeenCalledWith(yesterday);
  });

  it('should handle moving date forwards', async () => {
    render(<DatePicker date={mockDate} setDisplayDate={mockSetDisplayDate} />);
    const tomorrow = mockDate.clone().add(1, 'day');
    const fwdBtn = screen.getByRole('button', { name: 'Next Day' });
    await userEvent.click(fwdBtn);
    expect(mockSetDisplayDate).toHaveBeenCalledWith(tomorrow);
  });
});
