import { FC, ReactElement } from 'react';

import {
  HomeTableProps,
  IMonitorDocument,
} from '@/interfaces/monitor.interface';
import { convertFrequency, timeFromNow } from '@/utils/utils';
import clsx from 'clsx';
import { upperCase } from 'lodash';
import { FaArrowDown, FaArrowUp, FaCircleNotch, FaPlay } from 'react-icons/fa';

import HealthBar from '@/components/HealthBar';

import HomeTableBtnGroup from './HomeTableBtnGroup';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const DEFAULT_DURATION = 24;

const HomeTable: FC<HomeTableProps> = ({
  monitors,
  limit,
  autoRefreshLoading,
}): ReactElement => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const navigateToStatusPage = (monitor: IMonitorDocument): void => {
    // 24 is the default duration
  };

  return (
    <div className='relative mt-10 overflow-x-auto lg:mt-0'>
      {autoRefreshLoading ? (
        <div className='absolute left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-white/[0.8]'>
          <FaCircleNotch
            className='mr-3 h-10 w-10 animate-spin'
            size={40}
            color='#50b5ff'
          />
        </div>
      ) : (
        <></>
      )}
      <table className='w-full text-left text-sm text-gray-500 rtl:text-right'>
        <thead className='bg-gray-50 text-xs uppercase text-gray-700'>
          <tr>
            <th scope='col' className='px-6 py-3'>
              Status
            </th>
            <th scope='col' className='px-6 py-3'>
              Type
            </th>
            <th scope='col' className='px-6 py-3'>
              Name
            </th>
            <th scope='col' className='w-[15%] px-6 py-3'>
              Uptime
            </th>
            <th scope='col' className='w-[15%] px-6 py-3'>
              Frequency
            </th>
            <th scope='col' className='px-6 py-3'>
              Last Modified
            </th>
            <th scope='col' className='px-6 py-3'>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {monitors
            .slice(limit.start, limit.end)
            .map((monitor: IMonitorDocument, index: number) => (
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
                        'bg-yellow-400': !monitor.active,
                        'bg-green-400': monitor.active && monitor.status === 0,
                        'bg-red-400': monitor.active && monitor.status === 1,
                      }
                    )}
                  >
                    {monitor.active ? (
                      <>
                        {monitor.status === 1 ? <FaArrowDown /> : <FaArrowUp />}
                      </>
                    ) : (
                      <FaPlay />
                    )}
                  </button>
                </th>
                <td className='px-6 py-4'>{upperCase(monitor.type)}</td>
                <td
                  onClick={() => navigateToStatusPage(monitor)}
                  className='max-w-[270px] cursor-pointer truncate text-ellipsis whitespace-nowrap px-6 py-4 font-medium text-[#1e8dee]'
                >
                  {monitor.name}
                </td>
                <td className='flex gap-3 px-6 py-5'>
                  <div className='w-8'>{monitor.uptime}%</div>
                  <HealthBar size='small' heartBeats={monitor.heartbeats!} />
                </td>
                <td className='px-6 py-5'>
                  {convertFrequency(monitor.frequency)}
                </td>
                <td className='max-w-[270px] truncate text-ellipsis whitespace-nowrap px-6 py-4'>
                  {monitor.lastChanged ? (
                    <>{timeFromNow(`${monitor.lastChanged}`)}</>
                  ) : (
                    'None'
                  )}
                </td>
                <td className='px-6 py-4'>
                  <HomeTableBtnGroup monitor={monitor} />
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default HomeTable;
