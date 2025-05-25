import React from 'react';
import { Link } from 'react-router-dom';
import heroImage from "../assets/docLan.svg";

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 text-gray-900 flex flex-col">
            {/* Assuming you import and place your existing Navbar here */}

            {/* Hero Section */}
            <main className="flex-1 flex items-center justify-center px-6 py-16">
                <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

                    {/* Left: Text */}
                    <div className="text-center md:text-left">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">
                            Manage Your Documents Intelligently with AI
                        </h2>
                        <p className="text-lg md:text-xl text-gray-700 mb-8">
                            Upload, update, and query your documents using powerful AI—all in one seamless platform.
                        </p>
                        <Link
                            to="/dashboard"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold transition-colors duration-300"
                        >
                            Try it now
                        </Link>
                    </div>

                    {/* Right: Image */}
                    <div className="flex justify-center">
                        <img
                            src={heroImage}
                            alt="AI Document Management Illustration"
                            className="w-full h-auto max-w-2xl"
                        />
                    </div>

                </div>
            </main>

        </div>
    );
};

export default LandingPage;
