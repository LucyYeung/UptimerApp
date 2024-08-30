import React, { FC, ReactElement } from 'react';

import Link from 'next/link';

import Button from '@/components/Button';

interface FormButtonsProps {
  href: string;
  buttonLabel: string;
}

const FormButtons: FC<FormButtonsProps> = ({
  href,
  buttonLabel,
}): ReactElement => {
  return (
    <div className='m-auto my-6 flex w-[80%] justify-end gap-x-4'>
      <Link
        href={href}
        className='text-centertext-sm rounded bg-red-500 px-8 py-3 font-bold text-white hover:bg-red-400 focus:outline-none md:py-3 md:text-base'
      >
        Cancel
      </Link>
      <Button
        type='submit'
        label={buttonLabel}
        className='text-centertext-sm rounded bg-sky-500 px-8 py-3 font-bold text-white hover:bg-sky-400 focus:outline-none md:py-3 md:text-base'
      />
    </div>
  );
};

export default FormButtons;
