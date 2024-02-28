
import React, { useEffect } from 'react';
import { getUserById, searchUsersByName } from '../services/userService'
import { User, } from '@prisma/client'
import MessageSender from './components/messageSender'
import './styles.css';
import SearchUser from './components/searchUser'
import { getServerSession } from "next-auth";
import { authOptions } from '../api/auth/[...nextauth]/route'
import { getMessagePartners, getMessagesDelivered } from '../services/messageService'
import { MessageDelivered } from '../lib/types';
import MessagingPartners from './components/messagingPartners';
import ChatContainer from './components/chatContainer';


const MessagePage = async ({ searchParams }: { searchParams: { searchUser: string, selectedUserId: string } }) => {
    const session = await getServerSession(authOptions);
    let users: User[] = [];
    let partners: any[] = [];
    let messages: MessageDelivered[] = [];
    partners = await getMessagePartners(session?.user.id);
    if (searchParams?.searchUser) {
        users = await searchUsersByName(searchParams?.searchUser) as User[]
    }
    let selectedUser: any;
    if (searchParams.selectedUserId) {
        messages = [];
        selectedUser = await getUserById(searchParams.selectedUserId);
        if (session?.user.id) {
            const result = await getMessagesDelivered(session?.user.id, selectedUser?.id)
            if (result) {
                messages = result;
            }
        }
        if (partners) {
            partners.forEach(s => {
                if (s.id === selectedUser.id) {
                    s.isSelected = true;
                }
            })
        }
    }


    return (
        <>
            {session?.user ? (
                <div className='message-container'>
                    <div className='selectedUsers-list'>
                        <SearchUser users={users} />
                        <MessagingPartners partners={partners} />
                    </div>
                    <div className='chat-interface'>
                        <ChatContainer messages={messages} />
                        <MessageSender sender={session?.user} receiverId={selectedUser?.id} />
                    </div>
                </div>
            ) : (
                <h2 className='mt-3 p-3 text-center'>로그인 하시면 메시지를 사용하실 수 있습니다.</h2>
            )}
        </>
    );

}
export default MessagePage