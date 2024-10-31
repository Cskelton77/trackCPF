import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import mockLocalStorage from '@/mockLocalStorage';
import Home from './page';
import { postUser } from '../../api/users';

const mockRedirect = jest.fn();
// const mockPostUser = jest.fn();

const TEST_UID = '8854278t11';

jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: mockRedirect,
    };
  },
}));

jest.mock('../../api/users', () => ({
  postUser: jest.fn(() => TEST_UID),
}));

describe('User login page', () => {
  const TEST_EMAIL = 'test@example.com';
  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
    });
  });

  it('should handle login', async () => {
    render(<Home />);
    const emailInput = screen.getByLabelText('Email for Login');
    const loginBtn = screen.getByRole('button', { name: 'Log In' });

    await userEvent.type(emailInput, TEST_EMAIL);
    await userEvent.click(loginBtn);

    // postUserEmail
    expect(postUser).toHaveBeenCalledWith(TEST_EMAIL);
    // put info into storage
    const retreivedUid = mockLocalStorage.getItem('uid');
    expect(retreivedUid).toBe(TEST_UID);
    // redirect to /tracker
    expect(mockRedirect).toHaveBeenCalledWith('/tracker/');
  });

  it('should fail to log in with empty login', async () => {
    render(<Home />);
    const loginBtn = screen.getByRole('button', { name: 'Log In' });
    await userEvent.click(loginBtn);
    expect(postUser).not.toHaveBeenCalled();
  });

  it('show error if UID not found for email login', async () => {
    (postUser as jest.Mock).mockImplementation(() => undefined);
    render(<Home />);
    const emailInput = screen.getByLabelText('Email for Login');
    const loginBtn = screen.getByRole('button', { name: 'Log In' });

    await userEvent.type(emailInput, TEST_EMAIL);
    await userEvent.click(loginBtn);

    // postUserEmail
    expect(postUser).toHaveBeenCalledWith(TEST_EMAIL);
    const err = await screen.findByText('Sorry, something has gone wrong with your log in.');
    expect(err).toBeInTheDocument();
  });

  it('should automatically bounce to logged in if already logged in', () => {
    mockLocalStorage.setItem('uid', TEST_UID);
    render(<Home />);
    expect(mockRedirect).toHaveBeenCalledWith('/tracker/');
  });
});
