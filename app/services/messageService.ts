import prisma from '@/prisma/prisma'

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