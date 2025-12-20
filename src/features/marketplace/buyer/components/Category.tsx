import arts from "../../../../assets/arts.svg";
import ebook from "../../../../assets/ebook.svg";
import video from "../../../../assets/video.svg";
import music from "../../../../assets/music.svg";
import course from "../../../../assets/course.svg";
import podcast from "../../../../assets/poscast.svg";
import CategoryIcon from "../../../../assets/category.svg";

const categories = [
  { name: "Music", icon: music },
  { name: "Video", icon: video },
  { name: "Arts & Wallpapers", icon: arts },
  { name: "Podcast", icon: podcast },
  { name: "E-Books", icon: ebook },
  { name: "Courses", icon: course },
];

export default function CategoryGrid() {
  return (
    <div className="w-full">
      {/* Title */}
      <div className="flex items-center gap-[10px] mb-[16px]">
        <img src={CategoryIcon} alt="Category" className="w-[20px] h-[20px]" />
        <h2 className="font-[poppins] text-[20px] font-medium text-[#000000]">
          Shop by Category
        </h2>
      </div>

      {/* Responsive Grid */}
      <div
        className="
          grid
          grid-cols-2
          sm:grid-cols-3
          lg:grid-cols-6
          gap-[16px]
        "
      >
        {categories.map((category) => (
          <div
            key={category.name}
            className="
              h-[140px]
              rounded-[15px]
              bg-gradient-to-b from-[#FFFFFF] to-[#F1F3FF]
              flex
              flex-col
              items-center
              justify-center
              gap-[12px]
              cursor-pointer
              transition-all
              hover:border hover:border-[#6366f1]
              hover:-translate-y-[2px]
            "
          >
            <img
              src={category.icon}
              alt={category.name}
              className="w-[34px] h-[34px]"
            />

            <span className="font-[poppins] text-[12px] font-medium text-[#080f20] text-center leading-[16px] px-[6px]">
              {category.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
