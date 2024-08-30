'use client';

import { ChangeEvent, FC, ReactElement } from 'react';

import { EditMonitorProps } from '@/interfaces/monitor.interface';
import clsx from 'clsx';

import PageLoader from '@/components/PageLoader';

import Assertions from '@/app/(uptime)/components/Assertions';
import FormButtons from '@/app/(uptime)/components/FormButtons';
import MonitorBaseInfo from '@/app/(uptime)/components/MonitorBaseInfo';
import MonitorItem from '@/app/(uptime)/components/MonitorItem';
import { useTCPEdit } from '@/app/(uptime)/hooks/useTCPMonitor';

const EditTCPMonitor: FC<EditMonitorProps> = ({ params }): ReactElement => {
  const {
    loading,
    monitorInfo,
    notifications,
    validationErrors,
    setMonitorInfo,
    onHandleSubmit,
  } = useTCPEdit(params.monitorId);

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
            Edit TCP Monitor
          </div>
          <div className='m-auto mt-4 w-[80%] border bg-lightGray p-6'>
            <MonitorBaseInfo
              buttonsText={['TCP']}
              urlLabel='Hostname'
              type='tcp'
              urlPlaceholder='Enter hostname'
              monitorInfo={monitorInfo}
              validationErrors={validationErrors}
              notifications={notifications}
              setMonitorInfo={setMonitorInfo}
            />
            <MonitorItem
              id='timeout'
              type='text'
              requiredIcon={true}
              topClass='mt-5'
              labelStart='Timeout (Default is 3 seconds)'
              className={clsx(
                'block w-full rounded-lg border border-black bg-white p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500',
                {
                  'border border-red-400': validationErrors!.timeout,
                }
              )}
              inputValue={monitorInfo.timeout}
              placeholder='Request timeout'
              onChange={(event: ChangeEvent) => {
                const value: string = (event.target as HTMLInputElement).value;
                setMonitorInfo({
                  ...monitorInfo,
                  timeout: !isNaN(parseInt(value)) ? parseInt(value) : '',
                });
              }}
            />
            <Assertions>
              <MonitorItem
                id='responseTime'
                type='number'
                topClass='mb-4'
                labelStart='When response time is less than (Default is 2000ms)'
                inputValue={monitorInfo.responseTime}
                placeholder='Default is 2000ms'
                onChange={(event: ChangeEvent) => {
                  const value: string = (event.target as HTMLInputElement)
                    .value;
                  setMonitorInfo({
                    ...monitorInfo,
                    responseTime: !isNaN(parseInt(value))
                      ? parseInt(value)
                      : '',
                  });
                }}
              />
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

export default EditTCPMonitor;
