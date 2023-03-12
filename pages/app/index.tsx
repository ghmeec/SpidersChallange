import { useAuth } from '@/contexts/auth'
import { useRouter } from 'next/router'
import React from 'react'
import { signOut } from "firebase/auth";
import { auth } from '@/firebase';

import Home from "../../components/chat"

export default function ChatApp() {
  const { profile } = useAuth()
  const router = useRouter()

  const logOut = () => {
    signOut(auth).then(() => {
      router.replace("/")
    }).catch((error) => {
      // An error happened.
      alert("Something went wrong " + JSON.stringify(error))
    });
  }
  return (
    <Home />
  )
  
}
