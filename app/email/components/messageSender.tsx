'use client'
import { createMessageAction, } from '@/app/actions/messageServiceAction'
import { Message } from '@prisma/client'
import { useEffect, useState } from 'react'

type MessageSenderProps = {
    sender: any,
    receiverId: string,
}


const MessageSender = ({ sender, receiverId }: MessageSenderProps) => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]); // State to hold all messages
  
    useEffect(() => {
      // Function to fetch message history
      const fetchMessages = async () => {
        try {
          // Assuming you have a function fetchMessageHistory that makes an API call to get messages
          const fetchedMessages = await fetchMessageHistory(sender.id, receiverId);
          setMessages(fetchedMessages);
        } catch (error) {
          console.error('Failed to fetch messages:', error);
        }
      };
  
      fetchMessages();
    }, [sender.id, receiverId]); // Dependencies array to refetch when sender or receiver changes
  
    const handleSendMessage = async () => {
      if (message.trim()) {
        try {
          await createMessageAction(sender.id, receiverId, message);
          const newMessage = { id: Date.now(), text: message, sender: 'me' }; // Mocked new message object
          setMessages((prevMessages) => [...prevMessages, newMessage]); // Update message list with the new message
          setMessage(''); // Clear the input after sending
        } catch (error) {
          console.error('Failed to send message:', error);
        }
      }
    };

    return (
        <>
            <div className="messages-list">
                {messages.map((msg, index) => (
                    <div key={index} className="message">
                        {msg.text}
                    </div>
                ))}
            </div>
            <input
                type="text"
                className="form-control"
                placeholder="Type your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                style={{ width: "300px", height: "50px", marginBottom: "30px", marginTop: "70px" }}
            />
            <button type="button" className="btn btn-primary" onClick={handleSendMessage}>
                Send Message
            </button>

        </>
    );
};
  
  export default MessageSender;
  
  // Mock function to simulate fetching message history
  // Replace this with your actual API call to fetch messages
  async function fetchMessageHistory(senderId: any, receiverId: any) {
    // Your API call logic here
    return [
      // Mock messages
      { id: 1, text: 'Hello', sender: senderId },
      { id: 2, text: 'Hi there!', sender: receiverId },
    ];
  }