import { useRef, useState } from 'react';
import Image from 'next/image';

import { useAuth } from '../utils/auth';

import backgroundImage from '../public/blurry-bg.svg';
import logo from '../public/kuva_logo.png';

import { useRouter } from 'next/router';
import styled from 'styled-components';

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
  <Background>
   <Wrapper>
    <Image src={logo} objectFit='none' height={250} width={700} alt='Kuva Logo'></Image>
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
   </Wrapper>
  </Background>
 );
};

export default LoginPage;

/* STYLED COMPONENTS */

const Background = styled.div`
 height: 100vh;
 width: 100vw;
 background-image: url('${backgroundImage.src}');
 background-size: cover;
 background-repeat: no-repeat;
 display: flex;
 flex-direction: row;
 justify-content: center;
 align-items: center;
`;

const Wrapper = styled.div`
 width: 430px;
 height: 520px;
 border-radius: 10px;
 background-color: rgba(255, 255, 255, 0.377);
 backdrop-filter: blur(10px);
 border: 2px solid rgba(255, 255, 255, 0.123);
 box-shadow: 10px 10px 40px rgba(8, 7, 16, 0.295);
 padding: 50px 35px;
 z-index: 2;

 text-align: center;
 color: white;

 display: flex;
 flex-direction: column;

 h1 {
  font-size: 2.4em;
  font-weight: bolder;
 }

 label {
  font-size: 16px;
  font-weight: 500;
  margin-top: 30px;
 }
`;

const Form = styled.form`
 display: flex;
 flex-direction: column;
 text-align: center;

 input {
  box-sizing: border-box;
  height: 50px;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.288);
  border-radius: 10px;
  border: none;
  padding: 0 10px;
  margin-top: 8px;
  font-weight: normal;
  text-align: center;

  ::placeholder {
   color: #ffffffb0;
   font-style: italic;
  }
 }

 button {
  border: none;
  margin-top: 50px;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.774);
  color: #35307e;;
  padding: 15px 0;
  font-size: 18px;
  font-weight: 600;
  border-radius: 10px;
  cursor: pointer;
 }
`;
