import Header from '../components/MarketPlace/Marketheader';
import { useLocation, useNavigate } from 'react-router-dom';
import instagramIcon from '../assets/instagramicon.svg';
import youtubeIcon from '../assets/youtubeicon.svg';
import facebookIcon from '../assets/facebookicon.svg';
import xIcon from '../assets/twittericon.svg';
import cnessicon from '../assets/cnessicon.svg';
import ProductCard from '../components/MarketPlace/ProductCard';
import { ChevronDown, ChevronUp, PlayCircle } from "lucide-react";
import  { useState,useEffect } from "react";

const ProductDetail = ({ isMobileNavOpen }: { isMobileNavOpen?: boolean }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product;
  const [openChapter, setOpenChapter] = useState<number | null>(0);

 const highlights = [
    '20 premium royalty-free tracks',
    'High-quality WAV + MP3 downloads', 
    'License for personal or commercial use'
  ]

  const chapters = [
    {
      title: "Chapter 1",
      lessonsCount: 3,
      duration: "30 mins",
      lessons: [
        { title: "01: Learn the basic Guitar", duration: "Completed", completed: true },
        { title: "02: Learn the next class", duration: "12 mins" },
        { title: "03: Learn the next class", duration: "12 mins" },
      ],
    },
    {
      title: "Chapter 2",
      lessonsCount: 6,
      duration: "40 mins",
      lessons: [
        { title: "01: Learn the rhythm pattern", duration: "10 mins" },
        { title: "02: Guitar strumming basics", duration: "15 mins" },
      ],
    },
    {
      title: "Chapter 3",
      lessonsCount: 2,
      duration: "10 mins",
      lessons: [
        { title: "01: Practice Exercises", duration: "6 mins" },
        { title: "02: Melody Demo", duration: "4 mins" },
      ],
    },
  ];

const toggleChapter = (index: number) =>
    setOpenChapter(openChapter === index ? null : index);

  const details = [
    { icon: 'https://static.codia.ai/image/2025-10-16/wo8469r2jf.png', label: 'Duration', value: '12 hours' },
    { icon: 'https://static.codia.ai/image/2025-10-16/TBG52Y11Ne.png', label: 'Skill Level', value: 'Beginner → Advanced' },
    { icon: 'https://static.codia.ai/image/2025-10-16/dCQ1oOqZNv.png', label: 'Language', value: 'English (with subtitles)' },
    { icon: 'https://static.codia.ai/image/2025-10-16/Kzho4cnKy1.png', label: 'Format', value: 'Video' },
    { icon: 'https://static.codia.ai/image/2025-10-16/9eNhkyRAT7.png', label: 'Requirements', value: 'Basic computer with drawing tablet or mouse' },
  ]
  

   const products = [
    {
        id:1,
      image: "https://static.codia.ai/image/2025-10-24/HGO1tqkC4d.png",
      title: "Soft guitar moods that heals your inner pain",
      author: "by Redtape",
      rating: 4.8,
      reviews: 123,
      originalPrice: 2444,
      currentPrice: 1299,
      discount: 50,
      duration: "00:23:00",
      category: "Peaceful"
    },
    {
         id:2,
      image: "https://static.codia.ai/image/2025-10-24/dv9CKSATxB.png",
      title: "Soft guitar moods that heals your inner pain",
      author: "by Redtape",
      rating: 4.8,
      reviews: 123,
      currentPrice: 1299,
      duration: "00:23:00",
      category: "Peaceful"
    },
    {
         id:3,
      image: "https://static.codia.ai/image/2025-10-24/mafhkbz4P3.png",
      title: "Soft guitar moods that heals your inner pain",
      author: "by Redtape",
      rating: 4.8,
      reviews: 123,
      currentPrice: 1299,
      duration: "00:23:00",
      category: "Peaceful"
    },
    {
        id:4,
      image: "https://static.codia.ai/image/2025-10-24/7XBKRowdN1.png",
      title: "Soft guitar moods that heals your inner pain",
      author: "by Redtape",
      rating: 4.8,
      reviews: 123,
      originalPrice: 2444,
      currentPrice: 1299,
      discount: 50,
      duration: "00:23:00",
      category: "Peaceful"
    }
  ]

  console.log("Location state:", location.state); // 👈 check if product exists

  if (!product) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg text-gray-600">
          No product data found. Go back to{" "}
          <span 
            className="text-blue-500 underline cursor-pointer" 
            onClick={() => navigate("/dashboard/market-place")}
          >
            Marketplace
          </span>
        </p>
      </div>
    );
  }

   useEffect(() => {
  if (product) localStorage.setItem("selectedProduct", JSON.stringify(product));
}, [product]);

