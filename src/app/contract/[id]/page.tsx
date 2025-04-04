import React from 'react'
import ContractPage from './_components';

async function Page({ searchParams, params }:any) {
  console.log("🚀 ~ Page ~ params:", params);
  console.log("🚀 ~ Page ~ searchParams:", searchParams);

  const { id } = params;

  const { designer, email, profile } = await searchParams;
  
  return (
    <ContractPage id={id} designer={designer} email={email} profile={profile}/>
  )
}

export default Page