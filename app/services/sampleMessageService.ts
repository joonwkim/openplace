import prisma from '@/prisma/prisma'

//아래내용은 참고하시고 펼요한것은 messageService.ts를 만들어 그곳에서 Data를 관리하세요.
// 다른 service에 있는 include를 활용하여 data를 효과적으로 가져올 수 있도록 하세요

const createGroup = async () => {
    const users = await prisma.user.findMany({})

    for (let i = 0; i < 3; i++) {
        const group = await prisma.group.create({
            data: {
                name: `group${i}`
            }
        })
    }

}

const createUserGroup = async () => {
    const users = await prisma.user.findMany({})
    const groups = await prisma.group.findMany({})

    const ug = await prisma.userGroup.create({
        data: {
            userId: users[0].id,
            groupId: groups[0].id,
        }
    })
    const ug1 = await prisma.userGroup.create({
        data: {
            userId: users[1].id,
            groupId: groups[0].id,
        }
    })
    const ug2 = await prisma.userGroup.create({
        data: {
            userId: users[2].id,
            groupId: groups[0].id,
        }
    })
    const ug3 = await prisma.userGroup.create({
        data: {
            userId: users[3].id,
            groupId: groups[1].id,
        }
    })
    const ug4 = await prisma.userGroup.create({
        data: {
            userId: users[4].id,
            groupId: groups[2].id,
        }
    })

    const ugs = await prisma.userGroup.findMany({})
    console.log('ugs:', JSON.stringify(ugs, null, 2))

}

const createMessage = async () => {
    const users = await prisma.user.findMany({})
    for (let i = 0; i < 5; i++) {
        const msg = await prisma.message.create({
            data: {
                title: `test message`,
                message: `fjdajfdas fdaskfdakfjdak ${i}`,
                creatorId: users[i].id
            }
        })
    }
    const msgs = await prisma.message.findMany({})
    console.log('messages:', JSON.stringify(msgs, null, 2))
}

const createMessageRecipient = async () => {
    const groups = await prisma.group.findMany({})
    const messages = await prisma.message.findMany({})
    for (let i = 0; i < 5; i++) {
        if (messages[i]) {
            const msg = await prisma.messageRecipient.create({
                data: {
                    messageId: messages[i].id,
                    groupId: groups[0].id,
                }
            })
        }

    }
    const msgs = await prisma.messageRecipient.findMany({})
    console.log('messageRecipient:', JSON.stringify(msgs, null, 2))
}
