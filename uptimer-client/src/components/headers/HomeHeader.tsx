import { FC, ReactElement, useContext, useState } from 'react';

import Link from 'next/link';

import { MonitorContext } from '@/context/MonitorContext';
import { apolloPersistor } from '@/queries/apolloClient';
import { LOGOUT_USER } from '@/queries/auth';
import { useMutation } from '@apollo/client';
import clsx from 'clsx';
import { FaAlignJustify, FaTimes, FaUserAlt } from 'react-icons/fa';

const HomeHeader: FC = (): ReactElement => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const { dispatch } = useContext(MonitorContext);
  const [logout, { client }] = useMutation(LOGOUT_USER);

  return (
    <div className='relative z-40 mt-1 w-full border-b border-[#e5f3ff] py-2.5'>
      <div className='m-auto px-6 xl:container md:px-12 lg:px-6'>
        <div className='relative flex flex-wrap items-center justify-between gap-6 md:gap-0'>
          <div className='flex w-full gap-x-4 lg:w-6/12'>
            <div className='w-full md:flex'>
              <div className='w-full gap-x-4 md:flex'>
                <Link
                  href='/status'
                  className='relative z-10 flex cursor-pointer text-xl font-semibold text-[#4aa1f3]'
                >
                  Uptime Tests
                </Link>
              </div>
            </div>
            <div
              className='peer-checked:hamburger relative z-20 block cursor-pointer lg:hidden'
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <div className='space-y-2'>
                {!menuOpen ? (
                  <FaAlignJustify className='block text-2xl text-gray-600' />
                ) : (
                  <FaTimes className='block text-2xl text-gray-600' />
                )}
              </div>
            </div>
          </div>
          <div
            className={clsx(
              'navmenu mb-16 w-full cursor-pointer flex-wrap items-center space-y-8 rounded-3xl border border-gray-100 bg-white p-6 shadow-2xl lg:m-0 lg:flex lg:w-6/12 lg:space-y-0 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none',
              {
                'justify-starts absolute top-[38px] flex': menuOpen,
                'hidden justify-end': !menuOpen,
              }
            )}
          >
            <div className='text-[#74767e] lg:pr-4'>
              <ul
                className={clsx('flex text-base font-medium', {
                  'flex-col': menuOpen,
                  'gap-4': !menuOpen,
                })}
              >
                <>
                  <li
                    className={clsx(
                      'z-50 flex cursor-pointer items-center font-bold',
                      {
                        'py-2.5 text-[15px] text-[#333333]': menuOpen,
                        'gap-1': !menuOpen,
                      }
                    )}
                  >
                    <FaUserAlt />
                    <div className={clsx('', { 'ml-4': menuOpen })}>
                      Username
                    </div>
                  </li>
                  <li className='lg:hidden'>Sidebar</li>
                  <li
                    className={clsx(
                      'relative z-50 flex cursor-pointer items-center rounded-full font-bold',
                      {
                        'mt-5 text-[15px] text-[#333333]': menuOpen,
                        'ml-auto h-9 justify-center gap-1 bg-green-500 font-bold text-white hover:bg-green-400 sm:px-6':
                          !menuOpen,
                      }
                    )}
                    onClick={async () => {
                      dispatch({
                        type: 'dataUpdate',
                        payload: { user: null, notifications: [] },
                      });
                      await Promise.all([
                        client.clearStore(),
                        logout(),
                        apolloPersistor?.purge(),
                      ]);
                    }}
                  >
                    <FaUserAlt />
                    <Link href='/' className={clsx('', { 'ml-4': menuOpen })}>
                      Logout
                    </Link>
                  </li>
                </>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeHeader;
