// Router
import { useRouter } from 'next/router';

// Auth
import { useAuth } from '../utils/auth';

export default function withAuth(WrappedComponent: any): Function {
 return function Authenticated(props: any) {
  const Router = useRouter();

  const { currentUser } = useAuth();

  if (!currentUser) {
   Router.replace('/login');
   return null;
  }

  return <WrappedComponent {...props} />;
 };
}
