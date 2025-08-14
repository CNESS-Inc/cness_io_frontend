import { X } from "lucide-react";
import MyPost from "../Profile/Mypost";
import companycard from "../../assets/companycard1.png"
import whychess from "../../assets/whycness.jpg";
import webinar from "../../assets/webinarimg.jpg";
import { TrendingUp } from "lucide-react";

type Props = {
  friend: {
    name: string;
    username: string;
    image: string;
  };
  onClose: () => void;
};

export default function FriendProfileModal({ friend, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      {/* Modal */}
  <div
    className="bg-white rounded-[18px] flex flex-col shadow-lg overflow-hidden"
    style={{
      width: "1176px",
      height: "725.25px",
      gap: "10px",
      padding: "12px",
    }}
  >
   <div
      className="bg-white rounded-[12px] border border-gray-200 flex flex-col shadow-lg overflow-hidden"
      style={{
        width: "1152px",
        height: "701.25px",
        paddingBottom: "24px",
        gap: "24px",
      }}
    >
        {/* Header */}
        <div className="flex-shrink-0">
          <div className="relative">
            <img
              src={companycard}
              alt="Cover"
              className="w-[1152px] h-[150px] object-cover rounded-t-[16px]"
            />
            <button
              onClick={onClose}
              className="absolute top-3 right-3 bg-white rounded-full p-1 shadow hover:bg-gray-100"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Profile Info */}
         <div
  className="flex items-center justify-between"
  style={{
    width: "1104px",
    height: "77.25px",
  }}
>
  

  {/* Left: Profile image + info */}
  <div className="flex items-center gap-4 mt-8 px-6">
    <img
      src={friend.image}
      alt={friend.name}
      style={{
        width: "77.25px",
        height: "77.25px",
        borderWidth: "1.42px",
      }}
      className="rounded-full border-white object-cover"
    />

    <div>
      <h2 className="font-medium text-gray-900">{friend.name}</h2>
      <p className="text-gray-500 text-sm">@{friend.username}</p>
      <div className="flex gap-4 text-sm mt-1">
        <span className="text-indigo-500">100 Following</span>
        <span className="text-pink-500">1k Followers</span>
      </div>
  
  </div>
  </div>

  {/* Right: Buttons */}
  <div className="flex gap-2 mt-8">
    <button className="px-8 py-2 rounded-full border border-gray-300 text-[#7077FE] text-sm shadow hover:">
         <TrendingUp className="w-4 h-4 inline-block mr-2" />
      Following
    </button>
    <button className="px-8 py-2 rounded-full bg-indigo-500 text-white text-sm">
      Message
    </button>
  </div>
</div>
        </div>
<div className="border border-gray-100 mx-5 mt-3"></div>

        {/* Scrollable Posts */}
        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="mb-4 text-[14px] font-medium text-gray-800">Posts</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <MyPost
              media={{ type: "image", src: webinar }}
              likes={421000}
              reflections={45}
            />
            <MyPost
              media={{ type: "video", src: "/videos/yoga.mp4", poster: whychess }}
              likes={421000}
              reflections={45}
            />
            <MyPost
              media={null}
              body="Sustainability has become a transformative force in the cosmetics industry..."
              likes={421000}
              reflections={45}
            />
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
