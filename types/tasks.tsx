interface Comment {
 authorId: string;
 authorName: string;
 text: string;
 timestamp: any;
}

export interface TaskData {
 archived: boolean;
 column:
  | 'backlog-column'
  | 'selected-for-development-column'
  | 'in-progress-column'
  | 'in-review-column'
  | 'completed-column';
 comments: Comment[];
 description: string;
 identifier: string;
 priority: 'high' | 'medium' | 'low';
 projectId: string;
 status: 'backlog' | 'Selected for Development' | 'In Progress' | 'In Review' | 'Completed';
 summary: string;
 timestamp: any;
 title: string;
 user: string;
}

export interface TaskInterface<T> {
 data: T;
 id: string;
}

export type TasksArrayType = TaskInterface<TaskData>[];


