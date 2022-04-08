import { Timestamp } from 'firebase/firestore';

export interface IProjectData {
  archived: boolean;
  description: string;
  key: string;
  timestamp: Timestamp;
  title: string;
  user: string;
 }
 
 export interface IProject<T> {
  data: T;
  id: string;
 }
 
 export type IProjectArray = IProject<IProjectData>[];
 