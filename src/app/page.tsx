import Link from 'next/link'
import React from 'react'

function page() {
  return (
    <>
        <div className="flex min-h-screen flex-col">
        <div className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-black text-white">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-black to-gray-900 z-0"></div>

          {/* Decorative circles */}
          <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-gray-800/30 blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-gray-800/30 blur-3xl"></div>

          {/* Content */}
          <div className="relative z-10 container mx-auto px-4 py-20 md:py-28">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h1 className="text-5xl md:text-7xl font-light tracking-tight mb-8">
                  Where <span className="font-medium">Photography</span> Meets <span className="font-medium">Opportunity</span>
                </h1>

                <p className="text-xl md:text-2xl text-white/70 mb-12 max-w-3xl mx-auto">
                  Connect with talented photographers or showcase your portfolio to clients worldwide.
                  Find the perfect match for your vision.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Link
                    href="/discover"
                    className="px-8 py-4 bg-white text-black text-lg rounded-lg font-medium transition-all duration-300 hover:bg-white/90 hover:scale-105"
                  >
                    Browse Photographers
                  </Link>
                  <Link
                    href="/login"
                    className="px-8 py-4 bg-transparent border border-white text-white text-lg rounded-lg font-medium transition-all duration-300 hover:bg-white/10 hover:scale-105"
                  >
                    Join as Photographer
                  </Link>
                </div>
              </div>

              {/* Featured preview images */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
                <div className="aspect-square overflow-hidden rounded-lg">
                  <img
                    src="https://images.unsplash.com/photo-1520549233664-03f65c1d1327"
                    alt="Photography"
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
                <div className="aspect-square overflow-hidden rounded-lg">
                  <img
                    src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e"
                    alt="Photography"
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
                <div className="aspect-square overflow-hidden rounded-lg">
                  <img
                    src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"
                    alt="Photography"
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
                <div className="aspect-square overflow-hidden rounded-lg">
                  <img
                    src="https://images.unsplash.com/photo-1513836279014-a89f7a76ae86"
                    alt="Photography"
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-float">
            <div className="flex flex-col items-center">
              <span className="text-sm text-gray-400 mb-2">Scroll to explore</span>
              <svg
                className="w-6 h-6 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </div>
          </div>
        </div>
        <section className="bg-black py-20 text-white">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-6 text-3xl font-light md:text-4xl">
                Are you a <span className="font-medium">photographer</span>?
              </h2>
              <p className="mb-8 text-white/80">
                Join our community of professional photographers and showcase your work to
                potential clients worldwide. Create a stunning portfolio, connect with clients,
                and grow your business.
              </p>
              <Link
                href="/login"
                className="inline-block rounded-full bg-white px-8 py-3 text-black transition-all duration-300 hover:bg-white/90 hover-scale"
              >
                Create your portfolio
              </Link>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-black/5">
                  <svg
                    className="h-8 w-8 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-medium">Showcase Your Work</h3>
                <p className="text-gray-600">
                  Create a beautiful portfolio that highlights your best photography work and skills.
                </p>
              </div>

              <div className="text-center">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-black/5">
                  <svg
                    className="h-8 w-8 text-indigo-600"

                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-medium">Connect with Clients</h3>
                <p className="text-gray-600">
                  Get discovered by potential clients looking for your specific photography style.
                </p>
              </div>

              <div className="text-center">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-black/5">
                  <svg
                    className="h-8 w-8 text-indigo-600"

                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-xl font-medium">Grow Your Business</h3>
                <p className="text-gray-600">
                  Manage bookings, track your performance, and increase your photography revenue.
                </p>
              </div>
            </div>
          </div>
        </section>

     
      </div>
    </>
  )
}

export default page