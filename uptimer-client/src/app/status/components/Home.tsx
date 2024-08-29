'use client';

import { FC, ReactElement, useState } from 'react';

import { IMonitorState } from '@/interfaces/monitor.interface';

import {
  renderButtons,
  renderRefreshButtons,
  renderTableAndPagination,
} from './HomeComponents';

const Home: FC = (): ReactElement => {
  const [monitorState, setMonitorState] = useState<IMonitorState>({
    showModal: false,
    enableRefresh: false,
    autoRefreshLoading: false,
  });

  return (
    <div className='relative m-auto h-screen min-h-screen px-6 xl:container md:px-12 lg:px-6'>
      {renderButtons([], monitorState, setMonitorState)}
      {renderRefreshButtons('box', true)}
      {renderTableAndPagination(
        'box',
        { start: 0, end: 10 },
        monitorState.autoRefreshLoading,
        []
      )}
    </div>
  );
};

export default Home;
