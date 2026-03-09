'use client';

import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-orange-50 dark:bg-gray-900 transition-all duration-500 px-4">
            <div className="text-center max-w-2xl mx-auto">
                {/* 404 Number with Orange Gradient */}
                <div className="relative mb-8">
                    {/* Background Glow */}
                    <div className="absolute inset-0 blur-3xl opacity-30">
                        <div className="text-[200px] md:text-[300px] font-black text-orange-500 leading-none">
                            404
                        </div>
                    </div>

                    {/* Main 404 Text */}
                    <h1 className="relative text-[120px] md:text-[200px] font-black leading-none">
                        <span className="bg-gradient-to-br from-orange-400 to-orange-600 bg-clip-text text-transparent">
                            404
                        </span>
                    </h1>
                </div>

                {/* Error Message */}
                <div className="space-y-4 mb-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                        Halaman Tidak Ditemukan
                    </h2>
                    <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                        Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    {/* Back to Home Button */}
                    <Link
                        href="/"
                        className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105 shadow-lg shadow-orange-500/30"
                    >
                        <Home size={20} />
                        Kembali ke Beranda
                    </Link>

                    {/* Go Back Button */}
                    <button
                        onClick={() => window.history.back()}
                        className="group inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-orange-500 font-semibold rounded-lg transition-all duration-300 hover:bg-orange-50 dark:hover:bg-gray-700 hover:scale-105"
                    >
                        <ArrowLeft size={20} />
                        Kembali
                    </button>
                </div>

                {/* Decorative Elements */}
                <div className="mt-16 relative">
                    <div className="absolute left-1/2 -translate-x-1/2 w-32 h-32 bg-orange-500 rounded-full opacity-10 blur-3xl animate-pulse"></div>
                </div>
            </div>
        </div>
    );
}
