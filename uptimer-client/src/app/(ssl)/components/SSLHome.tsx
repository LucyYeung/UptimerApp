import { FC, ReactElement } from 'react';

import Link from 'next/link';

import { FaCheckCircle } from 'react-icons/fa';

import PageLoader from '@/components/PageLoader';
import Paginate from '@/components/Paginate';

import { useSSLHome } from '../hooks/useSSLHome';
import SSLButtonGroup from './SSLButtonGroup';
import SSLTable from './SSLTable';

const SSLHome: FC = (): ReactElement => {
  const { loading, monitors, limit, updateLimit } = useSSLHome();

  return (
    <>
      {loading ? (
        <PageLoader />
      ) : (
        <div className='static m-auto h-screen min-h-screen px-6 xl:container md:px-12 lg:px-6'>
          <>
            <div className='flex h-20 items-center justify-between'>
              <SSLButtonGroup sslMonitors={monitors} />
              <Link
                href='/ssl/create'
                className='inline-flex rounded bg-green-400 px-4 py-2 text-base font-medium text-white md:items-center'
              >
                New SSL Test
              </Link>
            </div>
            {!loading && monitors.length > 0 ? (
              <>
                <div className='my-4'>
                  <SSLTable limit={limit} monitors={monitors} />
                </div>
                <div className='my-4'>
                  {monitors.length > 0 ? (
                    <Paginate
                      updateLimit={updateLimit}
                      length={monitors.length}
                      defaultLimit={limit.end}
                    />
                  ) : (
                    <></>
                  )}
                </div>
              </>
            ) : (
              <>
                {!loading && !monitors.length && (
                  <div className='flex h-[50%] flex-col items-center justify-center'>
                    <FaCheckCircle className='text-[60px] text-green-400' />
                    <p className='py-2 text-base lg:text-lg'>
                      You have no SSL tests.
                    </p>
                    <Link
                      href='/ssl/create'
                      className='inline-flex items-center rounded bg-green-400 px-4 py-2 text-base font-medium text-white'
                    >
                      New SSL Test
                    </Link>
                  </div>
                )}
              </>
            )}
          </>
        </div>
      )}
    </>
  );
};

export default SSLHome;
