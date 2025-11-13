import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { IoIosArrowForward } from "react-icons/io";
import { BsBookmarkFill } from "react-icons/bs";
import { FaVideo, FaPodcast, FaStar } from "react-icons/fa";
import { AiOutlinePlus } from "react-icons/ai";
import { FiCalendar } from "react-icons/fi";
import { LuImagePlus, LuGalleryVerticalEnd } from "react-icons/lu";



import { FaRegClock, FaRegStar, FaRegCommentAlt, FaRegFileVideo, FaRegKeyboard } from "react-icons/fa";

// ----------------- Demo/static data & Types -----------------
const mood = "Peaceful";
const demoRating = 4.8;
const demoReviews = 123;
const purchases = 2100;
const chaptersCount = 5;
const purchaseDate = "13 October,2025";
const collections = [
  { name: "Motivated", image: "https://cdn.cness.io/collection1.svg" },
  { name: "wellness", image: "https://cdn.cness.io/collection2.svg" },
  { name: "Ebook", image: "https://cdn.cness.io/collection3.svg" },
];
const tabs = [{ name: "Overview" }, { name: "Storytelling" }, { name: "Reviews" }];
const resonanceOptions = ["Motivated", "Greatful", "Funny", "Focused", "Emotional"];
const ratings = [
  { star: 5, percent: 60 },
  { star: 4, percent: 20 },
  { star: 3, percent: 10 },
  { star: 2, percent: 7 },
  { star: 1, percent: 3 },
];

// hardcoded; you may calculate it from reviews state
const avgRating = 4.8;
const totalReviews = 123;
const chapters = [
  {
    title: "Chapter 1",
    lessonCount: 3,
    duration: "30mins",
    lessons: [
      { title: "01: Learn the basic Guitar", type: "video", status: "Completed", duration: "", selected: true },
      { title: "02: Learn the next class", type: "video", duration: "12mins", selected: false },
      { title: "03: Learn the next class", type: "podcast", duration: "12mins", selected: false }
    ]
  },
  { title: "Chapter 2", lessonCount: 6, duration: "40mins", lessons: [] },
  { title: "Chapter 3", lessonCount: 2, duration: "10mins", lessons: [] },
  { title: "Chapter 4", lessonCount: 1, duration: "10mins", lessons: [] },
  { title: "Chapter 5", lessonCount: 7, duration: "10mins", lessons: [] }
];

type SaveToCollectionsModalProps = {
  open: boolean;
  closeModal: () => void;
  collections: { name: string; image: string }[];
};

type Review = {
  name: string;
  text: string;
  tags: string[];
};

// ----------------- SaveToCollectionsModal Component -----------------
function SaveToCollectionsModal({ open, closeModal, collections }: SaveToCollectionsModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex justify-center items-center">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg relative">
        <button className="absolute top-3 right-3 text-2xl text-black-400 hover:text-black-600" onClick={closeModal}>
          &times;
        </button>
        <h2 className="text-xl font-semibold text-center font-poppins mb-6">Save to My Collection</h2>
        <div className="flex flex-col gap-6 mb-5">
          {collections.map((col) => (
            <div key={col.name} className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-3">
                <img src={col.image} alt={col.name} className="w-16 h-12 rounded-md object-cover" />
                <span className="text-lg font-medium">{col.name}</span>
              </div>
              <button className="rounded-full border border-black-400 p-1 hover:bg-black-300 transition-all flex items-center justify-center">
                <AiOutlinePlus className="text-2xl font-bold text-[#000000]" />
              </button>
            </div>
          ))}
        </div>
        <button className="py-2 px-4 rounded-md bg-[#7077FE] text-white font-semibold hover:bg-[#6D28D9] mt-2 flex items-center justify-center gap-2 text-sm mx-auto">
          <span className="inline-flex items-center justify-center rounded-full bg-white text-[#7077FE] w-6 h-6">
            <AiOutlinePlus size={18} />
          </span>
          Add new collection
        </button>
      </div>
      </div>
  );
}

