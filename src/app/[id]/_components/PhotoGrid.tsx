import AnimatedImage from "@/app/discover/_components/Image";
import React from "react";



interface PhotoGridProps {
    photos: any[];
    columns?: number;
    gap?: number;
}

const PhotoGrid: React.FC<PhotoGridProps> = ({
    photos,
    columns = 3,
    gap = 4
}) => {
    // Split photos into columns
    const photoColumns: any[][] = Array.from({ length: columns }, () => []);

    photos.forEach((photo, index) => {
        photoColumns[index % columns].push(photo);
    });

    const gapClass = `gap-${gap}`;

    return (
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns} ${gapClass}`}>
            {photoColumns.map((column, columnIndex) => (
                <div key={`column-${columnIndex}`} className={`flex flex-col ${gapClass}`}>
                    {column.map((photo) => (
                        <div
                            key={photo.id}
                            className="relative group overflow-hidden rounded-lg shadow-sm hover-scale"
                        >
                            <AnimatedImage
                                src={photo.image}
                                alt={photo.title}
                                className="w-full aspect-auto object-cover"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                            <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                <span
                                    className="text-white text-sm font-medium hover:underline"
                                >
                                    {photo.title}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default PhotoGrid;