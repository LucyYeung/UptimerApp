import { IHeartbeat } from '@app/interfaces/heartbeat.interface';
import { HttpModel } from '@app/models/http.model';
import dayjs from 'dayjs';
import { Op } from 'sequelize';

export const createHttpHeartBeat = async (data: IHeartbeat) => {
  try {
    const result = await HttpModel.create(data);
    return result.dataValues;
  } catch (error) {
    throw new Error(error);
  }
};

export const getHttpHeartBeatsByDuration = async (
  monitorId: number,
  duration = 24,
) => {
  try {
    const dateTime = dayjs.utc().toDate();
    dateTime.setHours(dateTime.getHours() - duration);
    const heartbeats = (await HttpModel.findAll({
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