const reviews = [
    {
      avatar: 'https://static.codia.ai/image/2025-10-16/e90dgbfC6H.png',
      name: 'Ava cooper',
      review: 'Very detailed and practical. Every module has something new to learn. The downloadable files really helped me practice along.',
      tags: ['Focused', 'Emotional']
    },
    {
      avatar: 'https://static.codia.ai/image/2025-10-16/Csvn95atK4.png',
      name: 'Ava cooper',
      review: 'Very detailed and practical. Every module has something new to learn. The files really helped me practice along.',
      tags: ['Focused', 'Emotional']
    },
    {
      avatar: 'https://static.codia.ai/image/2025-10-16/cajFdMaey3.png',
      name: 'Ava cooper',
      review: 'Very detailed and practical. Every module has something new to learn. The files really helped me practice along.',
      tags: ['Focused', 'Emotional']
    }
  ]

  const ratingData = [
    { stars: 5, percentage: 60, color: 'bg-[#F8B814]' },
    { stars: 4, percentage: 20, color: 'bg-[#F8B814]' },
    { stars: 3, percentage: 10, color: 'bg-[#F8B814]' },
    { stars: 2, percentage: 7, color: 'bg-[#F8B814]' },
    { stars: 1, percentage: 2, color: 'bg-[#F8B814]' }
  ]


  return (
    <main className=" min-h-screen bg-white">
  <Header />

<div
        className={` transition-all duration-300 ${
          isMobileNavOpen ? "md:ml-[256px]" : "md:ml-0"
        } pt-[80px] px-6`}
      >
      <div className="bg-white rounded-xl shadow-md p-4">
      <div className="flex items-center space-x-8">
        {/* Product Image */}
        <div className="flex-shrink-0">
          <img
            src={product.image}
              alt={product.title}
            className="w-[533px] h-[304px] rounded-lg object-cover"
          />
        </div>

        {/* Product Info */}
        <div className="flex-1 space-y-4 -mt-7">
          <div className="text-sm text-gray-500">{product.category} / video / {product.author}</div>
          
          <h1 className="text-2xl font-semibold text-gray-900 leading-tight">
            {product.title}
          </h1>

          {/* Author and Stats */}
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <img
                src="https://static.codia.ai/image/2025-10-16/1Uq1yJR1AG.png"
                alt="Red Tape"
                className="w-6 h-6 rounded-full"
              />
              <span className="font-medium text-gray-900">{product.author}</span>
              <img src="https://static.codia.ai/image/2025-10-16/4CY6MqmRhj.png" alt="Verified" className="w-4 h-4" />
            </div>
            
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            
            <div className="flex items-center space-x-1">
              <img src="https://static.codia.ai/image/2025-10-16/yNGhX01DCH.png" alt="Star" className="w-5 h-5" />
              <span className="text-gray-900"> {product.rating} ({product.reviews} reviews)</span>
            </div>
            
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            
            <div className="flex items-center space-x-1">
              <img src="https://static.codia.ai/image/2025-10-16/92zn9LKBU3.png" alt="Downloads" className="w-5 h-5" />
              <span className="text-gray-900">2.1k purchases</span>
            </div>
          </div>

          {/* Price */}
          <div className="text-3xl font-semibold text-gray-900">${product.currentPrice}</div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600">
              <img src="https://static.codia.ai/image/2025-10-16/LUafay60N9.png" alt="Buy" className="w-6 h-6" />
              <span>Buy Now</span>
            </button>
            
            <button className="flex items-center space-x-2 border border-blue-500 text-blue-500 px-6 py-3 rounded-lg font-medium hover:bg-blue-50">
              <img src="https://static.codia.ai/image/2025-10-16/VUQR3XLDmc.png" alt="Cart" className="w-6 h-6" />
              <span>Add to cart</span>
            </button>
            
            <button className="p-3 border border-blue-500 rounded-lg hover:bg-blue-50">
              <img src="https://static.codia.ai/image/2025-10-16/dB7irjkuHK.png" alt="Wishlist" className="w-6 h-6" />
            </button>
          </div>

          <div className="text-sm text-blue-500">*Lifetime access</div>
        </div>

        {/* Wishlist Button */}
<div className="flex-shrink-0 relative -top-30">
          <button className="p-2">
            <img src="https://static.codia.ai/image/2025-10-16/BXzyxOMo7y.png" alt="Add to Wishlist" className="w-9 h-9" />
          </button>
        </div>
      </div>
    </div>

    {/* Description and Details Section */}
<div className="bg-white rounded-xl shadow-md p-8 space-y-5 mt-6">
      {/* Overview */}
      <div className="space-y-4">
       <h2
  className="font-['Poppins'] font-semibold text-[18px] leading-[100%] tracking-[0] text-gray-900"
>Overview</h2>
        <p className="font-['Open_Sans'] font-normal text-[16px] leading-[150%] tracking-[0] text-black">
          Immerse yourself in smooth, atmospheric beats designed for focus, relaxation, and late-night creativity. Each track blends organic textures with soulful melodies to set the perfect vibe for study sessions or chill moments. Available for streaming and commercial licensing.
        </p>
      </div>

      {/* Highlights */}
      <div className="space-y-4">
        <h2   className="font-['Poppins'] font-semibold text-[18px] leading-[100%] tracking-[0] text-gray-900">Highlights:</h2>
        <ul className="space-y-3">
          {highlights.map((highlight, index) => (
            <li key={index} className="font-['Open_Sans'] font-normal text-[16px] leading-[150%] tracking-[0] text-black">
              {highlight}
            </li>
          ))}
        </ul>
      </div>

      {/* Details */}
      <div className="space-y-4">
        <h2 className="font-['Poppins'] font-semibold text-[18px] leading-[100%] tracking-[0] text-gray-900">Details:</h2>
        <div className="space-y-4">
          {details.map((detail, index) => (
            <div key={index} className="flex items-center space-x-8">
              <div className="flex items-center space-x-3 w-48">
                <img src={detail.icon} alt={detail.label} className="w-5 h-5" />
                <span className="font-['Open_Sans'] font-normal text-[16px] leading-[150%] tracking-[0] text-black">{detail.label}</span>
              </div>
              <span className="font-['Open_Sans'] font-normal text-[16px] leading-[150%] tracking-[0] text-black">{detail.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Storytelling Section */}
      <div className="space-y-4">
        <h2 className="font-['Poppins'] font-semibold text-[18px] leading-[100%] tracking-[0] text-gray-900">Storytelling</h2>
        <div className="flex space-x-4">
          <div className="relative">
            <img
              src="https://static.codia.ai/image/2025-10-16/OqOzCQfESi.png"
              alt="Video Preview"
              className="w-[450px] h-[190px] rounded-lg object-cover"
            />
            <div className="absolute bottom-4 left-4 right-4">
              <p className="text-white text-xs text-center mb-2 font-['Inter']">
                I was impressed with how seamless the entire process was. From discovery to delivery, everything felt smooth and intuitive.
              </p>
<div className="flex items-center justify-center space-x-2 bg-black/40 rounded-full px-5 py-1">
                <img src="https://static.codia.ai/image/2025-10-16/UaQWMTnCVG.png" alt="Play" className="w-5 h-5" />
                <span className="text-white text-xs font-['Inter']">00:19 / 20:00</span>
                <img src="https://static.codia.ai/image/2025-10-16/PKWm76rWV6.png" alt="Progress" className="w-36 h-1" />
                <div className="bg-white border border-white rounded-lg px-2 py-1">
                  <span className="text-white text-xs font-['Inter']">1X</span>
                </div>
                <img src="https://static.codia.ai/image/2025-10-16/EzJzrUMfS9.png" alt="Volume" className="w-5 h-5" />
                <img src="https://static.codia.ai/image/2025-10-16/3LrbguD4pt.png" alt="Captions" className="w-5 h-5" />
                <img src="https://static.codia.ai/image/2025-10-16/Fg0hapcr20.png" alt="Fullscreen" className="w-5 h-5" />
              </div>
            </div>
          </div>
          <div className="flex-1">
            <p className="font-['Open_Sans'] font-normal text-[16px] leading-[150%] tracking-[0] text-black">
              Immerse yourself in smooth, atmospheric beats designed for focus, relaxation, and late-night creativity. Each track blends organic textures with soulful melodies to set the perfect vibe for study sessions or chill moments. Available for streaming and commercial licensing.
            </p>
          </div>
        </div>
      </div>
    </div>

{/* Author Section */}
<div className="bg-white rounded-xl shadow-md p-4 mt-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 ">
          <div className="flex items-center space-x-4">
            <img
              src="https://static.codia.ai/image/2025-10-16/03HoRzVdSn.png"
              alt="Red Tape"
              className="w-15 h-15 rounded-full"
            />
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-900">Red Tape</span>
                <img src="https://static.codia.ai/image/2025-10-16/bDZghXxif0.png" alt="Verified" className="w-5 h-5" />
              </div>
              <div className="text-sm text-gray-500 font-light">Digital Artist</div>
            </div>
          </div>

          {/* Social Media Icons */}
<div className="flex items-center gap-4 ml-8">
  {[
    { icon: cnessicon, label: "Cness" },
    { icon: instagramIcon, label: "Instagram" },
    { icon: youtubeIcon, label: "YouTube" },
    { icon: facebookIcon, label: "Facebook" },
    { icon: xIcon, label: "Twitter" },
  ].map((item, index) => (
    <div key={index} className="group relative">
      <button
        className="
          flex items-center gap-3
          h-[60px] px-4
          rounded-lg border border-gray-300 bg-white
          overflow-hidden
          transition-all duration-500 ease-out
          hover:w-[160px] w-[60px]
          shadow-sm
        "
      >
        {/* Icon */}
        <img
          src={item.icon}
          alt={item.label}
          className="w-8 h-8 shrink-0 transition-transform duration-500 ease-out "
        />

        {/* Label (hidden until hover) */}
        <span
          className="
            text-blue-500 text-sm font-medium whitespace-nowrap
            opacity-0 translate-x-4
            transition-all duration-500 ease-out
            group-hover:opacity-100 group-hover:translate-x-0
          "
        >
          {item.label}
        </span>
      </button>
    </div>
  ))}
</div>
        </div>

        {/* View Store Button */}
        <button className="flex items-center space-x-2 bg-[#7077FE] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#7077FE]">
          <img src="https://static.codia.ai/image/2025-10-16/t3md55f2ZY.png" alt="Store" className="w-6 h-6" />
          <span>View Store</span>
        </button>
      </div>
    </div>

     <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 mt-6 ">
      <h2 className="font-[Poppins] font-semibold text-[20px] sm:text-[22px] font-semibold text-[#242E3A] mb-6 ">
        Course Content
      </h2>
<div className="border border-gray-100 ">
        </div>

      <div className="divide-y divide-gray-200 ">
        {chapters.map((chapter, i) => (
          <div key={i} className="py-4">
            {/* Chapter Header */}
            <button
              onClick={() => toggleChapter(i)}
              className="w-full flex justify-between items-center text-left"
            >
              <div>
                <h3 className="font-[Poppins] font-semibold text-[#242E3A] text-[16px]">
                  {chapter.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {chapter.lessonsCount} Lessons • {chapter.duration}
                </p>
              </div>
              {openChapter === i ? (
                <ChevronUp className="text-gray-500" />
              ) : (
                <ChevronDown className="text-gray-500" />
              )}
            </button>

            {/* Lessons */}
            <div
              className={`transition-all duration-300 overflow-hidden ${
                openChapter === i ? "max-h-[500px] mt-4" : "max-h-0"
              }`}
            >
              <div className="flex flex-col gap-3 pl-6 mt-2">
                {chapter.lessons.map((lesson, j) => (
                  <div
                    key={j}
                    className="flex justify-between items-center bg-[#F9FAFB] px-4 py-3 rounded-lg hover:bg-[#EEF2FF] transition"
                  >
                    <div className="flex items-center gap-3">
                      <PlayCircle
                        className={`w-5 h-5 ${
                          lesson.completed ? "text-green-500" : "text-[#7077FE]"
                        }`}
                      />
                      <p
                        className={`text-[15px] ${
                          lesson.completed ? "text-gray-400 line-through" : "text-[#242E3A]"
                        }`}
                      >
                        {lesson.title}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500">{lesson.duration}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

{/* Reviews Section */}
<div className="bg-white rounded-xl shadow-md p-4 mt-6">
      <div className="flex space-x-8">
        <div className="w-96 border border-gray-200 rounded-xl p-6">
          <div className="text-center mb-6">
            <div className="text-4xl font-semibold text-gray-900 mb-2">{product.rating}</div>
            <div className="text-gray-500">Based on {product.reviews} reviews</div>
          </div>

          {/* Rating Breakdown */}
          <div className="space-y-3 mb-6">
            {ratingData.map((rating, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                  <span className="text-blue-500 text-lg">{rating.stars}</span>
                  <img src="https://static.codia.ai/image/2025-10-16/g9soS0qbLX.png" alt="Star" className="w-6 h-6" />
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-3">
                  <div
                    className={`${rating.color} h-3 rounded-full`}
                    style={{ width: `${rating.percentage}%` }}
                  ></div>
                </div>
                <span className="text-gray-500 text-lg w-12 text-right">{rating.percentage}%</span>
              </div>
            ))}
          </div>

          <button className="w-full bg-[#7077FE] text-white py-3 rounded-lg font-medium hover:bg-[#7077FE]">
            Write a review
          </button>
        </div>

        {/* Reviews List */}
        <div className="flex-1 space-y-3">
          {reviews.map((review, index) => (
            <div key={index} className="border border-gray-200 rounded-xl p-4">
              <div className="flex items-start space-x-4 mb-4">
                <img
                  src={review.avatar}
                  alt={review.name}
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900 mb-1">{review.name}</div>
                  <p className="text-gray-600 text-sm leading-relaxed">{review.review}</p>
                </div>
              </div>
              <div className="flex space-x-3">
                {review.tags.map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className="px-7 py-3 border border-gray-300 rounded-full text-sm text-gray-600 font-['Plus_Jakarta_Sans']"
                  >
                    {tag}
                  </span>
                  
                ))}
                
              </div>
              
            </div>
            
          ))}
<div className="flex justify-center mt-4">
 <button
  onClick={() =>
    navigate(`/dashboard/product-review/${product.id}`, {
      state: { product },
    })
  }
  className="flex justify-center items-center w-[102px] bg-[#7077FE] text-white py-3 rounded-lg font-medium hover:bg-[#5E65F6] transition-colors duration-200"
>
  View All
</button>
</div>
          
        </div>
        
      </div>
      
    </div>

    {/* recommended Products Section */}

 <div className="flex flex-col justify-center items-center gap-[34px] mt-8">
  <div className="flex flex-col gap-5">
    <h2 className="font-[Poppins] font-semibold text-[20px] leading-[30px] text-[#242E3A] text-center">
      Recommended products
    </h2>
 
        
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
        {products.map((product) => (
<ProductCard key={String(product.id)} product={{ ...product, id: String(product.id) }} />
        ))}
      </div>
      </div>
    </div>

    </div>

</main>

  );
}

export default ProductDetail;
