import { useContext } from 'react';

import { MonitorContext } from '@/context/MonitorContext';
import {
  INotification,
  IUseViewContact,
} from '@/interfaces/notification.interface';
import { IUser } from '@/interfaces/user.interface';
import { CHECK_CURRENT_USER } from '@/queries/auth';
import { DELETE_NOTIFICATION_GROUP } from '@/queries/contactGroup';
import { showErrorToast, showSuccessToast } from '@/utils/utils';
import { useMutation } from '@apollo/client';
import { filter } from 'lodash';

export const useViewContact = (): IUseViewContact => {
  const {
    state: { notifications },
    dispatch,
  } = useContext(MonitorContext);
  const [deleteNotificationGroup] = useMutation(DELETE_NOTIFICATION_GROUP, {
    update(cache, { data: { deleteNotificationGroup } }) {
      const { checkCurrentUser } = cache.readQuery({
        query: CHECK_CURRENT_USER,
      }) as {
        checkCurrentUser: {
          __typename: string;
          user: IUser;
          notifications: INotification[];
        };
      };
      const notifications = filter(
        checkCurrentUser.notifications,
        (notification: INotification) =>
          notification.id !== deleteNotificationGroup.id
      );
      dispatch({
        type: 'dataUpdate',
        payload: {
          user: checkCurrentUser.user,
          notifications,
        },
      });
      cache.writeQuery({
        query: CHECK_CURRENT_USER,
        data: {
          checkCurrentUser: {
            __typename: 'CurrentUserResponse',
            user: checkCurrentUser.user,
            notifications,
          },
        },
      });
    },
  });

  const deleteGroup = async (notificationId: number): Promise<void> => {
    try {
      const response = window.confirm('Are you sure you want to delete?');
      if (response) {
        await deleteNotificationGroup({ variables: { notificationId } });
        showSuccessToast('Deleted notification group.');
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      showErrorToast('Error deleting notification group.');
    }
  };

  return {
    notifications,
    deleteGroup,
  };
};
