import { ReactNode } from 'react';
import { ReactChildren } from 'react';

export interface DroppableProvided {
 innerRef: (arg0: HTMLElement) => void;
 droppableProps: {
  // required
  droppableId: string;
  // optional
  type?: any;
  mode?: any;
  isDropDisabled?: boolean;
  isCombineEnabled?: boolean;
  direction?: any;
  ignoreContainerClipping?: boolean;
  renderClone?: any;
  getContainerForClone?: () => HTMLElement;
  children: (arg0: any, arg1: any) => Node;
 };
 placeholder: ReactNode;
}

export interface DraggableProvided {
 innerRef: (arg0: HTMLElement) => void;
 dragHandleProps: {
  // what draggable the handle belongs to
  'data-rbd-drag-handle-draggable-id': string;
  // What DragDropContext the drag handle is in
  'data-rbd-drag-handle-context-id': string;
  // Id of hidden element that contains the lift instruction (nicer screen reader text)
  'aria-labelledby': string;
  // Allow tabbing to this element
  tabIndex: number;
  // Stop html5 drag and drop
  draggable: boolean;
  onDragStart: (event: DragEvent) => void;
 };
 draggableProps: {
  // required
  draggableId: string;
  index: number;
  children: ReactChildren;
  // optional
  isDragDisabled?: boolean;
  disableInteractiveElementBlocking?: boolean;
  shouldRespectForcePress?: boolean;
 };
 placeholder: ReactNode;
}
