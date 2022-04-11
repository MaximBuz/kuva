import styled from 'styled-components';
import React, { useState, useRef } from 'react';
import ReactDom from 'react-dom';

// Firebase
import { useFirestoreCollectionMutation } from '@react-query-firebase/firestore';
import { collection, doc } from 'firebase/firestore';
import { firestore } from '../../utils/firebase';
import { Timestamp } from 'firebase/firestore';

import { useQueryClient } from 'react-query';

// Auth
import { useAuth } from '../../utils/auth';
import withAuth from '../../utils/withAuth';
import { toast } from 'react-toastify';

const GreyBackground = styled.div`
 position: fixed;
 width: 100vw;
 height: 100vh;
 top: 0;
 left: 0;
 right: 0;
 bottom: 0;
 background-color: rgba(0, 0, 0, 0.7);
 z-index: 100000;
`;

const FormWrapper = styled.div`
 position: fixed;
 top: 50%;
 left: 50%;
 transform: translate(-50%, -50%);
 background-color: #fff;
 padding: 30px;
 z-index: 100000;
 border-radius: 25px;
 -webkit-box-shadow: 0px 5px 50px 10px rgba(0, 0, 0, 0.45);
 box-shadow: 0px 5px 50px 10px rgba(0, 0, 0, 0.45);
 display: flex;
 flex-direction: column;
 gap: 20px;
`;

const TitleRow = styled.div`
 display: flex;
 flex-direction: row;
 align-items: center;
 justify-content: space-between;
 margin-bottom: 20px;
`;

const Title = styled.h1`
 font-size: xx-large;
 font-weight: bold;
 color: #35307e;
`;

const CloseButton = styled.svg.attrs({
 width: '24',
 height: '24',
 fill: 'none',
 xmlns: 'http://www.w3.org/2000/svg',
})`
 cursor: pointer;
`;

const Form = styled.form`
 display: flex;
 flex-direction: column;
 gap: 30px;
 button {
  border-radius: 10px;
  width: fit-content;
  border-style: none;
  padding: 10px 15px 10px 15px;
  font-size: medium;
  color: white;
  background-color: #35307e;
  cursor: pointer;
  transition: 0.3s;
  &:hover {
   transform: scale(1.1);
  }
  &:focus {
   box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.1);
   transform: scale(1.1);
  }
 }
`;

const Section = styled.div`
 display: flex;
 flex-direction: column;
 gap: 7px;
 label {
  font-weight: bolder;
  margin-left: 10px;
 }
 input[type='text'] {
  border-radius: 15px;
  width: 400px;
  border-style: solid;
  border-color: rgb(221, 221, 221);
  border-width: thin;
  padding: 10px 15px 10px 15px;
  font-size: large;
  color: grey;
  transition: 0.3s;
  &:focus {
   box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.1);
   border-color: #35307e;
  }
 }
 textarea {
  border-radius: 15px;
  width: 400px;
  height: 150px;
  border-style: solid;
  border-color: rgb(221, 221, 221);
  border-width: thin;
  padding: 10px 15px 10px 15px;
  font-size: large;
  color: grey;
  overflow: hidden;
  resize: none;
  word-wrap: break-all;
  transition: 0.3s;
  &:focus {
   box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.1);
   border-color: #35307e;
  }
 }
`;

export default function Modal({ closeModal }: { closeModal: Function }) {
 // Auth
 const { currentUser } = useAuth();

 //  getting input values
 const projectTitle = useRef(null);
 const projectKey = useRef(null);
 const projectSummary = useRef(null);

 // setting up mutation
 const queryClient = useQueryClient();
 const ref = collection(firestore, 'projects');
 const mutation = useFirestoreCollectionMutation(ref, {
   onSuccess() {
     queryClient.invalidateQueries(['projects']);
     toast.success("Added new project!")
   },
   onError() {
    toast.error("Failed to add new project!")
  }
 });

 //  handling error and loading state
 const [error, setError] = useState<string>('');
 const [loading, setLoading] = useState<boolean>(false);

 //  submitting the form
 async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  try {
   console.log('tryblock');
   setError('');
   setLoading(true);
   /* here submit to firebase */
   mutation.mutate({
     archived: false,
     description: projectSummary.current.value,
     key: projectKey.current.value,
     timestamp: Timestamp.now(),
     title: projectTitle.current.value,
     user: currentUser.uid,
     collaborators: [{
       user: doc(collection(firestore, "users"), currentUser.uid),
       role: "Creator"
     }]
   })
  } catch {
   console.log('catchblock');
   setError('Failed to sign in');
  }
  closeModal()
  setLoading(false);
 }

 return ReactDom.createPortal(
  <>
   <GreyBackground onClick={() => closeModal()}>
    <FormWrapper
     onClick={(e) => {
      e.stopPropagation();
     }}
    >
     <TitleRow>
      <Title>Create New Project</Title>
      <CloseButton onClick={() => closeModal()} viewBox='0 0 17 19'>
       <path d='M1 1L16 18M16 1L1 18' stroke='black' />
      </CloseButton>
     </TitleRow>
     <Form onSubmit={handleSubmit}>
      <Section>
       <label htmlFor='projectTitle'>Name</label>
       <input type='text' name='projectTitle' ref={projectTitle} required></input>
      </Section>

      <Section>
       <label htmlFor='projectKey'>Key</label>
       <input type='text' name='projectKey' ref={projectKey} required></input>
      </Section>

      <Section>
       <label htmlFor='projectSummary'>Summary</label>
       <textarea
        cols={24}
        rows={4}
        wrap='soft'
        name='projectSummary'
        ref={projectSummary}
        required
       ></textarea>
      </Section>

      <button type='submit' value='Submit' disabled={loading}>
       Create New Project
      </button>

     </Form>
    </FormWrapper>
   </GreyBackground>
  </>,
  document.getElementById('portal')
 );
}
