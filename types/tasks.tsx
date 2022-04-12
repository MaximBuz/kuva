import { Timestamp } from "firebase/firestore";
import React from "react";

export interface IComment {
 authorId: string;
 authorName: string;
 text: string;
 timestamp: Timestamp;
}

export interface ITaskData {
 archived?: boolean;
 column?:
  | 'backlog-column'
  | 'selected-for-development-column'
  | 'in-progress-column'
  | 'in-review-column'
  | 'completed-column';
 comments?: IComment[];
 description: string;
 identifier: string;
 priority: 'high' | 'medium' | 'low';
 projectId?: string;
 status: 'Backlog' | 'Selected for Development' | 'In Progress' | 'In Review' | 'Completed';
 summary: string;
 timestamp: Timestamp;
 title: string;
 user: string;
 index?: number;
 assignedTo: string;
 onClick?: (event: React.MouseEvent<HTMLElement>) => void;
}

export interface ITask<T> {
 data: T;
 id: string;
}

export type ITaskArray = ITask<ITaskData>[];


