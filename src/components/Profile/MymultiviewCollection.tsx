// components/Profile/MyCollection.tsx
import { Play, Copy } from "lucide-react";
import MyPost from "./Mypost";
import type { MyPostProps } from "./Mypost"; // type-only import

/* ---------- Types shared with the app ---------- */
export type SavedItem =
  | { id: string; type: "image"; src: string; alt?: string }
  | { id: string; type: "video"; src: string; poster?: string }
  | { id: string; type: "text"; text: string };

export type CollectionBoard = {
  id: string;
  title?: string;
  items: SavedItem[];
  updatedAt?: string;
};

/* ---------- Component prop union (one source of truth) ---------- */
type BoardsModeProps = {
  mode: "boards";
  boards: CollectionBoard[];
  onOpen?: (boardId: string) => void;
  showHeader?: boolean;
};

type ItemsModeProps = {
  mode: "items";
  items: SavedItem[]; // items for a single collection
  showHeader?: boolean;
};

type Props = BoardsModeProps | ItemsModeProps;

/* ---------- Helpers ---------- */
function toPost(item: SavedItem): MyPostProps {
  if (item.type === "image") {
    return {
      media: { type: "image", src: item.src, alt: item.alt },
      likes: 0,
      reflections: 0,
      date: new Date().toISOString(),
    };
  }
  if (item.type === "video") {
    return {
      media: { type: "video", src: item.src, poster: item.poster },
      likes: 0,
      reflections: 0,
      date: new Date().toISOString(),
    };
  }
  // text
  return {
    media: null,
    body: item.text,
    likes: 0,
    reflections: 0,
    date: new Date().toISOString(),
  };
}

/* ---------- Component ---------- */
export default function MyCollection(props: Props) {
  const { showHeader = false } = props;

  // ITEMS MODE (single grid of posts for the collection view page)
  if (props.mode === "items") {
    const { items } = props;

    if (!items.length) {
      return (
        <div className="border border-dashed border-[#C4B5FD] rounded-xl bg-[#F8F6FF] py-12 flex items-center justify-center">
          <p className="text-sm text-gray-500">No items in this collection yet</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {showHeader && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Only You Can See What You’ve Saved</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((it) => {
            const post = toPost(it);
            return (
              <MyPost
                key={it.id}
                {...post}
                onOpenReflections={() => {}}
              />
            );
          })}
        </div>
      </div>
    );
  }

  // BOARDS MODE (collage list)
  const { boards, onOpen } = props; // narrowed to BoardsModeProps

  if (!boards.length) {
    return (
      <div className="border border-dashed border-[#C4B5FD] rounded-xl bg-[#F8F6FF] py-12 flex items-center justify-center">
        <p className="text-sm text-gray-500">No collections yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {showHeader && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">Only You Can See What You’ve Saved</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {boards.map((b) => (
          <BoardCard key={b.id} board={b} onOpen={onOpen} />
        ))}
      </div>
    </div>
  );
}

/* ---------- Boards (collage) card ---------- */
function BoardCard({
  board,
  onOpen,
}: {
  board: CollectionBoard;
  onOpen?: (id: string) => void;
}) {
  const six = board.items.slice(0, 6);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpen?.(board.id)}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onOpen?.(board.id)}
      className="group relative w-full text-left bg-white rounded-2xl shadow-sm border border-gray-200/70 p-2 hover:shadow-md transition"
    >
      {/* collage grid as positioning context */}
      <div className="relative">
        <div className="grid grid-cols-2 gap-2">
          {six.map((it) => (
            <Thumb key={it.id} item={it} />
          ))}
        </div>

        {/* dim overlay (grid only) */}
        <div className="pointer-events-none absolute inset-0 rounded-xl bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity z-10" />

        {/* centered title pill */}
        {board.title && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center z-20">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#575FFF] opacity-70 text-white px-4 py-2 shadow-md">
              <Copy className="h-4 w-4" />
              <span className="text-sm font-medium">{board.title}</span>
            </div>
          </div>
        )}
      </div>

      {/* footer */}
      {(board.title || board.updatedAt) && (
        <div className="px-1 pt-3">
          {board.title && (
            <div className="text-[15px] font-medium text-gray-800 truncate">
              {board.title}
            </div>
          )}
          {board.updatedAt && (
            <div className="text-xs text-gray-500 mt-0.5">
              Updated {board.updatedAt}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ---------- Collage cell ---------- */
function Thumb({ item }: { item: SavedItem }) {
  const cellH = "h-[110px] sm:h-[200px]";

  if (item.type === "text") {
    return (
      <div className={`${cellH} rounded-lg border border-gray-200 bg-gray-50 p-2 text-xs text-gray-600 leading-5 line-clamp-5`}>
        {item.text}
      </div>
    );
  }

  return (
    <div className={`relative ${cellH} rounded-lg overflow-hidden bg-gray-100`}>
      {item.type === "image" ? (
        <img src={item.src} alt={item.alt || ""} className="w-full h-full object-cover" />
      ) : (
        <>
          <video
            src={item.src}
            poster={item.poster}
            className="w-full h-full object-cover"
            controls
            muted
            playsInline
            preload="metadata"
            onClick={(e) => e.stopPropagation()}
          />
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white/90 shadow">
              <Play className="w-4 h-4 text-gray-900" />
            </span>
          </span>
        </>
      )}
    </div>
  );
}
