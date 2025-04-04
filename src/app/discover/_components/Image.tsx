import React, { useState, useEffect, useRef } from "react";

interface AnimatedImageProps {
    src: string;
    alt: string;
    className?: string;
}

const AnimatedImage: React.FC<AnimatedImageProps> = ({ src, alt, className = "" }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const imageRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            {
                threshold: 0.1,
                rootMargin: "50px",
            }
        );

        if (imageRef.current) {
            observer.observe(imageRef.current);
        }

        return () => {
            observer.disconnect();
        };
    }, []);

    const handleImageLoad = () => {
        setIsLoaded(true);
    };

    return (
        <div className="relative overflow-hidden">
            {/* Blur placeholder */}
            <div
                className={`absolute inset-0 bg-gray-100 ${isLoaded ? "opacity-0" : "opacity-100"
                    } transition-opacity duration-500`}
            />

            <img
                ref={imageRef}
                src={isInView ? src : ""}
                alt={alt}
                className={`transition-all duration-700 ease-out ${className} ${isLoaded ? "blur-0 scale-100" : "blur-sm scale-105"
                    } ${isInView ? "opacity-100" : "opacity-0"}`}
                onLoad={handleImageLoad}
                loading="lazy"
            />
        </div>
    );
};

export default AnimatedImage;
