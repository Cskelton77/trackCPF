import { renderHook } from '@testing-library/react';
import useLogin from './hooks';
import mockLocalStorage from './mockLocalStorage';

const mockRedirect = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: mockRedirect,
    };
  },
}));

describe('Login hook', () => {
  const TEST_UID = '8854278t11';
  const TEST_EMAIL = 'test@example.com';

  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
    });
    mockLocalStorage.setItem('uid', TEST_UID);
    mockLocalStorage.setItem('email', TEST_EMAIL);
  });

  it('should give me my UID and Email', () => {
    const { result } = renderHook(useLogin);
    const { uid, email } = result.current;
    expect(uid).toBe(TEST_UID);
    expect(email).toBe(TEST_EMAIL);
  });

  it('should redirect to login if invalid UID found', () => {
    mockLocalStorage.setItem('uid', 'ERROR');

    renderHook(useLogin);
    renderHook(useLogin);
    expect(mockRedirect).toHaveBeenCalledWith('/');
  });
});
