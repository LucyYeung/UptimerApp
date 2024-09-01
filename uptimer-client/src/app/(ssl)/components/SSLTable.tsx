import { FC, ReactElement } from 'react';

import { IPagination } from '@/interfaces/monitor.interface';
import {
  ISSLInfo,
  ISSLMonitorDocument,
  sslDefaultInfoData,
} from '@/interfaces/ssl.interface';
import clsx from 'clsx';
import {
  FaArrowDown,
  FaArrowUp,
  FaExclamationTriangle,
  FaPause,
  FaPencilAlt,
  FaPlay,
  FaTrashAlt,
} from 'react-icons/fa';

import Button from '@/components/Button';

import { useSSLTable } from '../hooks/useSSLTable';

interface SSLTableProps {
  monitors: ISSLMonitorDocument[];
  limit: IPagination;
}

const SSLTable: FC<SSLTableProps> = ({ monitors, limit }): ReactElement => {
  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    showModal,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    selectMonitor,
    setShowModal,
    setSelectedMonitor,
    formatSSLDate,
    toggleUserMonitor,
    editMonitor,
    deleteUserMonitor,
  } = useSSLTable();

  const renderButtons = (monitor: ISSLMonitorDocument): JSX.Element => {
    return (
      <div className='inline-flex shadow-sm' role='group'>
        <Button
          onClick={() => editMonitor(monitor)}
          icon={<FaPencilAlt />}
          type='button'
          className='mr-1 inline-flex items-center rounded border border-[#1e8dee] px-2 py-2 text-sm font-bold text-[#1e8dee] hover:bg-[#1e8dee] hover:text-white'
        />
        <Button
          onClick={() => toggleUserMonitor(monitor)}
          icon={monitor.active ? <FaPause /> : <FaPlay />}
          type='button'
          className='mr-1 inline-flex items-center rounded border border-[#1e8dee] px-2 py-2 text-sm font-bold text-[#1e8dee] hover:bg-[#1e8dee] hover:text-white'
        />
        <Button
          onClick={() => deleteUserMonitor(monitor)}
          icon={<FaTrashAlt />}
          type='button'
          className='mr-1 inline-flex items-center rounded bg-red-600 px-2 py-2 text-sm font-bold text-white hover:bg-red-400 hover:text-white'
        />
      </div>
    );
  };

  return (
    <>
      <div className='relative overflow-x-auto'>
        <table className='w-full border-collapse text-left text-sm text-gray-500 rtl:text-right'>
          <thead className='bg-gray-50 text-xs uppercase text-gray-700'>
            <tr>
              <th scope='col' className='px-6 py-3'>
                Status
              </th>
              <th scope='col' className='px-6 py-3'>
                Name
              </th>
              <th scope='col' className='px-6 py-3'>
                Domain
              </th>
              <th scope='col' className='px-6 py-3'>
                Issuer
              </th>
              <th scope='col' className='px-6 py-3'>
                Valid From
              </th>
              <th scope='col' className='px-6 py-3'>
                Valid To
              </th>
              <th scope='col' className='px-6 py-3'>
                Remaining
              </th>
              <th scope='col' className='px-6 py-3'>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {monitors
              .slice(limit.start, limit.end)
              .map((monitor: ISSLMonitorDocument, index: number) => {
                const monitorInfo: ISSLInfo = monitor.info
                  ? JSON.parse(monitor.info)
                  : sslDefaultInfoData;

                return (
                  <tr
                    key={monitor.id}
                    className={`${index % 2 !== 0 ? 'bg-white' : 'bg-[#f8f8fa]'}`}
                  >
                    <th
                      scope='row'
                      className='whitespace-nowrap px-6 py-4 font-medium text-gray-900'
                    >
                      <button
                        type='button'
                        className={clsx(
                          'mr-1 inline-flex items-center rounded px-4 py-2 text-sm font-bold text-white',
                          {
                            'bg-green-400': monitorInfo.type === 'success',
                            'bg-red-400':
                              monitorInfo.type === 'danger' ||
                              monitorInfo.type === '--' ||
                              monitorInfo.type === 'expired',
                            'bg-yellow-400':
                              monitorInfo.type === 'expiring soon',
                          }
                        )}
                      >
                        {monitorInfo.type === 'success' && <FaArrowUp />}
                        {(monitorInfo.type === 'danger' ||
                          monitorInfo.type === '--' ||
                          monitorInfo.type === 'expired') && <FaArrowDown />}
                        {monitorInfo.type === 'expiring soon' && (
                          <FaExclamationTriangle />
                        )}
                      </button>
                    </th>
                    <td className='max-w-[250px] truncate text-ellipsis whitespace-nowrap px-6 py-4'>
                      {monitor.name}
                    </td>
                    <td
                      className='max-w-[250px] cursor-pointer truncate text-ellipsis whitespace-nowrap px-6 py-4 text-[#1e8dee]'
                      onClick={() => {
                        setSelectedMonitor(monitor);
                        setShowModal(true);
                      }}
                    >
                      {monitor.url}
                    </td>
                    <td className='max-w-[250px] truncate text-ellipsis whitespace-nowrap px-6 py-5'>
                      {monitorInfo.issuer.common_name}
                    </td>
                    <td className='px-6 py-5'>
                      {formatSSLDate(monitorInfo.info.validFrom!)}
                    </td>
                    <td className='px-6 py-4'>
                      {formatSSLDate(monitorInfo.info.validTo!)}
                    </td>
                    <td className='px-6 py-4'>
                      {monitorInfo.info.daysLeft}{' '}
                      {monitorInfo.info.daysLeft !== '--' ? 'days' : ''}
                    </td>
                    <td className='px-6 py-4'>{renderButtons(monitor)}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default SSLTable;
