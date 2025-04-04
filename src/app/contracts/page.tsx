"use client"

import { useUser } from '@/hooks/userSession';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { ClipLoader } from 'react-spinners'
import AllContract from './_components/AllContract';

function page() {
    const [loading, setLoading] = useState(false)
    const [contracts, setContracts] = useState([])
    const { user } = useUser()
    const fetchContracts = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/contract`
            );
            console.log(response.data, "this is datat")
            if (user?.userType == 'USER') {
                const filteredContracts = response.data.data.filter((contract: any) => {
                    return contract.clientId == user.id
                })
                setContracts(filteredContracts)
            } else {
                const filteredContracts = response.data.data.filter((contract: any) => {
                    return contract.freelancerId == user?.id
                })
                setContracts(filteredContracts)

            }

        } catch (error) {
            console.error("Error fetching posts:", error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (user) {
            fetchContracts()
        }
    }, [user])
    if (loading) {
        return (

            <div className="flex justify-center items-center min-h-[50vh]">
                <ClipLoader color="#0066ff" size={50} />
            </div>
        )
    }

    return (
        <AllContract contracts={contracts} user={user}  />
    )
}

export default page