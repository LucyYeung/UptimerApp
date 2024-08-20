import { IHeartbeat } from '@app/interfaces/heartbeat.interface';
import {
  IMonitorDocument,
  IMonitorResponse,
} from '@app/interfaces/monitor.interface';
import logger from '@app/server/logger';
import {
  getMonitorById,
  updateMonitorStatus,
} from '@app/services/monitor.service';
import { createTcpHeartBeat } from '@app/services/tcp.service';
import dayjs from 'dayjs';

import { tcpPing } from './monitors';

class TcpMonitor {
  errorCount: number;
  noSuccessAlert: boolean;

  constructor() {
    this.errorCount = 0;
    this.noSuccessAlert = true;
  }

  async start(data: IMonitorDocument) {
    const { monitorId, url, port, timeout } = data;

    try {
      const monitorData = await getMonitorById(monitorId!);
      const response = await tcpPing(url!, port!, timeout!);
      this.assertionCheck(response, monitorData);
    } catch (error) {
      const monitorData = await getMonitorById(monitorId!);
      this.tcpError(monitorData, error);
    }
  }

  async assertionCheck(
    response: IMonitorResponse,
    monitorData: IMonitorDocument,
  ) {
    const timestamp = dayjs.utc().valueOf();
    let heartbeatData: IHeartbeat = {
      monitorId: monitorData.id!,
      status: 0,
      code: response.code,
      message: response.message,
      timestamp,
      responseTime: response.responseTime,
      connection: response.status,
    };
    const respTime = JSON.parse(monitorData.responseTime!);
    if (
      monitorData.connection !== response.status ||
      respTime < response.responseTime
    ) {
      this.errorCount += 1;
      heartbeatData = {
        ...heartbeatData,
        status: 1,
        message: 'Failed tcp response assertion',
        code: 500,
      };
      await Promise.all([
        updateMonitorStatus(monitorData, timestamp, 'failure'),
        createTcpHeartBeat(heartbeatData),
      ]);
      logger.info(
        `TCP heartbeat failed assertions: Monitor ID: ${monitorData.id}`,
      );
      if (
        monitorData.alertThreshold > 0 &&
        this.errorCount > monitorData.alertThreshold
      ) {
        this.errorCount = 0;
        this.noSuccessAlert = false;
        // TODO: send error email
      }
    } else {
      await Promise.all([
        updateMonitorStatus(monitorData, timestamp, 'success'),
        createTcpHeartBeat(heartbeatData),
      ]);
      logger.info(`TCP heartbeat success: Monitor ID: ${monitorData.id}`);
      if (!this.noSuccessAlert) {
        this.errorCount = 0;
        this.noSuccessAlert = true;
        // TODO: send success email
      }
    }
  }

  async tcpError(monitorData: IMonitorDocument, error: IMonitorResponse) {
    this.errorCount += 1;
    const timestamp = dayjs.utc().valueOf();
    const heartbeatData = {
      monitorId: monitorData.id!,
      status: 1,
      code: error.code,
      message: error.message ? error.message : 'Tcp heartbeat failed',
      timestamp,
      responseTime: error.responseTime,
      connection: error.status,
    };

    await Promise.all([
      updateMonitorStatus(monitorData, timestamp, 'failure'),
      createTcpHeartBeat(heartbeatData),
    ]);
    logger.info(`TCP heartbeat failed: Monitor ID: ${monitorData.id}`);

    if (
      monitorData.alertThreshold > 0 &&
      this.errorCount > monitorData.alertThreshold
    ) {
      this.errorCount = 0;
      this.noSuccessAlert = false;
      // TODO: send error email
    }
  }
}

export const tcpMonitor = new TcpMonitor();
