import { authOptions } from '@/lib/auth'
import { getServerSession} from 'next-auth'
import { FC } from 'react'

const page  = async ({}) => {
    const session = await getServerSession(authOptions)    
      return(
      <div className='h-full w-full items-center justify-center flex text-3xl font-extrabold text-zinc-600 flex-col'>
        <div>
        your Chats are save here !
        </div>
        <div className='text-sm '>
          <div>
          1- Add friend
          </div>
          <div>
          2- Let Your Friend Conferm Your Request
          </div>
          <div>
          3- Click On Your Friend Icon to Start Chat
          </div>
          <div>
          4- Have fun 🦋🔥
          </div>
        </div>
        </div>
)}

export default page