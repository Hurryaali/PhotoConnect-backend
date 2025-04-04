"use client";

import { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import AuthHeader from "../../signup/_components/AuthHeader";

export default function LoginPage() {

  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const router = useRouter()
  const LoginSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email address").required("Email is required"),
    password: Yup.string().required("Password is required"),
    rememberMe: Yup.boolean(),
  });

  const searchParams = useSearchParams();
  const errorQuery = searchParams.get("error");
  console.log("🚀 ~ LoginPage ~ errorQuery:", errorQuery)

  useEffect(() => {
    if (errorQuery) {
      toast.error(errorQuery);
      router.replace("/login");

    }
  }, [errorQuery]);

  return (
    <div className=" w-full">
      <Card className="w-full  bg-white shadow-none border-none rounded-lg overflow-hidden">

        <div className="flex flex-col items-start py-6">
          <AuthHeader
            title={
              <>
              Welcome <span className="font-medium">back</span>
              </>
            }
            subtitle="      Sign in to your PhotoConnect account"
          />
       
        </div>
  

        <Formik
          initialValues={{ email: "", password: "", rememberMe: false }}
          validationSchema={LoginSchema}
          onSubmit={async (values, actions) => {
            console.log("Form values:", values);
            await signIn("credentials", {
              ...values,
              callbackUrl: "/",
            });
            actions.setSubmitting(false);
          }}
        >
          {({ values, handleChange, handleBlur, errors, touched, isSubmitting, setFieldValue }) => (
            <Form>
              <CardContent className="mt-4 space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"

                    placeholder="example@email.com"
                  />
                  {errors.email && touched.email && (
                    <div className="text-red-500 text-sm">{errors.email}</div>
                  )}
                </div>
                <div className="relative">
                  <Label htmlFor="password">Password</Label>
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
                    className="absolute right-3 top-[37px] text-gray-500"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                  {errors.password && touched.password && (
                    <div className="text-red-500 text-sm">{errors.password}</div>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-10">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="rememberMe"
                      name="rememberMe"
                      checked={values.rememberMe}
                      onCheckedChange={(checked: boolean) =>
                        setFieldValue("rememberMe", checked)
                      }
                    />
                    <label htmlFor="rememberMe" className="text-sm text-gray-600">
                      Remember me on this device
                    </label>
                  </div>
                </div>
                <div className="flex items-center justify-end">

                <button
                  type="submit"
                  className="group relative w-fit flex justify-center py-2 px-4 border border-transparent rounded-full shadow-sm  font-medium text-white bg-indigo-700 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
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
                      Logging in...
                    </span>
                  ) : (
                    "Log in"
                  )}
                </button>
                </div>

              </CardContent>
            </Form>
          )}
        </Formik>
      </Card>
    </div>
  );
}
