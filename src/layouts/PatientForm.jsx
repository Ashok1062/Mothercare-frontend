import React, { useState, useEffect } from "react";
import { baseURL } from "../api";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

function PatientForm({ isVisible, editData, onClose, onSaveSuccess }) {
  if (!isVisible) return null;

  const [userID, setUserID] = useState("");

  const [formData, setFormData] = useState({
    userId: "",
    patientName: "",
    age: "",
    gender: "",
    contact: { email: "", phone: "" },
    address: { street: "", city: "", state: "", pin: "" },
    medicalHistory: "",
    currentMedications: "",
    allergies: "",
    emergencyContact: { name: "", phone: "", email: "" },
    insuranceDetails: { provider: "", policyNumber: "", coverageDetails: "" },
    primaryPhysician: "",
  });

  //  Get logged-in user's ID from token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserID(decoded.userId);
      } catch (err) {
        console.error("JWT decode error:", err);
      }
    }
  }, []);

  //  Prefill data when editing
  useEffect(() => {
    if (editData) {
      setFormData(editData);
    }
  }, [editData]);

  //  Handle nested input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
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

  //  Submit (Create / Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      let response;
      if (editData) {
        // Update existing patient
        response = await axios.put(
          `${baseURL}/api/patients/${editData._id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      } else {
        // Create new patient (attach userId)
        const payload = { ...formData, userId: userID };
        response = await axios.post(`${baseURL}/api/patients`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      }

      alert("Patient details saved successfully!");
      onSaveSuccess?.();
      onClose();
    } catch (err) {
      console.error("API Error:", err.response?.data || err.message);
      alert("Error saving patient details");
    }
  };

  return (
    <div className="fixed inset-0  flex items-center justify-center bg-black/30 z-50">
      <div className=" w-[700px] bg-blue-200 text-gray-700 p-6 rounded-xl mt-13 lg:mt-20  shadow-md relative">
        <button
          className="absolute top-2 right-2 text-xl"
          onClick={onClose}
        >
          ✕
        </button>

        <h1 className="text-2xl font-bold mb-4 text-center">
          {editData ? "Update Patient Details" : "Patient Details Form"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-3 ">
          {/* name, age, gender */}
          <div className="flex gap-3">
            <input
              type="text"
              name="patientName"
              placeholder="Patient Name"
              value={formData.patientName}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="number"
              name="age"
              placeholder="Age"
              value={formData.age}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        <div className="flex gap-3">
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

          {/* contact */}
          
            <input
              type="email"
              name="contact.email"
              placeholder="Email"
              value={formData.contact.email}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="contact.phone"
              placeholder="Phone"
              value={formData.contact.phone}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          {/* address */}
          <div className="flex gap-3">
            <input
              type="text"
              name="address.street"
              placeholder="Street"
              value={formData.address.street}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="address.city"
              placeholder="City"
              value={formData.address.city}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          
            <input
              type="text"
              name="address.state"
              placeholder="State"
              value={formData.address.state}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              name="address.pin"
              placeholder="Pin Code"
              value={formData.address.pin}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          {/* other info */}
          <input
            type="text"
            name="medicalHistory"
            placeholder="Medical History"
            value={formData.medicalHistory}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />

          <input
            type="text"
            name="currentMedications"
            placeholder="Current Medications"
            value={formData.currentMedications}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />

          <input
            type="text"
            name="allergies"
            placeholder="Allergies"
            value={formData.allergies}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />

          {/* emergencyContact */}
          <div className="flex gap-3">
            
            <input
              type="text"
              name="emergencyContact.name"
              placeholder="emergencyContact Name"
              value={formData.emergencyContact.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />



            <input
              type="email"
              name="emergencyContact.email"
              placeholder="emergencyContact Email"
              value={formData.emergencyContact.email}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />


            <input
              type="text"
              name="emergencyContact.phone"
              placeholder="emergencyContact Phone"
              value={formData.emergencyContact.phone}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded"
          >
            {editData ? "Update Patient" : "Add Patient"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PatientForm;
