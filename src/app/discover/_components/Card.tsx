import Link from "next/link";
import React from "react";
import AnimatedImage from "./Image";

interface PhotographerCardProps {
    id: string;
    name: string;
    specialty: string;
    location: string;
    profileImage: string;
    coverImage: string;
    rating?: number;
    followingCount?: number;
    followerCount?: number;
}

const PhotographerCard: React.FC<PhotographerCardProps> = ({
    id,
    name,
    specialty,
    followerCount,
    followingCount,
    location,
    profileImage,
    coverImage,
}) => {
    return (
        <Link
            href={`/${id}`}
            className="group block overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-300 hover:shadow-md"
        >
            <div className="relative h-48 overflow-hidden">
                <div className="absolute  z-30 inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                <AnimatedImage
                    src={coverImage}
                    alt={`${name}'s work`}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute bottom-0 z-50 left-0 right-0 flex items-end p-4">
                    <div className="flex items-center space-x-3">
                        <div className="h-12 w-12 overflow-hidden rounded-full border-2 border-white shadow-sm">
                            <AnimatedImage
                                src={profileImage}
                                alt={name}
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-white drop-shadow-md">
                                {name}
                            </h3>
                            <p className="text-xs text-white/90 drop-shadow-md">
                                {specialty}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="p-4 flex items-center justify-center ">

                <div className="flex gap-6">
                    <div className="flex flex-col items-center px-6 border-r border-gray-200">
                        <span className="text-2xl font-bold text-gray-900">
                            {followerCount || 0}
                        </span>
                        <span className="text-sm text-gray-600 font-medium">
                            Followers
                        </span>
                    </div>

                    <div className="flex flex-col items-center px-6">
                        <span className="text-2xl font-bold text-gray-900">
                            {followingCount || 0}
                        </span>
                        <span className="text-sm text-gray-600 font-medium">
                            Following
                        </span>
                    </div>
                </div>
               
            </div>
        </Link>
    );
};

export default PhotographerCard;
