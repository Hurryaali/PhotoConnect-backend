"use client"

import React, { useState, useEffect } from "react";
import { ArrowLeft, FileText, Clock, Calendar, DollarSign, User, Check, X, Edit, Printer, Download } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";



const ContractDetail = ({ id, isDesigner }: any) => {
    const [currentContract, setcurrentContract] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);



    useEffect(() => {
        const fetchContractDetail = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/contract/${id}`
                );
                console.log(response.data, "this is datat")
                setcurrentContract(response.data.data)
            } catch (error) {
                console.error("Error fetching contracts", error);

            } finally {
                setIsLoading(false);

            }

        };

        fetchContractDetail()
    }, [id]);

    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    // Get status styling
    const getStatusStyle = (status: string) => {
        switch (status) {
            case "PENDING":
                return {
                    bgColor: "bg-yellow-100",
                    textColor: "text-yellow-800",
                    iconColor: "text-yellow-600",
                    borderColor: "border-yellow-200"
                };
            case "ACTIVE":
                return {
                    bgColor: "bg-blue-100",
                    textColor: "text-blue-800",
                    iconColor: "text-blue-600",
                    borderColor: "border-blue-200"
                };
            case "COMPLETED":
                return {
                    bgColor: "bg-green-100",
                    textColor: "text-green-800",
                    iconColor: "text-green-600",
                    borderColor: "border-green-200"
                };
            case "CANCELLED":
                return {
                    bgColor: "bg-red-100",
                    textColor: "text-red-800",
                    iconColor: "text-red-600",
                    borderColor: "border-red-200"
                };
            default:
                return {
                    bgColor: "bg-gray-100",
                    textColor: "text-gray-800",
                    iconColor: "text-gray-600",
                    borderColor: "border-gray-200"
                };
        }
    };

    const updateStatus = async (status: string) => {
        setIsLoading(true);
        try {
            const response = await axios.patch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/contract/status/${id}`,
                { status }
            );
            setcurrentContract(response.data.data);
            toast.success('Contract status updated successfully!');
        } catch (error) {
            console.error("Error updating contract status", error);
            toast.error('Error updating contract status');
        } finally {
            setIsLoading(false);
        }
    };
    // Capitalize status for display
    const capitalizeStatus = (status: string) => {
        return status.charAt(0).toUpperCase() + status.slice(1);
    };

    if (isLoading) {
        return (
            <div className="flex min-h-screen flex-col">
                <main className="flex-grow pt-20">
                    <div className="container mx-auto px-4 py-12 text-center">
                        <div className="h-12 w-12 mx-auto animate-spin rounded-full border-4 border-black border-t-transparent"></div>
                    </div>
                </main>
            </div>
        );
    }

    if (!currentContract && !isLoading) {
        return (
            <div className="flex min-h-screen flex-col">
                <main className="flex-grow pt-20">
                    <div className="container mx-auto px-4 py-12 text-center">
                        <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                        <h1 className="text-3xl font-medium mb-2">Contract Not Found</h1>
                        <p className="text-gray-600 mb-6">The contract you're looking for doesn't exist or has been removed.</p>
                        <button onClick={() => history.back()} className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 inline-flex items-center">
                            <ArrowLeft className="mr-2 h-5 w-5" />
                            Back to Contracts
                        </button>
                    </div>
                </main>
            </div>
        );
    }

    const statusStyle = getStatusStyle(currentContract.status);

    return (
        <div className="flex min-h-screen flex-col">
            <main className="flex-grow">
                <div className="container mx-auto px-4 py-8">
                    <div className="mb-6">
                        <button onClick={() => history.back()} className="inline-flex items-center text-gray-600 hover:text-gray-900">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Contracts
                        </button>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                        <div>
                            <h1 className="text-3xl font-bold">Contract {currentContract.id}</h1>
                            <p className="text-gray-600">Created on {currentContract.createdAt ? formatDate(currentContract.createdAt) : "N/A"}</p>
                        </div>

                    </div>

                    <div className={`grid grid-cols-1 ${isDesigner && 'lg:grid-cols-3'}  gap-6`}>
                        {/* Contract Summary */}
                        <div className="lg:col-span-2 bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="px-6 py-4 border-b">
                                <h2 className="text-xl font-semibold">Contract Summary</h2>
                                <p className="text-sm text-gray-600">Overview of the contract details</p>
                            </div>
                            <div className="px-6 py-4">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center pb-4 border-b">
                                        <div className="flex items-center">
                                            <User className="h-5 w-5 text-gray-500 mr-2" />
                                            <span className="text-gray-600">Client</span>
                                        </div>
                                        <span className="font-medium">{currentContract.client.name}</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-4 border-b">
                                        <div className="flex items-center">
                                            <Calendar className="h-5 w-5 text-gray-500 mr-2" />
                                            <span className="text-gray-600">Event Date</span>
                                        </div>
                                        <span className="font-medium">{formatDate(currentContract.startDate)}</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-4 border-b">
                                        <div className="flex items-center">
                                            <DollarSign className="h-5 w-5 text-gray-500 mr-2" />
                                            <span className="text-gray-600">Amount</span>
                                        </div>
                                        <span className="font-medium">${currentContract.budget.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center pb-4 border-b">
                                        <div className="flex items-center">
                                            <Clock className="h-5 w-5 text-gray-500 mr-2" />
                                            <span className="text-gray-600">Project Duration</span>
                                        </div>
                                        <span className="font-medium">
                                            {formatDate(currentContract.startDate)} - {formatDate(currentContract.dueDate)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Status Card */}
                        {
                            isDesigner ?
                                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                                    <div className="px-6 py-4 border-b">
                                        <h2 className="text-xl font-semibold">Contract Status</h2>
                                    </div>
                                    <div className="px-6 py-6">
                                        <div className="flex flex-col items-center justify-center p-6 text-center">
                                            <div className={`inline-flex rounded-full p-4 ${statusStyle.bgColor}`}>
                                                {currentContract.status === "COMPLETED" ? <Check className={`h-8 w-8 ${statusStyle.iconColor}`} /> :
                                                    currentContract.status === "ACTIVE" ? <Check className={`h-8 w-8 ${statusStyle.iconColor}`} /> :
                                                        currentContract.status === "PENDING" ? <Clock className={`h-8 w-8 ${statusStyle.iconColor}`} /> :
                                                            <X className={`h-8 w-8 ${statusStyle.iconColor}`} />}
                                            </div>
                                            <h3 className={`mt-4 text-xl font-semibold ${statusStyle.textColor}`}>
                                                {capitalizeStatus(currentContract.status)}
                                            </h3>
                                            <p className="mt-2 text-gray-600">
                                                {currentContract.status === "PENDING" && "Awaiting your approval"}
                                                {currentContract.status === "ACTIVE" && "Contract has been accepted"}
                                                {currentContract.status === "COMPLETED" && "Contract has been completed"}
                                                {currentContract.status === "CANCELLED" && "Contract has been declined"}
                                            </p>

                                            {currentContract.status === "PENDING" && (
                                                <div className="mt-6 grid grid-cols-2 gap-3 w-full">
                                                    <button
                                                        onClick={() => updateStatus("CANCELLED")}
                                                        className="px-3 py-2 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border border-red-200 rounded-md font-medium inline-flex items-center justify-center">
                                                        <X className="mr-2 h-4 w-4" />
                                                        Decline
                                                    </button>
                                                    <button
                                                        onClick={() => updateStatus("ACTIVE")}

                                                        className="px-3 py-2 bg-green-600 text-white hover:bg-green-700 rounded-md font-medium inline-flex items-center justify-center">
                                                        <Check className="mr-2 h-4 w-4" />
                                                        Accept
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                :
                                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                                    <div className="px-6 py-4 border-b">
                                        <h2 className="text-xl font-semibold">Contract Status</h2>
                                    </div>
                                    <div className="px-6 py-6">
                                        <div className="flex flex-col items-center justify-center p-6 text-center">
                                            <div className={`inline-flex rounded-full p-4 ${statusStyle.bgColor}`}>
                                                {currentContract.status === "COMPLETED" ? <Check className={`h-8 w-8 ${statusStyle.iconColor}`} /> :
                                                    currentContract.status === "ACTIVE" ? <Check className={`h-8 w-8 ${statusStyle.iconColor}`} /> :
                                                        currentContract.status === "PENDING" ? <Clock className={`h-8 w-8 ${statusStyle.iconColor}`} /> :
                                                            <X className={`h-8 w-8 ${statusStyle.iconColor}`} />}
                                            </div>
                                            <h3 className={`mt-4 text-xl font-semibold ${statusStyle.textColor}`}>
                                                {capitalizeStatus(currentContract.status)}
                                            </h3>
                                            <p className="mt-2 text-gray-600">
                                                {currentContract.status === "PENDING" && "Awaiting for approval"}
                                                {currentContract.status === "ACTIVE" && "Contract has been accepted"}
                                                {currentContract.status === "COMPLETED" && "Contract has been completed"}
                                                {currentContract.status === "CANCELLED" && "Contract has been declined"}
                                            </p>
                                            {
                                                currentContract.status !== "CANCELLED" && currentContract.status !== "COMPLETED"
                                                &&
                                                <div className="mt-6 grid grid-cols-2 gap-3 w-full">
                                                    <button
                                                        onClick={() => updateStatus("CANCELLED")}
                                                        className="px-3 py-2 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border border-red-200 rounded-md font-medium inline-flex items-center justify-center">
                                                        <X className="mr-2 h-4 w-4" />
                                                        Decline
                                                    </button>
                                                    <button
                                                        onClick={() => updateStatus("COMPLETED")}

                                                        className="px-3 py-2 bg-green-600 text-white hover:bg-green-700 rounded-md font-medium inline-flex items-center justify-center">
                                                        <Check className="mr-2 h-4 w-4" />
                                                        Complete
                                                    </button>
                                                </div>
                                            }

                                        </div>
                                    </div>
                                </div>
                        }

                        {/* Client Information */}
                        {
                            isDesigner ?
                                <div className="lg:col-span-2 bg-white rounded-lg shadow-md overflow-hidden">
                                    <div className="px-6 py-4 border-b">
                                        <h2 className="text-xl font-semibold">Client Information</h2>
                                    </div>
                                    <div className="px-6 py-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-500">Name</h3>
                                                <p className="mt-1">{currentContract.client.name}</p>
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-500">Email</h3>
                                                <p className="mt-1">{currentContract.client.email}</p>
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                                                <p className="mt-1">{currentContract.phone}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                :
                                <div className="lg:col-span-2 bg-white rounded-lg shadow-md overflow-hidden">
                                    <div className="px-6 py-4 border-b">
                                        <h2 className="text-xl font-semibold">Photographer Information</h2>
                                    </div>
                                    <div className="px-6 py-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-500">Name</h3>
                                                <p className="mt-1">{currentContract.freelancer.name}</p>
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-500">Email</h3>
                                                <p className="mt-1">{currentContract.freelancer.email}</p>

                                            </div>
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                                                <p className="mt-1">{currentContract.freelancer.phoneNumber}</p>


                                            </div>
                                        </div>
                                    </div>
                                </div>

                        }

                        <div className="lg:col-span-3 bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="px-6 py-4 border-b">
                                <h2 className="text-xl font-semibold">Project Description</h2>
                            </div>
                            <div className="px-6 py-4">
                                <p className="text-gray-700 whitespace-pre-line">{currentContract.discription}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ContractDetail;
