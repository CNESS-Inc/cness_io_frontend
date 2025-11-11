import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; // Import useLocation
import ConnectionsCard from "../components/Profile/Tabs";
import FriendCard from "../components/Profile/Friendcard";
import FriendProfileModal from "../components/Profile/FriendProfilepopup";
import {
  GetConnectionUser,
  GetFriendRequest,
  AcceptFriendRequest,
  RejectFriendRequest,
  GetUserPost,
  GetSuggestedFriend,
} from "../Common/ServerAPI";
import { useToast } from "../components/ui/Toast/ToastProvider";

const MyConnection = () => {
  const [searchValue, setSearchValue] = useState("");
  const [activeTab, setActiveTab] = useState("All Friends");
  const [selectedFriend, setSelectedFriend] = useState<Connection | null>(null);
  const [allConnections, setAllConnections] = useState<Connection[]>([]);
  const [friendRequests, setFriendRequests] = useState<Connection[]>([]);
  const [suggestedFriend, setSuggestedFriend] = useState<Connection[]>([]);
  const [followStatus, setFollowStatus] = useState<{ [key: number]: boolean }>(
    {}
  );
  const { showToast } = useToast();

  // Get navigation state
  const location = useLocation();

  interface Connection {
    id: number;
    name: string;
    username: string;
    image: string;
    profileImage: string;
    conversationId?: string | number;
    isFollowing?: boolean;
  }

  // Check navigation state on component mount and when location changes
  useEffect(() => {
    if (location.state?.to === "request") {
      setActiveTab("Friend Requests");
    }
    if (location.state?.to === "suggestion") {
      setActiveTab("Suggestions");
    }
  }, [location.state]);

  useEffect(() => {
    if (activeTab === "Friend Requests") {
      fetchFriendRequests();
    }
    if (activeTab === "All Friends") {
      fetchAllConnections();
    }
    if (activeTab === "Suggestions") {
      fetchSuggestedFriend();
    }
  }, [activeTab]);

  const fetchAllConnections = async (search: string = "") => {
    try {
      const response = await GetConnectionUser(search);
      const formattedRequests = response.data.data.rows.map((item: any) => ({
        id: item.friend_user.id,
        name: `${item.friend_user.profile.first_name} ${item.friend_user.profile.last_name}`,
        username: item?.friend_user?.username,
        image: item.friend_user.profile.profile_picture,
        profileImage: item.friend_user.profile.profile_picture,
        conversationId: item?.conversation?.id || null,
        isFollowing: item.isFollowing || false,
      }));
      setAllConnections(formattedRequests);

      // Update follow status state
      const statusMap: { [key: number]: boolean } = {};
      formattedRequests.forEach((conn: any) => {
        statusMap[conn.id] = conn.isFollowing;
      });
      setFollowStatus(statusMap);
    } catch (error) {
      console.error("Error fetching friend requests:", error);
    }
  };

  const fetchFriendRequests = async (search: string = "") => {
    try {
      const response = await GetFriendRequest(search);
      const formattedRequests = response.data.data.rows.map((item: any) => ({
        id: item.friend_user.id,
        name: `${item.friend_user.profile.first_name} ${item.friend_user.profile.last_name}`,
        username: item?.friend_user?.username,
        image: item.friend_user.profile.profile_picture,
        profileImage: item.friend_user.profile.profile_picture,
      }));
      setFriendRequests(formattedRequests);
    } catch (error) {
      console.error("Error fetching friend requests:", error);
    }
  };

  const fetchSuggestedFriend = async (search: string = "") => {
    try {
      const response = await GetSuggestedFriend(search);
      const formattedRequests = response.data.data.rows.map((item: any) => ({
        id: item.id,
        name: `${item.profile.first_name} ${item.profile.last_name}`,
        username: item?.username,
        image: item.profile.profile_picture,
        profileImage: item.profile.profile_picture,
      }));
      setSuggestedFriend(formattedRequests);
    } catch (error) {
      console.error("Error fetching friend requests:", error);
    }
  };

  const handleAcceptRequest = async (friendId: number) => {
    try {
      const formattedData = { friend_id: friendId };
      await AcceptFriendRequest(formattedData);

      // Remove the accepted request from the list
      setFriendRequests((prev) =>
        prev.filter((request) => request.id !== friendId)
      );
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

      // Remove the rejected request from the list
      setFriendRequests((prev) =>
        prev.filter((request) => request.id !== friendId)
      );
    } catch (error) {
      console.error("Error rejecting friend request:", error);
    }
  };

  const handleChatClick = (connection: Connection) => {
    window.dispatchEvent(
      new CustomEvent("openMessaging", {
        detail: { connection },
      })
    );
  };

  let activeConnections: Connection[] = [];
  if (activeTab === "All Friends") activeConnections = allConnections;
  if (activeTab === "Friend Requests") activeConnections = friendRequests;
  if (activeTab === "Suggestions") activeConnections = suggestedFriend;

  const handleSearch = () => {
    if (activeTab === "Friend Requests") {
      fetchFriendRequests(searchValue);
    }
    if (activeTab === "All Friends") {
      fetchAllConnections(searchValue);
    }
    if (activeTab === "Suggestions") {
      fetchSuggestedFriend(searchValue);
    }
  };

  return (
    <div className="flex flex-col gap-4 mt-2 px-1">
      {/* Top Tabs + Search */}
      <ConnectionsCard
        title="My Connections"
        subtitle="Explore the trending posts and discussions among your connections at this moment."
        tabs={["All Friends", "Friend Requests", "Suggestions"]}
        onSearch={setSearchValue}
        onTabChange={setActiveTab}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        getUserPosts={GetUserPost}
        selectedTopic={undefined}
      />
      
      <div className="rounded-[12px] border border-gray-200 bg-white flex flex-col gap-4 sm:p-6 w-full">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Left Title */}
          <h2
            className="text-[14px] font-medium capitalize leading-[100%]"
            style={{
              fontFamily: "Poppins",
              letterSpacing: "0",
            }}
          >
            {activeTab === "All Friends"
              ? "All Connections"
              : activeTab === "Friend Requests"
              ? "Friend Requests"
              : "Suggestions"}
          </h2>
          
          {/* Search & Button */}
          <div className="flex w-full sm:w-auto items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <input
                type="text"
                placeholder="Search..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full rounded-full border border-gray-300 pl-4 pr-10 py-2 text-sm focus:outline-none focus:border-indigo-500"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 absolute right-3 top-2.5 text-black"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35M9.5 17a7.5 7.5 0 110-15 7.5 7.5 0 010 15z"
                />
              </svg>
            </div>
            <button
              className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full text-sm transition"
              onClick={handleSearch}
            >
              Search Connections
            </button>
          </div>
        </div>

        <div className="sm:grid gap-4 md:gap-5 lg:gap-6 justify-items-center grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 2xl:gap-4 3xl:grid-cols-6">
          {activeConnections.length > 0 ? (
            activeConnections.map((conn) => (
              <FriendCard
                key={conn.id}
                name={conn.name}
                username={conn.username}
                image={conn.image}
                connection={conn}
                actions={
                  activeTab === "All Friends"
                    ? ["chat"]
                    : activeTab === "Friend Requests"
                    ? ["accept", "reject"]
                    : []
                }
                onChat={() => handleChatClick(conn)}
                onAccept={() => handleAcceptRequest(conn.id)}
                onReject={() => handleRejectRequest(conn.id)}
                onMaximize={() =>
                  setSelectedFriend({
                    ...conn,
                    id: conn.id,
                    isFollowing: followStatus[conn.id] || false,
                  })
                }
              />
            ))
          ) : (
            <div className="col-span-full flex justify-center items-center py-10">
              <p className="text-gray-500 text-sm">
                No {activeTab.toLowerCase()} found.
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Modal */}
      {selectedFriend && (
        <FriendProfileModal
          friend={selectedFriend}
          onClose={() => setSelectedFriend(null)}
        />
      )}
    </div>
  );
};

export default MyConnection;