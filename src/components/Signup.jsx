import axios from "axios";
import React from "react";
import { useState } from "react";
import { BsEye , BsEyeSlash } from "react-icons/bs";
import { baseURL } from "../api";

function Signup({ onClose }) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "patient"
  });
  const handleChange = (e) => {  
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }
  const handleSubmit = async(e) => {
    e.preventDefault();
    await axios.post(`${baseURL}/api/users/register`,formData);
    onClose();
    alert("Registration Successful! Please Login.");
  }


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

        <h2 className="text-xl font-bold mb-4 text-pink-600">Sign Up</h2>

        <form onSubmit={handleSubmit} className="flex flex-col text-black gap-4">
            <div className="flex flex-col justify-start ">
                <label htmlFor="username" className="mb-1 font-medium">Username</label>
                <input onChange={handleChange} name="username" type="text" placeholder="Username" className="border p-2 rounded " />
            </div>
            <div className="flex flex-col justify-start ">
                <label htmlFor="email" className="mb-1 font-medium">Email</label>
                <input onChange={handleChange} name="email" type="email" placeholder="Email" className="border p-2 rounded " />
            </div>

           <div className="flex flex-col w-full">
      <label htmlFor="password" className="mb-1 font-medium">
        Password
      </label>

      
      <div className="relative w-full">
        <input
          name="password"
          onChange={handleChange}
          type={showPassword ? "text" : "password"}
          placeholder="Enter password"
          className="border p-2 rounded w-full pr-10"
        />

        
        <button
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <BsEye /> : <BsEyeSlash />}
        </button>
      </div>
    </div>
          <div className="flex flex-col justify-start ">
            <label htmlFor="role" className="mb-1 font-medium">Role</label>
            <select onChange={handleChange} name="role" className="border p-2 rounded bg-pink-100" defaultValue="patient">
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
            
          <button
            type="submit"
            className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
