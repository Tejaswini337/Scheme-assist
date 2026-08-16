import { useEffect,useState, type ReactNode } from "react";

type AppStage =
  | "landing"
  | "auth"
  | "home"
  | "eligibility"
  | "results"
  | "schemes"
  | "guidance"
  | "applications";
type AuthMode = "login" | "register";

type FormData = {
  fullName: string;
  age: string;
  gender: string;
  maritalStatus: string;
  aadhaarAvailable: string;
  aadhaarLast4: string;
  casteCertificate: string;
  category: string;
  disability: string;
  disabilityCertificate: string;
  state: string;
  district: string;
  town: string;
  pincode: string;
  annualIncome: string;
  occupation: string;
  employmentStatus: string;
  familySize: string;
  bplStatus: string;
  houseOwnership: string;
  ruralUrban: string;
  studentStatus: string;
  seniorCitizen: string;
  widowSingleParent: string;
  incomeCertificate: string;
  residenceCertificate: string;
};

type Scheme = {
  name: string;
  category: string;
  description: string;
  benefit: string;
  reason: string;
  missedReason?: string;
  documents?: string[];
};

const initialForm: FormData = {
  fullName: "",
  age: "",
  gender: "",
  maritalStatus: "",
  aadhaarAvailable: "",
  aadhaarLast4: "",
  casteCertificate: "",
  category: "",
  disability: "",
  disabilityCertificate: "",
  state: "",
  district: "",
  town: "",
  pincode: "",
  annualIncome: "",
  occupation: "",
  employmentStatus: "",
  familySize: "",
  bplStatus: "",
  houseOwnership: "",
  ruralUrban: "",
  studentStatus: "",
  seniorCitizen: "",
  widowSingleParent: "",
  incomeCertificate: "",
  residenceCertificate: "",
};

const schemes: Scheme[] = [
  { name: "Ayushman Bharat PM-JAY", category: "Health", description: "Health protection support for eligible families.", benefit: "Health cover as per scheme rules", reason: "Income and household details may match health-support criteria." },
  { name: "PM Awas Yojana", category: "Housing", description: "Housing assistance for eligible rural and urban households.", benefit: "Housing assistance as applicable", reason: "Income, area type and house ownership are relevant." },
  { name: "PM-KISAN", category: "Agriculture", description: "Income support for eligible farmer families.", benefit: "Periodic financial support", reason: "Farmer occupation may match the scheme profile." },
  { name: "National Scholarship Portal", category: "Education", description: "Central and state scholarship opportunities for students.", benefit: "Education-related financial assistance", reason: "Student status, category and family income can matter." },
  { name: "NSAP Social Security Pension", category: "Social Security", description: "Support for eligible senior citizens, widows and other groups.", benefit: "Periodic pension support", reason: "Age and family status are important eligibility factors." },
  { name: "PM Ujjwala Yojana", category: "Women & Family", description: "LPG connection support for eligible households.", benefit: "LPG connection support", reason: "Household and socioeconomic information can be relevant." },
  { name: "PM SVANidhi", category: "Livelihood", description: "Working-capital support for eligible street vendors.", benefit: "Small business credit support", reason: "Occupation and livelihood profile can be relevant." },
  { name: "PM Vishwakarma", category: "Skills & Livelihood", description: "Support for eligible traditional artisans and craftspeople.", benefit: "Training and enterprise support", reason: "Occupation and artisan activity are key factors." },
  { name: "Stand-Up India", category: "Entrepreneurship", description: "Credit support for eligible entrepreneurs.", benefit: "Business finance support", reason: "Category, occupation and business plans can be relevant." },
  { name: "MUDRA Yojana", category: "Business", description: "Credit support for eligible micro and small enterprises.", benefit: "Micro-enterprise credit", reason: "Self-employment and business activity may be relevant." },
  { name: "National Family Benefit Scheme", category: "Social Security", description: "Support for eligible families facing qualifying circumstances.", benefit: "Financial assistance as applicable", reason: "Family and income conditions may be considered." },
  { name: "Sukanya Samriddhi Yojana", category: "Savings", description: "Government-backed savings option for eligible girl children.", benefit: "Long-term savings support", reason: "Family composition and age conditions determine relevance." },
  { name: "Atal Pension Yojana", category: "Pension", description: "Pension-oriented savings scheme for eligible subscribers.", benefit: "Pension benefits under scheme rules", reason: "Age and employment profile can matter." },
  { name: "PM Fasal Bima Yojana", category: "Agriculture", description: "Crop insurance support for eligible farmers.", benefit: "Crop insurance protection", reason: "Farmer status and crop-related conditions are relevant." },
  { name: "PM SVANidhi / Livelihood Support", category: "Livelihood", description: "Support for eligible small informal businesses and vendors.", benefit: "Livelihood finance support", reason: "Occupation and livelihood profile may be relevant." },
];

const states = [
  "Andhra Pradesh", "Telangana", "Karnataka", "Tamil Nadu", "Kerala",
  "Maharashtra", "Odisha", "West Bengal", "Gujarat", "Rajasthan",
  "Madhya Pradesh", "Uttar Pradesh", "Bihar", "Delhi", "Other"
];

