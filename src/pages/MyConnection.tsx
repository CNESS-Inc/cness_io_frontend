import  { useState, useEffect } from "react";
import ConnectionsCard from "../components/Profile/Tabs"
import FriendCard from "../components/Profile/Friendcard";
import profile from "../assets/createstory.jpg";
import person from "../assets/person1.jpg";
import person1 from "../assets/person2.jpg";
import person2 from "../assets/person3.jpg";
import FriendProfileModal  from "../components/Profile/FriendProfilepopup";
import { GetConnectionUser, GetFriendRequest, AcceptFriendRequest, RejectFriendRequest } from "../Common/ServerAPI";

const MyConnection = () => {
  const [searchValue, setSearchValue] = useState("");
  const [activeTab, setActiveTab] = useState("All Friends");
  const [selectedFriend, setSelectedFriend] = useState<Connection | null>(null);
  const [allConnections, setAllConnections] = useState<Connection[]>([]);
  const [friendRequests, setFriendRequests] = useState<Connection[]>([]);
  

  interface Connection {
    id: number;
    name: string;
    username: string;
    image: string;
  }

  useEffect(() => {
    if (activeTab === "Friend Requests") {
      fetchFriendRequests();
    }
    if(activeTab === "All Friends"){
      fetchAllConnections();
    }
  }, [activeTab]);
  
  const fetchAllConnections = async () => {
    try {
      const response = await GetConnectionUser();
      const formattedRequests = response.data.data.rows.map((item: any) => ({
        id: item.friend_user.id,
        name: `${item.friend_user.profile.first_name} ${item.friend_user.profile.last_name}`,
        username: `@${item.friend_user.profile.first_name} ${item.friend_user.profile.last_name}`,
        image: item.friend_user.profile.profile_picture, 
      }));
      setAllConnections(formattedRequests);
    } catch (error) {
      console.error("Error fetching friend requests:", error);
    }
  }
  const fetchFriendRequests = async () => {
    try {
      const response = await GetFriendRequest();
      const formattedRequests = response.data.data.rows.map((item: any) => ({
        id: item.friend_user.id,
        name: `${item.friend_user.profile.first_name} ${item.friend_user.profile.last_name}`,
        username: `@${item.friend_user.profile.first_name} ${item.friend_user.profile.last_name}`,
        image: item.friend_user.profile.profile_picture, 
      }));
      setFriendRequests(formattedRequests);
    } catch (error) {
      console.error("Error fetching friend requests:", error);
    }
  };

  const handleAcceptRequest = async (friendId: number) => {
    try {
      const formattedData = { friend_id: friendId };
      await AcceptFriendRequest(formattedData);
      
      // Remove the accepted request from the list
      setFriendRequests(prev => prev.filter(request => request.id !== friendId));
      
      // Optional: Show success message
      console.log("Friend request accepted successfully");
    } catch (error) {
      console.error("Error accepting friend request:", error);
      // Handle error (show toast notification, etc.)
    }
  };
  
  const handleRejectRequest = async (friendId: number) => {
    try {
      const formattedData = { friend_id: friendId };
      await RejectFriendRequest(formattedData);
      
      // Remove the rejected request from the list
      setFriendRequests(prev => prev.filter(request => request.id !== friendId));
      
      // Optional: Show success message
      console.log("Friend request rejected successfully");
    } catch (error) {
      console.error("Error rejecting friend request:", error);
      // Handle error (show toast notification, etc.)
    }
  };

  /*
  const allConnections : Connection[] = [
    {
      id: 1,
      name: "NovaStar",
      username: "@novawrites",
      image: profile,
      
    },
    {
      id: 2,
      name: "LunaSky",
      username: "@lunascribbles",
      image: person1,
      
    },
    {
      id: 3,
      name: "SkylarWave",
      username: "@skylarwrites",
      image: "/images/skylar.jpg",
      
    },

     {
      id: 4,
      name: "SkylarWave",
      username: "@skylarwrites",
      image: "/images/skylar.jpg",
      
    },
     {
      id: 5,
      name: "SkylarWave",
      username: "@skylarwrites",
      image: "/images/skylar.jpg",
      
    },
 {
      id: 6,
      name: "SkylarWave",
      username: "@skylarwrites",
      image: "/images/skylar.jpg",
      
    },
 {
      id: 7,
      name: "SkylarWave",
      username: "@skylarwrites",
      image: "/images/skylar.jpg",
      
    },
    
    // ...more
  ];
  */
/*const friendRequests : Connection[] =  [
    {
      id: 1,
      name: "NovaStar",
      username: "@novawrites",
      image: person,
      
    },
    {
      id: 2,
      name: "LunaSky",
      username: "@lunascribbles",
      image: person2,
      
    },
    {
      id: 3,
      name: "SkylarWave",
      username: "@skylarwrites",
      image: "/images/skylar.jpg",
      
    },

     {
      id: 4,
      name: "SkylarWave",
      username: "@skylarwrites",
      image: "/images/skylar.jpg",
      
    },]
*/
const suggestions : Connection[] =  [
    {
      id: 1,
      name: "NovaStar",
      username: "@novawrites",
      image: profile,
      
    },
    {
      id: 2,
      name: "LunaSky",
      username: "@lunascribbles",
      image: "/images/luna.jpg",
      
    },]


  let activeConnections: Connection[] = [];
  if (activeTab === "All Friends") activeConnections = allConnections;
  if (activeTab === "Friend Requests") activeConnections = friendRequests;
  if (activeTab === "Suggestions") activeConnections = suggestions;

const filteredConnections = activeConnections.filter(conn =>
  conn.name.toLowerCase().includes(searchValue.toLowerCase()) ||
  conn.username.toLowerCase().includes(searchValue.toLowerCase())
);


  return (
    <div className="flex flex-col gap-6">
      {/* Top Tabs + Search */}
      <ConnectionsCard
        title="My Connections"
        subtitle="Explore the trending posts and discussions among your connections at this moment."
        tabs={["All Friends", "Friend Requests", "Suggestions"]}
        onSearch={setSearchValue}
         onTabChange={setActiveTab}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left Title */}
        <h2
          className="text-[14px] font-medium capitalize leading-[100%]"
          style={{
            fontFamily: "Poppins",
            letterSpacing: "0",
          }}
        >
          { activeTab === "All Friends"
            ? 'All Connections'
            : activeTab === "Friend Requests"
            ? 'Friend Requests'
            : 'Suggestions' 
          }
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
              className="h-4 w-4 absolute right-3 top-2.5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M9.5 17a7.5 7.5 0 110-15 7.5 7.5 0 010 15z" />
            </svg>
          </div>
          <button
            className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full text-sm transition"
          >
            Search Connections
          </button>
        </div>
      </div>


      <div className=" sm:grid gap-4 md:gap-5 lg:gap-6 justify-items-center grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {filteredConnections.map((conn) => (
          <FriendCard
            key={conn.id}
            name={conn.name}
            username={conn.username.replace("@", "")}
            image={conn.image}
            actions={
              activeTab === "All Friends"
                ? ["chat"]
                : activeTab === "Friend Requests"
                ? ["accept", "reject"]
                : []
            }
            onChat={() => console.log("Chat with", conn.name)}
            onAccept={() => handleAcceptRequest(conn.id)}
            onReject={() => handleRejectRequest(conn.id)}
            onMaximize={() => setSelectedFriend({ ...conn, id: conn.id })}
          />
        ))}
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
