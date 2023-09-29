'use client'

import { pusherClient } from '@/lib/pusher'
import { toPusherKey } from '@/lib/utils'
import axios from 'axios'
import { Check, UserPlus, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { FC, useEffect, useState } from 'react'

interface FriendRequestsProps {
  incomingFriendRequests: IncomingFriendRequest[]
  sessionId: string
}

const FriendRequests: FC<FriendRequestsProps> = ({
  incomingFriendRequests,
  sessionId,
}) => {
  const router = useRouter()
  const [friendRequests, setFriendRequests] = useState<IncomingFriendRequest[]>(
    incomingFriendRequests
  )

  useEffect(() => {
    pusherClient.subscribe(
      toPusherKey(`user:${sessionId}:incoming_friend_requests`)
    )
    console.log("listening to ", `user:${sessionId}:incoming_friend_requests`)

    const friendRequestHandler = ({
      senderId,
      senderEmail,
    }: IncomingFriendRequest) => {
      console.log("function got called")
      setFriendRequests((prev) => [...prev, { senderId, senderEmail }])
    }

    pusherClient.bind('incoming_friend_requests', friendRequestHandler)

    return () => {
      pusherClient.unsubscribe(
        toPusherKey(`user:${sessionId}:incoming_friend_requests`)
      )
      pusherClient.unbind('incoming_friend_requests', friendRequestHandler)
    }
  }, [sessionId])

  const acceptFriend = async (senderId : string)=>{
    await axios.post('/api/friends/accept',{id : senderId})
    setFriendRequests((prev)=>
      prev.filter((request) => request.senderId !== senderId)
    )
    router.refresh()
  }
  const denyFriend = async (senderId : string)=>{
    await axios.post('/api/friends/deny',{id : senderId})
    setFriendRequests((prev)=>
      prev.filter((request) => request.senderId !== senderId)
    )
    router.refresh()
  }

  return (
    <>
      {friendRequests.length === 0 ? (
        <p className='text-sm text-zinc-500'>Nothing to show here...</p>
      ) : (
        friendRequests.map((request) => (
          <div key={request.senderId} className='flex gap-4 items-center bg-zinc-800 p-3 rounded-lg hover:shadow-zinc-600 shadowcss hover:bg-zinc-500 transition ease-in-out duration-150 justify-between'>
            <div className='flex gap-3'>
              <UserPlus className='text-zinc-300' />
              <p className='font-medium text-lg'>{request.senderEmail}</p>
            </div>

            <div className='flex gap-3'>
              <button
                onClick={ ()=> acceptFriend(request.senderId)}
                aria-label='accept friend'
                className='w-8 h-8 bg-green-700 hover:bg-green-500 grid place-items-center rounded-lg transition hover:shadow-md'>
                <Check className='font-semibold text-white w-3/4 h-3/4' />
              </button>

              <button
                onClick={ ()=> denyFriend(request.senderId)}
                aria-label='deny friend'
                className='w-8 h-8 bg-zinc-600 hover:bg-red-900 grid place-items-center rounded-lg transition hover:shadow-md'>
                <X className='font-semibold text-white w-3/4 h-3/4' />
              </button>
            </div>
          </div>
        ))
      )}
    </>
  )
}

export default FriendRequests