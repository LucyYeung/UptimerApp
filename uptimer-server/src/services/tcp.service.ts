import { IHeartbeat } from '@app/interfaces/heartbeat.interface';
import { IMonitorDocument } from '@app/interfaces/monitor.interface';
import { TcpModel } from '@app/models/tcp.model';
import { tcpMonitor } from '@app/monitors/tcp.monitor';
import { startSingleJob } from '@app/utils/jobs';
import { appTimeZone } from '@app/utils/utils';
import dayjs from 'dayjs';
import { Op } from 'sequelize';

export const createTcpHeartBeat = async (data: IHeartbeat) => {
  try {
    const result = await TcpModel.create(data);
    return result.dataValues;
  } catch (error) {
    throw new Error(error);
  }
};

export const getTcpHeartBeatsByDuration = async (
  monitorId: number,
  duration = 24,
) => {
  try {
    const dateTime = dayjs.utc().toDate();
    dateTime.setHours(dateTime.getHours() - duration);
    const heartbeats = (await TcpModel.findAll({
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

export const tcpStatusMonitor = (monitor: IMonitorDocument, name: string) => {
  const tcpMonitorData = {
    monitorId: monitor.id,
    url: monitor.url,
    port: monitor.port,
    timeout: monitor.timeout,
  } as IMonitorDocument;

  startSingleJob(name, appTimeZone, monitor.frequency, async () =>
    tcpMonitor.start(tcpMonitorData),
  );
};
