import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

interface Review {
    id: string;
    contractId: string;
    rating: string;
    comment: string;
    userId: string;
    User: {
        id: string;
        name: string;
        email: string;
        profileImage: string;
    };
}

interface ReviewsData {
    data: Review[];
    ratting: number;
}

interface ReviewCarouselProps {
    reviews: ReviewsData;
}

export function ReviewCarousel({ reviews }: ReviewCarouselProps) {
    return (
        <div className="mb-12">
            {/* Overall Rating Summary */}
            <div className="mb-6">
                <h2 className="text-2xl font-medium mb-1">Reviews</h2>
                <div className="flex items-center">
                    <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                                key={star}
                                className={`w-5 h-5 ${star <= Math.round(reviews.ratting)
                                        ? "text-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        ))}
                    </div>
                    <span className="ml-2 text-gray-600">
                        {parseFloat(String(reviews.ratting)).toFixed(1)} out of 5
                    </span>
                </div>
            </div>

            <Carousel className="w-11/12 mx-auto">
                <CarouselContent>
                    {reviews.data.map((review) => (
                        <CarouselItem key={review.id} className="lg:basis-1/2 ">
                            <div className="p-2">
                                <Card className="w-full">
                                    <CardContent className="p-4">
                                        <div className="flex items-center mb-4">
                                            <img
                                                src={review.User.profileImage}
                                                alt={review.User.name}
                                                className="w-12 h-12 rounded-full object-cover"
                                            />
                                            <div className="ml-4">
                                                <h4 className="font-medium">{review.User.name}</h4>
                                                <div className="flex mt-1">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <svg
                                                            key={star}
                                                            className={`w-4 h-4 ${star <= parseInt(review.rating)
                                                                    ? "text-yellow-400"
                                                                    : "text-gray-300"
                                                                }`}
                                                            fill="currentColor"
                                                            viewBox="0 0 20 20"
                                                        >
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-gray-600">{review.comment}</p>
                                    </CardContent>
                                </Card>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
    );
}
