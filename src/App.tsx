import { useState } from "react";

type AppStage =
  | "landing"
  | "auth"
  | "home"
  | "eligibility"
  | "results";

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
  reason: string;
  benefit: string;
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
  {
    name: "PM-KISAN",
    category: "Agriculture",
    description:
      "Income support scheme for eligible farmer families.",
    reason:
      "Your occupation and family profile may match farmer-support criteria.",
    benefit: "Financial assistance through eligible installments.",
  },
  {
    name: "PMAY",
    category: "Housing",
    description:
      "Housing support for eligible families.",
    reason:
      "Your income, residence and house-ownership details can be considered.",
    benefit: "Housing assistance according to applicable rules.",
  },
  {
    name: "Ayushman Bharat",
    category: "Health",
    description:
      "Health coverage support for eligible families.",
    reason:
      "Your household and income information may satisfy applicable criteria.",
    benefit: "Health coverage benefits according to eligibility.",
  },
  {
    name: "National Scholarship Schemes",
    category: "Education",
    description:
      "Scholarship opportunities for eligible students.",
    reason:
      "Student status, category and income can be relevant.",
    benefit: "Financial assistance for eligible education expenses.",
  },
  {
    name: "Social Security Pension",
    category: "Social Security",
    description:
      "Support for eligible senior citizens, widows and other groups.",
    reason:
      "Age and family-status information can determine eligibility.",
    benefit: "Periodic social-security assistance where applicable.",
  },
];

