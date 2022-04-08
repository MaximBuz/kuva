import ReactDom from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import React, { useState } from 'react';
import image from '../../public/dropDown.png';

import styled from 'styled-components';
import { toast } from 'react-toastify';
import { useFirestoreCollectionMutation } from '@react-query-firebase/firestore';
import { firestore } from '../../utils/firebase';
import { collection, Timestamp } from 'firebase/firestore';
import { useQueryClient } from 'react-query';
import Link from 'next/link';
import { IUser } from '../../types/users';

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
 max-height: 600px;
 top: 50%;
 left: 50%;
 transform: translate(-50%, -50%);
 background-color: #fff;
 padding: 30px;
 z-index: 100000;
 border-radius: 25px;
 -webkit-box-shadow: 0px 5px 50px 10px rgba(0, 0, 0, 0.45);
 box-shadow: 0px 5px 50px 10px rgba(0, 0, 0, 0.45);
 overflow-y: scroll;
 /* Hide scrollbar for IE, Edge and Firefox */
 -ms-overflow-style: none;
 scrollbar-width: none;
 /* Hide scrollbar for Chrome, Safari and Opera */
 ::-webkit-scrollbar {
  display: none;
 }
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

const CloseButton = styled.svg`
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
   box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.1);
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
 select {
  border-radius: 15px;
  width: 432px;
  border-style: solid;
  border-color: rgb(221, 221, 221);
  border-width: thin;
  padding: 10px 15px 10px 15px;
  font-size: large;
  color: grey;
  -moz-appearance: none;
  -moz-appearance: none;
  -webkit-appearance: none;
  appearance: none;
  background-position: right 10px center;
  background-repeat: no-repeat;
  transition: 0.3s;
  &:focus {
   box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.1);
   border-color: #35307e;
  }
 }
`;

const initialState = {};

function Modal({
 closeModal,
 projectId,
 currentUser,
}: {
 closeModal: Function;
 projectId: string;
 currentUser: IUser;
}) {
 //holding the input values provided by user
 const [state, setState] = useState(initialState);

 // Find collaborators of the project to assign task to them
 //  const collaborators = projects.filter((project) => project.id === projectId)[0].collaborators;

 const userID = currentUser.uid;

 const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement | HTMLInputElement>) => {
  let { name, value } = e.target;
  setState({
   ...state,
   [name]: value,
   ['user']: userID,
   ['column']: "backlog-column",
   ['status']: 'backlog',
   ['projectId']: projectId,
   ['identifier']: 'TST',
   ['archived']: false,
   ['comments']: [],
   ['timestamp']: Timestamp.now(),
  });
 };

 // setting up mutation
 const queryClient = useQueryClient();
 const ref = collection(firestore, 'tasks');
 const mutation = useFirestoreCollectionMutation(ref, {
  onSuccess() {
   queryClient.invalidateQueries(['tasks']);
   toast.success(() => (
    <Link passHref href={`/project/${projectId}/backlog`}>
     Click to view new task in Backlog
    </Link>
   )); // Link einfügen um zum backlog zu kommen
  },
  onError() {
   toast.error('Failed to add new task!');
  },
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
   mutation.mutate({
    ...state,
   });
  } catch {
   console.log('catchblock');
   setError('Failed to submit form');
  }
  closeModal();
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
      <Title className='new-project-form-title'>Create New Task</Title>
      <CloseButton
       onClick={() => closeModal()}
       width='17'
       height='19'
       viewBox='0 0 17 19'
       fill='none'
       xmlns='http://www.w3.org/2000/svg'
      >
       <path d='M1 1L16 18M16 1L1 18' stroke='black' />
      </CloseButton>
     </TitleRow>
     <Form className='new-project-form' onSubmit={handleSubmit}>
      <Section>
       <label htmlFor='title'>Title</label>
       <input type='text' name='title' onChange={handleInputChange} required></input>
      </Section>

      <Section>
       <label htmlFor='summary'>Summary</label>
       <input type='text' name='summary' onChange={handleInputChange} required></input>
      </Section>

      {/* ACHTUNG: Fix bug, when not selecting an option */}
      {/* <Section>
       <label htmlFor='taskAssignedTo'>Assigned To</label>
       <select
        name='taskAssignedTo'
        onChange={handleInputChange}
        style={{
         backgroundImage: `url("${image}")`,
        }}
        required
       >
        <option disabled selected value=''>
         Choose a user
        </option>
        {collaborators.map((collaborator) => (
         <option value={collaborator.id} required>
          {collaborator.displayName}
         </option>
        ))}
       </select>
      </Section> */}

      {/* ACHTUNG: Fix bug, when not selecting an option */}
      <Section>
       <label htmlFor='priority'>Priority</label>
       <select
        name='priority'
        onChange={handleInputChange}
        style={{
         backgroundImage: `url("${image.src}")`,
        }}
        required
       >
        <option disabled selected value=''>
         Choose an option
        </option>
        <option value='low'>Low</option>
        <option value='medium'>Medium</option>
        <option value='high'>High</option>
       </select>
      </Section>

      <Section>
       <label htmlFor='description'>Description</label>
       <textarea
        cols={24}
        rows={4}
        wrap='soft'
        name='description'
        onChange={handleInputChange}
        required
       ></textarea>
      </Section>

      <button type='submit' value='Submit' disabled={loading}>
       Add Task to Backlog
      </button>
     </Form>
    </FormWrapper>
   </GreyBackground>{' '}
   ,
  </>,
  document.getElementById('portal')
 );
}

export default Modal;
