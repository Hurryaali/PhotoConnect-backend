"use client";

import { useUser } from "@/hooks/userSession";
import React, { useEffect, useState } from "react";
import CreatePost from "./_components/CreatePost";
import PostsGrid from "./_components/PostGrid";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import AllContract from "../contracts/_components/AllContract";
import { DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Dialog } from "@radix-ui/react-dialog";
import { Edit, Pencil } from "lucide-react";
import uploadToCloudinary from "@/lib/upload";
import toast from "react-hot-toast";
import { Label } from "@/components/ui/label";
import { useSession } from "next-auth/react";

function HomePage() {
    const { user } = useUser();
    const [refreshPosts, setRefreshPosts] = useState(false);
    const [loading, setLoading] = useState(false)
    const [contracts, setContracts] = useState([])
    const [isOpen, setIsOpen] = useState(false)
    const { update } = useSession()
    interface EditProfileData {
        profileImage: any;
        bannerImage: any;
        profileImagePreview: string;
        bannerImagePreview: string;
        name: string;
    }

    const [editProfileData, setEditProfileData] = useState<EditProfileData>({
        profileImage: '',
        bannerImage: '',
        profileImagePreview: '',
        bannerImagePreview: "",
        name: ""
    });
    const onClose = () => {
        setIsOpen(false)
    }
    const handlePostCreated = () => {
        setRefreshPosts((prev) => !prev);
    };
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
        if (user?.userType == "CLIENT") {
            fetchContracts()
        }
    }, [user])
    const handleSaveProfile = async () => {
        setLoading(true);
        try {
            let profileImageUrl = editProfileData.profileImage;
            let bannerImageUrl = editProfileData.bannerImage;

            if (editProfileData.profileImage instanceof File) {
                const { URL, error } = await uploadToCloudinary(editProfileData.profileImage);
                if (error) return; // Optionally, you can exit early if there's an error
                profileImageUrl = URL;
            }
            // Check if a new banner image file was provided
            if (editProfileData.bannerImage instanceof File) {
                const { URL, error } = await uploadToCloudinary(editProfileData.bannerImage);
                if (error) return;
                bannerImageUrl = URL;
            }

            await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/update`, {
                profile: profileImageUrl,
                banner: bannerImageUrl,
                userId: user?.id,
                name: editProfileData.name
            });
            update({
                user: {
                    ...user,
                    profileImage: profileImageUrl,
                    bannerImage: bannerImageUrl,
                    name: editProfileData.name,
                }
            })
            toast.success("Profile updated successfully!");
            onClose();
        } catch (error) {
            console.error("Error updating profile", error);
            toast.error("Failed to update profile. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e: any, fieldName: string) => {
        const file = e.target.files[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file); // Create a URL for the image preview
            setEditProfileData((prev) => ({
                ...prev,
                [fieldName]: file, // Store the file object itself for upload
                [`${fieldName}Preview`]: previewUrl, // Store the preview URL for displaying in the modal
            }));
        }
    };


    useEffect(() => {
        if (user) {
            setEditProfileData({
                profileImage: user?.profileImage ?? "",
                bannerImage: user?.bannerImage || '',
                bannerImagePreview: "",
                profileImagePreview: "",
                name: user?.name ?? ""
            })
        }
    }, [user]);

    const handleInputChange = (e: any) => {
        const { name, value } = e.target;
        setEditProfileData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    return (
        <section className="relative pb-24">
            <div className="relative z-0 group">
                <img
                    src={user && user.bannerImage}
                    alt="cover-image"
                    className="w-full absolute top-0 left-0 z-0 h-60 object-cover"
                />
                <label onClick={() => setIsOpen(true)} htmlFor="bannerImageInput" className="absolute top-3 flex items-center gap-1 px-2 text-sm right-3 cursor-pointer  bg-white p-2 rounded-full">
                    <Edit className="h-4 w-4" />
                    Edit Profile
                </label>

            </div>

            <div className="w-full max-w-7xl z-10 pt-40 mx-auto px-6 md:px-8">
                <div className="flex items-center justify-center sm:justify-start relative z-10 mb-5">
                    <img
                        src={user && user.profileImage}
                        alt="user-avatar-image"
                        className="border-4 border-solid border-white rounded-full h-36 w-36 object-cover"
                    />
                </div>
                <div className="flex flex-col sm:flex-row max-sm:gap-5 items-center justify-between mb-5">
                    <div className="block">
                        <h3 className="font-manrope font-bold text-4xl text-gray-900 capitalize">
                            {user && user.name}
                        </h3>
                        <div>
                            <p className="font-normal text-sm leading-7 text-gray-500">
                                {user &&
                                    user.createdAt &&
                                    `Joined ${new Date(user.createdAt).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}`}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="rounded-full py-3 px-5 bg-gray-100 flex items-center group transition-all duration-300 hover:bg-indigo-100">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={20}
                                height={20}
                                viewBox="0 0 20 20"
                                fill="none"
                            >
                                <path
                                    className="stroke-gray-700 transition-all duration-300 group-hover:stroke-indigo-600"
                                    d="M14.1667 11.6666V13.3333C14.1667 14.9046 14.1667 15.6903 13.6785 16.1785C13.1904 16.6666 12.4047 16.6666 10.8333 16.6666H7.50001C5.92866 16.6666 5.14299 16.6666 4.65483 16.1785C4.16668 15.6903 4.16668 14.9047 4.16668 13.3333V11.6666M16.6667 9.16663V13.3333M11.0157 10.434L12.5064 9.44014C14.388 8.18578 15.3287 7.55861 15.3287 6.66663C15.3287 5.77466 14.388 5.14749 12.5064 3.89313L11.0157 2.8993C10.1194 2.3018 9.67131 2.00305 9.16668 2.00305C8.66205 2.00305 8.21393 2.3018 7.31768 2.8993L5.82693 3.89313C3.9454 5.14749 3.00464 5.77466 3.00464 6.66663C3.00464 7.55861 3.9454 8.18578 5.82693 9.44014L7.31768 10.434C8.21393 11.0315 8.66205 11.3302 9.16668 11.3302C9.67131 11.3302 10.1194 11.0315 11.0157 10.434Z"
                                    stroke="#374151"
                                    strokeWidth="1.6"
                                    strokeLinecap="round"
                                />
                            </svg>
                            <span className="px-2 font-medium text-base text-gray-700 transition-all duration-300 group-hover:text-indigo-600">
                                {user?.userType == "USER" ? "CLIENT" : user?.userType}
                            </span>
                        </button>

                        <div className="flex gap-6">
                            {
                                user?.userType == "DESIGNER" &&
                                <div className="flex flex-col items-center px-6 border-r border-gray-200">
                                    <span className="text-2xl font-bold text-gray-900">
                                        {user?.followerCount || 0}
                                    </span>
                                    <span className="text-sm text-gray-600 font-medium">
                                        Followers
                                    </span>
                                </div>
                            }

                            <div className="flex flex-col items-center px-6">
                                <span className="text-2xl font-bold text-gray-900">
                                    {user?.followingCount || 0}
                                </span>
                                <span className="text-sm text-gray-600 font-medium">
                                    Following
                                </span>
                            </div>
                        </div>
                        {
                            user?.userType == "DESIGNER" &&
                            <CreatePost onPostCreated={handlePostCreated} />
                        }
                    </div>
                </div>
                {
                    user?.userType == "DESIGNER" ?
                        <PostsGrid key={refreshPosts ? "refresh" : "no-refresh"} />
                        :
                        loading ?

                            <div className="flex justify-center items-center min-h-[50vh]">
                                <ClipLoader color="#0066ff" size={50} />
                            </div>

                            :
                            <AllContract contracts={contracts} user={user} />



                }


                <Dialog open={isOpen} onOpenChange={onClose}>
                    <DialogContent className="p-6">
                        <DialogHeader>
                            <DialogTitle>Edit Profile</DialogTitle>
                        </DialogHeader>
                        <div className="relative mb-7">
                            <label htmlFor="modalBannerImageInput" className="cursor-pointer w-full">
                                <Pencil className="p-1 rounded-full bg-white absolute bottom-2 right-2" />
                                <img
                                    src={editProfileData.bannerImagePreview || editProfileData.bannerImage}
                                    alt="Banner"
                                    className="h-[20vh] w-full rounded-lg"
                                />
                                <input
                                    type="file"
                                    id="modalBannerImageInput"
                                    style={{ display: 'none' }}
                                    onChange={(e) => handleImageChange(e, 'bannerImage')}
                                />
                            </label>
                            <label htmlFor="modalProfileImageInput" className="h-16 w-16 rounded-full left-3 -bottom-5 absolute cursor-pointer">
                                <Pencil className="p-1 rounded-full bg-white absolute h-5 w-5 -right-1" />
                                <img
                                    src={editProfileData.profileImagePreview || editProfileData.profileImage}
                                    alt="Profile"
                                    className="rounded-full h-full w-full object-cover"
                                />
                                <input
                                    type="file"
                                    id="modalProfileImageInput"
                                    style={{ display: 'none' }}
                                    onChange={(e) => handleImageChange(e, 'profileImage')}
                                />
                            </label>
                        </div>
                            <Label htmlFor="email" className="mt-2">Name</Label>
                            <input
                                id="name"
                                type="name"
                                name="name"
                                value={editProfileData.name}
                                onChange={handleInputChange}
                                className="mb-5 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"

                            />


                        <DialogFooter>
                            <div className="flex gap-3 max-w-sm">
                                <button
                                    onClick={onClose}
                                    className="py-2.5 px-6 rounded-lg text-sm font-medium bg-indigo-200 text-indigo-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveProfile}
                                    className="py-2.5 px-6 rounded-lg text-sm font-medium text-white bg-indigo-600"
                                >
                                    {loading ? "Updating..." : "Update"}
                                </button>
                            </div>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </section>
    );
}

export default HomePage;
