import React from 'react'
import Profile from './_components/Profile'

function page({params}:any) {
  const {id} = params
  return (
    <Profile id={id}/>
  )
}

export default page