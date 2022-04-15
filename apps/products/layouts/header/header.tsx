import { styles } from './header.styles'
import Link from 'next/link'
import React, { useState } from 'react'
import HamburgerMenu from './components/hamburger-menu';
import MobileMenu from './components/mobile-menu';

/* eslint-disable-next-line */
export interface HeaderProps { }

export function Header(props: HeaderProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [state, setState] = useState()

  const renderNavContent = () => {
    return (
      <div className="flex items-center justify-between h-16">
        <div className=" flex items-center">
          <div className="hidden md:block">
            <div className="flex items-baseline">
              <Link href="/">
                <a className="text-gray-300 hover:text-gray-800 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium" >
                  Lists
                </a>
              </Link>

              <Link href="/create">
                <a className="text-gray-300  hover:text-gray-800 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium" >
                  Create
                </a>
              </Link>
            </div>
          </div>
        </div>

        <HamburgerMenu />
      </div>
    )
  }

  return (
    <div className={styles.navContainer}>
      <nav className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-8">
          {renderNavContent()}
        </div>

        <MobileMenu />
      </nav>
    </div>
  );
}

export default Header;
