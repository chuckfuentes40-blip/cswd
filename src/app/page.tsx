"use client";

import { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";

export default function CSWDApp() {
  const [activeTab, setActiveTab] = useState("HOME");
  const [selectedForm, setSelectedForm] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Raw GitHub asset URLs for image tags & background rendering
  const bgSeal = "https://raw.githubusercontent.com/chuckfuentes40-blip/BinanCity-CSWD/main/Binan_City_Seal.png";
  const cswdLogo = "https://raw.githubusercontent.com/chuckfuentes40-blip/BinanCity-CSWD/main/cswd.png";

  const handleFormSelect = (formName: string) => {
    setSelectedForm(formName);
    setActiveTab("FORMS");
    setDropdownOpen(false);
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed flex flex-col font-sans"
      style={{ backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.92)), url('${bgSeal}')` }}
    >
      {/* Top Navbar */}
      <nav className="bg-blue-900 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-20">
          
          {/* Logo & Branding */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab("HOME")}>
            <img src={cswdLogo} alt="CSWD Logo" className="h-12 w-auto rounded-full bg-white p-1" />
            <div>
              <h1 className="font-bold text-lg leading-tight">CSWD Biñan City</h1>
              <p className="text-xs text-blue-200">City Social Welfare and Development Office</p>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-6">
            <button 
              onClick={() => { setActiveTab("HOME"); setSelectedForm(null); }}
              className={`hover:text-blue-300 font-medium transition ${activeTab === "HOME" ? "border-b-2 border-yellow-400 font-bold" : ""}`}
            >
              HOME
            </button>

            {/* FORMS Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`flex items-center space-x-1 hover:text-blue-300 font-medium transition ${activeTab === "FORMS" ? "border-b-2 border-yellow-400 font-bold" : ""}`}
              >
                <span>FORMS</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {dropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white text-gray-800 shadow-xl rounded-md overflow-hidden z-50 border">
                  {["Solo Parents", "PWD", "Senior Citizen"].map((type) => (
                    <button
                      key={type}
                      onClick={() => handleFormSelect(type)}
                      className="block w-full text-left px-4 py-3 text-sm hover:bg-blue-50 hover:text-blue-900 transition border-b last:border-b-0"
                    >
                      {type} Form
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button 
              onClick={() => { setActiveTab("ABOUT US"); setSelectedForm(null); }}
              className={`hover:text-blue-300 font-medium transition ${activeTab === "ABOUT US" ? "border-b-2 border-yellow-400 font-bold" : ""}`}
            >
              ABOUT US
            </button>

            <button 
              onClick={() => { setActiveTab("CONTACT"); setSelectedForm(null); }}
              className={`hover:text-blue-300 font-medium transition ${activeTab === "CONTACT" ? "border-b-2 border-yellow-400 font-bold" : ""}`}
            >
              CONTACT
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow max-w-5xl mx-auto w-full p-6 my-8 bg-white/80 backdrop-blur-sm rounded-xl shadow-md border border-gray-100">
        {activeTab === "HOME" && (
          <div className="space-y-4 text-center py-10">
            <h2 className="text-3xl font-extrabold text-blue-950">Welcome to Biñan CSWD Portal</h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Access social services, download and submit official forms for Solo Parents, Persons with Disability (PWD), and Senior Citizens.
            </p>
          </div>
        )}

        {activeTab === "FORMS" && selectedForm && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-blue-900">{selectedForm} Application Form</h2>
            <form className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" placeholder="Juan Dela Cruz" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" placeholder="09123456789" />
              </div>
              <button type="button" className="bg-blue-800 text-white px-4 py-2 rounded-md hover:bg-blue-900 transition">
                Submit Application
              </button>
            </form>
          </div>
        )}

        {activeTab === "ABOUT US" && (
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-blue-900">About CSWD Biñan</h2>
            <p className="text-gray-700">Providing social protection and promoting the rights and welfare of vulnerable sectors in the City of Biñan.</p>
          </div>
        )}

        {activeTab === "CONTACT" && (
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-blue-900">Contact Us</h2>
            <p className="text-gray-700">Location: City Hall Complex, Biñan City, Laguna</p>
          </div>
        )}
      </main>
    </div>
  );
}