import { getToken } from "next-auth/jwt";
import {  NextRequest, NextResponse } from "next/server";

export default async function middleware(
    req: NextRequest,
) {
    const session = await getToken({ req: req as any });
    const isAuthenticated = !!session;
    console.log("🚀 ~ session:", session)
    console.log("🚀 ~ isAuthenticated:", isAuthenticated)

    const url = req.nextUrl.clone();
    if (req.nextUrl.pathname.startsWith("/login") && isAuthenticated) {
        return NextResponse.redirect(url);
    }

    if (req.nextUrl.pathname.startsWith("/profile") && !isAuthenticated) {
        url.pathname = "/login";
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/profile", "/profile/:path*", "/", "/login"],
};