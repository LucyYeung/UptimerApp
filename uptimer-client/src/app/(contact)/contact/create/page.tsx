'use client';

import { FC, ReactElement } from 'react';

import PageLoader from '@/components/PageLoader';

import ContactForm from '../../components/ContactForm';
import { useContactGroupCreate } from '../../hooks/useContactGroup';

const CreateContact: FC = (): ReactElement => {
  const {
    isPending,
    notificationGroup,
    emails,
    itemInput,
    setNotificationGroup,
    setEmails,
    setItemInput,
    onHandleSubmit,
  } = useContactGroupCreate();

  return (
    <>
      {isPending ? (
        <PageLoader />
      ) : (
        <ContactForm
          label='Create Group'
          notificationGroup={notificationGroup}
          emails={emails}
          itemInput={itemInput}
          setNotificationGroup={setNotificationGroup}
          setEmails={setEmails}
          setItemInput={setItemInput}
          onFormHandler={onHandleSubmit}
        />
      )}
    </>
  );
};

export default CreateContact;
