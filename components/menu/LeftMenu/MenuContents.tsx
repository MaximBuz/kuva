import {
  UilApps,
  UilUser,
  UilDialpad,
  UilUsersAlt,
  UilSchedule,
  UilArchiveAlt,
  UilSetting,
} from '@iconscout/react-unicons'


const projectsIcon = <UilApps/>;
const accountIcon = <UilUser/>;
const tasksIcon = <UilDialpad/>;
const collaboratorsIcon = <UilUsersAlt/>;
const backlogIcon = <UilSchedule/>;
const archiveIcon = <UilArchiveAlt/>;
const settingsIcon = <UilSetting/>;

export const ProjectsOverviewItems = [{
  icon: projectsIcon,
  text: "Projects",
  link: "/",
  active: true
},{
  icon: accountIcon,
  text: "Profile Settings",
  link: "profile",
  active: false
}];

export const ProfilePageItems = [{
  icon: projectsIcon,
  text: "Projects",
  link: "/",
  active: false
},{
  icon: accountIcon,
  text: "Profile Settings",
  link: "profile",
  active: true
}];


export const ProjectTaskOverviewItems = [{
  icon: projectsIcon,
  text: "Projects",
  link: "/",
  active: false
},{
  icon: tasksIcon,
  text: "Tasks",
  link: "/project/{CHANGETHIS}/",
  active: true
},{
  icon: backlogIcon,
  text: "Backlog",
  link: "/project/{CHANGETHIS}/backlog",
  active: false
},{
  icon: archiveIcon,
  text: "Archive",
  link: "/project/{CHANGETHIS}/archive",
  active: false
},{
  icon: collaboratorsIcon,
  text: "Team",
  link: "/project/{CHANGETHIS}/team",
  active: false
},{
  icon: settingsIcon,
  text: "Project Settings",
  link: "/project/{CHANGETHIS}/settings",
  active: false
}];


export const ProjectBacklogItems = [{
  icon: projectsIcon,
  text: "Projects",
  link: "/",
  active: false
},{
  icon: tasksIcon,
  text: "Tasks",
  link: "/project/{CHANGETHIS}/",
  active: false
},{
  icon: backlogIcon,
  text: "Backlog",
  link: "/project/{CHANGETHIS}/backlog",
  active: true
},{
  icon: archiveIcon,
  text: "Archive",
  link: "/project/{CHANGETHIS}/archive",
  active: false
},{
  icon: collaboratorsIcon,
  text: "Team",
  link: "/project/{CHANGETHIS}/team",
  active: false
},{
  icon: settingsIcon,
  text: "Project Settings",
  link: "/project/{CHANGETHIS}/settings",
  active: false
}];

export const ProjectArchiveItems = [{
  icon: projectsIcon,
  text: "Projects",
  link: "/",
  active: false
},{
  icon: tasksIcon,
  text: "Tasks",
  link: "/project/{CHANGETHIS}/",
  active: false
},{
  icon: backlogIcon,
  text: "Backlog",
  link: "/project/{CHANGETHIS}/backlog",
  active: false
},{
  icon: archiveIcon,
  text: "Archive",
  link: "/project/{CHANGETHIS}/archive",
  active: true
},{
  icon: collaboratorsIcon,
  text: "Team",
  link: "/project/{CHANGETHIS}/team",
  active: false
},{
  icon: settingsIcon,
  text: "Project Settings",
  link: "/project/{CHANGETHIS}/settings",
  active: false
}];



export const ProjectTeamItems = [{
  icon: projectsIcon,
  text: "Projects",
  link: "/",
  active: false
},{
  icon: tasksIcon,
  text: "Tasks",
  link: "/project/{CHANGETHIS}/",
  active: false
},{
  icon: backlogIcon,
  text: "Backlog",
  link: "/project/{CHANGETHIS}/backlog",
  active: false
},{
  icon: archiveIcon,
  text: "Archive",
  link: "/project/{CHANGETHIS}/archive",
  active: false
},{
  icon: collaboratorsIcon,
  text: "Team",
  link: "/project/{CHANGETHIS}/team",
  active: true
},{
  icon: settingsIcon,
  text: "Project Settings",
  link: "/project/{CHANGETHIS}/settings",
  active: false
}];



export const ProjectSettingsItems = [{
  icon: projectsIcon,
  text: "Projects",
  link: "/",
  active: false
},{
  icon: tasksIcon,
  text: "Tasks",
  link: "/project/{CHANGETHIS}/",
  active: false
},{
  icon: backlogIcon,
  text: "Backlog",
  link: "/project/{CHANGETHIS}/backlog",
  active: false
},{
  icon: archiveIcon,
  text: "Archive",
  link: "/project/{CHANGETHIS}/archive",
  active: false
},{
  icon: collaboratorsIcon,
  text: "Team",
  link: "/project/{CHANGETHIS}/team",
  active: false
},{
  icon: settingsIcon,
  text: "Project Settings",
  link: "/project/{CHANGETHIS}/settings",
  active: true
}];