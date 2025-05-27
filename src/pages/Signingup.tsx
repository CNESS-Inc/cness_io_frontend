
import SignupAnimation  from "../components/ui/SignupAnimation"; // adjust path

export default function Signingup() {
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
      <div className="z-10 w-full flex justify-center items-center px-4 py-1">
<div className="w-full max-w-[600px] min-h-[550px] bg-white rounded-2xl shadow-xl px-6 sm:px-10 py-10 sm:py-12 space-y-12">
    <h2 className="text-3xl font-bold text-gray-900">
            Sign up your account
          </h2>

          <form className="space-y-4">

   <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="email"
                placeholder="Enter your Username"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#7F57FC] focus:border-[#7F57FC]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                placeholder="Enter your Email"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#7F57FC] focus:border-[#7F57FC]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                placeholder="Enter your Password"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#7F57FC] focus:border-[#7F57FC]"
                
              />
               <label className="block text-sm font-sm text-gray-500">Password must be at least 8 characters with uppercase, number, and special character</label>
            </div>

                <div>
              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm your Password"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#7F57FC] focus:border-[#7F57FC]"
                />
            
            </div>

<div className="mt-2 flex flex-col sm:flex-row sm:items-center justify-center text-sm gap-2 sm:gap-2">
   <label className="flex items-center gap-2">Already have an account?  </label>
    <a href="#" className="text-[#7F57FC] hover:underline">Login</a>
  </div>

<div className="flex justify-end gap-4 mt-6">
  <button
    type="submit"
    className="w-[150px] h-[50px] text-white font-semibold rounded-full shadow-md transition duration-300 
               bg-gradient-to-r from-blue-500 to-purple-500 
               hover:blue-500 hover:to-blue-500"
  >
    Sign Up
  </button>

  <button
    type="button"
    className="w-[150px] h-[50px] text-white font-semibold rounded-full shadow-md transition duration-300 
               bg-gradient-to-r from-blue-500 to-purple-500 
               hover:from-blue-500 hover:to-blue-500"
  >
    Cancel
  </button>
</div>

       
          </form>
        </div>
      </div>
    </div>
  );
}