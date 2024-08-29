import { FC, ReactElement, ReactNode } from 'react';

import {
  HomeTableProps,
  IMonitorDocument,
} from '@/interfaces/monitor.interface';
import clsx from 'clsx';
import { FaArrowDown, FaArrowUp, FaCircleNotch, FaPlay } from 'react-icons/fa';

import Button from '@/components/Button';
import ResponseChart from '@/components/ResponseChart';

import HomeTableBtnGroup from './HomeTableBtnGroup';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const DEFAULT_DURATION = 24;

const HomeGrid: FC<HomeTableProps> = ({
  monitors,
  limit,
  autoRefreshLoading,
}): ReactElement => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const navigateToStatusPage = (monitor: IMonitorDocument): void => {};

  const monitorIcon = (monitor: IMonitorDocument): JSX.Element => {
    if (monitor.active && monitor.status === 0) {
      return <FaArrowUp />;
    }
    if (!monitor.active) {
      return <FaPlay />;
    }
    return <FaArrowDown />;
  };

  return (
    <div className='grid gap-6 pt-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
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
      {monitors
        .slice(limit.start, limit.end)
        .map((monitor: IMonitorDocument, index: number) => (
          <div key={index} className='h-auto rounded border-2 border-blue-400'>
            <div className='flex flex-col px-4 py-4'>
              <div
                className='cursor-pointer font-bold text-blue-400'
                onClick={() => navigateToStatusPage(monitor)}
              >
                {monitor.name}
              </div>
              <div className='w-fulls mt-3'>
                <span className='mb-2 text-sm font-bold'>
                  Response Times (ms)
                </span>
                <ResponseChart
                  heartBeats={monitor.heartbeats!}
                  showLabel={false}
                />
              </div>
              <div className='mt-3'>
                <Feature title='Status'>
                  <Button
                    icon={monitorIcon(monitor)}
                    type='button'
                    className={clsx(
                      'inline-flex items-center rounded px-2 py-2 text-sm font-bold text-white',
                      {
                        'bg-green-400': monitor.active && monitor.status === 0,
                        'bg-yellow-400': !monitor.active,
                        'bg-red-400': monitor.active && monitor.status === 1,
                      }
                    )}
                  />
                </Feature>
                <Feature title='1 day uptime'>
                  <span>{monitor.uptime}%</span>
                </Feature>
                <Feature title='Actions'>
                  <HomeTableBtnGroup monitor={monitor} />
                </Feature>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

const Feature = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}): ReactElement => {
  return (
    <div className='my-6 flex justify-between'>
      <span className='text-base font-bold'>{title}</span>
      {children}
    </div>
  );
};

export default HomeGrid;
