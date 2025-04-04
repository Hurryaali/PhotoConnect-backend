import React, { Suspense } from 'react'
import LoginPage from './_components/Login'
import Image from 'next/image'

function page() {
    return (
        <div className="relative flex items-center justify-center  ">


            <main className="relative flex items-center max-w-xl justify-center p-2 sm:p-6 w-full">

                <Suspense>
                    <LoginPage />
                </Suspense>
            </main>
            {/* <main className="relative h-screen w-full">
                <Image
                    src={'/login.jpg'}
                    alt='regitserImage'
                    layout='fill'
                />
            </main> */}
        </div>
    )
}

export default page