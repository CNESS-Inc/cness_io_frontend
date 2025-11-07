//import React from "react";
import { useRef, useEffect, useState } from "react";
import {
  CreateBestPractice,
  DashboardDetails,
  GetFollowingFollowerUsers,
  GetFriendRequest,
  GetFriendSuggestions,
  GetInterestsDetails,
  GetPopularCompanyDetails,
  GetProfileDetailsById,
  GetRecommendedBestPractices,
  GetRetakeAssesment,
  GetValidProfessionalDetails,
} from "../Common/ServerAPI";
import {
  GreetingBar,
  TrueProfileCard,
  CertificationCard,
  SocialStackCard,
  BestPracticesSection,
  DirectorySection,
  MarketplaceCard,
  // LearningLabSection,
} from "../components/Seller/SellerSegmentcard";
import { useToast } from "../components/ui/Toast/ToastProvider";
import { useNavigate } from "react-router-dom";
import market1 from "../../src/assets/market1.png";
import market2 from "../../src/assets/market2.png";
import market3 from "../../src/assets/market3.png";
// import learning1 from "../../src/assets/learning1.png";
// import learning2 from "../../src/assets/learning2.png";
// import learning3 from "../../src/assets/learning3.png";
import cart1 from "../../src/assets/cart1.png";
import cart2 from "../../src/assets/cart2.png";
import AddBestPracticeModal from "../components/sections/bestPractiseHub/AddBestPractiseModal";

interface UserData {
  id: number;
  name: string;
  email: string;
  level: string;
  profile_progress: number;
  cis_score: number;
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

const suggested = [
  {
    id: 1,
    name: "Ebook",
    avatar: market1,
  },
  {
    id: 2,
    name: "Course",
    avatar: market2,
  },
  {
    id: 3,
    name: "Playlist",
    avatar: market3,
  },
];

const carted = [
  {
    id: 1,
    name: "Product Name 1",
    image: cart1,
    price: "$12.00",
  },
  {
    id: 2,
    name: "Product Name 2",
    image: cart2,
    price: "$12.00",
  },
];

// const learningLabItems = [
//   {
//     id: 1,
//     name: "Module 1: Basic",
//     image: learning1,
//     title: "Module 1: Basic",
//     progress: 100,
//     status: "completed" as const,
//     gradient:
//       "bg-[linear-gradient(90deg,#DFD6FF_0%,#E7AAFF_91.18%,#FEDBEE_182.35%)]",
//   },
//   {
//     id: 2,
//     name: "Module 2",
//     image: learning2,
//     title: "Module 2",
//     progress: 40,
//     status: "resume" as const,
//     gradient: "bg-[#A392F2]",
//   },
//   {
//     id: 3,
//     name: "Module 3",
//     image: learning3,
//     title: "Module 3",
//     progress: 0,
//     status: "locked" as const,
//   },
// ];

export default function SellerDashboard() {
  const [user, setUser] = useState<UserData | null>(null);
  const [resonating, setReasonating] = useState<UserData | null>(null);
  const [reasonators, setReasonators] = useState<UserData | null>(null);
  const [bestPractices, setBestPractices] = useState<BestPracticeItem[]>([]);
  const [_loadingBestPractices, setLoadingBestPractices] = useState(false);
  const [directoryItems, setDirectoryItems] = useState<any[]>([]);
  const [friendRequests, setFriendRequests] = useState<any[]>([]);
  const [suggestion, setFriendSuggestion] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newPractice, setNewPractice] = useState({
    title: "",
    description: "",
    profession: "",
    interest: "",
    file: null as File | null,
  });

  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [professions, setProfessions] = useState<any[]>([]);
  const [interests, setInterests] = useState<any[]>([]);

  const navigate = useNavigate();
  const { showToast } = useToast();
  const id = localStorage.getItem("Id") || "";
  const [userDetails, setUserDetails] = useState<any>(null);

