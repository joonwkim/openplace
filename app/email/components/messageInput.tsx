'use client'
import React, { useState } from 'react'
import * as styled from '../styles';

interface MessageInputProps {
    onSend: (message: string) => void;
}
const MessageInput: React.FC<MessageInputProps> = ({ onSend }) => {
    const [input, setInput] = useState('');

    // 메시지를 전송하는 함수
    const handleSend = () => {
        if (input.trim() !== '') {
            onSend(input.trim());
            setInput('');
        }
    };

    // 키보드 이벤트를 처리하는 함수
    const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSend();
        }
    };

    // 메시지 입력창 UI 렌더링
    return (
        <styled.MessageInputContainer>
            <styled.Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
            />
            <styled.SendButton onClick={handleSend}>Send</styled.SendButton>
        </styled.MessageInputContainer>
    );
};

export default MessageInput