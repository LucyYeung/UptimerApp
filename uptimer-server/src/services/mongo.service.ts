import { IHeartbeat } from '@app/interfaces/heartbeat.interface';
import { IMonitorDocument } from '@app/interfaces/monitor.interface';
import { MongoModel } from '@app/models/mongo.model';
import { mongoMonitor } from '@app/monitors/mongo.monitor';
import { startSingleJob } from '@app/utils/jobs';
import { appTimeZone } from '@app/utils/utils';
import dayjs from 'dayjs';
import { Op } from 'sequelize';

export const createMongoHeartBeat = async (data: IHeartbeat) => {
  try {
    const result = await MongoModel.create(data);
    return result.dataValues;
  } catch (error) {
    throw new Error(error);
  }
};

export const getMongoHeartBeatsByDuration = async (
  monitorId: number,
  duration = 24,
) => {
  try {
    const dateTime = dayjs.utc().toDate();
    dateTime.setHours(dateTime.getHours() - duration);
    const heartbeats = (await MongoModel.findAll({
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

export const mongoStatusMonitor = (monitor: IMonitorDocument, name: string) => {
  const mongoMonitorData = {
    monitorId: monitor.id,
    url: monitor.url,
  } as IMonitorDocument;

  startSingleJob(name, appTimeZone, monitor.frequency, async () =>
    mongoMonitor.start(mongoMonitorData),
  );
};
