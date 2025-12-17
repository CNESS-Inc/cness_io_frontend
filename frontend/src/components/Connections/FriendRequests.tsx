import { useEffect, useState } from "react";
import FriendCard from "../Profile/Friendcard";
import {
  AcceptFriendRequest,
  GetFriendRequest,
  RejectFriendRequest,
} from "../../Common/ServerAPI";
import { useToast } from "../ui/Toast/ToastProvider";

type Connection = {
  id: number;
  name: string;
  username: string;
  image: string;
  profileImage: string;
};

type Props = {
  searchTerm: string;
    onSelect: (connection: Connection) => void; 
};

const PAGE_SIZE = 12;

const FriendRequests = ({ searchTerm, onSelect }: Props) => {
  const [requests, setRequests] = useState<Connection[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const resetAndFetch = () => {
    setRequests([]);
    setPage(1);
    setHasMore(true);
    fetchRequests(1, searchTerm, false);
  };

  const fetchRequests = async (
    pageNo = 1,
    search = "",
    append = false
  ) => {
    try {
      setIsLoading(true);
      const response = await GetFriendRequest(search, pageNo, PAGE_SIZE);
      const rows = response?.data?.data?.rows || [];
      const formatted = rows.map((item: any) => ({
        id: item.friend_user.id,
        name: item.friend_user.profile ? `${item?.friend_user?.profile?.first_name} ${item?.friend_user?.profile?.last_name}` : item?.username,
        username: item?.friend_user?.username,
        image: item.friend_user.profile.profile_picture,
        profileImage: item.friend_user.profile.profile_picture,
      }));

      setRequests((prev) => (append ? [...prev, ...formatted] : formatted));
      setHasMore(formatted.length === PAGE_SIZE);
      setPage(pageNo + 1);
    } catch (error) {
      console.error("Error fetching friend requests:", error);
      showToast({
        type: "error",
        message: "Failed to load friend requests.",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptRequest = async (friendId: number) => {
    try {
      const formattedData = { friend_id: friendId };
      await AcceptFriendRequest(formattedData);
      setRequests((prev) => prev.filter((request) => request.id !== friendId));
      showToast({
        message: "You've got a new friend!",
        type: "success",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };

  const handleRejectRequest = async (friendId: number) => {
    try {
      const formattedData = { friend_id: friendId };
      await RejectFriendRequest(formattedData);
      setRequests((prev) => prev.filter((request) => request.id !== friendId));
    } catch (error) {
      console.error("Error rejecting friend request:", error);
      showToast({
        type: "error",
        message: "Failed to reject request.",
        duration: 3000,
      });
    }
  };

  useEffect(() => {
    resetAndFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  return (
    <>
     <div className="w-full grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5 lg:gap-6 justify-items-center">
        {requests.length > 0 ? (
          requests.map((conn) => (
            <FriendCard
              key={conn.id}
              name={conn.name}
              username={conn.username}
              image={conn.image}
              connection={conn}
              actions={["accept", "reject"]}
              onAccept={() => handleAcceptRequest(conn.id)}
              onReject={() => handleRejectRequest(conn.id)}
              onMaximize={() => onSelect(conn)}   
            />
          ))
        ) : (
          <div className="col-span-full flex justify-center items-center py-10">
            <p className="text-gray-500 text-sm">No friend requests found.</p>
          </div>
        )}
      </div>
      {(requests.length > 0 || hasMore || isLoading) && (
        <div className="flex justify-center pt-2">
          <button
            onClick={() => fetchRequests(page, searchTerm, true)}
            disabled={!hasMore || isLoading}
            className="px-4 py-2 text-sm rounded-full border border-gray-300 hover:border-indigo-400 hover:text-indigo-600 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading
              ? "Loading..."
              : hasMore
              ? "Load more requests"
              : "No more requests"}
          </button>
        </div>
      )}
    </>
  );
};

export default FriendRequests;
