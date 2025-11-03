import { useNavigate } from 'react-router-dom';

type BoardItem = { type: 'image' | 'video'; src: string; alt?: string; poster?: string };
type CollectionTile = { id: string; title: string; image: string; itemCount: number; items: BoardItem[] };

const img1 = 'https://cdn.cness.io/collection1.svg';
const img2 = 'https://cdn.cness.io/collection2.svg';
const img3 = 'https://cdn.cness.io/collection3.svg';

const collections: CollectionTile[] = [
  { id: '1', title: 'Yoga',          image: img1, itemCount: 12, items: [{ type: 'image', src: img1, alt: 'Yoga' }] },
  { id: '2', title: 'Motivated',     image: img1, itemCount: 8,  items: [{ type: 'image', src: img1, alt: 'Motivated' }] },
  { id: '3', title: 'Ebook',         image: img3, itemCount: 5,  items: [{ type: 'image', src: img3, alt: 'Ebook' }] },
  { id: '4', title: 'Yoga',          image: img1, itemCount: 9,  items: [{ type: 'image', src: img1, alt: 'Yoga' }] },
  { id: '5', title: 'Wellness',      image: img3, itemCount: 7,  items: [{ type: 'image', src: img3, alt: 'Wellness' }] },
  { id: '6', title: 'Life',          image: img2, itemCount: 10, items: [{ type: 'image', src: img2, alt: 'Life' }] },
  { id: '7', title: 'Podcasts',      image: img2, itemCount: 4,  items: [{ type: 'image', src: img2, alt: 'Podcasts' }] },
  { id: '8', title: 'Consciousness', image: img3, itemCount: 6,  items: [{ type: 'image', src: img3, alt: 'Consciousness' }] },
];

export default function MyCollections({ isMobileNavOpen }: { isMobileNavOpen?: boolean }) {
  const navigate = useNavigate();

  return (
    <div className={`transition-all duration-300 ${isMobileNavOpen ? 'md:ml-[256px]' : 'md:ml-0'} pt-[20px] px-4 lg:px-0 overflow-x-hidden`}> 
      {/* Frame 1: Heading container (1128x30 with 20px gap below) */}
      <div className="mx-auto w-full max-w-[1128px] h-[30px] mb-5 flex items-center">
          <h1 className="font-['Poppins'] font-semibold text-[20px] leading-[100%] tracking-[0] text-[#1A1A1A] w-[149px]">
          My Collections
        </h1>
      </div>

      {/* Frames 2 & 3 combined: 8 tiles (4 + 4). On lg screens the frame is exactly 1128x460 with 20px gaps */}
      <div className="mx-auto w-full max-w-[1128px] lg:h-[460px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-[repeat(4,267px)] gap-5">
          {collections.map((collection) => (
            <div
              key={collection.id}
              onClick={() =>
                navigate(`/dashboard/my-collections/${collection.id}`, {
                  state: { board: { id: collection.id, title: collection.title, items: collection.items } },
                })
              }
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-[10px]  bg-white w-full h-[195px]">
                <img
                  src={collection.image}
                  alt={collection.title}
                  className="w-full h-auto object-cover rounded-t-[10px]"
                />
                <div className="px-2 mt-[10px] text-center text-[14px] font-medium text-[#1A1A1A]">
                  {collection.title}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
