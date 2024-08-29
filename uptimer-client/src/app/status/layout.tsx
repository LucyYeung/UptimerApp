'use client';

import { ReactNode } from 'react';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import LayoutBody from '@/components/LayoutBody';
import ProtectedRoute from '@/components/ProtectedRoute';

dayjs.extend(relativeTime);

const StatusLayout = ({ children }: { children: ReactNode }) => {
  return (
    <ProtectedRoute>
      <LayoutBody>{children}</LayoutBody>
    </ProtectedRoute>
  );
};

export default StatusLayout;
