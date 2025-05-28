
import SignupAnimation  from "../components/ui/SignupAnimation"; // adjust path


export default function Login() {
  return (
    
 
<div className="relative min-h-screen flex flex-col overflow-hidden bg-white">
  <div className="relative w-full h-[250px]">
    {/* Diagonal Gradient Background */}
    <div className="hidden lg:block absolute top-0 left-0 w-full h-[600px] z-0">
      <div
        className="absolute top-0 left-0 w-full h-full"
        style={{
          //background: "linear-gradient(135deg, #7F57FC, #F07EFF, #7FD9F2)",
          clipPath: "polygon(0 0, 100% 0, 100% 40%, 0% 100%)",
        }}
        
      />
        <SignupAnimation />
    </div>

    <div className="absolute top-40 left-10 z-10">
      <h1 className="text-white text-4xl font-bold">CNESS</h1>
    </div>
  </div>

      {/* Sign In Form */}
      <div className="z-10 w-full flex justify-center items-center px-10 py-5">
<div className="w-full max-w-[600px] min-h-[550px] bg-white rounded-2xl shadow-xl px-6 sm:px-10 py-10 sm:py-12 space-y-12">
    <h2 className="text-3xl font-bold text-gray-900">
            Sign in to your account
          </h2>

          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#7F57FC] focus:border-[#7F57FC]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                placeholder="********"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#7F57FC] focus:border-[#7F57FC]"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-gray-300" />
                <span className="text-gray-600">Remember me on this device</span>
              </label>
              <a href="#" className="text-[#7F57FC] hover:underline">
               Trouble logging in? Reset password
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 via-purple-700 to-blue-600 text-white font-semibold py-2 rounded-full shadow-md transition duration-200 hover:from-blue-500 hover:to-blue-500"
            >
              Sign in
            </button>

            <div className="text-center text-sm text-gray-500">OR</div>

           
            <p className="text-center text-sm text-gray-600 mt-4">
              New to Cness?{" "}
              <a href="#" className="text-[#7F57FC] font-medium hover:underline">
                Create account
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}