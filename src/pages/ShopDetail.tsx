import { useLocation, useParams } from "react-router-dom";
import ProductCard from '../components/MarketPlace/ProductCard';
import ShopCard from '../components/MarketPlace/Shopcard';
//import React, { useRef,useState  } from "react";


const ShopDetail: React.FC = () => {
    const { id: _id } = useParams();

  const location = useLocation();
  const store = location.state; // this is the store data passed from navigate()

   const images = [
    "https://static.codia.ai/image/2025-10-24/d7xW9qdQUK.png",
    "https://static.codia.ai/image/2025-10-24/SEDLkWQHr8.png",
    "https://static.codia.ai/image/2025-10-24/TTQHFvLjNA.png",


  ]

const teamMembers = [
    {
      name: "Lenin",
      role: "Owner",
      image: "https://static.codia.ai/image/2025-10-24/Zf5XeKUZ30.png"
    },
    {
      name: "Shanmuga siva chidambaram",
      role: "Drumer",
      image: "https://static.codia.ai/image/2025-10-24/h0A1uia9VQ.png"
    },
    {
      name: "Venkatasubramanian",
      role: "Signer",
      image: "https://static.codia.ai/image/2025-10-24/55kUKtswcE.png"
    },
    {
      name: "Lenin",
      role: "Signer",
      image: "https://static.codia.ai/image/2025-10-24/ZjDsyhrnv7.png"
    }
  ]

const policies = [
    {
      title: "Refund policy",
      description: "48 hours from the time of purchase are allowed for refunds if a valid reason is provided.",
      icon: "https://static.codia.ai/image/2025-10-24/a00NtDv8Wz.png"
    },
    {
      title: "Licensing & Usage Policy",
      description: "Products include standard personal and commercial usage rights.",
      icon: "https://static.codia.ai/image/2025-10-24/10sgZadFOa.png"
    },
    {
      title: "Terms & Conditions",
      description: "Using this shop means you agree to our terms and conditions.",
      icon: "https://static.codia.ai/image/2025-10-24/Jt1ssOkNvo.png"
    }
  ]

  const categories = [
    { name: "Videos", count: 4, active: true },
    { name: "Podcasts", count: 3, active: false },
    { name: "Music", count: 3, active: false },
    { name: "Courses", count: 4, active: false }
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
const shops = [
    {
      id: 1,
      image: "https://static.codia.ai/image/2025-10-24/SeX9YKDnOo.png",
      name: "Red Tape",
      description: "Red Tape is a premium lifestyle and fashion brand known for its high-quality footwear, apparel, and accessories.",
      rating: 4.8,
      logo: "https://static.codia.ai/image/2025-10-24/rbKaFihKgE.png"
    },
    {
      id: 2,
      image: "https://static.codia.ai/image/2025-10-24/zsb3OSD4Mb.png",
      name: "Red Tape",
      description: "Red Tape is a premium lifestyle and fashion brand known for its high-quality footwear, apparel, and accessories.",
      rating: 4.8,
      logo: "https://static.codia.ai/image/2025-10-24/FHxbN55yap.png"
    },
    {
      id: 3,
      image: "https://static.codia.ai/image/2025-10-24/COYsFisEy4.png",
      name: "Red Tape",
      description: "Red Tape is a premium lifestyle and fashion brand known for its high-quality footwear, apparel, and accessories.",
      rating: 4.8,
      logo: "https://static.codia.ai/image/2025-10-24/JMEWUxwU2n.png"
    },
    {
      id: 4,
      image: "https://static.codia.ai/image/2025-10-24/JTVKiSmYDa.png",
      name: "Red Tape",
      description: "Red Tape is a premium lifestyle and fashion brand known for its high-quality footwear, apparel, and accessories.",
      rating: 4.8,
      logo: "https://static.codia.ai/image/2025-10-24/yZMZNXqr5b.png"
    },
    {
      id: 5,
      image: "https://static.codia.ai/image/2025-10-24/JTVKiSmYDa.png",
      name: "Red Tape",
      description: "Red Tape is a premium lifestyle and fashion brand known for its high-quality footwear, apparel, and accessories.",
      rating: 4.8,
      logo: "https://static.codia.ai/image/2025-10-24/yZMZNXqr5b.png"
    },
    { id: 6,
      image: "https://static.codia.ai/image/2025-10-24/JTVKiSmYDa.png",
      name: "Red Tape",
      description: "Red Tape is a premium lifestyle and fashion brand known for its high-quality footwear, apparel, and accessories.",
      rating: 4.8,
      logo: "https://static.codia.ai/image/2025-10-24/yZMZNXqr5b.png"
    }
  ]


   //const scrollRef = useRef<HTMLDivElement>(null);
  //const [scrollIndex, setScrollIndex] = useState(0);

  //const visibleCards = 5; // number of visible cards at once
  //const cardGap = 24; // gap between cards (in px)
  //const cardWidth = 300; // approximate card width
  //const totalCards = shops.length;

  //const scroll = (direction: "left" | "right") => {
    //if (!scrollRef.current) return;
    //const maxIndex = Math.max(0, totalCards - visibleCards);

    //let newIndex = scrollIndex;
   // if (direction === "right" && scrollIndex < maxIndex) newIndex++;
    //if (direction === "left" && scrollIndex > 0) newIndex--;

   // setScrollIndex(newIndex);
    //scrollRef.current.style.transform = `translateX(-${
    //  newIndex * (cardWidth + cardGap)
    //}px)`;
  //};

  return (

     <main>

    <div className="w-full h-auto ">
      <div className="w-full h-[340px] relative rounded-lg">
        <img
          src={store?.image || "https://via.placeholder.com/1200x340?text=No+Image"}
          alt={store?.name || "Store Image"}
          className="w-full h-full object-cover rounded-4xl"
        />
      </div>

{/* Shop Info Section */}
 <div className="bg-white/80 rounded-[30px] p-[18px] flex justify-between items-center gap-[27px] h-[162px] mt-8">
      <div className="flex items-center gap-6">
        <img 
          src={store.logo}
          alt="Red Tape Logo" 
          className="w-[125px] h-[125px] rounded-full object-cover"
        />
        
        <div className="flex flex-col gap-[14px]">
          <h1 className="font-['open_sans'] font-bold text-[22px] leading-[29.96px] text-[#1A1A1A]">
          {store?.name}
          </h1>
          
          <p className="font-['open_sans'] font-normal text-[14px] leading-[19.07px] text-[#665B5B] max-w-[645px]">
          {store?.description}
          </p>
          
          <div className="flex items-center gap-3">
            <div className="bg-[#7077FE]/10 rounded-full px-3 py-2 flex items-center gap-3">
              <img 
                src="https://static.codia.ai/image/2025-10-24/HYMtr97dRz.png" 
                alt="Products Icon" 
                className="w-[18px] h-[18px]"
              />
              <span className="font-['open_sans'] text-[12px] text-[#7077FE]">{store.products} products</span>
            </div>
            
            <div className="bg-[#7077FE]/10 rounded-full px-3 py-2 flex items-center gap-3">
              <img 
                src="https://static.codia.ai/image/2025-10-24/nJpNgLwgh9.png" 
                alt="Star Icon" 
                className="w-[18px] h-[18px]"
              />
              <span className="font-['open_sans'] text-[12px] text-[#7077FE]">{store.ratings} Ratings</span>
              <div className="w-[3px] h-[3px] bg-[#7077FE] rounded-full"></div>
              <span className="font-['open_sans'] text-[12px] text-[#7077FE]">{store.reviews} Reviews</span>
            </div>
            
            <div className="bg-[#7077FE]/10 rounded-full px-3 py-2 flex items-center gap-3">
              <img 
                src="https://static.codia.ai/image/2025-10-24/AXoOYUGFBm.png" 
                alt="Followers Icon" 
                className="w-[18px] h-[18px]"
              />
              <span className="font-['open_sans'] text-[12px] text-[#7077FE]">{store.followers} Followers</span>
            </div>
          </div>
        </div>
      </div>
      
      <button className="bg-[#7077FE] rounded-md px-5 py-[10px] flex items-center gap-[10px] h-12">
        <img 
          src="https://static.codia.ai/image/2025-10-24/xfP7JzOEXk.png" 
          alt="Follow Icon" 
          className="w-[22px] h-[22px]"
        />
        <span className="font-plus-jakarta font-medium text-[16px] leading-[20.16px] text-white">
          Follow
        </span>
      </button>
    </div>

{/* Image Gallery Section */}
<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6 mt-8">
      {images.map((image, index) => (
        <img 
          key={index}
          src={image} 
          alt={`Gallery Image ${index + 1}`} 
          className={`w-[360px] h-[200px] object-cover ${index > 0 ? 'rounded-[14px]' : ''}`}
        />
      ))}
    </div>

    <div className="bg-white rounded-[12px] shadow-[0px_4px_24px_rgba(0,0,0,0.1)] p-[30px_16px] flex flex-col gap-5 mt-8">
      <div className="flex flex-col gap-[13px]">
        <h2 className="font-[poppins] font-semibold text-[18px] leading-[27px] text-black">
          About the Red Tape
        </h2>
        
        <p className="font-['open_sans'] font-normal text-[16px] leading-[28px] text-[#1A1A1A]">
          Red Tape is a premium digital products brand dedicated to delivering high-quality, innovative, and engaging digital experiences. From eBooks and courses to creative tools and digital assets, Red Tape empowers creators, learners, and professionals to achieve their goals efficiently and creatively. Every product is carefully designed to combine usability, aesthetic appeal, and cutting-edge functionality.
        </p>
        
        <h3 className="font-[poppins] font-semibold text-[18px] leading-[27px] text-black">
          Why choose Red Tape?
        </h3>
        
       <div className="font-['open_sans'] font-normal text-[16px] leading-[28px] text-[#1A1A1A]">
  <ul className="list-disc list-inside space-y-2">
    <li>
      <strong>Premium Quality:</strong> Every digital product is curated with attention to detail, usability, and reliability.
    </li>
    <li>
      <strong>Innovation:</strong> Cutting-edge tools and content designed to inspire and streamline creativity.
    </li>
    <li>
      <strong>Accessible Learning:</strong> Digital solutions that make skill-building and professional growth easier and more engaging.
    </li>
    <li>
      <strong>Creative Freedom:</strong> Products that empower creators, learners, and professionals to unlock their full potential.
    </li>
  </ul>
</div>
        
        <h3 className="font-[poppins] font-semibold text-[18px] leading-[27px] text-black">
          Our Philosophy
        </h3>
        
        <p className="font-['open_sans'] font-normal text-[16px] leading-[28px] text-[#1A1A1A]">
          At Red Tape, we believe that digital products should not just serve a purpose—they should inspire, simplify, and elevate experiences. Our mission is to provide premium tools and resources that empower every user to create, learn, and grow with confidence.
        </p>
      </div>
      
      <div className="flex justify-between items-center gap-7">
        <div className="flex items-center gap-7">
          <div className="flex items-center gap-[6px]">
            <img 
              src="https://static.codia.ai/image/2025-10-24/aeJ6oQZQe1.png" 
              alt="Location Icon" 
              className="w-[22px] h-[22px]"
            />
            <span className="font-['open_sans'] font-semibold text-[16px] leading-[21.79px] text-black">Based in :</span>
            <span className="font-['open_sans'] font-normal text-[16px] leading-[21.79px] text-[#665B5B]">Berlin, Germany</span>
          </div>
          
          <div className="flex items-center gap-[6px]">
            <img 
              src="https://static.codia.ai/image/2025-10-24/CWY7KgB5yL.png" 
              alt="Globe Icon" 
              className="w-[22px] h-[22px]"
            />
            <span className="font-['open_sans'] font-semibold text-[16px] leading-[21.79px] text-black">Languages :</span>
            <span className="font-['open_sans'] font-normal text-[16px] leading-[21.79px] text-[#665B5B]">English, German</span>
          </div>
          
          <div className="flex items-center gap-[6px]">
            <img 
              src="https://static.codia.ai/image/2025-10-24/BxwyA2MPUa.png" 
              alt="Calendar Icon" 
              className="w-[22px] h-[22px]"
            />
            <span className="font-['open_sans'] font-semibold text-[16px] leading-[21.79px] text-black">Active since :</span>
            <span className="font-['open_sans'] font-normal text-[16px] leading-[21.79px] text-[#665B5B]">2022</span>
          </div>
        </div>
        
       <div className="flex items-center justify-center gap-3">
  {/* Icon 1 */}
  <img
    src="https://static.codia.ai/image/2025-10-24/DkkkDo5pSA.png"
    alt="Social 1"
    className="w-[42px] h-[42px] transition-transform duration-200 hover:-translate-y-1"
  />

  {/* Icon 2 (Center One - turns blue) */}
  <img
    src="https://static.codia.ai/image/2025-10-24/dnWhurmOVu.png"
    alt="Instagram"
    className="w-[42px] h-[42px] transition-all duration-200 hover:-translate-y-1 "
  />

  {/* Icon 3 */}
  <img
    src="https://static.codia.ai/image/2025-10-24/WhMx4W3dxp.png"
    alt="Facebook"
    className="w-[42px] h-[42px] transition-transform duration-200 hover:-translate-y-1"
  />

  {/* Icon 4 */}
  <img
    src="https://static.codia.ai/image/2025-10-24/9sq5BdMs5X.png"
    alt="X"
    className="w-[42px] h-[42px] transition-transform duration-200 hover:-translate-y-1"
  />

  {/* Icon 5 */}
  <img
    src="https://static.codia.ai/image/2025-10-24/H0z7zoPZA7.png"
    alt="YouTube"
    className="w-[42px] h-[42px] transition-transform duration-200 hover:-translate-y-2"
  />
</div>
      </div>
    </div>

    {/*team menbers*/}
<div className="bg-white rounded-[12px] shadow-[0px_4px_24px_rgba(0,0,0,0.1)] p-[20px_16px] flex flex-col gap-[10px] mt-8">
      <h2 className="font-[poppins] font-semibold text-[20px] leading-[30px] text-[#242E3A]">
        Our Team
      </h2>
      
      <div className="flex items-center gap-5 flex-wrap">
        {teamMembers.map((member, index) => (
          <div key={index} className="bg-[#7077FE]/10 rounded-[10px] px-3 py-2 flex items-center gap-2">
            <img 
              src={member.image} 
              alt={member.name} 
              className="w-[40px] h-[40px] rounded-full object-cover"
            />
            <span className="font-['open_sans'] text-[12px] text-[#7077FE]">{member.name}</span>
            <div className="w-[3px] h-[3px] bg-[#7077FE] rounded-full"></div>
            <span className="font-['open_sans'] text-[12px] text-[#665B5B]">{member.role}</span>
          </div>
        ))}
      </div>
    </div>


    <div className="bg-white rounded-[12px] shadow-[0px_4px_24px_rgba(0,0,0,0.1)] p-[20px_16px] flex flex-col gap-[10px] mt-8">
      <h2 className="font-[poppins] font-semibold text-[20px] leading-[30px] text-[#242E3A]">
        Store policy
      </h2>
      
      <div className="flex items-center gap-4">
        {policies.map((policy, index) => (
          <div key={index} className="bg-white border border-[#CBD5E1] rounded-[20px] p-[20px_16px] flex flex-col gap-2 flex-1">
            <div className="flex items-center gap-[10px]">
              <img 
                src={policy.icon} 
                alt={policy.title} 
                className="w-[40px] h-[40px]"
              />
              <h3 className="font-open-sans font-semibold text-[18px] leading-[24.51px] text-[#1A1A1A]">
                {policy.title}
              </h3>
            </div>
            <p className="font-open-sans font-normal text-[14px] leading-[19.07px] text-[#665B5B]">
              {policy.description}
            </p>
          </div>
        ))}
      </div>
    </div>
{/* Products Section */}

      {/* Products Grid */}

        <div className="flex flex-col justify-center items-center gap-[34px] mt-8">
      <div className="flex flex-col gap-5">
        <h2 className="font-[poppins] font-semibold text-[20px] leading-[30px] text-[#242E3A]">
          Featured products
        </h2>

 {/* Category Tabs */}
        <div className="flex flex-wrap gap-4">
  {categories.map((category, index) => (
    <button
      key={index}
      className={`flex items-center gap-3 px-8 py-3 h-[54px] rounded-full border font-medium text-sm transition-all duration-200 ${
        category.active
          ? "border-blue-500 text-blue-500 bg-white shadow-sm"
          : "border-gray-300 text-gray-500 bg-white hover:border-gray-400"
      }`}
    >
      {/* Category Name */}
      <span>{category.name}</span>

      {/* Count Badge */}
      {category.count !== undefined && (
        <span
          className={`text-xs px-2 py-0.5 rounded-full ${
            category.active
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          {category.count}
        </span>
      )}
    </button>
  ))}
</div>
        
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
        {products.map((product) => (
<ProductCard key={String(product.id)} product={{ ...product, id: String(product.id) }} />
        ))}
      </div>
      </div>
    </div>

    {/* Related Shops Section */}
<div className="flex flex-col gap-6 px-1 sm:px-1 lg:px-1">
  {/* Header Section */}
  <div className="flex flex-wrap justify-between items-center gap-4">
    <h2 className="font-['Poppins'] font-semibold text-[18px] sm:text-[20px] lg:text-[22px] leading-[30px] text-[#242E3A]">
      Related Shops
    </h2>

    <div className="flex items-center gap-4 sm:gap-5">
      <button className="w-8 h-8 sm:w-9 sm:h-9 hover:scale-110 transition-transform duration-200">
        <img
          src="https://static.codia.ai/image/2025-10-24/zRKX6S2Fpz.png"
          alt="Previous"
          className="w-full h-full"
        />
      </button>
      <button className="w-8 h-8 sm:w-9 sm:h-9 hover:scale-110 transition-transform duration-200">
        <img
          src="https://static.codia.ai/image/2025-10-24/M6ufGZhDyb.png"
          alt="Next"
          className="w-full h-full"
        />
      </button>
    </div>
  </div>

  {/* ✅ Responsive Grid Section */}
  <div
    className="
      grid
      grid-cols-1
      sm:grid-cols-2
      md:grid-cols-3
      lg:grid-cols-4
      xl:grid-cols-5
      2xl:grid-cols-5
      gap-5
      sm:gap-6
      md:gap-8
    "
  >
    {shops.map((shop, index) => (
      <ShopCard key={index} {...shop} />
    ))}
  </div>
</div>
      {/*<div className="px-10 py-8">
        <h1 className="text-3xl font-semibold text-gray-900">{store?.name}</h1>
        <p className="text-gray-600 mt-4 text-base max-w-3xl">{store?.description}</p>
      </div>*/}
    </div>
    </main>
  );
};

export default ShopDetail;
