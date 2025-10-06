// src/pages/MyCollectionView.tsx
import { useMemo ,useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import type { CollectionBoard } from "../components/Profile/MymultiviewCollection";
import aware1 from "../assets/aware_1.jpg";
import aware2 from "../assets/aware_2.jpg";
import aware3 from "../assets/aware_3.jpg";
import Mycollection from "../components/Profile/MyCollection";
import { ArrowLeft } from "lucide-react";
import PostPopup  from "../components/Profile/Popup";


type Media =
  | { type: "image"; src: string; alt?: string }
  | { type: "video"; src: string; poster?: string };

type Card = {
  id: string;
  media: Media;
};

interface Post {
  id: string;
  media: Media;
  comments?: any[];
  date: string;
}

const demoCards: Card[] = [
  { id: "1", media: { type: "video", src: "/test1.mp4", poster: "/images/cover-landscape.jpg" } },
  { id: "2", media: { type: "image", src: aware1, alt: "Lamp" } },
  { id: "3", media: { type: "image", src: aware2, alt: "Sky" } },
  { id: "4", media: { type: "video", src: "/test1.mp4", poster: "/images/cover-dark.jpg" } },
  { id: "5", media: { type: "video", src: "/test1.mp4", poster: "/images/yoga.jpg" } },
  { id: "6", media: { type: "image", src: aware3, alt: "Beach" } },
];

export default function MyCollectionView() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation() as { state?: { board?: CollectionBoard } };
const [selectedPost, setSelectedPost] = useState<Post | null>(null);


  const board = location.state?.board;

  const cards = useMemo<Card[]>(() => {
    if (!board) return demoCards;

    return board.items.map((it, idx) => ({
      id: `${idx + 1}`,
      media:
        it.type === "image"
          ? { type: "image", src: it.src, alt: it.alt }
          : it.type === "video"
          ? { type: "video", src: it.src, poster: it.poster }
          : { type: "image", src: "/images/fallback.jpg", alt: "Unsupported" },
    }));
  }, [board, id]);

  return (
    <div className="mx-auto  px-4 py-5">
      {/* Header */}
      <div className="mb-2 flex items-center justify-between">
<h1 className="inline-block px-4 py-2 rounded-full bg-[#f3f4ff] text-[#7077FE] font-medium text-[15px] sm:text-lg">
          {board?.title ?? "Collection Name"}
        </h1>
        <button
          onClick={() =>
    navigate("/dashboard/profile", { state: { activeTab: "Collections" } })
  }
          className="inline-flex items-center gap-2 rounded-full border bg-white border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
        >
            <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>

      {/* Render posts */}
<div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
          {cards.map((c) => (
       <Mycollection
  key={c.id}
  media={c.media}
  body="This is a collection post"
  likes={450000}
  //reflections={25}
  authorName="John Doe"
  time="Just Now"
  authorAvatar="/images/avatar.jpg"
  isFollowing={false}
  showFollowButton={true}
  onFollowToggle={() => console.log("Follow/Unfollow", c.id)}
  onLike={() => console.log("Like post", c.id)}
  onOpenReflections={() => console.log("Open reflections", c.id)}
  insightsCount={30}
  onClick={() =>
  setSelectedPost({ id: c.id, media: c.media, comments: [], date: new Date().toISOString() })
}/>
        ))}
      </div>

      {/* Popup for selected post */}
   
      {/* Popup */}
      {selectedPost && (
        <PostPopup
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          onDeletePost={() => {
            console.log("Delete post", selectedPost.id);
            setSelectedPost(null);
          }}
        />
      )}
        
    </div>
  );
}
