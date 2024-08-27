import { useContext, useState } from 'react';

import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useRouter } from 'next/navigation';

import { IUserAuth } from '@/interfaces/user.interface';
import { LOGIN_USER } from '@/queries/auth';
import { showErrorToast } from '@/utils/utils';
import { FetchResult, useMutation } from '@apollo/client';

import { MonitorContext } from '@/app/context/MonitorContext';

import { LoginType, loginSchema } from '../validations/auth';

export const useLogin = (): IUserAuth => {
  const { dispatch } = useContext(MonitorContext);
  const [validationErrors, setValidationErrors] = useState<LoginType>({
    username: '',
    password: '',
  });

  const router: AppRouterInstance = useRouter();
  const [loginUser, { loading }] = useMutation(LOGIN_USER);

  const onLoginSubmit = async (formData: FormData) => {
    try {
      const resultSchema = loginSchema.safeParse(Object.fromEntries(formData));
      if (!resultSchema.success) {
        setValidationErrors({
          username: resultSchema.error.format().username?._errors[0],
          password: resultSchema.error.format().password?._errors[0],
        });
      } else {
        const result: FetchResult = await loginUser({
          variables: resultSchema.data,
        });

        if (result.data) {
          const { loginUser } = result.data;
          dispatch({
            type: 'dataUpdate',
            payload: {
              user: loginUser.user,
              notifications: loginUser.notifications,
            },
          });
          router.push('/');
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      showErrorToast('Invalid credentials');
    }
  };

  return {
    loading,
    validationErrors,
    setValidationErrors,
    onLoginSubmit,
  };
};
