// Next & React
import { FormEvent, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Link from 'next/link';

// Auth
import { useAuth } from '../utils/auth';

// Style
import backgroundImage from '../public/blurry-bg.svg';
import logo from '../public/kuva_logo.png';
import styled from 'styled-components';
import { Background, Divider, Form, GoogleButton, Wrapper } from './signup';

const LoginPage = () => {
 // initialize router
 const Router = useRouter();

 //  getting input values
 const emailRef = useRef<any>(null);
 const passwordRef = useRef<any>(null);

 //  getting signup function and currentuser object
 const { currentUser, login, googleSignup } = useAuth();

 //  handling error and loading state
 const [error, setError] = useState<string>('');
 const [loading, setLoading] = useState<boolean>(false);

 //  submitting the form and logging in the user
 async function handleSubmit(e: FormEvent) {
  e.preventDefault();

  try {
   setError('');
   setLoading(true);
   await login(emailRef.current.value, passwordRef.current.value);
   Router.replace('/');
  } catch {
   setError('Failed to sign in');
  }
  setLoading(false);
 }

 //  signing in with Google Popup
 async function handleGoogleSignIn(e: React.MouseEvent<HTMLElement>) {
   e.preventDefault()
  try {
   setError('');
   setLoading(true);

   /* Create User in Firebase */
   await googleSignup();
   /* Create User in Firestare (for additional information) */
   currentUser && Router.replace('/');
  } catch (error) {
   setError('Failed to sign in');
  }
  setLoading(false);
 }

 return (
  <Background>
   <Wrapper>
    <Image src={logo} objectFit='none' height={250} width={800} alt='Kuva Logo'></Image>
    {/* <h1>Login Here</h1> */}
    <Form onSubmit={handleSubmit}>
     <label htmlFor='email'>Email</label>
     <input id='email' type='email' ref={emailRef} placeholder='Your Email Address' />
     <label htmlFor='password'>Password</label>
     <input id='password' type='password' ref={passwordRef} placeholder='Your Password' />
     <button type='submit' disabled={loading}>
      <p>Log in</p>
     </button>
    </Form>
     <Link href='/signup'>Create account</Link>
     <Divider>or</Divider>
    <GoogleButton onClick={handleGoogleSignIn}>
     <svg width='20' height='20' viewBox='0 0 18 18' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
       fillRule='evenodd'
       clipRule='evenodd'
       d='M17.64 9.20443C17.64 8.56625 17.5827 7.95262 17.4764 7.36353H9V10.8449H13.8436C13.635 11.9699 13.0009 12.9231 12.0477 13.5613V15.8194H14.9564C16.6582 14.2526 17.64 11.9453 17.64 9.20443Z'
       fill='#4285F4'
      />
      <path
       fillRule='evenodd'
       clipRule='evenodd'
       d='M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5613C11.2418 14.1013 10.2109 14.4204 9 14.4204C6.65591 14.4204 4.67182 12.8372 3.96409 10.71H0.957275V13.0418C2.43818 15.9831 5.48182 18 9 18Z'
       fill='#34A853'
      />
      <path
       fillRule='evenodd'
       clipRule='evenodd'
       d='M3.96409 10.7101C3.78409 10.1701 3.68182 9.59325 3.68182 9.00007C3.68182 8.40689 3.78409 7.83007 3.96409 7.29007V4.95825H0.957273C0.347727 6.17325 0 7.5478 0 9.00007C0 10.4523 0.347727 11.8269 0.957273 13.0419L3.96409 10.7101Z'
       fill='#FBBC05'
      />
      <path
       fillRule='evenodd'
       clipRule='evenodd'
       d='M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957275 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z'
       fill='#EA4335'
      />
     </svg>

     <p>Log in with Google</p>
    </GoogleButton>
   </Wrapper>
  </Background>
 );
};

export default LoginPage;

/* STYLED COMPONENTS */

