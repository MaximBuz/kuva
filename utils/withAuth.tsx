// Router
import { useRouter } from 'next/router';

// Auth
import { useAuth } from '../utils/auth';

// Layout
import MainLayout from '../layouts/MainLayout';
import { projectsOverviewItems, ProjectTaskOverviewItems, ProjectBacklogItems } from '../components/menu/LeftMenu/MenuContents';

export default function withAuth(WrappedComponent: any): Function {
 return function Authenticated(props: any) {
  const Router = useRouter();

  const { currentUser } = useAuth();

  if (!currentUser) {
   Router.replace('/login');
   return null;
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
   <MainLayout menuContent={projectsOverviewItems} {...props} key={document.location.href}>
    <WrappedComponent {...props} />
   </MainLayout>
  );
 };
}
