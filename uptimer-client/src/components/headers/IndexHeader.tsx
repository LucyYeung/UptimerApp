import React, { useRef, useState } from 'react';

import Link from 'next/link';

import clsx from 'clsx';
import { FaAlignJustify, FaTimes, FaTv } from 'react-icons/fa';

const IndexHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className='relative z-[120] w-full border-b bg-white shadow-2xl shadow-gray-600/5 backdrop-blur dark:shadow-none'
      ref={headerRef}
    >
      <div className='m-auto px-6 xl:container md:px-12 lg:px-6'>
        <div className='relative flex flex-wrap items-center justify-between gap-6 py-4 md:gap-0'>
          <div className='flex w-full gap-x-4 lg:w-6/12'>
            <div className='flex w-full items-center justify-between'>
              <Link
                href='/'
                className='relative z-10 flex cursor-pointer items-center justify-center gap-2 self-center text-2xl font-semibold text-[#4aa1f3]'
              >
                <FaTv />
                Uptimer
              </Link>
              <label
                htmlFor='hbr'
                className='peer-checked:hamburger relative z-20 block cursor-pointer lg:hidden'
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <div className='space-y-2'>
                  {!menuOpen ? (
                    <FaAlignJustify className='block text-2xl text-gray-600' />
                  ) : (
                    <FaTimes />
                  )}
                </div>
              </label>
            </div>
          </div>
          <div
            className={clsx(
              'navmenu w-full cursor-pointer flex-wrap items-center justify-end space-y-8 rounded-3xl border border-gray-100 bg-white p-6 shadow-2xl lg:m-0 lg:flex lg:w-6/12 lg:space-y-0 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none',
              {
                'absolute top-[64px] flex': menuOpen,
                hidden: !menuOpen,
              }
            )}
          >
            <div className='w-full text-[#74767e] lg:w-auto lg:pr-4'>
              <ul className='flex w-full flex-col gap-4 text-base font-medium lg:w-auto lg:flex-row'>
                <li className='relative z-50 flex h-9 cursor-pointer items-center justify-center rounded-full bg-green-500 font-bold text-white hover:bg-green-400 sm:px-6'>
                  <Link href='/login' className='z-50 mx-5'>
                    Login
                  </Link>
                </li>
                <li className='relative z-50 flex h-9 cursor-pointer items-center justify-center rounded-full bg-green-500 font-bold text-white hover:bg-green-400 sm:px-6'>
                  <Link href='/create-account' className='z-50'>
                    Create an Account
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndexHeader;
