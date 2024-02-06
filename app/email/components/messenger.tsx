'use client';
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import plusicon from '../../public/images/plus.png';
import * as styled from '../styles';
import { User } from '@prisma/client';
import MessageInput from './messageInput';

interface Message {
    id: number;
    text: string;
    sender: 'me' | 'them';
}

const Messenger: React.FC = async () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const messagesEndRef = useRef<null | HTMLDivElement>(null);




    // 메시지 리스트의 가장 아래로 스크롤하는 함수
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // 메시지가 추가될 때마다 스크롤을 가장 아래로 이동시킴
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // 새 메시지 전송
    const sendMessage = async (text: string) => {
        const messageData = {
            text,
            senderId: 'yourSenderId',
        };

        try {
            const response = await fetch('/sendMessage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(messageData),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const newMessage = await response.json();
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    const [showSearchInput, setShowSearchInput] = useState(false);
    const searchInputRef = useRef<HTMLDivElement>(null);
    // plus 아이콘 클릭 이벤트 핸들러
    const toggleSearchInput = () => {
        setShowSearchInput((prev) => !prev);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchInputRef.current && !searchInputRef.current.contains(event.target as Node)) {
                setShowSearchInput(false);
            }
        };

        // 이벤트 리스너를 문서 전체에 추가
        document.addEventListener('mousedown', handleClickOutside);

        // 컴포넌트가 언마운트될 때 이벤트 리스너를 정리
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <styled.Container>
            <styled.MessageList>
                <styled.MessageListTitle>
                    <span>받은 메시지함</span>
                    <Image
                        src={plusicon}
                        alt="plusbtn"
                        width={20}
                        height={20}
                        onClick={toggleSearchInput}
                        style={{ cursor: 'pointer' }}
                    />
                    {showSearchInput && (
                        <styled.SearchInputWrapper ref={searchInputRef}>
                            <styled.UserSearchInput
                                type="text"
                                placeholder="유저 검색..."
                                autoFocus
                            />
                        </styled.SearchInputWrapper>
                    )}
                </styled.MessageListTitle>

            </styled.MessageList>
            <styled.ChatContainer>
                <styled.MessagesList>
                    {messages.map((message) => (
                        <styled.MessageBubble sender={message.sender} key={message.id}>
                            {message.text}
                        </styled.MessageBubble>
                    ))}
                    <div ref={messagesEndRef} />
                </styled.MessagesList>
                <MessageInput onSend={sendMessage} />
            </styled.ChatContainer>
        </styled.Container>
    );
};

export default Messenger;