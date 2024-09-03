import { FC, ReactElement } from 'react';

import Link from 'next/link';

import { INotification } from '@/interfaces/notification.interface';
import { FaPencilAlt, FaRegEnvelopeOpen, FaTrashAlt } from 'react-icons/fa';

import Button from '@/components/Button';

import { useViewContact } from '../hooks/useViewContact';

const ContactGroupView: FC = (): ReactElement => {
  const { notifications, deleteGroup } = useViewContact();

  return (
    <div className='relative m-auto h-screen min-h-screen px-6 xl:container md:px-12 lg:px-6'>
      <div className='flex h-20 items-center justify-end'>
        <Link
          href='/contact/create'
          className='inline-flex rounded bg-green-400 px-4 py-2 text-base font-medium text-white md:items-center'
        >
          New Notification Group
        </Link>
      </div>
      <div className='my-4'>
        <div className='relative overflow-x-auto'>
          <table className='w-full text-left text-sm text-gray-500 rtl:text-right'>
            <thead className='bg-gray-50 text-xs uppercase text-gray-700'>
              <tr>
                <th scope='col' className='px-6 py-3'>
                  Group Name
                </th>
                <th scope='col' className='px-6 py-3'>
                  Integrations
                </th>
                <th scope='col' className='px-6 py-3'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {notifications.map((notification: INotification) => {
                console.log(notification);

                const emailsGroup = JSON.parse(notification.emails);

                return (
                  <tr key={notification.id} className='bg-white'>
                    <td className='cursor-pointer px-6 py-4 font-medium text-[#1e8dee]'>
                      {notification.groupName}
                    </td>
                    <td className='cursor-pointer px-6 py-4 font-medium text-[#1e8dee]'>
                      <Button
                        label={`${emailsGroup.length}`}
                        icon={<FaRegEnvelopeOpen />}
                        className='inline-flex items-center gap-2 rounded border bg-[#1e8dee] px-2 py-1 text-sm text-white'
                      />
                    </td>
                    <td className='px-6 py-4'>
                      <div className='inline-flex shadow-sm' role='group'>
                        <Link
                          href={`/contact/edit/${notification.id}`}
                          className='mr-1 inline-flex items-center gap-2 rounded border bg-[#1e8dee] px-4 py-2 text-sm font-bold text-white hover:bg-[#7fbef5]'
                        >
                          <FaPencilAlt />
                        </Link>
                        <Button
                          onClick={() =>
                            deleteGroup(parseInt(`${notification.id}`))
                          }
                          icon={<FaTrashAlt />}
                          className='mr-1 inline-flex items-center gap-2 rounded border bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-400'
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ContactGroupView;
