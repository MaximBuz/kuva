import TaskCard from '../../components/cards/TaskCard';
import CounterBlob from '../../components/misc/CounterBlob';

import { memo, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { NextPage } from 'next';

import styled from 'styled-components';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

// Auth
import { useAuth } from '../../utils/auth';
import withAuth from '../../utils/withAuth';

// Firestore
import { firestore } from '../../utils/firebase';
import { collection, query, where } from 'firebase/firestore';
import { useFirestoreQueryData, useFirestoreQuery } from '@react-query-firebase/firestore';

const FilterSection = styled.div`
 display: flex;
 flex-direction: row;
 justify-content: space-between;
 align-items: center;
 padding: 5px;
 margin-bottom: 20px;
`;

const SearchField = styled.input`
 border-radius: 1000px;
 width: 200px;
 border-style: solid;
 border-color: rgb(221, 221, 221);
 border-width: thin;
 padding: 6px 15px 6px 15px;
 font-size: large;
 color: grey;
`;

const ColumnsWrapper = styled.div`
 display: flex;
 flex-direction: row;
 justify-content: flex-start;
 gap: 15px;
 /* overflow-x: scroll; */
 /* Hide scrollbar for IE, Edge and Firefox */
 -ms-overflow-style: none;
 scrollbar-width: none;
 /* Hide scrollbar for Chrome, Safari and Opera */
 ::-webkit-scrollbar {
  display: none;
 }
`;

const Column = styled.div`
 padding: 20px 10px 30px 10px;
 background-color: white;
 border-style: solid;
 border-color: rgb(221, 221, 221);
 border-width: thin;
 border-radius: 25px;
 min-height: 75vh;
 min-width: 280px;
 width: 280px;
 display: flex;
 flex-direction: column;
 gap: 10px;
`;

const ColumnTitleRow = styled.div`
 display: flex;
 justify-content: space-between;
 align-items: center;
 padding: 10px;
 gap: 10px;
 min-height: 40px;
 h2 {
  font-size: 20px;
  font-weight: 500;
  color: #35307e;
  transition: 0.15s;
 }
`;

const SelectedList = memo(function SelectedList({ tasks, setOpenModal }: any) {
 return tasks.map((task: any, index: number) => (
  <TaskCard
   onClick={() => {
    setOpenModal(task.id);
   }}
   index={index}
   id={task.id}
   identifier={task.data.identifier}
   authorId={task.data.userId}
   title={task.data.title}
   timestamp={task.data.timestamp}
   summary={task.data.taskSummary}
   description={task.data.description}
   priority={task.data.priority}
   status={task.data.status}
   key={index}
  />
 ));
});

const InProgressList = memo(function InProgressList({ tasks, setOpenModal }: any) {
 return tasks.map((task: any, index: number) => (
  <TaskCard
   onClick={() => {
    setOpenModal(task.id);
   }}
   index={index}
   id={task.id}
   identifier={task.data.identifier}
   authorId={task.data.userId}
   title={task.data.title}
   timestamp={task.data.timestamp}
   summary={task.data.taskSummary}
   description={task.data.description}
   priority={task.data.priority}
   status={task.data.status}
   key={index}
  />
 ));
});

const InReviewList = memo(function InProgressList({ tasks, setOpenModal }: any) {
 return tasks.map((task: any, index: number) => (
  <TaskCard
   onClick={() => {
    setOpenModal(task.id);
   }}
   index={index}
   id={task.id}
   identifier={task.data.identifier}
   authorId={task.data.userId}
   title={task.data.title}
   timestamp={task.data.timestamp}
   summary={task.data.taskSummary}
   description={task.data.description}
   priority={task.data.priority}
   status={task.data.status}
   key={index}
  />
 ));
});

const CompletedList = memo(function CompletedList({ tasks, setOpenModal }: any) {
 return tasks.map((task: any, index: number) => (
  <TaskCard
   onClick={() => {
    setOpenModal(task.id);
   }}
   index={index}
   id={task.id}
   identifier={task.data.identifier}
   authorId={task.data.userId}
   title={task.data.title}
   timestamp={task.data.timestamp}
   summary={task.data.taskSummary}
   description={task.data.description}
   priority={task.data.priority}
   status={task.data.status}
   key={index}
  />
 ));
});

const TasksPage: NextPage = () => {
 // Auth
 const { currentUser } = useAuth();

 // Opening and closing Task Modals
 const [openModal, setOpenModal] = useState('');

 // Get Project ID
 const router = useRouter();
 const { id: projectId } = router.query;

 // Initialize states for all columns
 const [tasksSelected, setTasksSelected] = useState([]);
 const countSelected = tasksSelected?.length;

 const [tasksInProgress, setTasksInProgress] = useState([]);
 const countInProgress = tasksInProgress.length;

 const [tasksInReview, setTasksInReview] = useState([]);
 const countInReview = tasksInReview.length;

 const [tasksCompleted, setTasksCompleted] = useState([]);
 const countCompleted = tasksCompleted.length;

 // Query tasks
 const tasks: any = [];
 const tasksRef = query(collection(firestore, 'tasks'), where('user', '==', currentUser.uid));
 const tasksSnap = useFirestoreQuery(['tasks'], tasksRef, { subscribe: false });
 tasksSnap?.data?.forEach((doc) => tasks.push({ id: doc.id, data: doc.data() }));

 useEffect(() => {
  // Population of Selected for development Column
  setTasksSelected(tasks?.filter((task: any) => task.data.column === 'selected-for-development-column'));
  // Population of In Progress Column
  setTasksInProgress(tasks?.filter((task: any) => task.data.column === 'in-progress-column'));
  // Population of In Review Column
  setTasksInReview(tasks?.filter((task: any) => task.data.column === 'in-review-column'));
  // Population of Completed Column
  setTasksCompleted(tasks?.filter((task: any) => task.data.column === 'completed-column'));
 }, []);

 /*




  Hier Bug fixen, lädt nicht beim ersten aufmachen der seite!!!




 */

 // Drag and drop functionality (TODO: Move to seperate file, way to big a function)
 const onDragEnd = (result: {
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
  const { destination, source, draggableId } = result;

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
    case 'in-progress-column': {
     let newTasksInProgress = [...tasksInProgress];
     // reordering the array
     let [insert] = newTasksInProgress.splice(source.index, 1);
     newTasksInProgress.splice(destination.index, 0, insert);
     setTasksInProgress(newTasksInProgress);
     break;
    }
    case 'in-review-column': {
     let newTasksInReview = [...tasksInReview];
     newTasksInReview.splice(destination.index, 0, newTasksInReview.splice(source.index, 1)[0]); // reordering the array
     setTasksInReview(newTasksInReview);
     break;
    }
    case 'completed-column': {
     let newTasksCompleted = [...tasksCompleted];
     newTasksCompleted.splice(destination.index, 0, newTasksCompleted.splice(source.index, 1)[0]); // reordering the array
     setTasksCompleted(newTasksCompleted);
     break;
    }
    default:
     break;
   }
  }

  // Handle item drop in a different column ( with status and index change )
  if (source.droppableId != destination.droppableId) {
   let startSourceTasks: any = [];
   let startDestinationTasks: any = [];
   // populate the startSourceTasks with a copy of current state
   switch (source.droppableId) {
    case 'selected-for-development-column':
     startSourceTasks = [...tasksSelected];
     break;
    case 'in-progress-column':
     startSourceTasks = [...tasksInProgress];
     break;
    case 'in-review-column':
     startSourceTasks = [...tasksInReview];
     break;
    case 'completed-column':
     startSourceTasks = [...tasksCompleted];
     break;
    default:
     break;
   }

   // delete the tasks within the startSourceTasks
   let temp = startSourceTasks.splice(source.index, 1)[0];

   // save the deletion in source column to current state
   switch (source.droppableId) {
    case 'selected-for-development-column':
     setTasksSelected(startSourceTasks);
     break;
    case 'in-progress-column':
     setTasksInProgress(startSourceTasks);
     break;
    case 'in-review-column':
     setTasksInReview(startSourceTasks);
     break;
    case 'completed-column':
     setTasksCompleted(startSourceTasks);
     break;
    default:
     break;
   }

   // populate the startDestinationTasks with a copy of current state
   switch (destination.droppableId) {
    case 'selected-for-development-column':
     startDestinationTasks = [...tasksSelected];
     temp.column = destination.droppableId;
     temp.status = 'Selected for Development';
     //  dispatch(updateTaskInitiate(temp)); hier mutation reinhauen
     break;
    case 'in-progress-column':
     startDestinationTasks = [...tasksInProgress];
     temp.column = destination.droppableId;
     temp.status = 'In Progress';
     //  dispatch(updateTaskInitiate(temp)); hier mutation reinhauen
     break;
    case 'in-review-column':
     startDestinationTasks = [...tasksInReview];
     temp.column = destination.droppableId;
     temp.status = 'In Review';
     //  dispatch(updateTaskInitiate(temp)); hier mutation reinhauen
     break;
    case 'completed-column':
     startDestinationTasks = [...tasksCompleted];
     temp.column = destination.droppableId;
     temp.status = 'Completed';
     //  dispatch(updateTaskInitiate(temp)); hier mutation reinhauen
     break;
    default:
     break;
   }

   // add the previously deleted task from startSourcetask to the new column
   startDestinationTasks.splice(destination.index, 0, temp);

   // save the addition in destination column to current state
   switch (destination.droppableId) {
    case 'selected-for-development-column':
     setTasksSelected(startDestinationTasks);
     break;
    case 'in-progress-column':
     setTasksInProgress(startDestinationTasks);
     break;
    case 'in-review-column':
     setTasksInReview(startDestinationTasks);
     break;
    case 'completed-column':
     setTasksCompleted(startDestinationTasks);
     break;
    default:
     break;
   }
  }
 };

 return (
  <DragDropContext onDragEnd={onDragEnd}>
   <div>
    {/* <FilterSection>
          <p>
            Search Tasks{" "}
            <span>
              <SearchField type="text"></SearchField>
            </span>
          </p>
          <div className="filter-checkbox">
                    </div>
        </FilterSection> */}
    <ColumnsWrapper>
     <Column>
      <ColumnTitleRow>
       <h2>Selected For Development</h2>
       <CounterBlob count={countSelected} />
      </ColumnTitleRow>
      <Droppable droppableId={'selected-for-development-column'}>
       {(provided: any, snapshot: any) => (
        <div
         style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
         }}
         ref={provided.innerRef}
         {...provided.droppableProps}
         //  isDraggingOver={snapshot.isDraggingOver}
        >
         <SelectedList tasks={tasksSelected} setOpenModal={setOpenModal} />
         {provided.placeholder}
        </div>
       )}
      </Droppable>
     </Column>

     <Column>
      <ColumnTitleRow>
       <h2>In Progress</h2>
       <CounterBlob count={countInProgress} />
      </ColumnTitleRow>
      <Droppable droppableId={'in-progress-column'}>
       {(provided: any, snapshot: any) => (
        <div
         style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
         }}
         ref={provided.innerRef}
         {...provided.droppableProps}
         //  isDraggingOver={snapshot.isDraggingOver}
        >
         <InProgressList tasks={tasksInProgress} setOpenModal={setOpenModal} />
         {provided.placeholder}
        </div>
       )}
      </Droppable>
     </Column>

     <Column>
      <ColumnTitleRow>
       <h2>In Review</h2>
       <CounterBlob count={countInReview} />
      </ColumnTitleRow>
      <Droppable droppableId={'in-review-column'}>
       {(provided: any, snapshot: any) => (
        <div
         style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
         }}
         ref={provided.innerRef}
         {...provided.droppableProps}
         //  isDraggingOver={snapshot.isDraggingOver}
        >
         <InReviewList tasks={tasksInReview} setOpenModal={setOpenModal} />
         {provided.placeholder}
        </div>
       )}
      </Droppable>
     </Column>

     <Column>
      <ColumnTitleRow>
       <h2>Completed</h2>
       <CounterBlob count={countCompleted} />
      </ColumnTitleRow>
      <Droppable droppableId={'completed-column'}>
       {(provided: any, snapshot: any) => (
        <div
         style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
         }}
         ref={provided.innerRef}
         {...provided.droppableProps}
         //  isDraggingOver={snapshot.isDraggingOver}
        >
         <CompletedList tasks={tasksCompleted} setOpenModal={setOpenModal} />
         {provided.placeholder}
        </div>
       )}
      </Droppable>
      {/* {openModal && (
       <TaskModal closeModal={setOpenModal} task={tasks.filter((item) => item.id === openModal)[0]} />
      )} */}
     </Column>
    </ColumnsWrapper>
   </div>
  </DragDropContext>
 );
};

// Idee: Hinter completed ein "create new column" erstellen und auch alle draggable machen

export default withAuth(TasksPage);
