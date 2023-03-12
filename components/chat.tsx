import React, { useState, useEffect } from 'react';
// import from 'react';
import Style from "../styles/chat.module.scss"
import { BsSearch, BsThreeDotsVertical, BsEmojiHeartEyes, BsMic } from 'react-icons/bs';
import { IoAttachOutline } from 'react-icons/io5';
import { db, auth } from '../firebase';
import { collection, getDocs, doc, addDoc, onSnapshot, serverTimestamp, orderBy, query, FieldValue, Timestamp } from "firebase/firestore";
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/auth';
import Sidebar from "./sidebar"

type Message = {
    name: string
    message: string,
    timestamp: Timestamp,
    createdAt: Timestamp,
    updatedAt: Timestamp
}

const Chat = () => {
    const [input, setInput] = useState('');

    const router = useRouter()
    const { roomId } = router.query;

    const [roomName, setRoomName] = useState('');
    const [message, setMessage] = useState<Message[]>([]);
    const connRef = collection(db, 'rooms');
    const { user, profile } = useAuth();

    useEffect(() => {
        if (roomId) {
            const getRoomName = async () => {
                onSnapshot(doc(connRef, roomId), (snapshot) => {
                    setRoomName(snapshot.data().name);
                });
            }


            const getMessages = async () => {
                const qq = query(collection(connRef, roomId, 'messages'), orderBy('timestamp', 'asc'));
                onSnapshot(qq, (snapshot) => {
                    setMessage(snapshot.docs.map((doc) => doc.data()));
                });
            }
            getRoomName();
            getMessages();



        }

    }, [roomId]);



    const sendMessage = (e) => {
        e.preventDefault();
        if (roomId) {
            const final = {
                message: input,
                name: profile?.displayName,
                timestamp: new Date(),
                createdAt: new Date(),
                updatedAt: new Date()
            }
            console.log("Final ")
            console.log(final)
            const addMessage = async () => {
                await addDoc(collection(connRef, roomId, 'messages'), {
                    ...final
                });
            }
            addMessage();
        }
        setInput('');
    }


    return (
        < div className={`${Style.app__chat}`
        }>
            <div className={`${Style.chat__header}`}>
                <div className={`w-12`}>
                    <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="" />
                </div>
                <div className='ml-2 flex-1'>
                    <h2 className='font-medium'>{roomName}</h2>
                    <p className='text-xs'>Last seen today at 10:30 PM </p>
                </div>
               
            </div>
            <div className={`${Style.chat__body} bg-[#e5ddd5]`}>
                {
                    message.map((msg) => (
                        <div className={`${Style.chat__message} ${msg.name == profile?.displayName ? Style.chat__receiver : ''} `}>
                            {
                                msg.name == profile?.displayName ?
                                    '' : <span className={`${Style.chat__name}`}>{msg.name}</span>

                            }
                            <p>{msg.message}<span className={`${Style.chat__timestamp}`}>{new Date(msg.timestamp.toDate()).toUTCString()}</span></p>
                        </div>


                    ))
                }



            </div>
            <div className={`${Style.chat__footer} px-4`}>
                <div className={`${Style.chat__massage__box}`}>
                    <form action="" className={`${Style.send__message_form}`}>
                        <input value={input} onChange={(e) => {
                            setInput(e.target.value)
                        }} className={`flex-1 rounded-sm`} type="text" placeholder="Type a message" />
                        <button onClick={sendMessage} type="submit" className='hidden'>Send</button>
                    </form>
                </div>

            </div>
        </ div>
    );
}

const ChatRoom = () => {
    return (
        <div className={`grid place-items-center bg-[#ececec] min-h-screen `}>
            <div className={`h-[100vh] w-[100vw] overflow-hidden flex`}>
                <Sidebar />
                <Chat />
            </div>
        </div>
    )
}
// export default Chat;
export default ChatRoom