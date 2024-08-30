'use client';

import { ChangeEvent, FC, ReactElement } from 'react';

import PageLoader from '@/components/PageLoader';

import Assertions from '@/app/(uptime)/components/Assertions';
import FormButtons from '@/app/(uptime)/components/FormButtons';
import MonitorBaseInfo from '@/app/(uptime)/components/MonitorBaseInfo';
import { useRedisCreate } from '@/app/(uptime)/hooks/useRedisMonitor';

const CreateRedisMonitor: FC = (): ReactElement => {
  const {
    loading,
    monitorInfo,
    notifications,
    validationErrors,
    setMonitorInfo,
    onHandleSubmit,
  } = useRedisCreate();

  return (
    <>
      {loading ? (
        <PageLoader />
      ) : (
        <form
          action={onHandleSubmit}
          className='relative m-auto min-h-screen xl:container'
        >
          <div className='m-auto mt-4 w-[80%] py-2 text-base font-bold lg:text-xl'>
            Add New Redis Monitor
          </div>
          <div className='m-auto mt-4 w-[80%] border bg-lightGray p-6'>
            <MonitorBaseInfo
              buttonsText={['Redis']}
              urlLabel='Redis Connection String'
              type='redis'
              urlPlaceholder='redis://user:password@host:port'
              monitorInfo={monitorInfo}
              validationErrors={validationErrors}
              notifications={notifications}
              setMonitorInfo={setMonitorInfo}
            />
            <Assertions>
              <div className='mb-4'>
                <div className='text-medium mb-2 block font-medium'>
                  And connection is (Default is established)
                </div>
                <select
                  id='connection'
                  name='connection'
                  className='block w-full rounded-md border border-black bg-white p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500'
                  value={monitorInfo.connection}
                  onChange={(event: ChangeEvent) => {
                    const value: string = (event.target as HTMLInputElement)
                      .value;
                    setMonitorInfo({ ...monitorInfo, connection: value });
                  }}
                >
                  <option value='none'>Select</option>
                  <option value='established'>Established</option>
                  <option value='refused'>Refused</option>
                </select>
              </div>
            </Assertions>
          </div>
          <FormButtons href='/status' buttonLabel='Create Monitor' />
        </form>
      )}
    </>
  );
};

export default CreateRedisMonitor;
