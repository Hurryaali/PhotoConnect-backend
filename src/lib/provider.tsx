"use client"

import { Toaster } from 'react-hot-toast';
import { SessionProvider } from "next-auth/react";



export function Providers({ children, session }: any) {
    return (
        <SessionProvider session= { session } >

            <Toaster
          position="top-right"
        />
        { children }
        </SessionProvider>
  );
}