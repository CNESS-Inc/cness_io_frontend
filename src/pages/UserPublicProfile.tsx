import { Button } from "@headlessui/react";
import { UserRoundPlus, Share2, Link, UserRoundMinus } from "lucide-react";
import BestPracticeCard from "../components/ui/BestPracticesCard";
import insta from "../assets/instagram.svg";
import facebook from "../assets/facebook.svg";
import linkedin from "../assets/linkedin.svg";
import twitter from "../assets/twitter.svg";
import fluent from "../assets/fluent.svg";
import work from "../assets/work.svg";
import service from "../assets/service.svg";
import bio from "../assets/bio.svg";
import education from "../assets/education.svg";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { iconMap } from "../assets/icons";
import SignupModel from "../components/OnBoarding/Signup";
import {
  UnFriend,
  // GetUserProfileDetails,
  SendConnectionRequest,
  // GetPublicProfileDetails,
  // GetProfileDetailsById,
  // GetFollowBestpractices,
  SendFollowRequest,
  // GetBestpracticesByUserProfile,
  // GetValidProfessionalDetails,
  // GetInterestsDetails,
  SendBpFollowRequest,
  GetPublicProfileDetailsById,
  GetInterestsDetails,
  GetValidProfessionalDetails,
  AcceptFriendRequest,
  RejectFriendRequest,
  GetFollowBestpractices,
  GetBestPracticesById,
  UpdateBestPractice,
  GetBestpracticesByUserProfile,
  DeleteBestPractices,
  //UnFriend,
} from "../Common/ServerAPI";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../components/ui/Toast/ToastProvider";
import { useState, useEffect } from "react";
//import banner from "../assets/aspcom2.png";
import DOMPurify from "dompurify";
// import { normalizeFileUrl } from "../components/ui/Normalizefileurl";
import { FaLocationDot } from "react-icons/fa6";
import SharePopup from "../components/Social/SharePopup";
import { buildShareUrl } from "../lib/utils";
import bpicon from "../assets/bpicon.svg";
import {
  OutlinePill,
  PrimaryButton,
} from "../components/Seller/SellerSegmentcard";
import AddBestPracticeModal from "../components/sections/bestPractiseHub/AddBestPractiseModal";
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/DashboardCard";
import EditBestPracticeModal from "../components/sections/bestPractiseHub/EditBestPracticesModel";
import Modal from "../components/ui/Modal";

const levels = [
  {
    key: "Aspiring",
    label: "ASPIRED",
    img: "https://cdn.cness.io/aspiringlogo.svg",
  },
  {
    key: "Inspired",
    label: "INSPIRED",
    img: "https://cdn.cness.io/inspired1.svg",
  },
  {
    key: "Leader",
    label: "LEADER",
    img: "https://cdn.cness.io/leader1.webp",
  },
];

const fmtOpts: Intl.DateTimeFormatOptions = { month: "short", year: "numeric" }; // "Jan 2025"

const formatDateSafe = (value?: string | Date | null, opts = fmtOpts) => {
  if (!value) return "";
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat(undefined, opts).format(d);
};

export const formatRange = (
  start?: string | Date | null,
  end?: string | Date | null,
  isCurrent?: boolean,
  opts = fmtOpts
) => {
  const s = formatDateSafe(start, opts);
  const e = isCurrent ? "Present" : formatDateSafe(end, opts);
  return [s, e].filter(Boolean).join(" – ");
};

