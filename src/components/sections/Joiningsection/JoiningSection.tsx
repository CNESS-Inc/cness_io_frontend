import Button from "../../ui/Button";
import joinImage from "../../../assets/join-team.png";
import SignupModel from "../../OnBoarding/Signup";
//import { useNavigate } from "react-router-dom";
import {  useState } from "react";

export default function JoiningSection()
  { 
    //const loggedIn = localStorage.getItem("jwt") !== null;
    //const redirectPath = loggedIn ? "/dashboard" : "/sign-up";
      const [openSignup, setOpenSignup] = useState(false);
    //const navigate = useNavigate();
  return (
    <section className="flex flex-col items-center relative w-full ">
      <div className="relative w-full  lg:h-[350px] md:h-[350px] h-[420px] overflow-hidden rounded-xl">
      
        <div className=" sm:flex gap-[53.5px] top-2 left-0 inline-flex items-center absolute opacity-50 join-section-bg">
          <div className="bg-[#00D2FF] relative w-[480px] h-[365px] rounded-[182.5px] blur-[175px] bg-first" />
          <div className="bg-[#6340FF] relative w-[450px] h-[365px] rounded-[182.5px] blur-[175px] bg-second"  />
          <div className="bg-[#FF994A] relative w-[520px] h-[365px] rounded-[182.5px] blur-[175px] bg-third" />
        </div>

      
        <div className="absolute inset-0">
          <img
            className="absolute h-full lg:right-0 md:right-0 -right-40"
            src={joinImage}
            alt=""
            role="presentation"
          />
        </div>

       
        <div className="flex flex-col h-full justify-center items-center sm:items-start gap-6 sm:gap-8 p-6 sm:p-0  -translate-x-[50%] w-full max-w-4xl mx-auto sm:mx-0 absolute top-5 left-[50%] lg:top-[50%] lg:-translate-y-[50%] md:top-[50%] md:-translate-y-[50%] ">
          <div className="flex flex-col items-center sm:items-start gap-3 w-full text-center sm:text-left">
            <h2 style={{ fontFamily: "Poppins, sans-serif" }}
            className=" font-medium text-[#2a2a2a] text-center text-2xl sm:text-3xl md:text-[42px] tracking-normal sm:tracking-[0] leading-[1.3] sm:leading-[50px] w-full">
             Start Your Journey from Loneliness to 
             <br />
             Wholeness to Recognition
            </h2>
            <p className="text-center w-full font-['Open Sans'] font-light text-[16px] leading-[24.38px] text-[#242424] tracking-[0px]">
              Join a movement that sees you, supports you, and helps your conscious work shine.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-[15px] w-full joining-btn ">
           
            <Button
               variant="gradient-primary"
              className="font-['Open_Sans'] font-medium 
    w-fit rounded-[100px] h-[42px]
    py-1 px-8 self-stretch
    text-[16px] leading-[100%] tracking-[0]
    text-center "
              onClick={()  => setOpenSignup(true)}>
              Create Your Profile
            </Button>

            {/*<Button
              variant="outline"
              className="jakarta bg-white h-[42px] border-[#2222241a] px-4 sm:px-6 py-1 sm:py-1 rounded-[100px] text-[#222224] font-medium text-[14px] w-full sm:w-auto"
              onClick={() => window.location.href = redirectPath}>
              Join the Comunity
            </Button>
             <Button
              variant="outline"
              className="jakarta bg-white lg:w-[152px] md:w-[152px] w-full h-[42px] border-[#2222241a] px-4 sm:px-6 py-1 sm:py-1 rounded-[100px] text-[#222224] font-medium text-[14px] "
             onClick={() => window.location.href = redirectPath} >
              Get Certified
            </Button>*/}
          </div>
        </div>
      </div>
      
              {/* Signup Popup Modal */}
              <SignupModel open={openSignup} onClose={() => setOpenSignup(false)} />
    </section>
  );
}
