import React from 'react'

function ServicesCard({icon, title}) {
  return (
    <div className='group flex flex-col items-center w-full lg:w-1/3 p-6 border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer text-center ease-in-out'>
      <div className='bg-[#d5f2ec] p-3 rounded-full transition-colors duration-300 ease-in-out group-hover:bg-pink-300' >
        {icon}
      </div>
      <h1 className='text-2xl font-semibold my-4 text-gray-800 group-hover:text-pink-500 transition-colors duration-300 ease-in-out'>
        {title}
      </h1>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit illo ratione placeat dolorem impedit iure, suscipit voluptates eum doloremque, molestias error ipsa dolor! Rem porro alias minus earum repellat commodi?</p>
      <h3 className='text-lg font-semibold text-gray-700 group-hover:text-pink-500 transition-colors duration-300 ease-in-out'>Learn more</h3>
    </div>
  )
}

export default ServicesCard

