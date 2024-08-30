import React, { FC, ReactElement, useState } from 'react';

import { IPagination } from '@/interfaces/monitor.interface';
import clsx from 'clsx';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';

interface PaginateProps {
  updateLimit: (newLimit: IPagination) => void;
  defaultLimit: number;
  length: number;
}

const Paginate: FC<PaginateProps> = ({
  length,
  defaultLimit,
  updateLimit,
}): ReactElement => {
  const [limit] = useState<number>(defaultLimit);
  const [page, setPage] = useState<number>(1);

  function pageLimit(): number {
    return Math.floor(length / limit) + (length % limit > 0 ? 1 : 0);
  }

  function updatePage(value: number): void {
    setPage(value);
    updateLimit({
      start: limit * (value - 1),
      end: limit * value,
    });
  }

  return (
    <div className='inline-flex gap-4 text-sm'>
      <div
        onClick={() => updatePage(page - 1)}
        className={clsx(
          'ms-0 flex h-8 items-center justify-center border border-gray-300 bg-white px-3 leading-tight text-gray-500',
          {
            'pointer-events-none cursor-none': page === 1,
            'cursor-pointer': page > 1,
          }
        )}
      >
        <FaAngleLeft />
      </div>
      <div className='flex items-center gap-2'>
        <div>Page</div>
        <div>
          {page} of {pageLimit()}
        </div>
      </div>
      <div
        onClick={() => updatePage(page + 1)}
        className={clsx(
          'ms-0 flex h-8 items-center justify-center border border-gray-300 bg-white px-3 leading-tight text-gray-500',
          {
            'pointer-events-none cursor-none': !(page < pageLimit()),
            'cursor-pointer': page < pageLimit(),
          }
        )}
      >
        <FaAngleRight />
      </div>
    </div>
  );
};

export default Paginate;