export default function App() {
  const [appStage, setAppStage] = useState<AppStage>("landing");
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [formData, setFormData] = useState<FormData>(initialForm);
  const [matchedSchemes, setMatchedSchemes] = useState<Scheme[]>([]);
  const [verificationSchemes, setVerificationSchemes] = useState<any[]>([]);
  const [notEligibleSchemes, setNotEligibleSchemes] = useState<any[]>([]);
  const [potentialMissedBenefits, setPotentialMissedBenefits] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [applicationsLoading, setApplicationsLoading] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState("Citizen");
  const [loggedInEmail, setLoggedInEmail] = useState("");
  const [aiMessage, setAiMessage] = useState("");
const [aiReply, setAiReply] = useState("");
const [aiLoading, setAiLoading] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);

  const go = (stage: AppStage) => {
    setSelectedScheme(null);
    setAppStage(stage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const profileCompletion = Math.round(
    [
      formData.fullName, formData.age, formData.gender, formData.maritalStatus,
      formData.state, formData.district, formData.pincode, formData.category,
      formData.annualIncome, formData.occupation, formData.familySize,
      formData.casteCertificate, formData.incomeCertificate
    ].filter(Boolean).length / 13 * 100
  );
  useEffect(() => {
  const loadApplications = async () => {
    if (!loggedInEmail) {
      return;
    }

    try {
      const response = await fetch(
        `https://scheme-assist-d15d.onrender.com/api/applications/${encodeURIComponent(
          loggedInEmail
        )}`
      );

      const data = await response.json();

      if (response.ok) {
        setApplications(data.applications || []);
      }
    } catch (error) {
      console.error(
        "Unable to load applications:",
        error
      );
    }
  };

  loadApplications();
}, [loggedInEmail]);

  const handleLogin = async (e: import("react").FormEvent) => {
  e.preventDefault();

  if (!loginEmail || !loginPassword) {
    alert("Please enter email and password.");
    return;
  }

  try {
    const response = await fetch("https://scheme-assist-d15d.onrender.com/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: loginEmail,
        password: loginPassword,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Login failed.");
      return;
    }

    alert("Login successful!");

    setLoggedInUser(data.user.name);
    setLoggedInEmail(data.user.email);

    setLoginEmail("");
    setLoginPassword("");

    if (data.user.profile) {
  setFormData(data.user.profile);
  go("home");
} else {
  go("eligibility");
}

  } catch (error) {
    console.error("Login error:", error);
    alert(
      "Unable to connect to the backend. Please make sure Flask server is running."
    );
  }
};

  const handleRegister = async (e: import("react").FormEvent) => {
  e.preventDefault();

  if (!registerName || !registerEmail || !registerPassword) {
    alert("Please fill all required fields.");
    return;
  }

  if (registerPassword !== registerConfirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  try {
    const response = await fetch("https://scheme-assist-d15d.onrender.com/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: registerName,
        email: registerEmail,
        password: registerPassword,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Registration failed.");
      return;
    }

    alert("Registration successful!");

    setLoggedInUser(registerName);

    // Clear registration fields
    setRegisterName("");
    setRegisterEmail("");
    setRegisterPassword("");
    setRegisterConfirmPassword("");

    // Go to dashboard
    go("home");

  } catch (error) {
    console.error("Registration error:", error);
    alert("Unable to connect to the backend. Please make sure Flask server is running.");
  }
};
  const handleLogout = () => {
    setLoggedInUser("Citizen");
    setLoggedInEmail("");
    setFormData(initialForm);
    setMatchedSchemes([]);
    go("landing");
  };
const handleAIChat = async (
  e: import("react").FormEvent
) => {
  e.preventDefault();

  if (!aiMessage.trim()) {
    return;
  }

  setAiLoading(true);

  try {
    const response = await fetch(
      "https://scheme-assist-d15d.onrender.com/api/ai/chat",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: aiMessage,
           email: loggedInEmail,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "AI assistant failed.");
      return;
    }

    setAiReply(data.reply);
    setAiMessage("");

  } catch (error) {
    console.error("AI chat error:", error);

    alert(
      "Unable to connect to AI assistant. Please make sure Flask server is running."
    );

  } finally {
    setAiLoading(false);
  }
};
 const handleCheckEligibility = async (
  e: import("react").FormEvent
) => {
  e.preventDefault();
   if (
    !formData.age ||
    !formData.annualIncome ||
    !formData.occupation ||
    !formData.category ||
    !formData.gender ||
    !formData.state ||
    !formData.district
  ) {
    alert("Please complete the eligibility form first.");
    go("eligibility");
    return;
  }
  try {
    const profileToSave = {
  email: loggedInEmail,
  fullName: formData.fullName,

  age: formData.age,
  gender: formData.gender,
  maritalStatus: formData.maritalStatus,

  aadhaarAvailable: formData.aadhaarAvailable,
  casteCertificate: formData.casteCertificate,
  category: formData.category,

  disability: formData.disability,
  disabilityCertificate: formData.disabilityCertificate,

  state: formData.state,
  district: formData.district,
  town: formData.town,
  pincode: formData.pincode,
  ruralUrban: formData.ruralUrban,

  annualIncome: formData.annualIncome,
  occupation: formData.occupation,
  employmentStatus: formData.employmentStatus,

  familySize: formData.familySize,
  bplStatus: formData.bplStatus,

  houseOwnership: formData.houseOwnership,
  studentStatus: formData.studentStatus,
  seniorCitizen: formData.seniorCitizen,
  widowSingleParent: formData.widowSingleParent,

  incomeCertificate: formData.incomeCertificate,
  residenceCertificate: formData.residenceCertificate,
};
console.log("Logged in email:", loggedInEmail);
const profileResponse = await fetch(
  "https://scheme-assist-d15d.onrender.com/api/profile",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: loggedInEmail,
      profile: profileToSave,
    }),
  }
);

const profileData = await profileResponse.json();
console.log("PROFILE SAVE RESPONSE:", profileData);

if (!profileResponse.ok) {
  alert(profileData.message || "Unable to save profile.");
  return;
}
   const response = await fetch(
  "https://scheme-assist-d15d.onrender.com/api/eligibility/check",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: loggedInEmail,

      fullName: formData.fullName,
      age: formData.age,
      gender: formData.gender,
      maritalStatus: formData.maritalStatus,

      aadhaarAvailable: formData.aadhaarAvailable,
      casteCertificate: formData.casteCertificate,
      category: formData.category,

      disability: formData.disability,
      disabilityCertificate: formData.disabilityCertificate,

      state: formData.state,
      district: formData.district,
      town: formData.town,
      pincode: formData.pincode,
      ruralUrban: formData.ruralUrban,

      annualIncome: formData.annualIncome,
      occupation: formData.occupation,
      employmentStatus: formData.employmentStatus,

      familySize: formData.familySize,
      bplStatus: formData.bplStatus,

      houseOwnership: formData.houseOwnership,
      studentStatus: formData.studentStatus,
      seniorCitizen: formData.seniorCitizen,
      widowSingleParent: formData.widowSingleParent,

      incomeCertificate: formData.incomeCertificate,
      residenceCertificate: formData.residenceCertificate,
    }),
  }
);

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Eligibility check failed.");
      return;
    }

    console.log("Eligibility Result:", data);

    // Store backend results
    
    setMatchedSchemes(data.eligibleSchemes || []);

setVerificationSchemes(
  data.verificationSchemes || []
);

setNotEligibleSchemes(
  data.notEligibleSchemes || []
);

// Get schemes already applied by this user
let appliedSchemeNames: string[] = [];

if (loggedInEmail) {
  try {
    const applicationResponse = await fetch(
      `https://scheme-assist-d15d.onrender.com/api/applications/${encodeURIComponent(
        loggedInEmail
      )}`
    );

    const applicationData = await applicationResponse.json();

    if (applicationResponse.ok) {
      appliedSchemeNames = (
        applicationData.applications || []
      ).map(
        (application: any) => application.schemeName
      );
    }
  } catch (error) {
    console.error(
      "Unable to fetch application history:",
      error
    );
  }
}

// Only schemes that the user has NOT already applied for
const missedBenefits = (
  data.potentialMissedBenefits || []
).filter(
  (scheme: any) =>
    !appliedSchemeNames.includes(scheme.name)
);

setPotentialMissedBenefits(missedBenefits);

