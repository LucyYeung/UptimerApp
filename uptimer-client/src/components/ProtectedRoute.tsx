import { FC, ReactElement, ReactNode, useContext, useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { MonitorContext } from '@/context/MonitorContext';
import { apolloPersistor } from '@/queries/apolloClient';
import { CHECK_CURRENT_USER, LOGOUT_USER } from '@/queries/auth';
import { useMutation, useQuery } from '@apollo/client';

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
  const [logout, { client }] = useMutation(LOGOUT_USER);

  useEffect(() => {
    if (type === 'logout') {
      logout().then(async () => {
        dispatch({
          type: 'dataUpdate',
          payload: { user: null, notifications: [] },
        });
        client.clearStore();
        await apolloPersistor?.purge();
      });
    }
    router.push(to);
  }, [to, type, dispatch, router, client, logout]);

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
