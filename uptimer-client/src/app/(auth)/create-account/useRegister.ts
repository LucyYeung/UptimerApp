import { Dispatch, useContext, useState } from 'react';

import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useRouter } from 'next/navigation';

import { IUserAuth } from '@/interfaces/user.interface';
import { AUTH_SOCIAL_USER, REGISTER_USER } from '@/queries/auth';
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

import { DispatchProps, MonitorContext } from '@/app/context/MonitorContext';

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
    const resultSchema = registerSchema.safeParse(Object.fromEntries(formData));
    if (!resultSchema.success) {
      setValidationErrors({
        username: resultSchema.error.format().username?._errors[0],
        email: resultSchema.error.format().email?._errors[0] ?? '',
        password: resultSchema.error.format().password?._errors[0],
      });
    } else {
      submitUserData(resultSchema.data, registerUser, dispatch, router);
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

    submitUserData(data, authSocialUser, dispatch, router);
  };

  const registerWithFacebook = async () => {
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

    submitUserData(data, authSocialUser, dispatch, router);
  };

  return {
    loading,
    authWithGoogle: registerWithGoogle,
    authWithFacebook: registerWithFacebook,
  };
};

const submitUserData = async (
  data: RegisterType,
  registerUserMethod: (
    options?: MutationFunctionOptions | undefined
  ) => Promise<FetchResult>,
  dispatch: Dispatch<DispatchProps>,
  router: AppRouterInstance
) => {
  try {
    const result: FetchResult = await registerUserMethod({
      variables: {
        user: data,
      },
    });

    if (result.data) {
      const { registerUser, authSocialUser } = result.data;
      dispatch({
        type: 'dataUpdate',
        payload: {
          user: registerUser ? registerUser.user : authSocialUser.user,
          notifications: registerUser
            ? registerUser.notifications
            : authSocialUser.notifications,
        },
      });
      router.push('/');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    showErrorToast('Invalid credentials');
  }
};
