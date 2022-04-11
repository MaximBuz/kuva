// React & Next
import React from 'react';
import { NextPage } from 'next';
import { useState, useEffect } from 'react';

// Components
import TaskRowNonDraggable from '../../../components/cards/TaskRowNonDraggable';
import CounterBlob from '../../../components/misc/CounterBlob';
import TaskModal from '../../../components/modals/TaskModal';

// Styling
import styled from 'styled-components';

// Auth
import withAuth from '../../../utils/withAuth';
import { useRouter } from 'next/router';
import { collection, query, where } from 'firebase/firestore';
import { firestore } from '../../../utils/firebase';
import { useAuth } from '../../../utils/auth';
import { useQueryClient } from 'react-query';
import { useFirestoreQuery } from '@react-query-firebase/firestore';
import { ITaskData, ITask, ITaskArray } from '../../../types/tasks';

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

 const tasks: ITaskArray = tasksSnapshot?.docs.map((doc) => ({ id: doc.id, data: doc.data() as ITaskData }));

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
     {tasks
      .sort((a: ITask<ITaskData>, b: ITask<ITaskData>) => {
       if (a.data.priority === 'high') return -1;
       if (a.data.priority === 'medium' && b.data.priority === 'high') return 1;
       if (a.data.priority === 'medium' && b.data.priority === 'low') return -1;
       return 1;
      })
      .map((task: ITask<ITaskData>, index: number) => {
       return (
        <TaskRowNonDraggable
         onClick={() => {
          setOpenModal(task.id);
         }}
         index={index}
         id={task.id}
         identifier={task.data.identifier}
         user={task.data.user}
         title={task.data.title}
         timestamp={task.data.timestamp}
         summary={task.data.summary}
         description={task.data.description}
         priority={task.data.priority}
         status={task.data.status}
         key={index}
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
