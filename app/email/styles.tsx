import styled from "styled-components";


export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

export const MessageList = styled.div`
  width: 16vw;
  height: 80vh;
  max-height: 90vh;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-top: 40px;
  margin-right: 30px;
`;

export const MessageListTitle = styled.div`
  width: 100%;
  display: flex;
  justify-content: left;
  align-items: center;
  font-size: 20px;
  font-weight: 600;

  margin-top: 20px;
  margin-left: 20px;

  position: relative;

  > span {
    margin-right: 140px;
  }
`;

export const SearchInputWrapper = styled.div`
  position: absolute;
  top: 30px; 
  right: 0;
  width: 100%;
  display: flex;
  justify-content: flex-end;
`;

export const UserSearchInput = styled.input`
  border: 1px solid #ccc;
  padding: 5px 10px;
  border-radius: 8px;
  margin-right: 10px;
`;

export const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 50vw;
  height: 80vh;
  max-height: 90vh;
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
  margin-top: 40px;
`;

export const MessagesList = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end; 
  flex-grow: 1;
  padding: 10px;
  overflow-y: auto;
`;

export const MessageBubble = styled.div<{ sender: 'me' | 'them' }>`
  background-color: ${(props) => (props.sender === 'me' ? '#dcf8c6' : '#fff')};
  border-radius: 20px;
  padding: 10px 15px;
  margin-bottom: 10px;
  min-width: 50px; 
  width: fit-content;
  align-self: ${(props) => (props.sender === 'me' ? 'flex-end' : 'flex-start')};
  margin-left: ${(props) => (props.sender === 'me' ? 'auto' : 'initial')};
  word-wrap: break-word; 
`;

export const MessageInputContainer = styled.div`
  display: flex;
  padding: 10px;
  background-color: #f0f0f0;
  border-top: 1px solid #ccc;
  width: 100%;
`;



export const Input = styled.textarea`
  flex-grow: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-right: 10px;
  resize: none;
`;

export const SendButton = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  background-color: #0084ff;
  color: white;
  cursor: pointer;

  &:hover {
    background-color: #006bbf;
  }
`;