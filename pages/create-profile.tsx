import { useAuth } from '@/contexts/auth'
import clsx from 'clsx'
import React, { useEffect, useState } from 'react'
import { doc, setDoc } from "firebase/firestore";
import { db } from '@/firebase';
import { useRouter } from 'next/router';


export default function Profile() {

    const { user, profile } = useAuth()
    const router = useRouter()

    const [name, setName] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    console.log("User", user)

    const createProfile = () => {
        console.log("Creating profile ")
        if (user) {
            setIsLoading(true)
            const cityRef = doc(db, 'profiles', user.uid);
            setDoc(cityRef, {
                id: user.uid,
                name: name,
                displayName: name,
                createdAt: new Date(),
                updatedAt: new Date()

            }, { merge: true });
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (user && profile) {
            router.push("/app")
        }


    }, [user, profile, router])


    return (
        <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                        Create your profile
                    </h2>

                </div>
                <div className="mt-8 space-y-6">
                    <input type="hidden" name="remember" defaultValue="true" />
                    <div className="space-y-px  shadow-sm">
                        <div>
                            <label htmlFor="fullName" className="">
                               Full Name
                            </label>
                            <input
                                id="fullName"
                                name="fullName"
                                type="text"
                                required
                                className="relative block w-full appearance-none rounded-none  border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                placeholder="Your Full Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button

                            className="group relative flex w-full justify-center  border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            onClick={createProfile}

                        >
                            {isLoading ? "Creating a profile ..." : "Create Profile"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
