import { IMonitorResponse } from '@app/interfaces/monitor.interface';
import { MongoClient } from 'mongodb';
import { Socket } from 'net';
import { createClient } from 'redis';

/**
 * Connect to and ping a MongoDB database
 * @param {string} connectionString The database connection string
 * @returns {Promise<IMonitorResponse>}
 */
export const mongodbPing = async (
  connectionString: string,
): Promise<IMonitorResponse> => {
  const starttime = Date.now();
  return new Promise((resolve, reject) => {
    MongoClient.connect(connectionString)
      .then(async (client: MongoClient) => {
        await client.db().command({ ping: 1 });
        await client.close();
        const responseTime = Date.now() - starttime;

        resolve({
          status: 'established',
          responseTime,
          message: 'MongoDB server running',
          code: 200,
        });
      })
      .catch((error) => {
        if (error?.errorResponse) {
          reject({
            status: 'refused',
            responseTime: Date.now() - starttime,
            message:
              error.errorResponse.errmsg ?? 'MongoDB server connection issue',
            code: error.errorResponse?.code ?? 500,
          });
        } else {
          reject({
            status: 'refused',
            responseTime: Date.now() - starttime,
            message: 'MongoDB server down',
            code: 500,
          });
        }
      });
  });
};

/**
 * Redis server ping
 * @param connectionString
 * @returns {Promise<IMonitorResponse>}
 */
export const redisPing = async (
  connectionString: string,
): Promise<IMonitorResponse> => {
  const startTime = Date.now();

  return new Promise((resolve, reject) => {
    const client = createClient({ url: connectionString });

    client.on('error', (error) => {
      if (client.isOpen) {
        client.disconnect();
      }

      reject({
        status: 'refused',
        responseTime: Date.now() - startTime,
        message: error.message ?? 'Redis connection refused',
        code: 500,
      });
    });

    client.connect().then(() => {
      if (!client.isOpen) {
        reject({
          status: 'refused',
          responseTime: Date.now() - startTime,
          message: "Connection isn't open",
          code: 500,
        });
      }
      client
        .ping()
        .then(() => {
          if (client.isOpen) {
            client.disconnect();
          }

          resolve({
            status: 'established',
            responseTime: Date.now() - startTime,
            message: 'Redis server running',
            code: 200,
          });
        })
        .catch((error) => {
          reject({
            status: 'refused',
            responseTime: Date.now() - startTime,
            message: error.message ?? 'Redis server down',
            code: 500,
          });
        });
    });
  });
};

export const tcpPing = (
  hostname: string,
  port: number,
  timeout: number,
): Promise<IMonitorResponse> => {
  return new Promise((resolve, reject) => {
    const socket = new Socket();
    const startTime = Date.now();

    const options = {
      address: hostname || '127.0.0.1',
      port: port || 80,
      timeout: timeout || 1000,
    };

    socket.setTimeout(options.timeout, () => {
      socket.destroy();
      reject({
        status: 'refused',
        responseTime: Date.now() - startTime,
        message: 'TCP socket timeout',
        code: 500,
      });
    });

    socket.connect(options.port, options.address, () => {
      socket.destroy();
      resolve({
        status: 'established',
        responseTime: Date.now() - startTime,
        message: 'Host is up and running',
        code: 200,
      });
    });

    socket.on('error', (error) => {
      socket.destroy();
      reject({
        status: 'refused',
        responseTime: Date.now() - startTime,
        message: error.message || 'TCP connection failed',
        code: 500,
      });
    });
  });
};
