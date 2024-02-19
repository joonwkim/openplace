'use client'
import { MessagingPartner } from '@/app/lib/types';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
type MessageSendersProps = {
    partners: MessagingPartner[],
    // onClick: (creator: any) => void,
}
const MessagingPartners = ({ partners }: MessageSendersProps) => {
    const router = useRouter();

    const handleOnClick = (partner: any) => {
        router.push(`/message/?selectedUserId=${partner.id}`);
    }

    return (
        <div className='row mt-3'>
            <div className='border-0'>
                {partners?.length > 0 && (
                    <div className='list-group' >
                        {partners?.map((partner: any, index: number) => (<>{partner.isSelected ? (<div key={partner.id} className='ms-3 border-top btn text-start list-group-item active' title={partner.email} aria-current="true"
                            onClick={() => handleOnClick(partner)}>{partner.name}</div>) :
                            (<div key={partner.id} className='ms-3 border-top btn text-start list-group-item' title={partner.email} aria-current="true" onClick={() => handleOnClick(partner)}>{partner.name}</div>)}
                        </>))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default MessagingPartners