go("results");

  } catch (error) {
    console.error("Eligibility error:", error);

    alert(
      "Unable to connect to the backend. Please make sure Flask is running."
    );
  }
};
const handleApplyScheme = async (scheme: any) => {
  if (!loggedInUser) {
    alert("Please login first.");
    go("auth");
    return;
  }

  try {
    const response = await fetch(
      "https://scheme-assist-d15d.onrender.com/api/applications",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userEmail: loggedInEmail,
          schemeName: scheme.name,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Unable to save application.");
      return;
    }

    alert("Application saved successfully!");

  } catch (error) {
    console.error("Application error:", error);

    alert(
      "Unable to connect to the backend. Please make sure Flask is running."
    );
  }
};
const handleOpenApplications = async () => {
  if (!loggedInEmail) {
    alert("Please login first.");
    go("auth");
    return;
  }

  setApplicationsLoading(true);

  try {
    const response = await fetch(
      `https://scheme-assist-d15d.onrender.com/api/applications/${encodeURIComponent(
        loggedInEmail
      )}`
    );

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Unable to load applications.");
      return;
    }

    setApplications(data.applications || []);

    go("applications");

  } catch (error) {
    console.error("Applications error:", error);

    alert(
      "Unable to connect to the backend. Please make sure Flask is running."
    );
  } finally {
    setApplicationsLoading(false);
  }
};
  const profileItems = [
    { title: "Personal Details", sub: "Name, Age, Gender", complete: !!(formData.fullName && formData.age && formData.gender) },
    { title: "Address Details", sub: "State, District, Pincode", complete: !!(formData.state && formData.district && formData.pincode) },
    { title: "Family & Social Details", sub: "Category, Family Size", complete: !!(formData.category && formData.familySize) },
    { title: "Financial & Occupation", sub: "Income, Occupation", complete: !!(formData.annualIncome && formData.occupation) },
    { title: "Documents", sub: "Aadhaar, Caste, Income Proof", complete: !!(formData.aadhaarAvailable && formData.casteCertificate && formData.incomeCertificate) },
  ]; 

  if (appStage === "landing") {
    return (
      <div className="min-h-screen bg-[#f5f1e8] text-[#30352f] flex items-center justify-center px-6">
        <div className="text-center">
          <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-full border-[3px] border-[#82917f] bg-[#ebe7dc] shadow-[0_25px_70px_rgba(70,70,60,.12)]">
            <div>
              <div className="text-6xl">⚖</div>
              <div className="mt-2 text-[9px] font-bold uppercase tracking-[.25em] text-[#687166]">Public Service</div>
            </div>
          </div>
          <h1 className="mt-8 text-5xl font-extrabold tracking-tight">Scheme Assist</h1>
          <p className="mt-3 text-[#777d74]">Government Scheme Eligibility Assistant</p>
          <button onClick={() => go("auth")} className="mt-8 rounded-2xl bg-[#55745c] px-10 py-4 font-bold text-white shadow-lg hover:bg-[#48654f]">
            Get Started →
          </button>
        </div>
      </div>
    );
  }

  if (appStage === "auth") {
    return (
      <div className="min-h-screen bg-[#f5f1e8] text-[#30352f] flex items-center justify-center px-5 py-10">
        <div className="w-full max-w-md">
          <div className="text-center mb-7">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#55745c] text-2xl text-white">⚖</div>
            <h1 className="mt-3 text-2xl font-extrabold">Scheme Assist</h1>
            <p className="text-sm text-[#7b8179]">Secure citizen access</p>
          </div>
          <div className="rounded-3xl border border-[#ded8cc] bg-[#fbfaf6] p-7 shadow-[0_25px_70px_rgba(70,70,60,.10)]">
            <div className="mb-7 grid grid-cols-2 rounded-xl bg-[#eee9df] p-1">
              <button onClick={() => setAuthMode("login")} className={`rounded-lg py-2.5 font-semibold ${authMode === "login" ? "bg-[#fbfaf6] text-[#55745c] shadow-sm" : "text-[#777d74]"}`}>Login</button>
              <button onClick={() => setAuthMode("register")} className={`rounded-lg py-2.5 font-semibold ${authMode === "register" ? "bg-[#fbfaf6] text-[#55745c] shadow-sm" : "text-[#777d74]"}`}>Register</button>
            </div>

            {authMode === "login" ? (
              <form onSubmit={handleLogin} className="space-y-5">
                <Field label="Email Address" value={loginEmail} onChange={setLoginEmail} placeholder="Enter your email" type="email" />
                <Field label="Password" value={loginPassword} onChange={setLoginPassword} placeholder="Enter your password" type="password" />
                <button className="w-full rounded-xl bg-[#55745c] py-3.5 font-bold text-white hover:bg-[#48654f]">Login</button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-4">
                <Field label="Full Name" value={registerName} onChange={setRegisterName} placeholder="Enter your full name" />
                <Field label="Email Address" value={registerEmail} onChange={setRegisterEmail} placeholder="Enter your email" type="email" />
                <Field label="Password" value={registerPassword} onChange={setRegisterPassword} placeholder="Create a password" type="password" />
                <Field label="Confirm Password" value={registerConfirmPassword} onChange={setRegisterConfirmPassword} placeholder="Confirm password" type="password" />
                <button className="w-full rounded-xl bg-[#55745c] py-3.5 font-bold text-white hover:bg-[#48654f]">Create Account</button>
              </form>
            )}
          </div>
          <button onClick={() => go("landing")} className="mt-5 block w-full text-center text-sm text-[#777d74]">← Back</button>
        </div>
      </div>
    );
  }

 

  if (appStage === "home") {
   const eligibleCount = matchedSchemes.length;
   const missedCount = potentialMissedBenefits.length; 
    return (
      <DashboardShell
  go={go}
  loggedInUser={loggedInUser}
  onLogout={handleLogout}
  appStage={appStage}
>
        <div className="mx-auto max-w-[1500px] px-5 py-8 lg:px-10">
          <div className="mb-7">
            <p className="text-sm font-medium text-[#758077]">Citizen Dashboard</p>
            <h1 className="mt-1 text-3xl font-extrabold">Good morning, {loggedInUser}! 👋</h1>
            <p className="mt-2 text-[#707870]">Let's find the government schemes you are eligible for.</p>
          </div>

          <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <DashboardCard icon="✓" title="Eligible Schemes" value={String(eligibleCount)} tone="green" onClick={() => go("schemes")} footer="View all eligible schemes →" />
            <DashboardCard icon="₹" title="Potential Benefits" value="₹6000" tone="gold" footer="Total estimated annual benefit" />
            <DashboardCard icon="◇" title="Missed Benefits" value={String(missedCount)} tone="rose" onClick={() => go("results")} footer="Schemes you might be missing" />
            <DashboardCard icon="◔" title="Profile Completion" value={`${profileCompletion}%`} tone="sage" onClick={() => go("eligibility")} footer="Complete your profile">
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#dce5dc]"><div className="h-full rounded-full bg-[#55745c]" style={{ width: `${profileCompletion}%` }} /></div>
            </DashboardCard>
          </section>

          <section className="mt-6 rounded-2xl border border-[#d7e1d4] bg-[#edf4ea] p-5 lg:p-6">
            <div className="flex flex-col items-center gap-5 md:flex-row">
              <div className="flex h-28 w-40 items-center justify-center rounded-2xl bg-[#dfeadb] text-6xl">👨‍👩‍👧</div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-extrabold">Check Your Eligibility Now</h2>
                <p className="mt-1 text-[#6e786f]">Answer a few questions and discover schemes that match your profile.</p>
              </div>
              <button onClick={() => go("eligibility")} className="rounded-xl bg-[#55745c] px-6 py-3.5 font-bold text-white hover:bg-[#48654f]">Check My Eligibility →</button>
            </div>
          </section>
          <section>
            <div className="rounded-2xl border border-[#dfe3dc] bg-white p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-extrabold">Top Eligible Schemes for You</h2>
                <button onClick={() => go("schemes")} className="font-semibold text-[#55745c]">View all</button>
              </div>
              <div className="mt-4">
                {schemes.slice(0, 5).map((scheme) => (
                  <button key={scheme.name} onClick={() => setSelectedScheme(scheme)} className="flex w-full items-center gap-4 border-b border-[#edf0eb] py-4 text-left hover:bg-[#f7f9f5]">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#edf3e9] text-xl text-[#55745c]">◆</div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold">{scheme.name}</p>
                      <p className="mt-1 text-sm text-[#7b837b]">{scheme.description}</p>
                    </div>
                    <span className="text-[#8a928a]">›</span>
                  </button>
                ))}
              </div>
              <button onClick={() => go("schemes")} className="mt-4 font-bold text-[#55745c]">+ {schemes.length - 5} more schemes</button>
            </div>

            <div className="rounded-2xl border border-[#dfe3dc] bg-white p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-extrabold">Complete Your Profile</h2>
                <button onClick={() => go("eligibility")} className="font-semibold text-[#55745c]">Edit Profile</button>
                <div className="mt-3">
                {profileItems.map((item) => (
                  <button key={item.title} onClick={() => go("eligibility")} className="flex w-full items-center gap-4 border-b border-[#edf0eb] py-4 text-left hover:bg-[#f7f9f5]">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eef3eb] text-[#55745c]">●</div>
                    <div className="flex-1">
                      <p className="font-semibold">{item.title}</p>
                      <p className="text-xs text-[#7d857d]">{item.sub}</p>
                    </div>
                    <span className={item.complete ? "text-[#4e865a] text-xl" : "text-[#d59f21] text-xl"}>{item.complete ? "✓" : "!"}</span>
                    <span className="text-[#9aa19a]">›</span>
                  </button>
                ))}
                </div>
              </div>
            </div>
          </section>

          {selectedScheme && <SchemeModal scheme={selectedScheme} onClose={() => setSelectedScheme(null)} onGuidance={() => { setSelectedScheme(null); go("guidance"); }} />}
        </div>
        <section className="mt-6 rounded-2xl border border-[#dfe3dc] bg-white p-6">
  <div className="flex items-center justify-between">
    <div>
      <h2 className="text-xl font-extrabold">
        My Applications
      </h2>

      <p className="mt-1 text-sm text-[#747c74]">
        Track the government schemes you have applied for.
      </p>
    </div>

    <button
  onClick={handleOpenApplications}
  disabled={applicationsLoading}
  className="rounded-xl bg-[#55745c] px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60"
>
  {applicationsLoading
    ? "Loading..."
    : "View Applications →"}
</button>
  </div>

  <div className="mt-5">
    {applications.length === 0 ? (
      <p className="text-sm text-[#7a827a]">
        You haven't applied for any schemes yet.
      </p>
    ) : (
      <div className="grid gap-3 md:grid-cols-2">
        {applications.slice(0, 4).map((application, index) => (
          <div
            key={`${application.schemeName}-${index}`}
            className="rounded-xl border border-[#e1e5df] bg-[#f7f9f5] p-4"
          >
            <p className="font-bold">
              {application.schemeName}
            </p>

            <p className="mt-1 text-sm text-[#747c74]">
              Status:{" "}
              <span className="font-semibold text-[#55745c]">
                {application.status || "Applied"}
              </span>
            </p>
          </div>
        ))}
      </div>
    )}
  </div>
</section>
      </DashboardShell>
    );
  }

  if (appStage === "schemes") {
    return (
      <DashboardShell
  go={go}
  loggedInUser={loggedInUser}
  onLogout={handleLogout}
  appStage={appStage}
>
        <div className="mx-auto max-w-[1400px] px-5 py-8 lg:px-10">
          <p className="text-xs font-bold uppercase tracking-[.2em] text-[#7b867b]">Scheme Directory</p>
          <h1 className="mt-2 text-3xl font-extrabold">Government Schemes</h1>
          <p className="mt-2 text-[#727b72]">Explore schemes that may be relevant to different citizen profiles.</p>
          <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {schemes.map((scheme) => (
              <button key={scheme.name} onClick={() => setSelectedScheme(scheme)} className="rounded-2xl border border-[#dfe3dc] bg-white p-6 text-left hover:-translate-y-0.5 hover:shadow-md transition">
                <span className="rounded-full bg-[#edf3e9] px-3 py-1 text-xs font-bold text-[#55745c]">{scheme.category}</span>
                <h2 className="mt-4 text-lg font-extrabold">{scheme.name}</h2>
                <p className="mt-2 text-sm leading-6 text-[#747c74]">{scheme.description}</p>
                <p className="mt-4 text-sm font-semibold text-[#55745c]">View scheme details →</p>
              </button>
            ))}
          </div>
          {selectedScheme && <SchemeModal scheme={selectedScheme} onClose={() => setSelectedScheme(null)} onGuidance={() => { setSelectedScheme(null); go("guidance"); }} />}
        </div>
      </DashboardShell>
    );
  }

  if (appStage === "eligibility") {
    return (
      <DashboardShell
  go={go}
  loggedInUser={loggedInUser}
  onLogout={handleLogout}
  appStage={appStage}
>
        <div className="mx-auto max-w-6xl px-5 py-8 lg:px-10">
          <p className="text-xs font-bold uppercase tracking-[.2em] text-[#7b867b]">Eligibility Profile</p>
          <h1 className="mt-2 text-3xl font-extrabold">Tell us about yourself</h1>
          <p className="mt-2 text-[#727b72]">Enter the information generally used to compare citizens with government scheme conditions.</p>

          <form onSubmit={handleCheckEligibility} className="mt-7 space-y-6">
            <FormSection title="1. Personal Details">
              <Field label="Full Name *" value={formData.fullName} onChange={(v) => updateField("fullName", v)} placeholder="Enter full name" />
              <Field label="Age *" type="number" value={formData.age} onChange={(v) => updateField("age", v)} placeholder="Enter age" />
              <SelectField label="Gender" value={formData.gender} onChange={(v) => updateField("gender", v)} options={["Male", "Female", "Other"]} />
              <SelectField label="Marital Status" value={formData.maritalStatus} onChange={(v) => updateField("maritalStatus", v)} options={["Single", "Married", "Widowed", "Divorced", "Separated"]} />
            </FormSection>

            <FormSection title="2. Identity & Social Category">
              <SelectField label="Aadhaar Available?" value={formData.aadhaarAvailable} onChange={(v) => updateField("aadhaarAvailable", v)} options={["Yes", "No"]} />
              <Field label="Aadhaar Last 4 Digits" value={formData.aadhaarLast4} onChange={(v) => updateField("aadhaarLast4", v)} placeholder="Optional" maxLength={4} />
              <SelectField label="Social Category *" value={formData.category} onChange={(v) => updateField("category", v)} options={["General", "OBC", "SC", "ST", "EWS", "Other"]} />
              <SelectField label="Caste Certificate" value={formData.casteCertificate} onChange={(v) => updateField("casteCertificate", v)} options={["Available", "Not Available", "Not Applicable"]} />
              <SelectField label="Disability Status" value={formData.disability} onChange={(v) => updateField("disability", v)} options={["Yes", "No"]} />
              <SelectField label="Disability Certificate" value={formData.disabilityCertificate} onChange={(v) => updateField("disabilityCertificate", v)} options={["Available", "Not Available", "Not Applicable"]} />
            </FormSection>

            <FormSection title="3. Address & Location">
              <SelectField label="State *" value={formData.state} onChange={(v) => updateField("state", v)} options={states} />
              <Field label="District *" value={formData.district} onChange={(v) => updateField("district", v)} placeholder="Enter district" />
              <Field label="Town / Village" value={formData.town} onChange={(v) => updateField("town", v)} placeholder="Enter town or village" />
              <Field label="Pincode *" value={formData.pincode} onChange={(v) => updateField("pincode", v)} placeholder="Enter 6-digit pincode" maxLength={6} />
              <SelectField label="Area Type" value={formData.ruralUrban} onChange={(v) => updateField("ruralUrban", v)} options={["Rural", "Urban"]} />
            </FormSection>

            <FormSection title="4. Economic & Employment Details">
              <Field label="Annual Family Income *" type="number" value={formData.annualIncome} onChange={(v) => updateField("annualIncome", v)} placeholder="Enter annual income in ₹" />
              <SelectField label="Occupation *" value={formData.occupation} onChange={(v) => updateField("occupation", v)} options={["Farmer", "Agricultural Worker", "Student", "Government Employee", "Private Employee", "Self Employed", "Daily Wage Worker", "Business", "Unemployed", "Other"]} />
              <SelectField label="Employment Status" value={formData.employmentStatus} onChange={(v) => updateField("employmentStatus", v)} options={["Employed", "Self Employed", "Unemployed", "Student", "Retired"]} />
              <Field label="Family Size *" type="number" value={formData.familySize} onChange={(v) => updateField("familySize", v)} placeholder="Number of family members" />
              <SelectField label="BPL Status" value={formData.bplStatus} onChange={(v) => updateField("bplStatus", v)} options={["Yes", "No", "Not Sure"]} />
            </FormSection>

            <FormSection title="5. Family & Special Conditions">
              <SelectField label="House Ownership" value={formData.houseOwnership} onChange={(v) => updateField("houseOwnership", v)} options={["Own house", "Rented", "No house"]} />
              <SelectField label="Student" value={formData.studentStatus} onChange={(v) => updateField("studentStatus", v)} options={["Yes", "No"]} />
              <SelectField label="Senior Citizen" value={formData.seniorCitizen} onChange={(v) => updateField("seniorCitizen", v)} options={["Yes", "No"]} />
              <SelectField label="Widow / Single Parent" value={formData.widowSingleParent} onChange={(v) => updateField("widowSingleParent", v)} options={["Yes", "No"]} />
            </FormSection>

            <FormSection title="6. Supporting Documents">
              <SelectField label="Income Certificate" value={formData.incomeCertificate} onChange={(v) => updateField("incomeCertificate", v)} options={["Available", "Not Available"]} />
              <SelectField label="Residence Certificate" value={formData.residenceCertificate} onChange={(v) => updateField("residenceCertificate", v)} options={["Available", "Not Available"]} />
              <div className="md:col-span-2 rounded-2xl bg-[#eef2eb] p-4 text-sm leading-6 text-[#6f786f]">
                <b className="text-[#3d4e40]">Privacy note:</b> This prototype only asks whether supporting documents are available. Do not enter full Aadhaar numbers.
              </div>
            </FormSection>

            <div className="flex flex-col items-center gap-3 pb-10">
              <button type="submit" className="rounded-2xl bg-[#55745c] px-10 py-4 font-bold text-white shadow-lg hover:bg-[#48654f]">Check My Eligibility →</button>
              <button type="button" onClick={() => go("home")} className="text-sm font-semibold text-[#6e776e]">← Back to Dashboard</button>
            </div>
          </form>
        </div>
      </DashboardShell>
    );
  }

    if (appStage === "results") {
  return (
    <DashboardShell
      go={go}
      loggedInUser={loggedInUser}
      onLogout={handleLogout}
      appStage={appStage}
    >
      <div className="mx-auto max-w-[1400px] px-5 py-8 lg:px-10">

        {/* Header */}
        <div className="rounded-3xl border border-[#dfe3dc] bg-white p-7">
          <p className="text-xs font-bold uppercase tracking-[.2em] text-[#7b867b]">
            Eligibility Results
          </p>

          <h1 className="mt-2 text-3xl font-extrabold">
            Your Government Scheme Results
          </h1>

          <p className="mt-2 max-w-3xl text-[#727b72]">
            Based on the information you provided, we compared your profile
            with the available Scheme Assist eligibility rules. Final
            eligibility is always confirmed by the concerned government
            department.
          </p>
        </div>


        {/* Statistics */}
        <section className="mt-6 grid gap-5 md:grid-cols-4">

          <Stat
            title="Applicant"
            value={formData.fullName || "Citizen"}
          />

          <Stat
            title="Eligible"
            value={String(matchedSchemes.length)}
          />

          <Stat
            title="Verification Needed"
            value={String(verificationSchemes.length)}
          />

          <Stat
            title="Location"
            value={
              formData.district && formData.state
                ? `${formData.district}, ${formData.state}`
                : "Not provided"
            }
          />

        </section>


        {/* ================================================= */}
        {/* ELIGIBLE SCHEMES */}
        {/* ================================================= */}

        <section className="mt-8">

          <div className="flex items-end justify-between">

            <div>
              <h2 className="text-2xl font-extrabold">
                ✅ Eligible Schemes
              </h2>

              <p className="mt-1 text-sm text-[#747c74]">
                Schemes whose available eligibility conditions match your
                profile.
              </p>
            </div>

            <button
              onClick={() => go("schemes")}
              className="font-semibold text-[#55745c]"
            >
              View all schemes →
            </button>

          </div>


          {matchedSchemes.length > 0 ? (

            <div className="mt-5 grid gap-5 lg:grid-cols-2">

              {matchedSchemes.map((scheme) => (

                <SchemeResultCard
                  key={scheme.name}
                  scheme={scheme}
                  onGuidance={() => {
                    setSelectedScheme(scheme);
                  }}
                  onApply={() => handleApplyScheme(scheme)}
                />

              ))}

            </div>

          ) : (

            <div className="mt-5 rounded-2xl border border-[#e4dfd5] bg-[#fbfaf6] p-6">

              <p className="font-bold">
                No schemes matched your current profile.
              </p>

              <p className="mt-1 text-sm text-[#747c74]">
                You can edit your details and check again.
              </p>

            </div>

          )}

        </section>


        {/* ================================================= */}
        {/* VERIFICATION SCHEMES */}
        {/* ================================================= */}

        {verificationSchemes.length > 0 && (

          <section className="mt-8 rounded-2xl border border-[#eadfbd] bg-[#fffaf0] p-6">

            <h2 className="text-xl font-extrabold">
              ⚠️ Needs Official Verification
            </h2>

            <p className="mt-1 text-sm text-[#7a7466]">
              These schemes may be relevant, but Scheme Assist does not have
              enough information to make a final eligibility decision.
              Please verify through the official government channel.
            </p>


            <div className="mt-5 grid gap-4 md:grid-cols-2">

              {verificationSchemes.map((scheme) => (

                <button
                  key={scheme.name}
                  onClick={() => setSelectedScheme(scheme)}
                  className="rounded-xl border border-[#e4d9b9] bg-white p-5 text-left hover:bg-[#fffdf7]"
                >

                  <p className="font-bold">
                    {scheme.name}
                  </p>

                  <p className="mt-1 text-sm text-[#7a827a]">
                    {scheme.category}
                  </p>

                  <p className="mt-3 text-sm text-[#665f50]">
                    {scheme.reason ||
                      "Additional official verification is required."}
                  </p>
                  {scheme.missedReason && (
  <div className="mt-3 rounded-xl bg-[#fff8e7] p-3">
    <p className="text-xs font-bold uppercase tracking-wider text-[#9a7415]">
      Why you may be missing this
    </p>

    <p className="mt-1 text-sm text-[#665f50]">
      {scheme.missedReason}
    </p>
  </div>
)}

                  <p className="mt-3 font-semibold text-[#55745c]">
                    View details →
                  </p>

                </button>

              ))}

            </div>

          </section>

        )}


        {/* ================================================= */}
        {/* NOT ELIGIBLE */}
        {/* ================================================= */}

        {notEligibleSchemes.length > 0 && (

          <section className="mt-8 rounded-2xl border border-[#ead7d2] bg-[#fff8f6] p-6">

            <h2 className="text-xl font-extrabold">
              ❌ Not Matching Current Profile
            </h2>

            <p className="mt-1 text-sm text-[#806f6b]">
              These schemes did not match one or more eligibility conditions
              based on the information currently provided.
            </p>


            <div className="mt-5 grid gap-4 md:grid-cols-2">

              {notEligibleSchemes.map((scheme) => (

                <div
                  key={scheme.name}
                  className="rounded-xl border border-[#ead7d2] bg-white p-5"
                >

                  <p className="font-bold">
                    {scheme.name}
                  </p>

                  <p className="mt-1 text-sm text-[#7a827a]">
                    {scheme.category}
                  </p>


                  {scheme.reasons &&
                    scheme.reasons.length > 0 && (

                      <div className="mt-3">

                        <p className="text-sm font-semibold text-[#665f50]">
                          Reason:
                        </p>

                        <ul className="mt-1 list-disc pl-5 text-sm text-[#806f6b]">

                          {scheme.reasons.map(
                            (reason: string, index: number) => (

                              <li key={index}>
                                {reason}
                              </li>

                            )
                          )}

                        </ul>

                      </div>

                    )}

                </div>

              ))}

            </div>

          </section>

        )}
        {/* ================================================= */}
{/* POTENTIAL MISSED BENEFITS */}
{/* ================================================= */}

{potentialMissedBenefits.length > 0 && (

  <section className="mt-8 rounded-2xl border border-[#e4dfd5] bg-[#fbfaf6] p-6">

    <h2 className="text-xl font-extrabold">
      🎯 Potential Missed Benefits
    </h2>

    <p className="mt-1 text-sm text-[#747c74]">
      These schemes appear to match your available profile
      information. Check whether you have already applied for
      or received these benefits.
    </p>

    <div className="mt-5 grid gap-4 md:grid-cols-2">

      {potentialMissedBenefits.map((scheme) => (

        <button
          key={scheme.name}
          onClick={() => setSelectedScheme(scheme)}
          className="rounded-xl border border-[#ded8cc] bg-white p-5 text-left hover:bg-[#f7f9f5]"
        >

          <p className="font-bold">
            {scheme.name}
          </p>

          <p className="mt-1 text-sm text-[#7a827a]">
            {scheme.category}
          </p>

          <p className="mt-3 text-sm text-[#665f50]">
            {scheme.reason}
          </p>

          <p className="mt-3 font-semibold text-[#55745c]">
            Review benefit →
          </p>

        </button>

      ))}

    </div>

  </section>

)}


        {/* ================================================= */}
        {/* APPLICATION GUIDANCE */}
        {/* ================================================= */}

        <section className="mt-8 rounded-2xl border border-[#dfe3dc] bg-white p-6">

          <h2 className="text-xl font-extrabold">
            Application Guidance
          </h2>

          <p className="mt-1 text-sm text-[#747c74]">
            Once you identify a potentially eligible scheme, follow these
            steps before applying.
          </p>


          <div className="mt-5 grid gap-4 md:grid-cols-4">

            {[
              "Check scheme conditions",
              "Prepare required documents",
              "Apply through official channel",
              "Track application status"
            ].map((x, i) => (

              <div
                key={x}
                className="rounded-xl bg-[#f1f4ee] p-4"
              >

                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#55745c] text-sm font-bold text-white">
                  {i + 1}
                </div>

                <p className="mt-3 font-semibold">
                  {x}
                </p>

              </div>

            ))}

          </div>


          <button
            onClick={() => go("guidance")}
            className="mt-5 rounded-xl bg-[#55745c] px-5 py-3 font-bold text-white"
          >
            Open Full Guidance →
          </button>

        </section>


        {/* ================================================= */}
        {/* BOTTOM BUTTONS */}
        {/* ================================================= */}

        <div className="mt-7 flex flex-wrap gap-3">

          <button
            onClick={() => go("eligibility")}
            className="rounded-xl border border-[#cbd4c8] bg-white px-5 py-3 font-bold text-[#55745c]"
          >
            Edit & Check Again
          </button>

          <button
            onClick={() => go("home")}
            className="rounded-xl bg-[#55745c] px-5 py-3 font-bold text-white"
          >
            Back to Home
          </button>

        </div>


        {/* Scheme Modal */}

        {selectedScheme && (

          <SchemeModal
            scheme={selectedScheme}
            onClose={() => setSelectedScheme(null)}
            onGuidance={() => {
              setSelectedScheme(null);
              go("guidance");
            }}
          />

        )}

      </div>

    </DashboardShell>
  );
}
if (appStage === "applications") {
  return (
    <DashboardShell
      go={go}
      loggedInUser={loggedInUser}
      onLogout={handleLogout}
      appStage={appStage}
    >
      <div className="mx-auto max-w-[1400px] px-5 py-8 lg:px-10">

        <div className="mb-7">
          <p className="text-xs font-bold uppercase tracking-[.2em] text-[#7b867b]">
            Application Center
          </p>

          <h1 className="mt-2 text-3xl font-extrabold">
            My Applications
          </h1>

          <p className="mt-2 max-w-3xl text-[#727b72]">
            Track the government schemes you have applied for.
          </p>
        </div>

        {applications.length === 0 ? (
          <div className="rounded-2xl border border-[#dfe3dc] bg-white p-10 text-center">

            <div className="text-5xl">▤</div>

            <h2 className="mt-4 text-xl font-extrabold">
              No applications yet
            </h2>

            <p className="mt-2 text-sm text-[#747c74]">
              Once you apply for a government scheme,
              your application will appear here.
            </p>

            <button
              onClick={() => go("schemes")}
              className="mt-6 rounded-xl bg-[#55745c] px-5 py-3 font-bold text-white"
            >
              Explore Schemes →
            </button>

          </div>
        ) : (

          <div className="grid gap-5 md:grid-cols-2">

            {applications.map((application, index) => (

              <div
                key={`${application.schemeName}-${index}`}
                className="rounded-2xl border border-[#dfe3dc] bg-white p-6"
              >

                <div className="flex items-start justify-between gap-4">

                  <div>
                    <span className="rounded-full bg-[#edf3e9] px-3 py-1 text-xs font-bold text-[#55745c]">
                      Government Scheme
                    </span>

                    <h2 className="mt-4 text-xl font-extrabold">
                      {application.schemeName}
                    </h2>
                  </div>

                  <span className="rounded-full bg-[#fff4d8] px-3 py-1 text-xs font-bold text-[#9a7415]">
                    {application.status || "Applied"}
                  </span>

                </div>

                <div className="mt-5 rounded-xl bg-[#f4f6f1] p-4">

                  <p className="text-xs font-bold uppercase tracking-wider text-[#7b837b]">
                    Applicant
                  </p>

                  <p className="mt-1 text-sm">
                    {application.userEmail}
                  </p>

                </div>

                <div className="mt-4 flex justify-between text-sm">

                  <span className="text-[#7a827a]">
                    Application Status
                  </span>

                  <span className="font-bold text-[#55745c]">
                    {application.status || "Applied"}
                  </span>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>
    </DashboardShell>
  );
}

if (appStage === "guidance") {
  return (
    <DashboardShell
      go={go}
      loggedInUser={loggedInUser}
      onLogout={handleLogout}
      appStage={appStage}
    >
      <div className="mx-auto max-w-4xl px-5 py-10 lg:px-10">

        {/* AI Assistant Header */}
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#edf3e9] text-3xl">
            🤖
          </div>

          <p className="mt-5 text-xs font-bold uppercase tracking-[.2em] text-[#7b867b]">
            AI Advisor
          </p>

          <h1 className="mt-2 text-3xl font-extrabold text-[#30352f]">
            Scheme Assist AI
          </h1>

          <p className="mx-auto mt-2 max-w-2xl text-[#727b72]">
            Ask anything about Indian government schemes, eligibility,
            benefits, documents and application procedures.
          </p>
        </div>

        {/* AI Assistant */}
        <div className="mt-8 rounded-3xl border border-[#dfe3dc] bg-white p-6 shadow-sm">

          {/* AI response */}
          {aiReply ? (
            <div className="rounded-2xl bg-[#eef3eb] p-5">
              <div className="flex items-center gap-2">
                <span className="text-xl">🤖</span>

                <p className="text-sm font-bold text-[#55745c]">
                  Scheme Assist AI
                </p>
              </div>

              <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[#30352f]">
                {aiReply}
              </p>
            </div>
          ) : (
            <div className="rounded-2xl bg-[#f5f7f2] p-6 text-center">
              <p className="font-bold text-[#405343]">
                👋 Hello! How can I help you?
              </p>

              <p className="mt-2 text-sm leading-6 text-[#747c74]">
                Ask me about government schemes, eligibility,
                benefits, required documents or application procedures.
              </p>
            </div>
          )}

          {/* Ask Question */}
          <form
            onSubmit={handleAIChat}
            className="mt-6"
          >
            <textarea
              value={aiMessage}
              onChange={(e) => setAiMessage(e.target.value)}
              placeholder="Ask your question here..."
              rows={4}
              className="w-full resize-none rounded-2xl border border-[#cfd5cb] bg-[#fbfaf6] px-4 py-4 text-sm text-[#30352f] outline-none focus:border-[#55745c]"
            />

            <div className="mt-3 flex justify-end">
              <button
                type="submit"
                disabled={aiLoading || !aiMessage.trim()}
                className="rounded-xl bg-[#55745c] px-7 py-3 font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-50"
              >
                {aiLoading ? "Thinking..." : "Ask AI →"}
              </button>
            </div>
          </form>

        </div>

      </div>
    </DashboardShell>
  );
}
}

  function Sidebar({
  go,
  appStage,
}: {
  go: (stage: AppStage) => void;
  appStage: AppStage;
}) {
  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-[#ded8cc] bg-[#fbfaf6] min-h-[calc(100vh-73px)]">

      <div className="p-5 space-y-1">

        <SideButton
          icon="⌂"
          label="Dashboard"
          active={appStage === "home"}
          onClick={() => go("home")}
        />

        <SideButton
          icon="♙"
          label="Eligibility Profile"
          active={appStage === "eligibility"}
          onClick={() => go("eligibility")}
        />

        <SideButton
          icon="▣"
          label="My Schemes"
          active={appStage === "schemes"}
          onClick={() => go("schemes")}
        />

        <SideButton
          icon="◇"
          label="Missed Benefits"
          active={appStage === "results"}
          onClick={() => go("results")}
        />

        <SideButton
   icon="▤"
  label="Applications"
  active={appStage === "applications"}
  onClick={()=>go("applications")}
/>

        <SideButton
          icon="□"
          label="Document Checker"
          active={false}
          onClick={() => go("eligibility")}
        />

        <SideButton
          icon="✦"
          label="AI Assistant"
          active={false}
          onClick={() => go("guidance")}
        />

        <SideButton
          icon="⚙"
          label="Settings"
          active={false}
          onClick={() => alert("Settings section coming soon")}
        />

        <SideButton
          icon="?"
          label="Help & Support"
          active={false}
          onClick={() => alert("Help & Support")}
        />

      </div>

      <div className="mt-auto p-5">
        <div className="rounded-2xl border border-[#dfe6db] bg-[#eef4eb] p-4">

          <p className="font-bold text-[#304936]">
            Need Help?
          </p>

          <p className="mt-1 text-xs leading-5 text-[#6e776e]">
            Our Scheme Assist guide is here to help.
          </p>

          <button
            onClick={() => go("guidance")}
            className="mt-3 w-full rounded-xl bg-[#55745c] py-2.5 text-sm font-bold text-white"
          >
            Ask Scheme Assistant
          </button>

        </div>
      </div>

    </aside>
  );
}
  
  function TopNav({
  go,
  loggedInUser,
  onLogout,
}: {
  go: (stage: AppStage) => void;
  loggedInUser: string;
  onLogout: () => void;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-[#ded8cc] bg-[#fbfaf6]/95 backdrop-blur">

      <div className="flex h-[73px] items-center justify-between px-5 lg:px-8">

        {/* Logo */}
        <button
          onClick={() => go("home")}
          className="flex items-center gap-3 text-left"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#edf1e9] text-2xl">
            ⚖
          </div>

          <div>
            <div className="text-xl font-extrabold text-[#26352b]">
              Scheme Assist
            </div>

            <div className="text-[10px] uppercase tracking-[0.18em] text-[#7c847b]">
              Government Scheme Assistant
            </div>
          </div>
        </button>

        {/* Navigation */}
       <div className="flex items-center gap-6">

  <nav className="hidden xl:flex items-center">
    <button
      onClick={() => go("home")}
      className="font-semibold text-[#405343]"
    >
      Home
    </button>
  </nav>

  {/* User */}
  <div className="flex items-center gap-3">

    <div className="hidden sm:block text-right">
      <p className="text-sm font-bold text-[#303b33]">
        {loggedInUser}
      </p>

      <p className="text-xs text-[#7d847d]">
        Citizen
      </p>
    </div>

    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e5ebe1] text-xl">
      ♙
    </div>

    <button
      onClick={onLogout}
      className="hidden sm:block rounded-xl border border-[#cfd5cb] px-3 py-2 text-sm font-semibold text-[#526254]"
    >
      Logout
    </button>
    </div>
  </div>

</div>

    </header>
  );
}

 function DashboardShell({
  children,
  go,
  loggedInUser,
  onLogout,
  appStage,
}: {
  children: ReactNode;
  go: (stage: AppStage) => void;
  loggedInUser: string;
  onLogout: () => void;
  appStage: AppStage;
}) {
  return (
    <div className="min-h-screen bg-[#f5f6f2] text-[#30352f]">

      <TopNav
        go={go}
        loggedInUser={loggedInUser}
        onLogout={onLogout}
      />

      <div className="flex">

        <Sidebar
          go={go}
          appStage={appStage}
        />

        <main className="min-w-0 flex-1">
          {children}
        </main>

      </div>

    </div>
  );
}
function SideButton({ icon, label, active, onClick }: { icon: string; label: string; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left font-semibold transition ${active ? "bg-[#eaf1e7] text-[#416048]" : "text-[#525b53] hover:bg-[#f1f3ee]"}`}>
      <span className="w-6 text-center text-lg">{icon}</span><span>{label}</span>
    </button>
  );
}

function DashboardCard({ icon, title, value, tone, footer, onClick, children }: { icon: string; title: string; value: string; tone: "green" | "gold" | "rose" | "sage"; footer: string; onClick?: () => void; children?: ReactNode }) {
  const toneClass = { green: "bg-[#edf4ea] border-[#d5e2d2]", gold: "bg-[#faf5e5] border-[#e9dfbd]", rose: "bg-[#f9eeee] border-[#ead6d6]", sage: "bg-[#eef3f0] border-[#d7e0db]" }[tone];
  return (
    <button onClick={onClick} className={`rounded-2xl border p-5 text-left ${toneClass} ${onClick ? "hover:-translate-y-0.5 transition hover:shadow-sm" : "cursor-default"}`}>
      <div className="flex items-start justify-between"><div><p className="text-sm font-semibold">{title}</p><p className="mt-2 text-3xl font-extrabold">{value}</p></div><div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/70 text-xl font-bold">{icon}</div></div>
      {children}
      <p className="mt-4 text-sm font-medium text-[#617064]">{footer}</p>
    </button>
  );
}

function SchemeModal({
  scheme,
  onClose,
  onGuidance,
}: {
  scheme: Scheme;
  onClose: () => void;
  onGuidance: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-5"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-[#fbfaf6] p-7 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Header */}
        <div className="flex items-start justify-between gap-4">

          <div>
            <span className="rounded-full bg-[#eaf1e7] px-3 py-1 text-xs font-bold text-[#55745c]">
              {scheme.category}
            </span>

            <h2 className="mt-3 text-2xl font-extrabold">
              {scheme.name}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="text-2xl text-[#7b837b]"
          >
            ×
          </button>

        </div>

        {/* Description */}
        <div className="mt-5">
          <p className="text-xs font-bold uppercase tracking-wider text-[#7b837b]">
            About the Scheme
          </p>

          <p className="mt-2 leading-7 text-[#707870]">
            {scheme.description}
          </p>
        </div>

        {/* Why relevant */}
        <div className="mt-5 rounded-2xl bg-[#eef3eb] p-4">

          <p className="text-xs font-bold uppercase tracking-wider text-[#6e786e]">
            Why it may be relevant
          </p>

          <p className="mt-2 text-sm leading-6">
            {scheme.reason}
          </p>

        </div>

        {/* Benefit */}
        <div className="mt-4 rounded-2xl bg-[#f0ede4] p-4">

          <p className="text-xs font-bold uppercase tracking-wider text-[#7b8177]">
            Potential Benefit
          </p>

          <p className="mt-2 font-semibold">
            {scheme.benefit}
          </p>

        </div>

        {/* Documents */}
        <div className="mt-5">

          <p className="text-xs font-bold uppercase tracking-wider text-[#7b837b]">
            Required Documents
          </p>

          <div className="mt-3 grid gap-2 sm:grid-cols-2">

            {(scheme.documents || []).map((document) => (
              <div
                key={document}
                className="rounded-xl border border-[#dfe3dc] bg-white px-4 py-3 text-sm"
              >
                <span className="mr-2 text-[#55745c]">
                  ✓
                </span>

                {document}
              </div>
            ))}

          </div>

        </div>

        {/* How to apply */}
        <div className="mt-6">

          <p className="text-xs font-bold uppercase tracking-wider text-[#7b837b]">
            How to Apply
          </p>

          <div className="mt-3 space-y-3">

            {[
              "Check the eligibility conditions.",
              "Keep the required documents ready.",
              "Apply through the appropriate official channel.",
              "Track your application status after submission.",
            ].map((step, index) => (
              <div
                key={step}
                className="flex items-center gap-3"
              >

                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#55745c] text-sm font-bold text-white">
                  {index + 1}
                </div>

                <p className="text-sm text-[#596259]">
                  {step}
                </p>

              </div>
            ))}

          </div>

        </div>

        {/* Buttons */}
        <div className="mt-7 flex flex-wrap gap-3">

          <button
            onClick={onGuidance}
            className="rounded-xl bg-[#55745c] px-5 py-3 font-bold text-white hover:bg-[#48654f]"
          >
            Application Guidance →
          </button>

          <button
            onClick={onClose}
            className="rounded-xl border border-[#cfd5cb] bg-white px-5 py-3 font-semibold"
          >
            Close
          </button>

        </div>

      </div>
    </div>
  );
}

function SchemeResultCard({
  scheme,
  onGuidance,
  onApply,
}: {
  scheme: Scheme;
  onGuidance: () => void;
  onApply: () => void;
}) {
  return (
    <div className="rounded-2xl border border-[#dfe3dc] bg-white p-6">

      <span className="rounded-full bg-[#edf3e9] px-3 py-1 text-xs font-bold text-[#55745c]">
        {scheme.category}
      </span>

      <h3 className="mt-4 text-xl font-extrabold">
        {scheme.name}
      </h3>

      <p className="mt-2 text-sm leading-6 text-[#747c74]">
        {scheme.description}
      </p>

      <div className="mt-4 rounded-xl bg-[#f2f4ef] p-4">
        <p className="text-xs font-bold uppercase tracking-wider text-[#7b837b]">
          Why it appeared
        </p>

        <p className="mt-1 text-sm">
          {scheme.reason}
        </p>
      </div>

      <p className="mt-4 text-sm">
        <b>Possible benefit:</b> {scheme.benefit}
      </p>

      {/* Buttons */}
      <div className="mt-5 flex flex-wrap gap-3">

        <button
          onClick={onGuidance}
          className="rounded-xl border border-[#bfcabd] bg-[#f7f9f5] px-4 py-2.5 text-sm font-bold text-[#55745c]"
        >
          View Application Guidance →
        </button>

        <button
          onClick={onApply}
          className="rounded-xl bg-[#55745c] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#45634c]"
        >
          Apply Now
        </button>

      </div>

    </div>
  );
}

function FormSection({ title, children }: { title: string; children: ReactNode }) {
  return <section className="rounded-3xl border border-[#dfe3dc] bg-white p-6 md:p-8"><h2 className="text-xl font-extrabold">{title}</h2><div className="mt-6 grid gap-5 md:grid-cols-2">{children}</div></section>;
}

function Field({ label, value, onChange, placeholder, type = "text", maxLength }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string; maxLength?: number }) {
  return <div><label className="mb-2 block text-sm font-semibold text-[#444d45]">{label}</label><input type={type} value={value} maxLength={maxLength} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full rounded-xl border border-[#d4dad2] bg-[#fcfdfb] px-4 py-3 text-sm outline-none focus:border-[#7c927e] focus:ring-2 focus:ring-[#7c927e]/20" /></div>;
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return <div><label className="mb-2 block text-sm font-semibold text-[#444d45]">{label}</label><select value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-xl border border-[#d4dad2] bg-[#fcfdfb] px-4 py-3 text-sm outline-none focus:border-[#7c927e] focus:ring-2 focus:ring-[#7c927e]/20"><option value="">Select an option</option>{options.map((x) => <option key={x}>{x}</option>)}</select></div>;
}

function Stat({ title, value }: { title: string; value: string }) {
  return <div className="rounded-2xl border border-[#dfe3dc] bg-white p-5"><p className="text-sm text-[#7a827a]">{title}</p><p className="mt-2 text-xl font-extrabold">{value}</p></div>;
}