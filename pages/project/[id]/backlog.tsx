// React & Next
import React from 'react';
import { NextPage } from 'next';
import { useState, useEffect } from 'react';

// Components
import TaskRow from '../../../components/cards/TaskRowDraggable';
import CounterBlob from '../../../components/misc/CounterBlob';
import TaskModal from '../../../components/modals/TaskModal';

// Drag and Drop
import { DragDropContext, DroppableProvided, IDroppableSnapshot } from 'react-beautiful-dnd';
import { Droppable } from 'react-beautiful-dnd';

// Styling
import styled from 'styled-components';

// Auth
import withAuth from '../../../utils/withAuth';
import { useRouter } from 'next/router';
import { collection, doc, DocumentSnapshot, query, setDoc, where } from 'firebase/firestore';
import { firestore } from '../../../utils/firebase';
import { useAuth } from '../../../utils/auth';
import { useFirestoreQuery } from '@react-query-firebase/firestore';
import { ITask } from '../../../types/tasks';

const TaskList = function TaskList({
  tasks,
  setOpenModal,
 }: {
  tasks: ITask[];
  setOpenModal: Function;
 }): JSX.Element {
  return (
   <>
    {tasks.map((task: ITask, index: number) => (
     <TaskRow
      onClick={() => {
       setOpenModal(task.uid);
      }}
      index={index}
      id={task.uid}
      identifier={task.identifier}
      user={task.user}
      title={task.title}
      timestamp={task.timestamp}
      summary={task.summary}
      description={task.description}
      priority={task.priority}
      status={task.status}
      key={index}
     />
    ))}
   </>
  );
 };


