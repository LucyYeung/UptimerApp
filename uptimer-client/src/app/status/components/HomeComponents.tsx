import { Dispatch, SetStateAction } from 'react';

import {
  IMonitorDocument,
  IMonitorState,
} from '@/interfaces/monitor.interface';

import Button from '@/components/Button';

import HomeButtonGroup from './HomeButtonGroup';

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
