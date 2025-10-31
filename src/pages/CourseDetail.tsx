import { useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { BsBookmarkFill } from "react-icons/bs";
import { FaVideo, FaPodcast } from "react-icons/fa";
//import { ChevronDown } from "lucide-react";
import { FaStar } from "react-icons/fa";
import { FaRegClock, FaRegStar, FaRegCommentAlt, FaRegFileVideo, FaRegKeyboard } from "react-icons/fa"; // Or use preferred icons

// Demo/static data
const mood = "Peaceful";
const rating = 4.8;
const reviews = 123;
const purchases = 2100;
const chaptersCount = 5;
const purchaseDate = "13 October,2025";
const resonanceTags = [
  "Motivated", "Greatful", "Funny", "Focused", "Emotional"
];


const tabs = [
  { name: "Overview" },
  { name: "Storytelling" },
  { name: "Reviews" },
];

const chapters = [
  {
    title: "Chapter 1",
    lessonCount: 3,
    duration: "30mins",
    lessons: [
      {
        title: "01: Learn the basic Guitar",
        type: "video",
        status: "Completed",
        duration: "",
        selected: true,
      },
      {
        title: "02: Learn the next class",
        type: "video",
        duration: "12mins",
        selected: false,
      },
      {
        title: "03: Learn the next class",
        type: "podcast",
        duration: "12mins",
        selected: false,
      }
    ]
  },
  {
    title: "Chapter 2",
    lessonCount: 6,
    duration: "40mins",
    lessons: []
  },
  {
    title: "Chapter 3",
    lessonCount: 2,
    duration: "10mins",
    lessons: []
  },
  {
    title: "Chapter 4",
    lessonCount: 1,
    duration: "10mins",
    lessons: []
  },
  {
    title: "Chapter 5",
    lessonCount: 7,
    duration: "10mins",
    lessons: []
  }
];

export default function CourseDetail() {
  const [openChapter, setOpenChapter] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<number>(1); // Default to Storytelling tab
  const navigate = useNavigate();

  return (
    <div className="w-full">

      <div className="max-w-[1160px] mx-auto px-5">
        {/* Breadcrumbs */}
        <div className="flex text-[12px] text-slate-500 mt-9">
          <button onClick={() => navigate("/dashboard/library")} className="hover:underline">Library</button>
          <span className="mt-1 mx-2"><IoIosArrowForward /></span>
          <span>Courses</span>
          <span className="mt-1 mx-2"><IoIosArrowForward /></span>
          <span className="text-slate-700" style={{ fontFamily: "Poppins, sans-serif" }}>Soft guitar moods Books</span>
        </div>

        {/* Top Info */}
        <div className="flex items-center space-x-4 text-xs text-gray-600 mt-3">
          <span className="flex items-center">
            <span className="mr-1 font-semibold">{mood}</span>
            <span className="mx-2">•</span>
          </span>
          <span className="flex items-center" style={{ fontFamily: "Poppins, sans-serif" }}>
            {/* Star Icon */}
            <svg className="w-4 h-4 text-blue-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 15l-5.878 3.09L5.8 12.02.924 7.91l6.068-.936L10 2l2.919 4.974 6.067.936-4.876 4.11 1.678 6.07z" />
            </svg>
            {rating} ({reviews} reviews)
            <span className="mx-2">•</span>
          </span>
          <span className="flex items-center" style={{ fontFamily: "Poppins, sans-serif" }}>
            {/* Purchases Icon */}
            <svg className="w-4 h-4 text-blue-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M16 11V5a1 1 0 00-1-1H5a1 1 0 00-1 1v6H2v2h16v-2h-2z"/>
            </svg>
            {purchases.toLocaleString()} purchases
            <span className="mx-2">•</span>
          </span>
          <span className="flex items-center" style={{ fontFamily: "Poppins, sans-serif" }}>
            {/* Chapters Icon */}
            <svg className="w-4 h-4 text-blue-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V6.414A2 2 0 0015.414 5L13 2.586A2 2 0 0011.586 2H6zm0 2h6v3a1 1 0 001 1h3v10H6V4z"/>
            </svg>
            {chaptersCount} Chapters
            <span className="mx-2">•</span>
          </span>
          <span className="flex items-center" style={{ fontFamily: "Poppins, sans-serif" }}>
            {/* Calendar Icon */}
            <svg className="w-4 h-4 text-blue-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6 2a2 2 0 00-2 2v1h12V4a2 2 0 00-2-2H6zm-2 5h12v11a2 2 0 01-2 2H6a2 2 0 01-2-2V7z"/>
            </svg>
            Purchased on <span className="font-semibold ml-1">{purchaseDate}</span>
          </span>
        </div>

        {/* Title Row */}
        <div className="flex items-center justify-between mt-3">
          <h1 className="text-[20px] font-semibold text-slate-900">Soft guitar moods Books</h1>
          <button className="text-[12px] text-[#7C3AED] hover:text-[#6D28D9] flex items-center gap-1">
          Save to Collections
          <BsBookmarkFill color="#7C3AED" size={16} />
        </button>
        </div>

        {/* Hero Area */}
        <div className="mt-3 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
          {/* Video */}
          <div className="rounded-xl overflow-hidden border border-slate-200 bg-black/5">
            <div
              className="w-full h-[340px] bg-cover bg-center relative"
              style={{ backgroundImage: "url('https://cdn.cness.io/video.svg')" }}
            >
              <div className="absolute inset-0 bg-black/10" />
              <button className="absolute left-4 bottom-4 bg-white/80 text-slate-700 text-sm px-3 py-1 rounded-full backdrop-blur-sm">
                00:19 / 20:00
              </button>
            </div>
          </div>
          {/* Sidebar */}
         <aside className="bg-white rounded-xl border border-slate-200 p-4 w-[260px] h-[260px]">
        <h3 className="text-[17px] font-semibold mb-3">Course Content</h3>
        <div className="space-y-2">
          {chapters.map((c, i) => (
            <div key={c.title} className="border border-slate-200 rounded-lg overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-4 py-3 focus:outline-none bg-white"
                onClick={() => setOpenChapter(openChapter === i ? -1 : i)}
              >
                <div>
                  <div className="text-[15px] font-medium text-slate-800">{c.title}</div>
                  <div className="text-[12px] text-slate-500">{c.lessonCount} Lessons • {c.duration}</div>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openChapter === i ? "rotate-180" : ""}`} />
              </button>
              {openChapter === i && c.lessons.length > 0 && (
                <div className="bg-slate-50 px-2 pb-3 space-y-1">
                  {c.lessons.map((l, li) => (
                    <div
                      key={l.title}
                      className={`
                        flex gap-3 items-center p-2 rounded-lg cursor-pointer
                        ${l.selected ? "bg-violet-100 border-l-2 border-violet-500" : ""}
                      `}
                    >
                      <span className="text-[16px] text-slate-400">
                        {l.type === "video" ? <FaVideo /> : <FaPodcast />}
                      </span>
                      <div className="flex-1">
                        <div className={`text-[13px] font-medium leading-5 ${l.selected ? "text-violet-800" : "text-slate-800"}`}>
                          {l.title}
                        </div>
                        {l.status &&
                          <div className="text-[11px] text-slate-400">{l.status}</div>
                        }
                      </div>
                      {l.duration &&
                        <span className="text-[12px] text-slate-400">{l.duration}</span>
                      }
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </aside>
        </div>

        {/* Tabs */}
        <nav className="mt-3 grid w-[64%] grid-cols-3" aria-label="Course sections">
          {tabs.map((tab, idx) => (
            <button
              key={tab.name}
              className={`px-4 py-2 rounded-md text-sm ${
                activeTab === idx
                  ? "bg-[#7077FE] text-[#ffffff]"
                  : "bg-white border border-slate-200 text-slate-700"
              }`}
              onClick={() => setActiveTab(idx)}
            >
              {tab.name}
            </button>
          ))}
        </nav>

        {/* Tab Content */}
        <div className="mt-3 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
          {activeTab === 0 && (
            <div>
              {/* Overview Section */}
              <h3 className="text-[16px] font-bold mb-2">Overview</h3>
              <p className="text-[14px] text-slate-700 mb-4">
                Immerse yourself in smooth, atmospheric beats designed for focus, relaxation, and late-night creativity. Each track blends organic textures with soulful melodies to set the perfect vibe for study sessions or chill moments. Available for streaming and commercial licensing.
              </p>
              
              {/* Highlights Section */}
              <h4 className="text-[15px] font-semibold mb-2">Highlights:</h4>
              <ul className="list-disc list-inside mb-4 text-[14px] text-slate-900">
                <li>20 premium royalty-free tracks</li>
                <li>High-quality WAV + MP3 downloads</li>
                <li>License for personal or commercial use</li>
              </ul>
              
              {/* Details Section */}
              <h4 className="text-[15px] font-semibold mb-2">Details:</h4>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-y-2 gap-x-6 text-[14px] text-slate-700">
                  <div className="flex items-center gap-2">
                    <FaRegClock className="text-[16px] text-indigo-400" />
                    <span>Duration</span>
                  </div>
                  <div>12 hours</div>
                  
                  <div className="flex items-center gap-2">
                    <FaRegStar className="text-[16px] text-indigo-400" />
                    <span>Skill Level</span>
                  </div>
                  <div>Beginner → Advanced</div>
                  
                  <div className="flex items-center gap-2">
                    <FaRegCommentAlt className="text-[16px] text-indigo-400" />
                    <span>Language</span>
                  </div>
                  <div>English (with subtitles)</div>
                  
                  <div className="flex items-center gap-2">
                    <FaRegFileVideo className="text-[16px] text-indigo-400" />
                    <span>Format</span>
                  </div>
                  <div>Video</div>
                  
                  <div className="flex items-center gap-2">
                    <FaRegKeyboard className="text-[16px] text-indigo-400" />
                    <span>Requirements</span>
                  </div>
                  <div>Basic computer with drawing tablet or mouse</div>
                </div>
              </div>
            </div>
          )}
          {activeTab === 1 && (
            <div>
              <h3 className="text-[18px] font-bold mb-2">Storytelling</h3>
              <div className="rounded-xl overflow-hidden border border-slate-200">
                <img
                  src="https://cdn.cness.io/video1.svg"
                  className="w-full h-[260px] object-cover"
                  alt="Storytelling"
                />
              </div>
              <p 
                style={{ fontFamily: "Poppins, sans-serif" }}
                className="text-[12px] text-slate-600 mt-3"
              >
                Immerse yourself in smooth, atmospheric beats designed for focus, relaxation, and late-night creativity. Each track blends organic textures with soulful melodies to set the perfect vibe for study sessions or chill moments. Available for streaming and commercial licensing.
              </p>
            </div>
          )}
          {activeTab === 2 && (
            <div>
              <h3 className="text-[14px] font-semibold mb-2">Reviews</h3>
              <p className="text-[12px] text-slate-600">No reviews yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
