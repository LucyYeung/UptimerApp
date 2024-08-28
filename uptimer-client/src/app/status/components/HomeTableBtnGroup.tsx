import React, { FC, ReactElement } from 'react';

import { IMonitorDocument } from '@/interfaces/monitor.interface';
import { FaPause, FaPencilAlt, FaPlay, FaTrashAlt } from 'react-icons/fa';

import Button from '@/components/Button';

interface IHomeTableBtnGroupProps {
  monitor: IMonitorDocument;
}

const HomeTableBtnGroup: FC<IHomeTableBtnGroupProps> = ({
  monitor,
}): ReactElement => {
  return (
    <div className='inline-flex shadow-sm' role='group'>
      <Button
        icon={monitor.active ? <FaPause /> : <FaPlay />}
        type='button'
        className='mr-1 inline-flex items-center rounded border border-[#1e8dee] px-4 py-2 text-sm font-bold text-[#1e8dee] hover:bg-[#1e8dee] hover:text-white'
      />
      <Button
        icon={<FaPencilAlt />}
        type='button'
        className='mr-1 inline-flex items-center rounded border border-[#1e8dee] px-4 py-2 text-sm font-bold text-[#1e8dee] hover:bg-[#1e8dee] hover:text-white'
      />
      <Button
        icon={<FaTrashAlt />}
        type='button'
        className='mr-1 inline-flex items-center rounded bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-400 hover:text-white'
      />
    </div>
  );
};

export default HomeTableBtnGroup;
