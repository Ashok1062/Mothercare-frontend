import React from 'react'

function About() {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row justify-between items-center lg:px-32 px-5 pt-24 lg:pt-16 gap-10 bg-pink-50">
  {/* Left Text Section */}
  <div className="w-full lg:w-3/4 space-y-5 animate-slide-in">
    <h1 className="text-4xl lg:text-5xl font-bold text-center lg:text-left text-pink-600">
      About
    </h1>
    <p className="text-gray-700 text-justify leading-relaxed">
      <span className="font-semibold text-pink-500">Mothers Care Hospital</span> is a trusted
      center of excellence dedicated to providing compassionate and comprehensive healthcare
      services for women, children, and families. With a focus on maternal and child health,
      our hospital combines modern medical technology with personalized care to ensure the
      safety, comfort, and well-being of every patient.
    </p>

    <p className="text-gray-700 text-justify leading-relaxed">
      Our team of highly qualified doctors, nurses, and specialists work together to deliver
      world-class medical treatment across a wide range of departments, including gynecology,
      pediatrics, general medicine, and emergency care. We are committed to maintaining the
      highest standards of safety, hygiene, and ethical practices while ensuring that every
      patient feels supported and respected throughout their healthcare journey.
    </p>

    <p className="text-gray-700 text-justify leading-relaxed">
      At Mothers Care Hospital, we believe in a holistic approach to healthcare that addresses
      not only the physical but also the emotional and psychological needs of our patients. We
      strive to create a warm and welcoming environment where families can feel at ease during
      their medical experiences.
    </p>
  </div>

  {/* Right Image Section */}
  <div className="w-full lg:w-3/4 flex justify-center animate-fade-in-up">
    <img
      src="https://thumbs.dreamstime.com/b/asian-medical-team-pink-breast-cancer-awareness-ribbon-medical-team-pink-breast-cancer-awareness-ribbon-124075594.jpg"
      alt="About Us"
      className="w-full h-auto rounded-2xl shadow-lg hover:scale-105 transition-transform duration-500"
    />
  </div>
</div>

  )
}

export default About
