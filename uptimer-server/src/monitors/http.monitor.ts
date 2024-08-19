import { IHeartbeat } from '@app/interfaces/heartbeat.interface';
import { IMonitorDocument } from '@app/interfaces/monitor.interface';
import { getMonitorById } from '@app/services/monitor.service';
import { encodeBase64 } from '@app/utils/utils';
import axios, { AxiosRequestConfig } from 'axios';
import dayjs from 'dayjs';

class HttpMonitor {
  errorCount: number;
  noSuccessAlert: boolean;

  constructor() {
    this.errorCount = 0;
    this.noSuccessAlert = true;
  }

  async start(data: IMonitorDocument) {
    const {
      monitorId,
      httpAuthMethod,
      basicAuthUser,
      basicAuthPass,
      url,
      method,
      headers,
      body,
      timeout,
      redirects,
      bearerToken,
    } = data;
    const reqTimeout = timeout! * 1000;
    const startTime = Date.now();

    try {
      const monitorData = await getMonitorById(monitorId!);
      let basicAuthHeader = {};
      if (httpAuthMethod === 'basic') {
        basicAuthHeader = {
          Authorization: `Basic ${encodeBase64(basicAuthUser!, basicAuthPass!)}`,
        };
      }
      if (httpAuthMethod === 'token') {
        basicAuthHeader = {
          Authorization: `Bearer ${bearerToken}`,
        };
      }

      let bodyValue = null;
      let reqContentType = null;
      if (body && body!.length > 0) {
        try {
          bodyValue = JSON.parse(body!);
          reqContentType = 'application/json';
        } catch (error) {
          throw new Error('Your JSON body is invalid');
        }
      }

      const options: AxiosRequestConfig = {
        url,
        method: (method || 'GET').toLowerCase(),
        timeout: reqTimeout,
        headers: {
          Accept: 'text/html,application/json',
          ...(reqContentType
            ? {
                'Content-Type': reqContentType,
              }
            : {}),
          ...basicAuthHeader,
          ...(headers ? JSON.parse(headers) : {}),
        },
        maxRedirects: redirects,
      };

      const response = await axios.request(options);
      const responseTime = Date.now() - startTime;
      const heartbeatData: IHeartbeat = {
        monitorId: monitorId!,
        status: 0,
        code: response.status ?? 0,
        message:
          `${response.status} - ${response.statusText}` ??
          'Http monitor check successful.',
        timestamp: dayjs.utc().valueOf(),
        reqHeaders: JSON.stringify(response.headers) ?? '',
        resHeaders: JSON.stringify(response.request.res.rawHeaders) ?? '',
        reqBody: body,
        resBody: JSON.stringify(response.data) ?? '',
        responseTime,
      };

      const statusList = JSON.parse(monitorData.statusCode!);
      const responseDurationTime = JSON.parse(monitorData.responseTime!);
      const contentTypeList =
        monitorData.contentType!.length > 0
          ? JSON.parse(JSON.stringify(monitorData.contentType)!)
          : [];
      if (
        !statusList.includes(response.status) ||
        responseDurationTime < responseTime ||
        (contentTypeList.length > 0 &&
          !contentTypeList.includes(response.headers['content-type']))
      ) {
        // TODO: error assertion
      } else {
        // TODO: success assertion
      }
    } catch (error) {
      console.log(error);
    }
  }
}

export const httpMonitor = new HttpMonitor();
