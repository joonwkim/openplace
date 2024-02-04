'use client';
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import plusicon from '../../public/images/plus.png';
import * as styled from './styles';



interface Message {
  id: number;
  text: string;
  sender: 'me' | 'them';
}

interface MessageInputProps {
  onSend: (message: string) => void;
}

// Components
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

const Messenger: React.FC = () => {
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
  const sendMessage = (text: string) => {
    const newMessage: Message = {
      id: messages.length,
      text,
      sender: 'me',
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]); 
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