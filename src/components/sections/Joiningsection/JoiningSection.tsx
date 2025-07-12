import Button from "../../ui/Button";
import joinImage from "../../../assets/join.png";

export default function JoiningSection()


  { 
  return (
    <section className="flex flex-col items-center relative w-full ">
      <div className="relative w-full  h-auto sm:h-[363px] overflow-hidden rounded-xl">
      
        <div className=" sm:flex gap-[53.5px] top-2 left-0 inline-flex items-center absolute opacity-50">
          <div className="bg-[#00d1ff] relative w-[365px] h-[365px] rounded-[182.5px] blur-[175px]" />
          <div className="bg-[#623fff] relative w-[365px] h-[365px] rounded-[182.5px] blur-[175px]" />
          <div className="bg-[#ff994a] relative w-[365px] h-[365px] rounded-[182.5px] blur-[175px]" />
        </div>

      
        <div className="absolute inset-0">
          <img
            className="absolute h-full right-0"
            src={joinImage}
            alt=""
            role="presentation"
          />
        </div>

       
        <div className="relative flex flex-col items-center sm:items-start gap-6 sm:gap-8 p-6 sm:p-0 sm:absolute sm:top-[93px] sm:left-[50%] -translate-x-[50%] w-full max-w-4xl mx-auto sm:mx-0">
          <div className="flex flex-col items-center sm:items-start gap-3 w-full text-center sm:text-left">
            <h2 className="poppins font-semibold text-[#2a2a2a] text-center text-2xl sm:text-3xl md:text-[32px] tracking-normal sm:tracking-[0] leading-[1.3] sm:leading-[50px] w-full">
             Start Your Journey from Loneliness to Wholeness
            </h2>
            <p className="text-center w-full openSans">Join a movement that sees you, supports you, and helps your conscious work shine.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-[15px] w-full ">
           
            <Button
              // variant="gradient-primary"
              className="jakarta rounded-[100px] h-[42px] py-1 px-8 self-stretch text-[14px]  bg-linear-to-r from-[#7077FE] to-[#9747FF]"
            >
              Create Your Profile
            </Button>

            <Button
              variant="outline"
              className="jakarta bg-white h-[42px] border-[#2222241a] px-4 sm:px-6 py-1 sm:py-1 rounded-[100px] text-[#222224] font-medium text-[14px] w-full sm:w-auto"
            >
              Join the Comunity
            </Button>
             <Button
              variant="outline"
              className="jakarta bg-white w-[152px] h-[42px] border-[#2222241a] px-4 sm:px-6 py-1 sm:py-1 rounded-[100px] text-[#222224] font-medium text-[14px] "
            >
              Get Certified
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
