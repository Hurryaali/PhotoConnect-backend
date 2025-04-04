"use client";

import { useUser } from "@/hooks/userSession";
import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const ContractPage = ({ id, designer, email, profile }: any) => {
    const { user } = useUser();
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter()
    const [formData, setFormData] = useState({
        clientName: user?.name ?? "",
        clientEmail: user?.email ?? "",
        clientPhone: "",
        projectDescription: "",
        budget: "",
        startDate: "",
        endDate: "",
    });

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const today = new Date().toISOString().split('T')[0];

        // Validate dates
        const startDateObj = new Date(formData.startDate);
        const endDateObj = new Date(formData.endDate);

        if (startDateObj > endDateObj) {
            toast.error("End date cannot be before start date");
            return;
        }

        if (startDateObj < new Date(today)) {
            toast.error("Start date cannot be in the past");
            return;
        }
        const { clientName, clientEmail, clientPhone, projectDescription, budget, startDate, endDate } = formData;
        if (!clientName || !clientEmail || !clientPhone || !projectDescription || !budget || !startDate || !endDate) {
            toast.error("Please fill out all fields.");
            return;
        }

        setIsLoading(true);

        try {
            const payload = {
                budget,
                phone: clientPhone,
                discription: projectDescription,
                startDate,
                freelancerId: id,
                dueDate: endDate,
                designLink: "",
            };

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/contract`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${user?.token}`,
                    },
                }
            );

            toast.success("Contract Submit successfully!");
            router.push("/")
        } catch (error: any) {
            console.error("Error creating contract:", error);
            toast.error(
                error.response?.data?.message || "Failed to create contract."
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col">
            <main className="flex-grow pt-20">
                <div className="container mx-auto px-4 py-12">
                    <div className="max-w-3xl mx-auto">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="h-16 w-16 rounded-full overflow-hidden">
                                <img
                                    src={profile}
                                    alt={designer}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <div>
                                <h1 className="text-2xl font-medium">Hire {designer}</h1>
                                <p className="text-gray-600">{email}</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="px-6 py-4 border-b">
                                <h2 className="text-xl font-semibold">Contract Details</h2>
                                <p className="text-gray-600 text-sm">
                                    Fill out the form below to send a contract proposal to {designer}.
                                </p>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="px-6 py-4 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label htmlFor="clientName" className="block text-sm font-medium text-gray-700">
                                                Your Name
                                            </label>
                                            <input
                                                id="clientName"
                                                name="clientName"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                value={formData.clientName}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="clientEmail" className="block text-sm font-medium text-gray-700">
                                                Your Email
                                            </label>
                                            <input
                                                id="clientEmail"
                                                name="clientEmail"
                                                type="email"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                value={formData.clientEmail}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="clientPhone" className="block text-sm font-medium text-gray-700">
                                            Your Phone
                                        </label>
                                        <input
                                            id="clientPhone"
                                            name="clientPhone"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            value={formData.clientPhone}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="projectDescription" className="block text-sm font-medium text-gray-700">
                                            Project Description
                                        </label>
                                        <textarea
                                            id="projectDescription"
                                            name="projectDescription"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            value={formData.projectDescription}
                                            onChange={handleInputChange}
                                            rows={5}
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="space-y-2">
                                            <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
                                                Budget ($)
                                            </label>
                                            <input
                                                id="budget"
                                                name="budget"
                                                type="number"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                value={formData.budget}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                                                Start Date
                                            </label>
                                            <input
                                                id="startDate"
                                                name="startDate"
                                                type="date"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                value={formData.startDate}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                                                End Date
                                            </label>
                                            <input
                                                id="endDate"
                                                name="endDate"
                                                type="date"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                value={formData.endDate}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="px-6 py-4 bg-gray-50 text-right">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        {isLoading ? "Submitting..." : "Send Contract Proposal"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ContractPage;
