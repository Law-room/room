'use client'

import { FC, useRef, useState } from 'react'
import Button from './ui/Button'
import TextareaAutosize from 'react-textarea-autosize'
import axios from 'axios'
import toast from 'react-hot-toast'

interface ChatInputProps {
    chatPartner: User
    chatId: string
}

const ChatInput: FC<ChatInputProps> = ({ chatPartner, chatId }) => {

    const textareaRef = useRef<HTMLTextAreaElement | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [input, setInput] = useState<string>('')

    const sendMessage = async () => {
        if(!input) return
        setIsLoading(true)
    
        try {
          await axios.post('/api/message/send', { text: input, chatId })
          setInput('')
          textareaRef.current?.focus()
        } catch {
          toast.error('Something went wrong. Please try again later.')
        } finally {
          setIsLoading(false)
          
        }
      }

  return (
    <div className=' border-gray-200 pt-4 mb-2 sm:mb-0'>
    <div className='relative flex-1 overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-green-600 transition'>
        <TextareaAutosize
        ref={textareaRef}
        onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            sendMessage()
            }
        }}
        rows={1}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={`Message ${chatPartner.name}`}
        className='block w-full resize-none border-0 bg-transparent text-zinc-200 placeholder:text-gray-400 focus:ring-0 sm:py-1.5 sm:text-sm sm:leading-6 '
        />

        <div
        onClick={() => textareaRef.current?.focus()}
        className='py-2'
        aria-hidden='true'>
        <div className='py-px'>
            <div className='h-auto justify-center items-center' />
        </div>
        </div>

        <div className='absolute right-0 bottom-0 flex justify-between py-2 pl-3 pr-2'>
        <div className='flex-shrin-0'>
            <Button isLoading={isLoading} onClick={sendMessage} type='submit' className=' hover:bg-green-500 text-zinc-100'>
                Send 
            </Button>
        </div>
        </div>
    </div>
    </div>
)
}

export default ChatInput