  const hasFetched = useRef(false);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setNewPractice((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const fetchDashboard = async () => {
    try {
      const response: ApiResponse<UserData> = await DashboardDetails();
      console.log("response", response);
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

  const fetchUserDetails = async () => {
    try {
      // const res = await GetUserProfileDetails(id);
      const res = await GetProfileDetailsById(id);
      setUserDetails(res?.data?.data);
    } catch (error: any) {
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

      console.log("response.data.data.rows", response.data.data.rows);
      if (response?.data?.data?.rows) {
        // Transform the API response to match the expected BestPracticeItem format
        const transformedData: BestPracticeItem[] = response.data.data.rows.map(
          (item: any) => ({
            id: item.id,
            title: item.title,
            description: item.description,
            image: item.file,
            if_following: item.is_bp_following,
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
          avatar: item.profile_picture,
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
        id: item?.friend_user?.id,
        name: `${item.friend_user.profile.first_name} ${item.friend_user.profile.last_name}`,
        handle: `@${item.friend_user.profile.first_name} ${item.friend_user.profile.last_name}`,
        avatar: item.friend_user.profile.profile_picture,
      }));
      console.log("fetchFriendRequests ---------------->", formattedRequests);
      setFriendRequests(formattedRequests);
    } catch (error) {
      console.error("Error fetching friend requests:", error);
    }
  };
  const fetchFriendSuggestions = async () => {
    try {
      const response = await GetFriendSuggestions();
      const formattedRequests = response.data.data.rows.map((item: any) => ({
        id: item.id,
        name: `${item.profile.first_name} ${item.profile.last_name}`,
        handle: `@${item.profile.first_name} ${item.profile.last_name}`,
        avatar: item.profile.profile_picture,
      }));
      console.log(
        "fetchFriendSuggestions ---------------->",
        formattedRequests
      );
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
      fetchProfession();
      fetchIntrusts();
      fetchUserDetails();
      hasFetched.current = true;
    }
  }, []);

  const fetchProfession = async () => {
    try {
      const res = await GetValidProfessionalDetails();
      setProfessions(res?.data?.data);
    } catch (error: any) {
      console.error("Error fetching professions:", error);
      showToast({
        message: error?.response?.data?.error?.message,
        type: "error",
        duration: 5000,
      });
    }
  };

  const fetchIntrusts = async () => {
    try {
      const res = await GetInterestsDetails();
      setInterests(res?.data?.data);
    } catch (error: any) {
      console.error("Error fetching Intrusts:", error);
      showToast({
        message: error?.response?.data?.error?.message,
        type: "error",
        duration: 5000,
      });
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setNewPractice({
      title: "",
      description: "",
      profession: "",
      interest: "",
      file: null,
    });
    setTags([]);
    setInputValue("");
  };

  const addTag = (t: string) => {
    const trimmed = t.trim();
    if (!trimmed) return;
    if (tags.includes(trimmed)) return;
    setTags((prev) => [...prev, trimmed]);
  };
  const removeTag = (idx: number) =>
    setTags((prev) => prev.filter((_, i) => i !== idx));
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (inputValue.trim()) {
        addTag(inputValue);
        setInputValue("");
      }
    } else if (e.key === "Backspace" && inputValue === "") {
      // remove last
      setTags((prev) => prev.slice(0, -1));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Your existing file validation and setting logic
      const validTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!validTypes.includes(file.type)) {
        e.target.value = "";
        // Show error toast if needed
        return;
      }

      setNewPractice((prev) => ({
        ...prev,
        file: file,
      }));
    } else {
      // Clear the file when no file is selected
      setNewPractice((prev) => ({
        ...prev,
        file: null,
      }));
    }
  };
  const handleRemoveFile = () => {
    setNewPractice((prev) => ({
      ...prev,
      file: null,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const hasProfession = !!newPractice.profession;
    const hasInterest = !!newPractice.interest;

    if (!hasProfession && !hasInterest) {
      showToast({
        message: "Please select either a profession or an interest.",
        type: "error",
        duration: 5000,
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", newPractice.title);
      formData.append("description", newPractice.description);
      formData.append("profession", newPractice.profession);
      formData.append("interest", newPractice.interest);
      formData.append("tags", JSON.stringify(tags || []));
      if (newPractice.file) {
        formData.append("file", newPractice.file);
      }

      await CreateBestPractice(formData);

      showToast({
        message:
          "Best practices has been created and please wait until admin reviews it!",
        type: "success",
        duration: 5000,
      });

      closeModal();
      navigate("/dashboard/bestpractices");
      setIsModalOpen(false);
    } catch (error: any) {
      console.error("Error creating best practice:", error);
      showToast({
        message:
          error?.response?.data?.error?.message ||
          "Failed to create best practice",
        type: "error",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const RetakeAssesment = async () => {
    try {
      const res = await GetRetakeAssesment();
      if (res) {
        navigate("/dashboard/inspired-assessment");
      }
    } catch (error: any) {
      showToast({
        message: error?.response?.data?.error?.message,
        type: "error",
        duration: 5000,
      });
    }
  };

  const userName =
    localStorage.getItem("name") +
      " " +
      localStorage.getItem("margaret_name") || "User";

  return (
    <div className="px-5 2xl:px-5 pt-1 md:pt-1">
      <GreetingBar
        name={user?.name || ""}
        onCloseSuggestion={() => console.log("close suggestion")}
      />

      <div className="grid grid-cols-12 gap-5">
        {/* LEFT column stacks: TrueProfile -> Certification -> BestPractices -> Directory */}
        <div className="col-span-12 xl:col-span-8 space-y-5">
          <TrueProfileCard
            avatar={userDetails?.profile_picture}
            completion={user?.profile_progress || 100}
            onUpdateProfile={() => navigate(`/dashboard/user-profile`)}
            onOpen={() => console.log("Open True Profile")}
          />

          {/* {user?.assesment_progress === 0 ? (
            <div
              className="w-full relative p-6 rounded-xl bg-white"
              style={{ borderColor: "var(--Stroke, rgba(236, 238, 242, 1))" }}
            >
              <h6 className="font-['Poppins',Helvetica] font-medium text-[22px] sm:text-[28px] text-[#222224]">
                Certification Makes It Official.
              </h6>
              <h5 className="pt-3 font-['Open_Sans',Helvetica] font-normal text-base sm:text-lg text-[#999999] leading-[32px]">
                Get your conscious identity verified and unlock everything CNESS
                has to offer.
              </h5>
              <div className="py-5">
                <button
                  className="flex items-center gap-3 bg-white text-black text-sm font-normal py-2 ps-3 pe-2 rounded-full"
                  onClick={() => navigate("/dashboard/assesment")}
                  style={{
                    border: "1px solid var(--Stroke, rgba(236, 238, 242, 1))",
                    boxShadow: "0px 1px 10px 0px rgba(0, 0, 0, 0.05)",
                  }}
                >
                  <span className="font-['Open_Sans',Helvetica]">
                    Start Certification Profile
                  </span>
                  <div className="w-7 h-7 bg-[#F07EFF] text-white rounded-full flex items-center justify-center">
                    <HiOutlineLockClosed />
                  </div>
                </button>
              </div>
              <div
                className="relative p-6 rounded-xl bg-white gap-6"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(163, 146, 242, 0.1) 0%, rgba(240, 126, 255, 0.1) 100%)",
                  border: "1px solid var(--Stroke, rgba(236, 238, 242, 1))",
                }}
              >
                <h6 className="font-['Open_Sans',Helvetica] font-normal text-base sm:text-lg text-[#222224]">
                  Certification Levels
                </h6>
                <div className="grid sm:grid-cols-3 gap-[18px] w-full h-full pt-6">
                  {badgeLevels.map((badge, index) => (
                    <div
                      key={index}
                      className="w-full h-full bg-white px-6 py-[16px] rounded-[18px] flex flex-col justify-center items-center gap-3"
                      style={{
                        border:
                          "1px solid var(--Stroke, rgba(236, 238, 242, 1))",
                      }}
                    >
                      <div className="w-10 h-10">
                        <img
                          src={badge.image}
                          alt="aspired image"
                          className="w-full h-full"
                        />
                      </div>
                      <h6 className="font-['Poppins',Helvetica] font-semibold text-base sm:text-lg text-[#222224]">
                        {badge.title}
                      </h6>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : ( */}
          <CertificationCard
            progress={user?.assesment_progress ? user?.assesment_progress : 0}
            activeLevel={user?.level}
            score={user?.cis_score}
            onContinue={RetakeAssesment}
            onOpen={() => console.log("Open Certification")}
          />
          {/* )} */}

          <BestPracticesSection
            items={bestPractices}
            onAdd={openModal}
            setBestPractices={setBestPractices}
          />

          {/* ⬇️ Directory directly below Best Practices */}
          {/* <DirectorySection
            items={directoryItems}
            onView={(item) => navigate(`/dashboard/userprofile/${item.id}`)}
          /> */}
        </div>

        {/* RIGHT column: single long Social stack */}
        <div className="col-span-12 xl:col-span-4">
          <SocialStackCard
            coverUrl={
              userDetails?.profile_banner || "https://cdn.cness.io/banner.webp"
            }
            avatar={userDetails?.profile_picture}
            name={userName}
            handle={userName}
            resonating={resonating || 0}
            resonators={reasonators || 0}
            onViewProfile={() => console.log("View profile")}
            onSearch={() => navigate("/dashboard/feed")}
            onOpen={() => navigate("/dashboard/Profile")}
            adventureTitle="Your Next Social Life Adventure"
            adventureText="What would your younger self admire about your life now? Any standout achievements or experiences?"
            onStartPosting={() =>
              navigate("/dashboard/feed", {
                state: { openPostPopup: true },
              })
            }
            onViewFeed={() => navigate("/dashboard/feed")}
            suggested={suggestion}
            requested={friendRequests}
            onConnect={(f) => console.log("Connect:", f)}
          />
        </div>

        <div className="col-span-12 xl:col-span-4 h-full">
          <MarketplaceCard
            suggested={suggested}
            topRated={suggested}
            carted={carted}
          />
        </div>
        <div className="col-span-12 xl:col-span-8">
          <DirectorySection
            items={directoryItems}
            onView={(item) => navigate(`/dashboard/userprofile/${item.id}`)}
          />
        </div>
        <div className="col-span-12">
          {/* <LearningLabSection
            items={learningLabItems}
            onView={(item) => navigate(`/dashboard/userprofile/${item.id}`)}
          /> */}
        </div>
      </div>

      <AddBestPracticeModal
        open={isModalOpen}
        onClose={closeModal}
        newPractice={newPractice}
        profession={professions}
        interest={interests}
        tags={tags}
        inputValue={inputValue}
        setInputValue={setInputValue}
        removeTag={removeTag}
        handleTagKeyDown={handleTagKeyDown}
        handleInputChange={handleInputChange}
        handleFileChange={handleFileChange}
        handleRemoveFile={handleRemoveFile}
        handleSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
