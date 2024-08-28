import { Dispatch, useContext, useState } from 'react';

import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useRouter } from 'next/navigation';

import { DispatchProps, MonitorContext } from '@/context/MonitorContext';
import { IUserAuth } from '@/interfaces/user.interface';
import { AUTH_SOCIAL_USER, LOGIN_USER } from '@/queries/auth';
import { showErrorToast } from '@/utils/utils';
import {
  FetchResult,
  MutationFunctionOptions,
  useMutation,
} from '@apollo/client';
import {
  Auth,
  FacebookAuthProvider,
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
} from 'firebase/auth';

import firebaseApp from '../firebase';
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
    const resultSchema = loginSchema.safeParse(Object.fromEntries(formData));
    if (!resultSchema.success) {
      setValidationErrors({
        username: resultSchema.error.format().username?._errors[0],
        password: resultSchema.error.format().password?._errors[0],
      });
    } else {
      submitUserData(
        resultSchema.data,
        loginUser,
        dispatch,
        router,
        'email/password'
      );
    }
  };

  return {
    loading,
    validationErrors,
    setValidationErrors,
    onLoginSubmit,
  };
};

export const useSocialLogin = () => {
  const { dispatch } = useContext(MonitorContext);
  const router: AppRouterInstance = useRouter();
  const [authSocialUser, { loading }] = useMutation(AUTH_SOCIAL_USER);

  const loginWithGoogle = async () => {
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

    submitUserData(data, authSocialUser, dispatch, router, 'social');
  };

  const loginWithFacebook = async () => {
    const provider = new FacebookAuthProvider();
    const auth: Auth = getAuth(firebaseApp);
    auth.useDeviceLanguage();
    const userCredential = await signInWithPopup(auth, provider);

    const nameList = userCredential.user.displayName?.split(' ');
    const data = {
      username: nameList?.[0] ?? '',
      email: userCredential.user.email ?? '',
      socialId: userCredential.user.uid,
      type: 'facebook',
    };

    submitUserData(data, authSocialUser, dispatch, router, 'social');
  };

  return {
    loading,
    authWithGoogle: loginWithGoogle,
    authWithFacebook: loginWithFacebook,
  };
};

const submitUserData = async (
  data: LoginType,
  loginUserMethod: (
    options?: MutationFunctionOptions | undefined
  ) => Promise<FetchResult>,
  dispatch: Dispatch<DispatchProps>,
  router: AppRouterInstance,
  authType: string
) => {
  try {
    const isSocial = authType === 'social';
    const variables = isSocial
      ? {
          user: data,
        }
      : data;
    const result: FetchResult = await loginUserMethod({
      variables,
    });

    if (result.data) {
      const { loginUser, authSocialUser } = result.data;
      dispatch({
        type: 'dataUpdate',
        payload: {
          user: isSocial ? authSocialUser.user : loginUser.user,
          notifications: isSocial
            ? authSocialUser.notifications
            : loginUser.notifications,
        },
      });
      router.push('/');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    showErrorToast('Invalid credentials');
  }
};
