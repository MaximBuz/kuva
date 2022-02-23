// Router
import { useRouter } from 'next/router';

// Auth
import { useAuth } from '../utils/auth';

// Layout
import MainLayout from '../layouts/MainLayout';
import { projectsOverviewItems } from '../components/menu/LeftMenu/MenuContents';

export default function withAuth(WrappedComponent: any): Function {
 return function Authenticated(props: any) {
  const Router = useRouter();

  const { currentUser } = useAuth();

  if (!currentUser) {
   Router.replace('/login');
   return null;
  }

  return (
   <MainLayout menuContent={projectsOverviewItems} {...props} key={document.location.href}>
    <WrappedComponent {...props} />
   </MainLayout>
  );
 };
}
