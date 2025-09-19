// LoginModalStatic.tsx
import PopupOnboardingModal from "../ui/OnBoardingModel";
import { Check } from "lucide-react";

type Props = { open: boolean; onClose: () => void };

export default function LoginModal({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <PopupOnboardingModal open={open} onClose={onClose}>
      {/* Right-side static content */}
      <div className="mx-auto w-full max-w-[460px] mt-15">
        <h1 className="text-center font-[Poppins] font-medium text-[32px] leading-[100%] tracking-[-0.03em] text-gray-900">
          Sign in to your account
        </h1>

        <ul className="mt-4 flex justify-center items-center gap-6 text-sm text-gray-600">
          <li className="flex items-center gap-2 font-['Open_Sans'] text-[14px] leading-[100%] text-gray-700">
            <Check className="h-6 w-6 stroke-[3px] text-green-500" />
            Securely access your dashboard anytime, anywhere.
          </li>
        </ul>

        {/* Google button (static) */}
        <button
          type="button"
          className="mt-6 w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-800 shadow-sm hover:bg-gray-50"
        >
          <span className="inline-flex items-center gap-3 font-inter font-medium text-[14px] leading-[20px] text-gray-900">
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              className="h-5 w-5"
            />
            Register with Google
          </span>
        </button>

        {/* Divider */}
        <div className="my-6 flex items-center gap-5 text-[14px] font-['Open_Sans'] text-gray-500">
          <div className="h-px w-full bg-gray-200" />
          <span className="whitespace-nowrap">Or sign in with</span>
          <div className="h-px w-full bg-gray-200" />
        </div>

        {/* Email / Password (static) */}
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <label className="block">
            <span className="block mb-1 font-['Poppins'] font-medium text-[12px] text-[#000000]">
              Email
            </span>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full h-[45px] rounded-[4px] border-2 border-gray-200 px-[10px] outline-none text-[14px] placeholder:text-gray-400"
            />
          </label>

          <label className="block">
            <span className="block mb-1 font-['Poppins'] font-medium text-[12px] text-[#000000]">
              Password
            </span>
            <input
              type="password"
              placeholder="Type your password"
              className="w-full h-[45px] rounded-[4px] border-2 border-gray-200 px-[10px] outline-none text-[14px] placeholder:text-gray-400"
            />
          </label>

          <div className="flex items-center justify-between text-[13px]">
            <label className="inline-flex items-center gap-2 select-none">
              <input type="checkbox" className="accent-[#6750A4] w-4 h-4" defaultChecked />
              <span className="font-poppins font-normal text-[12px] leading-[100%] tracking-[0px] text-[#64748B]">Remember me on this device</span>
            </label>

            <a href="#" className="font-['Open_Sans'] font-semibold text-[12px] leading-[24.4px] tracking-[0px] text-right align-middle bg-gradient-to-r from-[#7077FE] to-[#F07EFF] bg-clip-text text-transparent hover:underline">
              Reset password
            </a>
          </div>

          {/* Primary action (static) */}
          <button
            type="button"
            className="mt-1 w-full rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 h-[42px] px-6 text-white text-[14px] shadow-md hover:opacity-95"
          >
            Sign up
          </button>
        </form>

        <p className="mt-4 text-center font-poppins font-normal text-[13px] leading-[100%] tracking-[0px] text-[#64748B]">
          New to CNESS?{" "}
          <a href="#" className="font-poppins font-semibold text-[13px] leading-[100%] tracking-[0px] text-[#D748EA] underline underline-offset-[2px] decoration-solid hover:opacity-80">
            Create account
          </a>
        </p>
      </div>
    </PopupOnboardingModal>
  );
}
