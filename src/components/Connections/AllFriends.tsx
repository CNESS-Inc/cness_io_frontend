import { useEffect, useState } from "react";
import FriendCard from "../Profile/Friendcard";
import {
  GetConnectionUser,
} from "../../Common/ServerAPI";
import { useToast } from "../ui/Toast/ToastProvider";

type Connection = {
  id: number;
  name: string;
  username: string;
  image: string;
  profileImage: string;
  conversationId?: string | number;
  isFollowing?: boolean;
};

type Props = {
  searchTerm: string;
  onSelect: (connection: Connection) => void;
  onChat: (connection: Connection) => void;
};

const PAGE_SIZE = 12;

const AllFriends = ({ searchTerm, onSelect, onChat }: Props) => {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [followStatus, setFollowStatus] = useState<Record<number, boolean>>({});
  const { showToast } = useToast();

  const resetAndFetch = () => {
    setConnections([]);
    setPage(1);
    setHasMore(true);
    fetchConnections(1, searchTerm, false);
  };

  const fetchConnections = async (
    pageNo = 1,
    search = "",
    append = false
  ) => {
    try {
      setIsLoading(true);
      const response = await GetConnectionUser(search, pageNo, PAGE_SIZE);
      const rows = response?.data?.data?.rows || [];
      const formatted = rows.map((item: any) => ({
        id: item.friend_user.id,
        name: item.friend_user.profile ? `${item?.friend_user?.profile?.first_name} ${item?.friend_user?.profile?.last_name}` : item?.username,
        username: item?.friend_user?.username,
        image: item.friend_user.profile.profile_picture,
        profileImage: item.friend_user.profile.profile_picture,
        conversationId: item?.conversation?.id || null,
        isFollowing: item.isFollowing || false,
      }));

      setConnections((prev) => (append ? [...prev, ...formatted] : formatted));
      setHasMore(formatted.length === PAGE_SIZE);
      setPage(pageNo + 1);

      setFollowStatus((prev) => {
        const updated = append ? { ...prev } : {};
        formatted.forEach((conn:any) => {
          updated[conn.id] = conn.isFollowing || false;
        });
        return updated;
      });
    } catch (error) {
      console.error("Error fetching friends:", error);
      showToast({
        type: "error",
        message: "Failed to load friends.",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    resetAndFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  return (
    <>
     <div className="w-full grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5 lg:gap-6 justify-items-center">
        {connections.length > 0 ? (
          connections.map((conn) => (
            <FriendCard
              key={conn.id}
              name={conn.name}
              username={conn.username}
              image={conn.image}
              connection={conn}
              actions={["chat"]}
              onChat={() => onChat(conn)}
              onMaximize={() =>
                onSelect({
                  ...conn,
                  isFollowing: followStatus[conn.id] || false,
                })
              }
            />
          ))
        ) : (
          <div className="col-span-full flex justify-center items-center py-10">
            <p className="text-gray-500 text-sm">No friends</p>
          </div>
        )}
      </div>
      {(connections.length > 0 || hasMore || isLoading) && (
        <div className="flex justify-center pt-2">
          <button
            onClick={() => fetchConnections(page, searchTerm, true)}
            disabled={!hasMore || isLoading}
            className="px-4 py-2 text-sm rounded-full border border-gray-300 hover:border-indigo-400 hover:text-indigo-600 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading
              ? "Loading..."
              : hasMore
              ? "Load more connections"
              : "No more connections"}
          </button>
        </div>
      )}
    </>
  );
};

export default AllFriends;
