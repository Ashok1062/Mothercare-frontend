import React from "react";

function InfoButton({ infoData, onClose }) {
  if (!infoData) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      {/* Modal Box */}
      <div className="bg-white w-11/12 max-w-3xl max-h-[80vh] rounded-lg shadow-xl overflow-y-auto relative p-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
        >
          X
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center mb-5 text-blue-600">
          {infoData.role === "doctor" ? "Doctor Details" : "Patient Details"}
        </h2>

        {/* Info Table */}
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 text-sm text-gray-700">
            <tbody>
              {Object.entries(infoData).map(([key, value]) => (
                <tr key={key} className="hover:bg-gray-50">
                  <td className="border p-2 font-semibold capitalize bg-gray-100 w-1/3">
                    {key}
                  </td>
                  <td className="border p-2">
                    {typeof value === "object"
                      ? JSON.stringify(value, null, 2)
                      : value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default InfoButton;
