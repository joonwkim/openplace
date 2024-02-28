"use client";


import React, { useEffect, useRef } from 'react';

const ChatContainer = ({ messages }: { messages: any[] }) => {
    const chatEndRef = useRef<null | HTMLDivElement>(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className='chat-container'>
            {messages?.length > 0 && (
                <>
                    {messages.map((msg, index) => (
                        <React.Fragment key={index}>
                            {msg.deliveryType === 'sent' ? (
                                <div className='message-bubble-sent'>{msg.message}</div>
                            ) : msg.deliveryType === 'received' ? (
                                <div className='message-bubble-received'>{msg.message}</div>
                            ) : null}
                        </React.Fragment>
                    ))}
                </>
            )}
            <div ref={chatEndRef} />
        </div>
    );
};

export default ChatContainer;