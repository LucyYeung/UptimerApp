import { FC, ReactElement, ReactNode, useContext, useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { MonitorContext } from '@/context/MonitorContext';
import { apolloPersistor } from '@/queries/apolloClient';
import { CHECK_CURRENT_USER } from '@/queries/auth';
import { useQuery } from '@apollo/client';

import PageLoader from './PageLoader';

interface IProtectedRouteProps {
  children: ReactNode;
}

type NavigateProps = {
  to: string;
  type: string;
};

const Navigate = ({ to, type }: NavigateProps): null => {
  const router = useRouter();
  const { dispatch } = useContext(MonitorContext);

  useEffect(() => {
    if (type === 'logout') {
      dispatch({
        type: 'dataUpdate',
        payload: { user: null, notifications: [] },
      });
      apolloPersistor?.purge();
    }
    router.push(to);
  }, [to, type, dispatch, router]);

  return null;
};

const ProtectedRoute: FC<IProtectedRouteProps> = ({
  children,
}): ReactElement => {
  const { dispatch } = useContext(MonitorContext);
  const { loading, error, data } = useQuery(CHECK_CURRENT_USER, {
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    if (data) {
      const { user, notifications } = data.checkCurrentUser;
      dispatch({
        type: 'dataUpdate',
        payload: {
          user,
          notifications,
        },
      });
    }
  }, [data, dispatch]);

  if (loading) {
    return <PageLoader />;
  }

  if (!error && data?.checkCurrentUser?.user) {
    return <>{children}</>;
  }

  return <Navigate to='/' type='logout' />;
};

export default ProtectedRoute;
