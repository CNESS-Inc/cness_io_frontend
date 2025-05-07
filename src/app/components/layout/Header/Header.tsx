// src/app/components/layout/Header/Header.tsx
import Link from 'next/link'
import Image from 'next/image'
import NavLinks from './NavLinks'
import UserMenu from './UserMenu'

export default function Header() {
  return (
    <header 
      className=" bg-white "
      role="banner"
      aria-label="Main navigation"
    >
      <div className="mx-4 px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center" aria-label="Home">
            <Image
              src="/logo.png" // Path to your image in the public folder
              alt="Company Logo"
              width={120} // Set appropriate width
              height={40} // Set appropriate height
              className="h-auto w-[144.16px]" // Optional: Add any additional styling
              priority // Optional: If this is above the fold
            />
          </Link>
        </div>

        {/* Navigation Links */}
        <NavLinks />

        {/* User Menu / Auth Buttons */}
        {/* <UserMenu /> */}
      </div>
    </header>
  )
}