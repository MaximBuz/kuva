import { ReactNode } from "react";

export interface IMenuItemContent {
  icon: ReactNode;
  text: string;
  link?: string;
  active: boolean;
}

export interface IMenuItem extends IMenuItemContent {
  key: number;
  url: string;
}

export interface ILeftMenu {
  items: IMenuItem[];
  projectId: string;
}