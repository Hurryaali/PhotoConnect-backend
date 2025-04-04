"use client"

import { useUser } from '@/hooks/userSession'
import Image from 'next/image'
import React from 'react'
import { FiSearch } from 'react-icons/fi'
import { UserNav } from './UserModel'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

function Header() {
    const { user } = useUser()
    return (
        <div className="border-b-[1px] py-3 bg-gray-100 border-white">
            <div className="max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4">
                <div className="flex flex-row items-center justify-between gap-3 md:gap-0">
                    <Link
                        href="/"
                        className="text-2xl font-light text-black transition-all duration-300 ease-in-out"
                    >
                        <span className="font-medium">Photo</span>Connect
                    </Link>
                   

                    {
                        user ?
                            <UserNav data={user} />
                            :
                            <div className="flex items-center gap-4">
                                <Link href={'/login'}>
                                <button className=" px-4 py-2 text-gray-600 hover:text-gray-900 transition">
                                    Login
                                </button>
                                </Link>
                                <Link href={'/signup'}>
                                    <button className="px-4 py-2 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 transition">
                                      Join Now
                                    </button>
                                </Link>
                            </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default Header