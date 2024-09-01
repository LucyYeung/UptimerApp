'use client';

import { ChangeEvent, FC, ReactElement } from 'react';

import { EditMonitorProps } from '@/interfaces/monitor.interface';
import { INotification } from '@/interfaces/notification.interface';
import { SSL_FREQUENCIES } from '@/utils/utils';
import clsx from 'clsx';

import PageLoader from '@/components/PageLoader';
import UptimeGroupBtn from '@/components/UptimeGroupBtn';

import { useSSLEdit } from '@/app/(ssl)/hooks/useSSLMonitor';
import FormButtons from '@/app/(uptime)/components/FormButtons';
import MonitorItem from '@/app/(uptime)/components/MonitorItem';

const EditSSLMonitor: FC<EditMonitorProps> = ({ params }): ReactElement => {
  const {
    loading,
    monitorInfo,
    notifications,
    validationErrors,
    setMonitorInfo,
    onHandleSubmit,
  } = useSSLEdit(params.monitorId);

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
            Edit SSL Monitor
          </div>
          <div className='m-auto mt-4 w-[80%] border bg-lightGray p-6'>
            <UptimeGroupBtn
              buttonsText={['SSL/TLS']}
              labelText='Monitor Type'
              type='string'
            />
            <MonitorItem
              id='name'
              requiredIcon={true}
              type='text'
              topClass='mt-5'
              labelStart='Display Name'
              className={clsx(
                'block w-full rounded-lg border border-black bg-white p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500',
                {
                  'border border-red-400': validationErrors!.name,
                }
              )}
              inputValue={monitorInfo.name}
              placeholder='Enter a friendly name'
              onChange={(event: ChangeEvent) => {
                const value: string = (event.target as HTMLInputElement).value;
                setMonitorInfo({ ...monitorInfo, name: value });
              }}
            />
            <MonitorItem
              id='url'
              requiredIcon={true}
              type='text'
              topClass='mt-5'
              labelStart='SSL/TLS URL'
              className={clsx(
                'block w-full rounded-lg border border-black bg-white p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500',
                {
                  'border border-red-400': validationErrors!.url,
                }
              )}
              inputValue={monitorInfo.url}
              placeholder='https://example.com'
              onChange={(event: ChangeEvent) => {
                const value: string = (event.target as HTMLInputElement).value;
                setMonitorInfo({ ...monitorInfo, url: value });
              }}
            />
            <div className='mt-5'>
              <label
                htmlFor='notificationGroup'
                className='text-medium mb-2 block font-medium text-gray-900'
              >
                Notification Group<sup className='text-red-400'>*</sup>
              </label>
              <select
                id='notificationGroup'
                name='notificationGroup'
                className={clsx(
                  'block w-full cursor-pointer rounded-md border border-black bg-white p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500',
                  {
                    'border border-red-400': validationErrors!.notificationId,
                  }
                )}
                value={
                  !isNaN(monitorInfo.notificationId!)
                    ? monitorInfo.notificationId
                    : 0
                }
                onChange={(event: ChangeEvent) => {
                  const value: string = (event.target as HTMLInputElement)
                    .value;
                  setMonitorInfo({
                    ...monitorInfo,
                    notificationId: parseInt(value),
                  });
                }}
              >
                <option value='0'>Select</option>
                {notifications &&
                  notifications.map(
                    (notification: INotification, index: number) => (
                      <option
                        key={index}
                        value={parseInt(`${notification.id}`)}
                      >
                        {notification.groupName}
                      </option>
                    )
                  )}
              </select>
            </div>
            <MonitorItem
              id='alertThreshold'
              requiredIcon={true}
              type='number'
              topClass='mt-5'
              labelStart='Alert Threshold'
              labelEnd='Number of errors that has to occur before sending a notification. Add 0 if no error notification is required.'
              className={clsx(
                'block w-full rounded-lg border border-black bg-white p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500',
                {
                  'border border-red-400': validationErrors!.alertThreshold,
                }
              )}
              inputValue={monitorInfo.alertThreshold}
              placeholder='Enter notification alert threshold'
              onChange={(event: ChangeEvent) => {
                const value = (event.target as HTMLInputElement).value;
                setMonitorInfo({
                  ...monitorInfo,
                  alertThreshold: !isNaN(parseInt(value))
                    ? parseInt(value)
                    : '',
                });
              }}
            />
            <div className='mt-5'>
              <UptimeGroupBtn
                buttonsText={SSL_FREQUENCIES}
                labelText='Heartbeat Frequency'
                type='object'
                selectedItem={`${monitorInfo.frequency}`}
                onClick={(event: string) => {
                  setMonitorInfo({
                    ...monitorInfo,
                    frequency: parseInt(event, 10),
                  });
                }}
              />
            </div>
          </div>
          <FormButtons href='/ssl' buttonLabel='Update Monitor' />
        </form>
      )}
    </>
  );
};

export default EditSSLMonitor;
