import { FC, ReactElement } from 'react';

import { IMonitorDocument } from '@/interfaces/monitor.interface';
import { filter } from 'lodash';
import { FaArrowDown, FaArrowUp, FaPlay } from 'react-icons/fa';

import Button from '@/components/Button';

interface IHomeButtonGroupProps {
  monitors: IMonitorDocument[];
}

const HomeButtonGroup: FC<IHomeButtonGroupProps> = ({
  monitors,
}): ReactElement => {
  const count = (type: string) => {
    let sum = 0;
    if (type === 'active') {
      sum = filter(monitors, { active: true, status: 0 }).length;
    }
    if (type === 'inactive') {
      sum = filter(monitors, { active: false }).length;
    }
    if (type === 'error') {
      sum = filter(monitors, { active: true, status: 1 }).length;
    }
    return sum;
  };

  return (
    <div className='inline-flex' role='group'>
      <Button
        label={count('active')}
        icon={<FaArrowUp className='mr-1' />}
        type='button'
        className='mr-1 inline-flex items-center rounded bg-green-400 px-4 py-2 text-sm font-bold text-white'
      />
      <Button
        label={count('error')}
        icon={<FaArrowDown className='mr-1' />}
        type='button'
        className='mr-1 inline-flex items-center rounded bg-red-400 px-4 py-2 text-sm font-bold text-white'
      />
      <Button
        label={count('inactive')}
        icon={<FaPlay className='mr-1' />}
        type='button'
        className='mr-1 inline-flex items-center rounded bg-yellow-400 px-4 py-2 text-sm font-bold text-white'
      />
    </div>
  );
};

export default HomeButtonGroup;
