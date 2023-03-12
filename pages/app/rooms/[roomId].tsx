import { useRouter } from 'next/router'
import React from 'react'
import Chat from "../../../components/chat"

export default function ChatRoom() {
    const router = useRouter()

    console.log("Route ", router.asPath)
    return (
        <Chat />
    )
}
