import React,{ useState } from "react";
import { useNavigate } from "react-router-dom";
import StoryCard from "../components/Social/StoryCard";
import {  VideoIcon, ImageIcon, ListIcon,ChevronRight,ChevronLeft,Share2 } from "lucide-react";

// images
import Announcement from "../assets/Announcement.png";
import Collection from "../assets/Collection.png";
import Leaderboard from "../assets/Leaderboard.png";
import Mention from "../assets/Mention.png";
import people from "../assets/people.png";
import Trending from "../assets/Trending.png";
import createstory from "../assets/createstory.jpg";
import carosuel4 from "../assets/carosuel4.png";
import carosuel2 from "../assets/carosuel2.png";
import carosuel3 from "../assets/carosuel3.png";
import carosuel1 from "../assets/carosuel1.png";
import like from "../assets/like.png";
import Like1 from "../assets/Like1.png";
import comment from "../assets/comment.png";
import comment1 from "../assets/comment1.png";
import repost from "../assets/repost.png";
import repost1 from "../assets/repost1.png";
import chasing from "../assets/chasing.png";
import Bcard1 from "../assets/Bcard1.png";
import Bcard2 from "../assets/Bcard2.png";
import Bcard3 from "../assets/Bcard3.png";



const curatedCards = [
  {
    id: 1,
    title: "Chasing Dreams",
    subtitle: "By The Dreamers",
    duration: "4.05 Min",
    image: chasing
  },
  {
    id: 2,
    title: "Into the Wild",
    subtitle: "By Nature’s Voice",
    duration: "5.20 Min",
    image: Bcard1,
  },
  {
    id: 3,
    title: "Rise Up and Shine",
    subtitle: "By Selena",
    duration: "3.10 Min",
    image: Bcard2
},

  {
    id: 3,
    title: "Rise Up and Shine",
    subtitle: "By Selena",
    duration: "3.10 Min",
    image: Bcard3
},

];

const storyList = [
  {
    id: "101",
    userIcon: "/avatars/liam.jpg",
    userName: "Liam Anderson",
    title: "Chasing Dreams",
    videoSrc: "/consciousness_social_media.mp4",
  },
  {
    id: "102",
    userIcon: "/avatars/noah.jpg",
    userName: "Noah Thompson",
    title: "Into the Clouds",
    videoSrc: "/test1.mp4",
  },
  {
    id: "103",
    userIcon: "/avatars/oliver.jpg",
    userName: "Oliver Bennett",
    title: "Zen & Peace",
    videoSrc: "/consciousness_social_media.mp4",
  },
  {
    id: "104",
    userIcon: "/avatars/lucas.jpg",
    userName: "Lucas Mitchell",
    title: "Walking Free",
    videoSrc: "/test1.mp4",
  },

    {
    id: "105",
    userIcon: "/avatars/lucas.jpg",
    userName: "Lucas Mitchell",
    title: "Walking Free",
    videoSrc: "/test1.mp4",
  },
];
function PostCarousel() {
  const images = [carosuel1, carosuel2, carosuel3, carosuel4];
  const [current, setCurrent] = useState(0);

  // Auto slide every 3 seconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  const handlePrev = () => {
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

  return (
    <div className="relative w-full rounded-lg overflow-hidden">
      <img
        src={images[current]}
        alt={`Slide ${current}`}
        className="w-full object-cover max-h-[300px] transition duration-500 rounded-lg"
      />

      {/* Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white shadow-md w-8 h-8 rounded-full flex items-center justify-center"
      >
   <ChevronLeft size={20} />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white shadow-md w-8 h-8 rounded-full flex items-center justify-center"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dots */}
      <div className="flex justify-center gap-1 mt-2">
        {images.map((_, idx) => (
          <span
            key={idx}
            className={`w-2 h-2 rounded-full ${
              idx === current ? "bg-indigo-500" : "bg-gray-300"
            }`}
          ></span>
        ))}
      </div>
    </div>
  );
}


//const [isExpanded, setIsExpanded] = useState(false);
//const toggleExpand = () => setIsExpanded(!isExpanded);

