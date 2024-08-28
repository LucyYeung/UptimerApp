'use client';

import React, { FC, ReactElement, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import clsx from 'clsx';
import { FaEye, FaEyeSlash, FaFacebook, FaGoogle } from 'react-icons/fa';

import Button from '@/components/Button';
import PageLoader from '@/components/PageLoader';
import TextInput from '@/components/TextInput';

import { useLogin, useSocialLogin } from './useLogin';

const Login: FC = (): ReactElement => {
  const [passwordType, setPasswordType] = useState<string>('password');
  const { loading, validationErrors, setValidationErrors, onLoginSubmit } =
    useLogin();

  const {
    loading: socialAuthLoading,
    authWithGoogle,
    authWithFacebook,
  } = useSocialLogin();

  return (
    <div className='relative mx-auto flex h-screen w-11/12 max-w-md flex-col rounded-lg bg-white md:w-2/3'>
      {socialAuthLoading && <PageLoader />}
      <form action={onLoginSubmit}>
        <div className='mt-12 w-full px-5'>
          <div className='mb-5 flex flex-col justify-between text-gray-600'>
            <Link href='/' className='mx-auto mb-4 flex w-24 cursor-pointer'>
              <Image
                src='https://i.ibb.co/SBvxyHC/uptimer.png'
                alt='API Monitor'
                className='w-full'
                width={400}
                height={400}
                priority
              />
            </Link>
            <h1 className='mb-2 flex w-full justify-center text-center text-3xl font-medium'>
              Welcome Back
            </h1>
            <h5 className='mb-2 flex w-full cursor-pointer justify-center text-center font-normal text-blue-400 hover:underline'>
              <Link href='/create-account'>Create an account</Link>
            </h5>
          </div>
          <>
            <label
              htmlFor='username'
              className='text-sm font-bold leading-tight tracking-normal text-gray-800'
            >
              Email or Username
            </label>
            <TextInput
              id='username'
              name='username'
              type='text'
              className={clsx(
                'mb-5 mt-2 flex h-10 w-full items-center rounded border border-gray-300 pl-3 text-sm font-normal text-gray-600 focus:border focus:border-sky-500/50 focus:outline-none',
                {
                  'border border-red-400': validationErrors?.username,
                }
              )}
              placeholder='Enter username'
              onChange={() => {
                setValidationErrors!({
                  ...validationErrors!,
                  username: '',
                });
              }}
            />
          </>
          <>
            <label
              htmlFor='password'
              className='text-sm font-bold leading-tight tracking-normal text-gray-800'
            >
              Password
            </label>
            <div className='relative mb-2 mt-2'>
              <div className='absolute right-0 flex h-full cursor-pointer items-center pr-3 text-gray-600'>
                {passwordType === 'password' ? (
                  <FaEyeSlash
                    onClick={() => setPasswordType('text')}
                    className='icon icon-tabler icon-tabler-info-circle'
                  />
                ) : (
                  <FaEye
                    onClick={() => setPasswordType('password')}
                    className='icon icon-tabler icon-tabler-info-circle'
                  />
                )}
              </div>
              <TextInput
                id='password'
                name='password'
                type={passwordType}
                className={clsx(
                  'flex h-10 w-full items-center rounded border border-gray-300 pl-3 text-sm font-normal text-gray-600 focus:border focus:border-sky-500/50 focus:outline-none',
                  {
                    'border border-red-400': validationErrors?.password,
                  }
                )}
                placeholder='Enter password'
                onChange={() => {
                  setValidationErrors!({
                    ...validationErrors!,
                    password: '',
                  });
                }}
              />
            </div>
          </>
          <Button
            type='submit'
            disabled={loading}
            className='text-md my-6 block w-full cursor-pointer rounded bg-green-500 px-8 py-2 text-center font-bold text-white hover:bg-green-400 focus:outline-none'
            label={loading ? 'LOGGING IN...' : 'LOGIN'}
          />
        </div>
      </form>
      <div className='px-5'>
        <div className='relative flex items-center pb-5'>
          <div className='flex-grow border-t border-gray-400'></div>
          <span className='mx-2 flex-shrink'>or</span>
          <div className='flex-grow border-t border-gray-400'></div>
        </div>
        <Button
          type='button'
          icon={<FaGoogle className='-ml-1 mr-2 h-4 w-4' />}
          className='text-md inline-flex w-full cursor-pointer items-center justify-center rounded bg-[#4285F4] px-8 py-2 text-center font-bold text-white hover:bg-[#4285F4]/90 focus:outline-none'
          label='Sign in with Google'
          onClick={authWithGoogle}
        />
        <Button
          type='button'
          icon={<FaFacebook className='-ml-1 mr-2 h-4 w-4' />}
          className='text-md mt-4 inline-flex w-full cursor-pointer items-center justify-center rounded bg-[#3b5998] px-8 py-2 text-center font-bold text-white hover:bg-[#3b5998]/90 focus:outline-none'
          label='Sign in with Facebook'
          onClick={authWithFacebook}
        />
      </div>
    </div>
  );
};

export default Login;
