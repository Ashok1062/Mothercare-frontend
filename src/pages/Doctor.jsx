import React, { useState, useEffect } from "react";
import DoctorForm from "../layouts/DoctorForm";
import axios from "axios";
import { baseURL } from "../api";
import { jwtDecode } from "jwt-decode";

function Doctor() {
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [userId, setUserId] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [loadingDoctor, setLoadingDoctor] = useState(true);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [allDoctors, setAllDoctors] = useState([]);

  // Decode JWT
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.userId);
      } catch (err) {
        console.error("Invalid token", err);
      }
    }
  }, []);

  // Fetch logged-in doctor
  const fetchDoctorData = async (uid = userId) => {
    if (!uid) return;
    setLoadingDoctor(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${baseURL}/api/doctors/byUser/${uid}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditData(res.data);
      setDoctorId(res.data._id);
      setShowForm(false);
    } catch (err) {
      if (err.response?.status === 404) {
        setEditData(null);
        setShowForm(true);
        console.log("No doctor data yet, showing form...");
      } else {
        console.error("Fetch doctor error:", err);
      }
    } finally {
      setLoadingDoctor(false);
    }
  };

  // Fetch all doctors
  const fetchAllDoctors = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${baseURL}/api/doctors`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllDoctors(res.data || []);
    } catch (err) {
      console.error("Error fetching all doctors:", err);
    }
  };

  // Fetch appointments
  const fetchAppointments = async () => {
    if (!doctorId) return;
    setLoadingAppointments(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${baseURL}/api/appointments/doctor/${doctorId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(res.data || []);
    } catch (err) {
      console.error("Fetch appointments error:", err);
    } finally {
      setLoadingAppointments(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchDoctorData();
      fetchAllDoctors();
    }
  }, [userId]);

  useEffect(() => {
    if (doctorId) fetchAppointments();
  }, [doctorId]);

  // Callback after saving doctor form
  const handleSaveSuccess = () => {
    setShowForm(false);
    fetchDoctorData();
    fetchAllDoctors();
  };

  // Confirm appointment
  const handleAppointmentUpdate = async () => {
    if (!selectedAppointment) return;
    const { _id, appointmentDate, appointmentTime } = selectedAppointment;
    if (!appointmentDate || !appointmentTime) {
      alert("Please select date and time");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${baseURL}/api/appointments/${_id}`,
        { appointmentDate, appointmentTime, status: "Confirmed" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Appointment confirmed successfully!");
      setSelectedAppointment(null);
      fetchAppointments();
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update appointment");
    }
  };

  // View patient details
  const handleViewPatient = async (patientId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${baseURL}/api/patients/${patientId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedPatient(res.data);
    } catch (err) {
      console.error("Error fetching patient details:", err);
      alert("Failed to fetch patient details");
    }
  };

  if (loadingDoctor)
    return <div className="text-center mt-20 text-gray-500 text-lg">Loading doctor...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 mt-20 p-6">

      {/* Logged-in Doctor Info */}
      <div className="flex justify-center mt-10">
        <div className="bg-pink-200 shadow-lg rounded-2xl p-6 w-full max-w-md border border-gray-200">
          <h1 className="text-3xl font-semibold text-gray-700 text-center mb-6 border rounded-lg p-3 bg-pink-500 shadow-xl">
            Doctor Dashboard
          </h1>
          {editData ? (
            <div className="space-y-2 text-gray-700 flex flex-col items-center">
              <p><span className="font-medium">Doctor Name:</span> {editData.name}</p>
              <p><span className="font-medium">Department:</span> {editData.department}</p>
              <p><span className="font-medium">Experience:</span> {editData.experience} years</p>
              <p><span className="font-medium">Phone:</span> {editData.contact?.phone || "N/A"}</p>
              <p><span className="font-medium">Email:</span> {editData.contact?.email || "N/A"}</p>
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
            <div>

            <p className="text-center text-gray-500 italic">No doctor details found.</p>
            <div className="text-end mt-4">
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-pink-500 hover:bg-pink-600 text-white px-5 py-2 rounded-md transition-all duration-300"
                >
                  {editData ? "Update Details" : "Add Details"}
                </button>
              </div>
                  </div>
          )}
        </div>
      </div>

      {/* All Doctors Cards */}
      <div className=" px-4">

      <h1 className="mt-7 p-6 text-xl font-bold shadow-xl text-gray-600">All Doctors Details</h1>
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        
        {allDoctors.map((doc) => (
          <div key={doc._id} className="bg-pink-200 shadow-lg rounded-2xl p-6 w-full max-w-md border border-gray-200 cursor-pointer hover:shadow-2xl transition-shadow"
            
          >
            <h3 className="text-2xl font-semibold text-gray-700 text-center mb-6 border rounded-lg p-3 bg-pink-500 shadow-xl">{doc.name}</h3>
            <p><span className="font-medium">Department:</span> {doc.department}</p>
            <p><span className="font-medium">Experience:</span> {doc.experience} years</p>
            <p><span className="font-medium">Phone:</span> {doc.contact?.phone || "N/A"}</p>
            <p><span className="font-medium">Email:</span> {doc.contact?.email || "N/A"}</p>
          </div>
        ))}
      </div>
        </div>
        

      {/* Appointments */}
      <div className="bg-pink-200 rounded-lg shadow p-4 mt-10">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">My Appointments</h2>
        {loadingAppointments ? (
          <p className="text-center text-gray-500 py-4">Loading appointments...</p>
        ) : appointments.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No appointments assigned yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border text-sm">
              <thead className="bg-blue-200">
                <tr>
                  <th className="p-2 border">Patient</th>
                  <th className="p-2 border">Notes</th>
                  <th className="p-2 border">Date</th>
                  <th className="p-2 border">Time</th>
                  <th className="p-2 border">Status</th>
                  <th className="p-2 border">Action</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((a) => (
                  <tr key={a._id} className="text-center hover:bg-gray-50">
                    <td className="border p-2">{a.patient?.name}</td>
                    <td className="border p-2">{a.notes}</td>
                    <td className="border p-2">{a.appointmentDate || "-"}</td>
                    <td className="border p-2">{a.appointmentTime || "-"}</td>
                    <td className="border p-2">{a.status}</td>
                    <td className="p-2 flex gap-2 justify-center">
                      <button
                        onClick={() => handleViewPatient(a.patient?._id)}
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                      >
                        View
                      </button>
                      <button
                        onClick={() => setSelectedAppointment(a)}
                        className="bg-green-600 text-white px-3 py-1 rounded"
                      >
                        Confirm
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Patient Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 opacity-100 flex justify-center items-center z-50 p-4">
          <div className="bg-white w-full max-w-lg p-6 rounded-2xl shadow-2xl sm:p-8">
            <h3 className="text-2xl font-semibold mb-6 text-center text-blue-700 border-b pb-2">
              Patient Details
            </h3>
            <div className="space-y-3 text-gray-700 text-sm sm:text-base">
              <p><span className="font-semibold text-gray-800">Name:</span> {selectedPatient?.name || "N/A"}</p>
              <p><span className="font-semibold text-gray-800">Age:</span> {selectedPatient?.age || "N/A"}</p>
              <p><span className="font-semibold text-gray-800">Contact:</span> {selectedPatient?.contact?.phone || "N/A"}</p>
              <p><span className="font-semibold text-gray-800">Medical History:</span> {selectedPatient?.medicalHistory || "N/A"}</p>
              <p><span className="font-semibold text-gray-800">Current Medications:</span> {selectedPatient?.currentMedications || "N/A"}</p>
              <p><span className="font-semibold text-gray-800">Allergies:</span> {selectedPatient?.allergies || "N/A"}</p>
              <p><span className="font-semibold text-gray-800">Notes:</span> {selectedPatient?.notes || "N/A"}</p>
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setSelectedPatient(null)}
                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-5 py-2 rounded-lg shadow-md hover:scale-105 transition-transform"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Appointment Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Confirm Appointment</h3>
            <label className="block mb-2 text-sm text-gray-600">Date</label>
            <input
              type="date"
              value={selectedAppointment.appointmentDate || ""}
              onChange={(e) =>
                setSelectedAppointment({ ...selectedAppointment, appointmentDate: e.target.value })
              }
              className="border w-full px-2 py-1 mb-3 rounded"
            />
            <label className="block mb-2 text-sm text-gray-600">Time</label>
            <input
              type="time"
              value={selectedAppointment.appointmentTime || ""}
              onChange={(e) =>
                setSelectedAppointment({ ...selectedAppointment, appointmentTime: e.target.value })
              }
              className="border w-full px-2 py-1 mb-3 rounded"
            />
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setSelectedAppointment(null)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAppointmentUpdate}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Doctor Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-md max-h-[90vh] p-6 rounded-xl shadow-2xl relative flex flex-col">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-xl z-10"
            >
              ✖
            </button>
            <div className="overflow-y-auto pt-8">
              <DoctorForm
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

export default Doctor;
