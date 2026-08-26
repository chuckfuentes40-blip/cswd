"use client";

import { useState, useEffect } from "react";
import { ChevronDown, Loader2, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Submission {
  id: string;
  created_at: string;
  form_type: string;
  full_name: string;
  contact_number: string;
  status: string;
}

export default function CSWDApp() {
  const [activeTab, setActiveTab] = useState("HOME");
  const [selectedForm, setSelectedForm] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Form State
  const [fullName, setFullName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Admin Dashboard State
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  const bgSeal = "https://raw.githubusercontent.com/chuckfuentes40-blip/BinanCity-CSWD/main/Binan_City_Seal.png";
  const cswdLogo = "https://raw.githubusercontent.com/chuckfuentes40-blip/BinanCity-CSWD/main/cswd.png";

  // Fetch submissions from Supabase
  const fetchSubmissions = async () => {
    const { data, error } = await supabase
      .from("form_submissions")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setSubmissions(data);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleFormSelect = (formName: string) => {
    setSelectedForm(formName);
    setActiveTab("FORMS");
    setDropdownOpen(false);
    setSuccessMsg("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedForm || !fullName || !contactNumber) return;

    setLoading(true);
    setSuccessMsg("");

    const { error } = await supabase.from("form_submissions").insert([
      {
        form_type: selectedForm,
        full_name: fullName,
        contact_number: contactNumber,
        status: "Pending",
      },
    ]);

    setLoading(false);

    if (error) {
      alert("Submission failed: " + error.message);
    } else {
      setSuccessMsg(`Your ${selectedForm} application was submitted successfully!`);
      setFullName("");
      setContactNumber("");
      fetchSubmissions(); // Refresh dashboard list
    }
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed flex flex-col font-sans text-gray-800"
      style={{ backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.93), rgba(255, 255, 255, 0.93)), url('${bgSeal}')` }}
    >
      {/* Top Navbar */}
      <nav className="bg-blue-900 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-20">
          
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab("HOME")}>
            <img src={cswdLogo} alt="CSWD Logo" className="h-12 w-auto rounded-full bg-white p-1" />
            <div>
              <h1 className="font-bold text-lg leading-tight">CSWD Biñan City</h1>
              <p className="text-xs text-blue-200">City Social Welfare and Development Office</p>
            </div>
          </div>

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
        
        {/* HOME DASHBOARD */}
        {activeTab === "HOME" && (
          <div className="space-y-6">
            <div className="text-center py-6 border-b">
              <h2 className="text-3xl font-extrabold text-blue-950">Biñan CSWD Public Services Portal</h2>
              <p className="text-gray-600 max-w-xl mx-auto mt-2">
                Apply online for official assistance programs or manage existing requests.
              </p>
            </div>

            {/* Dashboard Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-center">
                <p className="text-sm font-semibold text-blue-800">Total Applications</p>
                <p className="text-3xl font-bold text-blue-950 mt-1">{submissions.length}</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 text-center">
                <p className="text-sm font-semibold text-yellow-800">Pending Review</p>
                <p className="text-3xl font-bold text-yellow-900 mt-1">
                  {submissions.filter((s) => s.status === "Pending").length}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-100 text-center">
                <p className="text-sm font-semibold text-green-800">Active Form Types</p>
                <p className="text-3xl font-bold text-green-950 mt-1">3</p>
              </div>
            </div>

            {/* Live Submissions Tracker Table */}
            <div className="mt-8">
              <h3 className="text-xl font-bold text-blue-900 mb-4">Recent Submissions Dashboard</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-blue-900 text-white">
                      <th className="p-3">Applicant Name</th>
                      <th className="p-3">Form Type</th>
                      <th className="p-3">Contact</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-4 text-center text-gray-500">No applications received yet.</td>
                      </tr>
                    ) : (
                      submissions.map((item) => (
                        <tr key={item.id} className="border-b hover:bg-gray-50">
                          <td className="p-3 font-medium">{item.full_name}</td>
                          <td className="p-3">{item.form_type}</td>
                          <td className="p-3">{item.contact_number}</td>
                          <td className="p-3">
                            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-semibold">
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* DYNAMIC FORMS PAGE */}
        {activeTab === "FORMS" && selectedForm && (
          <div className="space-y-4 max-w-lg mx-auto py-4">
            <h2 className="text-2xl font-bold text-blue-900">{selectedForm} Application Form</h2>
            
            {successMsg && (
              <div className="p-4 bg-green-50 text-green-800 rounded-md flex items-center space-x-2 border border-green-200">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2.5 border focus:ring-2 focus:ring-blue-500" 
                  placeholder="Juan Dela Cruz" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                <input 
                  type="text" 
                  required
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2.5 border focus:ring-2 focus:ring-blue-500" 
                  placeholder="09123456789" 
                />
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-blue-800 text-white px-4 py-3 rounded-md hover:bg-blue-900 transition flex justify-center items-center font-semibold"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit Application"}
              </button>
            </form>
          </div>
        )}

        {/* ABOUT US PAGE */}
        {activeTab === "ABOUT US" && (
          <div className="space-y-3 py-4">
            <h2 className="text-2xl font-bold text-blue-900">About CSWD Biñan</h2>
            <p className="text-gray-700 leading-relaxed">
              The City Social Welfare and Development Office (CSWD) of Biñan City is dedicated to providing comprehensive social welfare services that empower marginalized and vulnerable sectors, including Senior Citizens, Persons with Disabilities (PWDs), and Solo Parents.
            </p>
          </div>
        )}

        {/* CONTACT PAGE */}
        {activeTab === "CONTACT" && (
          <div className="space-y-3 py-4">
            <h2 className="text-2xl font-bold text-blue-900">Contact Us</h2>
            <div className="text-gray-700 space-y-1">
              <p><strong>Office:</strong> City Social Welfare and Development Office</p>
              <p><strong>Location:</strong> Ground Floor, Biñan City Hall, Zapote, City of Biñan, Laguna</p>
              <p><strong>Hours:</strong> Monday – Friday: 8:00 AM – 5:00 PM</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}