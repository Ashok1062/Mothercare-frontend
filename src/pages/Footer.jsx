import React from "react";

function Footer() {
  return (
    <footer className="bg-pink-500 text-white ">
     

      <div className="border-t border-blue-700 text-center py-4 text-gray-300 text-sm">
        &copy; {new Date().getFullYear()} Hospital Management. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
