import { BsClockHistory } from "react-icons/bs";
import { MdLanguage } from "react-icons/md";
import { FaRegPlayCircle } from "react-icons/fa";
import { IoMdCheckmark } from "react-icons/io";
import { FaInstagram, FaYoutube, FaFacebookF, FaXTwitter } from "react-icons/fa6";
import { FiSun } from "react-icons/fi";

// Use placeholder images for debugging
const guitarImg = 'https://cdn.cness.io/VIDEO%20(1).svg';
const storytellerImg = 'https://cdn.cness.io/freame2.svg';
const artistAvatar = 'https://cdn.cness.io/frame1.svg';

const Preview = () => {
  return (
    
    <div className="min-h-screen flex flex-col items-center py-2 px-2">
 <h2 className="text-[#242E3A] font-['Poppins'] font-semibold text-[18px]">
                       Preview
        </h2>      
        {/* Main Product Card */}
      <div className="bg-white rounded-xl shadow-md w-full max-w-6xl mb-8 flex flex-col">
        <div className="flex flex-col md:flex-row">
          <div className="relative w-full">
            <img
              src={guitarImg}
              alt="Guitar Player"
              className="rounded-t-xl md:rounded-l-xl md:rounded-tr-none w-full h-48 object-cover"
            />
            <button
              aria-label="Play"
              className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 text-3xl text-gray-900 shadow"
            >
              <FaRegPlayCircle />
            </button>
          </div>
          <div className="p-6 flex flex-col justify-between w-full">
            <div>
              <h2 className="text-2xl md:text-2xl font-bold mb-2" style={{ fontFamily: "Poppins" }}>
                Epic Cinematic Background Scores Bundle for Film
              </h2>
              <div className="flex items-center gap-2 mb-4" style={{ fontFamily: "Poppins" }}>
                <img src={artistAvatar} alt="Red Tape" className="w-8 h-8 rounded-full" />
                <span className="text-sm font-medium">Red Tape</span>
                <span className="ml-2 text-blue-500 text-xl"><IoMdCheckmark /></span>
              </div>
              <div className="text-2xl font-bold mb-4">$29</div>
            </div>
          </div>
        </div>
      </div>

      {/* Overview Section */}
      <div className="bg-white rounded-xl shadow-md w-full max-w-6xl p-6 mb-8">
        <h3 className="font-semibold text-lg mb-3" style={{ fontFamily: "Poppins" }}>Overview</h3>
        <p className="mb-4 text-gray-700" style={{ fontFamily: "Poppins" }}>
          Immerse yourself in smooth, atmospheric beats designed for focus, relaxation, and late-night creativity. Each track blends organic textures with soulful melodies to set the perfect vibe for study sessions or chill moments. Available for streaming and commercial licensing.
        </p>
        <h4 className="font-semibold mb-2">Highlights:</h4>
        <ul className="list-disc ml-6 mb-4 text-gray-700" style={{ fontFamily: "Poppins" }}>
          <li>20 premium royalty-free tracks</li>
          <li>High-quality WAV + MP3 downloads</li>
          <li>License for personal or commercial use</li>
        </ul>
        <h4 className="font-semibold mb-2">Details:</h4>
        <div className="flex gap-10 text-gray-700 mb-2">
          <div>
            <div className="flex items-center gap-1 mb-1 font-semibold">
              <BsClockHistory />
              <span>Duration</span>
            </div>
            <span className="text-sm">12 hours</span>
          </div>
          <div>
            <div className="flex items-center gap-1 mb-1 font-semibold">
              <MdLanguage />
              <span>Language</span>
            </div>
            <span className="text-sm" style={{ fontFamily: "Poppins" }}>English (with subtitles)</span>
          </div>
        </div>
      </div>

      {/* Storytelling Section */}
      <div className="bg-white rounded-xl shadow-md w-full max-w-6xl p-6 mb-8">
        <h3 className="font-semibold text-lg mb-3">Storytelling</h3>
        <div className="flex md:flex-row flex-col md:items-center gap-4">
          <div className="relative w-70 h-30">
            <img
              src={storytellerImg}
              alt="Storytelling"
              className="rounded-lg w-70 h-30 object-cover"
            />
            <button
              aria-label="Play Story"
              className="absolute left-1 top-1 bg-white/80 rounded-full p-1 text-xl text-gray-800 shadow"
            >
              <FaRegPlayCircle />
            </button>
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-2 bg-gray-200 rounded overflow-hidden">
              <div className="h-full bg-blue-500 rounded" style={{ width: "40%" }} />
            </div>
            <span className="absolute bottom-0 right-2 text-xs bg-black/70 text-white px-1 rounded">
              0:19 / 2:00
            </span>
          </div>
          <p className="text-gray-700 flex-1" style={{ fontFamily: "Poppins" }}>
            Immerse yourself in smooth, atmospheric beats designed for focus, relaxation, and late-night creativity. Each track blends organic textures with soulful melodies to set the perfect vibe for study sessions or chill moments. Available for streaming and commercial licensing.
          </p>
        </div>
      </div>

      {/* Artist Card */}
      <div className="bg-white rounded-xl shadow-md w-full max-w-6xl p-4 flex items-center gap-4">
            <img src={artistAvatar} alt="Red Tape" className="w-12 h-12 rounded-full object-cover" />
            <div>
            <div className="font-semibold flex items-center gap-1">
                Red Tape 
                <span className="bg-blue-500 rounded-full p-1 ml-1">
                <IoMdCheckmark className="text-white text-sm" />
                </span>
            </div>
            <div className="text-sm text-gray-500">Digital Artist</div>
            </div>
            <div className="ml-6 flex gap-4">
            <button className="w-12 h-12 flex items-center justify-center rounded-lg border border-gray-300 text-2xl text-gray-500 hover:bg-gray-100 transition">
                <FiSun />
            </button>
            <button className="w-12 h-12 flex items-center justify-center rounded-lg border border-gray-300 text-2xl text-gray-500 hover:bg-gray-100 transition">
                <FaInstagram />
            </button>
            <button className="w-12 h-12 flex items-center justify-center rounded-lg border border-gray-300 text-2xl text-gray-500 hover:bg-gray-100 transition">
                <FaYoutube />
            </button>
            <button className="w-12 h-12 flex items-center justify-center rounded-lg border border-gray-300 text-2xl text-gray-500 hover:bg-gray-100 transition">
                <FaFacebookF />
            </button>
            <button className="w-12 h-12 flex items-center justify-center rounded-lg border border-gray-300 text-2xl text-gray-500 hover:bg-gray-100 transition">
                <FaXTwitter />
            </button>
            </div>
        </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mt-6">
            <div className="ml-auto flex gap-2">
                <button className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-sm">Back</button>
                <button className="px-4 py-2 rounded bg-[#7077FE] text-white hover:bg-blue-700 text-sm">Submit</button>
            </div>
        </div>

    </div>
  );
};

export default Preview;
