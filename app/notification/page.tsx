'use client';
import { useSession } from 'next-auth/react';
import React, { useEffect } from 'react';
import RequestStatusPage from './components/request';
import ProcessStatusPage from './components/process';

const Notificationpage = () => {
  const { data: session } = useSession();

  useEffect(()=>{
    console.log('Notificationpage', session?.user)
  },[session?.user])


  return (
    <>
      {session?.user.memberProcessedBys && (<>
        {/* {JSON.stringify(session?.user.memberProcessedBys)} */}
        <RequestStatusPage memberProcessedBys={session?.user.memberProcessedBys} /></>)}
      {/* <h4 className='mb-3 mt-3'>그룹 참여요청 처리 현황</h4> */}
      {session?.user.memberRequestedBys && (<>
        {/* {JSON.stringify(session?.user.memberRequestedBys)} */}
        <ProcessStatusPage memberRequestedBys={session?.user.memberRequestedBys} />
      </>
      )}
    </>
  );
};

export default Notificationpage;