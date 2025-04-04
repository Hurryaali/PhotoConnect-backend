import React from 'react'
import ContractDetail from '../_components/DetailView'

async function page({ params ,searchParams }: any) {
    const { id } = params
    const { user } = await searchParams
    return (
        <ContractDetail id={id} isDesigner={user =="DESIGNER"} />
    )
}


export default page