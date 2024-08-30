import { FC, ReactElement } from 'react';

import { IHeartbeat, IStatusPage } from '@/interfaces/monitor.interface';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';

const StatusTable: FC<IStatusPage> = ({ limit, heartBeats }): ReactElement => {
  const dateFormat = (timestamp: string): string => {
    return dayjs(new Date(JSON.parse(timestamp))).format(
      'YYYY-MM-DD HH:mm:ss A'
    );
  };

  return (
    <div className='relative overflow-x-auto'>
      <table className='w-full text-left text-sm text-gray-500 rtl:text-right'>
        <thead className='bg-gray-50 text-xs uppercase text-gray-700'>
          <tr>
            <th scope='col' className='px-6 py-3'>
              Status
            </th>
            <th scope='col' className='px-6 py-3'>
              Tested
            </th>
            <th scope='col' className='px-6 py-3'>
              Code
            </th>
            <th scope='col' className='px-6 py-3'>
              Time
            </th>
            <th scope='col' className='px-6 py-3'>
              Message
            </th>
          </tr>
        </thead>
        {heartBeats.length ? (
          <tbody>
            {heartBeats
              .slice(limit.start, limit.end)
              .map((heartbeat: IHeartbeat, index: number) => (
                <tr
                  key={heartbeat.id}
                  className={`cursor-pointer ${index % 2 !== 0 ? 'bg-white' : 'bg-[#f8f8fa]'}`}
                >
                  <td
                    scope='row'
                    className='whitespace-nowrap px-6 py-4 font-medium text-gray-900'
                  >
                    <span
                      className={clsx(
                        'mr-1 inline-flex items-center rounded px-4 py-2 text-sm font-bold text-white',
                        {
                          'bg-red-400': heartbeat.status === 1,
                          'bg-green-400': heartbeat.status === 0,
                        }
                      )}
                    >
                      {heartbeat.status === 1 ? <FaArrowDown /> : <FaArrowUp />}
                    </span>
                  </td>
                  <td className='px-6 py-4'>
                    {dateFormat(`${heartbeat.timestamp}`)}
                  </td>
                  <td className='px-6 py-4'>{heartbeat.code}</td>
                  <td className='px-6 py-4'>
                    {heartbeat.responseTime / 1000}s
                  </td>
                  <td className='px-6 py-4'>{heartbeat.message}</td>
                </tr>
              ))}
          </tbody>
        ) : (
          <tbody></tbody>
        )}
      </table>
      {!heartBeats.length && (
        <div className='p-4 text-center'>No heartbeat data available.</div>
      )}
    </div>
  );
};

export default StatusTable;
