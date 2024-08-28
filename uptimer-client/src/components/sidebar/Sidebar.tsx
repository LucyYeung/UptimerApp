import { FC } from 'react';

import Link from 'next/link';

import { FaLock, FaRegClock, FaTv, FaUser } from 'react-icons/fa';

import SidebarMenu from './SidebarMenu';

const Sidebar: FC<{ type: string }> = ({ type }) => {
  const openUptimeModal = () => {};

  return (
    <div className='h-[90%] w-full'>
      {type === 'sidebar' && (
        <div className='text-xl text-gray-100'>
          <div className='mt-1 flex items-center p-2'>
            <Link
              href='/status'
              className='relative z-10 flex items-center justify-center gap-2 self-center px-2.5 text-2xl font-bold text-[#4aa1f3]'
            >
              <FaTv />
              Uptimer
            </Link>
            <i className='bi bi-x ml-28 cursor-pointer lg:hidden'></i>
          </div>
          <div className='bordr-[#e5f3ff] my-2 h-[1px] border-b'></div>
        </div>
      )}
      <SidebarMenu
        menuText='Uptime'
        icon={<FaRegClock />}
        submenuTexts={[
          { name: 'All Tests', url: '/status' },
          { name: 'New Uptime Test', onClick: openUptimeModal },
        ]}
      />
      <SidebarMenu
        menuText='SSL'
        icon={<FaLock />}
        submenuTexts={[
          { name: 'All Tests', url: '/ssl' },
          { name: 'New SSL Test', url: '/ssl/create' },
        ]}
      />
      <SidebarMenu
        menuText='Contact Groups'
        icon={<FaUser />}
        submenuTexts={[
          { name: 'All Contact Groups', url: '/contact' },
          { name: 'New Contact Group', url: '/contact/create' },
        ]}
      />
    </div>
  );
};

export default Sidebar;
