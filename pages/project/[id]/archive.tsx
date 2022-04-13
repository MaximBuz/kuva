// React & Next
import React from 'react';
import { NextPage } from 'next';
import { useState } from 'react';

// Components
import TaskRowNonDraggable from '../../../components/cards/TaskRowNonDraggable';
import CounterBlob from '../../../components/misc/CounterBlob';
import TaskModal from '../../../components/modals/TaskModal';

// Styling
import styled from 'styled-components';

// Auth
import withAuth from '../../../utils/withAuth';
import { useRouter } from 'next/router';
import { collection, DocumentSnapshot, query, where } from 'firebase/firestore';
import { firestore } from '../../../utils/firebase';
import { useAuth } from '../../../utils/auth';
import { useQueryClient } from 'react-query';
import { useFirestoreQuery } from '@react-query-firebase/firestore';
import { ITask } from '../../../types/tasks';

const BacklogPage: NextPage = () => {
 const [openModal, setOpenModal] = useState('');

 // Get project Id From url
 const Router = useRouter();
 const { id: projectId } = Router.query;

 // Get current User
 const { currentUser } = useAuth();

 const queryClient = useQueryClient();

 // Query tasks
 const tasksRef = query(
  collection(firestore, 'tasks'),
  where('user', '==', currentUser.uid),
  where('projectId', '==', projectId),
  where('archived', '==', true)
 );
 const tasksQuery = useFirestoreQuery(['archivedTasks'], tasksRef, { subscribe: false });
 const tasksSnapshot = tasksQuery.data;

 const tasks: ITask[] = tasksSnapshot?.docs.map((doc:DocumentSnapshot) => ({
  ...doc.data() as ITask,
  uid: doc.id,
 }));

 if (!tasksQuery.isSuccess) {
  return <>Loading...</>;
 }

 return (
  <Wrapper>
   <Section>
    <TitleRow>
     <h2>Archived Tasks</h2>
     <CounterBlob count={tasks.length} />
    </TitleRow>
    <TaskList>
     {tasks.map((task: ITask, index: number) => {
       return (
        <TaskRowNonDraggable
         onClick={() => {
          setOpenModal(task.uid);
         }}
         index={index}
         uid={task.uid}
         identifier={task.identifier}
         user={task.user}
         title={task.title}
         timestamp={task.timestamp}
         summary={task.summary}
         description={task.description}
         priority={task.priority}
         status={task.status}
         key={index}
         assignedTo={task.assignedTo}
        />
       );
      })}
    </TaskList>
    {openModal && <TaskModal closeModal={setOpenModal} taskId={openModal} />}
   </Section>
  </Wrapper>
 );
};

export default withAuth(BacklogPage);

/* Styled Components */

const Wrapper = styled.div`
 display: flex;
 flex-direction: row;
 gap: 30px;
`;

const Section = styled.div`
 display: flex;
 flex-direction: column;
 padding: 20px 10px 30px 10px;
 background-color: white;
 border-style: solid;
 border-color: rgb(221, 221, 221);
 border-width: thin;
 border-radius: 25px;
 display: flex;
 flex-direction: column;
 gap: 10px;
 width: 45%;
`;

const TitleRow = styled.div`
 display: flex;
 flex-direction: row;
 align-items: center;
 justify-content: space-between;
 padding: 10px;
 h2 {
  font-size: 20px;
  font-weight: 500;
  color: #35307e;
  transition: 0.15s;
 }
`;

const TaskList = styled.div<any>`
 display: flex;
 flex-direction: column;
 height: 100%;
`;
