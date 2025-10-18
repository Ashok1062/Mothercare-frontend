import React from "react";
import { useState } from "react";
import { BsEye , BsEyeSlash } from "react-icons/bs";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {baseURL} from "../api";
import {jwtDecode} from "jwt-decode";

function Login({ onClose }) {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const handleChange = (e) => {  
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate();
  const handleSubmit = async(e) => {
    e.preventDefault();
        try {
            const res = await axios.post(`${baseURL}/api/users/login`,formData);
      localStorage.setItem("token",res.data.token);
      const decoded = jwtDecode(res.data.token);
      const role = decoded.role;
      if (role === "doctor") navigate("/dashboard/doctor");
      else if (role === "patient") navigate("/dashboard/patient");
      else if (role === "admin") navigate("/dashboard/admin");
      else navigate("/");

            onClose();
        } catch (error) {
             setErrorMsg("Invalid credentials");
        }
    };
 
  return (
    <div className="fixed top-0 w-screen h-screen bg-opacity-25 backdrop-blur-sm flex justify-center items-center">
      <div className="bg-pink-100 p-6 rounded-lg shadow-lg w-96 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
        >
          ✖
        </button>

        <h2 className="text-xl font-bold mb-4 text-pink-600">Login</h2>

        <form onSubmit={handleSubmit} className="flex flex-col text-black gap-4">

          <input type="email" onChange={handleChange} name="email" placeholder="Email" className="border p-2 rounded " />
         
          <div className="flex items-center relative rounded">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
                onChange={handleChange}
              placeholder="Password"
              className="border p-2 rounded w-full"
            />
            <button
              type="button"
              className="ml-2 absolute right-2 text-gray-500 hover:text-gray-800"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <BsEyeSlash /> : <BsEye />}
            </button>
          </div>
            {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}

          <button
            type="submit"
            
            className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
