import { useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useAuth } from '../utils/auth';

import { useRouter } from 'next/router';

const LoginPage = () => {
 // initialize router
 const Router = useRouter();

 //  getting input values
 const emailRef = useRef<any>(null);
 const passwordRef = useRef<any>(null);

 //  getting signup function and currentuser object
 const { login } = useAuth();

 //  handling error and loading state
 const [error, setError] = useState<string>('');
 const [loading, setLoading] = useState<boolean>(false);

 //  submitting the form and logging in the user
 async function handleSubmit(e: any) {
  e.preventDefault();

  try {
   setError('');
   setLoading(true);
   await login(emailRef.current.value, passwordRef.current.value);
   console.log('tryblock');
   Router.replace('/');
  } catch {
   console.log('catchblock');
   setError('Failed to sign in');
  }
  setLoading(false);
 }

 return (
  <div className='login-page-wrapper'>
   <div className='login-wrapper'>
    <div className='login-left-img'>{/* <img src={image} alt="login-image"/> */}</div>
    <div className='login-right-content'>
     <h1 className='login-title'>We are KUVA</h1>
     <p className='login-paragraph'>
      Get rid of complicated and make room for easy. Log in to your account to view today’s tasks and goals
     </p>
     <form onSubmit={handleSubmit}>
      <label htmlFor='email'>Email address</label>
      <input id='email' type='email' ref={emailRef} />
      <label htmlFor='password'>Password</label>
      <input id='password' type='password' ref={passwordRef} />
      <button className='login-google-btn' type='submit' disabled={loading}>
       <p>Sign in </p>
      </button>
     </form>
    </div>
   </div>
  </div>
 );
};

export default LoginPage;
