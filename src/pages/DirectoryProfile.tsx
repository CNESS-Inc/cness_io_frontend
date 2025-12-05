import { MapPin, Phone, Mail,Globe,Clock4, Music,BookOpen,Star,MessageSquareMoreIcon } from "lucide-react";
import { useState } from "react";

const DirectoryProfile = () => {
    const [expanded, setExpanded] = useState(false);
     const fullText =
    "Rachel Anderson is a dedicated Environmental Activist and Sustainability Consultant with over a decade of experience in driving eco-conscious initiatives. She has worked with nonprofits, businesses, and communities to design strategies that reduce environmental impact, promote renewable energy adoption, and create long-term sustainable growth.";
   const shortText = fullText.slice(0, 140) + "...";

 
    return (

      <>
      {/* Profile Section */}
       <main className="flex-1 p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
  <section className="bg-white rounded-xl p-4">
  <div className="flex items-start space-x-4">
    <img 
      src="https://static.codia.ai/image/2025-12-04/DUvvvgriSA.png" 
      alt="Profile" 
      className="w-20 h-20 rounded-full border border-[#ECEEF2]"
    />

    <div className="flex-1 space-y-4">
      <div className="space-y-2">
        <h2 className="text-xl font-[Poppins] font-semibold text-[#081021]">
          White House
        </h2>

        <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-1">
  {/* Filled stars */}
  {[1, 2, 3].map((i) => (
    <Star
      key={i}
      className="w-5 h-5 text-[#FACC15] fill-[#FACC15]"
      strokeWidth={1.5}
    />
  ))}

  {/* Empty stars */}
  {[4, 5].map((i) => (
    <Star
      key={i}
      className="w-5 h-5 text-[#94A3B8]"
      strokeWidth={1.5}
    />
  ))}
</div>
          <span className="text-black">3</span>
        </div>

        <p className="text-[#64748B] leading-6 font-['open_sans']">
{expanded ? fullText : shortText}

      <button
        onClick={() => setExpanded(!expanded)}
        className="text-[#F07EFF] font-['open_sans'] font-semibold ml-2"
      >
        {expanded ? "Read less" : "Read more"}
      </button>        </p>
      </div>

      <button className="bg-[#7077FE] text-white px-5 py-2 rounded-full font-semibold text-sm">
        Enquire now
      </button>
    </div>
  </div>
</section>
{/* User Information Section */}
<section className="bg-white rounded-xl p-4 space-y-4">
  <div className="flex items-center space-x-4">
    <div className="w-24 h-24 rounded-full overflow-hidden bg-white">
      <img 
        src="https://static.codia.ai/image/2025-12-04/s7mmhLwgmO.png" 
        alt="Annie Susan" 
        className="w-full h-full object-cover"
      />
    </div>

    <div className="flex-1">
      <h3 className="text-xl font-[Poppins] font-semibold text-[#081021]">
        Annie Susan
      </h3>

      <div className="flex items-center space-x-2 text-[#64748B] font-['open_sans']">
        <span>New York, US</span>
        <div className="w-1 h-1 bg-[#94A3B8] rounded-full font-['open_sans']" />
        <span>Member since 2012</span>
      </div>
    </div>
  </div>

  <div className="flex space-x-2">
    <div className="flex-1 space-y-1.5">
      <h4 className="font-[Poppins] font-medium text-black">Interests</h4>

      <div className="flex flex-wrap gap-1">
        {["Climate Action","Renewable Energy","Renewable Energy"].map((tag,i) => (
          <span 
            key={i}
            className="px-3 py-1.5 bg-[#F7F7F7] border border-[#ECEEF2] rounded-full text-xs text-[#64748B]"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>

    <div className="flex-1 space-y-1.5">
      <h4 className="font-[Poppins] font-medium text-black">Profession</h4>

      <div className="flex gap-2">
        {["UI/UX Designer","Developer"].map((job,i) => (
          <span 
            key={i}
            className="px-5 py-1 bg-[#F7F7F7] border border-[#ECEEF2] rounded-full text-xs text-[#64748B]"
          >
            {job}
          </span>
        ))}
      </div>
    </div>
  </div>

  <div className="flex items-center justify-between">
    <div className="flex items-center -space-x-2">
      {[
        "6FNQvZiNiL.png",
        "t6LGZBZTMj.png",
        "s7mmhLwgmO.png"
      ].map((img,i) => (
        <img
          key={i}
          src={`https://static.codia.ai/image/2025-12-04/${img}`}
          className="w-10 h-10 rounded-full border-2 border-white"
        />
      ))}

      <div className="w-10 h-10 bg-[#FFE4F5] rounded-full border-2 border-white flex items-center justify-center">
        <span className="text-[#F07EFF] font-bold text-sm">200+</span>
      </div>
    </div>

    <button className="bg-[#7077FE] text-white px-5 py-2 rounded-full font-semibold text-sm">
      Connect now
    </button>
  </div>
</section>
</div>
{/* Services Offered Section */}
<section className="bg-white rounded-xl p-4 space-y-4">
  <h3 className="text-xl font-[Poppins] font-semibold text-[#081021]">
    Services Offered
  </h3>

  <div className="flex items-center space-x-7">
    <span className="font-['open_sans'] font-semibold text-[#081021]">Dining</span>
    <span className="font-['open_sans'] font-semibold text-[#081021]">Birthday party</span>
    <span className="font-['open_sans'] font-semibold text-[#081021]">Marriage function</span>
  </div>
</section>
{/* Photos Section */}
<section className="bg-white border border-[#F7F7F7] rounded-xl p-4 space-y-4">
  <div className="flex items-end justify-between">
    <h3 className="text-xl font-[Poppins] font-semibold text-[#081021]">
      Photos
    </h3>

    <div className="flex items-center space-x-1.5 text-[#7077FE]">
      <span className="font-[Poppins] font-medium cursor-pointer">See all 33 photos</span>
      <svg className="w-3 h-2" viewBox="0 0 13 10" fill="currentColor">
        <path d="M8 1L12 5L8 9M12 5H1" />
      </svg>
    </div>
  </div>

  <div className="grid grid-cols-4 gap-3">
    {[
      "4rPZfWnzLm.png",
      "Z2nWUS4QM6.png",
      "hQf7tYJkFm.png",
      "1KVZ6bddpu.png"
    ].map((img, i) => (
      <div key={i} className="aspect-square bg-[#FFE4F5] rounded-lg overflow-hidden">
        <img
          src={`https://static.codia.ai/image/2025-12-04/${img}`}
          alt={`Photo ${i + 1}`}
          className="w-full h-full object-cover"
        />
      </div>
    ))}
  </div>
</section>
{/* Contact Information Section */}
<section className="bg-white rounded-xl p-4 space-y-4">
  <h3 className="text-xl font-[Poppins] font-semibold text-[#081021]">
    Contact Information
  </h3>
  
  <div className="space-y-4">

    {/* Address */}
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        
        <MapPin className="w-4 h-4 text-[#D1D5DB]" />
        <span className="font-['open_sans'] font-semibold text-[#081021]">Address</span>
      </div>
      <p className="font-['open_sans'] text-[14px] text-[#64748B]">
        D. No. 3-6-138/18 & 19, Main Road, Himayat Nagar, Bangalore - 500029 Karnataka 040 65240486
      </p>
    </div>

    {/* Phone */}
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Phone className="w-4 h-4 text-[#D1D5DB] fill-[#D1D5DB]" />
        <span className="font-['open_sans'] font-semibold text-[#081021]">Phone</span>
      </div>
      <p className="font-['open_sans'] text-[14px] text-[#64748B]">+1 (512) 704-9022</p>
    </div>

    {/* Email */}
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Mail className="w-4 h-4 text-[#D1D5DB]" />
        <span className="font-['open_sans'] font-semibold text-[#081021]">Email</span>
      </div>
      <p className="font-['open_sans'] text-[14px] text-[#64748B]">white@gmail.com</p>
    </div>

    {/* Website */}
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        
        <Globe className="w-4 h-4 text-[#D1D5DB]" />
        <span className="font-['open_sans'] font-semibold text-[#081021]">Website</span>
      </div>
      <p className="font-['open_sans'] text-[14px] text-[#64748B]">www.whitehouse.com</p>
    </div>

    {/* Business Timings */}
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        
 <div className="w-5 h-5 rounded-full bg-[#D1D5DB] flex items-center justify-center">
    <Clock4 className="w-5 h-5 text-white" />
  </div>
  <span className="font-['open_sans'] font-semibold text-[#081021]">Business timings</span>
      </div>

      <div className="flex space-x-7">
        <div className="font-['open_sans'] text-[14px] space-y-2 text-[#64748B]">
          <div>Sunday</div>
          <div>Monday</div>
          <div>Tuesday</div>
          <div>Wednesday</div>
          <div>Thursday</div>
          <div>Friday</div>
          <div>Saturday</div>
        </div>

        <div className="space-y-2 text-[#64748B]">
          <div>10:30AM - 10:00PM</div>
          <div>10:30AM - 10:00PM</div>
          <div>10:30AM - 10:00PM</div>
          <div>10:30AM - 10:00PM</div>
          <div>10:30AM - 10:00PM</div>
          <div>10:30AM - 10:00PM</div>
          <div>Closed</div>
        </div>
      </div>
    </div>

  </div>
</section>
{/* Best Practice Section */}

      <div className="grid grid-cols-2 gap-4">
<section className="bg-white rounded-xl p-4 space-y-2">
  <div className="flex items-center justify-between">
    <h3 className="text-xl font-[Poppins] font-semibold text-[#081021]">
      Best practice
    </h3>

    <span className="text-[#F07EFF] font-semibold text-xs cursor-pointer">
      View all
    </span>
  </div>

  <div className="space-y-3">
    {[1, 2, 3].map((item) => (
      <div
        key={item}
        className="bg-white border border-[#ECEEF2] rounded-xl p-3 flex space-x-2"
      >
        <img
          src="https://static.codia.ai/image/2025-12-04/MNKRO7KMHj.png"
          alt="Practice"
          className="w-[216px] h-[150px] rounded-lg object-cover"
        />

        <div className="flex-1 space-y-4">
          <div className="space-y-1">
            <h4 className="font-[Poppins] font-semibold text-[#1F2937]">
              Green Office Initiative
            </h4>

            <p className="font-['open_sans'] font-normal  text-[14px] text-[#1F2937] leading-relaxed">
              Use LED lighting, energy-saving devices, and smart thermostats to
              reduce electricity consumption.{" "} <br/>
              <span className="text-[#F07EFF]">Read More</span>
            </p>
          </div>

         <button className="bg-[#7077FE] text-white px-6 py-3 rounded-full font-Rubik font-normal text-[14px] leading-[100%] tracking-[0px] text-center capitalize">
  Follow
</button>
        </div>
      </div>
    ))}
  </div>
</section>

{/* Products Section */}
<section className="bg-white rounded-xl p-4 space-y-2">
  <div className="flex items-center justify-between">
    <h3 className="text-xl font-[Poppins] font-semibold text-[#081021]">
      Products
    </h3>

    <span className="text-[#F07EFF] font-semibold text-xs cursor-pointer">
      View all
    </span>
  </div>

  <div className="space-y-3">
    {[
      { image: "https://static.codia.ai/image/2025-12-04/LfjsJkrBT4.png", category: "Music" },
      { image: "https://static.codia.ai/image/2025-12-04/OTDmXfPyPn.png", category: "Ebook" },
      { image: "https://static.codia.ai/image/2025-12-04/DiYiGwZJoL.png", category: "Ebook" }
    ].map((product, index) => (
     <div
  key={index}
  className="bg-gradient-to-b from-[#F1F3FF] to-white border border-[#ECEEF2] rounded-xl p-4 flex space-x-4"
>
  {/* IMAGE + HEART WRAPPER */}
  <div className="relative">
    <img
      src={product.image}
      alt="Product"
      className="w-[196px] h-[156px] rounded-3xl object-cover"
    />

    {/* Heart Button Over Image */}
    <button className="absolute top-3 right-3 w-10 h-10 bg-[#1F2937] bg-opacity-90 rounded-full flex items-center justify-center shadow-md">
      <svg className="w-5 h-5 " viewBox="0 0 20 20" stroke="white">
        <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"/>
      </svg>
    </button>
  </div>

        {/* Content */}
        <div className="flex-1 space-y-2">
          <div className="space-y-1">

            {/* Category Badge */}
          <div className="inline-flex items-center space-x-3 bg-opacity-10 rounded-full px-3 py-1">
  <span
    className={`text-xs font-[Poppins] ${
      product.category === "Music" ? "text-[#F07EFF]" : "text-[#7077FE]"
    }`}
  >
    {product.category}
  </span>

  {/* ICONS BASED ON CATEGORY */}
  {product.category === "Music" ? (
  <Music
    className="w-4 h-4 text-[#F07EFF]"
    strokeWidth={2}
  />
) : (
  <BookOpen
    className="w-4 h-4 text-[#7077FE]"
    strokeWidth={2}
  />
)}
</div>

            {/* Title */}
            <h4 className="font-[Poppins] font-semibold text-[#1F2937]">
              Dance of Siddhars
            </h4>

            {/* Rating Section */}
            <div className="flex items-center space-x-2">
             <div className="flex space-x-1">
  {[1, 2, 3, 4, 5].map((star) => (
    <Star
      key={star}
      className="w-4 h-4 text-[#FACC15] fill-[#FACC15]"
      strokeWidth={1.2}
    />
  ))}
</div>

              <div className="flex items-center space-x-1">
                <MessageSquareMoreIcon className="w-4 h-4 text-[#9CA3AF]" />
                <span className="text-[#9CA3AF] font-[Poppins] font-medium">97</span>
              </div>
            </div>

            {/* Author */}
            <div className="flex items-center space-x-2">
              <img
                src="https://static.codia.ai/image/2025-12-04/EKAU1ouAu0.png"
                alt="Author"
                className="w-5 h-6 rounded-lg"
              />
              <span className=" font-['open_sans'] font-semibold text-xs text-[#1F2937]">Nandhiji</span>
            </div>
          </div>

          {/* Price + Button */}
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center space-x-3">
                <span className="text-[#9CA3AF] font-[Poppins] font-medium line-through">
                  $99.00
                </span>
                <div className="bg-[#EBF2FF] px-2 py-1 rounded text-xs font-Inter font-medium text-[#1E3A8A]">
                  -10%
                </div>
              </div>

              <div className="text-xl font-[Poppins] font-semibold text-[#1F2937]">
                $89.00
              </div>
            </div>

            <button className="bg-[#7077FE] text-white px-8 py-3 rounded-full font-Rubik font-normal text-[14px] leading-[100%] capitalize">
              Buy
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>
</section>
</div>
<section className="bg-white rounded-xl p-4 space-y-4">

  {/* Post Review Section */}
  <div className="space-y-4">
    <h3 className="text-lg font-[Poppins] font-semibold text-[#081021]">
      Post your review
    </h3>

    {/* Star Rating */}
    <div className="flex items-center space-x-3">
      <div className="flex items-center space-x-1">
  {/* Filled stars */}
  {[1, 2, 3].map((star) => (
    <Star
      key={star}
      className="w-5 h-5 text-[#FACC15] fill-[#FACC15]"
      strokeWidth={1.5}
    />
  ))}

  {/* Outlined stars */}
  {[4, 5].map((star) => (
    <Star
      key={star}
      className="w-5 h-5 text-[#9CA3AF]"
      strokeWidth={1.5}
    />
  ))}
</div>
      <span className="text-black text-sm">3</span>
    </div>

    {/* Comment Box */}
    <div className="space-y-2">
      <div className="border border-[#D1D5DB] rounded-2xl p-5 min-h-[170px] flex flex-col justify-between">
        <p className="font-['open_sans'] text-[#9CA3AF]">Post a comment...</p>

        <div className="flex justify-end items-end space-x-3">
          <div className="bg-white px-3 py-2 rounded-full">
            <span className="font-['open_sans'] text-[#9CA3AF] text-[12px]">
              2000 Characters remaining
            </span>
          </div>

          <button className="bg-gradient-to-r from-[#7077FE] to-[#F07EFF] text-white px-5 py-3 rounded-full font-[Poppins] font-semibold text-sm">
            Submit
          </button>
        </div>
      </div>

      <p className="font-['open_sans'] text-sm text-[#1F2937] leading-relaxed">
        Please note that this community is actively moderated according to
        <span className="text-[#6B21A8]"> CNESS community rules</span>
      </p>
    </div>
  </div>

  {/* Reviews List */}
  <div className="space-y-4">
    <h3 className="text-lg font-[Poppins] font-semibold text-[#081021]">
      All Reviews
    </h3>

    <div className="space-y-5">
      {[1, 2].map((review) => (
        <div key={review} className="bg-[#F9FAFB] rounded-lg p-4 space-y-5">

          {/* Reviewer + Comment */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="font-[Poppins] font-semibold text-black">
                John Doe
              </span>
              <div className="w-1.5 h-1.5 bg-[#9CA3AF] rounded-full"></div>
              <span className="font-['open_sans']  text-[#9CA3AF] text-xs">Today</span>
            </div>

            <p className="font-['open_sans'] text-xs text-[#1F2937] leading-relaxed">
              We should also take into consideration other factors in detecting hate
              speech. In case the algorithm mistakenly flags a comment as hate speech.
            </p>
          </div>

          {/* Like / Reply Section */}
          <div className="flex items-center space-x-2 p-2">
            
            {/* Like Icon */}
            <svg className="w-6 h-6 text-[#1F2937]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7.493 18.75c-.425 0-.82-.236-.975-.632A7.48 7.48 0 016 15.375c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75 2.25 2.25 0 012.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558-.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23h-.777z" />
            </svg>

            {/* Divider */}
            <div className="w-px h-5 bg-[#D1D5DB]"></div>

            {/* Reply Button */}
            <div className="flex items-center space-x-1 bg-transparent px-2 py-1 rounded-full">
              <svg className="w-6 h-6 text-[#1F2937]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.73 5.5h1.035A7.465 7.465 0 0118 9.625a7.465 7.465 0 01-1.235 4.125h-.148c-.806 0-1.534.446-2.031 1.08a9.04 9.04 0 01-2.861 2.4c-.723.384-1.35.956-1.653 1.715a4.498 4.498 0 00-.322 1.672V21a.75.75 0 01-.75.75 2.25 2.25 0 01-2.25-2.25c0-1.152.26-2.243.723-3.218C7.74 15.724 7.366 15 6.748 15H3.622c-1.026 0-1.945-.694-2.054-1.715A12.134 12.134 0 011.5 12c0-2.848.992-5.464 2.649-7.521C4.537 3.997 5.136 3.75 5.754 3.75h1.616c.483 0 .964.078 1.423.23l3.114 1.04a4.5 4.5 0 001.423.23h2.394z" />
              </svg>
              <span className="font-['open_sans'] text-[#1F2937] text-xs">Reply</span>
            </div>

          </div>

        </div>
      ))}
    </div>
  </div>

</section>
</main>
    
    </>
  )
}

export default DirectoryProfile
