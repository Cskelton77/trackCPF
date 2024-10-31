import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export const useLogin = () => {
  const router = useRouter();

  const [uid, setUid] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  useEffect(() => {
    setUid(localStorage.getItem('uid') || 'ERROR');
    setEmail(localStorage.getItem('email') || 'ERROR');
  }, []);

  useEffect(() => {
    if (uid === 'ERROR') {
      localStorage.removeItem('uid');
      localStorage.removeItem('email');
      router.push('/');
    }
  }, [uid]);

  return {
    uid,
    email,
  };
};

export default useLogin;
