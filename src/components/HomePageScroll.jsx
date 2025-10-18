import React from 'react'
import Home from '../pages/Home'
import About from '../pages/About'
import Services from '../pages/Services'

function HomePageScroll() {
    // Check if we are on homepage
    const isHomePage = window.location.pathname === "/";
    
  return (
    <div>
      {/* Only show landing sections on "/" */}
      {isHomePage && (
        <main>
          <div id='home'>
            <Home />
          </div>
          <div id='about'>
            <About />
          </div>
          <div id='services'>
            <Services />
          </div>
        </main>
      )}
    </div>
  )
}

export default HomePageScroll
