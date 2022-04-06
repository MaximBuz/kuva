// Router
import { useRouter } from 'next/router';

// Auth
import { useAuth } from '../utils/auth';

// Layout
import MainLayout from '../layouts/MainLayout';
import { ProjectsOverviewItems, ProjectTaskOverviewItems, ProjectBacklogItems, ProfilePageItems} from '../components/menu/LeftMenu/MenuContents';

export default function withAuth(WrappedComponent: any): Function {
 return function Authenticated(props: any) {
  const Router = useRouter();

  const { currentUser } = useAuth();

  if (!currentUser) {
   Router.replace('/login');
   return null;
  }
  
  if (Router.pathname == "/profile") {
    return (
      <MainLayout menuContent={ProfilePageItems} {...props} key={document.location.href}>
       <WrappedComponent {...props} />
      </MainLayout>
     );
  }
  
  if (Router.pathname == "/project/[id]") {
    return (
      <MainLayout menuContent={ProjectTaskOverviewItems} {...props} key={document.location.href}>
       <WrappedComponent {...props} />
      </MainLayout>
     );
  }

  if (Router.pathname == "/project/[id]/backlog") {
    return (
      <MainLayout menuContent={ProjectBacklogItems} {...props} key={document.location.href}>
       <WrappedComponent {...props} />
      </MainLayout>
     );
  }

  return (
   <MainLayout menuContent={ProjectsOverviewItems} {...props} key={document.location.href}>
    <WrappedComponent {...props} />
   </MainLayout>
  );
 };
}
