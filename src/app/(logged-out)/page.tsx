'use client';
import { useRouter } from 'next/navigation';
import { postUser } from '@/api/users';
import { FormEvent, useEffect, useState } from 'react';
import { EmailForm, LoginButton, LoginForm, LoginHeader } from './page.style';

export default function Page() {
  const router = useRouter();
  const [email, setUserEmail] = useState<string>('');
  const [errorState, setErrorState] = useState<boolean>();

  useEffect(() => {
    const uid = localStorage.getItem('uid');
    if (uid) {
      router.push('/tracker/');
    }
  }, []);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (email) {
      const uid = await postUser(email);
      if (uid) {
        localStorage.setItem('uid', uid);
        localStorage.setItem('email', email);
        router.push('/tracker/');
      } else {
        setErrorState(true);
      }
    }
  };

  return (
    <>
      <LoginHeader>Log In</LoginHeader>
      <LoginForm onSubmit={(e) => handleLogin(e)}>
        <EmailForm
          value={email}
          onChange={(e) => setUserEmail(e.target.value)}
          placeholder="Please enter your email"
        />
        <LoginButton type="submit">Log In</LoginButton>
      </LoginForm>
      {errorState && <h3>Sorry, something has gone wrong with your log in.</h3>}
    </>
  );
}
