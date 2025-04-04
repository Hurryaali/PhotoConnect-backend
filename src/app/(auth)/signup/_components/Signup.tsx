"use client";

import { useState } from "react";
import { Formik, Form, FormikHelpers } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";
import Image from "next/image";
import AuthHeader from "./AuthHeader";

interface SignupValues {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    userType: "USER" | "DESIGNER";
    // Extra fields for photographers
    designerType: string;
    location: string;
    about: string;
    phone: string;
    website: string;
}

export default function SignupPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [step, setStep] = useState(1);

    const togglePasswordVisibility = () => setShowPassword(!showPassword);

    const userImages = [
        "https://res.cloudinary.com/di6r722sv/image/upload/v1727259040/1_zswasp.png",
        "https://res.cloudinary.com/di6r722sv/image/upload/v1727259167/2_zqq4dm.png",
        "https://res.cloudinary.com/di6r722sv/image/upload/v1727259169/8_niu3zz.png",
        "https://res.cloudinary.com/di6r722sv/image/upload/v1727259169/4_qzklzk.png",
        "https://res.cloudinary.com/di6r722sv/image/upload/v1727259168/3_wc7yyl.png",
        "https://res.cloudinary.com/di6r722sv/image/upload/v1727259169/6_v3elje.png",
        "https://res.cloudinary.com/di6r722sv/image/upload/v1727259169/5_xtaizc.png",
        "https://res.cloudinary.com/di6r722sv/image/upload/v1727259169/7_nviboy.png",
        "https://res.cloudinary.com/di6r722sv/image/upload/v1727259171/9_js8yf9.png",
        "https://res.cloudinary.com/di6r722sv/image/upload/v1727259182/10_eskkp2.png",
    ];
    const userBanners = [
        "https://res.cloudinary.com/di6r722sv/image/upload/v1727940165/2_pb4vjr.jpg",
        "https://res.cloudinary.com/di6r722sv/image/upload/v1727940166/pexels-philippedonn-1169754_vkpfdu.jpg",
        "https://res.cloudinary.com/di6r722sv/image/upload/v1727940166/pexels-pixabay-531880_kgqqpx.jpg",
        "https://res.cloudinary.com/di6r722sv/image/upload/v1727940168/1_buuomt.jpg",
    ];

    function getRandomImage() {
        const randomIndex = Math.floor(Math.random() * userImages.length);
        return userImages[randomIndex];
    }
    function getRandomBanner() {
        const randomIndex = Math.floor(Math.random() * userBanners.length);
        return userBanners[randomIndex];
    }
    const randomBannerLink = getRandomBanner();
    const randomImageLink = getRandomImage();

    // Base schema validates step 1 fields only.
    const baseSchema = Yup.object().shape({
        firstName: Yup.string().required("First name is required"),
        lastName: Yup.string().required("Last name is required"),
        email: Yup.string().email("Invalid email address").required("Email is required"),
        password: Yup.string()
            .min(6, "Password must be at least 6 characters")
            .required("Password is required"),
        userType: Yup.string().oneOf(["USER", "DESIGNER"], "Invalid user type").required("User type is required"),
    });

    // Additional schema for photographers (DESIGNER)
    const designerSchema = Yup.object().shape({
        designerType: Yup.string().required("Designer type is required"),
        location: Yup.string().required("Location is required"),
        about: Yup.string().required("About is required"),
        phone: Yup.string().required("Phone number is required"),
        website: Yup.string().nullable(),
    });

    // Use a dynamic schema based on the current step.
    const getValidationSchema = () => {
        return step === 1 ? baseSchema : baseSchema.concat(designerSchema);
    };

    const initialValues: SignupValues = {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        userType: "USER",
        // Extra fields default to empty
        designerType: "",
        location: "",
        about: "",
        phone: "",
        website: "",
    };

    // Submission function: When the form is finally submitted, all values are sent.
    const handleSubmit = async (values: SignupValues, actions: FormikHelpers<SignupValues>) => {
        // Add the random images to the payload.
        const payload = {
            ...values,
            banner: randomBannerLink,
            profile: randomImageLink,
        };

        try {
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/register`,
                payload
            );
            console.log("Registration successful:", res.data);
            if (res.data) {
                toast.success("Register Successful");
                window.location.pathname = "/login";
            }
        } catch (error: any) {
            console.log("Registration error:", error);
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            }
        }
        actions.setSubmitting(false);
    };

    return (
        <div className="w-full">
            <Card className="w-full bg-white shadow-none border-none rounded-lg overflow-hidden">
                <AuthHeader
                    title={
                        <>
                            Create your <span className="font-medium">account</span>
                        </>
                    }
                    subtitle="Join PhotoConnect and showcase your photography"
                />

                <Formik
                    enableReinitialize
                    initialValues={initialValues}
                    validationSchema={getValidationSchema()}
                    onSubmit={handleSubmit}
                >
                    {({
                        values,
                        handleChange,
                        handleBlur,
                        setFieldValue,
                        errors,
                        touched,
                        isSubmitting,
                        submitForm,
                        validateForm,
                    }) => (
                        <Form className="p-6 space-y-4">
                            {/* Role Selection */}
                            <div>
                                <Label className="block text-sm font-medium text-gray-700 mb-1">
                                    I am a
                                </Label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        className={`flex items-center justify-center rounded-md py-2 px-3 text-sm transition-colors ${values.userType === "DESIGNER"
                                            ? "bg-indigo-600 text-white"
                                                : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                                            }`}
                                        onClick={() => {
                                            setFieldValue("userType", "DESIGNER");
                                            // Reset to step 1 if switching role
                                            setStep(1);
                                        }}
                                    >
                                        <svg
                                            className="mr-2 h-4 w-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                        </svg>
                                        Photographer
                                    </button>
                                    <button
                                        type="button"
                                        className={`flex items-center justify-center rounded-md py-2 px-3 text-sm transition-colors ${values.userType === "USER"
                                                ? "bg-indigo-600 text-white"
                                                : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                                            }`}
                                        onClick={() => {
                                            setFieldValue("userType", "USER");
                                            setStep(1);
                                        }}
                                    >
                                        <svg
                                            className="mr-2 h-4 w-4"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                            />
                                        </svg>
                                        Client
                                    </button>
                                </div>
                            </div>

                            {/* Step 1: Basic Information */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                                        First Name
                                    </Label>
                                    <input
                                        id="firstName"
                                        name="firstName"
                                        type="text"
                                        placeholder="Mark"
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                                        value={values.firstName}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    {errors.firstName && touched.firstName && (
                                        <div className="text-red-500 text-xs mt-1">{errors.firstName}</div>
                                    )}
                                </div>
                                <div>
                                    <Label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                                        Last Name
                                    </Label>
                                    <input
                                        id="lastName"
                                        name="lastName"
                                        type="text"
                                        placeholder="Paul"
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                                        value={values.lastName}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    {errors.lastName && touched.lastName && (
                                        <div className="text-red-500 text-xs mt-1">{errors.lastName}</div>
                                    )}
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email
                                </Label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    placeholder="example@email.com"
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                                    value={values.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                {errors.email && touched.email && (
                                    <div className="text-red-500 text-xs mt-1">{errors.email}</div>
                                )}
                            </div>
                            <div className="relative">
                                <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Password
                                </Label>
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={values.password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                                    placeholder="Enter password"
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute right-3 top-9 text-gray-500"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                                {errors.password && touched.password && (
                                    <div className="text-red-500 text-xs mt-1">{errors.password}</div>
                                )}
                            </div>

                            {/* Step 2: Extra fields for Photographers */}
                            {values.userType === "DESIGNER" && step === 2 && (
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="designerType" className="block text-sm font-medium text-gray-700">
                                            Specialty
                                        </Label>
                                        <Input
                                            id="designerType"
                                            name="designerType"
                                            placeholder="Wedding Photographer"
                                            value={values.designerType}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        {errors.designerType && touched.designerType && (
                                            <div className="text-red-500 text-xs mt-1">{errors.designerType}</div>
                                        )}
                                    </div>
                                    <div>
                                        <Label htmlFor="location" className="block text-sm font-medium text-gray-700">
                                            Location
                                        </Label>
                                        <Input
                                            id="location"
                                            name="location"
                                            placeholder="Your city or region"
                                            value={values.location}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        {errors.location && touched.location && (
                                            <div className="text-red-500 text-xs mt-1">{errors.location}</div>
                                        )}
                                    </div>
                                    <div>
                                        <Label htmlFor="about" className="block text-sm font-medium text-gray-700">
                                            About
                                        </Label>
                                        <textarea
                                            id="about"
                                            name="about"
                                            placeholder="Tell us about yourself"
                                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                                            value={values.about}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        {errors.about && touched.about && (
                                            <div className="text-red-500 text-xs mt-1">{errors.about}</div>
                                        )}
                                    </div>
                                    <div>
                                        <Label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                            Phone Number
                                        </Label>
                                        <Input
                                            id="phone"
                                            name="phone"
                                            placeholder="Your contact number"
                                            value={values.phone}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        {errors.phone && touched.phone && (
                                            <div className="text-red-500 text-xs mt-1">{errors.phone}</div>
                                        )}
                                    </div>
                                    <div>
                                        <Label htmlFor="website" className="block text-sm font-medium text-gray-700">
                                            Website (optional)
                                        </Label>
                                        <Input
                                            id="website"
                                            name="website"
                                            placeholder="Your website URL"
                                            value={values.website}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        {errors.website && touched.website && (
                                            <div className="text-red-500 text-xs mt-1">{errors.website}</div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Action Button */}
                            <div className="flex flex-col items-end justify-end  space-y-3">
                                <button
                                    onClick={async () => {
                                        if (values.userType === "DESIGNER" && step === 1) {
                                            const errors = await validateForm();
                                            if (
                                                !errors.firstName &&
                                                !errors.lastName &&
                                                !errors.email &&
                                                !errors.password &&
                                                !errors.userType
                                            ) {
                                                setStep(2);
                                                return;
                                            }
                                        }
                                        submitForm();
                                    }}
                                    type="button"
                                    className="group relative w-fit mt-10 flex justify-center py-2 px-4 border border-transparent rounded-full shadow-sm  font-medium text-white bg-indigo-700 hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center">
                                            <svg
                                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                ></path>
                                            </svg>
                                            Creating account...
                                        </span>
                                    ) : (
                                        values.userType === "DESIGNER" && step === 1 ? "Next" : "Create account"
                                    )}
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </Card>
        </div>
    );
}
