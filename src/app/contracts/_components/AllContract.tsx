import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, FileText } from "lucide-react";
import Link from "next/link";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

interface Review {
    id: string;
    rating: string;
    comment: string;
}

interface Contract {
    id: string;
    clientId: string;
    budget: string;
    phone: string;
    discription: string;
    startDate: string;
    freelancerId: string;
    dueDate: string;
    designLink: string;
    status: string;
    client: {
        id: string;
        name: string;
        email: string;
        profileImage: string;
    };
    freelancer: {
        id: string;
        name: string;
        email: string;
        profileImage: string;
    };
    review?: Review[]; // Optional review field
}

interface AllContractProps {
    user: any;
    contracts?: Contract[];
    fetchContracts: any;
}

interface ContractTableProps {
    contracts: Contract[];
    formatDate: (date: string) => string;
    getStatusColor: (status: string) => string;
    userType: string;
    onAddReview: (contractId: string) => void;
}

const ContractTable = ({
    contracts,
    formatDate,
    getStatusColor,
    userType,
    onAddReview,
}: ContractTableProps) => {
    if (contracts.length === 0) {
        return (
            <div className="text-center py-10 text-gray-500 bg-white rounded-lg shadow-md">
                <FileText className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                <p>No contracts found</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {userType === "USER" ? "Designer" : "Client"}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Start Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Budget ($)
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Due Date
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Rating
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {contracts.map((contract) => (
                            <tr key={contract.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="font-medium text-gray-900">
                                        {userType === "USER"
                                            ? contract.freelancer.name
                                            : contract.client.name}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {formatDate(contract.startDate)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span
                                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                                            contract.status
                                        )}`}
                                    >
                                        {contract.status.charAt(0).toUpperCase() +
                                            contract.status.slice(1)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    ${Number(contract.budget).toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {formatDate(contract.dueDate)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {
                                        contract.review && contract.review.length > 0 ? (
                                            <div className={`px-3 py-1.5 border rounded text-sm font-medium ${
                                                Number(contract.review[0].rating) >= 4 ? 'bg-green-100 text-green-800 border-green-300' :
                                                Number(contract.review[0].rating) >= 3 ? 'bg-blue-100 text-blue-800 border-blue-300' :
                                                Number(contract.review[0].rating) >= 2 ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
                                                'bg-red-100 text-red-800 border-red-300'
                                            }`}>
                                                Rating: {contract.review[0].rating}/5
                                            </div>
                                        ) : (
                                            <span className="text-gray-500">Not Given Yet</span>
                                        )
                                    }
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap gap-2 flex items-center text-right">
                                    {userType === "USER" && contract.status.toLowerCase() === "completed" && contract.review && contract.review.length == 0 && (
                                        <button
                                            onClick={() => onAddReview(contract.id)}
                                            className="px-3 py-1.5 border border-gray-300 hover:text-black rounded text-sm font-medium text-gray-100 bg-green-700 hover:bg-gray-50"
                                        >
                                            Add Review
                                        </button>
                                    )}
                                    <Link href={`/contracts/${contract.id}?user=${userType}`}>
                                        <button className="px-3 py-1.5 border border-gray-300 rounded text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                                            View Details
                                        </button>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const AllContract = ({ contracts: allContracts, user }: any) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("all");

    // Modal & Review state
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [comment, setComment] = useState("");
    const [rating, setRating] = useState("");
    const [selectedContractId, setSelectedContractId] = useState("");

    const fetchContracts = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/contract`,
                {
                    headers: {
                        Authorization: `Bearer ${user?.token}`,
                    },
                }
            );
            const data = response.data.data || [];
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
            console.error("Error fetching contracts", error);
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {

        if (allContracts && allContracts.length > 0) {
            setContracts(allContracts);
            setIsLoading(false);
        } else {
            fetchContracts();
        }
    }, [allContracts, user]);

    // Filter contracts based on logged-in user:
    const relevantContracts = contracts.filter((contract) => {
        if (user.userType === "USER") {
            return contract.client.id === user.id;
        } else if (user.userType === "DESIGNER") {
            return contract.freelancer.id === user.id;
        }
        return false;
    });

    // Filter using search term on the displayed party's name.
    const filteredContracts = relevantContracts.filter((contract) => {
        const nameToSearch =
            user.userType === "USER"
                ? contract.freelancer.name
                : contract.client.name;
        return (
            nameToSearch.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contract.id.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    // Ensure the contract status is in lowercase for consistency.
    const contractsWithLowerStatus = filteredContracts.map((contract) => ({
        ...contract,
        status: contract.status.toLowerCase(),
    }));

    const pendingContracts = contractsWithLowerStatus.filter(
        (c) => c.status === "pending"
    );
    const activeContracts = contractsWithLowerStatus.filter(
        (c) => c.status === "active"
    );
    const completedContracts = contractsWithLowerStatus.filter(
        (c) => c.status === "completed"
    );
    const cancelledContracts = contractsWithLowerStatus.filter(
        (c) => c.status === "cancelled"
    );

    const getDisplayedContracts = () => {
        switch (activeTab) {
            case "pending":
                return pendingContracts;
            case "active":
                return activeContracts;
            case "completed":
                return completedContracts;
            case "cancelled":
                return cancelledContracts;
            default:
                return contractsWithLowerStatus;
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            case "active":
                return "bg-blue-100 text-blue-800";
            case "completed":
                return "bg-green-100 text-green-800";
            case "cancelled":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    // Open modal for review submission for the selected contract.
    const openReviewModal = (contractId: string) => {
        setSelectedContractId(contractId);
        setIsOpen(true);
    };

    const onClose = () => {
        setIsOpen(false);
    };

    const handleSubmitReview = async () => {
        if (!comment) {
            toast.error("Please add comment");
            return;
        }
        if (!rating) {
            toast.error("Please Select Rating");
            return;
        }
        if (!selectedContractId) {
            toast.error("No contract selected");
            return;
        }
        setLoading(true);
        try {
            await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/review`,
                { rating, comment, contractId: selectedContractId },
                {
                    headers: {
                        Authorization: `Bearer ${user?.token}`,
                    },
                }
            );
            toast.success("Review submitted successfully");
            fetchContracts()
            setIsOpen(false);
            // Optionally update the contracts state to reflect the new review.
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col">
            <main className="flex-grow">
                <div className="container mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                        <div className="px-6 py-4 border-b">
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-semibold">My Contracts</h2>
                                    <p className="text-gray-600 text-sm">
                                        {user.userType === "USER"
                                            ? "View designer details for each contract."
                                            : "View client details for each contract."}
                                    </p>
                                </div>
                                <div className="mt-4 md:mt-0 w-full md:w-72">
                                    <div className="relative">
                                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                                        <input
                                            placeholder="Search contracts..."
                                            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="px-6 py-4">
                            <div className="grid gap-4 md:grid-cols-4">
                                <div className="bg-white border rounded-lg p-4 shadow-sm">
                                    <h3 className="text-sm font-medium text-gray-500 mb-1">
                                        Total Contracts
                                    </h3>
                                    <p className="text-2xl font-bold">
                                        {contractsWithLowerStatus.length}
                                    </p>
                                </div>
                                <div className="bg-white border rounded-lg p-4 shadow-sm">
                                    <h3 className="text-sm font-medium text-gray-500 mb-1">
                                        Pending
                                    </h3>
                                    <p className="text-2xl font-bold">{pendingContracts.length}</p>
                                </div>
                                <div className="bg-white border rounded-lg p-4 shadow-sm">
                                    <h3 className="text-sm font-medium text-gray-500 mb-1">
                                        Active
                                    </h3>
                                    <p className="text-2xl font-bold">{activeContracts.length}</p>
                                </div>
                                <div className="bg-white border rounded-lg p-4 shadow-sm">
                                    <h3 className="text-sm font-medium text-gray-500 mb-1">
                                        Completed
                                    </h3>
                                    <p className="text-2xl font-bold">{completedContracts.length}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="mb-6">
                        <div className="border-b border-gray-200">
                            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                                {["all", "pending", "active", "completed", "cancelled"].map(
                                    (tab) => (
                                        <button
                                            key={tab}
                                            className={`
                        whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize
                        ${activeTab === tab
                                                    ? "border-blue-500 text-blue-600"
                                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                                }
                      `}
                                            onClick={() => setActiveTab(tab)}
                                        >
                                            {tab}
                                        </button>
                                    )
                                )}
                            </nav>
                        </div>
                    </div>

                    {/* Contracts Table */}
                    {isLoading ? (
                        <div className="text-center py-10 text-gray-500">
                            Loading contracts...
                        </div>
                    ) : (
                        <ContractTable
                            contracts={getDisplayedContracts()}
                            formatDate={formatDate}
                            getStatusColor={getStatusColor}
                            userType={user.userType}
                            onAddReview={openReviewModal}
                        />
                    )}
                </div>
            </main>

            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="p-6">
                    <DialogHeader>
                        <DialogTitle>Add Review</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="rating">Rating</Label>
                            <select
                                id="rating"
                                value={rating}
                                onChange={(e) => setRating(e.target.value)}
                                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Select rating</option>
                                <option value="1">★ Poor</option>
                                <option value="2">★★ Fair</option>
                                <option value="3">★★★ Good</option>
                                <option value="4">★★★★ Very Good</option>
                                <option value="5">★★★★★ Excellent</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="comment">Comment</Label>
                            <textarea
                                id="comment"
                                placeholder="Write your review here..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="min-h-[100px] w-full rounded-md border border-gray-300 px-3 py-2"
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <div className="flex gap-3">
                            <Button variant="outline" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button onClick={handleSubmitReview} disabled={loading}>
                                {loading ? "Submitting..." : "Submit Review"}
                            </Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AllContract;
