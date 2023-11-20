'use client';
import { useSession } from 'next-auth/react';
import React from 'react';
import RequestStatusPage from './components/request';
import ProcessStatusPage from './components/process';

const Notificationpage = () => {
  const { data: session } = useSession();

  return (
    <>
      {session?.user.membershipProcessedBys && (<>
        <RequestStatusPage membershipProcessedBys={session?.user.membershipProcessedBys} /></>)}
      {session?.user.membershipRequestedBys && (<>
        <ProcessStatusPage membershipRequestedBys={session?.user.membershipRequestedBys} />
      </>
      )}
    </>
  );
};

export default Notificationpage;