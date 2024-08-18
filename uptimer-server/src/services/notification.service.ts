import { INotificationDocument } from '@app/interfaces/notification.interface';
import { NotificationModel } from '@app/models/notification.model';

export const createNotificationGroup = async (data: INotificationDocument) => {
  try {
    const result = await NotificationModel.create(data);
    return result.dataValues;
  } catch (error) {
    throw new Error(error);
  }
};

export const getSingleNotificationGroup = async (notificationId: number) => {
  try {
    const notifications = (await NotificationModel.findOne({
      where: { id: notificationId },
      order: [['createdAt', 'DESC']],
    })) as unknown as INotificationDocument;
    return notifications;
  } catch (error) {
    throw new Error(error);
  }
};

export const getAllNotificationGroup = async (userId: number) => {
  try {
    const notifications = (await NotificationModel.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
    })) as unknown as INotificationDocument[];
    return notifications;
  } catch (error) {
    throw new Error(error);
  }
};

export const updateNotificationGroup = async (
  notificationId: number,
  data: INotificationDocument,
) => {
  try {
    await NotificationModel.update(data, {
      where: { id: notificationId },
    });
  } catch (error) {
    throw new Error(error);
  }
};

export const deleteNotificationGroup = async (notificationId: number) => {
  try {
    await NotificationModel.destroy({
      where: { id: notificationId },
    });
  } catch (error) {
    throw new Error(error);
  }
};
