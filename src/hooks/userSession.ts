"use client";
import { signOut, useSession } from "next-auth/react";


export const useUser = () => {
    const session = useSession();
    console.log("🚀 ~ useUser ~ session:", session)
    const user = session.data?.user
    const logoutUser = () => {
        signOut()
    }

    return { user, logoutUser };
}