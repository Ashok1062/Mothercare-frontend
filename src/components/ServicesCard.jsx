import React from 'react';

function ServicesCard({ icon, title, description }) {
  return (
    <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-2xl transition duration-300 transform hover:-translate-y-2 text-center w-full">
      <div className="flex justify-center mb-3">
        <div className="p-3 bg-blue-100 rounded-full">
          {icon}
        </div>
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

export default ServicesCard;
