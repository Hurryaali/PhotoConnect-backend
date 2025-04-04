"use client"

import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { ClipLoader } from 'react-spinners';
import PhotoGrid from './PhotoGrid';
import { useUser } from '@/hooks/userSession';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ReviewCarousel } from './Reviews';

function Profile({ id }: any) {
    const [loading, setLoading] = useState(true)
    const [Designer, setDesigner] = useState<any>({})
    const [reviews, setReviews] = useState<any>()
    console.log("🚀 ~ Profile ~ reviews:", reviews)
    const [loading2, setLoading2] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const { user } = useUser()
    const { update } = useSession()

    const router = useRouter()
    console.log("🚀 ~ Profile ~ Designer:", Designer)
    const fetchUser = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/${id}`
            );
            console.log(response.data, "this is datat")
            if (user && response.data.data.follower.includes(user?.id)) {
                setIsFollowing(true)
            }
            setDesigner(response.data.data);
            setReviews(response.data.review);
        } catch (error) {
            console.error("Error fetching posts:", error);
        } finally {
            setLoading(false);
        }
    };
    const handleFollowToggle = async () => {
        setLoading2(true);
        if (!user) {
            toast.error("Please Login to follow")
            setLoading2(false);
            return
        }
        if (user?.id == id) {
            toast.error("You cannot follow your own profile")
            setLoading2(false);
            return
        }
        try {
            const payload = {
                clientId: user?.id,
                userId: id

            }
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/follow`,
                payload
            );
            toast.success(response.data.message);
            const userData = response.data.data.clientUser
            console.log(userData, "this is for the testing")
            update({
                user: {
                    ...user,
                    followingCount: userData.followingCount,
                    follower: userData.follower,
                    followerCount: userData.followerCount,
                    following: userData.following,
                }
            })
            setIsFollowing((prev) => !prev);
        } catch (error) {
            // @ts-ignore
            toast.error(error.response?.data?.message || "Something went wrong, please try again."
            );
        } finally {
            setLoading2(false);
        }
    };
    useEffect(() => {
        if (id) {
            fetchUser()
        }
    }, [id])

    const hireDesigner = () => {
        if (!user) {
            toast.error("Please Login to hire")
            return
        }
        if (user?.userType != "USER") {
            toast.error("Please Login as a client to hire")
            return
        }
        router.push(`/contract/${Designer.id}?designer=${Designer.name}&&email=${Designer.email}&&profile=${Designer.profileImage}`)
    }
    if (loading) {
        return (

            <div className="flex justify-center items-center min-h-[50vh]">
                <ClipLoader color="#0066ff" size={50} />
            </div>
        )
    }
    return (
        <main className="flex-grow">
            {/* Hero Banner */}
            <div className="relative h-80 md:h-96 w-full bg-black">
                <div
                    className="absolute inset-0 opacity-70"
                    style={{
                        backgroundImage: `url(${Designer.bannerImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                <div className="container mx-auto  px-4 h-full flex items-end justify-between pb-8 relative z-10">
                    <div className="flex  flex-col md:flex-row items-start md:items-center gap-6">
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white overflow-hidden -mt-8 md:mt-0">
                            <img
                                src={Designer.profileImage}
                                alt={Designer.name}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div className="text-white">
                            <h1 className="text-3xl md:text-4xl font-light">
                                {Designer.name}
                            </h1>
                            <p className="text-white/80 mt-1">
                                {Designer.designerType} | {Designer.Location}
                            </p>

                        </div>
                    </div>
                    <button
                        onClick={handleFollowToggle}
                        disabled={loading}
                        className="w-[100px] sm:w-[150px] bg-white text-black py-3 hover:text-white rounded-full font-medium hover:bg-black/90 transition-colors flex items-center justify-center"
                    >
                        {loading2 ? (
                            <svg
                                className="animate-spin h-5 w-5 text-black"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                ></path>
                            </svg>
                        ) : isFollowing ? (
                            "Unfollow"
                        ) : (
                            "Follow"
                        )}
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Sidebar - About */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-sm p-6 sticky top-2">
                            <h2 className="text-2xl font-medium mb-4">About</h2>
                            <p className="text-gray-600 mb-8">{Designer.about}</p>

                            <h3 className="text-lg font-medium mb-3">Contact</h3>
                            <div className="space-y-3 mb-8">
                                {Designer.phoneNumber && (
                                    <div className="flex items-center text-gray-600">
                                        <svg
                                            className="w-5 h-5 mr-2"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1.5}
                                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                            />
                                        </svg>
                                        <span>{Designer.phoneNumber}</span>
                                    </div>
                                )}

                                {Designer.email && (
                                    <div className="flex items-center text-gray-600">
                                        <svg
                                            className="w-5 h-5 mr-2"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1.5}
                                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                            />
                                        </svg>
                                        <span>{Designer.email}</span>
                                    </div>
                                )}

                                {Designer.website && (
                                    <div className="flex items-center text-gray-600">
                                        <svg
                                            className="w-5 h-5 mr-2"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1.5}
                                                d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                                            />
                                        </svg>
                                        <span>{Designer.website}</span>
                                    </div>
                                )}
                            </div>


                            <div className="mt-8 pt-6 border-t border-gray-100">
                                <button onClick={hireDesigner} className="w-full bg-indigo-800 text-white py-3 rounded-lg font-medium hover:bg-black/90 transition-colors">
                                    Booking
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Main Content - Portfolio */}
                    <div className="lg:col-span-2">
                        {
                            reviews && reviews.data &&
                        <ReviewCarousel  reviews={reviews}/>
                        }
                        <h2 className="text-2xl font-medium mb-6">Portfolio</h2>
                        {Designer.Post.length > 0 ? (
                            <PhotoGrid photos={Designer.Post} columns={2} gap={6} />
                        ) : (
                            <div className="text-center py-12 bg-gray-50 rounded-xl">
                                <p className="text-gray-500">No photos available yet.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>

    )
}

export default Profile