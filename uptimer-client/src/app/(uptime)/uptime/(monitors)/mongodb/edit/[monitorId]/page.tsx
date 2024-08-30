'use client';

import { ChangeEvent, FC, ReactElement } from 'react';

import { EditMonitorProps } from '@/interfaces/monitor.interface';

import PageLoader from '@/components/PageLoader';

import Assertions from '@/app/(uptime)/components/Assertions';
import FormButtons from '@/app/(uptime)/components/FormButtons';
import MonitorBaseInfo from '@/app/(uptime)/components/MonitorBaseInfo';
import { useMongoDBEdit } from '@/app/(uptime)/hooks/useMongoDBMonitor';

const EditMongoDBMonitor: FC<EditMonitorProps> = ({ params }): ReactElement => {
  const {
    loading,
    monitorInfo,
    notifications,
    validationErrors,
    setMonitorInfo,
    onHandleSubmit,
  } = useMongoDBEdit(params.monitorId);

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
            Edit MongoDB Monitor
          </div>
          <div className='m-auto mt-4 w-[80%] border bg-lightGray p-6'>
            <MonitorBaseInfo
              buttonsText={['MONGODB']}
              urlLabel='MongoDB Connection String'
              type='mongodb'
              urlPlaceholder='mongodb://username:password@host:post/database'
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
          <FormButtons href='/status' buttonLabel='Update Monitor' />
        </form>
      )}
    </>
  );
};

export default EditMongoDBMonitor;
