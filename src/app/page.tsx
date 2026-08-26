"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { 
  ChevronDown, 
  Loader2, 
  CheckCircle2, 
  Menu, 
  X, 
  Printer, 
  Trash2, 
  Megaphone, 
  UserCheck, 
  LogOut, 
  Home as HomeIcon, 
  Database, 
  Lock, 
  Check, 
  XCircle,
  Plus
} from "lucide-react";
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
  status?: string;
}

interface Announcement {
  id: number;
  title: string;
  content: string;
  image_url: string;
  created_at: string;
}

export default function CSWDApp() {
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("HOME");
  const [selectedForm, setSelectedForm] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  
  // Auth & Admin State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminType, setAdminType] = useState<string | null>(null);
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");
  
  // Admin Navigation & Layout State
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminActiveTab, setAdminActiveTab] = useState("HOME");
  const [printRowData, setPrintRowData] = useState<Application | null>(null);

  // Data State
  const [applications, setApplications] = useState<Application[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  // Announcement Form State
  const [annTitle, setAnnTitle] = useState("");
  const [annContent, setAnnContent] = useState("");
  const [annImage, setAnnImage] = useState("");

  // Public Solo Parent Form State
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
    const { data } = await supabase
      .from("applications")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) {
      setApplications(data);
    }
  };

  const fetchAnnouncements = async () => {
    const { data } = await supabase
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) {
      setAnnouncements(data);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    fetchApplications();
    fetchAnnouncements();
  }, []);

  if (!isMounted) return null;

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoading(true);

    // Query admin_users table or mock authentication check
    const { data, error } = await supabase
      .from("admin_users")
      .select("*")
      .eq("username", usernameInput)
      .eq("password", passwordInput)
      .single();

    setLoading(false);

    if (data && !error) {
      setIsLoggedIn(true);
      setAdminType(data.type_of_client);
      setAdminActiveTab("HOME");
    } else if (usernameInput === "admin" && passwordInput === "admin123") {
      // Fallback demo account
      setIsLoggedIn(true);
      setAdminType("Solo Parent Admin");
      setAdminActiveTab("HOME");
    } else {
      setLoginError("Invalid credentials or unauthorized user type.");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setAdminType(null);
    setActiveTab("HOME");
    setSidebarOpen(false);
  };

  // Submit Public Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");

    const payload = { ...formData, status: "Pending" };
    const { error } = await supabase.from("applications").insert([payload]);

    setLoading(false);

    if (error) {
      alert("Submission error: " + error.message);
    } else {
      setSuccessMsg("Application submitted successfully! It is currently pending admin approval.");
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

  // Application Approval / Disapproval
  const handleUpdateStatus = async (id: number, newStatus: string) => {
    const { error } = await supabase
      .from("applications")
      .update({ status: newStatus })
      .eq("id", id);

    if (!error) {
      fetchApplications();
    } else {
      alert("Error updating status: " + error.message);
    }
  };

  // Delete Record
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this record permanently?")) return;
    const { error } = await supabase.from("applications").delete().eq("id", id);
    if (!error) {
      fetchApplications();
    } else {
      alert("Error deleting record: " + error.message);
    }
  };

  // Post Announcement
  const handlePostAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle || !annContent) return;

    setLoading(true);
    const { error } = await supabase.from("announcements").insert([
      { title: annTitle, content: annContent, image_url: annImage }
    ]);

    setLoading(false);

    if (!error) {
      setAnnTitle("");
      setAnnContent("");
      setAnnImage("");
      fetchAnnouncements();
      alert("Announcement posted successfully!");
    } else {
      alert("Error posting announcement: " + error.message);
    }
  };

  // Print Action Trigger
  const handlePrint = (app: Application) => {
    setPrintRowData(app);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  const approvedApplications = applications.filter(a => a.status === "Approved" || !a.status);
  const pendingApplications = applications.filter(a => a.status === "Pending");

  // =========================================================================
  // ADMIN DASHBOARD VIEW (When logged in as Solo Parent Admin)
  // =========================================================================
  if (isLoggedIn && adminType === "Solo Parent Admin") {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
        
        {/* Printable Area for Single Row */}
        {printRowData && (
          <div className="hidden print:block p-8 bg-white text-black">
            <h1 className="text-2xl font-bold border-b pb-2 mb-4">CSWD Biñan City - Solo Parent Record</h1>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <p><strong>Member Name:</strong> {printRowData.member_name}</p>
              <p><strong>Sex:</strong> {printRowData.sex}</p>
              <p><strong>Age:</strong> {printRowData.age}</p>
              <p><strong>Contact:</strong> {printRowData.contact_number}</p>
              <p><strong>Address:</strong> {printRowData.address}</p>
              <p><strong>Classification:</strong> {printRowData.classification}</p>
              <p><strong>Source of Income:</strong> {printRowData.source_of_income}</p>
              <p><strong>No. of Dependents:</strong> {printRowData.no_of_dependents}</p>
              <p><strong>ID Number:</strong> {printRowData.id_number}</p>
              <p><strong>4Ps Recipient:</strong> {printRowData.four_ps_recipient}</p>
              <p><strong>Cash Subsidy Recipient:</strong> {printRowData.cash_subsidy_recipient}</p>
              <p><strong>Skill Set:</strong> {printRowData.skill_set}</p>
            </div>
          </div>
        )}

        {/* Top Header Bar */}
        <header className="bg-blue-900 text-white flex items-center justify-between px-4 py-3 shadow-md sticky top-0 z-40 print:hidden">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-blue-800 rounded-md focus:outline-none"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <div className="flex items-center space-x-2">
              <img src={cswdLogo} alt="CSWD" className="h-9 w-auto rounded-full bg-white p-0.5" />
              <span className="font-bold text-lg hidden sm:inline">Solo Parent Admin Portal</span>
            </div>
          </div>
          <span className="bg-yellow-500 text-blue-950 font-semibold text-xs px-3 py-1 rounded-full">
            {adminType}
          </span>
        </header>

        <div className="flex flex-1 relative print:hidden">
          
          {/* Overlay for mobile drawer */}
          {sidebarOpen && (
            <div 
              className="fixed inset-0 bg-black/50 z-20 md:hidden" 
              onClick={() => setSidebarOpen(false)} 
            />
          )}

          {/* Responsive Side Navbar */}
          <aside className={`
            fixed md:static inset-y-0 left-0 z-30 w-64 bg-blue-950 text-white flex flex-col justify-between transition-transform duration-300 transform
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:hidden"}
          `}>
            <div className="p-4 space-y-2">
              <p className="text-xs font-semibold text-blue-300 uppercase tracking-wider mb-4">Navigation</p>
              
              <button 
                onClick={() => { setAdminActiveTab("HOME"); setSidebarOpen(false); }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium ${adminActiveTab === "HOME" ? "bg-blue-800 text-white" : "hover:bg-blue-900 text-gray-300"}`}
              >
                <HomeIcon className="w-5 h-5" />
                <span>Home</span>
              </button>

              <button 
                onClick={() => { setAdminActiveTab("DATA"); setSidebarOpen(false); }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium ${adminActiveTab === "DATA" ? "bg-blue-800 text-white" : "hover:bg-blue-900 text-gray-300"}`}
              >
                <Database className="w-5 h-5" />
                <span>Solo Parents Data</span>
              </button>

              <button 
                onClick={() => { setAdminActiveTab("ANNOUNCEMENTS"); setSidebarOpen(false); }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium ${adminActiveTab === "ANNOUNCEMENTS" ? "bg-blue-800 text-white" : "hover:bg-blue-900 text-gray-300"}`}
              >
                <Megaphone className="w-5 h-5" />
                <span>Announcements</span>
              </button>

              <button 
                onClick={() => { setAdminActiveTab("APPROVAL"); setSidebarOpen(false); }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium justify-between ${adminActiveTab === "APPROVAL" ? "bg-blue-800 text-white" : "hover:bg-blue-900 text-gray-300"}`}
              >
                <div className="flex items-center space-x-3">
                  <UserCheck className="w-5 h-5" />
                  <span>Data Approval</span>
                </div>
                {pendingApplications.length > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {pendingApplications.length}
                  </span>
                )}
              </button>
            </div>

            {/* Logout Button at bottom */}
            <div className="p-4 border-t border-blue-900">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium text-sm transition"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </aside>

          {/* Main Content View */}
          <main className="flex-1 p-6 overflow-y-auto max-w-7xl mx-auto w-full">
            
            {/* ADMIN TAB 1: HOME (Dashboard Statistics & Table) */}
            {adminActiveTab === "HOME" && (
              <div className="space-y-6 bg-white p-6 rounded-xl shadow border">
                <div className="text-center border-b pb-4">
                  <h2 className="text-3xl font-extrabold text-blue-950">Biñan CSWD Public Services Portal</h2>
                  <p className="text-gray-600 text-sm mt-1">Solo Parents Application Records Dashboard</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 text-center">
                    <p className="text-sm font-semibold text-blue-800">Total Applications</p>
                    <p className="text-4xl font-extrabold text-blue-950 mt-2">{approvedApplications.length}</p>
                  </div>
                  <div className="bg-amber-50 p-6 rounded-xl border border-amber-100 text-center">
                    <p className="text-sm font-semibold text-amber-800">4Ps Beneficiaries</p>
                    <p className="text-4xl font-extrabold text-amber-900 mt-2">
                      {approvedApplications.filter(a => a.four_ps_recipient === "Yes").length}
                    </p>
                  </div>
                  <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100 text-center">
                    <p className="text-sm font-semibold text-emerald-800">Cash Subsidy Recipients</p>
                    <p className="text-4xl font-extrabold text-emerald-950 mt-2">
                      {approvedApplications.filter(a => a.cash_subsidy_recipient === "Yes").length}
                    </p>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-xl font-bold text-blue-900 mb-4">Submitted Solo Parent Applications</h3>
                  <div className="overflow-x-auto rounded-lg border">
                    <table className="w-full text-left text-sm border-collapse">
                      <thead>
                        <tr className="bg-blue-900 text-white">
                          <th className="p-3 border-b">Member Name</th>
                          <th className="p-3 border-b">Sex</th>
                          <th className="p-3 border-b">Contact</th>
                          <th className="p-3 border-b">Classification</th>
                          <th className="p-3 border-b">Dependents</th>
                          <th className="p-3 border-b">ID Number</th>
                          <th className="p-3 border-b">4Ps Recipient</th>
                        </tr>
                      </thead>
                      <tbody>
                        {approvedApplications.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="p-6 text-center text-gray-500">No applications registered in database.</td>
                          </tr>
                        ) : (
                          approvedApplications.map((app) => (
                            <tr key={app.id} className="border-b hover:bg-gray-50">
                              <td className="p-3 font-medium text-gray-900">{app.member_name}</td>
                              <td className="p-3 text-gray-700">{app.sex}</td>
                              <td className="p-3 text-gray-700">{app.contact_number}</td>
                              <td className="p-3 text-gray-700">{app.classification}</td>
                              <td className="p-3 text-gray-700">{app.no_of_dependents}</td>
                              <td className="p-3 text-gray-700">{app.id_number || "N/A"}</td>
                              <td className="p-3 text-gray-700">{app.four_ps_recipient}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ADMIN TAB 2: SOLO PARENTS DATA (With Print & Delete Actions) */}
            {adminActiveTab === "DATA" && (
              <div className="bg-white p-6 rounded-xl shadow border space-y-4">
                <div className="flex justify-between items-center border-b pb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-blue-950">Approved Solo Parents Directory</h2>
                    <p className="text-sm text-gray-600">Complete database of verified solo parent members.</p>
                  </div>
                  <span className="text-sm bg-blue-100 text-blue-800 font-semibold px-3 py-1 rounded-full">
                    Total: {approvedApplications.length}
                  </span>
                </div>

                <div className="overflow-x-auto rounded-lg border">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="bg-blue-900 text-white">
                        <th className="p-3 border-b">Name</th>
                        <th className="p-3 border-b">Sex</th>
                        <th className="p-3 border-b">Contact</th>
                        <th className="p-3 border-b">Classification</th>
                        <th className="p-3 border-b">ID Number</th>
                        <th className="p-3 border-b text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {approvedApplications.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-6 text-center text-gray-500">No approved records found.</td>
                        </tr>
                      ) : (
                        approvedApplications.map((app) => (
                          <tr key={app.id} className="border-b hover:bg-gray-50">
                            <td className="p-3 font-semibold text-gray-900">{app.member_name}</td>
                            <td className="p-3 text-gray-700">{app.sex}</td>
                            <td className="p-3 text-gray-700">{app.contact_number}</td>
                            <td className="p-3 text-gray-700">{app.classification}</td>
                            <td className="p-3 text-gray-700">{app.id_number || "N/A"}</td>
                            <td className="p-3 text-center space-x-2">
                              <button 
                                onClick={() => handlePrint(app)}
                                className="inline-flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white text-xs px-2.5 py-1.5 rounded transition"
                              >
                                <Printer className="w-3.5 h-3.5" />
                                <span>Print</span>
                              </button>
                              <button 
                                onClick={() => handleDelete(app.id)}
                                className="inline-flex items-center space-x-1 bg-red-600 hover:bg-red-700 text-white text-xs px-2.5 py-1.5 rounded transition"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete</span>
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ADMIN TAB 3: ANNOUNCEMENTS */}
            {adminActiveTab === "ANNOUNCEMENTS" && (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow border">
                  <h2 className="text-2xl font-bold text-blue-950 mb-4">Post New Announcement</h2>
                  <form onSubmit={handlePostAnnouncement} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Announcement Title *</label>
                      <input 
                        type="text" 
                        required 
                        value={annTitle} 
                        onChange={(e) => setAnnTitle(e.target.value)} 
                        className="mt-1 w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500" 
                        placeholder="e.g. Solo Parent ID Distribution Schedule" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Content / Description *</label>
                      <textarea 
                        rows={3} 
                        required 
                        value={annContent} 
                        onChange={(e) => setAnnContent(e.target.value)} 
                        className="mt-1 w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500" 
                        placeholder="Provide details about the announcement..." 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Image URL (Optional)</label>
                      <input 
                        type="url" 
                        value={annImage} 
                        onChange={(e) => setAnnImage(e.target.value)} 
                        className="mt-1 w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500" 
                        placeholder="https://example.com/banner.jpg" 
                      />
                    </div>
                    <button 
                      type="submit" 
                      disabled={loading} 
                      className="bg-blue-900 hover:bg-blue-950 text-white font-bold px-6 py-2.5 rounded-lg flex items-center space-x-2 transition"
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                      <span>Post Announcement</span>
                    </button>
                  </form>
                </div>

                <div className="bg-white p-6 rounded-xl shadow border">
                  <h3 className="text-xl font-bold text-blue-950 mb-4">Posted Announcements</h3>
                  {announcements.length === 0 ? (
                    <p className="text-gray-500 text-sm">No announcements posted yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {announcements.map((ann) => (
                        <div key={ann.id} className="p-4 border rounded-lg hover:bg-gray-50 flex flex-col md:flex-row gap-4">
                          {ann.image_url && (
                            <img src={ann.image_url} alt={ann.title} className="w-full md:w-32 h-24 object-cover rounded-md" />
                          )}
                          <div>
                            <h4 className="font-bold text-blue-900">{ann.title}</h4>
                            <p className="text-xs text-gray-400 mb-2">{new Date(ann.created_at).toLocaleDateString()}</p>
                            <p className="text-sm text-gray-700">{ann.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ADMIN TAB 4: DATA APPROVAL */}
            {adminActiveTab === "APPROVAL" && (
              <div className="bg-white p-6 rounded-xl shadow border space-y-4">
                <div>
                  <h2 className="text-2xl font-bold text-blue-950">Pending Data Approvals</h2>
                  <p className="text-sm text-gray-600">Review submitted application forms before publishing to records.</p>
                </div>

                <div className="overflow-x-auto rounded-lg border">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="bg-blue-900 text-white">
                        <th className="p-3 border-b">Applicant Name</th>
                        <th className="p-3 border-b">Contact</th>
                        <th className="p-3 border-b">Classification</th>
                        <th className="p-3 border-b">Dependents</th>
                        <th className="p-3 border-b text-center">Decision</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingApplications.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-6 text-center text-gray-500">No pending submissions to review.</td>
                        </tr>
                      ) : (
                        pendingApplications.map((app) => (
                          <tr key={app.id} className="border-b hover:bg-gray-50">
                            <td className="p-3 font-semibold text-gray-900">{app.member_name}</td>
                            <td className="p-3 text-gray-700">{app.contact_number}</td>
                            <td className="p-3 text-gray-700">{app.classification}</td>
                            <td className="p-3 text-gray-700">{app.no_of_dependents}</td>
                            <td className="p-3 text-center space-x-2">
                              <button 
                                onClick={() => handleUpdateStatus(app.id, "Approved")}
                                className="inline-flex items-center space-x-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 py-1.5 rounded font-semibold transition"
                              >
                                <Check className="w-4 h-4" />
                                <span>Approve</span>
                              </button>
                              <button 
                                onClick={() => handleUpdateStatus(app.id, "Disapproved")}
                                className="inline-flex items-center space-x-1 bg-rose-600 hover:bg-rose-700 text-white text-xs px-3 py-1.5 rounded font-semibold transition"
                              >
                                <XCircle className="w-4 h-4" />
                                <span>Disapprove</span>
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </main>
        </div>
      </div>
    );
  }

  // =========================================================================
  // PUBLIC WEBSITE VIEW
  // =========================================================================
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

          <div className="flex items-center space-x-6">
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
                    <button key={type} onClick={() => { setSelectedForm(type); setActiveTab("FORMS"); setDropdownOpen(false); }} className="block w-full text-left px-4 py-3 text-sm hover:bg-blue-50 hover:text-blue-900 border-b last:border-b-0">
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
            
            <button 
              onClick={() => setActiveTab("LOGIN")}
              className="bg-yellow-500 hover:bg-yellow-400 text-blue-950 font-bold px-4 py-2 rounded-lg text-sm flex items-center space-x-1.5 transition"
            >
              <Lock className="w-4 h-4" />
              <span>Admin Login</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow max-w-6xl mx-auto w-full p-6 my-8 bg-white/90 backdrop-blur-sm rounded-xl shadow-md border border-gray-100">
        
        {/* PUBLIC HOME TAB (Announcements & Portal Info) */}
        {activeTab === "HOME" && (
          <div className="space-y-6">
            <div className="text-center py-6 border-b">
              <h2 className="text-3xl font-extrabold text-blue-950">Welcome to Biñan CSWD Public Services Portal</h2>
              <p className="text-gray-600 mt-2">Connecting Biñanenses with social welfare services, assistance, and community support.</p>
            </div>

            {/* Public Announcements Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-blue-900 flex items-center space-x-2">
                <Megaphone className="w-5 h-5 text-yellow-600" />
                <span>Latest Announcements & Updates</span>
              </h3>

              {announcements.length === 0 ? (
                <div className="p-8 text-center bg-gray-50 rounded-lg border text-gray-500">
                  No public announcements posted at this time.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {announcements.map((ann) => (
                    <div key={ann.id} className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
                      {ann.image_url && (
                        <img src={ann.image_url} alt={ann.title} className="w-full h-48 object-cover" />
                      )}
                      <div className="p-5 space-y-2">
                        <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md">CSWD Notice</span>
                        <h4 className="font-bold text-lg text-blue-950">{ann.title}</h4>
                        <p className="text-xs text-gray-400">{new Date(ann.created_at).toLocaleDateString()}</p>
                        <p className="text-sm text-gray-700 leading-relaxed">{ann.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* PUBLIC FORM REGISTRATION */}
        {activeTab === "FORMS" && selectedForm === "Solo Parents" && (
          <div className="space-y-6 py-2">
            <div className="border-b pb-3">
              <h2 className="text-2xl font-bold text-blue-900">Solo Parent Application Form</h2>
              <p className="text-sm text-gray-600">Please complete all required details for verification.</p>
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
                    <input type="text" name="member_name" required value={formData.member_name} onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })} className="mt-1 w-full p-2 border rounded-md" placeholder="Dela Cruz, Juanita" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Sex *</label>
                    <select name="sex" value={formData.sex} onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })} className="mt-1 w-full p-2 border rounded-md">
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Age</label>
                    <input type="text" name="age" value={formData.age} onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })} className="mt-1 w-full p-2 border rounded-md" placeholder="32" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium">Address</label>
                    <input type="text" name="address" value={formData.address} onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })} className="mt-1 w-full p-2 border rounded-md" placeholder="Barangay Zapote, Biñan City, Laguna" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Contact Number *</label>
                    <input type="text" name="contact_number" required value={formData.contact_number} onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })} className="mt-1 w-full p-2 border rounded-md" placeholder="09123456789" />
                  </div>
                </div>
              </div>

              {/* 2. Classification & Income */}
              <div>
                <h3 className="font-semibold text-lg text-blue-950 mb-3 border-b pb-1">2. Classification & Income</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium">Classification</label>
                    <input type="text" name="classification" value={formData.classification} onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })} className="mt-1 w-full p-2 border rounded-md" placeholder="Death of Spouse" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Source of Income</label>
                    <input type="text" name="source_of_income" value={formData.source_of_income} onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })} className="mt-1 w-full p-2 border rounded-md" placeholder="Employed / Business" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">No. of Dependents</label>
                    <input type="text" name="no_of_dependents" value={formData.no_of_dependents} onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })} className="mt-1 w-full p-2 border rounded-md" placeholder="2" />
                  </div>
                </div>
              </div>

              {/* 3. Disability Details */}
              <div>
                <h3 className="font-semibold text-lg text-blue-950 mb-3 border-b pb-1">3. Disability Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium">Member Disability?</label>
                    <select name="member_disability" value={formData.member_disability} onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })} className="mt-1 w-full p-2 border rounded-md">
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Member Disability Type</label>
                    <input type="text" name="member_disability_type" value={formData.member_disability_type} onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })} className="mt-1 w-full p-2 border rounded-md" placeholder="Specify if yes" />
                  </div>
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full bg-blue-900 text-white py-3 rounded-md hover:bg-blue-950 transition flex justify-center items-center font-bold">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Submit Application Form"}
              </button>
            </form>
          </div>
        )}

        {/* ADMIN LOGIN PAGE */}
        {activeTab === "LOGIN" && (
          <div className="max-w-md mx-auto py-8">
            <div className="text-center mb-6">
              <Lock className="w-12 h-12 text-blue-900 mx-auto mb-2" />
              <h2 className="text-2xl font-bold text-blue-950">CSWD Admin Login</h2>
              <p className="text-sm text-gray-600">Access dashboard based on client role.</p>
            </div>

            {loginError && (
              <div className="p-3 mb-4 bg-red-50 text-red-700 text-sm rounded-md border border-red-200">
                {loginError}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4 bg-white p-6 rounded-xl border shadow-sm">
              <div>
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <input 
                  type="text" 
                  required 
                  value={usernameInput} 
                  onChange={(e) => setUsernameInput(e.target.value)} 
                  className="mt-1 w-full p-2.5 border rounded-md" 
                  placeholder="admin" 
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input 
                  type="password" 
                  required 
                  value={passwordInput} 
                  onChange={(e) => setPasswordInput(e.target.value)} 
                  className="mt-1 w-full p-2.5 border rounded-md" 
                  placeholder="••••••••" 
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-blue-900 hover:bg-blue-950 text-white py-2.5 rounded-md font-bold transition flex justify-center items-center"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In to Admin Portal"}
              </button>
            </form>
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