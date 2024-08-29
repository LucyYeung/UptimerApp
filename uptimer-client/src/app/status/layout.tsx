'use client';

import { ReactNode } from 'react';

import LayoutBody from '@/components/LayoutBody';
import ProtectedRoute from '@/components/ProtectedRoute';

const StatusLayout = ({ children }: { children: ReactNode }) => {
  return (
    <ProtectedRoute>
      <LayoutBody>{children}</LayoutBody>
    </ProtectedRoute>
  );
};

export default StatusLayout;
