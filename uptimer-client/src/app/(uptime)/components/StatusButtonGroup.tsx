import { FC, ReactElement } from 'react';

import { IStatusPageButtonGroup } from '@/interfaces/monitor.interface';
import clsx from 'clsx';
import { FaPause, FaPencilAlt, FaPlay, FaTrashAlt } from 'react-icons/fa';

import Button from '@/components/Button';

const StatusButtonGroup: FC<IStatusPageButtonGroup> = ({
  monitor,
  toggleUserMonitor,
  editMonitor,
  deleteUserMonitor,
}): ReactElement => {
  return (
    <>
      {monitor && (
        <div className='inline-flex shadow-sm' role='group'>
          <Button
            type='button'
            label='Edit'
            onClick={editMonitor}
            icon={<FaPencilAlt />}
            className='hover:bg-green-40 mr-1 inline-flex items-center justify-center gap-2 rounded border border-green-400 bg-green-400 px-4 py-2 text-sm font-bold text-white hover:text-white'
          />
          <Button
            type='button'
            onClick={toggleUserMonitor}
            label={monitor.active ? 'Pause' : 'Resume'}
            icon={monitor.active ? <FaPause /> : <FaPlay />}
            className={clsx(
              'mr-1 inline-flex w-44 items-center justify-center gap-2 rounded border px-4 py-2 text-sm font-bold text-white hover:text-white',
              {
                'border-green-400 bg-green-400 hover:bg-green-400':
                  monitor.active,
                'border-yellow-400 bg-yellow-400 hover:bg-yellow-400':
                  !monitor.active,
              }
            )}
          />
          <Button
            type='button'
            onClick={deleteUserMonitor}
            label='Delete'
            icon={<FaTrashAlt />}
            className='mr-1 inline-flex items-center justify-center gap-2 rounded bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-400 hover:text-white'
          />
        </div>
      )}
    </>
  );
};

export default StatusButtonGroup;
