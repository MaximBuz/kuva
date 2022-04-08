
declare module 'react-beautiful-dnd' {
  export const DragDropContext, Droppable, Draggable;
  export interface DroppableProvided {
    innerRef: (arg0: HTMLElement) => void;
    droppableProps: {
     // used for shared global styles
     'data-rbd-droppable-context-id': string,
     // Used to lookup. Currently not used for drag and drop lifecycle
     'data-rbd-droppable-id': string,
    };
    placeholder: ReactNode;
   }
   
   export interface IDroppableSnapshot {
     isDraggingOver: boolean,
     draggingOverWith?: string,
     draggingFromThisWith?: string,
     isUsingPlaceholder: boolean,
   }
   
   export interface DragHandleProps extends React.HTMLAttributes<HTMLElement> {
    onFocus: () => void;
    onBlur: () => void;
    // what draggable the handle belongs to
    'data-rbd-drag-handle-draggable-id': string;
    // What DragDropContext the drag handle is in
    'data-rbd-drag-handle-context-id': string;
    // Id of hidden element that contains the lift instruction (nicer screen reader text)
    'aria-labelledby': string;
    // Allow tabbing to this element
    tabIndex: number;
    role: string;
    'aria-describedby': string;
    draggable: boolean;
   }
   
   export interface DraggableProvided {
    innerRef: (arg0: HTMLElement) => void;
    dragHandleProps: DragHandleProps;
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
   
   export interface DraggableSnapshot {
    isDragging: boolean;
    isDropAnimating: boolean;
    dropAnimation?: any;
    draggingOver?: string;
    combineWith?: string;
    combineTargetFor?: string;
    mode?: 'FLUID' | 'SNAP';
   }
   
}

