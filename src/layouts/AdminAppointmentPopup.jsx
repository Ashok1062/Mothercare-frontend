import React from "react";

function AdminAppointmentPopup({ appointmentData, onClose }) {
  if (!appointmentData) return null;

  return (
    <div>
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white w-[90%] md:w-[600px] rounded-lg shadow-lg p-6 relative overflow-y-auto max-h-[80vh]">
        <h2 className="text-2xl font-bold text-center mb-4 text-blue-600">
          Appointment Details
        </h2>

        <table className="w-full text-left text-gray-700 border">
          <tbody>
            <tr>
              <td className="border p-2 font-semibold">Appointment ID</td>
              <td className="border p-2">{appointmentData._id}</td>
            </tr>
            <tr>
              <td className="border p-2 font-semibold">Doctor</td>
              <td className="border p-2">
                {appointmentData.doctor?.name || appointmentData.doctor}
              </td>
            </tr>
            <tr>
              <td className="border p-2 font-semibold">Patient</td>
              <td className="border p-2">
                {appointmentData.patient?.name || appointmentData.patient}
              </td>
            </tr>
            <tr>
              <td className="border p-2 font-semibold">Date</td>
              <td className="border p-2">
                {appointmentData.appointmentDate
                  ? new Date(appointmentData.appointmentDate).toLocaleString()
                  : "N/A"}
              </td>
            </tr>
            <tr>
              <td className="border p-2 font-semibold">Department</td>
              <td className="border p-2">{appointmentData.department}</td>
            </tr>
             <tr>
              <td className="border p-2 font-semibold">Notes</td>
              <td className="border p-2">{appointmentData.notes}</td>
            </tr>
            <tr>
              <td className="border p-2 font-semibold">Status</td>
              <td
                className={`border p-2 font-semibold ${
                  appointmentData.status === "approved"
                    ? "text-green-600"
                    : appointmentData.status === "pending"
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              >
                {appointmentData.status}
              </td>
            </tr>
            
          </tbody>
        </table>

        <button
          onClick={onClose}
          className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          ✕
        </button>
      </div>
    </div>
    </div>
  );
}

export default AdminAppointmentPopup;
