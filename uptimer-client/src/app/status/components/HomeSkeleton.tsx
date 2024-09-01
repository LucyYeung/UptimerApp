import { FC, ReactElement } from 'react';

const HomeSkeleton: FC = (): ReactElement => {
  return (
    <>
      <div className='relative m-auto h-screen min-h-screen pr-6 xl:container'>
        <div className='mb-4 mt-2 flex h-20 flex-col gap-y-3 md:mb-0 md:mt-0 md:flex-row md:items-center md:justify-between'>
          <div className='inline-flex' role='group'>
            {[1, 2, 3].map((_, index: number) => (
              <div
                key={index}
                className='mr-1 inline-flex items-center rounded bg-lightGray px-6 py-4 text-sm font-bold'
              ></div>
            ))}
          </div>
          <div className='inline-flex rounded bg-lightGray px-6 py-4 text-base font-medium md:items-center'></div>
        </div>
        <div className='flex h-44 flex-col items-start justify-start bg-lightGray lg:h-20 lg:flex-row lg:items-center lg:justify-between'>
          <div className='mb-3 inline-flex cursor-pointer items-center rounded bg-lightGray px-4 py-2 text-base font-medium lg:mb-0' />
        </div>
        <div className='my-4'>
          <table className='w-full text-left text-sm text-gray-500 rtl:text-right'>
            <thead className='bg-gray-50 text-xs uppercase text-gray-700'>
              <tr>
                <th scope='col' className='px-6 py-3'>
                  <div className='bg-lightGray px-6 py-4'></div>
                </th>
                <th scope='col' className='px-6 py-3'>
                  <div className='bg-lightGray px-6 py-4'></div>
                </th>
                <th scope='col' className='px-6 py-3'>
                  <div className='bg-lightGray px-6 py-4'></div>
                </th>
                <th scope='col' className='w-[15%] px-6 py-3'>
                  <div className='bg-lightGray px-6 py-4'></div>
                </th>
                <th scope='col' className='w-[15%] px-6 py-3'>
                  <div className='bg-lightGray px-6 py-4'></div>
                </th>
                <th scope='col' className='px-6 py-3'>
                  <div className='bg-lightGray px-6 py-4'></div>
                </th>
                <th scope='col' className='px-6 py-3'>
                  <div className='bg-lightGray px-6 py-4'></div>
                </th>
              </tr>
            </thead>
            <tbody>
              {[...Array(20)].map((_, index: number) => (
                <tr
                  key={index}
                  className={`${index % 2 === 0 ? '' : 'bg-lightGray'}`}
                >
                  <td className='px-6 py-4'></td>
                  <td className='px-6 py-4'></td>
                  <td className='px-6 py-4'></td>
                  <td className='px-6 py-4'></td>
                  <td className='px-6 py-4'></td>
                  <td className='px-6 py-4'></td>
                  <td className='px-6 py-4'></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default HomeSkeleton;
