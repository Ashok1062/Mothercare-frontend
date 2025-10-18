import React from 'react'
import Button from "../layouts/InfoButton";
import ServicesCard from '../components/ServicesCard';
import { RiMicroscopeLine, RiHeartPulseLine, RiStethoscopeLine } from "react-icons/ri";

function Services() {
  const icon1 = <RiMicroscopeLine size={40} className="text-blue-500" />;
  const icon2 = <RiHeartPulseLine size={40} className="text-blue-500" />;
  const icon3 = <RiStethoscopeLine size={40} className="text-blue-500" />;

  return (
    <div className="min-h-screen flex flex-col justify-center items-center lg:px-32 px-6 pt-24 pb-16 bg-gray-50">
      
      {/* Section Header */}
      <div className="text-center space-y-4 mb-10 animate-fade-in-up">
        <h1 className="text-4xl font-bold text-pink-600">Our Services</h1>
        <p className="text-gray-700 max-w-2xl mx-auto">
          We offer a range of maternal health services including prenatal care, postnatal care, and wellness programs.
        </p>
        <Button
          title="See Services"
          className="bg-pink-500 text-white px-6 py-2 rounded-md hover:bg-pink-600 transition duration-300"
        />
      </div>

      {/* Services Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
        <ServicesCard
          icon={icon1}
          title="Lab Services"
          description="Comprehensive diagnostic lab tests with fast and accurate results."
        />
        <ServicesCard
          icon={icon2}
          title="Cardiology"
          description="Expert cardiac care for mothers with specialized heart monitoring."
        />
        <ServicesCard
          icon={icon3}
          title="General Checkup"
          description="Routine checkups and consultations for maternal and family health."
        />
      </div>
    </div>
  )
}

export default Services
