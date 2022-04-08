// Next & React
import React, { FormEvent, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Link from 'next/link';

// Auth
import { useAuth } from '../utils/auth';

// Style
import backgroundImage from '../public/blurry-bg.svg';
import logo from '../public/kuva_logo.png';
import styled from 'styled-components';
import { addDoc, collection, doc, setDoc, Timestamp, writeBatch } from 'firebase/firestore';
import { firestore } from '../utils/firebase';
import exampleTasks from '../utils/exampleTasks';

const SignUpPage = () => {
 // initialize router
 const Router = useRouter();

 //  getting input values
 const emailRef = useRef<HTMLInputElement>(null);
 const passwordRef = useRef<HTMLInputElement>(null);
 const passwordConfirmRef = useRef<HTMLInputElement>(null);

 //  getting signup function and currentuser object
 const { signup, googleSignup } = useAuth();

 //  handling error and loading state
 const [error, setError] = useState<string>('');
 const [loading, setLoading] = useState<boolean>(false);

 //  submitting the form and logging in the user
 async function handleSubmit(e: FormEvent) {
  e.preventDefault();

  //  check if two passwords are the same
  if (passwordRef.current.value !== passwordConfirmRef.current.value) {
   return setError('Passwords do not match');
  }

  try {
   setError('');
   setLoading(true);

   /* Create User in Firebase */
   const userObject = await signup(emailRef.current.value, passwordRef.current.value);
   /* Create User in Firestare (for additional information) */
   await setDoc(doc(firestore, 'users', userObject.user.uid), {
    uid: userObject.user.uid,
    displayName: userObject.user.displayName,
    jobTitle: null,
    email: userObject.user.email,
    phone: userObject.user.phoneNumber,
    location: null,
    birthday: null,
    workAnniversary: null,
    avatar: userObject.user.photoUrl,
   });
   Router.replace('/');
  } catch (error) {
   console.log(error);
   setError('Failed to sign in');
  }
  setLoading(false);
 }

 //  signing in with Google Popup
 async function handleGoogleSignIn(e: React.MouseEvent<HTMLElement>) {
  try {
   setError('');
   setLoading(true);

   /* Create User in Firebase */
   const userObject = await googleSignup();
   /* Create User in Firestare (for additional information) */
   console.log(userObject);
   await setDoc(doc(firestore, 'users', userObject.user.uid), {
    uid: userObject.user.uid,
    displayName: userObject.user.displayName,
    jobTitle: null,
    email: userObject.user.email,
    phone: userObject.user.phoneNumber,
    location: null,
    birthday: null,
    workAnniversary: null,
    avatar: userObject.user.photoURL,
   });

   /* Create a first test project for the user */
   const projectObject = await addDoc(collection(firestore, 'projects'), {
    archived: false,
    description:
     "This is an example project for you to play around with! It was created automatically, so you can try out kuva's features",
    key: 'EXP',
    timestamp: Timestamp.now(),
    title: 'Your first project',
    user: userObject.user.uid,
   });

   /* Create a bunch of new tasks for the example project */
   const batch = writeBatch(firestore);

   exampleTasks.forEach((task) => {
    let tasksRef = doc(collection(firestore, 'tasks'));
    batch.set(tasksRef, {
     ...task,
     projectId: projectObject.id,
     user: userObject.user.uid,
    });
   });
   batch.commit();

   Router.replace('/');
  } catch (error) {
   console.log(error);
   setError('Failed to sign in');
  }
  setLoading(false);
 }

 return (
  <Background>
   <Wrapper>
    <Image src={logo} objectFit='none' height={250} width={800} alt='Kuva Logo'></Image>
    <Form onSubmit={handleSubmit}>
     {error && <div>{error}</div>}
     <label htmlFor='email'>Email</label>
     <input id='email' type='email' ref={emailRef} placeholder='Your Email Address' />
     <label htmlFor='password'>Password</label>
     <input id='password' type='password' ref={passwordRef} placeholder='Your Password' />
     <input id='confirm-password' type='password' ref={passwordConfirmRef} placeholder='Confirm Password' />
     <button type='submit' disabled={loading}>
      <p>Sign up</p>
     </button>
    </Form>
    <Link href='/login'>Already have an account?</Link>
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

     <p>Continue with Google</p>
    </GoogleButton>
   </Wrapper>
  </Background>
 );
};

export default SignUpPage;

/* STYLED COMPONENTS */

export const Background = styled.div`
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

export const Wrapper = styled.div`
 width: 430px;
 border-radius: 10px;
 background-color: rgba(255, 255, 255, 0.199);
 backdrop-filter: blur(18px);
 border: 2px solid rgba(255, 255, 255, 0.123);
 box-shadow: 10px 10px 40px rgba(8, 7, 16, 0.356);
 padding: 50px 35px;
 z-index: 2;

 text-align: center;
 color: white;

 display: flex;
 flex-direction: column;
 align-items: center;

 h1 {
  font-size: 2.4em;
  font-weight: bolder;
 }

 label,
 a {
  font-size: 16px;
  font-weight: 500;
  margin-top: 30px;
 }

 a {
  position: relative;
  width: fit-content;
  margin-top: 10px;

  &:after {
   content: '';
   position: absolute;
   width: 100%;
   transform: scaleX(0);
   height: 4px;
   bottom: -5px;
   left: 0;
   background-color: white;
   transform-origin: bottom right;
   transition: transform 0.25s ease-out;
  }

  &:hover:after {
   transform: scaleX(1);
   transform-origin: bottom left;
  }
 }
`;

export const Form = styled.form`
 display: flex;
 flex-direction: column;
 text-align: center;
 width: 100%;

 input {
  box-sizing: border-box;
  height: 50px;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.288);
  border-radius: 100px;
  border: none;
  padding: 0 10px;
  margin-top: 8px;
  font-weight: normal;
  text-align: center;
  transition: 0.3s;

  ::placeholder {
   color: #ffffffc7;
   font-style: italic;
  }

  :focus {
   transform: scale(1.05);
   box-shadow: 5px 5px 20px rgba(8, 7, 16, 0.192);
  }
 }

 button {
  border: none;
  margin-top: 50px;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.774);
  color: #35307e;
  padding: 15px 0;
  font-size: 18px;
  font-weight: 600;
  border-radius: 100px;
  cursor: pointer;
  transition: 0.3s;

  :hover {
   transform: scale(1.05);
   box-shadow: 5px 5px 20px rgba(8, 7, 16, 0.192);
  }

  :focus {
   transform: scale(1.05);
   box-shadow: 5px 5px 20px rgba(8, 7, 16, 0.192);
  }
 }
`;

export const Divider = styled.div`
 display: flex;
 flex-basis: 100%;
 width: 100%;
 align-items: center;
 color: rgb(255, 255, 255);
 margin: 30px 0 0 0;

 &:before,
 &:after {
  content: '';
  flex-grow: 1;
  background: rgb(255, 255, 255);
  height: 1px;
  font-size: 0px;
  line-height: 0px;
  margin: 0px 8px;
 }
`;

export const GoogleButton = styled.div`
 display: flex;
 align-items: center;
 padding: 10px;
 gap: 10px;
 max-width: 185px;
 background: rgb(255, 255, 255);
 box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.25);
 border-radius: 5px;
 margin-top: 30px;
 justify-content: space-around;
 cursor: pointer;
 color: #3b4045d5;;
 font-family: 'Roboto', sans-serif;
`;
