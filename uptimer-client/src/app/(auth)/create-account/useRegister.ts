import { useContext, useState } from 'react';

import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useRouter } from 'next/navigation';

import { IUserAuth } from '@/interfaces/user.interface';
import { AUTH_SOCIAL_USER, REGISTER_USER } from '@/queries/auth';
import { showErrorToast } from '@/utils/utils';
import { FetchResult, useMutation } from '@apollo/client';
import {
  Auth,
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
} from 'firebase/auth';

import { MonitorContext } from '@/app/context/MonitorContext';

import firebaseApp from '../firebase';
import { LoginType, RegisterType, registerSchema } from '../validations/auth';

export const useRegister = (): IUserAuth => {
  const { dispatch } = useContext(MonitorContext);
  const [validationErrors, setValidationErrors] = useState<
    RegisterType | LoginType
  >({
    username: '',
    email: '',
    password: '',
  });

  const router: AppRouterInstance = useRouter();
  const [registerUser, { loading }] = useMutation(REGISTER_USER);

  const onRegisterSubmit = async (formData: FormData) => {
    try {
      const resultSchema = registerSchema.safeParse(
        Object.fromEntries(formData)
      );
      if (!resultSchema.success) {
        setValidationErrors({
          username: resultSchema.error.format().username?._errors[0],
          email: resultSchema.error.format().email?._errors[0] ?? '',
          password: resultSchema.error.format().password?._errors[0],
        });
      } else {
        const result: FetchResult = await registerUser({
          variables: {
            user: resultSchema.data,
          },
        });

        if (result.data) {
          const { registerUser } = result.data;
          dispatch({
            type: 'dataUpdate',
            payload: {
              user: registerUser.user,
              notifications: registerUser.notifications,
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
    onRegisterSubmit,
  };
};

export const useSocialRegister = (): IUserAuth => {
  const { dispatch } = useContext(MonitorContext);
  const router: AppRouterInstance = useRouter();
  const [authSocialUser, { loading }] = useMutation(AUTH_SOCIAL_USER);

  const registerWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const auth: Auth = getAuth(firebaseApp);
    auth.useDeviceLanguage();
    const userCredential = await signInWithPopup(auth, provider);

    const nameList = userCredential.user.displayName?.split(' ');
    const data = {
      username: nameList?.[0] ?? '',
      email: userCredential.user.email ?? '',
      socialId: userCredential.user.uid,
      type: 'google',
    };

    const result: FetchResult = await authSocialUser({
      variables: {
        user: data,
      },
    });

    if (result.data) {
      const { authSocialUser } = result.data;
      dispatch({
        type: 'dataUpdate',
        payload: {
          user: authSocialUser.user,
          notifications: authSocialUser.notifications,
        },
      });
      router.push('/');
    }
  };

  return {
    loading,
    authWithGoogle: registerWithGoogle,
  };
};
