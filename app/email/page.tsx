import React from 'react'
import { searchUsersByName } from '../services/userService'
import { User } from '@prisma/client'
import MessageSender from './components/messageSender'
import Messenger from './components/messenger'

const EmailPage = async () => {

  const users = await searchUsersByName('j') as User[]
  // console.log('Users[0]:', users[0])
  // console.log('Users[1]:', users[1])


  return (<>
    <div className='row mt-3'>
      <div className='col-2'>
        {users?.length > 0 && (
          <div className='list-group' >
            {users?.map((user: User, index: number) => (<>
              <div key={user.id} className='list-group-item' >{user.name}</div>
            </>))}
          </div>
        )}
      </div>
      <div className='col-3'>
        <MessageSender sender={users[0]} receiverId={users[1].id} />

      </div>
    </div>
  </>

  )
}

export default EmailPage