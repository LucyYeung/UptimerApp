import { FC, ReactElement } from 'react';

import {
  ISSLMonitorDocument,
  SSLModalDataProp,
} from '@/interfaces/ssl.interface';
import clsx from 'clsx';
import { FaCheckCircle } from 'react-icons/fa';

import Button from '@/components/Button';

import { useSSLInfoModal } from '../hooks/useSSLInfoModal';

type SSLInfoModalProp = { monitor: ISSLMonitorDocument; onClose: () => void };

const SSLInfoModal: FC<SSLInfoModalProp> = ({
  monitor,
  onClose,
}): ReactElement => {
  const {
    sslInfo,
    hostInfo,
    subjectInfo,
    issuerInfo,
    validityInfo,
    formatDate,
  } = useSSLInfoModal(monitor);

  const renderMessage = (): JSX.Element => {
    if (sslInfo.type === 'success') {
      return (
        <>{`The certificate is valid until ${formatDate(sslInfo.info.validTo!)}`}</>
      );
    }
    if (sslInfo.type === 'expiring soon') {
      return (
        <>{`The certificate will expire in ${sslInfo.info.daysLeft} day(s).`}</>
      );
    }
    return <>{'The certificate is either expired or invalid.'}</>;
  };

  return (
    <div className='absolute bottom-0 left-0 right-0 top-0 z-50 h-full w-full overflow-hidden'>
      <div className='absolute bottom-0 left-0 right-0 top-0 z-10 bg-black/[.65] py-2'>
        <div className='fixed bottom-0 left-0 right-0 top-0 flex items-center justify-center'>
          <div className='relative bottom-auto left-auto right-auto top-auto max-h-[90vh] min-w-[60%] bg-white p-4 text-[#404145]'>
            <div className='w-ful mb-[10px] text-left'>
              <h4 className='text-[17px] font-bold'>SSL Certificate Details</h4>
            </div>
            <div className='flex w-full items-center gap-1 text-left'>
              <FaCheckCircle
                className={clsx('', {
                  'text-green-400': sslInfo.type === 'success',
                  'text-red-400':
                    sslInfo.type === 'danger' ||
                    sslInfo.type === '--' ||
                    sslInfo.type === 'expired',
                  'text-yellow-400': sslInfo.type === 'expiring soon',
                })}
              />
              <div className='text-sm'>{renderMessage()}</div>
            </div>
            <div className='container mx-auto py-4'>
              <div className='mx-auto my-4 rounded-xl border p-4'>
                <div className='mb-3 grid w-full grid-cols-1 gap-12 border-b md:grid-cols-2'>
                  {CertInfo({ title: 'Host', body: hostInfo })}
                  {CertInfo({ title: 'Subject', body: subjectInfo })}
                </div>
                <div className='mt-3 grid w-full grid-cols-1 gap-12 md:grid-cols-2'>
                  {CertInfo({ title: 'Issuer', body: issuerInfo })}
                  {CertInfo({ title: 'Validity', body: validityInfo })}
                </div>
              </div>
            </div>
            <div className='flex justify-end gap-3'>
              <Button
                className='rounded bg-gray-200 px-6 py-3 text-center text-sm font-bold text-black focus:outline-none md:px-4 md:py-2 md:text-base'
                label='Close'
                onClick={onClose}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CertInfo = ({
  title,
  body,
}: {
  title: string;
  body: SSLModalDataProp[];
}): ReactElement => {
  return (
    <div className='h-48 overflow-scroll'>
      <div className='font-semibold'>{title}</div>
      {body.map((data: SSLModalDataProp, index: number) => (
        <div key={index} className='text-sm md:flex md:justify-between'>
          <div className='w-[30%] py-3'>{data.key}:</div>
          <div className='w-[60%] py-3'>{data.value}</div>
        </div>
      ))}
    </div>
  );
};

export default SSLInfoModal;
