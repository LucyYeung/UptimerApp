import { useContext, useEffect, useRef, useState } from 'react';

import { useRouter, useSearchParams } from 'next/navigation';

import { MonitorContext } from '@/context/MonitorContext';
import {
  IMonitorDocument,
  IMonitorState,
  IPagination,
  IUseHome,
} from '@/interfaces/monitor.interface';
import {
  ENABLE_AUTO_REFRESH,
  GET_USER_MONITORS,
  MONITORS_UPDATED,
} from '@/queries/status';
import {
  getLocalStorageItem,
  setLocalStorageItem,
  showErrorToast,
} from '@/utils/utils';
import { useLazyQuery, useQuery, useSubscription } from '@apollo/client';
import { some } from 'lodash';

export const useHome = (): IUseHome => {
  const {
    state: { user },
  } = useContext(MonitorContext);
  const [monitors, setMonitors] = useState<IMonitorDocument[]>([]);
  const [monitorState, setMonitorState] = useState<IMonitorState>({
    showModal: false,
    enableRefresh: false,
    autoRefreshLoading: false,
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());

  const [view, setView] = useState<string>('');
  const monitorsRef = useRef<IMonitorDocument[]>([]);
  const autoMonitorsRef = useRef<IMonitorDocument[]>([]);

  const { data, loading } = useQuery(GET_USER_MONITORS, {
    fetchPolicy: 'network-only',
    variables: {
      userId: `${user?.id}`,
    },
  });
  const [getUserMonitors] = useLazyQuery(GET_USER_MONITORS, {
    fetchPolicy: 'network-only',
    variables: {
      userId: `${user?.id}`,
    },
  });

  const [autoRefresh, { data: refreshData }] = useLazyQuery(
    ENABLE_AUTO_REFRESH,
    {
      fetchPolicy: 'network-only',
    }
  );

  useSubscription(MONITORS_UPDATED, {
    onData: ({ client, data }) => {
      const { userId, monitors } = data.data.monitorsUpdated;
      if (userId === user?.id) {
        setMonitorState((prevState: IMonitorState) => ({
          ...prevState,
          autoRefreshLoading: true,
        }));
        autoMonitorsRef.current = monitors;
        client.cache.updateQuery(
          {
            query: GET_USER_MONITORS,
          },
          () => {
            return {
              getUserMonitors: {
                __typename: 'MonitorResponse',
                monitors,
              },
            };
          }
        );
      } else {
        setMonitorState((prevState: IMonitorState) => ({
          ...prevState,
          autoRefreshLoading: false,
        }));
      }
    },
  });

  const storageViewItem: string = getLocalStorageItem('view');
  const isRefreshed: boolean = JSON.parse(getLocalStorageItem('refresh'));
  const openModal: boolean = JSON.parse(`${params.get('open')}`);

  const hasActiveMonitors: boolean = some(monitors, { active: true });

  const refreshMonitors = async () => {
    if (hasActiveMonitors) {
      setMonitorState((prevState: IMonitorState) => ({
        ...prevState,
        autoRefreshLoading: true,
      }));
      const result = await getUserMonitors();
      if (result) {
        monitorsRef.current = result.data.getUserMonitors.monitors;
        setMonitors(result.data.getUserMonitors.monitors);
        setMonitorState((prevState: IMonitorState) => ({
          ...prevState,
          autoRefreshLoading: false,
        }));
      }
    } else {
      showErrorToast('There are no active monitors to refresh.');
    }
  };

  const enableAutoRefresh = async () => {
    try {
      if (hasActiveMonitors) {
        await autoRefresh({
          variables: {
            userId: `${user?.id}`,
            refresh: !isRefreshed,
          },
        });
        setMonitorState((prevState: IMonitorState) => ({
          ...prevState,
          enableRefresh: !isRefreshed,
        }));
        setLocalStorageItem('refresh', JSON.stringify(!isRefreshed));
      } else {
        showErrorToast('There are no active monitors to refresh.');
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      showErrorToast('Error enabling auto refresh.');
    }
  };

  const closeUptimeModal = () => {
    params.delete('open');
    router.push(`status?${params}`);
  };

  useEffect(() => {
    if (!storageViewItem) {
      setLocalStorageItem('view', JSON.stringify('box'));
    }

    if (isRefreshed === null) {
      setLocalStorageItem('refresh', JSON.stringify(false));
      setMonitorState((prevState: IMonitorState) => ({
        ...prevState,
        enableRefresh: false,
      }));
    } else {
      setMonitorState((prevState: IMonitorState) => ({
        ...prevState,
        enableRefresh: isRefreshed,
      }));
    }

    setView(storageViewItem || 'box');
  }, [storageViewItem, setView, setMonitorState, isRefreshed]);

  useEffect(() => {
    if (data?.getUserMonitors) {
      monitorsRef.current = data.getUserMonitors.monitors;
      setMonitors(data.getUserMonitors.monitors);
    }

    if (refreshData?.autoRefresh) {
      setLocalStorageItem(
        'refresh',
        JSON.stringify(refreshData.autoRefresh.refresh)
      );
      setMonitorState((prevState: IMonitorState) => ({
        ...prevState,
        enableRefresh: refreshData.autoRefresh.refresh,
      }));
    }

    if (autoMonitorsRef.current.length > 0) {
      autoMonitorsRef.current = [];
      setMonitorState((prevState: IMonitorState) => ({
        ...prevState,
        autoRefreshLoading: true,
      }));
    } else {
      setTimeout(() => {
        setMonitorState((prevState: IMonitorState) => ({
          ...prevState,
          autoRefreshLoading: false,
        }));
      }, 1000);
    }
  }, [
    data,
    refreshData,
    setMonitors,
    setMonitorState,
    autoMonitorsRef.current,
  ]);

  return {
    monitorState,
    monitors,
    limit: { start: 0, end: 10 },
    isRefreshed,
    autoMonitorsRef,
    monitorsRef,
    openModal,
    view,
    loading,
    setView,
    setMonitors,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    updateLimit: (newLimit: IPagination) => {},
    setMonitorState,
    refreshMonitors,
    enableAutoRefresh,
    closeUptimeModal,
  };
};
