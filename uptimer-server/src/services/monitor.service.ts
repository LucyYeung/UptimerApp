import { IHeartbeat } from '@app/interfaces/heartbeat.interface';
import { IMonitorDocument } from '@app/interfaces/monitor.interface';
import { HttpModel } from '@app/models/http.model';
import { MongoModel } from '@app/models/mongo.model';
import { MonitorModel } from '@app/models/monitor.model';
import { RedisModel } from '@app/models/redis.model';
import { TcpModel } from '@app/models/tcp.model';
import { uptimePercentage } from '@app/utils/utils';
import dayjs from 'dayjs';
import { toLower } from 'lodash';

import { getHttpHeartBeatsByDuration, httpStatusMonitor } from './http.service';
import {
  getMongoHeartBeatsByDuration,
  mongoStatusMonitor,
} from './mongo.service';
import { getSingleNotificationGroup } from './notification.service';
import {
  getRedisHeartBeatsByDuration,
  redisStatusMonitor,
} from './redis.service';
import { getTcpHeartBeatsByDuration, tcpStatusMonitor } from './tcp.service';

const HTTP_TYPE = 'http';
const TCP_TYPE = 'tcp';
const MONGO_TYPE = 'mongodb';
const REDIS_TYPE = 'redis';

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
      raw: true,
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
    let heartbeats: IHeartbeat[] = [];
    const updatedMonitors: IMonitorDocument[] = [];
    const monitors = await getUserMonitors(userId, true);
    for (let monitor of monitors) {
      const group = await getSingleNotificationGroup(monitor.notificationId!);
      heartbeats = await getHeartBeats(monitor.type, monitor.id!, 24);
      const uptime = uptimePercentage(heartbeats);

      monitor = {
        ...monitor,
        uptime,
        heartbeats: heartbeats.slice(0, 16),
        notifications: group,
      };
      updatedMonitors.push(monitor);
    }
    return updatedMonitors;
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * Get active monitors for all users
 * @returns {Promise<IMonitorDocument[]>}
 */
export const getAllUsersActiveMonitors = async () => {
  try {
    const monitors = (await MonitorModel.findAll({
      raw: true,
      where: { active: true },
      order: [['createdAt', 'DESC']],
    })) as unknown as IMonitorDocument[];
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
      raw: true,
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
    const updatedMonitor = { ...monitor };
    const isSuccess = type === 'success';
    updatedMonitor.status = isSuccess ? 0 : 1;
    if (isSuccess && status === 1) {
      updatedMonitor.lastChanged = now;
    }
    if (!isSuccess && status === 0) {
      updatedMonitor.lastChanged = now;
    }
    await MonitorModel.update(updatedMonitor, { where: { id } });
    return updatedMonitor;
  } catch (error) {
    throw new Error(error);
  }
};

export const startCreateMonitor = (
  monitor: IMonitorDocument,
  name: string,
  type: string,
) => {
  if (type === HTTP_TYPE) {
    httpStatusMonitor(monitor, toLower(name));
  }
  if (type === TCP_TYPE) {
    tcpStatusMonitor(monitor, toLower(name));
  }
  if (type === MONGO_TYPE) {
    mongoStatusMonitor(monitor, toLower(name));
  }
  if (type === REDIS_TYPE) {
    redisStatusMonitor(monitor, toLower(name));
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

export const getHeartBeats = async (
  type: string,
  monitorId: number,
  duration: number,
) => {
  let heartbeats: IHeartbeat[] = [];
  if (type === HTTP_TYPE) {
    heartbeats = await getHttpHeartBeatsByDuration(monitorId, duration);
  }
  if (type === TCP_TYPE) {
    heartbeats = await getTcpHeartBeatsByDuration(monitorId, duration);
  }
  if (type === MONGO_TYPE) {
    heartbeats = await getMongoHeartBeatsByDuration(monitorId, duration);
  }
  if (type === REDIS_TYPE) {
    heartbeats = await getRedisHeartBeatsByDuration(monitorId, duration);
  }
  return heartbeats;
};

export const deleteMonitorTypeHeartbeats = async (
  monitorId: number,
  type: string,
) => {
  let model = null;
  if (type === HTTP_TYPE) {
    model = HttpModel;
  }
  if (type === MONGO_TYPE) {
    model = MongoModel;
  }
  if (type === REDIS_TYPE) {
    model = RedisModel;
  }
  if (type === TCP_TYPE) {
    model = TcpModel;
  }

  if (model !== null) {
    await model.destroy({ where: { monitorId } });
  }
};