const BacklogPage: NextPage = () => {
 const [openModal, setOpenModal] = useState('');

 // Get project Id From url
 const Router = useRouter();
 const { id: projectId } = Router.query;

 // Get current User
 const { currentUser } = useAuth();

 // // Get all tasks for that project from firestore
 // Initialize states for all columns
 const [tasksSelected, setTasksSelected] = useState<ITask[]>([]);
 const countSelected = tasksSelected?.length;

 const [tasksBacklog, setTasksBacklog] = useState<ITask[]>([]);
 const countBacklog = tasksBacklog?.length;

 // Query tasks
 const tasksRef = query(
  collection(firestore, 'tasks'),
  where('user', '==', currentUser.uid),
  where('projectId', '==', projectId),
  where('archived', '==', false)
 );
 const tasksQuery = useFirestoreQuery(['tasks'], tasksRef, { subscribe: false });
 const tasksSnapshot = tasksQuery.data;

 const tasks: ITask[] = tasksSnapshot?.docs.map((doc:DocumentSnapshot) => ({
  ...doc.data() as ITask,
  uid: doc.id,
 }));

 // Population of Selected for development Column
 const selected = tasks?.filter(
  (task: ITask) => task.column === 'selected-for-development-column'
 );
 // Population of Backlog Column
 const backlog = tasks?.filter((task: ITask) => task.column === 'backlog-column');

 useEffect(() => {
  if (tasksQuery.isSuccess) {
   setTasksSelected(selected);
   setTasksBacklog(backlog);
  }
 }, [tasksQuery.isRefetching]);

 // Drag and drop functionality (TODO: Move to seperate file, way to big a function)
 const onDragEnd = async (result: {
  draggableId: string;
  type: string;
  reason: string;
  source: {
   droppableId: string;
   index: number;
  };
  destination: {
   droppableId: string;
   index: number;
  };
 }) => {
  const { destination, source } = result;

  // check if item has been dropped
  if (!destination) return;

  // check if item has changed its position
  if (destination.droppableId === source.droppableId && destination.index === source.index) return;

  //handle item drop in the same column (no status change, only index change)
  if (source.droppableId === destination.droppableId) {
   // determine in which column the task order is being changed
   switch (source.droppableId) {
    case 'selected-for-development-column': {
     let newSelectedTasks = [...tasksSelected];
     newSelectedTasks.splice(destination.index, 0, newSelectedTasks.splice(source.index, 1)[0]); // reordering the array
     setTasksSelected(newSelectedTasks);
     break;
    }
    case 'backlog-column': {
     let newTasksBacklog = [...tasksBacklog];
     newTasksBacklog.splice(destination.index, 0, newTasksBacklog.splice(source.index, 1)[0]); // reordering the array
     setTasksBacklog(newTasksBacklog);
     break;
    }
    default:
     break;
   }
  }

  // Handle item drop in a different column ( with status and index change )
  if (source.droppableId != destination.droppableId) {
   let startSourceTasks: ITask[] = [];
   let startDestinationTasks: ITask[] = [];
   // populate the startSourceTasks with a copy of current state
   switch (source.droppableId) {
    case 'backlog-column':
     startSourceTasks = [...tasksBacklog];
     break;
    case 'selected-for-development-column':
     startSourceTasks = [...tasksSelected];
     break;
   }

   // delete the tasks within the startSourceTasks
   let temp = startSourceTasks.splice(source.index, 1)[0];

   // save the deletion in source column to current state
   switch (source.droppableId) {
    case 'backlog-column':
     setTasksBacklog(startSourceTasks);
     break;
    case 'selected-for-development-column':
     setTasksSelected(startSourceTasks);
     break;
   }

   switch (destination.droppableId) {
    case 'selected-for-development-column':
     {
      startDestinationTasks = [...tasksSelected]; // create copy of current state
      startDestinationTasks.splice(destination.index, 0, temp); // add the previously deleted task to that copy
      setTasksSelected(startDestinationTasks); // save the addition to current state of destination column

      // Change column and status on the task in firebase
      temp.column = destination.droppableId;
      temp.status = 'Selected for Development';
      await setDoc(doc(firestore, 'tasks', temp.uid), {
       ...temp,
      });
     }
     break;
    case 'backlog-column':
     {
      startDestinationTasks = [...tasksBacklog]; // create copy of current state
      startDestinationTasks.splice(destination.index, 0, temp); // add the previously deleted task to that copy
      setTasksBacklog(startDestinationTasks); // save the addition to current state of destination column

      // Change column and status on the task in firebase
      temp.column = destination.droppableId;
      temp.status = 'Backlog';
      await setDoc(doc(firestore, 'tasks', temp.uid), {
       ...temp,
      });
     }
     break;
    default:
     break;
   }
  }
 };

 return (
  <DragDropContext onDragEnd={onDragEnd}>
   <Wrapper>
    <Section>
     <TitleRow>
      <h2>Tasks in Backlog</h2>
      <CounterBlob count={countBacklog} />
     </TitleRow>
     <Droppable droppableId={'backlog-column'}>
      {(provided: DroppableProvided) => (
       <div
       style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
       }}
       ref={provided.innerRef}
       {...provided.droppableProps}
       >
        <TaskList tasks={tasksBacklog} setOpenModal={setOpenModal} />
        {provided.placeholder}
       </div>
      )}
     </Droppable>
    </Section>

    <Section>
     <TitleRow>
      <h2>Selected For Development</h2>
      <CounterBlob count={countSelected} />
     </TitleRow>
     <Droppable droppableId={'selected-for-development-column'}>
       {(provided: DroppableProvided) => (
        <div
         style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
         }}
         ref={provided.innerRef}
         {...provided.droppableProps}
        >
         <TaskList tasks={tasksSelected} setOpenModal={setOpenModal} />
         {provided.placeholder}
        </div>
       )}
      </Droppable>
     {openModal && <TaskModal closeModal={setOpenModal} taskId={openModal} />}
    </Section>
   </Wrapper>
  </DragDropContext>
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
 padding: 20px 10px 30px 10px;
 background-color: white;
 border-style: solid;
 border-color: rgb(221, 221, 221);
 border-width: thin;
 border-radius: 25px;
 min-height: 75vh;
 min-height: 75vh;
 min-width: 280px;
 width: 100%;
 display: flex;
 flex-direction: column;
 gap: 10px;
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
