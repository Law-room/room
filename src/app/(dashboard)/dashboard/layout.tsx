import { Icon, Icons } from '@/components/Icons'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { FC, ReactNode } from 'react'
import { fetchRedis } from '@/helpers/redis'
import  Image  from 'next/image'
import SignOutButton from '@/components/SignOutButton'
import FriendRequestSidebarOptions from '@/components/FriendRequestSidebarOptions'
import { getFriendsByUserId } from '@/helpers/get-friends-by-user-id'
import SidebarChatList from '@/components/SidebarChatList'

interface LayoutProps {
  children: ReactNode
}

interface SidebarOption {
  id: number 
  name: string
  href : string
  Icon : Icon
}

// Done after the video and optional: add page metadata
export const metadata = {
  title: 'FriendZone | Dashboard',
  description: 'Your dashboard',
}

const sidebarOptions: SidebarOption[] = [
  {
    id: 1,
    name: 'Add friend',
    href: '/dashboard/add',
    Icon: 'UserPlus',
  },
]

const Layout = async ({ children }: LayoutProps) => {
  const session = await getServerSession(authOptions)
  if (!session) notFound()
  
  const friends = await getFriendsByUserId(session.user.id)

  const unseenRequestCount = (await fetchRedis('smembers',`user:${session.user.id}:incoming_friend_requests`) as User[]).length
  
  return (
    <div className='w-full h-full flex bg-zinc-900 text-zinc-200'>
      <div className='flex m-1 w-full rounded-lg px-4 py-3 max-w-xs overflow-y-scroll flex-col gap-y-5 border-2 border-zinc-700 hidenscrollbare'>
        <Link href='/dashboard' className='flex h-16 shrink-0 items-center text-6xl text-zinc-200 font-extrabold '>
          R.
        </Link>
        {friends.length > 0 ?(<div className='text-xs font-semibold leading-6 text-zinc-500'>
          Your Rooms
        </div>): null}
        
          <nav className='flex flex-1 flex-col'>
            <ul role='list' className='flex flex-col flex-1 gap-y-7 '>
              <li>
                <SidebarChatList sessionId={session.user.id} friends={friends}/>
              </li> 
              <li>
                <div className='text-xs font-semibold leading-6 text-zinc-500'>
                  overview
                </div>
              </li>
            </ul>
            <ul role='list' className='flex flex-col flex-1 gap-y-7'>
              {sidebarOptions.map((option) => {
                const Icon = Icons[option.Icon]
                return (
                  <li key={option.id}>
                    <Link href={option.href} className='text-zinc-400 hover:text-zinc-200 flex gap-4 justify-center items-center w-full bg-zinc-800 p-3 rounded-lg hover:shadow-zinc-600 shadowcss hover:bg-zinc-500 transition ease-in-out duration-150   '>
                      <Icon className='w-6 h-6 font-bold' />
                      <span>{option.name}</span>
                    </Link>

                  </li>
                )
              })}

                <li>
                  <FriendRequestSidebarOptions
                    sessionId={session.user.id}
                    initialUnseenRequestCount={unseenRequestCount}
                  />
                </li>
              </ul>
        </nav>
            <div className='mt-5 p-2 flex items-center text-zinc-500 bg-zinc-950 rounded-lg'>
              <div className='flex flex-1 items-center gap-x-4 py-3 text-sm font-semibold leading-6'>
                <div className='relative h-12 w-12'>
                  <Image
                    fill
                    referrerPolicy='no-referrer'
                    className='rounded-full border-2 border-green-700'
                    src={session.user.image || ''}
                    alt='Your profile picture'
                  />
                </div>

                  <div className='flex flex-col'>
                    <span aria-hidden='true'>
                      {session.user.name}
                    </span>
                    <span className='text-xs text-zinc-500 ' aria-hidden='true'>
                      {session.user.email}
                    </span>
                  </div>
              </div>
              <SignOutButton className='h-full ' />
            </div>
      </div>
      <div className='px-2 m-1 border-2 border-zinc-700 rounded-xl w-full '>
        {children}
      </div>
    </div>
    

  )
}

export default Layout