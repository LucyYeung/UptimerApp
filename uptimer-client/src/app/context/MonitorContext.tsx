'use client';

import {
  Dispatch,
  ReactElement,
  ReactNode,
  createContext,
  useReducer,
} from 'react';

import { INotification } from '@/interfaces/notification.interface';
import { IUser, InitialUpdateType } from '@/interfaces/user.interface';

export interface StateProps {
  user: IUser | null;
  notifications: INotification[];
}

export interface DispatchProps {
  type: string;
  payload: string | boolean | InitialUpdateType | null;
}

interface Props {
  children: ReactNode;
}

interface MonitorContextType {
  state: StateProps;
  dispatch: Dispatch<DispatchProps>;
}

const initialValues: StateProps = {
  user: null,
  notifications: [],
};

export const MonitorContext = createContext<MonitorContextType>({
  state: initialValues,
  dispatch: () => {},
});

const mainReducer = (state: StateProps, action: DispatchProps) => ({
  user: stateReducer(state, action).user,
  notifications: stateReducer(state, action).notifications,
});

export const MonitorProvider = ({ children }: Props): ReactElement => {
  const [state, dispatch] = useReducer(mainReducer, initialValues);

  return (
    <MonitorContext.Provider value={{ state, dispatch }}>
      {children}
    </MonitorContext.Provider>
  );
};

const stateReducer = (state: StateProps, action: DispatchProps) => {
  switch (action.type) {
    case 'dataUpdate': {
      const { user, notifications } = action.payload as InitialUpdateType;
      return {
        ...state,
        user,
        notifications,
      };
    }
    case 'user': {
      return {
        ...state,
        user: action.payload as IUser,
      };
    }
    default:
      return state;
  }
};
