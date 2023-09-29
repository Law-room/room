'use client'
import { pusherClient } from '@/lib/pusher'
import { chatHrefConstructor, toPusherKey } from '@/lib/utils'
import { Session } from 'inspector'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { FC, useEffect, useState } from 'react'
import UnseenChatToast from './UnseenChatToast'
import toast from 'react-hot-toast'

interface SidebarChatListProps {
    friends: User[]
    sessionId: string
  }
interface ExtendedMessage extends Message {
    senderImg: string
    senderName: string
}

const SidebarChatList: FC<SidebarChatListProps> = ({friends,sessionId}) => {
    const [unseenMessages, setUnseenMessages] = useState<Message[]>([])
    const router = useRouter()
    const pathname = usePathname()
    const [activeChats, setActiveChats] = useState<User[]>(friends)
    
    useEffect(() => {
      pusherClient.subscribe(toPusherKey(`user:${sessionId}:chats`))
      pusherClient.subscribe(toPusherKey(`user:${sessionId}:friends`))
  
      const newFriendHandler = (newFriend: User) => {
        console.log("received new user", newFriend)
        setActiveChats((prev) => [...prev, newFriend])
      }
  
      const chatHandler = (message: ExtendedMessage) => {
        const shouldNotify =
          pathname !==
          `/dashboard/chat/${chatHrefConstructor(sessionId, message.senderId)}`
  
        if (!shouldNotify) return
  
        // should be notified
        toast.custom((t) => (
          <UnseenChatToast
            t={t}
            sessionId={sessionId}
            senderId={message.senderId}
            senderImg={message.senderImg}
            senderMessage={message.text}
            senderName={message.senderName}
          />
        ))
  
        setUnseenMessages((prev) => [...prev, message])
      }
  
      pusherClient.bind('new_message', chatHandler)
      pusherClient.bind('new_friend', newFriendHandler)
  
      return () => {
        pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:chats`))
        pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:friends`))
  
        pusherClient.unbind('new_message', chatHandler)
        pusherClient.unbind('new_friend', newFriendHandler)
      }
    }, [pathname, sessionId, router])

    
    useEffect(()=>{
        if(pathname?.includes('chat')){
            setUnseenMessages((prev) => {
                return prev.filter((msg) => !pathname?.includes(msg.senderId))
            })
        }
    },[pathname])

    
  return (
    <ul role='list'  className='max-h-[25rem] overflow-y-auto  space-y-1'>
      {friends.sort().map((friend) => {
        const unseenMessagesCount = unseenMessages.filter((unseenMsg) => {
          return unseenMsg.senderId === friend.id
        }).length

        return <li key={friend.id}>
            <a href={`/dashboard/chat/${chatHrefConstructor(sessionId, friend.id)}`}
            className='flex items-center'> 
            <div className='h-auto w-full items-center  flex gap-4 p-3 border-b border-zinc-600
            rounded-sm  hover:bg-zinc-600 transition ease-in-out duration-300 hover:rounded-lg hover:border-zinc-400 '>
              <div>
                <Image
                width={20}
                height={20}
                referrerPolicy='no-referrer'
                className='rounded-full w-10 h-10'
                src={friend.image || ''}
                alt='Your profile picture'/>
              </div>
              <div>
                {friend.name}
              </div>
              {unseenMessagesCount > 0 ? (
                  <div className='bg-green-600 font-medium text-xs text-white w-4 h-4 p-3 rounded-full flex justify-center items-center'>
                    {unseenMessagesCount}
                  </div>
                ) : null}
            </div>
            </a>
        </li>
        
        })}
    </ul>
  )
}

export default SidebarChatList