import React, { useEffect } from 'react';
import { useState } from 'react';
import { FiMoreVertical } from 'react-icons/fi';
import { BsFillChatLeftTextFill } from 'react-icons/bs';

import Style from '../styles/sidebar.module.scss';
import SidebarChat from './sidebar-chat';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';

//firebase
import { db,auth } from '../firebase';
import { collection, onSnapshot, doc, addDoc } from "firebase/firestore";
import { signOut } from 'firebase/auth';
import { useAuth } from '@/contexts/auth';

type Room = {
    id: string;
    name: string;
}

const Sidebar = () => {
    const [menu, setMenu] = useState(false);
    const [addNew, setAddNew] = useState(false);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [NewRoomName, setNewRoomName] = useState('');

    const connRef = collection(db, "rooms");
    const { user, profile } = useAuth();

    useEffect(() => {
        const getRooms = async () => {
            onSnapshot(connRef, (snapshot) => {
                setRooms(snapshot.docs.map((doc) => {
                    return ({ id: doc.id, ...doc.data() }) as Room
                }));
            });
        };
        getRooms();



    }, []);

    const addNewRoom = () => {
        if (NewRoomName) {
            const addNewRoom = async () => {
                await addDoc(connRef, {
                    name: NewRoomName
                });
            }
            addNewRoom();

        }
        setNewRoomName('');
        setAddNew(false);

    }

    return (
        <div className={`${Style.sidebar}`}>
            {/* sidebar header  */}
            <div className={`flex justify-between px-4 py-2`}>
                <div className="flex items-center space-x-3">

                    <button className={`${Style.sidebar__btn_head} h-12 w-12 bg-red-500 rounded-full`}>
                        {/* <img src={user.photoURL} alt="user" srcSet="" /> */}
                    </button>
                    <div>
                        <p className='text-slate-900'>Welcome</p>
                        <p className='text-slate-900'>{profile?.displayName}</p>
                    </div>
                </div>
                <div className={`inline-flex relative z-10 `}>

                    <button className={`${Style.sidebar__btn} rounded-full`} onClick={() => setAddNew(!addNew)}

                    ><BsFillChatLeftTextFill /></button>

                    <div className={`bg-slate-400 py-4 px-4 d absolute   ${Style.addnew__room}  ${addNew ? 'block' : 'hidden'} `} id="addnewChat__container" >
                        <div className="space-y-4" >
                            <input value={NewRoomName} onChange={(e) => {
                                setNewRoomName(e.target.value);
                            }} className=' px-1 border-none outline-none py-1 h-10' type="text" placeholder='Add new Room' name="newChat" id="" />
                            <button className='bg-slate-900 text-white px-6 py-2 d' type="submit" onClick={addNewRoom} >add new</button>
                        </div>
                    </div>

                    <button onClick={() => setMenu(!menu)} className={`${Style.sidebar__btn} rounded-full`}><FiMoreVertical /> </button>
                    <div className={`py-2 bg-white flex-col absolute top-full right-0 d overflow-hidden shadow-xl  ${menu ? 'flex' : 'hidden'} `}>
                        <button className={` bg-white hover:bg-[#ebebeb] w-28 py-1`} onClick={() => { signOut(auth) }} >Log Out</button>

                    </div>


                </div>
            </div>

            {/* sidebar search  */}
            <div className="mb-2">
                <div className="w-full px-4 pl-0">
                    <div className="relative w-full mx-3 d shadow-sm">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                        <input
                            type="text"
                            name="account-number"
                            id="account-number"
                            className="pl-10 block w-full d border-gray-300 pr-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            placeholder="Search or Start new Chat"
                        />

                    </div>
                </div>
            </div>

            {/* sidebar chats */}
            <div className={`${Style.sidebar__chat}`}>
                {
                    rooms.map(room => (
                        <SidebarChat key={room.id} id={room.id} name={room.name} message={"hey ! i'm using whatapp"} />
                    ))
                }


            </div>
        </div>
    );
}
export default Sidebar;