// ----------------- Main CourseDetail Component -----------------
export default function CourseDetail() {
  const [openChapter, setOpenChapter] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<number>(1); // Default to Storytelling tab
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // ----- REVIEW STATES -----
  const [starRating, setStarRating] = useState<number>(0);
  const [reviewText, setReviewText] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>(["Motivated", "Greatful", "Funny"]);
  const [allReviews, setAllReviews] = useState<Review[]>([]);

  // Review tag selection
  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // Review submit handler
  const submitReview = () => {
    if (starRating && reviewText) {
      setAllReviews([
        ...allReviews,
        {
          name: "Reviewer Name",
          text: reviewText,
          tags: [...selectedTags]
        }
      ]);
      setReviewText('');
      setSelectedTags([]);
      setStarRating(0);
    }
  };

  return (
    <div className="w-full">
      <div className="mx-auto px-5">
        {/* Collections Modal */}
        <SaveToCollectionsModal open={showModal} closeModal={() => setShowModal(false)} collections={collections} />

        {/* Two-column layout starts from breadcrumbs */}
        <div className="mt-9 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
          {/* Left column: all soft guitar content */}
          <div>
            {/* Breadcrumbs */}
            <div className="flex text-[14px] font-[Open_Sans] text-slate-500">
              <button onClick={() => navigate("/dashboard/library")} className="font-[poppins] hover:underline">Library</button>
              <span className="mt-1 mx-2"><IoIosArrowForward /></span>
              <span className="font-[Open_Sans]">Courses</span>
              <span className="mt-1 mx-2"><IoIosArrowForward /></span>
              <span className="text-slate-700" style={{ fontFamily: "Poppins, sans-serif" }}>Soft guitar moods Books</span>

            </div>
            
            {/* Heading row: title + creator + save button */}
            <div className="w-full h-[60px] flex items-start justify-between mt-3">
              <div>
                <h1 className="text-[20px] font-[Poppins] font-semibold text-slate-900">Soft guitar moods Books</h1>
                <div className="flex items-center gap-2 mt-1 text-[12px] text-slate-600">
                  <img src="https://static.codia.ai/image/2025-10-15/i0zSrWRgtO.png" alt="Red Tape" className="w-5 h-5 rounded-full object-cover" />
                  <span>Red Tape</span>
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#7077FE] text-white text-[10px]">✓</span>
                </div>
              </div>
              <button
                className="text-400 text-[#000000] hover:text-[#000000] font-[Open_Sans] flex items-center gap-3"
                onClick={() => setShowModal(true)}
              >
                Save to Collections
                <BsBookmarkFill color="#7C3AED" size={16} />
              </button>
            </div>

            {/* Top Info */}
            <div className="flex items-center space-x-4 text-xs text-gray-600 mt-3">
              <span className="flex items-center">
                <span className="mr-1 font-semibold">{mood}</span>
                <span className="mx-2">•</span>
              </span>
              <span className="flex items-center" style={{ fontFamily: "Poppins, sans-serif" }}>
                <svg className="w-4 h-4 text-[#7077fe] mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09L5.8 12.02.924 7.91l6.068-.936L10 2l2.919 4.974 6.067.936-4.876 4.11 1.678 6.07z" />
                </svg>
                {demoRating} ({demoReviews} reviews)
                <span className="mx-2">•</span>
              </span>
              <span className="flex items-center" style={{ fontFamily: "Poppins, sans-serif" }}>
                <LuImagePlus className="w-4 h-4 text-[#7077fe] mr-1" />
                {purchases.toLocaleString()} purchases
                <span className="mx-2">•</span>
              </span>
              <span className="flex items-center" style={{ fontFamily: "Poppins, sans-serif" }}>
               <LuGalleryVerticalEnd className="w-4 h-4 text-[#7077fe] mr-1" />
                {chaptersCount} Chapters
                <span className="mx-2">•</span>
              </span>
              <span className="flex items-center" style={{ fontFamily: "Poppins, sans-serif" }}>
               <FiCalendar className="w-4 h-4 text-[#7077fe] mr-1" />
                Purchased on <span className="font-semibold ml-1">{purchaseDate}</span>
              </span>
            </div>

            {/* Title Row */}
            <div className="grid items-center grid-cols-2 justify-between mt-3">
             
            
            </div>

            {/* Hero: only image/video, not split */}
            <div className="mt-3 rounded-xl overflow-hidden border border-slate-200 bg-black/5">
              <div className="w-full h-[340px] bg-cover bg-center relative" style={{ backgroundImage: "url('https://cdn.cness.io/video.svg')" }}>
                <div className="absolute inset-0 bg-black/10" />
                <button className="absolute left-4 bottom-4 bg-white/80 text-slate-700 text-sm px-3 py-1 rounded-full backdrop-blur-sm">
                  00:19 / 20:00
                </button>
              </div>
            </div>

            {/* Tabs */}
            <nav className="mt-3 grid w-full grid-cols-3" aria-label="Course sections">
              {tabs.map((tab, idx) => (
                <button
                  key={tab.name}
                  className={`px-4 py-2 rounded-md text-sm ${activeTab === idx ? "bg-[#7077FE] text-[#ffffff]" : "bg-white border border-slate-200 text-slate-700"}`}
                  onClick={() => setActiveTab(idx)}
                >
                  {tab.name}
                </button>
              ))}
            </nav>

            {/* Tab Content */}
            <div className="mt-3">

          {activeTab === 0 && (
            <div>
              {/* Overview Section */}
              <h3 className=" w-[86px] h-[27px] text-black font-[Poppins] font-semibold text-[18px] opacity-100 mb-2 
              flex items-center">
  Overview
</h3>
             <p className="font-['Open_Sans'] font-normal text-[16px] leading [10] text-black bg-white w-full max-w-[843px] opacity-100 py-2">
  Immerse yourself in smooth, atmospheric beats designed for focus, relaxation, and late-night creativity. Each track blends organic textures with soulful melodies to set the perfect vibe for study sessions or chill moments. Available for streaming and commercial licensing.
</p>

              
             {/* Highlights Section */}
<h4 className="w-[86px] h-[27px] pt-4 pb-4 text-black font-[Poppins] font-semibold text-[18px] leading-[1] opacity-100 mb-2 flex items-center">
  Highlights:
</h4>
<ul className="list-disc list-inside mb-4 text-[16px] font-[Poppins] text-slate-900 space-y-2">
  <li>20 premium royalty-free tracks</li>
  <li>High-quality WAV + MP3 downloads</li>
  <li>License for personal or commercial use</li>
</ul>

              {/* Details Section */}
              <h4 className="w-[86px] h-[27px] pt-4 pb-4  text-black font-[Poppins] font-semibold text-[18px] leading-[1] opacity-100 mb-2 
              flex items-center">Details:</h4>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-y-2 gap-x-6 text-[16px] pb-18 font-[Poppins] text-slate-700">
                  <div className="flex items-center gap-2"><FaRegClock className="text-[16px] text-indigo-400" /> <span>Duration</span></div>
                  <div>12 hours</div>
                  <div className="flex items-center gap-2"><FaRegStar className="text-[16px] text-indigo-400" /> <span>Skill Level</span></div>
                  <div>Beginner → Advanced</div>
                  <div className="flex items-center gap-2"><FaRegCommentAlt className="text-[16px] text-indigo-400" /><span>Language</span></div>
                  <div>English (with subtitles)</div>
                  <div className="flex items-center gap-2"><FaRegFileVideo className="text-[16px] text-indigo-400" /><span>Format</span></div>
                  <div>Video</div>
                  <div className="flex items-center gap-2"><FaRegKeyboard className="text-[16px] text-indigo-400" /><span>Requirements</span></div>
                  <div>Basic computer with drawing tablet or mouse</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 1 && (
            <div>
              <h3 className="text-[18px] font-bold mb-2">Storytelling</h3>
              <div className="rounded-xl overflow-hidden border border-slate-200">
                <img src="https://cdn.cness.io/video1.svg" className="w-full h-[260px] object-cover" alt="Storytelling" />
              </div>
              <p className="font-['Open_Sans'] font-normal text-[16px] leading [10] text-black bg-white w-full max-w-[843px] opacity-100 py-2">
  Immerse yourself in smooth, atmospheric beats designed for focus, relaxation, and late-night creativity. Each track blends organic textures with soulful melodies to set the perfect vibe for study sessions or chill moments. Available for streaming and commercial licensing.
</p>


            </div>
          )}

         {activeTab === 2 && (
            <div>
              {/* --- Rating Summary (Top) --- */}
              <div className="w-full mx-auto rounded-lg bg-white p-6 shadow mb-6 grid grid-cols-2 gap-6">
                {/* Main left */}
                <div className="flex flex-col items-center justify-center">
                  <span className="text-[36px] font-bold leading-none">{avgRating}</span>
                  <span className="text-xs text-gray-400 mt-1">Based on {totalReviews} reviews</span>
                </div>
                {/* Ratings breakdown */}
                <div className="flex flex-col justify-center">
                  {ratings.map((item) => (
                    <div className="flex items-center mb-1" key={item.star}>
                      <span className="text-xs w-8 text-blue-600 font-bold flex items-center">
                        {item.star}
                        <FaStar className="ml-1 text-blue-500" size={12} />
                      </span>
                      <div className="flex-1 h-2 bg-gray-100 mx-2 rounded">
                        <div
                          className="h-2 bg-yellow-400 rounded"
                          style={{ width: `${item.percent}%`, transition: 'width 0.4s' }}
                        />
                      </div>
                      <span className="text-xs w-8 text-gray-500 font-bold">
                        {item.percent < 10 ? `0${item.percent}` : item.percent}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>


              {/* --- Review Entry, Tags, and List --- */}
              <div className="mx-auto p-6 bg-white rounded shadow">
                <p className="text-sm font-semibold mb-2">Rate the product</p>
                <div className="flex mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={`w-6 h-6 mr-2 cursor-pointer ${star <= starRating ? "text-yellow-400" : "text-gray-300"}`}
                      onClick={() => setStarRating(star)}
                    />
                  ))}
                </div>
                {/* Resonance Tag Selection */}
                <div className="mb-4">
                  <p className="text-sm font-semibold mb-2">Select resonance tag</p>
                  <div className="flex flex-wrap gap-2">
                    {resonanceOptions.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={
                          selectedTags.includes(tag)
                            ? "bg-blue-500 text-white px-4 py-1 rounded-full text-xs font-semibold shadow"
                            : "bg-gray-100 text-gray-700 px-4 py-1 rounded-full text-xs"
                        }
                        type="button"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Review Textarea & Submit */}
                <div className="mb-4">
                  <textarea
                    className="w-full border rounded p-2 text-sm mb-2"
                    placeholder="Write a review..."
                    value={reviewText}
                    onChange={e => setReviewText(e.target.value)}
                  />
                  <button
                    className="bg-blue-500 text-white py-2 px-6 rounded"
                    onClick={submitReview}
                    disabled={!starRating || !reviewText}
                  >
                    Submit
                  </button>
                </div>
                {/* Review List */}
                <h3 className="text-[14px] font-semibold mb-2">Reviews</h3>
                {allReviews.length === 0 ? (
                  <p className="text-[12px] text-slate-600">No reviews yet.</p>
                ) : (
                  <div className="space-y-4">
                    {allReviews.map((review, idx) => (
                      <div key={idx} className="bg-gray-50 p-4 rounded-md">
                        <div className="flex items-center mb-2">
                          <div className="w-8 h-8 rounded-full bg-gray-300 mr-2">
                              <img src="/images/user.png" alt="User" className="w-full h-full object-cover" />
                          </div>
                          <span className="font-semibold text-sm">{review.name}</span>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{review.text}</p>
                        <div className="flex gap-2">
                          {review.tags.map(tag => (
                            <span key={tag} className="bg-gray-200 px-2 py-1 rounded text-xs">{tag}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
          </div>
          {/* Right column: Course Content sidebar */}
          <aside className="bg-white rounded-xl border border-slate-200 lg:sticky lg:top-4 h-max">
           
            <div className="space-y-2">
                <div className="bg-gray-100 px-3 py-2 rounded-md">
                    <h3 className="text-[20px] font-[Poppins] p-4 font-semibold">Course Content</h3>
              </div>
                 
              {chapters.map((c, i) => (
                <div key={c.title} className="border border-slate-200 rounded-lg overflow-hidden mb-2">
                  <button
                    className="w-full flex items-center justify-between px-4 py-3 focus:outline-none bg-white"
                    onClick={() => setOpenChapter(openChapter === i ? -1 : i)}
                  >
                    <div>
                      <div className="text-[15px] font-[Poppins] font-medium text-slate-800">{c.title}</div>
                      <div className="text-[12px] font-[Poppins] text-slate-500">{c.lessonCount} Lessons • {c.duration}</div>
                    </div>
                    <ChevronDown className={`w-4 h-4 font-[Poppins] text-slate-400 transition-transform duration-200 ${openChapter === i ? "rotate-180" : ""}`} />
                  </button>
                  {openChapter === i && c.lessons.length > 0 && (
                    <div className="bg-slate-50 px-2 pb-3 space-y-1">
                      {c.lessons.map((l) => (
                        <div key={l.title} className={`flex gap-3 items-center p-2 rounded-lg cursor-pointer border-l-4 ${l.selected ? "bg-violet-100 border-violet-500" : "border-transparent"}`}>
                          <span className="text-[16px] text-slate-400">{l.type === "video" ? <FaVideo /> : <FaPodcast />}</span>
                          <div className="flex-1">
                            <div className={`text-[13px] font-medium leading-5 ${l.selected ? "text-violet-800" : "text-slate-800"}`}>{l.title}</div>
                            {l.status && <div className="text-[11px] text-slate-400">{l.status}</div>}
                          </div>
                          {l.duration && <span className="text-[12px] text-slate-400">{l.duration}</span>}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </aside>
      </div>
    </div>
    </div>
  );
}
