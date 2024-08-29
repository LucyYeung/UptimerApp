'use client';

import { FC, ReactElement } from 'react';

import { useHome } from '../hooks/useHome';
import {
  renderButtons,
  renderRefreshButtons,
  renderTableAndPagination,
} from './HomeComponents';

const Home: FC = (): ReactElement => {
  const {
    monitorState,
    monitors,
    limit,
    isRefreshed,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    autoMonitorsRef,
    monitorsRef,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    openModal,
    view,
    loading,
    setView,
    setMonitors,
    updateLimit,
    setMonitorState,
    refreshMonitors,
    enableAutoRefresh,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    closeUptimeModal,
  } = useHome();

  return (
    <div className='relative m-auto h-screen min-h-screen px-6 xl:container md:px-12 lg:px-6'>
      {!loading && monitors.length > 0 ? (
        <>
          {renderButtons(monitors, monitorState, setMonitorState)}
          {renderRefreshButtons(
            view,
            isRefreshed!,
            monitorsRef.current,
            monitors,
            setView,
            setMonitors,
            () => refreshMonitors(),
            () => enableAutoRefresh()
          )}
          {renderTableAndPagination(
            view,
            limit,
            monitorState.autoRefreshLoading,
            monitors,
            updateLimit
          )}
        </>
      ) : (
        <>{!loading && !monitors.length && <>New Uptime Test</>}</>
      )}
    </div>
  );
};

export default Home;
