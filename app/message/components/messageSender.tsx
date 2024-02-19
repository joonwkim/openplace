'use client'
import { createMessageAction, } from '@/app/actions/messageServiceAction'
import { Message } from '@prisma/client'
import { useEffect, useRef, useState } from 'react'

type MessageSenderProps = {
    sender: any,
    receiverId: string,
}

const MessageSender = ({ sender, receiverId }: MessageSenderProps) => {

    const [message, setMessage] = useState('')
    const handleSend = async () => {
        await createMessageAction(sender.id, receiverId, message);
        setMessage('');
    }

    const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSend();
        }
    };
    return (<>
        <div className='message-input-container'>
            <div className='p-1'>
                <textarea className='message-input ' placeholder='' title='message input area' value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyPress} />
            </div>
            <button type='button' onClick={handleSend} className='btn btn-primary ms-4 send-button' title='send message'>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-send" viewBox="0 0 16 16">
                    <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z" />
                </svg>
            </button>
            <div></div>
        </div>
        {/* <styled.ChatContainer>
            <styled.MessagesList>
                {sender?.messages.map((message: any, index: number) => (
                    <styled.MessageBubble sender='me' key={message.id}>
                        {message.message}
                    </styled.MessageBubble>
                ))}
                <div ref={messagesEndRef} />
            </styled.MessagesList>
            <MessageInput onSend={handleOnSend} />
        </styled.ChatContainer> */}
    </>

    )
}

export default MessageSender