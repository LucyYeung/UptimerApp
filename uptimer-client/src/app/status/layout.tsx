'use client';

import { ReactNode } from 'react';

import LayoutBody from '@/components/LayoutBody';

const StatusLayout = ({ children }: { children: ReactNode }) => {
  return <LayoutBody>{children}</LayoutBody>;
};

export default StatusLayout;
