//import React from "react";
import { useRef, useEffect, useState } from "react";
import {
  DashboardDetails,
  GetFollowingFollowerUsers,
  GetFriendRequest,
  GetFriendSuggestions,
  GetPopularCompanyDetails,
  GetRecommendedBestPractices,
} from "../Common/ServerAPI";
import {
  GreetingBar,
  TrueProfileCard,
  CertificationCard,
  SocialStackCard,
  BestPracticesSection,
  DirectorySection,
} from "../components/Seller/SellerSegmentcard";
import { useToast } from "../components/ui/Toast/ToastProvider";
import { useNavigate } from "react-router-dom";

interface UserData {
  id: number;
  name: string;
  email: string;
  profile_progress: number;
  assesment_progress: number;
}

// Define the Best Practice item type
interface BestPracticeItem {
  id: string;
  title: string;
  description: string;
  image: string;
  file?: string;
  followers_count: number;
  likes_count: number;
  comments_count: number;
  is_saved: boolean;
  if_following: boolean;
}

// Define the API response type
interface ApiResponse<T> {
  data?: {
    data?: T;
  };
}

export default function SellerDashboard() {
  const [user, setUser] = useState<UserData | null>(null);
  const [resonating, setReasonating] = useState<UserData | null>(null);
  const [reasonators, setReasonators] = useState<UserData | null>(null);
  const [bestPractices, setBestPractices] = useState<BestPracticeItem[]>([]);
  const [_loadingBestPractices, setLoadingBestPractices] = useState(false);
  const [directoryItems, setDirectoryItems] = useState<any[]>([]);
  const [friendRequests, setFriendRequests] = useState<any[]>([]);
  const [suggestion, setFriendSuggestion] = useState<any[]>([]);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const hasFetched = useRef(false);

  const fetchDashboard = async () => {
    try {
      const response: ApiResponse<UserData> = await DashboardDetails();
      if (response?.data?.data) {
        setUser(response.data.data);
        localStorage.setItem("name", response.data.data?.name);
      }
    } catch (error: any) {
      console.error("Error fetching dashboard data:", error);
      showToast({
        message: error?.response?.data?.error?.message,
        type: "error",
        duration: 5000,
      });
    }
  };

  const fetchRecommendedBestPractices = async () => {
    setLoadingBestPractices(true);
    try {
      const response = await GetRecommendedBestPractices();
      console.log("🚀 ~ fetchRecommendedBestPractices ~ response:", response);

      if (response?.data?.data?.rows) {
        // Transform the API response to match the expected BestPracticeItem format
        const transformedData: BestPracticeItem[] = response.data.data.rows.map(
          (item: any) => ({
            id: item.id,
            title: item.title,
            description: item.description,
            image:
              item.file ||
              "https://images.unsplash.com/photo-1557800636-894a64c1696f?q=80&w=1200&auto=format&fit=crop", // fallback image
          })
        );

        setBestPractices(transformedData);
      }
    } catch (error: any) {
      console.error("Error fetching best practices:", error);
      showToast({
        message: error?.response?.data?.error?.message,
        type: "error",
        duration: 5000,
      });
    } finally {
      setLoadingBestPractices(false);
    }
  };

  const fetchPopularCompany = async (page: number = 1) => {
    try {
      const res = await GetPopularCompanyDetails(page, 3);
      console.log("🚀 ~ fetchPopularCompany ~ res:", res);

      if (res?.data?.data?.rows) {
        const transformedData: any[] = res.data.data.rows.map((item: any) => ({
          id: item.id,
          name: item.name,
          handle: `@${item.name}` || "@liamthegreat",
          avatar:
            item.profile_picture ||
            "https://images.unsplash.com/photo-1557800636-894a64c1696f?q=80&w=1200&auto=format&fit=crop", // fallback image
        }));
        setDirectoryItems(transformedData);
      }
    } catch (error: any) {
      console.error("Error fetching popular companies:", error);
      showToast({
        message: error?.response?.data?.error?.message,
        type: "error",
        duration: 5000,
      });
    }
  };

  const fetchFollowingFollowerUsers = async () => {
    try {
      const res = await GetFollowingFollowerUsers();
      setReasonating(res.data.data.followingCount || "0");
      setReasonators(res.data.data.followerCount || "0");
    } catch (error) {
      console.error("Error fetching follower users:", error);
      // Optional: Show error to user
      showToast({
        message: "Failed to load follower users",
        type: "error",
        duration: 3000,
      });
    }
  };
  const fetchFriendRequests = async () => {
    try {
      const response = await GetFriendRequest();
      const formattedRequests = response.data.data.rows.map((item: any) => ({
        id: item.friend_user.id,
        name: `${item.friend_user.profile.first_name} ${item.friend_user.profile.last_name}`,
        handle: `@${item.friend_user.profile.first_name} ${item.friend_user.profile.last_name}`,
        avatar: item.friend_user.profile.profile_picture,
      }));
      setFriendRequests(formattedRequests);
    } catch (error) {
      console.error("Error fetching friend requests:", error);
    }
  };
  const fetchFriendSuggestions = async () => {
    try {
      const response = await GetFriendSuggestions();
      const formattedRequests = response.data.data.rows.map((item: any) => ({
        id: item.friend_user.id,
        name: `${item.friend_user.profile.first_name} ${item.friend_user.profile.last_name}`,
        handle: `@${item.friend_user.profile.first_name} ${item.friend_user.profile.last_name}`,
        avatar: item.friend_user.profile.profile_picture,
      }));
      setFriendSuggestion(formattedRequests);
    } catch (error) {
      console.error("Error fetching friend requests:", error);
    }
  };

  useEffect(() => {
    if (!hasFetched.current) {
      fetchDashboard();
      fetchRecommendedBestPractices();
      fetchPopularCompany();
      fetchFollowingFollowerUsers();
      fetchFriendRequests();
      fetchFriendSuggestions();
      hasFetched.current = true;
    }
  }, []);


  const userProfilePicture =
    localStorage.getItem("profile_picture") || "/profile.png";
  const Id =
    localStorage.getItem("Id") || "";

  const userName =
    localStorage.getItem("name") +
      " " +
      localStorage.getItem("margaret_name") || "User";

  return (
    <div className="px-4 lg:px-6 py-6">
      <GreetingBar
        name={user?.name || ""}
        onCloseSuggestion={() => console.log("close suggestion")}
      />

      <div className="grid grid-cols-12 gap-5">
        {/* LEFT column stacks: TrueProfile -> Certification -> BestPractices -> Directory */}
        <div className="col-span-12 lg:col-span-8 space-y-5">
          <TrueProfileCard
            avatarUrl="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=facearea&facepad=3&crop=faces"
            completion={user?.profile_progress || 100}
            onUpdateProfile={() => navigate(`/dashboard/user-profile/${Id}`)}
            onOpen={() => console.log("Open True Profile")}
          />

          <CertificationCard
            progress={user?.assesment_progress || 100}
            activeLevel="Inspired"
            onContinue={() => navigate("/dashboard/assesment")}
            onOpen={() => console.log("Open Certification")}
          />

          <BestPracticesSection
            items={bestPractices}
            onAdd={() => navigate("/dashboard/bestpractices")}
            onFollow={(bp) => console.log("Follow:", bp)}
          />

          {/* ⬇️ Directory directly below Best Practices */}
          <DirectorySection
            items={directoryItems}
            onView={(item) => navigate(`/dashboard/userprofile/${item.id}`)}
          />
        </div>

        {/* RIGHT column: single long Social stack */}
        <div className="col-span-12 lg:col-span-4">
          <SocialStackCard
            coverUrl="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop"
            avatarUrl={userProfilePicture}
            name={userName}
            handle={userName}
            resonating={resonating || 0}
            resonators={reasonators || 0}
            onViewProfile={() => console.log("View profile")}
            onSearch={(q) => console.log("Search:", q)}
            onOpen={() => console.log("Open Social")}
            adventureTitle="Your Next Social Life Adventure"
            adventureText="What would your younger self admire about your life now? Any standout achievements or experiences?"
            onStartPosting={() => navigate("/dashboard/feed")}
            onViewFeed={() => navigate("/dashboard/feed")}
            suggested={suggestion}
            requested={friendRequests}
            onConnect={(f) => console.log("Connect:", f)}
          />
        </div>
      </div>
    </div>
  );
}
