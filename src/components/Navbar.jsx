import React, { useState, useEffect } from "react";
import { Link as ScrollLink } from "react-scroll";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom"; // Added useLocation
import { RiMenuFill } from "react-icons/ri";
import { AiOutlineClose } from "react-icons/ai";
import Login from "./Login";
import Signup from "./Signup";
import { jwtDecode } from "jwt-decode";

function Navbar() {
  const [menu, setMenu] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [roleBase, setRoleBase] = useState("");
  const navigate = useNavigate();
  const location = useLocation(); // Used to determine if we are on a dashboard

  // Function to check the token and set state
  const checkAuthStatus = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoggedIn(false);
      setRoleBase("");
      return;
    }
    try {
      const decoded = jwtDecode(token);
      setRoleBase(decoded.role);
      setIsLoggedIn(true);
    } catch (err) {
      console.log("Token decode error:", err);
      // Clear invalid token
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      setRoleBase("");
    }
  };

  // Called on successful login/signup
  const handleAuthSuccess = () => {
    // 1. Close the modals
    setShowLogin(false);
    setShowSignup(false);
    setMenu(false); // Close mobile menu if open
    // 2. Immediately check the new token and update Navbar state
    checkAuthStatus();
    // Optional: Navigate to the user's dashboard after successful login
    // navigate(`/dashboard/${roleBase}`); // This might need a slight delay
  };

  // Logout handler
  const handleLogout = (e) => {
   e.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setRoleBase("");
    navigate("/");
  };

  // Initial check when component mounts
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const isDashboard = location.pathname.startsWith("/dashboard");

  // Reusable button styling
  const btnStyle = "bg-white text-pink-500 px-4 py-2 rounded-md font-semibold shadow-md border border-pink-300 hover:bg-pink-500 hover:text-white hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 ease-in-out";


  return (
    <div className="fixed w-full z-50 text-white top-0 left-0">
      <div className="flex flex-row justify-between items-center p-5 md:px-32 px-5 bg-pink-500 shadow-md mx-auto">
        {/* Logo */}
        <RouterLink to="/">
          <h1 className="text-2xl font-bold text-pink-200 cursor-pointer">
            Mothers Care
          </h1>
        </RouterLink>

        {/* Desktop Menu */}
        <nav className="hidden lg:flex flex-row items-center text-lg gap-8 font-medium">
          {/* Main Links */}
          {!isDashboard ? (
            <>
              <ScrollLink to="home" smooth duration={500} className="hover:text-pink-300 cursor-pointer"> Home </ScrollLink>
              <ScrollLink to="about" smooth duration={500} className="hover:text-pink-300 cursor-pointer"> About </ScrollLink>
              <ScrollLink to="services" smooth duration={500} className="hover:text-pink-300 cursor-pointer"> Services </ScrollLink>
            </>
          ) : (
            <RouterLink to="/" className="hover:text-pink-300 cursor-pointer"> Home </RouterLink>
            
          )}

<>
          {/* Role-based Links */}
           {isLoggedIn && isDashboard || (
             <div>
      {roleBase === "doctor" && (
        <RouterLink to="/dashboard/doctor" className="hover:text-pink-300 cursor-pointer">
          Doctor Dashboard
        </RouterLink>
      )}
      {roleBase === "patient" && (
        <RouterLink to="/dashboard/patient" className="hover:text-pink-300 cursor-pointer">
          Patient Dashboard
        </RouterLink>
      )}
      {roleBase === "admin" && (
        <RouterLink to="/dashboard/admin" className="hover:text-pink-300 cursor-pointer">
          Admin Dashboard
        </RouterLink>
      )}
    </div>
  )}
  </>
        </nav>

        {/* Buttons (Desktop) */}
        {!isLoggedIn && !isDashboard ? (
          <div className="gap-4 hidden lg:flex flex-row">
            <button type="button" onClick={() => setShowLogin(true)} className={btnStyle}> Login </button>
            <button type="button" onClick={() => setShowSignup(true)} className={btnStyle}> Sign Up </button>
          </div>
        ) : (
          <div className="gap-4 hidden lg:flex flex-row">
            <button type="button" onClick={handleLogout} className={btnStyle}> Logout </button>
          </div>
        )}

        {/* Mobile Menu Toggle */}
        <div className="lg:hidden flex items-center">
          {menu ? (
            <AiOutlineClose size={28} className="cursor-pointer" onClick={() => setMenu(false)} />
          ) : (
            <RiMenuFill size={28} className="cursor-pointer" onClick={() => setMenu(true)} />
          )}
        </div>
      </div>

      {/* Mobile Menu (rest of the code is simplified using btnStyle) */}
      {menu && (
        <div className="fixed inset-0 bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-pink-500 w-11/12 max-w-sm rounded-2xl p-6 flex flex-col items-center text-white text-lg gap-6 font-medium shadow-xl relative">
            <AiOutlineClose size={28} className="absolute top-4 right-4 cursor-pointer hover:text-pink-200" onClick={() => setMenu(false)} />
            <h2 className="text-2xl font-bold text-pink-100 mb-2">Menu</h2>
            <div className="w-full border-t border-pink-300 my-2"></div>

            {/* Public Links */}
            {!isDashboard ? (
                <>
                  <ScrollLink to="home" smooth duration={500} onClick={() => setMenu(false)} className="hover:text-pink-200 cursor-pointer"> Home </ScrollLink>
                  <ScrollLink to="about" smooth duration={500} onClick={() => setMenu(false)} className="hover:text-pink-200 cursor-pointer"> About </ScrollLink>
                  <ScrollLink to="services" smooth duration={500} onClick={() => setMenu(false)} className="hover:text-pink-200 cursor-pointer"> Services </ScrollLink>
                </>
              ) : (
                <RouterLink to="/" onClick={() => setMenu(false)} className="hover:text-pink-200 cursor-pointer"> Home </RouterLink>
              )}

  <>
          {/* Role-based Links */}
           {isLoggedIn && isDashboard || (
             <div>
      {roleBase === "doctor" && (
        <RouterLink to="/dashboard/doctor" className="hover:text-pink-300 cursor-pointer">
          Doctor Dashboard
        </RouterLink>
      )}
      {roleBase === "patient" && (
        <RouterLink to="/dashboard/patient" className="hover:text-pink-300 cursor-pointer">
          Patient Dashboard
        </RouterLink>
      )}
      {roleBase === "admin" && (
        <RouterLink to="/dashboard/admin" className="hover:text-pink-300 cursor-pointer">
          Admin Dashboard
        </RouterLink>
      )}
    </div>
  )}
  </>
{!isLoggedIn && !isDashboard ? (
          <div className="gap-4 lg:flex flex-row">
            <button type="button" onClick={() => setShowLogin(true)} className={btnStyle}> Login </button>
            <button type="button" onClick={() => setShowSignup(true)} className={btnStyle}> Sign Up </button>
          </div>
        ) : (
          <div className="gap-4  lg:flex flex-row">
            <button type="button" onClick={handleLogout} className={btnStyle}> Logout </button>
          </div>
        )}
          </div>
        </div>
      )}

      {/* Popups - IMPORTANT: PASS THE NEW PROP */}
      {showLogin && <Login onClose={() => setShowLogin(false)} onAuthSuccess={handleAuthSuccess} />}
      {showSignup && <Signup onClose={() => setShowSignup(false)} onAuthSuccess={handleAuthSuccess} />}
    </div>
  );
}

export default Navbar;