import React, { useState, useEffect } from "react";
import axios from "axios";
import { baseURL } from "../api";
import InfoButton from "../layouts/InfoButton";
import AdminAppointmentPopup from "../layouts/AdminAppointmentPopup";

function Admin() {
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInfo, setSelectedInfo] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Move Modal states
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [departmentDoctors, setDepartmentDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState("");

  // Search states
  const [doctorSearch, setDoctorSearch] = useState("");
  const [patientSearch, setPatientSearch] = useState("");
  const [appointmentSearch, setAppointmentSearch] = useState("");

  // Fetch Doctors & Patients
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const [doctorRes, patientRes] = await Promise.all([
          axios.get(`${baseURL}/api/doctors`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${baseURL}/api/patients`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setDoctors(doctorRes.data || []);
        setPatients(patientRes.data || []);
      
      } catch (err) {
        console.error("Error fetching admin data:", err);
        alert("Error loading data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Fetch Appointments
  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${baseURL}/api/appointments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(res.data || []);
    } catch (err) {
      console.error("Error fetching appointments:", err);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Delete Doctor
  const handleDeleteDoctor = async (id) => {
    if (!window.confirm("Are you sure you want to delete this doctor?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${baseURL}/api/doctors/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDoctors((prev) => prev.filter((doc) => doc._id !== id));
      alert("Doctor deleted successfully");
    } catch (err) {
      console.error("Delete doctor error:", err);
      alert("Failed to delete doctor");
    }
  };

  // Delete Patient
  const handleDeletePatient = async (id) => {
    if (!window.confirm("Are you sure you want to delete this patient?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${baseURL}/api/patients/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPatients((prev) => prev.filter((pat) => pat._id !== id));
      alert("Patient deleted successfully");
    } catch (err) {
      console.error("Delete patient error:", err);
      alert("Failed to delete patient");
    }
  };

  // Move Appointment
  const handleMoveAppointment = async (appointment) => {
    if (!appointment?._id) return alert("Invalid appointment");

    setSelectedAppointment(appointment);
    setShowMoveModal(true);

    try {
      const token = localStorage.getItem("token");
      const department = appointment.department || "General";
      const res = await axios.get(
        `${baseURL}/api/doctors/department/${department}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const doctorsInDept = res.data || [];
      if (doctorsInDept.length === 0) {
        alert(`No doctors found in department: ${department}`);
        setDepartmentDoctors([]);
        return;
      }

      setDepartmentDoctors(doctorsInDept);
    } catch (err) {
      console.error("Error fetching doctors:", err.response?.data || err.message);
      alert("Failed to fetch doctors for this department");
    }
  };

  // Confirm Move Appointment
  const confirmMoveAppointment = async () => {
    if (!selectedAppointment?._id) return alert("Appointment not selected");
    if (!selectedDoctorId) return alert("Please select a doctor");

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${baseURL}/api/appointments/move/${selectedAppointment._id}`,
        { targetDoctorId: selectedDoctorId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Appointment moved successfully!");
      setShowMoveModal(false);
      setSelectedDoctorId("");
      setSelectedAppointment(null);
      fetchAppointments();
    } catch (err) {
      console.error("Move appointment error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to move appointment");
    }
  };

  // Reject Appointment
  const handleRejectAppointment = async (appointment) => {
    if (!appointment?._id) return alert("Invalid appointment");
    if (!window.confirm("Are you sure you want to reject this appointment?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${baseURL}/api/appointments/${appointment._id}`,
        { status: "Rejected" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAppointments((prev) =>
        prev.map((a) =>
          a._id === appointment._id ? { ...a, status: "Rejected" } : a
        )
      );

      alert("Appointment marked as Rejected");
    } catch (err) {
      console.error("Reject appointment error:", err);
      alert("Failed to reject appointment");
    }
  };

  // Search Filters
  const filteredDoctors = doctors.filter(
    (doc) =>
      doc.name?.toLowerCase().includes(doctorSearch.toLowerCase()) ||
      doc.department?.toLowerCase().includes(doctorSearch.toLowerCase())
  );
  const filteredPatients = patients.filter(
    (pat) =>
      pat.patientName?.toLowerCase().includes(patientSearch.toLowerCase()) ||
      pat.gender?.toLowerCase().includes(patientSearch.toLowerCase())
  );
  const filteredAppointments = appointments.filter(
    (a) =>
      
      a.department?.toLowerCase().includes(appointmentSearch.toLowerCase()) ||
      a.status?.toLowerCase().includes(appointmentSearch.toLowerCase()) ||
      a.notes?.toLowerCase().includes(appointmentSearch.toLowerCase())
  );
 console.log(appointments);
  if (loading) return <div className="text-center mt-20 text-lg text-gray-600">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6 md:mb-8">
        Admin Dashboard
      </h1>

      {/* Doctors & Patients */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {/* Doctors */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
            <h2 className="text-xl font-semibold text-gray-700">Doctors</h2>
            <input
              type="text"
              placeholder="Search doctor..."
              value={doctorSearch}
              onChange={(e) => setDoctorSearch(e.target.value)}
              className="border px-3 py-1 rounded text-sm w-full sm:w-auto"
            />
          </div>
          <div className="overflow-x-auto">
            {filteredDoctors.length > 0 ? (
              <table className="w-full border text-sm min-w-[500px]">
                <thead className="bg-blue-200">
                  <tr>
                    <th className="p-2 border">Name</th>
                    <th className="p-2 border">Department</th>
                    <th className="p-2 border">Experience</th>
                    <th className="p-2 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDoctors.map((doc) => (
                    <tr key={doc._id} className="text-center hover:bg-gray-50">
                      <td className="border p-2">{doc.name || "N/A"}</td>
                      <td className="border p-2">{doc.department || "—"}</td>
                      <td className="border p-2">{doc.experience || 0} yrs</td>
                      <td className="p-2 flex justify-center gap-2">
                        <button
                          onClick={() => handleDeleteDoctor(doc._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => setSelectedInfo({ ...doc, role: "doctor" })}
                          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No doctors found.</p>
            )}
          </div>
        </div>

        {/* Patients */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
            <h2 className="text-xl font-semibold text-gray-700">Patients</h2>
            <input
              type="text"
              placeholder="Search patient..."
              value={patientSearch}
              onChange={(e) => setPatientSearch(e.target.value)}
              className="border px-3 py-1 rounded text-sm w-full sm:w-auto"
            />
          </div>
          <div className="overflow-x-auto">
            {filteredPatients.length > 0 ? (
              <table className="w-full border text-sm min-w-[500px]">
                <thead className="bg-green-200">
                  <tr>
                    <th className="p-2 border">Name</th>
                    <th className="p-2 border">Age</th>
                    <th className="p-2 border">Gender</th>
                    <th className="p-2 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPatients.map((pat) => (
                    <tr key={pat._id} className="text-center hover:bg-gray-50">
                      <td className="border p-2">{pat.patientName || "N/A"}</td>
                      <td className="border p-2">{pat.age || "—"}</td>
                      <td className="border p-2">{pat.gender || "—"}</td>
                      <td className="p-2 flex justify-center gap-2">
                        <button
                          onClick={() => handleDeletePatient(pat._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => setSelectedInfo({ ...pat, role: "patient" })}
                          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No patients found.</p>
            )}
          </div>
        </div>
      </div>

      {/* Appointments */}
      <div className="bg-white mt-8 shadow-md rounded-lg p-4">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
          <h2 className="text-xl font-semibold text-gray-700">Appointments</h2>
          <input
            type="text"
            placeholder="Search appointment..."
            value={appointmentSearch}
            onChange={(e) => setAppointmentSearch(e.target.value)}
            className="border px-3 py-1 rounded text-sm w-full sm:w-auto"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border text-sm min-w-[700px]">
            <thead className="bg-pink-200">
              <tr>
                <th className="p-2 border">Patient</th>
                <th className="p-2 border">Department</th>
                <th className="p-2 border">Doctor</th>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Notes</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((a) => (
                  <tr key={a._id} className="text-center hover:bg-gray-50">
                    <td className="border p-2">{a.patient?._id || "N/A"}</td>
                    <td className="border p-2">{a.department || "—"}</td>
                    <td className="border p-2">{a.doctor?.name || "Unassigned"}</td>
                    <td className="border p-2">{a.appointmentDate || "—"}</td>
                    <td className="border p-2">{a.notes || "—"}</td>
                    <td className="border p-2">{a.status || "Pending"}</td>
                    <td className="p-2 flex justify-center gap-2 flex-wrap">
                      <button
                        onClick={() => setSelectedAppointment(a)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleMoveAppointment(a)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      >
                        Move
                      </button>
                      <button
                        onClick={() => handleRejectAppointment(a)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center p-4 text-gray-500 italic">
                    No appointments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info & Appointment Modals */}
      <InfoButton infoData={selectedInfo} onClose={() => setSelectedInfo(null)} />
      {selectedAppointment && !showMoveModal && (
        <AdminAppointmentPopup
          appointmentData={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
        />
      )}

      {/* Move Modal */}
      {showMoveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 px-2">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg">
            <h2 className="text-2xl font-bold text-center mb-4 text-blue-700">
              Move Appointment — {selectedAppointment?.department || "Department"}
            </h2>
            <p className="text-gray-600 text-center mb-4">
              Select a doctor to assign this appointment
            </p>
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {departmentDoctors.map((doc) => (
                <label
                  key={doc._id}
                  className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer ${
                    selectedDoctorId === doc._id
                      ? "bg-blue-100 border-blue-500"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div>
                    <p className="font-semibold text-gray-800">{doc.name}</p>
                    <p className="text-sm text-gray-500">
                      {doc.department || "—"} — {doc.experience || 0} yrs exp
                    </p>
                  </div>
                  <input
                    type="radio"
                    name="doctor"
                    value={doc._id}
                    checked={selectedDoctorId === doc._id}
                    onChange={() => setSelectedDoctorId(doc._id)}
                  />
                </label>
              ))}
            </div>

            <div className="flex justify-end mt-6 gap-3 flex-wrap">
              <button
                onClick={() => setShowMoveModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmMoveAppointment}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Confirm Move
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;
