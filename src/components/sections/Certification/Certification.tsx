import { FaCheck } from "react-icons/fa";
import Lottie from 'lottie-react';
import Cardbg from '../../../assets/lottie-files/Cards/Card-bg.json';

const Certification = () => {
  return (
    <>
      <div className='py-20 w-full bg-[#FAFAFA]  '>
        <div className='max-w-[1336px] mx-auto flex justify-between'>
          <div className='w-[60%] flex flex-col justify-center items-start' >
            <h3 className='poppins text-[32px] font-medium text-black'>Certification Makes It Official.</h3>
            <p className='openSans text-[18px] font-Regular pt-[10px] mb-2'>Get your conscious identity verified and unlock everything CNESS has to offer.</p>
            <span className="badge text-[#F07EFF] border-[#F07EFF] border text-[16px] font-[500] px-4 py-1 rounded-[100px] mb-6 inline-block mt-2 openSans">Benefits</span>


            <div className='leading-9 pt-[20px] flex flex-col gap-4'>
              <div className='flex items-center gap-2'>
                <p className='h-[25px] w-[25px] rounded-full bg-[#F4D373] flex items-center justify-center'><FaCheck className='text-white' /></p>
                <p className='text-[18px] text-[#1A2D36] font-regular openSans'>Unlock your True Profile with verified status</p>
              </div>
              <div className='flex items-center gap-2'>
                <p className='h-[25px] w-[25px] rounded-full bg-[#F4D373] flex items-center justify-center'><FaCheck className='text-white' /></p>
                <p className='text-[18px] text-[#1A2D36] font-regular openSans'>Sell your services or digital tools in the Conscious Marketplace</p>
              </div>
              <div className='flex items-center gap-2'>
                <p className='h-[25px] w-[25px] rounded-full bg-[#F4D373] flex items-center justify-center'><FaCheck className='text-white' /></p>
                <p className='text-[18px] text-[#1A2D36] font-regular openSans'>Publish reflections, stories, and offerings on your social feed</p>
              </div>
              <div className='flex items-center gap-2'>
                <p className='h-[25px] w-[25px] rounded-full bg-[#F4D373] flex items-center justify-center'><FaCheck className='text-white' /></p>
                <p className='text-[18px] text-[#1A2D36] font-regular openSans'>Get featured in the CNESS Directory with certification tags</p>
              </div>
              <div className='flex items-center gap-2'>
                <p className='h-[25px] w-[25px] rounded-full bg-[#F4D373] flex items-center justify-center'><FaCheck className='text-white' /></p>
                <p className='text-[18px] text-[#1A2D36] font-regular openSans'>Become eligible to mentor others and earn through guidance</p>
              </div>
              <div className='flex items-center gap-2'>
                <p className='h-[25px] w-[25px] rounded-full bg-[#F4D373] flex items-center justify-center'><FaCheck className='text-white' /></p>
                <p className='text-[18px] text-[#1A2D36] font-regular openSans'>Priority access to broadcasting and live events</p>
              </div>
            </div>

            <button type="button" className='jakarta px-3 py-1 h-[42px] w-[127px]  text-white bg-[linear-gradient(21deg,_rgba(112,119,254,1)_0%,_rgba(240,126,255,1)_100%)] rounded-[50px] mt-8'
            >   Get Certified </button>
          </div>

          <div className='h-[650px] rounded-2xl w-[40%] '>
            <Lottie
              animationData={Cardbg}
              loop
              autoplay
              // style={{width: "100%", height: 550 }}
              className="w-full h-full"
            />
          </div>

        </div>
      </div>








    </>
  )
}

export default Certification
