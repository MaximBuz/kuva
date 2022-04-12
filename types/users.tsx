import { DocumentReference } from "firebase/firestore";

export interface IUser {
  uid: string;
  displayName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  birthday: string;
  workAnniversary: string;
  avatar: string;
}

export interface ICollaboratorWithData {
  user: IUser;
  role: string;
  uid?: string;
}

export interface ICollaborator {
  user: DocumentReference;
  role: string;
}