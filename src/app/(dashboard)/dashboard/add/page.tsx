import AddFriendButton from '@/components/AddFrindButton'
import { FC } from 'react'


const page: FC  = ({}) => {
  return (
    <main className='pt-8 h-full bg-zinc-900'>
        <h1 className='text-3xl font-bold pb-10 text-zinc-300 '>Add a Roommate</h1>
        <AddFriendButton/>
    </main>
  )
}

export default page