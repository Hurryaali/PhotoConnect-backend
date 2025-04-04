"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { useUser } from "@/hooks/userSession";
import { Trash2 } from "lucide-react";
import { ClipLoader } from "react-spinners";

interface Post {
    id: string;
    title: string;
    description?: string;
    image?: string;
}

export default function PostsGrid() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(false);
    const { user } = useUser();

    if (!user) return
    const fetchPosts = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/post/posts/${user.id}`
            );
            setPosts(response.data.data);
        } catch (error) {
            console.error("Error fetching posts:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeletePost = async (postId: string) => {
        if (typeof window === 'undefined') return; // Ensure this runs only on the client side
        try {
            await axios.delete(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/post/posts/${postId}`
            );
            // Remove the deleted post from the state
            setPosts(posts.filter(post => post.id !== postId));
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <ClipLoader color="#0066ff" size={50} />
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 mt-20 gap-6 p-6">
            {posts.map((post) => (
                <div
                    key={post.id}
                    className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform "
                >
                    {post.image && (
                        <div className="relative h-56">
                            <img
                                src={post.image}
                                alt={post.title}
                                className="w-full h-full object-cover"
                            />
                            {user && (
                                <button
                                    onClick={() => handleDeletePost(post.id)}
                                    className="absolute top-2 right-2 p-2 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                                >
                                    <Trash2 size={20} color="white" />
                                </button>
                            )}
                        </div>
                    )}
                    <div className="p-4">
                        <h3 className="font-semibold text-xl mb-2 capitalize text-gray-800">{post.title}</h3>
                      
                    </div>

                    {user && (
                        <div className="p-4 border-t border-gray-100">
                            <div className="flex items-center space-x-2">
                                <div className="relative h-10 w-10 rounded-full overflow-hidden">
                                    <Image
                                        src={user.profileImage ?? ""}
                                        alt="User"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex gap-0 flex-col">
                                    <h3 className="font-semibold text-gray-800">
                                        {user.name}
                                    </h3>
                                    <p className="text-xs text-gray-500">
                                        {user.email}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
