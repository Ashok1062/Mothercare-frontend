import React, { useState, useEffect } from "react";
import PatientForm from "../layouts/PatientForm";
import axios from "axios";
import { baseURL } from "../api";
import { jwtDecode } from "jwt-decode";

function Patient() {
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [userId, setUserId] = useState("");
  const [appointmentDepartment, setAppointmentDepartment] = useState("");
  const [appointmentNotes, setAppointmentNotes] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Decode JWT
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.userId);
      } catch (err) {
        console.error("Invalid token:", err);
        localStorage.removeItem("token");
      }
    }
  }, []);

  // Fetch patient data
  const fetchPatientData = async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(`${baseURL}/api/patients/byUser/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditData(res.data);
    } catch (err) {
    if (err.response?.status === 404) {
      // 🟢 No patient found — show form to create one
      setEditData(null);
      setShowForm(true);
      console.log("No patient data yet, showing form...");
    } else {
      console.error("Fetch patient error:", err);
    }
  } finally {
      setLoading(false);
    }
  };

  // Fetch appointments
  const fetchAppointments = async () => {
    if (!editData?._id) return;
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${baseURL}/api/appointments/patient/${editData._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(res.data);
    } catch (err) {
      console.error("Error fetching appointments:", err);
    }
  };

  useEffect(() => {
    fetchPatientData();
  }, [userId]);

  useEffect(() => {
    if (editData) fetchAppointments();
  }, [editData]);

  const handleSaveSuccess = () => {
    setShowForm(false);
    fetchPatientData();
  };

  // Submit appointment
  const handleAppointmentSubmit = async (e) => {
    e.preventDefault();
    if (!appointmentDepartment) return alert("Please select a department");
    if (!appointmentNotes) return alert("Please enter notes for the appointment");

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${baseURL}/api/appointments`,
        {
          patientId: editData._id,
          patientName: editData.name,
          department: appointmentDepartment,
          notes: appointmentNotes,
          status: "Pending",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Appointment submitted successfully!");
      setAppointmentNotes("");
      setAppointmentDepartment("");
      fetchAppointments();
    } catch (err) {
      console.error("Error submitting appointment:", err);
      alert("Failed to submit appointment");
    }
  };

  if (loading) return <p className="text-center mt-20">Loading...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 mt-20 p-6 animate-fadeIn">
      <div className="flex flex-col md:flex-row items-start justify-center gap-10 transition-all duration-500 ease-in-out">
        
        {/* 🧍 Patient Details Card */}
        <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md border border-gray-200 transform transition-all hover:scale-[1.01]">
          <h1 className="text-3xl font-semibold text-pink-600 text-center mb-6 border-b pb-3">
            Patient Dashboard
          </h1>

          {editData ? (
            <div className="space-y-3 text-gray-700">
              <p><span className="font-medium">Name:</span> {editData.name}</p>
              <p><span className="font-medium">Age:</span> {editData.age}</p>
              <p><span className="font-medium">Gender:</span> {editData.gender}</p>
              <p><span className="font-medium">Contact:</span> {editData.contact?.phone || "N/A"}</p>

              <div className="text-end mt-4">
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-pink-500 hover:bg-pink-600 text-white px-5 py-2 rounded-md transition-all duration-300"
                >
                  {editData ? "Update Details" : "Add Details"}
                </button>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-500">No patient details found.</p>
          )}
        </div>

        {/* 📅 Appointment Form */}
        <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-3xl border border-gray-200 space-y-6 transform transition-all hover:scale-[1.01]">
          <h2 className="text-2xl font-semibold text-blue-700 text-center mb-4">Book Appointment</h2>

          {editData && (
            <form onSubmit={handleAppointmentSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-1">Department</label>
                <select 
                  value={appointmentDepartment}
                  onChange={(e) => setAppointmentDepartment(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="">Select Department</option>
                  <option value="General">General</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Dental">Dental</option>
                </select>
              </div>

              <div>
                <label className="block font-medium mb-1">Notes</label>
                <input
                  value={appointmentNotes}
                  onChange={(e) => setAppointmentNotes(e.target.value)}
                  placeholder="Enter reason..."
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div className="col-span-2 text-center">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md transition-transform transform hover:scale-105"
                >
                  Submit Appointment
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* 🧾 Appointment Table */}
      <div className="p-6 bg-white shadow-xl rounded-2xl mt-7 max-w-6xl mx-auto border border-gray-200 overflow-x-auto">
        <h2 className="text-xl text-center font-semibold text-green-700 mb-4">
          --- My Appointments ---
        </h2>
        {appointments.length > 0 ? (
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="border px-3 py-2">Department</th>
                <th className="border px-3 py-2">Doctor</th>
                <th className="border px-3 py-2">Date</th>
                <th className="border px-3 py-2">Time</th>
                <th className="border px-3 py-2">Status</th>
                <th className="border px-3 py-2">Message</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a._id} className="text-center hover:bg-gray-50">
                  <td className="border px-3 py-2">{a.department}</td>
                  <td className="border px-3 py-2">{a.doctor?.name || "Not Assigned"}</td>
                  <td className="border px-3 py-2">{a.appointmentDate || "-"}</td>
                  <td className="border px-3 py-2">{a.appointmentTime || "-"}</td>
                  <td
                    className={`border px-3 py-2 font-medium ${
                      a.status === "Confirmed"
                        ? "text-green-600"
                        : a.status === "Rejected"
                        ? "text-red-500"
                        : "text-yellow-500"
                    }`}
                  >
                    {a.status}
                  </td>
                  <td className="border px-3 py-2">
                    {a.status === "Confirmed" && (
                      <span className="text-green-600 font-semibold">
                        ✅ Appointment Confirmed
                      </span>
                    )}
                    {a.status === "Rejected" && (
                      <span className="text-red-500 font-semibold">
                        ❌ Appointment Rejected
                      </span>
                    )}
                    {a.status === "Pending" && (
                      <span className="text-yellow-600 font-semibold">
                        ⏳ Awaiting Doctor Confirmation
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500 text-center">No appointments found.</p>
        )}
      </div>

      {/* 🧾 Mobile Modal for PatientForm */}
      {showForm && (
  <div className="fixed inset-0  bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-fadeIn">
    <div className="bg-white w-full max-w-md max-h-[90vh] p-6 rounded-xl shadow-2xl relative flex flex-col">
      {/* Close Button */}
      <button
        onClick={() => setShowForm(false)}
        className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-xl z-10"
      >
        ✖
      </button>

      {/* Scrollable Content */}
      <div className="overflow-y-auto pt-8">
        <PatientForm
          isVisible={showForm}
          onClose={() => setShowForm(false)}
          editData={editData}
          onSaveSuccess={handleSaveSuccess}
        />
      </div>
    </div>
  </div>
)}

    </div>
  );
}

export default Patient;
