import { IMonitorResponse } from '@app/interfaces/monitor.interface';
import { MongoClient } from 'mongodb';

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
