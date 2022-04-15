import React from "react"

const HamburgerMenu = () => {
  return (
    <React.Fragment>
      <div className="block">
        <div className="ml-4 flex items-center md:ml-6">
        </div>
      </div>
      <div className="-mr-2 flex md:hidden">
        <button className="text-gray-800 dark:text-white hover:text-gray-300 inline-flex items-center justify-center p-2 rounded-md focus:outline-none">
          <svg width="20" height="20" fill="currentColor" className="h-8 w-8" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
            <path d="M1664 1344v128q0 26-19 45t-45 19h-1408q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h1408q26 0 45 19t19 45zm0-512v128q0 26-19 45t-45 19h-1408q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h1408q26 0 45 19t19 45zm0-512v128q0 26-19 45t-45 19h-1408q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h1408q26 0 45 19t19 45z">
            </path>
          </svg>
        </button>
      </div>
    </React.Fragment>
  )
}

export default HamburgerMenu
