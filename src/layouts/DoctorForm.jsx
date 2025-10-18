import React, { useState, useEffect } from "react";
import { baseURL } from "../api";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

function DoctorForm({ isVisible, editData, onClose, onSaveSuccess }) {
  if (!isVisible) return null;

  const [userID, setUserID] = useState("");
  const [formData, setFormData] = useState({
    user: "",
    name: "",
    specialization: "",
    contact: { email: "", phone: "" },
    address: { street: "", city: "", state: "", pin: "" },
    department: "",
    experience: "",
    qualifications: "",
    availability: "full-time",
    onCall: false,
  });

  // Load user ID from token
  useEffect(() => {
    const token = localStorage.getItem("token");
    try {
      const decoded = jwtDecode(token);
      setUserID(decoded.userId);
    } catch (err) {
      console.error("JWT decode error:", err);
    }
  }, []);
  console.log(userID)

  // Prefill data for editing
  useEffect(() => {
    if (editData) setFormData(editData);
  }, [editData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
      return;
    }

    const keys = name.split(".");
    setFormData((prev) => {
      const updated = { ...prev };
      let nested = updated;
      for (let i = 0; i < keys.length - 1; i++) {
        nested[keys[i]] = { ...nested[keys[i]] };
        nested = nested[keys[i]];
      }
      nested[keys[keys.length - 1]] = value;
      return updated;
    });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      

      let res;
      if (editData) {
        res = await axios.put(`${baseURL}/api/doctors/${editData._id}`, formData, { headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          }, });
      } else {
        const payload = { ...formData, userId: userID }; // ✅ correct key
        res = await axios.post(`${baseURL}/api/doctors`, payload, { headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          }, });
      }

      alert("Doctor details saved successfully!");
      onSaveSuccess(); // ✅ refresh Doctor.jsx
    } catch (err) {
      console.error("API Error:", err.response?.data || err.message);
      alert("Error saving doctor details");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 mt-20 z-50">
      <div className="max-w-md w-full bg-blue-200 text-gray-700 p-6 rounded shadow-md relative">
        <button className="absolute top-2 right-2 text-xl" onClick={onClose}>
          ✕
        </button>
        <h1 className="text-2xl font-bold mb-4 text-center">
          {editData ? "Update Doctor Details" : "Doctor Details Form"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* name & specialization */}
          <div className="flex gap-3">
            <input type="text" name="name" placeholder="Name" value={formData.name}
              onChange={handleChange} className="w-full p-2 border rounded" required />
            <input type="text" name="specialization" placeholder="Specialization"
              value={formData.specialization} onChange={handleChange}
              className="w-full p-2 border rounded" required />
          </div>

          {/* contact */}
          <div className="flex gap-3">
            <input type="email" name="contact.email" placeholder="Email"
              value={formData.contact.email} onChange={handleChange}
              className="w-full p-2 border rounded" required />
            <input type="text" name="contact.phone" placeholder="Phone"
              value={formData.contact.phone} onChange={handleChange}
              className="w-full p-2 border rounded" required />
          </div>

          {/* address */}
          <div className="flex gap-3">
            <input type="text" name="address.street" placeholder="Street"
              value={formData.address.street} onChange={handleChange}
              className="w-full p-2 border rounded" />
            <input type="text" name="address.city" placeholder="City"
              value={formData.address.city} onChange={handleChange}
              className="w-full p-2 border rounded" />
          </div>

          <div className="flex gap-3">
            <input type="text" name="address.state" placeholder="State"
              value={formData.address.state} onChange={handleChange}
              className="w-full p-2 border rounded" />

            <input type="text" name="address.pin" placeholder="pin code"
              value={formData.address.pin} onChange={handleChange}
              className="w-full p-2 border rounded" />
          </div>
          
          <div className="flex gap-3">
            <input
              type="text"
              name="qualifications"
              placeholder="qualifications"
              value={formData.qualifications}
              onChange={handleChange}
              className="w-full p-2 border hover:bg-gray-200 focus:outline-offset-2 focus:outline-blue-400 active:bg-blue-700 rounded"
            />
            <input
              type="number"
              name="experience"
              placeholder="experience"
              value={formData.experience}
              onChange={handleChange}
              className="w-full p-2 border hover:bg-gray-200 focus:outline-offset-2 focus:outline-blue-400 active:bg-blue-700 rounded"
            />
          </div>

          {/* more fields */}
          
<select
  name="department"
  value={formData.department}
  onChange={handleChange}
  className="w-full p-2 border rounded"
>
  <option value="">Select Department</option>
  <option value="Cardiology">Cardiology</option>
  <option value="Neurology">Neurology</option>
  <option value="Pediatrics">Pediatrics</option>
  <option value="Dental">Dental</option>
  <option value="General">General</option>
</select>


          <select name="availability" value={formData.availability}
            onChange={handleChange} className="w-full p-2 border rounded">
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="consultant">Consultant</option>
          </select>

          <label className="flex items-center gap-2">
            <input type="checkbox" name="onCall" checked={formData.onCall} onChange={handleChange} />
            On Call
          </label>

          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
            {editData ? "Update Profile" : "Create Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default DoctorForm;
