
import React from "react";

interface AuthHeaderProps {
    title: React.ReactNode;
    subtitle: string;
}

const AuthHeader: React.FC<AuthHeaderProps> = ({ title, subtitle }) => {
    return (
        <div className="text-start ml-7">
            <h1 className="mt-6 text-3xl font-light tracking-tight text-gray-900">
                {title}
            </h1>
            <p className="mt-2 text-sm text-gray-600">
                {subtitle}
            </p>
        </div>
    );
};

export default AuthHeader;