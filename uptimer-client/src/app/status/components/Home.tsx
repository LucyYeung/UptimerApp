'use client';

import { FC, ReactElement, useState } from 'react';

import { IMonitorState } from '@/interfaces/monitor.interface';

import { renderButtons } from './HomeComponents';

const Home: FC = (): ReactElement => {
  const [monitorState, setMonitorState] = useState<IMonitorState>({
    showModal: false,
    enableRefresh: false,
    autoRefreshLoading: false,
  });

  return (
    <div className='relative m-auto h-screen min-h-screen px-6 xl:container md:px-12 lg:px-6'>
      {renderButtons([], monitorState, setMonitorState)}
    </div>
  );
};

export default Home;
