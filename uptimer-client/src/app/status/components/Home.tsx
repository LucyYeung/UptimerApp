'use client';

import { FC, ReactElement } from 'react';

import MonitorSelectionModal from '@/components/MonitorSelectionModal';

import { useHome } from '../hooks/useHome';
import {
  renderButtons,
  renderCreateButton,
  renderRefreshButtons,
  renderTableAndPagination,
} from './HomeComponents';
import HomeSkeleton from './HomeSkeleton';

const Home: FC = (): ReactElement => {
  const {
    monitorState,
    monitors,
    limit,
    isRefreshed,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    autoMonitorsRef,
    monitorsRef,
    openModal,
    view,
    loading,
    setView,
    setMonitors,
    updateLimit,
    setMonitorState,
    refreshMonitors,
    enableAutoRefresh,
    closeUptimeModal,
  } = useHome();

  return (
    <>
      {(monitorState.showModal || openModal) && (
        <MonitorSelectionModal
          onClose={() => {
            setMonitorState({ ...monitorState, showModal: false });
            closeUptimeModal();
          }}
        />
      )}
      <div className='relative m-auto h-screen min-h-screen px-6 xl:container md:px-12 lg:px-6'>
        {loading && <HomeSkeleton />}
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
          <>
            {!loading &&
              !monitors.length &&
              renderCreateButton(monitorState, setMonitorState)}
          </>
        )}
      </div>
    </>
  );
};

export default Home;
