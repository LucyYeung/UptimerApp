import { FC, ReactElement } from 'react';

import { IMonitorDocument } from '@/interfaces/monitor.interface';
import { FaArrowDown, FaArrowUp, FaPlay } from 'react-icons/fa';

import Button from '@/components/Button';

interface IHomeButtonGroupProps {
  monitors: IMonitorDocument[];
}

const HomeButtonGroup: FC<IHomeButtonGroupProps> = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  monitors,
}): ReactElement => {
  return (
    <div className='inline-flex' role='group'>
      <Button
        label={1}
        icon={<FaArrowUp className='mr-1' />}
        type='button'
        className='mr-1 inline-flex items-center rounded bg-green-400 px-4 py-2 text-sm font-bold text-white'
      />
      <Button
        label={1}
        icon={<FaArrowDown className='mr-1' />}
        type='button'
        className='mr-1 inline-flex items-center rounded bg-red-400 px-4 py-2 text-sm font-bold text-white'
      />
      <Button
        label={1}
        icon={<FaPlay className='mr-1' />}
        type='button'
        className='mr-1 inline-flex items-center rounded bg-yellow-400 px-4 py-2 text-sm font-bold text-white'
      />
    </div>
  );
};

export default HomeButtonGroup;
