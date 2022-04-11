import React from 'react';

import styled from 'styled-components';
import { ITaskData } from '../../types/tasks';

function TaskRow(props: ITaskData) {

 return (
  <Row onClick={props.onClick}>
   <IdentifierPill>
    <p>{props.identifier}</p>
   </IdentifierPill>
   <PriorityPill priority={props.priority}>
    <p>{props.priority}</p>
   </PriorityPill>
   <StatusPill>
     {props.status}
   </StatusPill>

   <Title>{props.title}</Title>
  </Row>
 );
}

export default TaskRow;

/* Styled Components */

const Row = styled.div<any>`
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

interface PriorityStyleProps {
 priority: 'high' | 'medium' | 'low';
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

const StatusPill = styled.div`
 background-color: white;
 color: gray;
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
 border-style: solid;
 border-color: rgb(221, 221, 221);
 border-width: thin;
`;

const Title = styled.h2`
 width: 360px;
 white-space: nowrap;
 overflow-x: hidden !important;
 text-overflow: ellipsis;
`;
