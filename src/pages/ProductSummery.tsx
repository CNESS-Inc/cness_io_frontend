import { useState } from "react";
import { Star, BookOpen, Download, RotateCcw } from "lucide-react";
import { FaVideo } from "react-icons/fa";
import { MdOutlineEmojiNature } from "react-icons/md";
import { BsCalendar2 } from "react-icons/bs";
import { MdClose } from "react-icons/md";


const resonanceTags = ["Motivated", "Greatful", "Funny", "Focused", "Emotional"];


const priceDetails = [
  { label: "Subtotal", value: "$1259",isDiscount:"" },
  { label: "Platform Fee", value: "$01" },
  { label: "Discount(10%)", value: "-$1260" },
  { label: "Total", value: "$1260", bold: true }
];

export default function ProductSummery() {
  const [rating, setRating] = useState(3);
  const [selectedTags, setSelectedTags] = useState(["Motivated", "Greatful", "Funny"]);
  const [review, setReview] = useState("");

  const toggleTag = (tag: string) =>
    setSelectedTags(selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag]
    );

  return (
    <div>
     <div className="pt-5 pb-2 px-2">
    <nav className="flex items-center text-xs text-gray-500 mb-2 font-medium">
      <span className="text-gray-700">Order History</span>
      <span className="mx-1">{'>'}</span>
      <span className="text-gray-400">Product Summary</span>
    </nav>
    <div className="text-2xl font-bold text-gray-800">Product Summary</div>
  </div>
    <div className="flex flex-col md:flex-row gap-6 p-6 max-w-5xl mx-auto bg-transparent">
      {/* Main Content */}
      <div className="flex-1">
        {/* Product Card */}
        <div className="bg-white rounded-lg shadow flex flex-col md:flex-row items-center gap-6 p-6">
          <img
            src="https://cdn.cness.io/collection1.svg"
            alt="Hatha Yoga"
            className="w-44 h-28 object-cover rounded"
          />
          <div className="flex-1">
            <div className="font-semibold text-gray-900">Order ID : CN000012</div>
            <div className="text-lg font-bold text-[#242E3A] mb-1">Soft guitar moods that heals your inner pain</div>
            <div className="text-gray-500 mb-2">by Redtape</div>
            <div className="flex items-center gap-0.5 text-xs text-[#242E3A] font-medium">
      {/* Course */}
      <span className="flex items-center gap-0.5">
        <FaVideo className="w-3 h-3 text-gray-900" />
        Course
      </span>
      <span className="text-indigo-200 mx-1">•</span>
      {/* Peaceful */}
      <span className="flex items-center gap-0.5">
        <MdOutlineEmojiNature className="w-3 h-3 text-gray-500" />
        <span className="text-xs text-[#7077FE]">Peaceful</span>
      </span>
      <span className="text-indigo-200 mx-1">•</span>
      {/* Purchased Date */}
      <span className="flex items-center gap-1">
        <BsCalendar2 className="w-3 h-3 text-[#7077FE]" />
        Purchased on <span className="text-xs font-bold">13 October,2025</span>
      </span>
    </div>
            <div className="font-bold text-xl text-indigo-600 mb-2">$1259</div>
            <button className="mt-1 px-4 py-2 bg-[#7077FE] text-white rounded shadow hover:bg-[#5E65F6] flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              View in Library
            </button>
          </div>
        </div>

        {/* Review Section */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <div className="font-semibold mb-2 text-[#242E3A] flex items-center gap-2">
            Rate the product
          </div>
          {/* Rating */}
          <div className="flex space-x-1 mb-4">
            {[1,2,3,4,5].map((n) => (
              <button
                key={n}
                className={n <= rating ? "text-indigo-500" : "text-gray-300"}
                onClick={() => setRating(n)}
              >
                <Star className="w-6 h-6" />
              </button>
            ))}
          </div>
          {/* Resonance Tags */}
          <div className="font-semibold mb-2 text-[#242E3A]">Select resonance tag</div>
          <div className="flex gap-3 flex-wrap">
                {resonanceTags.map(tag => (
                    <button
                    key={tag}
                    className={`flex items-center gap-2 rounded-full px-5 py-2 font-medium transition
                        ${selectedTags.includes(tag)
                        ? 'bg-[#7077FE] text-white'
                        : 'border border-gray-300 bg-white text-gray-500'
                        }`}
                    onClick={() => toggleTag(tag)}
                    >
                    {tag}
                    {selectedTags.includes(tag) && (
                        <MdClose className="w-4 h-4 text-white opacity-80" />
                    )}
                    </button>
                ))}
                </div>
          {/* Review Textarea */}
          <label className="block font-semibold mb-2 text-[#242E3A]" htmlFor="review">
            Write a review
          </label>
          <textarea
            id="review"
            value={review}
            onChange={e => setReview(e.target.value)}
            placeholder="Very detailed and..."
            className="w-full h-24 p-2 border rounded mb-4"
          />
         <button className="block px-4 py-2 bg-[#7077FE] text-white rounded shadow hover:bg-[#4950D8] mx-auto">
  Submit
</button>

        </div>
      </div>

      {/* --- RIGHT SIDEBAR --- */}
      <div className="w-full md:w-[320px]">
        <div className="bg-white rounded-lg shadow p-6 mb-4">
          <div className="font-bold text-gray-900 mb-2">Purchased details</div>
          <div className="flex items-center gap-2 mb-1">
            <div className="rounded-full bg-indigo-100 text-indigo-700 font-bold px-3 py-1">S</div>
            <div>
              <div className="font-semibold text-[#242E3A]">Venkatasubbu N</div>
              <div className="text-xs text-gray-500">9943830539</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6 mb-4">
          <div className="font-bold text-gray-900 mb-2">Price Details</div>
          <div className="space-y-2 mb-4">
            {priceDetails.map(({ label, value, bold, isDiscount }) => (
                <div
                key={label}
                className={`
                    flex justify-between items-center
                    ${bold ? "font-semibold text-indigo-700" : "text-gray-700"}
                    ${isDiscount ? "" : ""}
                `}
                >
                <span>{label}</span>
                <span>{value}</span>
                {/* Render border only under Discount row */}
                {isDiscount && (
                    <div className="w-full">
                    <div className="mt-2 mx-auto h-0.5 bg-gray-200 rounded" style={{ width: "75%" }} />
                    </div>
                )}
                </div>
            ))}
            </div>

            <div className="bg-white rounded-lg px-3 py-3 flex justify-between items-center font-semibold text-gray-800 border border-gray-200">
            <span>Paid by</span>
            <span>Strip</span>
            </div>
          <button className="w-full mb-2 mt-4 px-4 py-2 bg-[#7077FE] text-white rounded shadow hover:bg-[#4950D8] flex items-center justify-center gap-2">
            <Download className="w-5 h-5" />
            Download invoice
          </button>
          <button className="w-full px-4 py-2 bg-[#7077FE] text-white rounded shadow hover:bg-[#4950D8] flex items-center justify-center gap-2">
            <RotateCcw className="w-5 h-5" />
            Return
          </button>
        </div>
      </div>
    </div>
    </div>
  );
}
