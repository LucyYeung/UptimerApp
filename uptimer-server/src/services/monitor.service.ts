import { IMonitorDocument } from '@app/interfaces/monitor.interface';
import { MonitorModel } from '@app/models/monitor.model';
import dayjs from 'dayjs';

import { getSingleNotificationGroup } from './notification.service';

/**
 * Create a new monitor
 * @param {IMonitorDocument} data
 * @returns {Promise<IMonitorDocument>}
 */
export const createMonitor = async (data: IMonitorDocument) => {
  try {
    const result = await MonitorModel.create(data);
    return result.dataValues;
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * Get either all monitors (active or inactive) or just active for a user
 * @param {number} userId
 * @param {boolean} active
 * @returns {Promise<IMonitorDocument[]>}
 */
export const getUserMonitors = async (userId: number, active?: boolean) => {
  try {
    const monitors = (await MonitorModel.findAll({
      where: {
        userId,
        ...(active && { active }),
      },
      order: [['createdAt', 'DESC']],
    })) as unknown as IMonitorDocument[];
    return monitors;
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * Get all active monitors for a user
 * @param {number} userId
 * @returns {Promise<IMonitorDocument[]>}
 */
export const getUserActiveMonitors = async (userId: number) => {
  try {
    const monitors = await getUserMonitors(userId, true);
    return monitors;
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * Get active monitors for all users
 * @returns {Promise<IMonitorDocument[]>}
 */
export const getAllUserMonitors = async () => {
  try {
    const monitors = await MonitorModel.findAll({
      where: { active: true },
      order: [['createdAt', 'DESC']],
    });
    return monitors;
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * Get monitor by id
 * @param {number} monitorId
 * @returns {Promise<IMonitorDocument>}
 */
export const getMonitorById = async (monitorId: number) => {
  try {
    const monitor = (await MonitorModel.findOne({
      where: { id: monitorId },
    })) as unknown as IMonitorDocument;

    let updatedMonitor = { ...monitor };
    const notifications = await getSingleNotificationGroup(
      updatedMonitor.notificationId!,
    );
    updatedMonitor = { ...updatedMonitor, notifications };
    return updatedMonitor;
  } catch (error) {
    throw new Error(error);
  }
};

export const toggleMonitor = async (
  monitorId: number,
  userId: number,
  active: boolean,
) => {
  try {
    await MonitorModel.update({ active }, { where: { id: monitorId, userId } });
    const result = await getUserMonitors(userId);
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

export const updateSingleMonitor = async (
  monitorId: number,
  userId: number,
  data: IMonitorDocument,
) => {
  try {
    await MonitorModel.update(data, { where: { id: monitorId } });
    const result = await getUserMonitors(userId);
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

export const updateMonitorStatus = async (
  monitor: IMonitorDocument,
  timestamp: number,
  type: string,
): Promise<IMonitorDocument> => {
  try {
    const now = (timestamp ? dayjs(timestamp) : dayjs()).toDate();
    const { id, status } = monitor;
    const isSuccess = type === 'success';
    if (isSuccess && status === 1) {
    }
    if (!isSuccess && status === 0) {
      throw new Error('Monitor was already down');
    }
    const updatedMonitor = {
      ...monitor,
      status: isSuccess ? 0 : 1,
      ...(((isSuccess && status === 1) || (!isSuccess && status === 0)) && {
        lastChanged: now,
      }),
    };
    await MonitorModel.update(updatedMonitor, { where: { id } });
    return updatedMonitor;
  } catch (error) {
    throw new Error(error);
  }
};

export const deleteSingleMonitor = async (
  monitorId: number,
  userId: number,
  type: string,
) => {
  try {
    await deleteMonitorTypeHeartbeats(monitorId, type);

    await MonitorModel.destroy({ where: { id: monitorId } });
    const result = await getUserMonitors(userId);
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

export const deleteMonitorTypeHeartbeats = async (
  monitorId: number,
  type: string,
) => {
  // TODO: delete monitor heartbeats
  console.log(monitorId, type);
};
