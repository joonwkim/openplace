'use client'
import { createMessageAction, } from '@/app/actions/messageServiceAction'
import { Message } from '@prisma/client'
import { useEffect, useState } from 'react'

type MessageSenderProps = {
    sender: any,
    receiverId: string,
}

const MessageSender = async ({ sender, receiverId }: MessageSenderProps) => {


    const handleSendMessage = async () => {
        const testMessage = 'other test message';
        await createMessageAction(sender.id, receiverId, testMessage)

    }
    return (<>
        <button type="button" className="btn btn-primary" onClick={handleSendMessage}>Send Message</button>
        <div>
            {sender?.messages.length > 0 && (
                <div className='list-group' >
                    {sender?.messages.map((msg: any, index: number) => (<>
                        <div key={msg.id} className='list-group-item' >{msg.message}</div>
                    </>))}
                </div>
            )}
        </div>
    </>

    )
}

export default MessageSender