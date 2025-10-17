import React from "react";
import happy from "../../assets/happy.svg";
import motivated from "../../assets/motivated.svg";
import calm from "../../assets/calm.svg";
import creative from "../../assets/creative.svg";
import sad from "../../assets/sad.svg";
import spiritual from "../../assets/Spitirtual.svg";
import energy from "../../assets/energy.svg";


const MoodGrid: React.FC = () => {
    
  return (
        <div className="w-full px-2">

      <div className="grid grid-cols-4 grid-rows-2 gap-4 max-w-[2000px] mx-auto">
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
      <div className="grid grid-rows-2 gap-4">
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
      <div className="grid grid-rows-2 gap-4">
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
      <div className="grid grid-rows-2 gap-4">
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
    </div>
  );
};

export default MoodGrid;
