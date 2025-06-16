
import Ellipse1 from "../../assets/Ellipse1.png";
import Ellipse2 from "../../assets/Ellipse2.png";
import Ellipse3 from "../../assets/Ellipse3.png";
import Music from "../../assets/Music.png";
import Proadcast from "../../assets/Proadcast.png";
import Movies from "../../assets/Movies.png";
import Webinar from "../../assets/Webinar.png";
import Ebook from "../../assets/Ebook.png";



const recommendations = [
  { title: "Work Life balance", image: Ellipse1, icon: Music },
  { title: "Raising Good Kids", image: Ellipse2, icon: Movies },
  { title: "Effective Leadership", image: Ellipse3, icon: Proadcast },
  { title: "Ethical AI", image: Ellipse1, icon: Ebook },
  { title: "10 Minutes meditation", image: Ellipse2, icon: Webinar },
];

export default function CnessRecommendations() {
  return (
<div className="w-full lg:w-[280px] bg-white rounded-[12px] p-4 shadow-md flex flex-col gap-3">
  <h3 className="text-sm font-semibold text-gray-800">
    Cness Recommends for you
  </h3>
  {recommendations.map((item, index) => (
    <div
      key={index}
      className="flex items-center justify-between border-b border-b-[#ECEBEB] last:border-none pb-2"
    >
      <div className="flex items-center gap-3">
        <img
          src={item.image}
          alt={item.title}
          className="w-8 h-8 rounded-full object-cover"
        />
        <p className="text-sm text-gray-700">{item.title}</p>
      </div>
      <img
        src={item.icon}
        alt="icon"
        className="w-4 h-4 object-contain"
      />
    </div>
  ))}
</div>
  );
}
