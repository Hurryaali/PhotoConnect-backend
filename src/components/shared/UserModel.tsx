// src/components/UserNav.tsx

"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { signOut } from "next-auth/react";

export function UserNav({ data }: any) {
    console.log("🚀 ~ UserNav ~ data:", data)
    const router = useRouter();

    // const logout = () => {
    //     signOut()
    //     document.cookie = "user-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    //     window.location.pathname = "/"

    // }
    const logout = async () => {
        await signOut({ callbackUrl: "/" });
    };

    useEffect(() => {
        const handleKeydown = (e: any) => {
            if (e.ctrlKey && e.key.toLowerCase() === "p") {
                e.preventDefault();
                router.push(`${process.env.NEXT_PUBLIC_BASE_URL}/profile`);
            }
            if (e.ctrlKey && e.key.toLowerCase() === "c") {
                e.preventDefault();
                router.push(`${process.env.NEXT_PUBLIC_BASE_URL}/contracts`);
            }
            if (e.ctrlKey && e.key.toLowerCase() === "q") {
                e.preventDefault();
                logout(); // This should work now
            }
        };

        window.addEventListener("keydown", handleKeydown);
        return () => {
            window.removeEventListener("keydown", handleKeydown);
        };
    }, [router]);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-11 w-11 rounded-full">
                    <Avatar className="h-11 w-11" >
                        <AvatarImage src={data.profileImage} />
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                forceMount
                className="rounded-xl shadow-none border mt-1 border-primaryBlue"
            >
                <DropdownMenuLabel className="font-normal p- ">
                    <div className="flex flex-col   font-neueregrade  space-y-1">
                        <p className="text-sm font-medium ml-2 leading-none">
                            {(data && data.name) || "Guest"}
                        </p>
                        <p className="text-xs   leading-none ml-2 text-muted-foreground">
                            {(data && data.email) || "Not logged in"}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href="/profile">
                    <DropdownMenuItem className="gap-16 cursor-pointer items-center  font-neueregrade justify-between flex ">
                        My Account
                        <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                    </DropdownMenuItem>
                </Link>
                {
                    data?.userType == "DESIGNER" && 
                <Link href="/contracts">
                    <DropdownMenuItem className="gap-16 cursor-pointer items-center  font-neueregrade justify-between flex ">
                        My Contracts
                        <DropdownMenuShortcut>⇧⌘C</DropdownMenuShortcut>
                    </DropdownMenuItem>
                </Link>
                }
                <DropdownMenuItem
                    onSelect={logout}
                    className="gap-20 items-center cursor-pointer font-neueregrade justify-between flex"
                >
                    Log out
                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}