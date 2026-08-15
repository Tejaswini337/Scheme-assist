import { useState, type ReactNode } from "react";

type AppStage = "landing" | "auth" | "home" | "eligibility" | "results" | "schemes" | "guidance";
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
  const [loggedInUser, setLoggedInUser] = useState("Citizen");
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

  const handleLogin = (e: import("react").FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      alert("Please enter email and password.");
      return;
    }
    setLoggedInUser(loginEmail.split("@")[0] || "Citizen");
    go("home");
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
    const response = await fetch("http://127.0.0.1:5000/api/register", {
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
    setFormData(initialForm);
    setMatchedSchemes([]);
    go("landing");
  };

  const handleCheckEligibility = (e: import("react").FormEvent) => {
    e.preventDefault();

    const age = Number(formData.age) || 0;
    const income = Number(formData.annualIncome) || 0;
    const result: Scheme[] = [];

    if (["Farmer", "Agricultural Worker"].includes(formData.occupation)) {
      result.push(schemes[2], schemes[13]);
    }
    if (income <= 500000 || formData.houseOwnership === "No house" || formData.houseOwnership === "Rented") {
      result.push(schemes[1]);
    }
    if (income <= 300000 || formData.bplStatus === "Yes") result.push(schemes[0]);
    if (formData.studentStatus === "Yes" || age < 25) result.push(schemes[3]);
    if (age >= 60 || formData.seniorCitizen === "Yes" || formData.widowSingleParent === "Yes") {
      result.push(schemes[4], schemes[12]);
    }
    if (formData.occupation === "Daily Wage Worker" || formData.occupation === "Self Employed") {
      result.push(schemes[6], schemes[9]);
    }
    if (formData.occupation === "Business") result.push(schemes[8], schemes[9]);
    if (formData.category === "SC" || formData.category === "ST" || formData.category === "OBC" || formData.category === "EWS") {
      result.push(schemes[3]);
    }

    const unique = result.filter((s, i, arr) => i === arr.findIndex((x) => x.name === s.name));
    setMatchedSchemes(unique.length ? unique : [schemes[0], schemes[1], schemes[3]]);
    go("results");
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
    const eligibleCount = matchedSchemes.length || 12;
    const missedCount = Math.max(2, 19 - eligibleCount);

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
            <DashboardCard icon="₹" title="Potential Benefits" value="₹1,45,000" tone="gold" footer="Total estimated annual benefit" />
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

          <section className="mt-6 grid gap-6 xl:grid-cols-2">
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
              </div>
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
          </section>

          {selectedScheme && <SchemeModal scheme={selectedScheme} onClose={() => setSelectedScheme(null)} onGuidance={() => { setSelectedScheme(null); go("guidance"); }} />}
        </div>
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
    const missed = schemes.filter((s) => !matchedSchemes.some((m) => m.name === s.name)).slice(0, 5);
    return (
      <DashboardShell
  go={go}
  loggedInUser={loggedInUser}
  onLogout={handleLogout}
  appStage={appStage}
>
        <div className="mx-auto max-w-[1400px] px-5 py-8 lg:px-10">
          <div className="rounded-3xl border border-[#dfe3dc] bg-white p-7">
            <p className="text-xs font-bold uppercase tracking-[.2em] text-[#7b867b]">Eligibility Results</p>
            <h1 className="mt-2 text-3xl font-extrabold">Schemes that may be relevant to you</h1>
            <p className="mt-2 max-w-3xl text-[#727b72]">Based on the information provided, these schemes may be worth checking further. Final eligibility is determined by the concerned government department.</p>
          </div>

          <section className="mt-6 grid gap-5 md:grid-cols-3">
            <Stat title="Applicant" value={formData.fullName || "Citizen"} />
            <Stat title="Potential Matches" value={String(matchedSchemes.length)} />
            <Stat title="Location" value={formData.district && formData.state ? `${formData.district}, ${formData.state}` : "Not provided"} />
          </section>

          <section className="mt-8">
            <div className="flex items-end justify-between">
              <h2 className="text-2xl font-extrabold">Recommended Schemes</h2>
              <button onClick={() => go("schemes")} className="font-semibold text-[#55745c]">View all schemes →</button>
            </div>
            <div className="mt-5 grid gap-5 lg:grid-cols-2">
              {matchedSchemes.map((scheme) => (
                <SchemeResultCard key={scheme.name} scheme={scheme} onGuidance={() => go("guidance")} />
              ))}
            </div>
          </section>

          <section className="mt-8 rounded-2xl border border-[#e4dfd5] bg-[#fbfaf6] p-6">
            <h2 className="text-xl font-extrabold">Possible Missed Benefits</h2>
            <p className="mt-1 text-sm text-[#747c74]">These schemes were not in your current match set. Review them because eligibility can depend on additional government conditions.</p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {missed.map((scheme) => (
                <button key={scheme.name} onClick={() => setSelectedScheme(scheme)} className="rounded-xl border border-[#ded8cc] bg-white p-4 text-left hover:bg-[#f7f9f5]">
                  <p className="font-bold">{scheme.name}</p>
                  <p className="mt-1 text-sm text-[#7a827a]">{scheme.category} · Review eligibility</p>
                </button>
              ))}
            </div>
          </section>

          <section className="mt-8 rounded-2xl border border-[#dfe3dc] bg-white p-6">
            <h2 className="text-xl font-extrabold">Application Guidance</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-4">
              {["Check scheme conditions", "Prepare required documents", "Apply through official channel", "Track application status"].map((x, i) => (
                <div key={x} className="rounded-xl bg-[#f1f4ee] p-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#55745c] text-sm font-bold text-white">{i + 1}</div>
                  <p className="mt-3 font-semibold">{x}</p>
                </div>
              ))}
            </div>
            <button onClick={() => go("guidance")} className="mt-5 rounded-xl bg-[#55745c] px-5 py-3 font-bold text-white">Open Full Guidance →</button>
          </section>

          <div className="mt-7 flex flex-wrap gap-3">
            <button onClick={() => go("eligibility")} className="rounded-xl border border-[#cbd4c8] bg-white px-5 py-3 font-bold text-[#55745c]">Edit & Check Again</button>
            <button onClick={() => go("home")} className="rounded-xl bg-[#55745c] px-5 py-3 font-bold text-white">Back to Home</button>
          </div>

          {selectedScheme && <SchemeModal scheme={selectedScheme} onClose={() => setSelectedScheme(null)} onGuidance={() => { setSelectedScheme(null); go("guidance"); }} />}
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
        <div className="mx-auto max-w-5xl px-5 py-8 lg:px-10">
          <p className="text-xs font-bold uppercase tracking-[.2em] text-[#7b867b]">Application Guidance</p>
          <h1 className="mt-2 text-3xl font-extrabold">How to proceed with a government scheme</h1>
          <p className="mt-2 text-[#727b72]">Use these as general guidance. The official department or portal decides the final process and eligibility.</p>
          <div className="mt-7 space-y-4">
            {[
              ["1", "Confirm eligibility", "Read the official scheme conditions and make sure your profile matches them."],
              ["2", "Prepare documents", "Keep identity, address, income, caste/category, bank and other scheme-specific documents ready."],
              ["3", "Use the official application channel", "Apply through the concerned government portal, service centre or designated office."],
              ["4", "Save your reference number", "Keep the acknowledgement or application/reference number safely."],
              ["5", "Track the application", "Use the official status-tracking facility where available."],
            ].map(([n, title, text]) => (
              <div key={n} className="flex gap-4 rounded-2xl border border-[#dfe3dc] bg-white p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#55745c] font-bold text-white">{n}</div>
                <div><h2 className="font-bold">{title}</h2><p className="mt-1 text-sm leading-6 text-[#747c74]">{text}</p></div>
              </div>
            ))}
          </div>
          <button onClick={() => go("home")} className="mt-7 rounded-xl bg-[#55745c] px-6 py-3 font-bold text-white">← Back to Dashboard</button>
        </div>
      </DashboardShell>
    );
  }

  return null;
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
          active={appStage === "guidance"}
          onClick={() => go("guidance")}
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
        <nav className="hidden xl:flex items-center gap-8">

          <button
            onClick={() => go("home")}
            className="font-semibold text-[#405343]"
          >
            Home
          </button>

          <button
            onClick={() => go("eligibility")}
            className="font-semibold text-[#405343]"
          >
            Eligibility Check
          </button>

          <button
            onClick={() => go("schemes")}
            className="font-semibold text-[#405343]"
          >
            Schemes
          </button>

          <button
            onClick={() => go("guidance")}
            className="font-semibold text-[#405343]"
          >
            AI Advisor
          </button>

          <button
            onClick={() => go("guidance")}
            className="font-semibold text-[#405343]"
          >
            My Applications
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

function SchemeModal({ scheme, onClose, onGuidance }: { scheme: Scheme; onClose: () => void; onGuidance: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-5" onClick={onClose}>
      <div className="w-full max-w-xl rounded-3xl bg-[#fbfaf6] p-7 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-4">
          <div><span className="rounded-full bg-[#eaf1e7] px-3 py-1 text-xs font-bold text-[#55745c]">{scheme.category}</span><h2 className="mt-3 text-2xl font-extrabold">{scheme.name}</h2></div>
          <button onClick={onClose} className="text-2xl text-[#7b837b]">×</button>
        </div>
        <p className="mt-4 leading-7 text-[#707870]">{scheme.description}</p>
        <div className="mt-5 rounded-2xl bg-[#eef3eb] p-4"><p className="text-xs font-bold uppercase tracking-wider text-[#6e786e]">Why it may be relevant</p><p className="mt-2 text-sm leading-6">{scheme.reason}</p></div>
        <div className="mt-4 rounded-2xl bg-[#f0ede4] p-4"><p className="text-xs font-bold uppercase tracking-wider text-[#7b8177]">Potential benefit</p><p className="mt-2 font-semibold">{scheme.benefit}</p></div>
        <div className="mt-6 flex flex-wrap gap-3"><button onClick={onGuidance} className="rounded-xl bg-[#55745c] px-5 py-3 font-bold text-white">Application Guidance →</button><button onClick={onClose} className="rounded-xl border border-[#cfd5cb] px-5 py-3 font-semibold">Close</button></div>
      </div>
    </div>
  );
}

function SchemeResultCard({ scheme, onGuidance }: { scheme: Scheme; onGuidance: () => void }) {
  return (
    <div className="rounded-2xl border border-[#dfe3dc] bg-white p-6">
      <span className="rounded-full bg-[#edf3e9] px-3 py-1 text-xs font-bold text-[#55745c]">{scheme.category}</span>
      <h3 className="mt-4 text-xl font-extrabold">{scheme.name}</h3>
      <p className="mt-2 text-sm leading-6 text-[#747c74]">{scheme.description}</p>
      <div className="mt-4 rounded-xl bg-[#f2f4ef] p-4"><p className="text-xs font-bold uppercase tracking-wider text-[#7b837b]">Why it appeared</p><p className="mt-1 text-sm">{scheme.reason}</p></div>
      <p className="mt-4 text-sm"><b>Possible benefit:</b> {scheme.benefit}</p>
      <button onClick={onGuidance} className="mt-5 rounded-xl border border-[#bfcabd] bg-[#f7f9f5] px-4 py-2.5 text-sm font-bold text-[#55745c]">View Application Guidance →</button>
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