// SignupModal.tsx
import React, { useState } from "react";
import PopupOnboardingModal from "../ui/OnBoardingModel";
import { Check } from "lucide-react";
//import ReCAPTCHA from "react-google-recaptcha";


type SignupModalProps = {
  open: boolean;
  onClose: () => void;
  onSignup?: (data: { email: string; password: string; referral?: string }) => void;
  onGoogle?: () => void;
};

export default function SignupModal({ open, onClose, onSignup, onGoogle }: SignupModalProps) {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [pwd2, setPwd2] = useState("");
  const [ref, setRef] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pwd !== pwd2) {
      alert("Passwords do not match.");
      return;
    }
    onSignup?.({ email, password: pwd, referral: ref });
  };
//const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY; // or process.env...

  return (
    <PopupOnboardingModal open={open} onClose={onClose}>
      {/* Right-side content only */}
      <h1
  className="text-center font-[Poppins] font-medium text-[32px] leading-[100%] tracking-[-0.03em] text-gray-900"
>
  Create a Free Account
</h1>

<ul className="mt-4 flex justify-center items-center gap-6 text-sm text-gray-600">
<li className="flex items-center gap-2 font-[Open_Sans] font-normal text-[14px] leading-[100%] tracking-[0px] text-gray-700">
  <Check className="h-6 w-6 stroke-[3px] text-green-500" />
            Forever Free plan 
        </li>
<li className="flex items-center gap-2 font-[Open_Sans] font-normal text-[14px] leading-[100%] tracking-[0px] text-gray-700">
  <Check className="h-6 w-6 stroke-[3px] text-green-500" />
            Setup in minutes</li>
      </ul>

      <button
        type="button"
        onClick={onGoogle}
        className="mt-6 w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-800 shadow-sm hover:bg-gray-50"
      >
<span
  className="
    inline-flex items-center gap-3
    font-inter font-medium
    text-[14px] leading-[20px] tracking-[0]
    text-gray-900
  "
>
  <img
    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
    alt="Google"
    className="h-5 w-5"
  />
  Register with Google
</span>
      </button>

      {/* Divider */}
     <div
  className="
    my-6 flex items-center
    w-[415px] h-[19px]
    gap-[20px]
    text-[14px] leading-[100%] tracking-[0]
    font-['Open_Sans'] font-normal
    text-gray-500
  "
>
  <div className="h-px w-full bg-gray-200" />
  <span className="whitespace-nowrap">Or sign up with</span>
  <div className="h-px w-full bg-gray-200" />
</div>
      <form className="grid grid-cols-1 gap-4" onSubmit={submit}>
        {/* Email */}
    <label className="block">
  <span className="block mb-1 font-['Poppins'] font-medium text-[12px] leading-[100%] tracking-[0] text-[#000000]">
    Email
  </span>
  <input
    type="email"
    required
    placeholder="Enter your email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    className="
      w-[415px] h-[53px]
      rounded-[4px] border-2 border-gray-200
      px-[10px]  /* pr + pl = 10px */
      outline-none
      text-[14px] leading-[20px]
      placeholder:text-gray-400
     
    "
  />
</label>

        {/* Passwords */}
       <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
  <label className="block">
    <span className="block mb-1 font-['Poppins'] font-medium text-[12px] leading-[100%] tracking-[0] text-[#000000]">
      Password
    </span>
    <input
      type="password"
      required
      placeholder="Type your password"
      value={pwd}
      onChange={(e) => setPwd(e.target.value)}
      className="
        w-[195.5px] h-[53px]
        rounded-[4px] border-2 border-gray-200
        px-[10px]
        outline-none
        text-[14px] leading-[20px]
        placeholder:text-gray-400
       
      "
    />
  </label>

  <label className="block">
    <span className="block mb-1 font-['Poppins'] font-medium text-[12px] leading-[100%] tracking-[0] text-[#000000]">
      Re-type Password
    </span>
    <input
      type="password"
      required
      placeholder="Re-type your password"
      value={pwd2}
      onChange={(e) => setPwd2(e.target.value)}
      className="
        w-[195.5px] h-[53px]
        rounded-[4px] border-2 border-gray-200
        px-[10px]
        outline-none
        text-[14px] leading-[20px]
        placeholder:text-gray-400
        
      "
    />
  </label>
</div>

<p
  className="
    font-['Poppins'] font-normal
    text-[9px] leading-[100%] tracking-[0]
    text-gray-500
  "
>          Password must be at least 8 characters with uppercase, number, and special character
        </p>

        {/* Referral + CAPTCHA placeholder */}
       <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto]">
  {/* Referral Code */}
  <label className="block">
    <span className="block mb-1 font-['Poppins'] font-medium text-[12px] leading-[100%] tracking-[0] text-[#000000]">
      Referral code (optional)
    </span>
    <input
      type="text"
      placeholder="Enter your referral code"
      value={ref}
      onChange={(e) => setRef(e.target.value)}
      className="
        w-[202.5px] h-[53px]
        rounded-[4px] border-2 border-gray-200
        px-[10px]
        outline-none
        text-[14px] leading-[20px]
        placeholder:text-gray-400
       
      "
    />
  </label>

  {/* CAPTCHA */}
<div className="mt-6 md:mt-4 grid place-items-center w-[174px] h-[51px] rounded-[10px] border-2 border-gray-200 bg-white overflow-hidden">
  <div className="w-full h-full bg-gray-100 px-3 flex items-center justify-between">
    <span className="inline-flex items-center gap-2">
      <span className="inline-block h-4 w-4 rounded-[3px] border-2 border-gray-400 bg-white shadow-inner" />
      <span className="font-['Poppins'] text-[12px] leading-[20px] text-gray-700">CAPTCHA</span>
    </span>
    <img src="/recaptcha-icon.svg" alt="reCAPTCHA" className="h-6 w-6 object-contain shrink-0" />
  </div>
</div>
</div>

        {/* Submit */}
        <button
          type="submit"
          className="mt-2 w-full rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-6 py-3 text-white shadow-md hover:opacity-95"
        >
          Sign up
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <a className="font-medium text-fuchsia-600 hover:underline" href="#">
          Login
        </a>
      </p>
    </PopupOnboardingModal>
  );
}
