//import React from 'react'
//import MoodGrid from '../components/MarketPlace/MoodGrid';
import Header from   '../components/MarketPlace/Marketheader';
import happy from "../assets/happy.svg";
import motivated from "../assets/motivated.svg";
import calm from "../assets/calm.svg";
import creative from "../assets/creative.svg";
import sad from "../assets/sad.svg";
import spiritual from "../assets/Spitirtual.svg";
import energy from "../assets/energy.svg";
import MoodSelector from '../components/MarketPlace/MoodSelector';
import ProductCard from '../components/MarketPlace/ProductCard';
import digital from "../assets/digital.svg";
import Button from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import ShopCard from '../components/MarketPlace/Shopcard';

const MarketPlaceNew = ({ isMobileNavOpen }: { isMobileNavOpen?: boolean }) => {
 const navigate = useNavigate();
const categories = [
    { name: 'Videos', active: true },
    { name: 'Podcasts', active: false },
    { name: 'Music', active: false },
    { name: 'Arts', active: false },
    { name: 'Ebooks', active: false },
    { name: 'Courses', active: false },
  ]

const products = [
    {
      id: 1,
      image: 'https://static.codia.ai/image/2025-10-15/oXL6MSyn60.png',
      title: 'Soft guitar moods that heals your inner pain',
      author: 'by Redtape',
      rating: 4.2,
      reviews: 123,
      originalPrice: 2444,
      currentPrice: 1299,
      discount: 50,
      duration: '00:23:00',
      category: '🎨 creative'
    },
    {
      id: 2,
      image: 'https://static.codia.ai/image/2025-10-15/uPxjuzQ1CY.png',
      title: 'Soft guitar moods that heals your inner pain',
      author: 'by Redtape',
      rating: 4.7,
      reviews: 123,
      currentPrice: 1299,
      duration: '00:23:00',
      category: '🕊️ Peaceful'
    },
    {
      id: 3,
      image: 'https://static.codia.ai/image/2025-10-15/TjuDo2nfP0.png',
      title: 'Soft guitar moods that heals your inner pain',
      author: 'by Redtape',
      rating: 4.8,
      reviews: 123,
      originalPrice: 2444,
      currentPrice: 1299,
      discount: 50,
      duration: '00:23:00',
      category: '🙏 Grateful'
    },
    {
      id: 4,
      image: 'https://static.codia.ai/image/2025-10-15/VM7Quny2Gp.png',
      title: 'Soft guitar moods that heals your inner pain',
      author: 'by Redtape',
      rating: 4.5,
      reviews: 123,
      originalPrice: 2444,
      currentPrice: 1299,
      discount: 50,
      duration: '00:23:00',
      category: '🧘 Spiritual'
    },
    {
      id: 5,
      image: 'https://static.codia.ai/image/2025-10-15/d9CJZoEQeE.png',
      title: 'Soft guitar moods that heals your inner pain',
      author: 'by Redtape',
      rating: 4,
      reviews: 123,
      originalPrice: 2444,
      currentPrice: 1299,
      discount: 50,
      duration: '00:23:00',
      category: '🕊️ Peaceful'
    },
    {
      id: 6,
      image: 'https://static.codia.ai/image/2025-10-15/2RXhPHX82C.png',
      title: 'Soft guitar moods that heals your inner pain',
      author: 'by Redtape',
      rating: 4.8,
      reviews: 123,
      originalPrice: 2444,
      currentPrice: 1299,
      discount: 50,
      duration: '00:23:00',
      category: '🕊️ Peaceful'
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
      id:3,
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
   
  ]

  {/*const stores = [
    {
      id: 1,
      image: 'https://static.codia.ai/image/2025-10-15/6YgyckTjfo.png',
      logo: 'https://static.codia.ai/image/2025-10-15/a2gTB6iqyb.png',
      name: 'Red Tape',
      description: 'Red Tape is a premium lifestyle and fashion brand known for its high-quality footwear, apparel, and accessories.',
      products: 34,
      ratings: 4.8,
      reviews: "2.1k",
      followers: "12.4k"
    },
    {
      id: 2,
      image: 'https://static.codia.ai/image/2025-10-15/6YgyckTjfo.png',
      logo: 'https://static.codia.ai/image/2025-10-15/Sy06hyDfRJ.png',
      name: 'Red Tape',
      description: 'Red Tape is a premium lifestyle and fashion brand known for its high-quality footwear, apparel, and accessories.',
      products: 28,
      ratings: 4.5,
      reviews: "1.8k",
      followers: "10.2k"
    },
    {
      id: 3,
      image: 'https://static.codia.ai/image/2025-10-15/6YgyckTjfo.png',
      logo: 'https://static.codia.ai/image/2025-10-15/i0zSrWRgtO.png',
      name: 'Red Tape',
      description: 'Red Tape is a premium lifestyle and fashion brand known for its high-quality footwear, apparel, and accessories.',
      products: 45,
      ratings: 4.9,
      reviews: "3.2k",  
    },
    {
      id: 4,
      image: 'https://static.codia.ai/image/2025-10-15/6YgyckTjfo.png',
      logo: 'https://static.codia.ai/image/2025-10-15/9Foup8c9nu.png',
      name: 'Red Tape',
      description: 'Red Tape is a premium lifestyle and fashion brand known for its high-quality footwear, apparel, and accessories.',
       products: 12,
      ratings: "4K",
      reviews: "3.2k", 
        followers: "1K"
    }
  ]
  */}


  return (
    
 <main className=" min-h-screen bg-white">
  <Header />

<div
        className={` transition-all duration-300 ${
          isMobileNavOpen ? "md:ml-[256px]" : "md:ml-0"
        } pt-[20px] px-6`}
      >

      <div className="grid grid-cols-4  gap-4 max-w-[2000px] mx-auto">
      {/* HAPPY (left big one) */}
        <div className="col-span-1 row-span-1 relative overflow-hidden rounded-2xl group">
  <img
    src={happy}
    alt="HAPPY"
    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
  />
  <h2 className="absolute bottom-4 left-4 text-3xl font-bold text-white group-hover:text-black transition-colors">
    HAPPY
  </h2>
</div>

      {/* Column 2 (Motivated + Calm stacked) */}
      <div className="grid  gap-4">
        <div className="row-span-2 relative overflow-hidden rounded-2xl group">
          <img
            src={motivated}
            alt="CREATIVE"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <h2 className="absolute bottom-4 left-4 text-2xl font-bold text-white group-hover:text-black transition-colors">
            Motivated
          </h2>
        </div>
        <div className="relative overflow-hidden rounded-2xl group">
          <img
            src={calm}
            alt="SAD"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <h2 className="absolute bottom-4 left-4 text-2xl font-bold text-white group-hover:text-black transition-colors">
            CALM
          </h2>
        </div>
      </div>

      {/* Column 3 (Creative tall + Sad small bottom) */}
      <div className="grid  gap-4">
        <div className="row-span-2 relative overflow-hidden rounded-2xl group">
          <img
            src={creative}
            alt="CREATIVE"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <h2 className="absolute bottom-4 left-4 text-2xl font-bold text-white group-hover:text-black transition-colors">
            CREATIVE
          </h2>
        </div>
        <div className="relative overflow-hidden rounded-2xl group">
          <img
            src={sad}
            alt="SAD"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <h2 className="absolute bottom-4 left-4 text-2xl font-bold text-white group-hover:text-black transition-colors">
            SAD
          </h2>
        </div>
      </div>

      {/* Column 4 (Spiritual top + Energetic bottom) */}
      <div className="grid  gap-4">
        <div className="relative overflow-hidden rounded-2xl group">
          <img
            src={spiritual}
            alt="SPIRITUAL"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <h2 className="absolute bottom-4 left-4 text-2xl font-bold text-white group-hover:text-black transition-colors">
            SPIRITUAL
          </h2>
        </div>
        <div className="relative overflow-hidden rounded-2xl group">
          <img
            src={energy}
            alt="ENERGETIC"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <h2 className="absolute bottom-4 left-4 text-2xl font-bold text-white group-hover:text-black transition-colors">
            ENERGETIC
          </h2>
        </div>
      </div>
    </div>
    <div className="mt-12">
          <MoodSelector />
        </div>


      <div className="grid grid-cols-2 gap-10 mt-12">
        {/* Trending Products */}
        <div className="relative">
          <img 
            src="https://cdn.cness.io/Trendingp.svg"
            alt="Trending Products" 
            className="w-full h-[521px] object-cover rounded-2xl"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent rounded-2xl"></div>
          <div className="absolute left-8 top-8 text-white">
          <h2 className="font-poppins font-bold text-3xl uppercase leading-tight mb-4">
  <div className="flex items-center gap-3">
    Trending
    <div className="w-24 h-0.5 bg-white "></div>
  </div>
  <div className="mt-2">Products</div>
</h2>
            <button className="bg-white text-black px-6 py-3 rounded font-medium hover:bg-gray-100 transition-colors">
              Explore Now
            </button>
          </div>
        </div>

        {/* New Contents */}
        <div className="relative">
          <img 
            src="https://cdn.cness.io/new%20arrivals.svg" 
            alt="New Contents" 
            className="w-full h-[521px] object-cover rounded-2xl"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent rounded-2xl"></div>
          <div className="absolute left-8 top-8 text-white">
           <h2 className="font-poppins font-bold text-3xl uppercase leading-tight mb-4">
  <div className="flex items-center gap-3">
    New
    <div className="w-24 h-0.5 bg-white "></div>
  </div>
  <div className="mt-2">Contents</div>
</h2>
            <button className="bg-white text-black px-6 py-3 rounded font-medium hover:bg-gray-100 transition-colors">
              Explore Now
            </button>
          </div>
        </div>
      </div>

{/* Featured Products Section */}
<section className="px-8 py-10">
      <div className="mb-8">
        <h2 className="font-poppins font-semibold text-3xl text-gray-800 mb-6">Featured products</h2>
        
        {/* Category Tabs */}
        <div className="flex space-x-4">
          {categories.map((category, index) => (
            <button
              key={index}
              className={`px-11 py-4 rounded-full border font-medium text-sm transition-colors ${
                category.active
                  ? 'border-blue-500 text-blue-500 bg-white'
                  : 'border-gray-400 text-gray-400 bg-white hover:border-gray-500'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
        {products.map((product) => (
<ProductCard key={String(product.id)} product={{ ...product, id: String(product.id) }} />
        ))}
      </div>

      {/* Explore Videos Button */}
      <div className="flex justify-center">
        <button className="flex items-center space-x-2 px-6 py-3 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition-colors">
          <span className="font-jakarta font-medium">Explore videos</span>
          <img src="https://static.codia.ai/image/2025-10-15/xZLgath1fZ.png" alt="Explore" className="w-6 h-6" />
        </button>
      </div>
    </section>

    {/* Digital Stores Section */}
<section className="relative w-full h-[426px] px-8 py-16 flex items-center justify-center">
  {/* Background image absolutely positioned */}
  <img
    src={digital}
    alt="Background"
    className="absolute inset-0 w-full h-full object-cover"
  />

  {/* Gradient overlay (optional, for contrast) */}

  {/* Button centered on top */}
  <div className="flex flex-col items-start space-y-6 mt-32 mr-26 ">

  <Button
               variant="gradient-primary"
              className="font-['Plus_Jakarta_Sans'] font-medium 
      w-fit h-[42px] px-[19.5px] py-[16px]
      rounded-[81.26px] text-[14px] leading-[100%] tracking-[0]
      text-center flex items-center justify-center"
             >
Visit store            </Button>
</div>
</section>

    <section className="px-8 py-16">
      <h2 className="font-poppins font-semibold text-3xl text-center text-black mb-12">Digital stores</h2>
      
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
    <div
      key={index}
      onClick={() => navigate(`/dashboard/shop-detail/${shop.id}`, { state: shop })}
      className="cursor-pointer"
    >
      <ShopCard {...shop} />
    </div>
  ))}
</div>

      <div className="flex justify-center mt-8">
        <button 
        className="flex items-center space-x-2 px-6 py-3 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition-colors">
          <span className="font-jakarta font-medium">Visit all stores</span>
          <img src="https://static.codia.ai/image/2025-10-15/4wmOKSRAa7.png" alt="Explore" className="w-6 h-6" />
        </button>
      </div>
    </section>
    </div>




    </main>
  )
}

export default MarketPlaceNew