export default function App() {
  /* =====================================================
     APP NAVIGATION
  ===================================================== */

  const [appStage, setAppStage] = useState<AppStage>("landing");
  const [authMode, setAuthMode] = useState<AuthMode>("login");

  /* =====================================================
     AUTH STATES
  ===================================================== */

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] =
    useState("");

  const [loggedInUser, setLoggedInUser] = useState("");

  /* =====================================================
     ELIGIBILITY FORM STATES
  ===================================================== */

  const [formData, setFormData] = useState<FormData>(initialForm);

  const [matchedSchemes, setMatchedSchemes] = useState<Scheme[]>([]);

  /* =====================================================
     FORM UPDATE FUNCTION
  ===================================================== */

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  /* =====================================================
     LOGIN
  ===================================================== */

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!loginEmail || !loginPassword) {
      alert("Please enter email and password.");
      return;
    }

    setLoggedInUser(loginEmail);
    setAppStage("home");
  };

  /* =====================================================
     REGISTER
  ===================================================== */

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    if (!registerName || !registerEmail || !registerPassword) {
      alert("Please fill all required fields.");
      return;
    }

    if (registerPassword !== registerConfirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    setLoggedInUser(registerName);
    setAppStage("home");
  };

  /* =====================================================
     LOGOUT
  ===================================================== */

  const handleLogout = () => {
    setLoggedInUser("");
    setFormData(initialForm);
    setMatchedSchemes([]);
    setAppStage("landing");
  };

  /* =====================================================
     ELIGIBILITY CHECK
  ===================================================== */

  const handleCheckEligibility = (e: React.FormEvent) => {
  e.preventDefault();

  const age = Number(formData.age) || 0;
  const income = Number(formData.annualIncome) || 0;

  const results: Scheme[] = [];

  // Farmer related scheme
  if (
    formData.occupation === "Farmer" ||
    formData.occupation === "Agricultural Worker"
  ) {
    results.push(schemes[0]);
  }

  // Housing related scheme
  if (
    income <= 500000 ||
    formData.houseOwnership === "No house" ||
    formData.houseOwnership === "Rented"
  ) {
    results.push(schemes[1]);
  }

  // Health related scheme
  if (
    income <= 300000 ||
    formData.bplStatus === "Yes"
  ) {
    results.push(schemes[2]);
  }

  // Education related scheme
  if (
    formData.studentStatus === "Yes" ||
    age < 25
  ) {
    results.push(schemes[3]);
  }

  // Senior citizen / social security
  if (
    age >= 60 ||
    formData.seniorCitizen === "Yes" ||
    formData.widowSingleParent === "Yes"
  ) {
    results.push(schemes[4]);
  }

  // Remove duplicate schemes
  const uniqueResults = results.filter(
    (scheme, index, self) =>
      index === self.findIndex(
        (item) => item.name === scheme.name
      )
  );

  // If no exact match, still show useful possible schemes
  if (uniqueResults.length === 0) {
    uniqueResults.push(
      schemes[1],
      schemes[2]
    );
  }

  setMatchedSchemes(uniqueResults);

  // ⭐ MOST IMPORTANT
  setAppStage("results");
};

  /* =====================================================
     REUSABLE NAVBAR
  ===================================================== */

  const NavigationBar = () => {
    if (
      appStage === "landing" ||
      appStage === "auth"
    ) {
      return null;
    }

    return (
      <header className="sticky top-0 z-50 border-b border-[#ddd7cb] bg-[#f5f1e8]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">

          {/* Logo */}
          <button
            onClick={() => setAppStage("home")}
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#586b58] text-xl text-white shadow-sm">
              ⚖
            </div>

            <div className="text-left">
              <div className="font-bold tracking-tight text-[#30352f]">
                Scheme Assist
              </div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-[#7a8075]">
                Government Benefits
              </div>
            </div>
          </button>

          {/* Navigation */}
          <nav className="hidden items-center gap-7 md:flex">

            <button
              onClick={() => setAppStage("home")}
              className="text-sm font-medium text-[#4c534a] hover:text-[#586b58]"
            >
              Home
            </button>

            <button
              onClick={() => setAppStage("home")}
              className="text-sm font-medium text-[#4c534a] hover:text-[#586b58]"
            >
              Dashboard
            </button>

            <button
              onClick={() => setAppStage("eligibility")}
              className="text-sm font-medium text-[#4c534a] hover:text-[#586b58]"
            >
              Check Eligibility
            </button>

            <button
              onClick={() => {
                if (matchedSchemes.length > 0) {
                  setAppStage("results");
                } else {
                  setAppStage("eligibility");
                }
              }}
              className="text-sm font-medium text-[#4c534a] hover:text-[#586b58]"
            >
              Results
            </button>

          </nav>

          {/* User / Logout */}
          <div className="flex items-center gap-3">

            <span className="hidden text-sm text-[#666c63] sm:block">
              {loggedInUser}
            </span>

            <button
              onClick={handleLogout}
              className="rounded-xl border border-[#c9c2b5] px-4 py-2 text-sm font-semibold text-[#4d554b] transition hover:bg-[#e8e2d7]"
            >
              Logout
            </button>

          </div>
        </div>
      </header>
    );
  };

  /* =====================================================
     LANDING PAGE
  ===================================================== */

  if (appStage === "landing") {
    return (
      <div className="min-h-screen bg-[#f5f1e8] text-[#30352f]">

        <div className="flex min-h-screen flex-col items-center justify-center px-6">

          {/* Government Symbol */}
          <div className="mb-8 flex h-36 w-36 items-center justify-center rounded-full border-[3px] border-[#7b8176] bg-[#eee9de] shadow-[0_20px_50px_rgba(70,70,60,0.12)]">

            <div className="text-center">
              <div className="text-6xl">⚖</div>
              <div className="mt-1 text-[9px] font-bold uppercase tracking-[0.25em] text-[#697066]">
                Public Service
              </div>
            </div>

          </div>

          {/* Title */}
          <h1 className="text-center text-4xl font-extrabold tracking-tight text-[#30352f] sm:text-5xl">
            Scheme Assist
          </h1>

          <p className="mt-3 text-center text-sm text-[#74796f]">
            Government Scheme Eligibility Assistant
          </p>

          {/* Get Started */}
          <button
            onClick={() => setAppStage("auth")}
            className="mt-9 rounded-2xl bg-[#586b58] px-9 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#586b58]/20 transition hover:-translate-y-0.5 hover:bg-[#4d604d]"
          >
            Get Started →
          </button>

        </div>

      </div>
    );
  }

  /* =====================================================
     LOGIN / REGISTER PAGE
  ===================================================== */

  if (appStage === "auth") {
    return (
      <div className="min-h-screen bg-[#f5f1e8] text-[#30352f]">

        <div className="flex min-h-screen items-center justify-center px-5 py-10">

          <div className="w-full max-w-md">

            {/* Small Logo */}
            <div className="mb-7 text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#586b58] text-2xl text-white">
                ⚖
              </div>

              <h1 className="text-2xl font-bold">
                Scheme Assist
              </h1>

              <p className="mt-1 text-sm text-[#777b73]">
                Secure citizen access
              </p>
            </div>

            {/* Auth Card */}
            <div className="rounded-3xl border border-[#ded8cc] bg-[#faf8f3] p-7 shadow-[0_20px_60px_rgba(70,70,60,0.10)]">

              {/* Tabs */}
              <div className="mb-7 grid grid-cols-2 rounded-xl bg-[#eee9df] p-1">

                <button
                  onClick={() => setAuthMode("login")}
                  className={`rounded-lg py-2.5 text-sm font-semibold ${
                    authMode === "login"
                      ? "bg-[#faf8f3] text-[#586b58] shadow-sm"
                      : "text-[#777b73]"
                  }`}
                >
                  Login
                </button>

                <button
                  onClick={() => setAuthMode("register")}
                  className={`rounded-lg py-2.5 text-sm font-semibold ${
                    authMode === "register"
                      ? "bg-[#faf8f3] text-[#586b58] shadow-sm"
                      : "text-[#777b73]"
                  }`}
                >
                  Register
                </button>

              </div>

              {/* LOGIN */}
              {authMode === "login" && (
                <form
                  onSubmit={handleLogin}
                  className="space-y-5"
                >

                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      Email Address
                    </label>

                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(e) =>
                        setLoginEmail(e.target.value)
                      }
                      placeholder="Enter your email"
                      className="w-full rounded-xl border border-[#d6d0c5] bg-white px-4 py-3 outline-none focus:border-[#87947f] focus:ring-2 focus:ring-[#87947f]/20"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      Password
                    </label>

                    <input
                      type="password"
                      value={loginPassword}
                      onChange={(e) =>
                        setLoginPassword(e.target.value)
                      }
                      placeholder="Enter your password"
                      className="w-full rounded-xl border border-[#d6d0c5] bg-white px-4 py-3 outline-none focus:border-[#87947f] focus:ring-2 focus:ring-[#87947f]/20"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-[#586b58] py-3.5 font-bold text-white transition hover:bg-[#4d604d]"
                  >
                    Login
                  </button>

                  <p className="text-center text-xs text-[#8a8d86]">
                    Login to access your personalized scheme dashboard.
                  </p>

                </form>
              )}

              {/* REGISTER */}
              {authMode === "register" && (
                <form
                  onSubmit={handleRegister}
                  className="space-y-4"
                >

                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      Full Name
                    </label>

                    <input
                      type="text"
                      value={registerName}
                      onChange={(e) =>
                        setRegisterName(e.target.value)
                      }
                      placeholder="Enter your full name"
                      className="w-full rounded-xl border border-[#d6d0c5] bg-white px-4 py-3 outline-none focus:border-[#87947f]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      Email Address
                    </label>

                    <input
                      type="email"
                      value={registerEmail}
                      onChange={(e) =>
                        setRegisterEmail(e.target.value)
                      }
                      placeholder="Enter your email"
                      className="w-full rounded-xl border border-[#d6d0c5] bg-white px-4 py-3 outline-none focus:border-[#87947f]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      Password
                    </label>

                    <input
                      type="password"
                      value={registerPassword}
                      onChange={(e) =>
                        setRegisterPassword(e.target.value)
                      }
                      placeholder="Create a password"
                      className="w-full rounded-xl border border-[#d6d0c5] bg-white px-4 py-3 outline-none focus:border-[#87947f]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      Confirm Password
                    </label>

                    <input
                      type="password"
                      value={registerConfirmPassword}
                      onChange={(e) =>
                        setRegisterConfirmPassword(e.target.value)
                      }
                      placeholder="Confirm password"
                      className="w-full rounded-xl border border-[#d6d0c5] bg-white px-4 py-3 outline-none focus:border-[#87947f]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-[#586b58] py-3.5 font-bold text-white transition hover:bg-[#4d604d]"
                  >
                    Create Account
                  </button>

                </form>
              )}

            </div>

            <button
              onClick={() => setAppStage("landing")}
              className="mt-5 block w-full text-center text-sm text-[#777b73] hover:text-[#586b58]"
            >
              ← Back
            </button>

          </div>

        </div>

      </div>
    );
  }

  /* =====================================================
     HOME PAGE / DASHBOARD
  ===================================================== */

  if (appStage === "home") {
    return (
      <div className="min-h-screen bg-[#f5f1e8] text-[#30352f]">

        <NavigationBar />

        <main className="mx-auto max-w-7xl px-5 py-10">

          {/* Welcome */}
          <section className="rounded-3xl border border-[#ded8cc] bg-[#faf8f3] p-7 shadow-sm md:p-10">

            <div className="max-w-3xl">

              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#7c8678]">
                Citizen Dashboard
              </p>

              <h1 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">
                Welcome to Scheme Assist
              </h1>

              <p className="mt-4 leading-7 text-[#70766d]">
                Find government schemes that may be relevant to you,
                identify possible missed benefits, and understand the
                next steps for applying.
              </p>

              <button
                onClick={() => setAppStage("eligibility")}
                className="mt-7 rounded-xl bg-[#586b58] px-6 py-3.5 font-bold text-white shadow-md transition hover:bg-[#4d604d]"
              >
                Check My Eligibility →
              </button>

            </div>

          </section>

          {/* Dashboard Cards */}
          <section className="mt-8 grid gap-5 md:grid-cols-3">

            <div className="rounded-2xl border border-[#ded8cc] bg-[#faf8f3] p-6">
              <div className="text-3xl">✓</div>
              <h3 className="mt-4 font-bold">
                Eligibility Check
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#777b73]">
                Enter your details and check potentially relevant
                government schemes.
              </p>
              <button
  onClick={() => setAppStage("eligibility")}
  className="px-6 py-3 rounded-xl bg-[#6F7F72] text-white font-semibold hover:bg-[#5D6D60] transition"
>
  Check Now
</button>
            </div>

            <div className="rounded-2xl border border-[#ded8cc] bg-[#faf8f3] p-6">
              <div className="text-3xl">◎</div>
              <h3 className="mt-4 font-bold">
                Missed Benefits
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#777b73]">
                Discover benefits you may have missed based on your
                profile.
              </p>
             <button
  onClick={() => {
    if (matchedSchemes.length > 0) {
      setAppStage("results");
    } else {
      alert("Please complete the Eligibility Check first to discover your missed benefits.");
      setAppStage("eligibility");
    }
  }}
  className="mt-5 px-6 py-3 rounded-xl bg-[#8A7968] text-white font-semibold hover:bg-[#746555] transition"
>
  Explore Missed Benefits →
</button>
            </div>

            <div className="rounded-2xl border border-[#ded8cc] bg-[#faf8f3] p-6">
              <div className="text-3xl">▣</div>
              <h3 className="mt-4 font-bold">
                Application Guidance
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#777b73]">
                Understand documents and information generally needed
                for scheme applications.
              </p>
              <button
  onClick={() => {
    if (matchedSchemes.length > 0) {
      setAppStage("results");
    } else {
      alert("Please complete the Eligibility Check first to view application guidance.");
      setAppStage("eligibility");
    }
  }}
  className="mt-5 px-5 py-2.5 rounded-xl bg-[#6F7F72] text-white font-semibold hover:bg-[#5D6D60] transition"
>
  View Application Guidance →
</button>
            </div>

          </section>

          {/* Quick Action */}
          <section className="mt-8 rounded-2xl border border-[#d9d2c6] bg-[#e8e4d9] p-6">

            <h2 className="font-bold text-[#42483f]">
              Ready to find your benefits?
            </h2>

            <p className="mt-2 text-sm text-[#70766d]">
              Complete your citizen profile to get personalized
              scheme suggestions.
            </p>

            <button
              onClick={() => setAppStage("eligibility")}
              className="mt-5 rounded-xl border border-[#9da596] bg-[#f5f1e8] px-5 py-2.5 text-sm font-bold text-[#586b58] hover:bg-white"
            >
              Start Eligibility Check
            </button>

          </section>

        </main>

      </div>
    );
  }

  /* =====================================================
     ELIGIBILITY FORM
  ===================================================== */

  if (appStage === "eligibility") {
    return (
      <div className="min-h-screen bg-[#f5f1e8] text-[#30352f]">

        <NavigationBar />

        <main className="mx-auto max-w-6xl px-5 py-10">

          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#7c8678]">
              Eligibility Assessment
            </p>

            <h1 className="mt-2 text-3xl font-extrabold">
              Tell us about yourself
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-[#70766d]">
              These details help Scheme Assist compare your profile
              with government scheme eligibility conditions.
            </p>
          </div>

          <form
            onSubmit={handleCheckEligibility}
            className="space-y-7"
          >

            {/* =================================================
                PERSONAL DETAILS
            ================================================= */}

            <section className="rounded-3xl border border-[#ded8cc] bg-[#faf8f3] p-6 md:p-8">

              <h2 className="text-xl font-bold">
                1. Personal Details
              </h2>

              <p className="mt-1 text-sm text-[#7a7e76]">
                Basic information about the applicant.
              </p>

              <div className="mt-6 grid gap-5 md:grid-cols-2">

                <Field
                  label="Full Name *"
                  value={formData.fullName}
                  onChange={(v) => updateField("fullName", v)}
                  placeholder="Enter full name"
                />

                <Field
                  label="Age *"
                  type="number"
                  value={formData.age}
                  onChange={(v) => updateField("age", v)}
                  placeholder="Enter age"
                />

                <SelectField
                  label="Gender"
                  value={formData.gender}
                  onChange={(v) => updateField("gender", v)}
                  options={[
                    "Male",
                    "Female",
                    "Other",
                  ]}
                />

                <SelectField
                  label="Marital Status"
                  value={formData.maritalStatus}
                  onChange={(v) =>
                    updateField("maritalStatus", v)
                  }
                  options={[
                    "Single",
                    "Married",
                    "Widowed",
                    "Divorced",
                    "Separated",
                  ]}
                />

              </div>

            </section>

            {/* =================================================
                IDENTITY & SOCIAL CATEGORY
            ================================================= */}

            <section className="rounded-3xl border border-[#ded8cc] bg-[#faf8f3] p-6 md:p-8">

              <h2 className="text-xl font-bold">
                2. Identity & Social Category
              </h2>

              <div className="mt-6 grid gap-5 md:grid-cols-2">

                <SelectField
                  label="Aadhaar Available?"
                  value={formData.aadhaarAvailable}
                  onChange={(v) =>
                    updateField("aadhaarAvailable", v)
                  }
                  options={["Yes", "No"]}
                />

                <Field
                  label="Aadhaar Last 4 Digits"
                  value={formData.aadhaarLast4}
                  onChange={(v) =>
                    updateField("aadhaarLast4", v)
                  }
                  placeholder="Optional"
                  maxLength={4}
                />

                <SelectField
                  label="Social Category *"
                  value={formData.category}
                  onChange={(v) =>
                    updateField("category", v)
                  }
                  options={[
                    "General",
                    "OBC",
                    "SC",
                    "ST",
                    "EWS",
                    "Other",
                  ]}
                />

                <SelectField
                  label="Caste Certificate"
                  value={formData.casteCertificate}
                  onChange={(v) =>
                    updateField("casteCertificate", v)
                  }
                  options={[
                    "Available",
                    "Not Available",
                    "Not Applicable",
                  ]}
                />

                <SelectField
                  label="Disability Status"
                  value={formData.disability}
                  onChange={(v) =>
                    updateField("disability", v)
                  }
                  options={[
                    "Yes",
                    "No",
                  ]}
                />

                <SelectField
                  label="Disability Certificate"
                  value={formData.disabilityCertificate}
                  onChange={(v) =>
                    updateField("disabilityCertificate", v)
                  }
                  options={[
                    "Available",
                    "Not Available",
                    "Not Applicable",
                  ]}
                />

              </div>

            </section>

            {/* =================================================
                LOCATION
            ================================================= */}

            <section className="rounded-3xl border border-[#ded8cc] bg-[#faf8f3] p-6 md:p-8">

              <h2 className="text-xl font-bold">
                3. Address & Location
              </h2>

              <div className="mt-6 grid gap-5 md:grid-cols-2">

                <SelectField
                  label="State *"
                  value={formData.state}
                  onChange={(v) =>
                    updateField("state", v)
                  }
                  options={[
                    "Andhra Pradesh",
                    "Telangana",
                    "Karnataka",
                    "Tamil Nadu",
                    "Kerala",
                    "Maharashtra",
                    "Odisha",
                    "West Bengal",
                    "Gujarat",
                    "Rajasthan",
                    "Madhya Pradesh",
                    "Uttar Pradesh",
                    "Bihar",
                    "Delhi",
                    "Other",
                  ]}
                />

                <Field
                  label="District *"
                  value={formData.district}
                  onChange={(v) =>
                    updateField("district", v)
                  }
                  placeholder="Enter district"
                />

                <Field
                  label="Town / Village"
                  value={formData.town}
                  onChange={(v) =>
                    updateField("town", v)
                  }
                  placeholder="Enter town or village"
                />

                <Field
                  label="Pincode"
                  value={formData.pincode}
                  onChange={(v) =>
                    updateField("pincode", v)
                  }
                  placeholder="Enter 6-digit pincode"
                  maxLength={6}
                />

                <SelectField
                  label="Area Type"
                  value={formData.ruralUrban}
                  onChange={(v) =>
                    updateField("ruralUrban", v)
                  }
                  options={[
                    "Rural",
                    "Urban",
                  ]}
                />

              </div>

            </section>

            {/* =================================================
                ECONOMIC DETAILS
            ================================================= */}

            <section className="rounded-3xl border border-[#ded8cc] bg-[#faf8f3] p-6 md:p-8">

              <h2 className="text-xl font-bold">
                4. Economic & Employment Details
              </h2>

              <div className="mt-6 grid gap-5 md:grid-cols-2">

                <Field
                  label="Annual Family Income *"
                  type="number"
                  value={formData.annualIncome}
                  onChange={(v) =>
                    updateField("annualIncome", v)
                  }
                  placeholder="Enter annual income in ₹"
                />

                <SelectField
                  label="Occupation *"
                  value={formData.occupation}
                  onChange={(v) =>
                    updateField("occupation", v)
                  }
                  options={[
                    "Farmer",
                    "Agricultural Worker",
                    "Student",
                    "Government Employee",
                    "Private Employee",
                    "Self Employed",
                    "Daily Wage Worker",
                    "Business",
                    "Unemployed",
                    "Other",
                  ]}
                />

                <SelectField
                  label="Employment Status"
                  value={formData.employmentStatus}
                  onChange={(v) =>
                    updateField("employmentStatus", v)
                  }
                  options={[
                    "Employed",
                    "Self Employed",
                    "Unemployed",
                    "Student",
                    "Retired",
                  ]}
                />

                <Field
                  label="Family Size *"
                  type="number"
                  value={formData.familySize}
                  onChange={(v) =>
                    updateField("familySize", v)
                  }
                  placeholder="Number of family members"
                />

                <SelectField
                  label="BPL Status"
                  value={formData.bplStatus}
                  onChange={(v) =>
                    updateField("bplStatus", v)
                  }
                  options={[
                    "Yes",
                    "No",
                    "Not Sure",
                  ]}
                />

              </div>

            </section>

            {/* =================================================
                FAMILY / SPECIAL STATUS
            ================================================= */}

            <section className="rounded-3xl border border-[#ded8cc] bg-[#faf8f3] p-6 md:p-8">

              <h2 className="text-xl font-bold">
                5. Family & Special Conditions
              </h2>

              <div className="mt-6 grid gap-5 md:grid-cols-2">

                <SelectField
                  label="House Ownership"
                  value={formData.houseOwnership}
                  onChange={(v) =>
                    updateField("houseOwnership", v)
                  }
                  options={[
                    "Own house",
                    "Rented",
                    "No house",
                  ]}
                />

                <SelectField
                  label="Student"
                  value={formData.studentStatus}
                  onChange={(v) =>
                    updateField("studentStatus", v)
                  }
                  options={[
                    "Yes",
                    "No",
                  ]}
                />

                <SelectField
                  label="Senior Citizen"
                  value={formData.seniorCitizen}
                  onChange={(v) =>
                    updateField("seniorCitizen", v)
                  }
                  options={[
                    "Yes",
                    "No",
                  ]}
                />

                <SelectField
                  label="Widow / Single Parent"
                  value={formData.widowSingleParent}
                  onChange={(v) =>
                    updateField("widowSingleParent", v)
                  }
                  options={[
                    "Yes",
                    "No",
                  ]}
                />

              </div>

            </section>

            {/* =================================================
                DOCUMENTS
            ================================================= */}

            <section className="rounded-3xl border border-[#ded8cc] bg-[#faf8f3] p-6 md:p-8">

              <h2 className="text-xl font-bold">
                6. Supporting Documents
              </h2>

              <p className="mt-1 text-sm text-[#7a7e76]">
                We only ask whether documents are available.
                Do not enter sensitive document numbers here.
              </p>

              <div className="mt-6 grid gap-5 md:grid-cols-2">

                <SelectField
                  label="Income Certificate"
                  value={formData.incomeCertificate}
                  onChange={(v) =>
                    updateField("incomeCertificate", v)
                  }
                  options={[
                    "Available",
                    "Not Available",
                  ]}
                />

                <SelectField
                  label="Residence Certificate"
                  value={formData.residenceCertificate}
                  onChange={(v) =>
                    updateField("residenceCertificate", v)
                  }
                  options={[
                    "Available",
                    "Not Available",
                  ]}
                />

              </div>

            </section>

            {/* =================================================
                INFORMATION BOX
            ================================================= */}

            <div className="rounded-2xl border border-[#d6d0c4] bg-[#e8e4d9] p-5">

              <div className="flex gap-3">

                <div className="text-xl">
                  ⓘ
                </div>

                <div>
                  <h3 className="font-bold">
                    Why do we need this information?
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-[#70766d]">
                    Your details are used to compare your profile
                    with scheme eligibility conditions. This prototype
                    provides guidance and does not itself submit a
                    government application.
                  </p>
                </div>

              </div>

            </div>

            {/* =================================================
                SUBMIT
            ================================================= */}

            <div className="flex justify-center pb-10">

              <button
                type="submit"
                className="rounded-2xl bg-[#586b58] px-10 py-4 text-sm font-bold text-white shadow-lg shadow-[#586b58]/20 transition hover:-translate-y-0.5 hover:bg-[#4d604d]"
              >
                Check My Eligibility →
              </button>

            </div>

          </form>

        </main>

      </div>
    );
  }

  /* =====================================================
     RESULTS PAGE
  ===================================================== */

  if (appStage === "results") {
    return (
      <div className="min-h-screen bg-[#f5f1e8] text-[#30352f]">

        <NavigationBar />

        <main className="mx-auto max-w-7xl px-5 py-10">

          {/* Header */}
          <section className="rounded-3xl border border-[#ded8cc] bg-[#faf8f3] p-7 md:p-9">

            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#7c8678]">
              Eligibility Results
            </p>

            <h1 className="mt-2 text-3xl font-extrabold">
              Schemes that may be relevant to you
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-[#70766d]">
              Based on the information you provided, these schemes
              may be worth checking further. Final eligibility is
              determined by the concerned government department.
            </p>
            {/* APPLICATION GUIDANCE */}
<section className="mt-8">
  <div className="rounded-2xl border border-[#ded8cc] bg-[#faf8f3] p-6">

    <div className="flex items-center gap-3">
      <div className="h-11 w-11 rounded-xl bg-[#e8e4da] flex items-center justify-center text-xl">
        📋
      </div>

      <div>
        <h2 className="text-xl font-bold text-[#30352f]">
          Application Guidance
        </h2>

        <p className="text-sm text-[#777b73] mt-1">
          Follow these steps to apply for the recommended government schemes.
        </p>
      </div>
    </div>

    <div className="mt-6 space-y-4">

      {/* Step 1 */}
      <div className="flex gap-4">
        <div className="h-9 w-9 shrink-0 rounded-full bg-[#6f7f72] text-white flex items-center justify-center font-semibold">
          1
        </div>

        <div>
          <h3 className="font-semibold text-[#30352f]">
            Check Eligibility
          </h3>

          <p className="text-sm text-[#777b73] mt-1">
            Review the eligibility conditions of the selected government scheme.
          </p>
        </div>
      </div>

      {/* Step 2 */}
      <div className="flex gap-4">
        <div className="h-9 w-9 shrink-0 rounded-full bg-[#6f7f72] text-white flex items-center justify-center font-semibold">
          2
        </div>

        <div>
          <h3 className="font-semibold text-[#30352f]">
            Prepare Required Documents
          </h3>

          <p className="text-sm text-[#777b73] mt-1">
            Keep Aadhaar, income certificate, caste certificate, bank details
            and other required documents ready.
          </p>
        </div>
      </div>

      {/* Step 3 */}
      <div className="flex gap-4">
        <div className="h-9 w-9 shrink-0 rounded-full bg-[#6f7f72] text-white flex items-center justify-center font-semibold">
          3
        </div>

        <div>
          <h3 className="font-semibold text-[#30352f]">
            Submit Application
          </h3>

          <p className="text-sm text-[#777b73] mt-1">
            Submit your application through the official government portal
            or the designated government office.
          </p>
        </div>
      </div>

      {/* Step 4 */}
      <div className="flex gap-4">
        <div className="h-9 w-9 shrink-0 rounded-full bg-[#6f7f72] text-white flex items-center justify-center font-semibold">
          4
        </div>

        <div>
          <h3 className="font-semibold text-[#30352f]">
            Track Application Status
          </h3>

          <p className="text-sm text-[#777b73] mt-1">
            Save your application or reference number and use it to track
            the application status.
          </p>
        </div>
      </div>

    </div>

    <button
      onClick={() => setAppStage("home")}
      className="mt-6 rounded-xl bg-[#6f7f72] px-6 py-3 text-white font-semibold hover:bg-[#5d6d60] transition"
    >
      Back to Home
    </button>

  </div>
</section>

          </section>

          {/* Summary */}
          <section className="mt-6 grid gap-5 md:grid-cols-3">

            <div className="rounded-2xl border border-[#ded8cc] bg-[#faf8f3] p-6">
              <div className="text-sm text-[#777b73]">
                Applicant
              </div>

              <div className="mt-2 text-lg font-bold">
                {formData.fullName}
              </div>
            </div>

            <div className="rounded-2xl border border-[#ded8cc] bg-[#faf8f3] p-6">
              <div className="text-sm text-[#777b73]">
                Potential Matches
              </div>

              <div className="mt-2 text-2xl font-extrabold text-[#586b58]">
                {matchedSchemes.length}
              </div>
            </div>

            <div className="rounded-2xl border border-[#ded8cc] bg-[#faf8f3] p-6">
              <div className="text-sm text-[#777b73]">
                Location
              </div>

              <div className="mt-2 font-bold">
                {formData.district}, {formData.state}
              </div>
            </div>

          </section>

          {/* Scheme Results */}
          <section className="mt-8">

            <h2 className="text-2xl font-bold">
              Recommended Schemes
            </h2>

            <div className="mt-5 grid gap-5 lg:grid-cols-2">

              {matchedSchemes.map((scheme, index) => (

                <div
                  key={`${scheme.name}-${index}`}
                  className="rounded-3xl border border-[#ded8cc] bg-[#faf8f3] p-6 shadow-sm"
                >

                  <div className="flex items-start justify-between gap-4">

                    <div>

                      <span className="inline-block rounded-full bg-[#e5e9df] px-3 py-1 text-xs font-bold text-[#586b58]">
                        {scheme.category}
                      </span>

                      <h3 className="mt-4 text-xl font-extrabold">
                        {scheme.name}
                      </h3>

                    </div>

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e5e9df] text-[#586b58]">
                      ✓
                    </div>

                  </div>

                  <p className="mt-4 text-sm leading-6 text-[#70766d]">
                    {scheme.description}
                  </p>

                  <div className="mt-5 rounded-2xl bg-[#eeeae1] p-4">

                    <div className="text-xs font-bold uppercase tracking-wider text-[#7c8378]">
                      Why it appeared
                    </div>

                    <p className="mt-2 text-sm leading-6 text-[#5e645b]">
                      {scheme.reason}
                    </p>

                  </div>

                  <div className="mt-4">

                    <div className="text-xs font-bold uppercase tracking-wider text-[#7c8378]">
                      Possible benefit
                    </div>

                    <p className="mt-1 text-sm text-[#5e645b]">
                      {scheme.benefit}
                    </p>

                  </div>

                  <button
                    onClick={() =>
                      alert(
                        `Application guidance for ${scheme.name} will be connected here.`
                      )
                    }
                    className="mt-6 rounded-xl border border-[#aeb6a7] bg-[#f5f1e8] px-5 py-2.5 text-sm font-bold text-[#586b58] hover:bg-white"
                  >
                    View Application Guidance →
                  </button>

                </div>

              ))}

            </div>

          </section>

          {/* Bottom Actions */}
          <section className="mt-8 flex flex-col justify-between gap-4 rounded-2xl border border-[#ded8cc] bg-[#faf8f3] p-6 sm:flex-row sm:items-center">

            <div>
              <h3 className="font-bold">
                Want to update your information?
              </h3>

              <p className="mt-1 text-sm text-[#777b73]">
                You can change your details and run the eligibility
                check again.
              </p>
            </div>

            <button
              onClick={() => setAppStage("eligibility")}
              className="rounded-xl bg-[#586b58] px-5 py-3 text-sm font-bold text-white"
            >
              Edit & Check Again
            </button>

          </section>

        </main>

      </div>
    );
  }

  return null;
}

/* =========================================================
   REUSABLE INPUT COMPONENT
========================================================= */

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  maxLength?: number;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-[#444a42]">
        {label}
      </label>

      <input
        type={type}
        value={value}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-[#d6d0c5] bg-white px-4 py-3 text-sm text-[#30352f] outline-none transition placeholder:text-[#a1a49d] focus:border-[#87947f] focus:ring-2 focus:ring-[#87947f]/20"
      />
    </div>
  );
}

/* =========================================================
   REUSABLE SELECT COMPONENT
========================================================= */

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-[#444a42]">
        {label}
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-[#d6d0c5] bg-white px-4 py-3 text-sm text-[#30352f] outline-none transition focus:border-[#87947f] focus:ring-2 focus:ring-[#87947f]/20"
      >
        <option value="">
          Select an option
        </option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}