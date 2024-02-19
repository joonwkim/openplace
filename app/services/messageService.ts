import prisma from '@/prisma/prisma'
import { MessageDelivered, MessagingPartner, } from '../lib/types'
import { send } from 'process'

export async function createMessage(senderId: string, receiverId: string, message: string) {
    console.log(senderId)
    console.log(receiverId)

    const msg = await prisma.message.create({
        data: {
            creatorId: senderId,
            message: message,
        }
    })

    console.log('message created:', msg)

    if (msg) {
        const rcvr = await prisma.messageRecipient.create({
            data: {
                messageId: msg.id,
                recepientId: receiverId,
                isRead: true,
            }
        })
        console.log('receipient: ', rcvr)
    }
}

// export const getMessageSenders = async (loginUserId: string) => {
//     const messageSenders = await prisma.message.findMany({
//         where: {
//             messageRecipients: {
//                 some: {
//                     recepientId: loginUserId,
//                 }
//             }
//         },
//         select: {
//             creator: {
//                 select: {
//                     id: true,
//                     name: true,
//                     email: true,
//                     profile: true,
//                     googleLogin: true,
//                     isActive: true,
//                     image: true,
//                 }
//             }
//         }
//     })

//     const distinctUsers = messageSenders.filter((value, index, array) => array.findIndex(t => t.creator.email === value.creator.email) === index);
//     return distinctUsers;
// }

export const getMessages = async (senderId: string | null, recepientId: string | null) => {
    if (senderId && recepientId) {
        const messages = await prisma.message.findMany({
            where: {
                creatorId: senderId,
                messageRecipients: {
                    some: {
                        recepientId: recepientId,
                    }
                }
            },
        })
        // console.log('messages:', JSON.stringify(messages, null, 2))
        return messages;


        // messageSent.forEach(async s => {
        //     const mr = await prisma.messageRecipient.findFirst({
        //         where: {
        //             recepientId: recepientId,
        //             messageId: s.id
        //         }
        //     })
        //     const ms = {
        //         title: s.title,
        //         message: s.message,
        //         deliveryType: 'sent',
        //         createdAt: s.createdAt,
        //         isRead: mr !== null ? mr.isRead : false,
        //     }
        //     messagesDelivered.push(ms)
        // })
        // console.log('messagesDelivered:', JSON.stringify(messagesDelivered, null, 2))

        // const messageReceived = await prisma.message.findMany({
        //     where: {
        //         creatorId: recepientId,
        //         messageRecipients: {
        //             some: {
        //                 recepientId: senderId,
        //             }
        //         }
        //     },
        // })

        // console.log('messageReceived:', JSON.stringify(messageReceived, null, 2))
        // messageReceived.forEach(async s => {
        //     const mr = await prisma.messageRecipient.findFirst({
        //         where: {
        //             recepientId: recepientId,
        //             messageId: s.id
        //         }
        //     })
        //     const ms = {
        //         title: s.title,
        //         message: s.message,
        //         deliveryType: 'received',
        //         createdAt: s.createdAt,
        //         isRead: mr !== null ? mr.isRead : false,
        //     }
        //     messagesDelivered.push(ms)
        // })
        // console.log('messagesDelivered:', JSON.stringify(messagesDelivered, null, 2))
        // return messagesDelivered
    }
}
export const getMessagesDelivered = async (senderId: string | null, recepientId: string | null) => {
    let messagesDelivered: MessageDelivered[] = []
    const msgSent = await getMessages(senderId, recepientId);
    // console.log('msgSent:', JSON.stringify(msgSent, null, 2))
    if (msgSent) {
        msgSent.forEach(async s => {
            const ms = {
                title: s.title,
                message: s.message,
                deliveryType: 'sent',
                createdAt: s.createdAt,
                isRead: false
            }
            messagesDelivered.push(ms)
        })
    }

    const msgRdvd = await getMessages(recepientId, senderId);

    if (msgRdvd) {
        msgRdvd.forEach(async s => {
            const ms = {
                title: s.title,
                message: s.message,
                deliveryType: 'received',
                createdAt: s.createdAt,
                isRead: false,
            }
            messagesDelivered.push(ms)
        })
    }

    const sortedByCreatedAt = messagesDelivered.sort((a: any, b: any) => a.createdAt - b.createdAt)
    return sortedByCreatedAt
}

const getMessageRecepientBySenderId = async (id: string) => {

    const recepients = await prisma.message.findMany({
        where: {
            creatorId: id,
        },
        select: {
            createdAt: true,
            messageRecipients: {
                select: {
                    recepient: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            profile: true,
                            googleLogin: true,
                            isActive: true,
                            image: true,
                        }
                    }
                }
            }
        }
    })

    const sortedByCreatedAt = recepients.sort((a: any, b: any) => b.createdAt - a.createdAt)
    // console.log('recepients:', JSON.stringify(sortedByCreatedAt, null, 2))
    return recepients;
}

const getMessageSenderByRecepientId = async (recepientId: string) => {
    const senders = await prisma.message.findMany({
        where: {
            messageRecipients: {
                some: {
                    recepientId: recepientId,
                }
            }
        },
        select: {
            createdAt: true,
            creator: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    profile: true,
                    googleLogin: true,
                    isActive: true,
                    image: true,
                }
            },
        }
    })

    const sortedByCreatedAt = senders.sort((a: any, b: any) => b.createdAt - a.createdAt)
    // console.log('senders:', JSON.stringify(sortedByCreatedAt, null, 2))
    return senders;
}

export const getMessagePartners = async (userId: string) => {
    const partners: MessagingPartner[] = []
    const senders = await getMessageSenderByRecepientId(userId)
    senders.forEach(s => {
        const pt: MessagingPartner = {
            id: s.creator.id,
            name: s.creator.name,
            email: s.creator.email,
            profile: s.creator.profile,
            googleLogin: s.creator.googleLogin,
            isActive: s.creator.isActive,
            image: s.creator.image,
            lastMsgCreatedAt: s.createdAt,
        }
        partners.push(pt);
    })

    const recepients = await getMessageRecepientBySenderId(userId)
    recepients.forEach(s => {
        s.messageRecipients.forEach(t => {
            if (t.recepient) {
                const pt: MessagingPartner = {
                    id: t.recepient.id,
                    name: t.recepient.name,
                    email: t.recepient.email,
                    profile: t.recepient.profile,
                    googleLogin: t.recepient.googleLogin,
                    isActive: t.recepient.isActive,
                    image: t.recepient.image,
                    lastMsgCreatedAt: s.createdAt,
                }
                partners.push(pt);
            }
        })
    })
    const pns = partners.filter((value, index, array) => array.findIndex(t => t.email === value.email) === index);
    return pns;
}