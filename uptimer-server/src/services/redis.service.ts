import { IHeartbeat } from '@app/interfaces/heartbeat.interface';
import { IMonitorDocument } from '@app/interfaces/monitor.interface';
import { RedisModel } from '@app/models/redis.model';
import { redisMonitor } from '@app/monitors/redis.monitor';
import { startSingleJob } from '@app/utils/jobs';
import { appTimeZone } from '@app/utils/utils';
import dayjs from 'dayjs';
import { Op } from 'sequelize';

export const createRedisHeartBeat = async (data: IHeartbeat) => {
  try {
    const result = await RedisModel.create(data);
    return result.dataValues;
  } catch (error) {
    throw new Error(error);
  }
};

export const getRedisHeartBeatsByDuration = async (
  monitorId: number,
  duration = 24,
) => {
  try {
    const dateTime = dayjs.utc().toDate();
    dateTime.setHours(dateTime.getHours() - duration);
    const heartbeats = (await RedisModel.findAll({
      raw: true,
      where: {
        monitorId,
        timestamp: {
          [Op.gte]: dateTime,
        },
      },
      order: [['timestamp', 'DESC']],
    })) as unknown as IHeartbeat[];

    return heartbeats;
  } catch (error) {
    throw new Error(error);
  }
};

export const redisStatusMonitor = (monitor: IMonitorDocument, name: string) => {
  const redisMonitorData = {
    monitorId: monitor.id,
    url: monitor.url,
  } as IMonitorDocument;

  startSingleJob(name, appTimeZone, monitor.frequency, async () =>
    redisMonitor.start(redisMonitorData),
  );
};
