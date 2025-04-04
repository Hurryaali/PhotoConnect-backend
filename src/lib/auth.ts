import { AuthOptions, getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { cookies } from "next/headers";
import { DefaultUser } from "next-auth";
import axiosInstance from "./axios";

declare module "next-auth" {
    interface User extends DefaultUser {
        id?: string;
        userType?: string;
        follower?: any[];
        followerCount?: number;
        followingCount?: number;
        following?: any[];
        profileImage?: string;
        bannerImage?: string;
        createdAt?: string;
        token?: string;
    }

    interface Session {
        user: {
            id?: string;
            userType?: string;
            follower?: any[];
            followerCount?: number;
            followingCount?: number;
            following?: any[];
            profileImage?: string;
            bannerImage?: string;
            createdAt?: string;
            token?: string;
        } & DefaultUser;
    }

    interface JWT {
        id?: string;
        userType?: string;
        follower?: any[];
        followerCount?: number;
        followingCount?: number;
        following?: any[];
        profileImage?: string;
        bannerImage?: string;
        createdAt?: string;
        token?: string;
    }
}

const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            type: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                try {
                    const credentialDetails = {
                        email: credentials?.email,
                        password: credentials?.password,
                    };
                    const response = await axiosInstance.post(
                        "/api/user/login",
                        credentialDetails
                    );
                    const user = response.data;
                    if (user.data) {
                        // Set token as cookie
                        (await cookies()).set("user-token", user.data.token, {
                            expires: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
                            sameSite: "strict",
                            path: "/",
                        });
                        return {
                            id: user.data.id,
                            email: user.data.email,
                            name: user.data.name,
                            userType: user.data.userType,
                            follower: user.data.follower,
                            followerCount: user.data.followerCount,
                            following: user.data.following,
                            followingCount: user.data.followingCount,
                            profileImage: user.data.profileImage,
                            bannerImage: user.data.bannerImage,
                            createdAt: user.data.createdAt,
                            token: user.data.token,
                        };
                    } else {
                        throw new Error("Invalid Credentials");
                    }
                } catch (error: any) {
                    console.log("🚀 ~ authorize ~ error:", error.response.data.message);
                    throw new Error(
                        error.response.data.message || "Authorization error"
                    );
                }
            },
        }),
    ],
    pages: {
        signIn: "/login",
        error: "/login",
    },
    session: {
        maxAge: 14 * 24 * 60 * 60,
        updateAge: 14 * 24 * 60 * 60,
    },
    callbacks: {
        async signIn({ account }) {
            return true;
        },
        async jwt({ token, user, account, trigger, session }) {
            if (trigger === "update" && session?.user) {

                console.log(session.user)
                token.name = session.user.name;
                token.followingCount = session.user.followingCount;
                token.follower = session.user.follower;
                token.followerCount = session.user.followerCount;
                token.following = session.user.following;
                token.profileImage = session.user.profileImage;
                token.bannerImage = session.user.bannerImage;
            }
            if (account && user) {
                token.id = user.id;
                token.email = user.email;
                token.name = user.name;
                token.userType = user.userType;
                token.follower = user.follower;
                token.followerCount = user.followerCount;
                token.following = user.following;
                token.followingCount = user.followingCount;
                token.profileImage = user.profileImage;
                token.bannerImage = user.bannerImage;
                token.createdAt = user.createdAt;
                token.token = user.token;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user = {
                    id: token.id as string,
                    email: token.email as string,
                    name: token.name as string,
                    userType: token.userType as string,
                    follower: token.follower as any | undefined,
                    followerCount: token.followerCount as number | undefined,
                    following: token.following as any | undefined,
                    followingCount: token.followingCount as number | undefined,
                    profileImage: token.profileImage as any | undefined,
                    bannerImage: token.bannerImage as any | undefined,
                    createdAt: token.createdAt as any | undefined,
                    token: token.token as any | undefined,
                };
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
    jwt: {
        maxAge: 14 * 24 * 60 * 60,
    },
};

const getSession = () => getServerSession(authOptions);

export { authOptions, getSession };