export default function UserProfileView() {
  const [userDetails, setUserDetails] = useState<any>();
  const [followBP, setFollowBP] = useState<any>([]);
  const [activeTab, setActiveTab] = useState("about");
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isShareOpen, setIsShareOpen] = useState(false);
  const handleShareToggle = () => setIsShareOpen((prev) => !prev);
  const handleShareClose = () => setIsShareOpen(false);
  const [activeModal, setActiveModal] = useState(false);
  const loggedInUserID = localStorage.getItem("Id");
  const [profession, setProfession] = useState<any[]>([]);
  const [interest, setInterestData] = useState<any[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [createTags, setCreateTags] = useState<string[]>([]); // Separate tags for create modal
  const [inputValue, setInputValue] = useState("");
  const [newPractice, setNewPractice] = useState({
    title: "",
    description: "",
    profession: "",
    interest: "",
    file: null as File | null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mineBestPractices, setmineBestPractices] = useState<any[]>([]);
  const [expandedDescriptions] = useState<Record<string, boolean>>({});
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    practiceId: string | null;
  }>({ isOpen: false, practiceId: null });
  const [openSignup, setOpenSignup] = useState(false);

  const token = localStorage.getItem("jwt");

  useEffect(() => {
    if (token) {
      navigate(`/dashboard/userprofile/${id}`);
    }
  }, [navigate]);

  const truncateText = (text: string, maxLength: number): string => {
    if (!text) return "";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };
  const filteredMineBestPractices = mineBestPractices.filter(
    (practice) => practice.status === 1
  );

  const isOwnProfile =
    (id && String(id) === String(loggedInUserID)) ||
    (userDetails?.user_id &&
      String(userDetails.user_id) === String(loggedInUserID));
  const userLevel = userDetails?.level?.level;

  let displayLevels: typeof levels = [];
  if (userLevel === "Aspiring") {
    displayLevels = levels.slice(0, 1);
  } else if (userLevel === "Inspired") {
    displayLevels = levels.slice(0, 2);
  } else if (userLevel === "Leader") {
    displayLevels = levels;
  }

  const [isAboutExpanded, setIsAboutExpanded] = useState(false);

  // Add this function to truncate the about text
  const truncateAboutText = (text: string, maxLength: number = 150): string => {
    if (!text) return "";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };
  const fetchMineBestPractices = async () => {
    try {
      const res = await GetBestpracticesByUserProfile(id);
      if (res?.data?.data) {
        const transformedCompanies = res.data.data.rows.map(
          (practice: any) => ({
            id: practice.id,
            title: practice.title,
            description: practice.description,
            file: practice.file,
            profession: practice.profession_data?.title || "General",
            user: {
              username: practice.user?.username || "Anonymous",
              profilePicture:
                practice.profile?.profile_picture || iconMap["aspcompany1"],
              firstName: practice.profile?.first_name || "",
              lastName: practice.profile?.last_name || "",
            },
            followersCount: practice.followers_count || 0,
            likesCount: practice.likes_count || 0,
            isLiked: practice.is_liked || false,
            commentsCount: practice.total_comment_count || 0,
            status: practice.status,
          })
        );
        setmineBestPractices(transformedCompanies);
      }
    } catch (error: any) {
      console.error("Error fetching inspiring companies:", error);
      showToast({
        message: error?.response?.data?.error?.message,
        type: "error",
        duration: 5000,
      });
    }
  };

  const handleDeleteBestPractice = async (id: any) => {
    try {
      await DeleteBestPractices(id);
    } catch (error: any) {
      console.error("Error fetching inspiring companies:", error);
      showToast({
        message: error?.response?.data?.error?.message,
        type: "error",
        duration: 5000,
      });
    }
  };
  const fetchFollowBestPractices = async () => {
    try {
      const res = await GetFollowBestpractices();
      setFollowBP(res.data.data.rows);
      console.log("🚀 ~ fetchFollowBestPractices ~ res:", res);
    } catch (error: any) {
      console.error("Error fetching inspiring companies:", error);
      showToast({
        message: error?.response?.data?.error?.message,
        type: "error",
        duration: 5000,
      });
    }
  };

  useEffect(() => {}, []);
  useEffect(() => {
    if (token) {
      fetchMineBestPractices();
      fetchFollowBestPractices();
    }
  }, [activeTab === "best"]);

  useEffect(() => {
    fetchUserDetails();
    if (token) {
      // fetchPublicUserDetails();
      // fetchAllBestPractises();
      // fetchFollowBestPractises();
      fetchProfession();
      fetchIntrusts();
    }
  }, []);

  const fetchProfession = async () => {
    try {
      const res = await GetValidProfessionalDetails();
      setProfession(res?.data?.data);
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
      setInterestData(res?.data?.data);
    } catch (error: any) {
      console.error("Error fetching Intrusts:", error);
      showToast({
        message: error?.response?.data?.error?.message,
        type: "error",
        duration: 5000,
      });
    }
  };

  const slugify = (str: string) => {
    return str
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "");
  };

  const fetchUserDetails = async () => {
    try {
      // const res = await GetUserProfileDetails(id);
      const res = await GetPublicProfileDetailsById(id);
      setUserDetails(res?.data?.data);
    } catch (error: any) {
      showToast({
        message: error?.response?.data?.error?.message,
        type: "error",
        duration: 5000,
      });
    }
  };

  // const fetchPublicUserDetails = async () => {
  //   try {
  //     const res = await GetPublicProfileDetails();
  //     setPublicUserDetails(res?.data?.data);
  //   } catch (error: any) {
  //     showToast({
  //       message: error?.response?.data?.error?.message,
  //       type: "error",
  //       duration: 5000,
  //     });
  //   }
  // };

  // const fetchAllBestPractises = async () => {
  //   try {
  //     const res = await GetBestpracticesByUserProfile(id);
  //     setMyBP(res?.data?.data?.rows);
  //   } catch (error: any) {
  //     showToast({
  //       message: error?.response?.data?.error?.message,
  //       type: "error",
  //       duration: 5000,
  //     });
  //   }
  // };

  // const fetchFollowBestPractises = async () => {
  //   try {
  //     const res = await GetFollowBestpractices();
  //     setFollowBP(res?.data?.data?.rows);
  //   } catch (error: any) {
  //     showToast({
  //       message: error?.response?.data?.error?.message,
  //       type: "error",
  //       duration: 5000,
  //     });
  //   }
  // };

  const handleFollow = async (userId: string) => {
    try {
      const formattedData = {
        following_id: userId,
      };
      await SendFollowRequest(formattedData);
      setUserDetails({
        ...userDetails,
        is_bp_following: !userDetails?.is_bp_following,
      });
    } catch (error) {
      console.error("Error fetching selection details:", error);
    }
  };

  const handleFriend = async (userId: string) => {
    try {
      // Case 1: No existing connection or pending request - Send new connection request
      if (
        userDetails.friend_request_status !== "ACCEPT" &&
        userDetails.friend_request_status !== "PENDING" &&
        !userDetails.if_friend
      ) {
        const formattedData = {
          friend_id: userId,
        };
        const res = await SendConnectionRequest(formattedData);
        console.log("🚀 ~ handleFriend ~ res:", res);
        showToast({
          message: res?.success?.message,
          type: "success",
          duration: 2000,
        });
        setUserDetails({
          ...userDetails,
          if_friend: false,
          friend_request_status: "PENDING",
        });
      }
      // Case 2: Cancel pending request (when status is PENDING)
      else if (
        userDetails.friend_request_status === "PENDING" &&
        !userDetails.if_friend
      ) {
        const formattedData = {
          friend_id: userId,
        };
        const res = await UnFriend(formattedData); // Or use a specific cancel request API if available
        showToast({
          message: res?.success?.message,
          type: "success",
          duration: 2000,
        });
        setUserDetails({
          ...userDetails,
          if_friend: false,
          friend_request_status: null,
        });
      }
      // Case 3: Remove existing friend connection
      else if (
        userDetails.friend_request_status === "ACCEPT" &&
        userDetails.if_friend
      ) {
        const formattedData = {
          friend_id: userId,
        };
        const res = await UnFriend(formattedData);
        showToast({
          message: res?.success?.message,
          type: "success",
          duration: 2000,
        });
        setUserDetails({
          ...userDetails,
          if_friend: false,
          friend_request_status: null,
        });
      }
    } catch (error) {
      console.error("Error handling friend request:", error);
      showToast({
        message: "Failed to update connection",
        type: "error",
        duration: 3000,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isEditMode) {
        // For edit mode, send as FormData to include file
        const formData = new FormData();
        formData.append("id", currentPractice.id);
        formData.append("profession", currentPractice?.profession_data?.id);
        formData.append("title", currentPractice.title);
        formData.append("description", currentPractice.description);
        formData.append("tags", JSON.stringify(tags));

        // Append file if it's a new file (File object), not a string URL
        if (currentPractice.file && typeof currentPractice.file !== "string") {
          formData.append("file", currentPractice.file);
        }

        // If interest exists, append it
        if (currentPractice.interest) {
          formData.append("interest", currentPractice.interest);
        }

        await UpdateBestPractice(formData);

        showToast({
          message:
            "Best practice updated successfully and please wait until admin reviews it!",
          type: "success",
          duration: 3000,
        });
      }

      closeModal();
      await fetchMineBestPractices();
      await fetchMineBestPractices();
    } catch (error: any) {
      console.error("Error saving best practice:", error);
      showToast({
        message:
          error?.response?.data?.error?.message ||
          `Failed to ${isEditMode ? "update" : "create"} best practice`,
        type: "error",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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

  const closeModal = () => {
    setActiveModal(false);
    setBestPracticeModal(null);
    setNewPractice({
      title: "",
      description: "",
      profession: "",
      interest: "",
      file: null,
    });
  };

  const removeTag = (index: number) => {
    const newTags = [...tags];
    newTags.splice(index, 1);
    setTags(newTags);
  };
  const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png"];
    const maxSize = 2 * 1024 * 1024; // 2 MB

    // ❌ Invalid file type
    if (!allowedTypes.includes(file.type)) {
      showToast({
        message: "Invalid file type. Please upload JPEG or PNG only.",
        type: "error",
        duration: 4000,
      });
      e.target.value = "";
      return;
    }

    // ❌ File too large
    if (file.size > maxSize) {
      showToast({
        message: "File size exceeds 2MB. Please upload a smaller image.",
        type: "error",
        duration: 4000,
      });
      e.target.value = "";
      return;
    }

    // ✅ Valid file
    setCurrentPractice({
      ...currentPractice,
      file,
    });
  };

  const handleTagKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    isCreateModal: boolean = false
  ) => {
    const value = isCreateModal ? inputValue : editInputValue;

    if (e.key === "Enter" && value.trim()) {
      e.preventDefault();
      const newTag = value.trim();

      if (isCreateModal) {
        if (!createTags.includes(newTag)) {
          setCreateTags([...createTags, newTag]);
          setInputValue("");
        }
      } else {
        if (!tags.includes(newTag)) {
          setTags([...tags, newTag]);
          setEditInputValue("");
        }
      }
    }
  };

  const handleTagAddKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      const newTag = inputValue.trim();
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
        setInputValue("");
      }
    }
  };

  const handleToggleFollow = async (bpId: any) => {
    try {
      const res = await SendBpFollowRequest({ bp_id: bpId });

      if (res?.success?.statusCode === 200) {
        const isNowFollowing = res?.data?.data !== null;

        showToast({
          message: isNowFollowing
            ? "Added to followed practices"
            : "Removed from followed practices",
          type: "success",
          duration: 2000,
        });

        await fetchFollowBestPractices();
      } else {
        console.warn("Unexpected status code:", res?.success?.statusCode);
      }
    } catch (error) {
      console.error("Error following/unfollowing:", error);
      showToast({
        message: "Failed to update follow status",
        type: "error",
        duration: 2000,
      });
    }
  };

  //bestpractices props
  {
    /*const data = [
    {
      name: "Emily Johnson",
      username: "EmilyJohnson",
      profileImage: "https://randomuser.me/api/portraits/women/44.jpg",
      coverImage: "https://cdn.cness.io/library.webp",
      title: "Green Office Initiative",
      description:
        "Use LED lighting, energy-saving devices, and smart thermostats to reduce electricity consumption.",
      link: "#",
    },
    {
      name: "Sarah Miller",
      username: "SarahMiller",
      profileImage: "https://randomuser.me/api/portraits/women/65.jpg",
      coverImage: "https://cdn.cness.io/library.webp",
      title: "Waste Reduction",
      description:
        "Implement recycling programs, reduce single-use plastics, and encourage digital documentation.",
      link: "#",
    },
    {
      name: "Olivia Davis",
      username: "OliviaDavis",
      profileImage: "https://randomuser.me/api/portraits/women/22.jpg",
      coverImage: "https://cdn.cness.io/library.webp",
      title: "Sustainable Procurement",
      description:
        "Source eco-friendly office supplies and partner with environmentally responsible vendors.",
      link: "#",
    },
     {
      name: "Olivia Davis",
      username: "OliviaDavis",
      profileImage: "https://randomuser.me/api/portraits/women/22.jpg",
      coverImage: "https://cdn.cness.io/library.webp",
      title: "Sustainable Procurement",
      description:
        "Source eco-friendly office supplies and partner with environmentally responsible vendors.",
      link: "#",
    },
     {
      name: "Olivia Davis",
      username: "OliviaDavis",
      profileImage: "https://randomuser.me/api/portraits/women/22.jpg",
      coverImage: "https://cdn.cness.io/library.webp",
      title: "Sustainable Procurement",
      description:
        "Source eco-friendly office supplies and partner with environmentally responsible vendors.",
      link: "#",
    },
     {
      name: "Olivia Davis",
      username: "OliviaDavis",
      profileImage: "https://randomuser.me/api/portraits/women/22.jpg",
      coverImage: "https://cdn.cness.io/library.webp",
      title: "Sustainable Procurement",
      description:
        "Source eco-friendly office supplies and partner with environmentally responsible vendors.",
      link: "#",
    },
  ];
*/
  }

  const handleAcceptRequest = async (userId: string) => {
    try {
      const formattedData = { friend_id: userId };
      await AcceptFriendRequest(formattedData);
      setUserDetails({
        ...userDetails,
        if_friend: true,
        friend_request_status: "ACCEPT",
        reciver_request_status: null,
      });

      showToast({
        message: "Friend request accepted!",
        type: "success",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error accepting friend request:", error);
      showToast({
        message: "Failed to accept friend request",
        type: "error",
        duration: 3000,
      });
    }
  };

  const handleRejectRequest = async (userId: string) => {
    try {
      const formattedData = { friend_id: userId };
      await RejectFriendRequest(formattedData);
      setUserDetails({
        ...userDetails,
        if_friend: false,
        friend_request_status: null,
        reciver_request_status: null,
      });

      showToast({
        message: "Friend request rejected",
        type: "success",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error rejecting friend request:", error);
      showToast({
        message: "Failed to reject friend request",
        type: "error",
        duration: 3000,
      });
    }
  };

  const [currentPractice, setCurrentPractice] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editInputValue, setEditInputValue] = useState("");
  const [BestPracticeModal, setBestPracticeModal] = useState<
    "bestpractices" | null
  >(null);

  const handleEditBestPractice = async (id: any) => {
    try {
      const response = await GetBestPracticesById(id);
      if (response?.data?.data) {
        setCurrentPractice(response.data.data);
        setTags(response.data.data.tags || []);
        setEditInputValue(""); // Reset edit input value
        setIsEditMode(true);
        setBestPracticeModal("bestpractices");
      }
    } catch (error: any) {
      console.error("Error fetching best practice:", error);
      showToast({
        message: error?.response?.data?.error?.message,
        type: "error",
        duration: 5000,
      });
    }
  };

  return (
    <div className="relative w-full h-full mx-auto px-1 pt-2">
      <button
        onClick={() => window.history.back()}
        className="absolute cursor-pointer top-4 left-4 bg-white rounded-full p-2 shadow-md"
      >
        <ArrowLeftIcon className="h-5 w-5 text-[#7077FE]" />
      </button>
      {/* Banner */}
      <div className="w-full h-[180px] sm:h-[220px] md:h-[260px] lg:h-[300px] xl:h-[320px] rounded-[8px]">
        <img
          src={
            !userDetails?.profile_banner ||
            userDetails?.profile_banner === "null" ||
            userDetails?.profile_banner === "undefined" ||
            !userDetails?.profile_banner.startsWith("http") ||
            userDetails?.profile_banner === "http://localhost:5026/file/"
              ? "https://cdn.cness.io/banner.webp"
              : userDetails?.profile_banner
          }
          alt="Profile Banner"
          className="w-full h-full object-cover rounded-[8px]"
        />
      </div>

      <div className="w-full flex flex-col lg:flex-row justify-between gap-[24px] bg-white">
        <div className="relative w-full lg:w-[35%] xl:w-[25%] ms-5">
          <div className="w-full -mt-[70px] sm:-mt-[90px] md:-mt-[110px] lg:-mt-[120px]">
            <div className="rounded-[10px] p-[6px] bg-white object-cover shadow w-[150px] lg:w-full h-[110px] sm:h-[140px] md:h-[190px] lg:h-[250px] 2xl:h-[320px]">
              <img
                src={
                  !userDetails?.profile_picture ||
                  userDetails?.profile_picture === "null" ||
                  userDetails?.profile_picture === "undefined" ||
                  !userDetails?.profile_picture.startsWith("http") ||
                  userDetails?.profile_picture === "http://localhost:5026/file/"
                    ? "/profile.png"
                    : userDetails?.profile_picture
                }
                alt="userlogo1"
                className="w-full h-full object-cover rounded-[10px]"
                onError={(e) => {
                  // Fallback if the image fails to load
                  const target = e.target as HTMLImageElement;
                  target.src = "/profile.png";
                }}
              ></img>
            </div>
            <div className="w-full px-3 py-[10px] mt-5 pe-14 lg:pe-0">
              <h2 className="font-['Poppins'] font-semibold text-[24px] leading-[21px] text-[#000000]">
                {userDetails?.first_name} {userDetails?.last_name}
              </h2>
              <p
                className="mt-3 font-['Open_Sans'] font-semibold text-[16px] leading-[24px] 
             bg-gradient-to-r from-[#6340FF] to-[#D748EA] bg-clip-text text-transparent"
              >
                {/* {userDetails?.public_title} */}
                {/* {publicUserDetails?.title} */}
              </p>
              <p className="mt-2 font-['Open_Sans'] font-normal text-[14px] leading-[21px] text-[#64748B] max-w-full md:max-w-[500px] break-words">
                {isAboutExpanded
                  ? userDetails?.about_us
                  : truncateAboutText(userDetails?.about_us || "", 150)}
                {userDetails?.about_us && userDetails.about_us.length > 150 && (
                  <button
                    onClick={() => setIsAboutExpanded(!isAboutExpanded)}
                    className="ml-1 text-[#7077FE] font-semibold hover:underline focus:outline-none"
                  >
                    {isAboutExpanded ? "Show less" : "Show more"}
                  </button>
                )}
              </p>

              {(userDetails?.address ||
                userDetails?.location?.city ||
                userDetails?.country?.name) && (
                <div className="mt-3 font-['Open_Sans'] font-normal text-[16px] leading-[100%] text-[#64748B]">
                  <div className="flex items-start gap-1 text-[#64748B] text-sm">
                    <div className="pt-[4px] flex-shrink-0 flex items-center">
                      <FaLocationDot className="w-3 h-3" stroke="#64748B" />
                    </div>
                    <div className="leading-snug">
                      {userDetails?.address},{" "}
                      {userDetails?.location?.city || ""},{" "}
                      {userDetails?.country?.name}
                    </div>
                  </div>
                </div>
              )}

              {/* <div className="mt-3 flex gap-3 text-center">
                <span>
                  <span className="font-['Open_Sans'] font-bold text-sm leading-[100%] text-[#64748B]">
                    2M
                  </span>
                  <span className="ml-1 font-['Open_Sans'] font-semibold text-sm leading-[100%] text-[#64748B]">
                    Resonators
                  </span>
                </span>

                <span>
                  <span className="font-['Open_Sans'] font-bold text-sm leading-[100%] text-[#64748B]">
                    500+
                  </span>
                  <span className="ml-1 font-['Open_Sans'] font-semibold text-sm leading-[100%] text-[#64748B]">
                    Connections
                  </span>
                </span>
              </div> */}

              {/* Buttons */}
              <div className="pt-4 pb-10 space-y-2 border-b border-[#E5E5E5]">
                {!isOwnProfile && (
                  <button
                    // onClick={() => handleFollow(userDetails?.user_id)}
                    onClick={() => {
                      if (token) {
                        handleFollow(userDetails?.user_id);
                      } else {
                        setOpenSignup(true);
                      }
                    }}
                    className={`w-full h-9 rounded-full 
                    bg-gradient-to-r from-[#7077FE] via-[#9747FF] to-[#F07EFF] 
                    font-['Open_Sans'] font-semibold text-[14px] leading-[150%] 
                    text-white align-middle
                    ${
                      userDetails?.is_bp_following
                        ? "bg-gray-200 text-gray-800"
                        : "bg-[#7C81FF] text-white"
                    } hover:bg-indigo-600 hover:text-white`}
                  >
                    {userDetails?.is_bp_following ? "Resonating" : "+ Resonate"}
                  </button>
                )}

                {/* {!isOwnProfile && (
                  <button
                    className="w-full h-9 rounded-full 
                bg-gradient-to-r from-[#7077FE] via-[#9747FF] to-[#F07EFF] 
                font-['Open_Sans'] font-semibold text-[14px] leading-[150%] 
                text-white align-middle"
                  >
                    + Resonate
                  </button>
                )} */}
                {!isOwnProfile && (
                  <div className="w-full">
                    {/* Show Accept/Reject buttons when user has received a pending request */}
                    {userDetails?.reciver_request_status === "PENDING" ? (
                      <div className="flex gap-2">
                        <button
                          // onClick={() =>
                          //   handleAcceptRequest(userDetails?.user_id)
                          // }
                          onClick={() => {
                            if (token) {
                              handleAcceptRequest(userDetails?.user_id);
                            } else {
                              setOpenSignup(true);
                            }
                          }}
                          className="flex-1 h-9 rounded-full bg-green-500 
                            font-['Open_Sans'] font-semibold text-[14px] leading-[150%] 
                            text-white flex items-center justify-center gap-2 hover:bg-green-600"
                        >
                          <UserRoundPlus className="w-4 h-4" />
                          Accept
                        </button>
                        <button
                          // onClick={() =>
                          //   handleRejectRequest(userDetails?.user_id)
                          // }
                          onClick={() => {
                            if (token) {
                              handleRejectRequest(userDetails?.user_id);
                            } else {
                              setOpenSignup(true);
                            }
                          }}
                          className="flex-1 h-9 rounded-full bg-red-500 
                            font-['Open_Sans'] font-semibold text-[14px] leading-[150%] 
                            text-white flex items-center justify-center gap-2 hover:bg-red-600"
                        >
                          <UserRoundMinus className="w-4 h-4" />
                          Reject
                        </button>
                      </div>
                    ) : (
                      /* Show regular Connect/Requested/Connected button for other cases */
                      <button
                        // onClick={() => handleFriend(userDetails?.user_id)}
                        onClick={() => {
                          if (token) {
                            handleFriend(userDetails?.user_id);
                          } else {
                            setOpenSignup(true);
                          }
                        }}
                        disabled={userDetails?.user_id === loggedInUserID}
                        className={`w-full h-9 rounded-full border border-[#ECEEF2] 
                          font-['Open_Sans'] font-semibold text-[14px] leading-[150%] 
                          flex items-center justify-center gap-2
                          ${
                            userDetails?.user_id === loggedInUserID
                              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                              : userDetails?.if_friend &&
                                userDetails?.friend_request_status === "ACCEPT"
                              ? "bg-green-100 text-green-700"
                              : !userDetails?.if_friend &&
                                userDetails?.friend_request_status === "PENDING"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-[#FFFFFF] text-[#0B3449]"
                          }`}
                      >
                        <UserRoundPlus className="w-4 h-4" />
                        {userDetails?.if_friend &&
                        userDetails?.friend_request_status === "ACCEPT"
                          ? "Connected"
                          : !userDetails?.if_friend &&
                            userDetails?.friend_request_status === "PENDING"
                          ? "Requested..."
                          : "Connect"}
                      </button>
                    )}
                  </div>
                )}

                <div className="relative">
                  <button
                    // onClick={handleShareToggle}
                    onClick={() => {
                      if (token) {
                        handleShareToggle();
                      } else {
                        setOpenSignup(true);
                      }
                    }}
                    className="w-full h-9 rounded-full border border-[#ECEEF2] 
             font-['Open_Sans'] font-semibold text-[14px] leading-[150%] 
             text-[#0B3449] flex items-center justify-center gap-2"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                  {isShareOpen && (
                    <SharePopup
                      isOpen={true}
                      onClose={handleShareClose}
                      url={buildShareUrl()} // 👈 pass dynamic or static url
                      position="bottom"
                    />
                  )}
                </div>
              </div>

              {/* Achievements */}
              {displayLevels.length > 0 && (
                <div className="border-b border-[#E5E5E5] pt-10 pb-10">
                  <h3 className="font-['Poppins'] font-semibold text-[16px] leading-[150%] text-[#000000] mb-3">
                    Achievements
                  </h3>

                  <div className="flex items-center justify-center gap-6">
                    {displayLevels.map((lvl) => (
                      <div
                        key={lvl.key}
                        className="flex flex-col items-center justify-center"
                      >
                        <img
                          src={lvl.img}
                          alt={`${lvl.label} Badge`}
                          className="w-12 h-12"
                        />
                        <span className="mt-1 font-['Open_Sans'] font-semibold text-[12px] leading-[100%] uppercase text-center text-[#222224]">
                          {lvl.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* On The Web */}
              {userDetails?.social_links &&
                Object.keys(userDetails.social_links).some(
                  (key) =>
                    userDetails.social_links[key] &&
                    ["linkedin", "facebook", "twitter", "instagram"].includes(
                      key
                    )
                ) && (
                  <div className="border-b border-[#E5E5E5] pt-10 pb-10">
                    <h3 className="font-['Poppins'] font-semibold text-[16px] leading-[150%] text-[#000000] mb-3">
                      On The Web
                    </h3>

                    <div className="space-y-3">
                      {[
                        {
                          key: "linkedin",
                          label: "LinkedIn",
                          icon: linkedin,
                        },
                        {
                          key: "facebook",
                          label: "Facebook",
                          icon: facebook,
                        },
                        {
                          key: "twitter",
                          label: "X", // Twitter rebranded
                          icon: twitter,
                        },
                        {
                          key: "instagram",
                          label: "Instagram",
                          icon: insta,
                        },
                      ]
                        .filter(
                          (platform) =>
                            userDetails?.social_links?.[platform.key]
                        )
                        .map((platform) => (
                          <a
                            key={platform.key}
                            href={userDetails.social_links[platform.key]}
                            className="flex items-center justify-between w-full h-[45px] border border-[#ECEEF2] rounded-lg px-3 py-2 gap-[10px] hover:bg-gray-50"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={platform.icon}
                                alt={platform.key}
                                className="w-7 h-7"
                              />
                              <span className="font-['Open_Sans'] font-bold text-[12px] leading-[100%] tracking-[0px] text-[#000000]">
                                {platform.label}
                              </span>
                              <Link className="w-4 h-4 text-[#64748B]" />
                            </div>
                            <img
                              src={fluent}
                              alt="navigation"
                              className="w-5 h-5"
                            />
                          </a>
                        ))}
                    </div>
                  </div>
                )}

              {/* My Interests */}
              <div className="border-b border-[#E5E5E5] pt-10 pb-10">
                <h3
                  className="font-['Poppins'] font-semibold text-[16px] leading-[150%] 
                   text-[#000000] mb-3"
                >
                  My Interests
                </h3>
                {userDetails?.interests?.length === 0 && (
                  <p
                    className="font-['Open_Sans'] font-normal text-[12px] leading-[21px]
                  tracking-[0px] text-[#64748B]"
                  >
                    No Interests shared yet
                  </p>
                )}
                <div className="flex flex-wrap gap-3">
                  {userDetails?.interests?.map(
                    (interest: any, index: number) => (
                      <span
                        key={interest.id || index}
                        className="px-[16px] py-[7px] rounded-[30px] border border-[#CBD5E1] 
                         bg-[#FCFCFD] font-['Open_Sans'] font-normal text-[12px] 
                         leading-[100%] tracking-[0px] text-[#64748B]"
                      >
                        {interest.name}
                      </span>
                    )
                  )}
                </div>
              </div>

              {/* My Professions */}
              <div className="pt-10 pb-10">
                <h3
                  className="font-['Poppins'] font-semibold text-[16px] leading-[150%] 
             text-[#000000] mb-3"
                >
                  My Professions
                </h3>
                {userDetails?.professions?.length === 0 && (
                  <p
                    className="font-['Open_Sans'] font-normal text-[12px] leading-[21px]
                  tracking-[0px] text-[#64748B]"
                  >
                    No professions shared yet
                  </p>
                )}
                <div className="flex flex-wrap gap-3">
                  {userDetails?.professions?.map((pro: any, index: number) => (
                    <span
                      key={pro.id || index}
                      className="px-[16px] py-[7px] rounded-[30px] border border-[#CBD5E1] 
                   bg-[#FCFCFD] font-['Open_Sans'] font-normal text-[12px] 
                   leading-[100%] tracking-[0px] text-[#64748B]"
                    >
                      {pro.title}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full lg:w-[65%] xl:w-[75%] h-full">
          <div className="px-6 relative flex flex-col md:flex-row justify-center items-center gap-3 sm:gap-4 md:gap-6 pt-3 md:pt-5">
            <span
              className="absolute bottom-0 right-0 h-px bg-[#ECEEF2]
                   left-6 md:left-6"
            />

            <div className="flex justify-center gap-6 -mt-2">
              <Button
                onClick={() => setActiveTab("about")}
                className={`relative py-3 font-['Open_Sans'] text-[14px] leading-[100%] ${
                  activeTab === "about"
                    ? "font-bold bg-gradient-to-r from-[#6340FF] to-[#D748EA] bg-clip-text text-transparent"
                    : "font-normal text-[#64748B]"
                }`}
              >
                About Me
                {activeTab === "about" && (
                  <span className="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-gradient-to-r from-[#7077FE] via-[#9747FF] to-[#F07EFF]" />
                )}
              </Button>

              <Button
                onClick={() => setActiveTab("best")}
                className={`relative py-3 font-['Open_Sans'] text-[14px] leading-[100%] ${
                  activeTab === "best"
                    ? "font-bold bg-gradient-to-r from-[#6340FF] to-[#D748EA] bg-clip-text text-transparent"
                    : "font-normal text-[#64748B]"
                }`}
              >
                My Best Practices
                {activeTab === "best" && (
                  <span className="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-gradient-to-r from-[#7077FE] via-[#9747FF] to-[#F07EFF]" />
                )}
              </Button>
            </div>
          </div>
          <div className="w-full p-6 flex flex-col">
            {activeTab === "about" && (
              <>
                {/* Bio */}

                <div className="pb-5 border-b border-[#ECEEF2]">
                  <h3
                    className="flex items-center gap-2 font-['Poppins'] font-semibold text-[16px] leading-[100%] tracking-[0px] 
             text-[#000000]"
                  >
                    <span className="flex items-center gap-2 ">
                      <img src={bio} alt="bio" className="w-6 h-6 " />
                    </span>{" "}
                    Bio
                  </h3>
                  <p
                    className="mt-2 font-['Open_Sans'] font-normal text-[14px] leading-[21px] 
             tracking-[0px] text-[#64748B]"
                  >
                    {userDetails?.bio || "No Bio available"}
                  </p>
                </div>

                {/* Educations */}
                <div className="py-6 border-b border-[#ECEEF2]">
                  <h3
                    className="flex items-center gap-2 font-['Poppins'] font-semibold text-[16px] leading-[100%] tracking-[0px] 
             text-[#000000]"
                  >
                    <span className="flex items-center gap-2">
                      <img src={education} alt="bio" className="w-6 h-6" />
                    </span>{" "}
                    Education
                  </h3>
                  {userDetails?.education?.length === 0 && (
                    <p
                      className="mt-2 font-['Open_Sans'] font-normal text-[14px] leading-[21px]
                      tracking-[0px] text-[#64748B]"
                    >
                      No Education details shared yet.
                    </p>
                  )}
                  <ul className="mt-2 space-y-4">
                    {userDetails?.education?.map((edu: any) => (
                      <li key={edu.id}>
                        {/* Degree */}
                        <p
                          className="font-['Open_Sans'] font-semibold text-[16px] leading-[20px] 
                   tracking-[0px] text-[#000000] mt-2 "
                        >
                          {edu.degree}
                        </p>

                        {/* Institution */}
                        <p
                          className="font-['Open_Sans'] font-normal text-[14px] leading-[21px] 
                   tracking-[0px] text-[#64748B] mt-2"
                        >
                          {edu.institution}
                        </p>

                        {/* Date range */}
                        {(edu.start_date ||
                          edu.end_date ||
                          edu.currently_studying) && (
                          <span className="text-xs text-gray-400 mt-1 block">
                            {formatRange(
                              edu.start_date,
                              edu.end_date,
                              edu.currently_studying
                            )}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Work Experience */}
                <div className="py-6 border-b border-[#ECEEF2]">
                  <h3 className="flex items-center gap-2 font-['Poppins'] font-semibold text-[16px] leading-[100%] tracking-[0px] text-[#000000]">
                    <span className="flex items-center gap-2">
                      <img src={work} alt="work" className="w-6 h-6" />
                    </span>
                    Work Experience
                  </h3>

                  <div className="mt-2 space-y-5">
                    {userDetails?.education?.length === 0 && (
                      <p
                        className="mt-2 font-['Open_Sans'] font-normal text-[14px] leading-[21px]
                      tracking-[0px] text-[#64748B]"
                      >
                        No work experience added yet.
                      </p>
                    )}
                    {userDetails?.work_experience?.map((job: any) => (
                      <div key={job.id}>
                        {/* Position + Company */}
                        <p className="font-['Open_Sans'] font-semibold text-[16px] leading-[20px] tracking-[0px] text-[#000000]">
                          {job.position} {job.company && `at ${job.company}`}
                        </p>

                        {/* Location + Dates */}
                        <p className="font-['Open_Sans'] font-normal text-[14px] leading-[21px] tracking-[0px] text-[#64748B] mt-2">
                          <span className="flex items-center gap-1 text-[#64748B] text-sm">
                            <FaLocationDot
                              className="w-3 h-3"
                              stroke="#64748B"
                            />

                            {[job.work_city, job.work_state, job.work_country]
                              .filter(Boolean)
                              .join(", ") || "Location not specified"}

                            <br />
                          </span>
                          {(job.start_date ||
                            job.end_date ||
                            job.currently_working) && (
                            <span className="text-xs text-gray-400 mt-1 block">
                              {formatRange(
                                job.start_date,
                                job.end_date,
                                job.currently_working
                              )}
                            </span>
                          )}
                        </p>

                        {/* Responsibilities (if array) */}
                        {job.roles_responsibilities && (
                          <div className="mt-2 font-['Open_Sans'] font-normal text-[14px] leading-[21px] text-[#64748B]">
                            {/*  <span className="font-semibold text-[#000]">Roles & Responsibilities:</span>*/}
                            <p className="mt-1 whitespace-pre-line">
                              {job.roles_responsibilities}
                            </p>
                          </div>
                        )}

                        {/* Responsibilities Array (if you keep tasks as an array) */}
                        {job.responsibilities?.length > 0 && (
                          <ul className="mt-2 list-disc pl-5 font-['Open_Sans'] font-normal text-[14px] leading-[21px] text-[#64748B] space-y-1">
                            {job.responsibilities.map(
                              (task: string, idx: number) => (
                                <li key={idx}>{task}</li>
                              )
                            )}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Service Offered */}
                {userDetails?.person_services?.length > 0 ? (
                  <div className="py-6 border-b border-[#ECEEF2]">
                    <h3 className="flex items-center gap-2 font-['Poppins'] font-semibold text-[16px] leading-[100%] tracking-[0px] text-[#000000]">
                      <span className="flex items-center gap-2">
                        <img src={service} alt="service" className="w-6 h-6" />
                      </span>
                      Services
                    </h3>

                    <div className="mt-2 space-y-5">
                      {userDetails?.person_services?.map((service: any) => (
                        <div key={service.id}>
                          {/* Position + Company */}
                          <p className="mt-2 font-['Open_Sans'] font-normal text-[14px] leading-[21px] tracking-[0px] text-[#64748B]">
                            {service.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </>
            )}

            {/* Best Practices Tab */}
            {activeTab === "best" &&
              (filteredMineBestPractices?.length > 0 || followBP?.length > 0 ? (
                <>
                  <div>
                    {/* {userDetails?.best_practices_questions?.length > 0 && (
                    <div className="pt-6 pb-12 border-b border-[#ECEEF2]">
                      <h3 className="font-['Poppins'] font-semibold text-[16px] leading-[100%] tracking-[0px] text-[#000000] mb-6">
                        Best practices aligned CNESS
                      </h3>

                      <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4 mt-4">
                        {userDetails.best_practices_questions.map(
                          (section: any, index: number) => {
                            const allQuestions = section.sub_sections?.flatMap(
                              (sub: any) => sub.questions
                            );

                            if (!allQuestions?.length) return null;

                            return allQuestions.map((question: any) => {
                              const cardImages = [
                                bcard1,
                                bcard2,
                                bcard3,
                                bcard4,
                              ];
                              const imageForCard =
                                cardImages[index % cardImages.length];

                              return (
                                <BestPracticeCard
                                  id={question.id}
                                  key={question.id}
                                  name={
                                    userDetails.first_name +
                                    " " +
                                    userDetails.last_name
                                  }
                                  username={userDetails.first_name}
                                  profileImage={
                                    !userDetails.profile_picture ||
                                    userDetails.profile_picture === "null" ||
                                    userDetails.profile_picture ===
                                      "undefined" ||
                                    !userDetails.profile_picture.startsWith(
                                      "http"
                                    )
                                      ? "/profile.png"
                                      : userDetails.profile_picture
                                  }
                                  coverImage={imageForCard}
                                  title={section.section.name}
                                  description={
                                    question.answer?.answer ||
                                    "No answer provided"
                                  }
                                  link={
                                    question.answer?.show_question_in_public
                                      ? "#read-more"
                                      : undefined
                                  }
                                />
                              );
                            });
                          }
                        )}
                      </div>
                    </div>
                  )} */}
                    {filteredMineBestPractices.length > 0 ? (
                      <>
                        {isOwnProfile ? (
                          <>
                            <h2>My Best Practices</h2>
                          </>
                        ) : (
                          ""
                        )}
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-4 gap-x-4 gap-y-4 pt-6 px-4 pb-6 rounded-lg rounded-tl-none rounded-tr-none">
                          {filteredMineBestPractices?.map((company) => {
                            return (
                              <div
                                key={company.id}
                                className="relative bg-white cursor-pointer rounded-2xl border border-gray-200 shadow-md overflow-hidden transition-all duration-300 hover:shadow-sm hover:ring-[1.5px] hover:ring-[#F07EFF]/40"
                              >
                                {/* Edit and Delete buttons (absolute positioned in top-right) */}
                                {isOwnProfile && (
                                  <div className="absolute top-2 right-2 z-10 flex gap-2">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleEditBestPractice(company.id);
                                      }}
                                      className="p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
                                      title="Edit"
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 text-gray-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                        />
                                      </svg>
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setDeleteConfirmation({
                                          isOpen: true,
                                          practiceId: company.id,
                                        });
                                      }}
                                      className="p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
                                      title="Delete"
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 text-red-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                        />
                                      </svg>
                                    </button>
                                  </div>
                                )}
                                {/* Card content */}
                                <div
                                  onClick={() =>
                                    navigate(
                                      `/dashboard/bestpractices/${
                                        company.id
                                      }/${slugify(company.title)}`,
                                      {
                                        state: {
                                          likesCount: company.likesCount,
                                          isLiked: company.isLiked,
                                        },
                                      }
                                    )
                                  }
                                >
                                  <CardHeader className="px-4 pt-4 pb-0 relative z-0">
                                    <div className="flex items-start gap-1 pr-12">
                                      <img
                                        src={
                                          !company?.user?.profilePicture ||
                                          company?.user?.profilePicture ===
                                            "null" ||
                                          company?.user?.profilePicture ===
                                            "undefined" ||
                                          !company?.user?.profilePicture.startsWith(
                                            "http"
                                          ) ||
                                          company?.user?.profilePicture ===
                                            "http://localhost:5026/file/"
                                            ? "/profile.png"
                                            : company?.user?.profilePicture
                                        }
                                        alt={company.user.username}
                                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover mr-2 sm:mr-3"
                                        onError={(e) => {
                                          // Fallback if the image fails to load
                                          const target =
                                            e.target as HTMLImageElement;
                                          target.src = "/profile.png";
                                        }}
                                      />
                                      <div>
                                        <CardTitle className="text-sm font-semibold">
                                          {company.user.firstName}{" "}
                                          {company.user.lastName}
                                        </CardTitle>
                                        <CardDescription className="text-xs text-gray-500">
                                          @{company.user.username}
                                        </CardDescription>
                                      </div>
                                    </div>
                                  </CardHeader>
                                  <div className="px-4 pt-4 pb-0 relative z-0">
                                    <div className="rounded-xl overflow-hidden mb-3">
                                      {company.file && (
                                        <img
                                          src={
                                            !company.file ||
                                            company.file === "null" ||
                                            company.file === "undefined" ||
                                            !company.file.startsWith("http") ||
                                            company.file ===
                                              "http://localhost:5026/file/"
                                              ? iconMap["companycard1"]
                                              : company.file
                                          }
                                          alt={company.title}
                                          className="w-full h-40 sm:h-48 object-cover"
                                          onError={(e) => {
                                            // Fallback in case the image fails to load
                                            (e.target as HTMLImageElement).src =
                                              iconMap["companycard1"];
                                          }}
                                        />
                                      )}
                                    </div>
                                    <h3 className="text-base sm:text-base font-semibold mb-1 sm:mb-2 line-clamp-2">
                                      {company.title}
                                    </h3>
                                    <p className="text-sm font-semibold text-gray-900">
                                      Overview
                                    </p>

                                    <p className="text-sm text-gray-600 mb-2 leading-snug break-words whitespace-pre-line">
                                      <span
                                        dangerouslySetInnerHTML={{
                                          __html: DOMPurify.sanitize(
                                            expandedDescriptions[company.id]
                                              ? company.description
                                              : truncateText(
                                                  company.description,
                                                  100
                                                )
                                          ),
                                        }}
                                      />
                                      {company.description.length > 100 && (
                                        <span
                                          className="text-purple-600 underline cursor-pointer ml-1"
                                          // onClick={(e) => toggleDescription(e, company.id)}
                                        >
                                          {/* {expandedDescriptions[company.id]
                                  ? "Read Less"
                                  : "Read More"} */}
                                        </span>
                                      )}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </>
                    ) : (
                      ""
                    )}
                    {/* {myInterestBP?.length > 0 && (
                      <div className="pt-6 pb-12 border-b border-[#ECEEF2]">
                        <h3 className="text-lg font-semibold text-black-700 mb-4 flex items-center gap-2">
                          My best practices aligned interest
                        </h3>

                        <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4 mt-4">
                          {myInterestBP?.map((practice: any) => {
                            return (
                              <div
                                key={practice?.id}
                                onClick={(e) => {
                                  // Only navigate if it's not the Read More button
                                  if (
                                    !(e.target as HTMLElement).closest(
                                      ".read-more-btn"
                                    )
                                  ) {
                                    navigate(
                                      `/dashboard/bestpractices/${
                                        practice.id
                                      }/${slugify(practice.title)}`,
                                      {
                                        state: {
                                          likesCount: practice.likesCount,
                                          isLiked: practice.isLiked,
                                        },
                                      }
                                    );
                                  }
                                }}
                              >
                                <BestPracticeCard
                                  id={practice?.id}
                                  name={
                                    `${practice?.profile?.first_name || ""} ${
                                      practice?.profile?.last_name || ""
                                    }`.trim() || "CNESS User"
                                  }
                                  username={practice?.user?.username || "user"}
                                  profileImage={
                                    !practice?.profile?.profile_picture ||
                                    practice?.profile?.profile_picture ===
                                      "null" ||
                                    practice?.profile?.profile_picture ===
                                      "undefined" ||
                                    !practice?.profile?.profile_picture.startsWith(
                                      "http"
                                    )
                                      ? "/profile.png"
                                      : practice?.profile?.profile_picture
                                  }
                                  coverImage={
                                    !practice?.file ||
                                    practice?.file === "null" ||
                                    practice?.file === "undefined" ||
                                    !practice?.file.startsWith("http")
                                      ? "https://cdn.cness.io/banner.webp"
                                      : practice?.file
                                  }
                                  title={
                                    practice?.title ||
                                    practice?.profession_data?.title ||
                                    "Untitled"
                                  }
                                  description={practice?.description || ""}
                                  link={`/dashboard/bestpractices/${
                                    practice.id
                                  }/${slugify(practice.title)}`}
                                  ifFollowing={practice.is_bp_following}
                                  onToggleFollow={handleToggleFollow}
                                />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )} */}

                    {followBP?.length > 0 && isOwnProfile ? (
                      <>
                        <div className="pt-6 pb-12 border-b border-[#ECEEF2]">
                          <h3 className="text-lg font-semibold text-black-700 mb-4 flex items-center gap-2">
                            Best Practices I am following
                          </h3>

                          {/* <div className="pt-4 grid gap-4 md:gap-5 justify-start xl:grid-cols-3"> */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-4 gap-x-4 gap-y-4 pt-6 px-4 pb-6 rounded-lg rounded-tl-none rounded-tr-none">
                            {followBP?.map((practice: any) => {
                              return (
                                <div
                                  key={practice?.id}
                                  onClick={(e) => {
                                    // Only navigate if it's not the Read More button
                                    if (
                                      !(e.target as HTMLElement).closest(
                                        ".read-more-btn"
                                      )
                                    ) {
                                      navigate(
                                        `/dashboard/bestpractices/${
                                          practice.id
                                        }/${slugify(practice.title)}`,
                                        {
                                          state: {
                                            likesCount: practice.likesCount,
                                            isLiked: practice.isLiked,
                                          },
                                        }
                                      );
                                    }
                                  }}
                                >
                                  <BestPracticeCard
                                    id={practice?.id}
                                    name={
                                      `${practice?.profile?.first_name || ""} ${
                                        practice?.profile?.last_name || ""
                                      }`.trim() || "CNESS User"
                                    }
                                    username={
                                      practice?.user?.username || "user"
                                    }
                                    profileImage={
                                      !practice?.profile?.profile_picture ||
                                      practice?.profile?.profile_picture ===
                                        "null" ||
                                      practice?.profile?.profile_picture ===
                                        "undefined" ||
                                      !practice?.profile?.profile_picture.startsWith(
                                        "http"
                                      )
                                        ? "/profile.png"
                                        : practice?.profile?.profile_picture
                                    }
                                    coverImage={
                                      !practice?.file ||
                                      practice?.file === "null" ||
                                      practice?.file === "undefined" ||
                                      !practice?.file.startsWith("http")
                                        ? "https://cdn.cness.io/banner.webp"
                                        : practice?.file
                                    }
                                    title={
                                      practice?.title ||
                                      practice?.profession_data?.title ||
                                      "Untitled"
                                    }
                                    description={practice?.description || ""}
                                    link={`/dashboard/bestpractices/${
                                      practice.id
                                    }/${slugify(practice.title)}`}
                                    ifFollowing={practice.is_bp_following}
                                    onToggleFollow={handleToggleFollow}
                                  />
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </>
                    ) : (
                      ""
                    )}
                  </div>
                </>
              ) : isOwnProfile ? (
                <div className="flex flex-col items-center justify-center text-center p-8">
                  <img
                    src={bpicon}
                    alt="Learn Best Practices"
                    className="w-20 mb-6"
                  />
                  <h2 className="text-lg font-semibold text-gray-800">
                    Start Your Journey
                  </h2>
                  <p className="text-gray-500 mt-2 max-w-2xl">
                    Best Practices help you showcase your conscious leadership,
                    ethical innovation, and positive impact. Add one to begin
                    building your conscious portfolio.
                  </p>
                  <div className="mt-4 flex justify-center gap-2 w-full mx-auto place-items-center">
                    <PrimaryButton
                      className="px-6 py-2 rounded-lg whitespace-nowrap shrink-0
                      !justify-center text-white shadow"
                      onClick={() => setActiveModal(true)}
                    >
                      Add Best Practice
                    </PrimaryButton>
                    <OutlinePill
                      className="px-6 py-2 rounded-lg whitespace-nowrap shrink-0
                      !justify-center border border-gray-300 text-gray-600 hover:bg-gray-50"
                      onClick={() => navigate("/dashboard/bestpractices")}
                    >
                      Explore Examples
                    </OutlinePill>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-8">
                  <h2 className="text-lg font-semibold text-gray-800">
                    {userDetails?.first_name || "This user"} hasn’t shared any
                    Best Practices publicly.
                  </h2>
                  <PrimaryButton
                    className="mt-6 px-6 py-2 rounded-lg whitespace-nowrap shrink-0
                      !justify-center border border-gray-300 text-gray-600 hover:bg-gray-50"
                    // onClick={() => navigate("/dashboard/bestpractices")}
                    onClick={() => {
                      if (token) {
                        navigate("/dashboard/bestpractices");
                      } else {
                        setOpenSignup(true);
                      }
                    }}
                  >
                    Explore Best Practices Hub
                  </PrimaryButton>
                </div>
              ))}
          </div>

          {/* Member Since */}
          <div
            className="pl-6 pb-12 font-['Open_Sans'] font-semibold text-[12px] leading-[20px] 
             tracking-[0px] text-[#000000]"
          >
            <p>
              Member Since:{" "}
              {userDetails?.createdAt
                ? new Date(userDetails.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "—"}
            </p>
            {/* <a
              href="#"
              className="font-['Open_Sans'] font-normal text-[12px] leading-[21px] 
             tracking-[0px] text-[#64748B] underline"
            >
              Report
            </a> */}
          </div>
        </div>
      </div>
      <AddBestPracticeModal
        open={activeModal}
        onClose={closeModal}
        newPractice={newPractice}
        profession={profession}
        interest={interest}
        tags={tags}
        inputValue={inputValue}
        setInputValue={setInputValue}
        removeTag={removeTag}
        handleTagKeyDown={handleTagAddKeyDown}
        handleInputChange={handleInputChange}
        handleFileChange={handleFileChange}
        handleRemoveFile={handleRemoveFile}
        handleSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
      <EditBestPracticeModal
        open={BestPracticeModal === "bestpractices"}
        onClose={closeModal}
        currentPractice={currentPractice}
        setCurrentPractice={setCurrentPractice}
        profession={profession}
        interest={interest}
        tags={tags}
        editInputValue={editInputValue}
        setEditInputValue={setEditInputValue}
        removeTag={removeTag}
        handleTagKeyDown={(e) => handleTagKeyDown(e, false)}
        handleFileChange={handleEditFileChange}
        handleSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
      <Modal
        isOpen={deleteConfirmation.isOpen}
        onClose={() =>
          setDeleteConfirmation({ isOpen: false, practiceId: null })
        }
      >
        <div className="p-4 sm:p-6 w-full max-w-md mx-auto">
          <h2 className="text-xl font-bold mb-4">Confirm Deletion</h2>
          <p className="mb-6">
            Are you sure you want to delete this best practice? This action
            cannot be undone.
          </p>

          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
            <Button
              type="button"
              onClick={() =>
                setDeleteConfirmation({ isOpen: false, practiceId: null })
              }
              // variant="white-outline"
              className="rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none relative overflow-hidden cursor-pointer bg-white border border-gray-200 hover:bg-gray-50 focus-visible:ring-gray-300 px-6 py-4 text-[18px] font-[Plus_Jakarta_Sans] font-medium w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={async () => {
                if (deleteConfirmation.practiceId) {
                  await handleDeleteBestPractice(deleteConfirmation.practiceId);
                  await fetchMineBestPractices(); // Refresh the list
                  setDeleteConfirmation({ isOpen: false, practiceId: null });
                }
              }}
              className="transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none relative overflow-hidden cursor-pointer flex justify-center items-center gap-[7px] rounded-full bg-[#7077FE] text-white text-[18px] font-[Plus_Jakarta_Sans] font-medium w-full sm:w-auto py-2 px-6 sm:py-3 sm:px-8"
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>

      <SignupModel open={openSignup} onClose={() => setOpenSignup(false)} />
    </div>
  );
}
