


const Header = () => {
  return (
    <header
      className={`
        sticky z-30 bg-white 
    top-[0px] h-[70px] 
  
    transition-all duration-300
    w-full
      `}
    >
      <div className="h-full flex items-center justify-between px-6 md:px-8">
        {/* Left Navigation */}
        <div className="hidden md:flex space-x-6">
          {[
            "Top Product",
            "Categories",
            "Shop",
            "My Favourites",
            "Library",
            "Order history",
          ].map((label) => (
            <span
              key={label}
              className="font-'Inter'
        font-medium 
        text-[16px] 
        leading-[150%] 
        tracking-[-1.9%] 
        text-[#8A8A8A] 
        cursor-pointer 
        hover:text-[#7077FE] 
        transition-colors"
            >
              {label}
            </span>
          ))}
        </div>

        {/* Right Icons */}
        <div className="flex items-center space-x-3">
          {[
            "https://static.codia.ai/image/2025-10-15/CNAqQ9S27j.png",
            "https://static.codia.ai/image/2025-10-15/Fh8OjrxnSH.png",
            "https://static.codia.ai/image/2025-10-15/LSLZ0q2jzC.png",
          ].map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`Icon ${i + 1}`}
              className="w-9 h-9 md:w-10 md:h-10 cursor-pointer hover:scale-105 transition-transform"
            />
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;
