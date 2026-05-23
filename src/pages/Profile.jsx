import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { User, Mail, Phone, MapPin, Lock, CheckCircle } from "lucide-react";
import api from "../api/interceptor";
import NotLoggedIn from "../components/NotLoggedIn";

/* ── Field component ───────────────────────────── */
const Field = ({ icon: Icon, label, name, type = "text", value, onChange, placeholder }) => (
  <div className="group">
    <label className="block text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-1.5">
      {label}
    </label>
    <div className="relative">
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-amber-500 transition-colors">
        <Icon size={15} />
      </span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2.5 text-[14px] bg-gray-50 border border-gray-200 rounded-lg
                   focus:outline-none focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-50
                   text-gray-800 placeholder:text-gray-300 transition-all duration-200"
      />
    </div>
  </div>
);

/* ── Not Logged In ─────────────────────────────── */


/* ── Profile Form ──────────────────────────────── */
export default function Profile() {
  const { userData } = useOutletContext();
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    name:     userData?.name     || "",
    email:    userData?.email    || "",
    phone:    userData?.phone    || "",
    password: "",
  });

  if (!userData) return <NotLoggedIn />;

  const handleChange = (e) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: call your API here
    try {
      api.put(`user/${userData._id}`,form)
    } catch (error) {
      console.log("Profile update error")
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const initials = form.name
    ? form.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap');
        .pf-title { font-family: 'Playfair Display', Georgia, serif; }
        @keyframes floatIn { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        .fi  { animation: floatIn 0.45s ease both; }
        .fi2 { animation: floatIn 0.45s 0.08s ease both; }
        .fi3 { animation: floatIn 0.45s 0.16s ease both; }
        @keyframes pop { 0%,100%{transform:scale(1)} 50%{transform:scale(1.06)} }
        .pop { animation: pop 0.3s ease; }
      `}</style>

      <div className="max-w-xl mx-auto px-4 pb-20 pt-8">

        {/* ── Avatar header ── */}
        <div className="fi flex flex-col items-center mb-8">
          <div className="relative group">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-300 flex items-center justify-center text-white text-2xl font-bold shadow-md select-none">
              {userData?.avatar
                ? <img src={userData.avatar} alt="avatar" className="w-full h-full rounded-full object-cover" />
                : initials}
            </div>
          </div>
          <h2 className="pf-title text-2xl font-bold text-gray-900 mt-4">{form.name || "Your Profile"}</h2>
          <p className="text-[12px] text-gray-400 mt-0.5">{form.email}</p>
        </div>

        {/* ── Divider ── */}
        <div className="fi flex items-center gap-3 mb-7">
          <div className="h-px flex-1 bg-gray-100" />
          <span className="text-amber-400 text-[10px]">◆</span>
          <div className="h-px flex-1 bg-gray-100" />
        </div>

        {/* ── Form ── */}
        <form onSubmit={handleSubmit} className="fi2 space-y-4">
          <Field icon={User}    label="Full Name"    name="name"     value={form.name}     onChange={handleChange} placeholder="John Doe" />
          <Field icon={Mail}    label="Email"        name="email"    type="email" value={form.email}    onChange={handleChange} placeholder="you@example.com" />
          <Field icon={Phone}   label="Phone"        name="phone"    type="tel"   value={form.phone}    onChange={handleChange} placeholder="+91 00000 00000" />
          <Field icon={Lock}    label="New Password" name="password" type="password" value={form.password} onChange={handleChange} placeholder="Leave blank to keep current" />

          {/* ── Save button ── */}
          <div className="fi3 pt-2">
            <button
              type="submit"
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[14px] font-semibold transition-all duration-200 active:scale-[0.98]
                ${saved
                  ? 'bg-green-50 border border-green-200 text-green-600'
                  : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
            >
              {saved
                ? <><CheckCircle size={16} className="text-green-500" /> Saved!</>
                : 'Save Changes'
              }
            </button>
          </div>
        </form>
      </div>
    </>
  );
}