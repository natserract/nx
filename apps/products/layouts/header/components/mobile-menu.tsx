import Link from 'next/link'

const MobileMenu = () => {
  return (
    <div className="md:hidden">
      <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        <Link href="/">
          <a className="text-gray-300 hover:text-gray-800 dark:hover:text-white block px-3 py-2 rounded-md text-base font-medium" >
            Lists
          </a>
        </Link>
        <Link href="/create">
          <a className="text-gray-800 dark:text-white block px-3 py-2 rounded-md text-base font-medium" >
            Create
          </a>
        </Link>
      </div>
    </div>
  )
}

export default MobileMenu
