import { Dispatch, SetStateAction } from 'react';

import {
  IMonitorDocument,
  IMonitorState,
  IPagination,
} from '@/interfaces/monitor.interface';
import clsx from 'clsx';
import { FaBorderAll, FaPause, FaPlay } from 'react-icons/fa';

import Button from '@/components/Button';
import TextInput from '@/components/TextInput';

import HomeButtonGroup from './HomeButtonGroup';
import HomeGrid from './HomeGrid';
import HomeTable from './HomeTable';

export const renderButtons = (
  monitors: IMonitorDocument[],
  monitorState: IMonitorState,
  setMonitorState: Dispatch<SetStateAction<IMonitorState>>
): JSX.Element => {
  return (
    <div className='mb-4 mt-2 flex h-20 flex-col gap-y-3 md:mb-0 md:mt-0 md:flex-row md:items-center md:justify-between'>
      <HomeButtonGroup monitors={monitors} />
      <Button
        label='New Uptime Test'
        className='inline-flex rounded bg-green-400 px-4 py-2 text-base font-medium text-white md:items-center'
        onClick={() => setMonitorState({ ...monitorState, showModal: true })}
      />
    </div>
  );
};

export const renderRefreshButtons = (
  view: string,
  isRefreshed: boolean
): JSX.Element => {
  return (
    <div className='flex h-44 flex-col items-start justify-start lg:h-20 lg:flex-row lg:items-center lg:justify-between'>
      <Button
        label='Refresh'
        className={clsx(
          'mb-3 inline-flex cursor-pointer items-center rounded px-4 py-2 text-base font-medium text-white lg:mb-0',
          {
            'pointer-events-none cursor-none bg-green-200': isRefreshed,
            'bg-green-400': !isRefreshed,
          }
        )}
      />
      <div className='flex flex-col justify-start gap-3 lg:w-full lg:flex-row lg:justify-end'>
        <div className='flex min-w-52 cursor-pointer items-center gap-2 rounded bg-[#9DFFE4] px-2'>
          <FaBorderAll />
          <Button
            label={view === 'box' ? 'List View' : 'Box View'}
            className='px-4 py-2 text-base font-bold lg:p-0'
          />
        </div>
        <div className='flex min-w-52 cursor-pointer items-center gap-2 rounded bg-[#9DFFE4] px-2'>
          {!isRefreshed ? <FaPlay /> : <FaPause />}
          <Button
            label={
              !isRefreshed ? 'Enable Auto Refresh' : 'Disable Auto Refresh'
            }
            className='px-4 py-2 text-base font-bold lg:p-0'
          />
        </div>
        <div className='w-full lg:w-[30%]'>
          <TextInput
            type='text'
            name='search'
            className='block w-full rounded-lg border border-black p-2.5 text-sm text-gray-900 focus:border-[#1e8dee] focus:ring-[#1e8dee]'
            placeholder='Search by name'
          />
        </div>
      </div>
    </div>
  );
};

export const renderTableAndPagination = (
  view: string,
  limit: IPagination,
  autoRefreshLoading: boolean,
  monitors: IMonitorDocument[]
): JSX.Element => {
  return (
    <div className='my-4'>
      {view === 'box' ? (
        <HomeTable
          monitors={monitors}
          limit={limit}
          autoRefreshLoading={autoRefreshLoading}
        />
      ) : (
        <HomeGrid
          monitors={monitors}
          limit={limit}
          autoRefreshLoading={autoRefreshLoading}
        />
      )}
    </div>
  );
};
