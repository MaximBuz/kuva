import { UilDraggabledots } from '@iconscout/react-unicons';

import styled from 'styled-components';
import { Timestamp } from 'firebase/firestore';
import { Draggable, DraggableProvided, DraggableSnapshot, DragHandleProps } from 'react-beautiful-dnd';
import { ITask } from '../../types/tasks';

const Card = styled.div<any>`
 background-color: white;
 border-radius: 25px;
 border-style: solid;
 border-color: rgb(221, 221, 221);
 border-width: thin;
 min-width: 235px;
 width: 100%;
 box-sizing: border-box;
 height: fit-content;
 display: flex;
 flex-direction: column;
 justify-content: space-evenly;
 padding: 20px;
 gap: 15px;
 cursor: pointer;
 margin-bottom: 10px;
`;

const TopRow = styled.div`
 display: flex;
 flex-direction: row;
 justify-content: flex-start;
 align-items: center;
 gap: 10px;
`;

const IdentifierPill = styled.div`
 background-color: #35307e;
 color: white;
 border-radius: 6px;
 padding: 5px 10px 5px 10px;
 margin: 0px;
 width: fit-content;
 height: fit-content;
 font-size: small;
 font-weight: 400;
`;

const PriorityPill = styled.div<ColorProps>`
 color: white;
 border-radius: 6px;
 padding: 5px 10px 5px 10px;
 margin: 0px;
 width: fit-content;
 height: fit-content;
 font-size: small;
 font-weight: 400;
 background-color: ${(props: ColorProps) => {
  if (props.priority === 'low') return '#45da5e';
  else if (props.priority === 'medium') return '#f8b965';
  else return '#e96262';
 }};
`;

const DragHandle = styled.div<DragHandleProps>`
 display: flex;
 align-items: center;
 justify-content: center;
 margin-left: auto;
 transition: 0.5s;
`;

const Content = styled.div`
 display: flex;
 flex-direction: column;
 gap: 10px;
 p {
  font-size: 14px;
 }
`;

const TitleRow = styled.div`
 display: flex;
 flex-direction: column;
 gap: 5px;
 h2 {
  font-size: 20px;
  font-weight: 500;
  color: #35307e;
 }
`;

type Props = {
 index: number;
 id: string;
 identifier: string;
 authorId: string;
 title: string;
 timestamp: Timestamp;
 summary: string;
 description: string;
 priority: 'high' | 'medium' | 'low';
 status: string;
 onClick: () => void;
};

interface ColorProps {
 priority: 'high' | 'medium' | 'low';
}

function TaskCard(props: ITask) {
 function truncateText(text: string, length: number): string {
  if (text.length <= length) {
   return text;
  }

  return text.substring(0, length) + '\u2026';
 }

 return (
  <Draggable draggableId={props.uid} index={props.index} key={props.uid}>
   {(provided: DraggableProvided, snapshot: DraggableSnapshot) => (
    <Card
     {...provided.draggableProps}
     ref={provided.innerRef}
     isDragging={snapshot.isDragging}
     onClick={props.onClick}
    >
     <TopRow>
      <IdentifierPill>
       <p>{props.identifier}</p>
      </IdentifierPill>
      <PriorityPill priority={props.priority}>
       <p>{props.priority}</p>
      </PriorityPill>
      <DragHandle {...provided.dragHandleProps}>
       <UilDraggabledots color='#dddddd' />
      </DragHandle>
     </TopRow>

     <Content>
      <TitleRow>
       <h2>{props.title}</h2>
      </TitleRow>
      <p style={{ color: 'grey', fontWeight: 'lighter' }}>{truncateText(props.summary, 60)}</p>
     </Content>
    </Card>
   )}
  </Draggable>
 );
}

export default TaskCard;
