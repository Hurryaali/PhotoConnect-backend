import React from 'react'
import SignupPage from './_components/Signup'
import Image from 'next/image'

function page() {
  return (
    <div className="relative flex items-center justify-center  ">
      {/* <div className="absolute -top-40 left-0 w-full h-[34rem] sm:h-[30rem] bg-gradient-to-r from-orange-400 via-purple-500 to-blue-400 transform -skew-y-6" /> */}


      {/* <main className="relative w-full">
        <Image
          src={'/register.jpg'}
          alt='regitserImage'
          layout='fill'
        />
      </main> */}
      <main className="relative flex items-center max-w-xl justify-center p-2 sm:p-6 w-full">
        <SignupPage />
      </main>
    </div>
  )
}

export default page