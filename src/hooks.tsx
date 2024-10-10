import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export const useLogin = () => {
  const router = useRouter();

  const [uid, setUid] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  useEffect(() => {
    if (uid !== 'ERROR') {
      setUid(localStorage.getItem('uid') || 'ERROR');
      setEmail(localStorage.getItem('email') || 'ERROR');
    } else {
      localStorage.removeItem('uid');
      localStorage.removeItem('email');
      router.push('/');
    }
  }, []);

  return {
    uid,
    email,
  };
};

export default useLogin;
