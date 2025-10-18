import React from 'react'
import Navbar from '../components/Navbar'

function Home() {
  return (
    <div>
      <Navbar />
      <div
  className='relative min-h-screen flex flex-col justify-center lg:px-32 px-5 
             bg-[url("https://i.pinimg.com/736x/e0/86/b9/e086b9998d5128195316838597407b2b.jpg")] 
             bg-cover bg-no-repeat'
>
  {/* Dark Overlay */}
  <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px]"></div>

  {/* Content */}
  <div className='relative z-10 w-full lg:w-4/5 space-y-5 mt-10 animate-fade-in-up'>
    <h1 className='text-5xl font-bold text-pink-800 drop-shadow-lg transition-all duration-700 hover:scale-105'>
      Welcome to Mothers Care
    </h1>
    <p className='text-lg text-pink-900 font-semibold leading-relaxed animate-slide-in'>
      Your trusted partner in maternal health and wellness.
      <br />
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet repellat
      dolorem ex veritatis fugiat tenetur modi. Labore, saepe laborum
      consequuntur officiis amet quo illo earum fugiat dignissimos quod magnam
      laudantium!
    </p>
  </div>
</div>
    </div>
  )
}

export default Home
