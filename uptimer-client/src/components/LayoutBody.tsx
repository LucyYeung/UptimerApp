import { ReactNode, useState } from 'react';

import clsx from 'clsx';
import { FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';

import HomeHeader from './headers/HomeHeader';
import Sidebar from './sidebar/Sidebar';

const LayoutBody = ({ children }: { children: ReactNode }) => {
  const [toggleSidebar, setToggleSidebar] = useState(true);

  return (
    <div className='relative h-screen'>
      <div
        className={clsx('grid', {
          'grid-cols-5': toggleSidebar,
          'grid-cols-1': !toggleSidebar,
        })}
      >
        {toggleSidebar && (
          <div className='bottom-0 top-0 col-span-1 hidden h-auto border-r border-[#e5f3ff] p-0 text-center lg:flex'>
            <Sidebar type='sidebar' />
          </div>
        )}

        <div
          className={clsx('col-span-5 lg:col-span-4', {
            'col-span-4': toggleSidebar,
            'col-span-1': !toggleSidebar,
          })}
        >
          {<HomeHeader />}
          {children}
        </div>
      </div>
      <div
        className='absolute bottom-auto hidden cursor-pointer p-4 lg:flex'
        onClick={() => setToggleSidebar(!toggleSidebar)}
      >
        {toggleSidebar ? <FaAngleDoubleLeft /> : <FaAngleDoubleRight />}
      </div>
    </div>
  );
};

export default LayoutBody;