export default function SocialTopBar() {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpand = () => setIsExpanded(!isExpanded);
  return (
    <div className="flex flex-col md:flex-row justify-between gap-6 px-4 md:px-6">
      {/* Left Side: Post & Stories */}
      <div className="flex-1">
        {/* Start a Post */}
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-xl mb-5">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-4">
              <img
                src={createstory}
                alt="User"
                className="w-10 h-10 rounded-full object-cover"
              />
              <input
                type="text"
                placeholder="Start a Post"
                className="flex-1 px-4 py-2 rounded-full border border-gray-300 text-[16px] focus:outline-none bg-white"
              />
            </div>
            <div className="flex justify-center gap-10 text-[15px] text-gray-700">
              <button className="flex items-center gap-1 text-yellow-600">
                <VideoIcon size={16} /> Video
              </button>
              <button className="flex items-center gap-1 text-purple-600">
                <ImageIcon size={16} /> Photo
              </button>
              <button className="flex items-center gap-1 text-indigo-600">
                <ListIcon size={16} /> List
              </button>
            </div>
          </div>
        </div>

        {/* Story Strip Wrapper */}
        <div className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory mt-4">
          {/* Create Story Card */}
          <div
            onClick={() => navigate("/social/story/create")}
            className="w-[164px] h-[214px] rounded-[12px] overflow-hidden relative cursor-pointer shrink-0 snap-start"
          >
            <img
              src={createstory}
              alt="Create Story Background"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <svg
              viewBox="0 0 162 70"
              preserveAspectRatio="none"
              className="absolute bottom-0 left-0 w-full h-[70px] z-10"
            >
              <path
                d="M0,0 H61 C65,0 81,22 81,22 C81,22 97,0 101,0 H162 V70 H0 Z"
                fill="#7C81FF"
              />
            </svg>
            <div className="absolute bottom-[46px] left-1/2 -translate-x-1/2 z-20 w-10 h-10 bg-white text-[#7C81FF] rounded-full flex items-center justify-center text-xl shadow-md">
              +
            </div>
            <div className="absolute bottom-[14px] w-full text-center text-white text-[15px] font-medium z-20">
              Create Story

              
            </div>
             <div className="w-full border-t-[5px] border-[#7C81FF] mt-4"></div>   
          </div>


          {storyList.map((story) => (
  <div
    key={story.id}
    className="w-[162px] h-[214px] snap-start shrink-0 rounded-[12px] overflow-hidden relative"
  >
    {/* Background video or image */}
    <StoryCard {...story} />

    {/* Avatar + Name Overlay */}
    <div className="absolute bottom-2 left-2 flex items-center gap-2 z-20 text-white">
      <img
        src={story.userIcon}
        alt={story.userName}
        className="w-6 h-6 rounded-full object-cover border border-white"
      />
      <span className="text-[13px] font-medium drop-shadow-sm">{story.userName}</span>
      
    </div>
  </div>
))}


        </div>
        <div className="w-full border-t-[1px] border-[#C8C8C8] mt-8"></div>
 {/* secion1 */}
<div className="bg-white rounded-xl shadow-md p-4 w-full max-w-full  mx-auto mt-6">
  {/* Header */}
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <img src="/avatars/olivia.jpg" className="w-10 h-10 rounded-full" alt="User" />
      <div>
        <p className="font-semibold text-gray-800">Olivia Gracia <span className="text-gray-500 text-sm">@oliviagracia</span></p>
        <p className="text-sm text-gray-400">2 hours ago</p>
      </div>
    </div>
<button className="flex items-center gap-2 text-xs text-indigo-500 font-medium">
      <img src={Trending} className="w-5 h-5" />
  Following
</button>
  </div>

  {/* Post Image Carousel */}
  <div className="relative mt-4 rounded-lg overflow-hidden">
<PostCarousel />    {/* Carousel arrows (static here) */}
   
  </div>

  {/* Reactions */}
  <div className="flex justify-between items-center mt-4 px-1 text-sm text-gray-600">
    <div className="flex items-center gap-2">
<div className="flex items-center -space-x-3">
  {/* Like */}
  <div className="w-8 h-8  flex items-center justify-center">
    <img src={like} alt="Like" className="w-8 h-8" />
  </div>

  {/* Comment */}
  <div className="w-8 h-8  flex items-center justify-center">
    <img src={comment} alt="Comment" className="w-8 h-8" />
  </div>

  {/* Repost */}
  <div className="w-8 h-8 flex items-center justify-center">
    <img src={repost} alt="Repost" className="w-8 h-8" />
  </div>

  {/* Count */}
  <span className="text-sm text-gray-500 pl-5">421K</span>
</div>
      <span>421K</span>
    </div>
    <span>45 Comments</span>
  </div>

  {/* Action Buttons */}
<div className="grid grid-cols-4 gap-4 mt-5">
  <button className="flex items-center justify-center gap-2 px-4 py-2 border border-[#E5E7EB] rounded-xl text-base text-blue-500 hover:bg-blue-50 shadow-sm">
       <img src={Like1}  className="w-6 h-6 " /> Like
    </button>
  <button className="flex items-center justify-center gap-2 px-4 py-2 border border-[#E5E7EB] rounded-xl text-base text-blue-500 hover:bg-blue-50 shadow-sm">
            <img src={comment1}  className="w-6 h-6 " /> Comments

    </button>
  <button className="flex items-center justify-center gap-2 px-4 py-2 border border-[#E5E7EB] rounded-xl text-base text-blue-500 hover:bg-blue-50 shadow-sm">
            <img src={repost1}  className="w-6 h-6 " /> Repost
    </button>
  <button className="flex items-center justify-center gap-2 px-4 py-2 border border-[#E5E7EB] rounded-xl text-base text-purple-500 hover:bg-blue-50 shadow-sm">
  <Share2 size={20} />
    </button>
  </div>
</div>

{/* section2 */}

<div className="bg-white rounded-xl shadow-md p-4 w-full max-w-full  mx-auto mt-6">
  {/* Header */}
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <img src="/avatars/olivia.jpg" className="w-10 h-10 rounded-full" alt="User" />
     <div>
            <p className="font-medium text-gray-800">Sophia Martinez</p>
            <p className="text-sm text-gray-500">62.3k followers</p>
          </div>
    </div>
<button className="text-sm px-3 py-1 rounded-full bg-[#7C81FF] text-white hover:bg-indigo-600">
          + Follow
        </button>

  </div>

  {/* Post Image Carousel */}
  <div className="relative mt-4 rounded-lg overflow-hidden">
 <p className="text-sm text-gray-700 leading-snug">
        {isExpanded ? (
          <>
            Sustainability has become a transformative force in the cosmetics
            industry, reshaping its landscape and compelling brands to
            reevaluate their practices. With increasing consumer awareness and
            a growing demand for environmentally conscious products, cosmetic
            companies are undergoing a profound shift towards sustainability.
            <br />
            <br />
            This evolution encompasses various facets, from ingredient sourcing
            to packaging design and production processes. Many brands are now
            prioritizing the use of eco-friendly, cruelty-free, and ethically
            sourced ingredients, embracing transparency in their supply chains.
            <br />
            <br />
            Furthermore, there is a noticeable emphasis on minimizing
            environmental impact through innovative packaging solutions, such as
            recyclable materials and reduced plastic usage. The concept of
            sustainability has not only become a market differentiator but also
            a fundamental aspect influencing the entire life cycle of cosmetic
            products.
          </>
        ) : (
          <>
            Sustainability has become a transformative force in the cosmetics
            industry, reshaping its landscape and compelling brands to
            reevaluate their practices...
          </>
        )}
        <button
          onClick={toggleExpand}
          className="text-blue-500 ml-1 text-xs font-medium"
        >
          {isExpanded ? "See less" : "See more >>"}
        </button>
      </p>

   
  </div>

  {/* Reactions */}
  <div className="flex justify-between items-center mt-4 px-1 text-sm text-gray-600">
    <div className="flex items-center gap-2">
<div className="flex items-center -space-x-3">
  {/* Like */}
  <div className="w-8 h-8  flex items-center justify-center">
    <img src={like} alt="Like" className="w-8 h-8" />
  </div>

  {/* Comment */}
  <div className="w-8 h-8  flex items-center justify-center">
    <img src={comment} alt="Comment" className="w-8 h-8" />
  </div>

  {/* Repost */}
  <div className="w-8 h-8 flex items-center justify-center">
    <img src={repost} alt="Repost" className="w-8 h-8" />
  </div>

  {/* Count */}
  <span className="text-sm text-gray-500 pl-5">421K</span>
</div>
      <span>421K</span>
    </div>
    <span>45 Comments</span>
  </div>

  {/* Action Buttons */}
<div className="grid grid-cols-4 gap-4 mt-5">
  <button className="flex items-center justify-center gap-2 px-4 py-2 border border-[#E5E7EB] rounded-xl text-base text-blue-500 hover:bg-blue-50 shadow-sm">
       <img src={Like1}  className="w-6 h-6 " /> Like
    </button>
  <button className="flex items-center justify-center gap-2 px-4 py-2 border border-[#E5E7EB] rounded-xl text-base text-blue-500 hover:bg-blue-50 shadow-sm">
            <img src={comment1}  className="w-6 h-6 " /> Comments

    </button>
  <button className="flex items-center justify-center gap-2 px-4 py-2 border border-[#E5E7EB] rounded-xl text-base text-blue-500 hover:bg-blue-50 shadow-sm">
            <img src={repost1}  className="w-6 h-6 " /> Repost
    </button>
  <button className="flex items-center justify-center gap-2 px-4 py-2 border border-[#E5E7EB] rounded-xl text-base text-purple-500 hover:bg-blue-50 shadow-sm">
  <Share2 size={20} />
    </button>
  </div>
</div>

  {/* section3 */}
<div className="bg-white rounded-xl shadow-md p-4 w-full max-w-full  mx-auto mt-6">
  {/* Header */}
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <img src="/avatars/olivia.jpg" className="w-10 h-10 rounded-full" alt="User" />
     <div>
            <p className="font-medium text-gray-800">Luna Martinez</p>
            <p className="text-sm text-gray-500">62.3k followers</p>
          </div>
    </div>
<button className="text-sm px-3 py-1 rounded-full bg-[#7C81FF] text-white hover:bg-indigo-600">
          + Follow
        </button>

  </div>

  {/* Post Image Carousel */}
  <div className="relative mt-4 rounded-lg overflow-hidden">
 
{/* Post Image Carousel */}
<div className="relative mt-4 rounded-lg overflow-hidden">
  <video
    className="w-full h-[405] rounded-lg  "
    controls
    muted
    autoPlay
    loop
  >
    <source src="/consciousness_social_media.mp4" type="video/mp4" />
    Your browser does not support the video tag.
  </video>
</div>
   
  </div>

  {/* Reactions */}
  <div className="flex justify-between items-center mt-4 px-1 text-sm text-gray-600">
    <div className="flex items-center gap-2">
<div className="flex items-center -space-x-3">
  {/* Like */}
  <div className="w-8 h-8  flex items-center justify-center">
    <img src={like} alt="Like" className="w-8 h-8" />
  </div>

  {/* Comment */}
  <div className="w-8 h-8  flex items-center justify-center">
    <img src={comment} alt="Comment" className="w-8 h-8" />
  </div>

  {/* Repost */}
  <div className="w-8 h-8 flex items-center justify-center">
    <img src={repost} alt="Repost" className="w-8 h-8" />
  </div>

  {/* Count */}
  <span className="text-sm text-gray-500 pl-5">421K</span>
</div>
      <span>421K</span>
    </div>
    <span>45 Comments</span>
  </div>

  {/* Action Buttons */}
<div className="grid grid-cols-4 gap-4 mt-5">
  <button className="flex items-center justify-center gap-2 px-4 py-2 border border-[#E5E7EB] rounded-xl text-base text-blue-500 hover:bg-blue-50 shadow-sm">
       <img src={Like1}  className="w-6 h-6 " /> Like
    </button>
  <button className="flex items-center justify-center gap-2 px-4 py-2 border border-[#E5E7EB] rounded-xl text-base text-blue-500 hover:bg-blue-50 shadow-sm">
            <img src={comment1}  className="w-6 h-6 " /> Comments

    </button>
  <button className="flex items-center justify-center gap-2 px-4 py-2 border border-[#E5E7EB] rounded-xl text-base text-blue-500 hover:bg-blue-50 shadow-sm">
            <img src={repost1}  className="w-6 h-6 " /> Repost
    </button>
  <button className="flex items-center justify-center gap-2 px-4 py-2 border border-[#E5E7EB] rounded-xl text-base text-purple-500 hover:bg-blue-50 shadow-sm">
  <Share2 size={20} />
    </button>
  </div>
</div>


  {/* section4 */}


<div className="bg-white rounded-xl shadow-md p-4 w-full max-w-full  mx-auto mt-6">
  {/* Header */}
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <img src="/avatars/olivia.jpg" className="w-10 h-10 rounded-full" alt="User" />
     <div>
            <p className="font-medium text-gray-800">Selena Gomez</p>
            <p className="text-sm text-gray-500">62.3k followers</p>
          </div>
    </div>
<button className="flex items-center gap-2 text-xs text-indigo-500 font-medium">
      <img src={Trending} className="w-5 h-5" />
  Following
</button>

  </div>

  {/* Post Image Carousel */}
  <div className="relative mt-4 rounded-lg overflow-hidden">
<p className="text-[15px] text-[#081021] font-medium mb-3">
  I just curated a movies list and a music playlist, check it out!
</p> 
<div className="flex gap-4 overflow-x-auto mt-4 scrollbar-hide">
  {curatedCards.map((item) => (
    <div
      key={item.id}
      className="w-[230px] shrink-0 bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition duration-300"
    >
      <img
        src={item.image}
        alt={item.title}
        className="w-full h-[130px] object-cover rounded-t-2xl"
      />

      <div className="p-3 space-y-1">
        {/* Title + Duration */}
        <div className="flex justify-between items-center">
          <h4 className="text-[15px] font-semibold text-gray-900 truncate">{item.title}</h4>
          <span className="text-[13px] font-semibold text-indigo-500">{item.duration}</span>
        </div>

        {/* Subtitle */}
        <p className="text-[13px] text-gray-500 truncate">By {item.subtitle}</p>
  </div>
</div>
      ))}
    </div>
   
  </div>

  {/* Reactions */}
  <div className="flex justify-between items-center mt-4 px-1 text-sm text-gray-600">
    <div className="flex items-center gap-2">
<div className="flex items-center -space-x-3">
  {/* Like */}
  <div className="w-8 h-8  flex items-center justify-center">
    <img src={like} alt="Like" className="w-8 h-8" />
  </div>

  {/* Comment */}
  <div className="w-8 h-8  flex items-center justify-center">
    <img src={comment} alt="Comment" className="w-8 h-8" />
  </div>

  {/* Repost */}
  <div className="w-8 h-8 flex items-center justify-center">
    <img src={repost} alt="Repost" className="w-8 h-8" />
  </div>

  {/* Count */}
  <span className="text-sm text-gray-500 pl-5">421K</span>
</div>
      <span>421K</span>
    </div>
    <span>45 Comments</span>
  </div>

  {/* Action Buttons */}
<div className="grid grid-cols-4 gap-4 mt-5">
  <button className="flex items-center justify-center gap-2 px-4 py-2 border border-[#E5E7EB] rounded-xl text-base text-blue-500 hover:bg-blue-50 shadow-sm">
       <img src={Like1}  className="w-6 h-6 " /> Like
    </button>
  <button className="flex items-center justify-center gap-2 px-4 py-2 border border-[#E5E7EB] rounded-xl text-base text-blue-500 hover:bg-blue-50 shadow-sm">
            <img src={comment1}  className="w-6 h-6 " /> Comments

    </button>
  <button className="flex items-center justify-center gap-2 px-4 py-2 border border-[#E5E7EB] rounded-xl text-base text-blue-500 hover:bg-blue-50 shadow-sm">
            <img src={repost1}  className="w-6 h-6 " /> Repost
    </button>
  <button className="flex items-center justify-center gap-2 px-4 py-2 border border-[#E5E7EB] rounded-xl text-base text-purple-500 hover:bg-blue-50 shadow-sm">
  <Share2 size={20} />
    </button>
  </div>
</div>

</div>


      {/* Right Side: Quick Actions */}
      <div className="w-[279px] h-[438px] bg-white rounded-[12px] pt-6 pb-6 px-3 shadow-sm">
        <h3 className="text-gray-700 font-semibold mb-4">Quick Actions</h3>
        <ul className="space-y-8 text-[15px] text-gray-700">
          <li className="flex items-center gap-2 hover:text-purple-700 cursor-pointer">
            <img src={Trending} className="w5 h-5" /> Trending
          </li>
          <li className="flex items-center gap-2 hover:text-purple-700 cursor-pointer">
            <img src={Mention} className="w5 h-5" /> Mention & tags
          </li>
          <li className="flex items-center gap-2 hover:text-purple-700 cursor-pointer">
            <img src={Collection} className="w5 h-5" /> My Collection
          </li>
          <li className="flex items-center gap-2 hover:text-purple-700 cursor-pointer">
            <img src={people} className="w5 h-5" /> People you follow
          </li>
          <li className="flex items-center gap-2 hover:text-purple-700 cursor-pointer">
            <img src={Leaderboard} className="w5 h-5" /> Leaderboard
          </li>
          <li className="flex items-center gap-2 hover:text-purple-700 cursor-pointer">
            <img src={Announcement} className="w5 h-5" /> Announcements
          </li>
        </ul>
        
      </div>

    </div>
  );
}
