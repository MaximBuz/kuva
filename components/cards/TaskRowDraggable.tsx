import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { UilDraggabledots } from '@iconscout/react-unicons';

import styled from 'styled-components';

function TaskRow(props: {
 index: number;
 identifier: string;
 title: string;
 id: string;
 priority: 'high' | 'medium' | 'low';
 onClick: Function;
 authorId: string;
 timestamp: any;
 summary: string;
 description: string;
 status: string;
}) {
 const index = props.index;
 const identifier = props.identifier;
 const id = props.id;
 const title = props.title;
 const priority = props.priority;

 return (
  <Draggable draggableId={id} index={index}>
   {(provided: any, snapshot: any) => (
    <Row
     {...provided.draggableProps}
     ref={provided.innerRef}
     isDragging={snapshot.isDragging}
     onClick={props.onClick}
    >
     <IdentifierPill>
      <p>{identifier}</p>
     </IdentifierPill>
     <PriorityPill priority={priority}>
      <p>{priority}</p>
     </PriorityPill>
     <Title>{title}</Title>
     <DragHandle {...provided.dragHandleProps}>
      <UilDraggabledots color='#dddddd' />
     </DragHandle>
    </Row>
   )}
  </Draggable>
 );
}

export default TaskRow;

/* Styled Components */

const Row = styled.div`
 display: flex;
 flex-direction: row;
 gap: 10px;
 align-items: center;
 justify-content: flex-start;
 background-color: white;
 border-radius: 10px;
 border-style: solid;
 border-color: rgb(221, 221, 221);
 border-width: thin;
 display: flex;
 padding: 10px;
 gap: 10px;
 transition: 0.5s;
 cursor: pointer;
 line-height: normal;
 margin-bottom: 10px;
`;

interface PriorityStyleProps{
  priority: "high" | "medium" | "low"
}
const PriorityPill = styled.div<PriorityStyleProps>`
 color: white;
 border-radius: 6px;
 padding: 5px 10px 5px 10px;
 margin: 0px;
 min-width: 55px;
 text-align: center;
 text-transform: uppercase;
 height: fit-content;
 font-size: small;
 font-weight: 400;
 background-color: ${(props) => {
  if (props.priority === 'low') return '#45da5e';
  else if (props.priority === 'medium') return '#f8b965';
  else return '#e96262';
 }};
`;

const IdentifierPill = styled.div`
 background-color: #35307e;
 color: white;
 border-radius: 6px;
 padding: 5px 10px 5px 10px;
 margin: 0px;
 min-width: 55px;
 text-align: center;
 text-transform: uppercase;
 height: fit-content;
 font-size: small;
 font-weight: 400;
 transition: 0.15s;
`;
const Title = styled.h2`
 width: 360px;
 white-space: nowrap;
 overflow-x: hidden !important;
 text-overflow: ellipsis;
`;
const DragHandle = styled.div`
 display: flex;
 align-items: center;
 justify-content: center;
 margin-left: auto;
`;
