import { FC, ReactElement } from 'react';

import { MonitorItemProps } from '@/interfaces/monitor.interface';
import clsx from 'clsx';

import TextAreaInput from '@/components/TextAreaInput';
import TextInput from '@/components/TextInput';

const MonitorItem: FC<MonitorItemProps> = ({
  id,
  type,
  requiredIcon,
  topClass,
  className,
  labelStart,
  labelEnd,
  placeholder,
  inputValue,
  readonly,
  onChange,
}): ReactElement => {
  return (
    <>
      <div className={topClass}>
        <label htmlFor={id} className='mb-2 block text-sm text-gray-600'>
          {labelStart}
          {requiredIcon && <sup className='text-red-400'>*</sup>}
        </label>
        {type !== 'textarea' ? (
          <TextInput
            type={type}
            name={id}
            id={id}
            readOnly={readonly}
            className={clsx(`${className !== '' ? className : ''}`, {
              'block w-full rounded-lg border border-black bg-white p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500':
                !className,
              'border-none bg-gray-300': readonly,
            })}
            placeholder={placeholder}
            value={inputValue}
            onChange={onChange}
          />
        ) : (
          <TextAreaInput
            rows={8}
            id={id}
            name={id}
            className={
              className
                ? className
                : 'block w-full rounded-lg border border-black bg-white p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500'
            }
            placeholder={placeholder}
            value={inputValue}
            onChange={onChange}
          />
        )}
        {labelEnd && (
          <label
            htmlFor={labelEnd}
            className='my-1 block text-xs text-gray-500'
          >
            {labelEnd}
          </label>
        )}
      </div>
    </>
  );
};

export default MonitorItem;
