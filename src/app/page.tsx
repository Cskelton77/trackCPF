'use client';
import { useRouter } from 'next/navigation'
import { postUser
 } from '@/api/users';
import { FormEvent, useEffect, useState } from 'react';

export default function Page() {
  const router = useRouter()
  const [email, setUserEmail] = useState<string>('')
  const [errorState, setErrorState] = useState<boolean>()

  useEffect(() => {
    const uid = localStorage.getItem("uid")
    console.log('checked local storage', uid)
    if(uid){
      router.push('/tracker/')
    }
  }, [])

  const handleLogin = async (e: FormEvent)=> {
    e.preventDefault()
    if(email){
      const uid = await postUser(email)
      console.log(uid)
      if(uid){
        localStorage.setItem("uid", uid)
        localStorage.setItem("email", email)
        router.push('/tracker/')
      } else {
        setErrorState(true);
      }
      
    }
  }

  return (
    <>
      <h1>Log In</h1>
      <form onSubmit={(e) => handleLogin(e)}>
      <input value={email} onChange={(e)=>setUserEmail(e.target.value)} placeholder="Please enter your email"  />
      <button type='submit'>Log In</button>
      </form>
      {errorState && <h3>Sorry, something has gone wrong with your log in.</h3>}
    </>
  );
}
