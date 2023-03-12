import { useRouter } from 'next/router'
import React from 'react'
import Chat from "../../../components/chat"

export default function ChatRoom() {
    const router = useRouter()
 
   return <Chat />
    
}
