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
  GetRecommendedBestPractices,
  GetValidProfessionalDetails,
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
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";

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
      fetchProfession();
      fetchIntrusts();
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

  // ---- file input handler ----
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setNewPractice((prev) => ({ ...prev, file: f }));
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

  const userProfilePicture =
    localStorage.getItem("profile_picture") || "/profile.png";
  const Id = localStorage.getItem("Id") || "";

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
            avatarUrl={userProfilePicture}
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
            onAdd={openModal}
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
            onSearch={() => navigate("/dashboard/feed")}
            onOpen={() => navigate("/dashboard/Profile")}
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

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="p-4 sm:p-6 w-full max-w-md mx-auto">
          <h2 className="text-xl font-bold mb-4 font-['Poppins'] leading-normal">
            Add Best Practice
          </h2>
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Title*
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={newPractice.title}
                onChange={(e) =>
                  setNewPractice((p) => ({ ...p, title: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                required
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description*
              </label>
              <textarea
                id="description"
                name="description"
                value={newPractice.description}
                onChange={(e) =>
                  setNewPractice((p) => ({ ...p, description: e.target.value }))
                }
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                required
              />
            </div>

            <div>
              <label
                htmlFor="profession"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Profession
              </label>
              <select
                id="profession"
                name="profession"
                value={newPractice.profession}
                onChange={(e) =>
                  setNewPractice((p) => ({ ...p, profession: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                // required
              >
                <option value="">Select a profession</option>
                {professions.map((prof) => (
                  <option key={prof.id} value={prof.id}>
                    {prof.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="interest"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Interest
              </label>
              <select
                id="interest"
                name="interest"
                value={newPractice.interest}
                onChange={(e) =>
                  setNewPractice((p) => ({ ...p, interest: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                // required
              >
                <option value="">Select a interest</option>
                {interests.map((it) => (
                  <option key={it.id} value={it.id}>
                    {it.name}
                  </option>
                ))}
              </select>
            </div>

            <label
              htmlFor="interest"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Tags
            </label>
            <div className="w-full border border-gray-300 bg-white rounded-xl px-3 py-2">
              <div className="flex flex-wrap gap-2 mb-1">
                {tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="flex items-center bg-[#f3f1ff] text-[#6269FF] px-3 py-1 rounded-full text-[14px]"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(idx)}
                      className="ml-1 text-[#6269FF] hover:text-red-500 font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                className="w-full text-sm bg-white focus:outline-none placeholder-gray-400"
                placeholder="Add tags (e.g. therapy, online, free-consult)"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleTagKeyDown}
              />
            </div>

            <div>
              <label
                htmlFor="file"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                File *
              </label>
              {/* <input
                      type="file"
                      id="file"
                      name="file"
                      onChange={handleFileChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                      accept="image/*, .pdf, .doc, .docx"
                    /> */}

              <div className="relative w-full">
                <input
                  type="file"
                  id="file"
                  name="file"
                  accept="image/*, .pdf, .doc, .docx"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  style={{ cursor: "pointer" }}
                />
                <div className="flex items-center w-full h-[45px] px-4 py-2 border bg-white border-gray-300 rounded-xl text-sm text-gray-800 focus-within:ring-2 focus-within:ring-purple-500">
                  <button
                    type="button"
                    tabIndex={-1}
                    className="mr-3 px-5 py-2 bg-[#7077FE] text-white rounded-full text-sm font-medium hover:bg-[#5a60d6] transition"
                    style={{ minWidth: 0 }}
                    onClick={() => {
                      // trigger file input click
                      const input = document.querySelector(
                        'input[type="file"][name="featuredImage"]'
                      ) as HTMLInputElement | null;
                      if (input) input.click();
                    }}
                  >
                    Choose File
                  </button>
                  <span className="flex-1 truncate text-gray-500">
                    {newPractice?.file ? (
                      newPractice?.file?.name
                    ) : (
                      <span className="text-gray-400">No file chosen</span>
                    )}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-row justify-center gap-2 pt-4 flex-wrap">
              <Button
                type="button"
                onClick={closeModal}
                variant="white-outline"
                className="w-[104px] h-[39px] rounded-[100px] p-0
          font-['Plus Jakarta Sans'] font-medium text-[12px] leading-none
          flex items-center justify-center"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="gradient-primary"
                className="w-[104px] h-[39px] rounded-[100px] p-0
          font-['Plus Jakarta Sans'] font-medium text-[12px] leading-none
          flex items-center justify-center"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
