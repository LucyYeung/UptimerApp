import { FC, Fragment, ReactElement, useState } from 'react';

import Link from 'next/link';

import { FaAngleDown, FaAngleUp } from 'react-icons/fa';

interface SubmenuTextProps {
  name: string;
  url?: string;
  onClick?: () => void;
}

interface SidebarMenuProps {
  menuText: string;
  icon?: ReactElement;
  submenuTexts: SubmenuTextProps[];
}

const SidebarMenu: FC<SidebarMenuProps> = ({
  menuText,
  icon,
  submenuTexts,
}): ReactElement => {
  const [toggleMenu, setToggleMenu] = useState(false);

  return (
    <>
      <div
        className='mt-3 flex cursor-pointer items-center rounded-md py-2.5 text-[#333333] duration-300 lg:px-4'
        onClick={() => setToggleMenu(!toggleMenu)}
      >
        {icon}
        <div className='flex w-full items-center justify-between'>
          <span className='ml-4 text-[15px] font-bold text-[#333333]'>
            {menuText}
          </span>
          <span className='rotate-180 text-sm'>
            {toggleMenu ? <FaAngleDown /> : <FaAngleUp />}
          </span>
        </div>
      </div>
      {toggleMenu && (
        <div className='mx-auto flex w-4/5 flex-col text-left text-sm font-normal text-[#333333]'>
          {submenuTexts.map((submenu, index) => (
            <Fragment key={index}>
              {submenu.url ? (
                <Link href={submenu.url} className='ml-4 mt-1 rounded-md py-2'>
                  {submenu.name}
                </Link>
              ) : (
                <div
                  className='ml-4 mt-1 cursor-pointer rounded-md py-2'
                  onClick={submenu.onClick}
                >
                  {submenu.name}
                </div>
              )}
            </Fragment>
          ))}
        </div>
      )}
    </>
  );
};

export default SidebarMenu;
