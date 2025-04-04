"use client"

import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { ClipLoader } from 'react-spinners';
import UnsplashGrid from './_components/UnsplashGrid';
import { Search } from 'lucide-react';
import PhotographerCard from './_components/Card';


function page() {
    const [loading, setLoading] = useState(true)
    const [Designer, setDesigner] = useState<any[]>([])
    const [searchTerm, setSearchTerm] = useState('');
    const filteredDesigners = Designer ? Designer.filter((Designer: any) =>
        Designer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        Designer.Location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        Designer.designerType.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];
    const fetchPosts = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/`
            );
            console.log(response.data, "this is datat")
            setDesigner(response.data.data);
        } catch (error) {
            console.error("Error fetching posts:", error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchPosts()
    }, [])

    return (
        <>
            <section className="bg-black py-20 mb-10 text-white">
                <div className="container mx-auto px-4">
                    <div className="mx-auto max-w-3xl text-center">
                        <h1 className="mb-6 text-3xl font-light md:text-5xl">
                            Discover <span className="font-medium">Photographers</span>
                        </h1>
                        <p className="mb-8 text-white/80">
                            Browse through our network of talented photographers and find the perfect match
                            for your next project or event.
                        </p>

                        <div className="relative mx-auto max-w-xl">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <svg
                                    className="h-5 w-5 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Search by name, specialty, or location..."
                                className="w-full rounded-full bg-white/10 py-3 pl-10 pr-4 text-white placeholder-white/50 backdrop-blur-lg transition-all duration-300 focus:bg-white/20 focus:outline-none"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </section>
            <div className="container mx-auto px-4">
                {
                    loading ?
                        <div className="flex justify-center items-center min-h-[400px]">
                            <ClipLoader color="#0066ff" size={50} />
                        </div>
                        :
                        <>
                            <div className="grid gap-6 sm:grid-cols-2  xl:grid-cols-3">
                                {filteredDesigners.map((photographer) => (
                                    <PhotographerCard
                                        key={photographer.id}
                                        id={photographer.id}
                                        name={photographer.name}
                                        specialty={photographer.designerType}
                                        followingCount={photographer.followingCount}
                                        followerCount={photographer.followerCount}
                                        location={photographer.Location}
                                        profileImage={photographer.profileImage}
                                        coverImage={photographer.bannerImage}
                                    />
                                ))}
                            </div>
                        </>
                }
            </div>

        </>
    )
}

export default page