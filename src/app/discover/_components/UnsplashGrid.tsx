'use client';
import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
// Importing shadcn dialog components – adjust the import path based on your setup
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Heart } from 'lucide-react';

function UnsplashGrid({ post: items }: any) {
    const [selected, setSelected] = useState(null);

    return (
        <>
            <div className="container mx-auto p-4">
                <div className="columns-2 md:columns-3 2xl:columns-4 gap-4">
                    {items.map((item:any, index:any) => (
                        <ImageItem
                            key={item.id}
                            item={item}
                            index={index}
                            setSelected={setSelected}
                        />
                    ))}
                </div>
            </div>
            {/* Show the detail dialog if an item is selected */}
            {selected && (
                <PostDetailDialog item={selected} onClose={() => setSelected(null)} />
            )}
        </>
    );
}

function ImageItem({ item, index, setSelected }: any) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    return (
        <div className="flex flex-col m-2">
            <motion.figure
                whileTap={{ scale: 0.9 }}
                initial="hidden"
                animate={isInView ? 'visible' : 'hidden'}
                ref={ref}
                onClick={() => setSelected(item)}
                className="group relative w-full rounded-md overflow-hidden dark:bg-black bg-white cursor-pointer
               before:absolute before:inset-0 before:content-[''] 
               before:h-full before:w-full hover:before:bg-gradient-to-t 
               dark:before:from-gray-900 before:from-gray-200/90 before:from-5% 
               before:to-transparent before:to-90%"
            >
                <motion.img
                    layoutId={`card-${item.id}`}
                    whileHover={{ scale: 1.025 }}
                    src={item.image}
                    alt={item.title}
                    className="w-full shadow-xl object-cover"
                />
                <div className="absolute bottom-0 left-0 w-full p-2 font-semibold opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            {item.User && (
                <div className="flex items-center justify-between p-4 ">
                    <div className="flex items-center">
                        <div className="relative h-10 w-10 rounded-full overflow-hidden">
                            <Image
                                src={item.User.profileImage ?? ""}
                                alt="User profile"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="ml-3 flex flex-col">
                            <h3 className="font-semibold text-gray-800">{item.User.name}</h3>
                            <p className="text-xs text-gray-500">{item.User.email}</p>
                        </div>
                    </div>
                  
                </div>
            )}
                </div>
            </motion.figure>

        </div>

    );
}

function PostDetailDialog({ item, onClose }: any) {
    return (
        <Dialog open={true} onOpenChange={(open) => { if (!open) onClose(); }}>
            <DialogContent className="max-w-3xl p-0">
                <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/2 relative h-96 md:h-auto">
                        <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-contain"
                        />
                    </div>
                    <div className="md:w-1/2 p-4">
                        <h2 className="text-2xl font-bold">{item.title}</h2>
                        <p className="mt-2 text-gray-600">{item.description}</p>
                        <div className="mt-4">
                            <button className="flex items-center space-x-2 text-red-500">
                                <Heart size={20} />
                                <span>{item.likes?.length || 0}</span>
                            </button>
                        </div>
                        {item.User && (
                            <div className="p-4 border-t border-gray-100 mt-4">
                                <div className="flex items-center  justify-between space-x-2">

                                    <div className='flex items-center'>
                                    <div className='flex items-center gap-2'>
                                    <div className="relative h-10 w-10 rounded-full overflow-hidden">
                                        <Image
                                            src={item.User.profileImage ?? ""}
                                            alt="User"
                                            fill
                                            className="object-cover"
                                            />
                                            </div>
                                    </div>
                                    <div className="flex pl-1 flex-col">
                                        <h3 className="font-semibold text-gray-800">
                                            {item.User.name}
                                        </h3>
                                        <p className="text-xs text-gray-500">
                                            {item.User.email}
                                        </p>
                                    </div>
                                    </div>
                                    <div className="mt-2">
                                        <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-full">
                                            Follow
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default UnsplashGrid;
