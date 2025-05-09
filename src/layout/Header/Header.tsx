'use client'
import NavLinks from './NavLinks'
import { useState } from 'react'
import MobileMenu from './MobileMenu'
import { Link } from 'react-router-dom'
import Image from '../../components/ui/Image'

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header 
      className="bg-white "
      role="banner"
      aria-label="Main navigation"
    >
      <div className="mx-4 px-4 py-3 flex items-center justify-between max-w-7xl">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center" aria-label="Home">
            <Image
              src="/logo.png"
              alt="Company Logo"
              width={120}
              className="h-auto w-[144.16px]"
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <NavLinks className="hidden md:flex" />

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-md text-gray-700 hover:text-primary-600 focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isMobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <MobileMenu isOpen={isMobileMenuOpen} />
    </header>
  )
}