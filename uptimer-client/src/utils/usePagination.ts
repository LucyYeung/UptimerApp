import { useState } from 'react';

import { IPagination } from '@/interfaces/monitor.interface';

export const usePagination = (
  start: number,
  end: number
): [IPagination, (newLimit: IPagination) => void] => {
  const [limit, setLimit] = useState<IPagination>({ start, end });

  function updatePagination(newLimit: IPagination) {
    setLimit(newLimit);
  }

  return [limit, updatePagination];
};
