import React, { ChangeEvent, FC, ReactElement } from 'react';

import { MonitorBaseInfoProps } from '@/interfaces/monitor.interface';
import { INotification } from '@/interfaces/notification.interface';
import { FREQUENCIES } from '@/utils/utils';
import clsx from 'clsx';

import UptimeGroupBtn from '@/components/UptimeGroupBtn';

import MonitorItem from './MonitorItem';

const MonitorBaseInfo: FC<MonitorBaseInfoProps> = ({
  monitorInfo,
  type,
  buttonsText,
  urlLabel,
  urlPlaceholder,
  notifications,
  validationErrors,
  setMonitorInfo,
}): ReactElement => {
  return (
    <>
      <UptimeGroupBtn
        buttonsText={buttonsText!}
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
        labelStart={urlLabel}
        className={clsx(
          'block w-full rounded-lg border border-black bg-white p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500',
          {
            'border border-red-400': validationErrors!.url,
          }
        )}
        inputValue={monitorInfo.url}
        placeholder={urlPlaceholder!}
        onChange={(event: ChangeEvent) => {
          const value: string = (event.target as HTMLInputElement).value;
          setMonitorInfo({ ...monitorInfo, url: value });
        }}
      />
      {type === 'tcp' && (
        <MonitorItem
          id='port'
          requiredIcon={true}
          type='text'
          topClass='mt-5'
          labelStart='Port'
          className={clsx(
            'block w-full rounded-lg border border-black bg-white p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500',
            {
              'border border-red-400': validationErrors!.port,
            }
          )}
          inputValue={monitorInfo.port}
          placeholder='Port'
          onChange={(event: ChangeEvent) => {
            const value: string = (event.target as HTMLInputElement).value;
            setMonitorInfo({
              ...monitorInfo,
              port: !isNaN(parseInt(value)) ? parseInt(value) : '',
            });
          }}
        />
      )}
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
            !isNaN(monitorInfo.notificationId!) ? monitorInfo.notificationId : 0
          }
          onChange={(event: ChangeEvent) => {
            const value: string = (event.target as HTMLInputElement).value;
            setMonitorInfo({ ...monitorInfo, notificationId: parseInt(value) });
          }}
        >
          <option value='0'>Select</option>
          {notifications &&
            notifications.map((notification: INotification, index: number) => (
              <option key={index} value={parseInt(`${notification.id}`)}>
                {notification.groupName}
              </option>
            ))}
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
            alertThreshold: !isNaN(parseInt(value)) ? parseInt(value) : '',
          });
        }}
      />
      <div className='mt-5'>
        <UptimeGroupBtn
          buttonsText={FREQUENCIES}
          labelText='Heartbeat Frequency'
          type='object'
          selectedItem={`${monitorInfo.frequency}`}
          onClick={(event: string) => {
            setMonitorInfo({ ...monitorInfo, frequency: parseInt(event, 10) });
          }}
        />
      </div>
      <div className='mt-5'>
        <UptimeGroupBtn
          buttonsText={['Running', 'Paused']}
          labelText='Creation State'
          type='string'
          selectedItem={`${monitorInfo.active ? 'Running' : 'Paused'}`}
          onClick={(event: string) => {
            setMonitorInfo({
              ...monitorInfo,
              active: event === 'Running' ? true : false,
            });
          }}
        />
        <label htmlFor='active' className='my-1 block text-xs text-gray-500'>
          This defines whether the test will start to run right away, or should
          be paused for later activation.
        </label>
      </div>
    </>
  );
};

export default MonitorBaseInfo;
