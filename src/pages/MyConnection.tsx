import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ConnectionsCard from "../components/Profile/Tabs";
import FriendProfileModal from "../components/Profile/FriendProfilepopup";
import { GetUserPost } from "../Common/ServerAPI";
import AllFriends from "../components/Connections/AllFriends";
import FriendRequests from "../components/Connections/FriendRequests";
import Suggestions from "../components/Connections/Suggestions";

interface Connection {
  id: number;
  name: string;
  username: string;
  image: string;
  profileImage: string;
  conversationId?: string | number;
  isFollowing?: boolean;
}

const MyConnection = () => {
  const [searchValue, setSearchValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("All Friends");
  const [selectedFriend, setSelectedFriend] = useState<Connection | null>(null);

  const location = useLocation();

  useEffect(() => {
    if (location.state?.to === "request") {
      setActiveTab("Friend Requests");
    }
    if (location.state?.to === "suggestion") {
      setActiveTab("Suggestions");
    }
  }, [location.state]);

  // keep search in sync with ?s= query param
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlSearch = params.get("s") || "";
    setSearchValue(urlSearch);
    setSearchTerm(urlSearch);
  }, [location.search]);

  // Support query param ?t=friendrequest / ?t=suggestion to set the tab
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get("t")?.toLowerCase();

    if (tabParam === "friendrequest" || tabParam === "friendrequests") {
      setActiveTab("Friend Requests");
      return;
    }
    if (tabParam === "suggestion" || tabParam === "suggestions") {
      setActiveTab("Suggestions");
      return;
    }

    // Any other value falls back to All Friends
    if (tabParam) {
      setActiveTab("All Friends");
    }
  }, [location.search]);

  const updateUrlForTab = (tab: string) => {
    const params = new URLSearchParams(location.search);
    if (tab === "Friend Requests") {
      params.set("t", "friendrequest");
    } else if (tab === "Suggestions") {
      params.set("t", "suggestion");
    } else {
      params.delete("t");
    }
    const newSearch = params.toString();
    const newUrl = `${location.pathname}${newSearch ? `?${newSearch}` : ""}${
      location.hash || ""
    }`;
    window.history.pushState(null, "", newUrl);
  };

  const handleChatClick = (connection: Connection) => {
    window.dispatchEvent(
      new CustomEvent("openMessaging", {
        detail: { connection },
      })
    );
  };

  const handleSearch = () => {
    // Update URL first
    const params = new URLSearchParams(location.search);
    if (searchValue) {
      params.set("s", searchValue);
    } else {
      params.delete("s");
    }
    const newSearch = params.toString();
    const newUrl = `${location.pathname}${newSearch ? `?${newSearch}` : ""}${
      location.hash || ""
    }`;
    
    // Update URL without triggering extra state updates
    window.history.pushState(null, "", newUrl);
    
    // Manually update searchTerm to avoid race conditions
    setSearchTerm(searchValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex flex-col gap-4 mt-2 px-2 sm:px-4 md:px-6">
      <ConnectionsCard
        title="My Connections"
        subtitle="Explore the trending posts and discussions among your connections at this moment."
        tabs={["All Friends", "Friend Requests", "Suggestions"]}
        onSearch={setSearchValue}
        onTabChange={(tab) => {
          setActiveTab(tab);
          updateUrlForTab(tab);
        }}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        getUserPosts={GetUserPost}
        selectedTopic={undefined}
      />

      <div className="rounded-xl border border-gray-200 bg-white flex flex-col gap-4 p-4 sm:p-6 w-full">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
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

          <div className="flex w-full sm:w-auto items-center gap-2">
            <div className="relative flex-1 lg:w-64">
              <input
                type="text"
                placeholder="Search..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={handleKeyDown}
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
              className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full text-sm transition whitespace-nowrap"
              onClick={handleSearch}
            >
              Search Connections
            </button>
          </div>
        </div>

        {activeTab === "All Friends" && (
          <AllFriends
            searchTerm={searchTerm}
            onChat={handleChatClick}
            onSelect={(conn) => setSelectedFriend(conn)}
          />
        )}
        {activeTab === "Friend Requests" && (
          <FriendRequests 
            searchTerm={searchTerm}
            onSelect={(user) => setSelectedFriend(user)} 
          />
        )}
        {activeTab === "Suggestions" && (
          <Suggestions
            searchTerm={searchTerm}
            onSelect={(conn) => setSelectedFriend(conn)}
          />
        )}
      </div>

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