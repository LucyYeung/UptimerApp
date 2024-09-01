import { FC, ReactElement } from 'react';

import {
  ISSLInfo,
  ISSLMonitorDocument,
  sslDefaultInfoData,
} from '@/interfaces/ssl.interface';
import { filter } from 'lodash';
import { FaArrowDown, FaArrowUp, FaExclamationTriangle } from 'react-icons/fa';

import Button from '@/components/Button';

interface SSLButtonGroupProps {
  sslMonitors: ISSLMonitorDocument[];
}

const SSLButtonGroup: FC<SSLButtonGroupProps> = ({
  sslMonitors,
}): ReactElement => {
  const monitorInfoData = (monitor: ISSLMonitorDocument): ISSLInfo =>
    monitor.info ? JSON.parse(monitor.info) : sslDefaultInfoData;

  const count = (type: string): number => {
    let sum = 0;
    if (type === 'success') {
      sum = filter(
        sslMonitors,
        (monitor: ISSLMonitorDocument) =>
          monitorInfoData(monitor).type === 'success'
      ).length;
    }
    if (type === 'danger') {
      sum = filter(
        sslMonitors,
        (monitor: ISSLMonitorDocument) =>
          monitorInfoData(monitor).type === 'danger' ||
          monitorInfoData(monitor).type === 'expired'
      ).length;
    }
    if (type === 'expiring soon') {
      sum = filter(
        sslMonitors,
        (monitor: ISSLMonitorDocument) =>
          monitorInfoData(monitor).type === 'expiring soon'
      ).length;
    }
    return sum;
  };

  return (
    <div className='inline-flex' role='group'>
      <Button
        label={`Valid: ${count('success')}`}
        icon={<FaArrowUp className='mr-1' />}
        type='button'
        className='mr-1 inline-flex items-center rounded bg-green-400 px-4 py-2 text-sm font-bold text-white'
      />
      <Button
        label={`Expiring soon: ${count('expiring soon')}`}
        icon={<FaExclamationTriangle className='mr-1' />}
        type='button'
        className='mr-1 inline-flex items-center rounded bg-yellow-400 px-4 py-2 text-sm font-bold text-white'
      />
      <Button
        label={`Expired / Invalid: ${count('danger')}`}
        icon={<FaArrowDown className='mr-1' />}
        type='button'
        className='mr-1 inline-flex items-center rounded bg-red-400 px-4 py-2 text-sm font-bold text-white'
      />
    </div>
  );
};

export default SSLButtonGroup;
