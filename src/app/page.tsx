"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { ChevronDown, Loader2, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Application {
  id: number;
  created_at: string;
  member_name: string;
  sex: string;
  age: string;
  address: string;
  contact_number: string;
  classification: string;
  source_of_income: string;
  no_of_dependents: string;
  member_disability: string;
  member_disability_type: string;
  dependent_disability: string;
  dependent_disability_type: string;
  id_number: string;
  id_expiration_date: string;
  cash_subsidy_recipient: string;
  inb_recipient: string;
  four_ps_recipient: string;
  rice_subsidy_recipient: string;
  skill_set: string;
  remarks: string;
}

export default function CSWDApp() {
  const [activeTab, setActiveTab] = useState("HOME");
  const [selectedForm, setSelectedForm] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [applications, setApplications] = useState<Application[]>([]);

  // Form State for Solo Parents matching all Supabase columns
  const [formData, setFormData] = useState({
    member_name: "",
    sex: "Female",
    age: "",
    address: "",
    contact_number: "",
    classification: "Death of Spouse",
    source_of_income: "",
    no_of_dependents: "1",
    member_disability: "No",
    member_disability_type: "",
    dependent_disability: "No",
    dependent_disability_type: "",
    id_number: "",
    id_expiration_date: "",
    cash_subsidy_recipient: "No",
    inb_recipient: "No",
    four_ps_recipient: "No",
    rice_subsidy_recipient: "No",
    skill_set: "",
    remarks: "",
  });

  const bgSeal = "https://raw.githubusercontent.com/chuckfuentes40-blip/BinanCity-CSWD/main/Binan_City_Seal.png";
  const cswdLogo = "https://raw.githubusercontent.com/chuckfuentes40-blip/BinanCity-CSWD/main/cswd.png";

  const fetchApplications = async () => {
    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setApplications(data);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSelect = (formName: string) => {
    setSelectedForm(formName);
    setActiveTab("FORMS");
    setDropdownOpen(false);
    setSuccessMsg("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");

    const { error } = await supabase.from("applications").insert([formData]);

    setLoading(false);

    if (error) {
      alert("Submission error: " + error.message);
    } else {
      setSuccessMsg("Solo Parent application registered successfully!");
      fetchApplications();
      setFormData({
        member_name: "",
        sex: "Female",
        age: "",
        address: "",
        contact_number: "",
        classification: "Death of Spouse",
        source_of_income: "",
        no_of_dependents: "1",
        member_disability: "No",
        member_disability_type: "",
        dependent_disability: "No",
        dependent_disability_type: "",
        id_number: "",
        id_expiration_date: "",
        cash_subsidy_recipient: "No",
        inb_recipient: "No",
        four_ps_recipient: "No",
        rice_subsidy_recipient: "No",
        skill_set: "",
        remarks: "",
      });
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
            <button onClick={() => { setActiveTab("HOME"); setSelectedForm(null); }} className={`hover:text-blue-300 font-medium ${activeTab === "HOME" ? "border-b-2 border-yellow-400 font-bold" : ""}`}>
              HOME
            </button>

            <div className="relative">
              <button onClick={() => setDropdownOpen(!dropdownOpen)} className={`flex items-center space-x-1 hover:text-blue-300 font-medium ${activeTab === "FORMS" ? "border-b-2 border-yellow-400 font-bold" : ""}`}>
                <span>FORMS</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {dropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white text-gray-800 shadow-xl rounded-md overflow-hidden z-50 border">
                  {["Solo Parents", "PWD", "Senior Citizen"].map((type) => (
                    <button key={type} onClick={() => handleFormSelect(type)} className="block w-full text-left px-4 py-3 text-sm hover:bg-blue-50 hover:text-blue-900 border-b last:border-b-0">
                      {type} Form
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button onClick={() => { setActiveTab("ABOUT US"); setSelectedForm(null); }} className={`hover:text-blue-300 font-medium ${activeTab === "ABOUT US" ? "border-b-2 border-yellow-400 font-bold" : ""}`}>
              ABOUT US
            </button>
            <button onClick={() => { setActiveTab("CONTACT"); setSelectedForm(null); }} className={`hover:text-blue-300 font-medium ${activeTab === "CONTACT" ? "border-b-2 border-yellow-400 font-bold" : ""}`}>
              CONTACT
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow max-w-6xl mx-auto w-full p-6 my-8 bg-white/90 backdrop-blur-sm rounded-xl shadow-md border border-gray-100">
        
        {/* HOME DASHBOARD */}
        {activeTab === "HOME" && (
          <div className="space-y-6">
            <div className="text-center py-4 border-b">
              <h2 className="text-3xl font-extrabold text-blue-950">Biñan CSWD Public Services Portal</h2>
              <p className="text-gray-600 mt-1">Solo Parents Application Records Dashboard</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-center">
                <p className="text-sm font-semibold text-blue-800">Total Applications</p>
                <p className="text-3xl font-bold text-blue-950 mt-1">{applications.length}</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 text-center">
                <p className="text-sm font-semibold text-yellow-800">4Ps Beneficiaries</p>
                <p className="text-3xl font-bold text-yellow-900 mt-1">
                  {applications.filter(a => a.four_ps_recipient === "Yes").length}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-100 text-center">
                <p className="text-sm font-semibold text-green-800">Cash Subsidy Recipients</p>
                <p className="text-3xl font-bold text-green-950 mt-1">
                  {applications.filter(a => a.cash_subsidy_recipient === "Yes").length}
                </p>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-bold text-blue-900 mb-4">Submitted Solo Parent Applications</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse border">
                  <thead>
                    <tr className="bg-blue-900 text-white">
                      <th className="p-3 border">Member Name</th>
                      <th className="p-3 border">Sex</th>
                      <th className="p-3 border">Contact</th>
                      <th className="p-3 border">Classification</th>
                      <th className="p-3 border">Dependents</th>
                      <th className="p-3 border">ID Number</th>
                      <th className="p-3 border">4Ps Recipient</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-4 text-center text-gray-500">No applications registered in database.</td>
                      </tr>
                    ) : (
                      applications.map((app) => (
                        <tr key={app.id} className="border-b hover:bg-gray-50">
                          <td className="p-3 border font-medium">{app.member_name}</td>
                          <td className="p-3 border">{app.sex}</td>
                          <td className="p-3 border">{app.contact_number}</td>
                          <td className="p-3 border">{app.classification}</td>
                          <td className="p-3 border">{app.no_of_dependents}</td>
                          <td className="p-3 border">{app.id_number || "N/A"}</td>
                          <td className="p-3 border">{app.four_ps_recipient}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* SOLO PARENT FORM */}
        {activeTab === "FORMS" && selectedForm === "Solo Parents" && (
          <div className="space-y-6 py-2">
            <div className="border-b pb-3">
              <h2 className="text-2xl font-bold text-blue-900">Solo Parent Application Form</h2>
              <p className="text-sm text-gray-600">Please complete all accurate details below for registration.</p>
            </div>

            {successMsg && (
              <div className="p-4 bg-green-50 text-green-800 rounded-md flex items-center space-x-2 border border-green-200">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* 1. Personal Details */}
              <div>
                <h3 className="font-semibold text-lg text-blue-950 mb-3 border-b pb-1">1. Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium">Member Full Name *</label>
                    <input type="text" name="member_name" required value={formData.member_name} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md" placeholder="Dela Cruz, Juanita" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Sex *</label>
                    <select name="sex" value={formData.sex} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md">
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Age</label>
                    <input type="text" name="age" value={formData.age} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md" placeholder="32" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium">Address</label>
                    <input type="text" name="address" value={formData.address} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md" placeholder="Barangay Zapote, Biñan City, Laguna" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Contact Number *</label>
                    <input type="text" name="contact_number" required value={formData.contact_number} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md" placeholder="09123456789" />
                  </div>
                </div>
              </div>

              {/* 2. Classification & Income */}
              <div>
                <h3 className="font-semibold text-lg text-blue-950 mb-3 border-b pb-1">2. Classification & Income</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium">Classification</label>
                    <input type="text" name="classification" value={formData.classification} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md" placeholder="Death of Spouse" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Source of Income</label>
                    <input type="text" name="source_of_income" value={formData.source_of_income} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md" placeholder="Employed / Business" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">No. of Dependents</label>
                    <input type="text" name="no_of_dependents" value={formData.no_of_dependents} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md" placeholder="2" />
                  </div>
                </div>
              </div>

              {/* 3. Disability Details */}
              <div>
                <h3 className="font-semibold text-lg text-blue-950 mb-3 border-b pb-1">3. Disability Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium">Member Disability?</label>
                    <select name="member_disability" value={formData.member_disability} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md">
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Member Disability Type</label>
                    <input type="text" name="member_disability_type" value={formData.member_disability_type} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md" placeholder="Specify if yes" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Dependent Disability?</label>
                    <select name="dependent_disability" value={formData.dependent_disability} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md">
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Dependent Disability Type</label>
                    <input type="text" name="dependent_disability_type" value={formData.dependent_disability_type} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md" placeholder="Specify if yes" />
                  </div>
                </div>
              </div>

              {/* 4. ID & Subsidy Programs */}
              <div>
                <h3 className="font-semibold text-lg text-blue-950 mb-3 border-b pb-1">4. Identification & Subsidy Programs</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium">ID Number</label>
                    <input type="text" name="id_number" value={formData.id_number} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md" placeholder="SP-2026-0000" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">ID Expiration Date</label>
                    <input type="date" name="id_expiration_date" value={formData.id_expiration_date} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Cash Subsidy Recipient</label>
                    <select name="cash_subsidy_recipient" value={formData.cash_subsidy_recipient} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md">
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">INB Recipient</label>
                    <select name="inb_recipient" value={formData.inb_recipient} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md">
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">4Ps Recipient</label>
                    <select name="four_ps_recipient" value={formData.four_ps_recipient} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md">
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Rice Subsidy Recipient</label>
                    <select name="rice_subsidy_recipient" value={formData.rice_subsidy_recipient} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md">
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium">Skill Set</label>
                    <input type="text" name="skill_set" value={formData.skill_set} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md" placeholder="Dressmaking, Culinary, etc." />
                  </div>
                </div>
              </div>

              {/* Remarks */}
              <div>
                <label className="block text-sm font-medium">Remarks</label>
                <textarea name="remarks" rows={2} value={formData.remarks} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md" placeholder="Additional notes..."></textarea>
              </div>

              <button type="submit" disabled={loading} className="w-full bg-blue-800 text-white py-3 rounded-md hover:bg-blue-900 transition flex justify-center items-center font-bold">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Solo Parent Record"}
              </button>
            </form>
          </div>
        )}

        {/* PWD & Senior Citizen Placeholders */}
        {activeTab === "FORMS" && selectedForm !== "Solo Parents" && (
          <div className="py-8 text-center space-y-2">
            <h2 className="text-2xl font-bold text-blue-900">{selectedForm} Application Form</h2>
            <p className="text-gray-600">Form module under preparation.</p>
          </div>
        )}

        {/* ABOUT US */}
        {activeTab === "ABOUT US" && (
          <div className="space-y-3 py-4">
            <h2 className="text-2xl font-bold text-blue-900">About CSWD Biñan</h2>
            <p className="text-gray-700">Providing social protection and promoting the rights and welfare of vulnerable sectors in the City of Biñan.</p>
          </div>
        )}

        {/* CONTACT */}
        {activeTab === "CONTACT" && (
          <div className="space-y-3 py-4">
            <h2 className="text-2xl font-bold text-blue-900">Contact Us</h2>
            <p className="text-gray-700">Ground Floor, Biñan City Hall, Zapote, City of Biñan, Laguna</p>
          </div>
        )}
      </main>
    </div>
  );
}