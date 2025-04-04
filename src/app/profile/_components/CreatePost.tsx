"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import axios from "axios";
import uploadToCloudinary from "@/lib/upload";
import toast from "react-hot-toast";
import { useUser } from "@/hooks/userSession";

export default function CreatePost({ onPostCreated }: { onPostCreated: () => void }) {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const { user } = useUser();

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (typeof window === 'undefined') return; // Ensure this runs only on the client side
        const file = e.target.files?.[0];
        if (file) {
            setFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setIsLoading(true);

        try {
            let imageUrl = "";
            if (file) {
                const uploadResponse = await uploadToCloudinary(file);
                if (uploadResponse.URL) {
                    imageUrl = uploadResponse.URL;
                } else {
                    toast.error("Image upload failed");
                    setIsLoading(false);
                    return;
                }
            }

            const postData = {
                title,
                description,
                image: imageUrl,
                userId: user.id,
            };

            await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/post/posts`,
                postData
            );

            toast.success("Post created successfully!");
            setTitle("");
            setDescription("");
            setFile(null);
            setPreviewImage(null);
            setOpen(false);
            setIsLoading(false);
            onPostCreated();

        } catch (error: any) {
            setIsLoading(false);
            console.error("Error creating post:", error);
            toast.error(error.response?.data?.message || "Failed to create post");
        }
    };

    return (
        <div>
            <Button
                className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                onClick={() => setOpen(true)}
            >
                <Plus />
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Create a New Post</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            placeholder="Post title"
                            className="w-full"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                        <textarea
                            placeholder="Write your description here..."
                            className="w-full min-h-[100px] p-3 rounded-md border border-input bg-transparent"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        <div className="space-y-2">
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="w-full"
                            />
                            {previewImage && (
                                <div className="relative w-full h-[200px] rounded-lg overflow-hidden">
                                    <Image
                                        src={previewImage}
                                        alt="Preview"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            )}
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                            disabled={isLoading}
                        >
                            {isLoading ? "Creating..." : "Share Post"}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
