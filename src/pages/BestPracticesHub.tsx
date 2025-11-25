import { useEffect, useRef, useState, type ReactNode } from "react";
import { iconMap } from "../assets/icons";
import "../App.css";
import AnimatedBackground from "../components/ui/AnimatedBackground";
import {
  CreateBestPractice,
  GetAllBestPracticesByProfession,
  GetAllBestPracticesByInterest,
  //GetAllFormDetails,
  LikeBestpractices,
  SaveBestpractices,
  GetValidProfessionalDetails,
  GetInterestsDetails,
  SendBpFollowRequest,
  // SendBpFollowRequest,
} from "../Common/ServerAPI";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "../components/ui/Toast/ToastProvider";
import { useMediaQuery } from "../hooks/useMediaQuery";
import like from "../assets/like.svg";
import comment from "../assets/comment.svg";
import { Bookmark, ChevronDown, Search, X } from "lucide-react";
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/DashboardCard";
import DOMPurify from "dompurify";
import AddBestPracticeModal from "../components/sections/bestPractiseHub/AddBestPractiseModal";

const truncateText = (text: string, maxLength: number): string => {
  if (!text) return "";
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
};

type Company = {
  interest: ReactNode;
  file: any;
  title: string;
  user: any;
  profession: ReactNode;
  likesCount: ReactNode;
  isLiked?: boolean;
  commentsCount: ReactNode;
  is_organization: boolean | undefined;
  is_person: boolean | undefined;
  id: any;
  name: string;
  location: string;
  domain: string;
  category: "Popular" | "Inspiring";
  logo: string;
  banner: string;
  description: string;
  tags: string[];
  rating: number;
  isCertified?: boolean;
  save?: number;
  is_bp_following?: boolean;
  is_saved?: boolean;
};

type PaginationData = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
};

type Profession = {
  id: string;
  title: string;
};

export default function BestPracticesHub() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { showToast } = useToast();

  // Initialize state from query params
  const [searchText, setSearchText] = useState(
    searchParams.get("search") || ""
  );
  const [profession, setProfession] = useState<Profession[]>([]);
  const [interest, setInterestData] = useState<any[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");

  // Get profession title from query params and find matching ID
  const professionTitleFromParams = searchParams.get("profession") || "";
  const initialProfessionId = professionTitleFromParams
    ? profession.find((p) => p.title === professionTitleFromParams)?.id || ""
    : "";

  const [selectedFilter, setSelectedFilter] = useState<{
    id: string;
    type: "profession" | "interest" | "";
  }>({
    id: initialProfessionId,
    type: initialProfessionId ? "profession" : "",
  });

  const [activeModal, setActiveModal] = useState<"bestpractices" | null>(null);
  const [textWidth, setTextWidth] = useState(0);
  const measureRef = useRef<HTMLSpanElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [followLoading, setFollowLoading] = useState<Record<string, boolean>>(
    {}
  );
  const [saveLoading, setSaveLoading] = useState<Record<string, boolean>>({});
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredProfessions = profession.filter((prof) =>
    prof.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredInterests = interest.filter((int) =>
    int.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Initialize selected domain text from query params
  const getSelectedDomainText = () => {
    const professionTitle = searchParams.get("profession");
    if (professionTitle) {
      return professionTitle;
    }
    return "All Domains";
  };

  const [selectedDomainText, setSelectedDomainText] = useState(
    getSelectedDomainText()
  );

  const isMobile = useMediaQuery("(max-width: 640px)");

  // State for separate best practices lists
  const [bestPracticesProfession, setBestPracticesProfession] = useState<
    Company[]
  >([]);
  console.log(
    "🚀 ~ BestPracticesHub ~ bestPracticesProfession:",
    bestPracticesProfession
  );
  const [bestPracticesInterest, setBestPracticesInterest] = useState<Company[]>(
    []
  );

  // Separate pagination states
  const [paginationProfession, setPaginationProfession] =
    useState<PaginationData>({
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      itemsPerPage: 9,
    });

  const [paginationInterest, setPaginationInterest] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 9,
  });

  // Separate loading states
  const [isLoading, setIsLoading] = useState({
    profession: false,
    interest: false,
  });

  // Update selectedDomainText when profession data is loaded or query params change
  useEffect(() => {
    if (profession.length > 0 || searchParams.get("profession")) {
      setSelectedDomainText(getSelectedDomainText());
    }
  }, [profession, searchParams]);

  const toggleSave = async (id: string, section: "profession" | "interest") => {
    if (saveLoading[id]) return;
    try {
      setSaveLoading((prev) => ({ ...prev, [id]: true }));
      const data = { post_id: id };
      await SaveBestpractices(data);

      // Update the specific best practice in the appropriate state
      if (section === "profession") {
        setBestPracticesProfession((prev) =>
          prev.map((practice) =>
            practice.id === id
              ? { ...practice, is_saved: !practice.is_saved }
              : practice
          )
        );
      } else {
        setBestPracticesInterest((prev) =>
          prev.map((practice) =>
            practice.id === id
              ? { ...practice, is_saved: !practice.is_saved }
              : practice
          )
        );
      }

      showToast({
        message: "Saved!",
        type: "success",
        duration: 1500,
      });
    } catch (error) {
      showToast({
        message: "Failed to save. Please try again.",
        type: "error",
        duration: 2000,
      });
    } finally {
      setSaveLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  // Modal states
  const [newPractice, setNewPractice] = useState({
    title: "",
    description: "",
    profession: "",
    interest: "",
    file: null as File | null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [expandedDescriptions, _setExpandedDescriptions] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    if (!measureRef.current) return;
    const el = measureRef.current;

    const observer = new ResizeObserver((entries: ResizeObserverEntry[]) => {
      for (const entry of entries) {
        setTextWidth(entry.contentRect.width);
      }
    });

    observer.observe(el);

    return () => observer.disconnect();
  }, [selectedFilter, selectedDomainText]);

  // Update query params when filter changes - using title instead of ID
  const updateQueryParams = (professionId: string, search: string) => {
    const params = new URLSearchParams();

    if (professionId) {
      // Find profession title by ID
      const professionTitle =
        profession.find((p) => p.id === professionId)?.title || "";
      if (professionTitle) {
        params.set("profession", professionTitle);
      }
    }

    if (search) {
      params.set("search", search);
    }

    setSearchParams(params);
  };

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

  // Fetch best practices by profession
  const fetchBestPracticesByProfession = async (
    page: number = 1,
    professionId: string = "",
    searchText: string = ""
  ) => {
    setIsLoading((prev) => ({ ...prev, profession: true }));
    try {
      const res = await GetAllBestPracticesByProfession(
        page,
        paginationProfession.itemsPerPage,
        professionId,
        searchText
      );
      console.log("Best practices by profession:", res.data.data.rows);
      if (res?.data?.data) {
        const transformedCompanies = res.data.data.rows.map(
          (practice: any) => ({
            id: practice.id,
            title: practice.title,
            description: practice.description,
            file: practice.file,
            profession: practice.profession_data?.title || "General",
            interest: practice.interest_data?.name || "",
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
            is_bp_following: practice.is_bp_following || false,
            is_saved: practice.is_saved || false,
          })
        );
        setBestPracticesProfession(transformedCompanies);
        setPaginationProfession((prev: PaginationData) => ({
          ...prev,
          currentPage: page,
          totalPages: Math.ceil(res.data.data.count / prev.itemsPerPage),
          totalItems: res.data.data.count,
        }));
      }
    } catch (error: any) {
      console.error("Error fetching best practices by profession:", error);
      showToast({
        message: error?.response?.data?.error?.message,
        type: "error",
        duration: 5000,
      });
    } finally {
      setIsLoading((prev) => ({ ...prev, profession: false }));
    }
  };

  // Fetch best practices by interest
  const fetchBestPracticesByInterest = async (
    page: number = 1,
    interestId: string = "",
    searchText: string = ""
  ) => {
    setIsLoading((prev) => ({ ...prev, interest: true }));
    try {
      const res = await GetAllBestPracticesByInterest(
        page,
        paginationInterest.itemsPerPage,
        interestId,
        searchText
      );
      console.log("Best practices by interest:", res.data.data.rows);
      if (res?.data?.data) {
        const transformedCompanies = res.data.data.rows.map(
          (practice: any) => ({
            id: practice.id,
            title: practice.title,
            description: practice.description,
            file: practice.file,
            profession: practice.profession_data?.title || "General",
            interest: practice.interest_data?.name || "",
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
            is_bp_following: practice.is_bp_following || false,
            is_saved: practice.is_saved || false,
          })
        );
        setBestPracticesInterest(transformedCompanies);
        setPaginationInterest((prev: PaginationData) => ({
          ...prev,
          currentPage: page,
          totalPages: Math.ceil(res.data.data.count / prev.itemsPerPage),
          totalItems: res.data.data.count,
        }));
      }
    } catch (error: any) {
      console.error("Error fetching best practices by interest:", error);
      showToast({
        message: error?.response?.data?.error?.message,
        type: "error",
        duration: 5000,
      });
    } finally {
      setIsLoading((prev) => ({ ...prev, interest: false }));
    }
  };

  // Initialize data from query params on component mount
  useEffect(() => {
    fetchProfession();
    fetchIntrusts();

    // Get initial values from query params
    const initialProfessionTitle = searchParams.get("profession") || "";
    const initialSearch = searchParams.get("search") || "";

    // Find profession ID from title after professions are loaded
    const findProfessionIdFromTitle = (title: string) => {
      return profession.find((p) => p.title === title)?.id || "";
    };

    // Set initial filter state after professions are loaded
    const initializeFilter = async () => {
      await fetchProfession();

      const initialProfessionId = initialProfessionTitle
        ? findProfessionIdFromTitle(initialProfessionTitle)
        : "";

      setSelectedFilter({
        id: initialProfessionId,
        type: initialProfessionId ? "profession" : "",
      });

      // Fetch data with initial params
      if (initialProfessionId) {
        fetchBestPracticesByProfession(1, initialProfessionId, initialSearch);
      } else {
        // If no specific filter, fetch both
        fetchBestPracticesByProfession(1, "", initialSearch);
        fetchBestPracticesByInterest(1, "", initialSearch);
      }
    };

    initializeFilter();
  }, []);

  // Re-initialize filter when professions are loaded and we have profession title in params
  useEffect(() => {
    if (profession.length > 0 && searchParams.get("profession")) {
      const professionTitle = searchParams.get("profession") || "";
      const professionId =
        profession.find((p) => p.title === professionTitle)?.id || "";

      if (professionId && professionId !== selectedFilter.id) {
        setSelectedFilter({
          id: professionId,
          type: "profession",
        });

        // Refetch data with the correct profession ID
        const search = searchParams.get("search") || "";
        fetchBestPracticesByProfession(1, professionId, search);
      }
    }
  }, [profession, searchParams]);

  const handleSearch = () => {
    // Update query params
    updateQueryParams(selectedFilter.id, searchText);

    // Get the domain slug based on filter type
    let domainSlug = "";

    if (selectedFilter.type === "profession") {
      const professionItem = profession.find((p) => p.id === selectedFilter.id);
      domainSlug = professionItem
        ? encodeURIComponent(professionItem.title)
        : "";
    } else if (selectedFilter.type === "interest") {
      const interestItem = interest.find((i) => i.id === selectedFilter.id);
      domainSlug = interestItem ? encodeURIComponent(interestItem.name) : "";
    }

    const searchQuery = encodeURIComponent(searchText);

    // Redirect based on filter type
    if (selectedFilter.type === "profession") {
      navigate(
        `/dashboard/search-bestpractices?search=${searchQuery}&profession=${domainSlug}`
      );
    } else if (selectedFilter.type === "interest") {
      navigate(
        `/dashboard/search-bestpractices?search=${searchQuery}&interest=${domainSlug}`
      );
    } else {
      // If no filter selected, redirect with only search query
      navigate(`/dashboard/search-bestpractices?search=${searchQuery}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Modal handlers
  const openModal = () => {
    setActiveModal("bestpractices");
  };

  const closeModal = () => {
    setActiveModal(null);
    setNewPractice({
      title: "",
      description: "",
      profession: "",
      interest: "",
      file: null,
    });
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
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png"];
    const maxSize = 2 * 1024 * 1024; // 2MB

    if (!allowedTypes.includes(file.type)) {
      showToast({
        message: "Invalid file type. Please upload JPEG or PNG only.",
        type: "error",
        duration: 4000,
      });
      e.target.value = "";
      return;
    }

    if (file.size > maxSize) {
      showToast({
        message: "File size exceeds 2MB. Please upload a smaller image.",
        type: "error",
        duration: 4000,
      });
      e.target.value = "";
      return;
    }

    setNewPractice((prev) => ({
      ...prev,
      file,
    }));
  };

  const handleRemoveFile = () => {
    setNewPractice((prev) => ({
      ...prev,
      file: null,
    }));
  };

  const handleLike = async (
    id: string,
    index: Number,
    section: "profession" | "interest"
  ) => {
    try {
      let data = {
        post_id: id,
      };
      const response = await LikeBestpractices(data);

      const message = response?.success?.message || "";

      if (section === "profession") {
        setBestPracticesProfession((prev) =>
          prev.map((item, i) => {
            if (i !== index) return item;

            const currentLikes = Number(item.likesCount) || 0;
            const isLiked = message.includes("Liked!");
            const newLikes = message.includes("Unliked")
              ? Math.max(currentLikes - 1, 0)
              : currentLikes + 1;

            return { ...item, likesCount: newLikes, isLiked: isLiked };
          })
        );
      } else {
        setBestPracticesInterest((prev) =>
          prev.map((item, i) => {
            if (i !== index) return item;

            const currentLikes = Number(item.likesCount) || 0;
            const isLiked = message.includes("Liked!");
            const newLikes = message.includes("Unliked")
              ? Math.max(currentLikes - 1, 0)
              : currentLikes + 1;

            return { ...item, likesCount: newLikes, isLiked: isLiked };
          })
        );
      }

      showToast({
        message: message,
        type: "success",
        duration: 1500,
      });
    } catch (error) {
      showToast({
        message: "Failed to like. Please try again.",
        type: "error",
        duration: 2000,
      });
    }
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
      formData.append("tags", JSON.stringify(tags));
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
      // Refetch both sections after creating new practice
      fetchBestPracticesByProfession(1, "", "");
      fetchBestPracticesByInterest(1, "", "");
      setActiveModal(null);
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

  const removeTag = (index: number) => {
    const newTags = [...tags];
    newTags.splice(index, 1);
    setTags(newTags);
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      const newTag = inputValue.trim();
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
        setInputValue("");
      }
    }
  };

  const toggleFollow = async (
    id: string,
    section: "profession" | "interest"
  ) => {
    if (followLoading[id]) return;
    try {
      setFollowLoading((prev) => ({ ...prev, [id]: true }));
      const res = await SendBpFollowRequest({ bp_id: id });

      if (res?.success?.statusCode === 200) {
        const isFollowing = res?.data?.data !== null;

        if (section === "profession") {
          setBestPracticesProfession((prev) =>
            prev.map((practice) => {
              if (practice.id === id) {
                return { ...practice, is_bp_following: isFollowing };
              }
              return practice;
            })
          );
        } else {
          setBestPracticesInterest((prev) =>
            prev.map((practice) => {
              if (practice.id === id) {
                return { ...practice, is_bp_following: isFollowing };
              }
              return practice;
            })
          );
        }

        showToast({
          message: isFollowing
            ? "Added to followed practices"
            : "Removed from followed practices",
          type: "success",
          duration: 2000,
        });
      } else {
        console.warn("Unexpected status code:", res?.success?.statusCode);
        showToast({
          message: "Something went wrong. Please try again.",
          type: "warning",
          duration: 2000,
        });
      }
    } catch (error) {
      console.error("Error toggling follow status:", error);
      showToast({
        message: "Failed to update follow status",
        type: "error",
        duration: 2000,
      });
    } finally {
      setFollowLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  const clearFilter = () => {
    setSelectedFilter({ id: "", type: "" });
    setSelectedDomainText("All Domains");
    setIsDropdownOpen(false);
    setSearchQuery("");

    // Update query params
    updateQueryParams("", searchText);

    // Redirect with only search query (no domain filter)
    const searchQuery = encodeURIComponent(searchText);
    navigate(`/dashboard/search-bestpractices?search=${searchQuery}`);
  };

  const handleFilterSelect = (
    id: string,
    type: "profession" | "interest" | "",
    title: string
  ) => {
    setSelectedFilter({ id, type });
    setSelectedDomainText(title);
    setIsDropdownOpen(false);
    setSearchQuery("");

    // Update query params
    updateQueryParams(id, searchText);

    // Get the domain slug based on filter type
    let domainSlug = encodeURIComponent(title);
    const searchQuery = encodeURIComponent(searchText);

    // Redirect based on filter type
    if (type === "profession") {
      navigate(
        `/dashboard/search-bestpractices?search=${searchQuery}&profession=${domainSlug}`
      );
    } else if (type === "interest") {
      navigate(
        `/dashboard/search-bestpractices?search=${searchQuery}&interest=${domainSlug}`
      );
    } else {
      // If no filter selected, redirect with only search query
      navigate(`/dashboard/search-bestpractices?search=${searchQuery}`);
    }
  };

  return (
    <>
      <div className="px-2 sm:px-2 lg:px-1">
        <section className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] mx-auto rounded-xl overflow-hidden mt-2">
          <AnimatedBackground />

          {/* Background Image (city illustration) */}
          <img
            src={iconMap["heroimg"]}
            alt="City Skyline"
            className="absolute bottom-[-200px] left-0 w-full object-cover z-0 pointer-events-none"
          />

          {/* Foreground Content */}
          <div className="relative z-10 flex flex-col items-center justify-center max-w-4xl mx-auto h-full px-4 text-center -mt-5">
   <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 sm:mb-3">
    Best Practices Hub.
  </h1>

  <p className="text-base sm:text-base text-[#242424] font-openSans -mt-1">
    Empowering better solutions for life and profession.
  </p>
            <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-5">
              {/* Searchable Profession Selector */}
              <div className="relative rounded-full" ref={dropdownRef}>
                <span
                  className="invisible absolute whitespace-nowrap text-[12px] font-semibold px-3 md:px-4 py-2 "
                  ref={measureRef}
                  style={{
                    fontFamily: "inherit",
                    fontSize: "12px",
                  }}
                >
                  {selectedDomainText || "All Profession"}
                </span>

                <div className="w-full flex justify-center md:justify-start items-center my-1 px-4 md:px-0">
                  <div
                    className="relative w-auto md:w-fit"
                    style={{
                      width: textWidth ? `${textWidth}px` : "100%",
                      minWidth: "180px",
                      maxWidth: "100%",
                    }}
                  >
                    {/* Custom Dropdown Button */}
                    <button
                      className="bg-[#7077FE] rounded-full text-white font-semibold px-3 py-2 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-[#7077FE] cursor-pointer text-[12px] w-full transition-all duration-200 flex items-center justify-between"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                      <span className="truncate">
                        {selectedDomainText || "All Profession & Interests"}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-40 overflow-hidden">
                        {/* Search Input */}
                        <div className="p-2 border-b border-gray-100">
                          <div className="relative">
                            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                              type="text"
                              placeholder="Search professions & interests..."
                              className="w-full pl-8 pr-8 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7077FE] focus:border-transparent"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                            />
                            {searchQuery && (
                              <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Clear Filter Option */}

                        <div className="overflow-y-auto max-h-80">
                          <div className="border-b border-gray-100">
                            <button
                              className={`w-full text-left px-4 py-2 text-xs hover:bg-gray-50 ${
                                !selectedFilter.id
                                  ? "bg-blue-50 text-[#7077FE]"
                                  : ""
                              }`}
                              onClick={() => clearFilter()}
                            >
                              All Profession & Interests
                            </button>
                          </div>
                          {/* Professions Section */}
                          {filteredProfessions.length > 0 && (
                            <div>
                              <div className="px-2 py-2 text-left text-xs font-semibold text-gray-500 bg-gray-50 uppercase tracking-wide">
                                Professions
                              </div>
                              {filteredProfessions.map((prof) => (
                                <button
                                  key={`p-${prof.id}`}
                                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                                    selectedFilter.id === prof.id &&
                                    selectedFilter.type === "profession"
                                      ? "bg-blue-50 text-[#7077FE] font-medium"
                                      : ""
                                  }`}
                                  onClick={() =>
                                    handleFilterSelect(
                                      prof.id,
                                      "profession",
                                      prof.title
                                    )
                                  }
                                >
                                  {prof.title}
                                </button>
                              ))}
                            </div>
                          )}

                          {/* Interests Section */}
                          {filteredInterests.length > 0 && (
                            <div>
                              <div className="px-4 py-2 text-xs font-semibold text-gray-500 bg-gray-50 uppercase tracking-wide">
                                Interests
                              </div>
                              {filteredInterests.map((int) => (
                                <button
                                  key={`i-${int.id}`}
                                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                                    selectedFilter.id === int.id &&
                                    selectedFilter.type === "interest"
                                      ? "bg-blue-50 text-[#7077FE] font-medium"
                                      : ""
                                  }`}
                                  onClick={() =>
                                    handleFilterSelect(
                                      int.id,
                                      "interest",
                                      int.name
                                    )
                                  }
                                >
                                  {int.name}
                                </button>
                              ))}
                            </div>
                          )}

                          {/* No Results */}
                          {filteredProfessions.length === 0 &&
                            filteredInterests.length === 0 && (
                              <div className="px-4 py-3 text-sm text-gray-500 text-center">
                                No results found for "{searchQuery}"
                              </div>
                            )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Search Input - remains the same */}
              <div className="relative grow">
                <input
                  type="text"
                  placeholder="Search best practices..."
                  className="w-full py-2 pl-3 pr-10 text-xs md:text-sm text-gray-700 placeholder:text-gray-400 bg-white border border-gray-200 rounded-full shadow-sm outline-none"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyDown={handleKeyPress}
                />
                <button
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#7077FE]"
                  onClick={handleSearch}
                >
                  🔍
                </button>
              </div>
            </div>

            <p className="text-gray-700 text-xs md:text-sm mt-2 sm:mt-4 md:mt-2 text-center px-2 sm:px-0">
              <span
                className="font-medium underline cursor-pointer text-[#F07EFF]"
                onClick={openModal}
              >
                Add your best practice
              </span>{" "}
              and be an author of the best practices.
            </p>
          </div>
        </section>
      </div>

      {/* Best Practices for Profession Section */}
      <section className="py-8 px-1 sm:py-16 bg-[#f9f9f9] border-t border-gray-100">
        <div className="w-full mx-auto ">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
            {(selectedFilter.id || searchText) && (
              <h4 className="poppins font-medium text-base sm:text-lg leading-[150%] tracking-normal">
                Professional Best practices
                {/* {selectedFilter.id && (
                  <span className="text-[#7077FE] ml-1 font-semibold">
                    "
                    {selectedFilter.type === "profession"
                      ? profession.find((p) => p.id === selectedFilter.id)
                          ?.title
                      : interest.find((i: any) => i.id === selectedFilter.id)
                          ?.name}
                    "
                  </span>
                )}
                {searchText?.trim() && (
                  <>
                    {selectedFilter.id ? " and " : " "}
                    <span className="text-[#7077FE] font-semibold">
                      "{searchText.trim()}"
                    </span>
                  </>
                )} */}
              </h4>
            )}

            {!selectedFilter.id && !searchText && (
              <h4 className="poppins font-medium text-base sm:text-lg leading-[150%] tracking-normal">
                Professional Best practices
              </h4>
            )}

            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              {/* Certification and Sort dropdowns commented out */}
            </div>
          </div>

          {isLoading.profession ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : bestPracticesProfession.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-x-4 gap-y-4">
              {bestPracticesProfession?.map((company, index) => {
                return (
                  <div
                    key={company.id}
                    className="relative bg-white w-full h-full flex flex-col cursor-pointer rounded-2xl border border-gray-200 shadow-md overflow-hidden transition-all duration-300 hover:shadow-sm hover:ring-[1.5px] hover:ring-[#F07EFF]/40"
                    onClick={() =>
                      navigate(
                        `/dashboard/bestpractices/${company.id}/${slugify(
                          company.title
                        )}`,
                        {
                          state: {
                            likesCount: company.likesCount,
                            isLiked: company.isLiked,
                          },
                        }
                      )
                    }
                  >
                    {/* Card content remains the same */}
                    <CardHeader className="px-4 pt-4 pb-0 relative z-0">
                      <div className="flex items-start gap-1 pr-12">
                        <img
                          src={
                            !company?.user?.profilePicture ||
                            company?.user?.profilePicture === "null" ||
                            company?.user?.profilePicture === "undefined" ||
                            !company?.user?.profilePicture.startsWith("http") ||
                            company?.user?.profilePicture ===
                              "http://localhost:5026/file/"
                              ? "/profile.jpg"
                              : company?.user?.profilePicture
                          }
                          alt={company.user.username}
                          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover mr-2 sm:mr-3"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/profile.png";
                          }}
                        />
                        <div>
                          <CardTitle className="text-sm font-semibold">
                            {company.user.firstName} {company.user.lastName}
                          </CardTitle>
                          <CardDescription className="text-xs text-gray-500">
                            @{company.user.username}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <div className="h-full flex flex-col justify-between items-scretch px-4 pt-4 pb-0 relative z-0">
                      <div className="">
                        <div className="relative rounded-xl overflow-hidden mb-3 ">
                          {company.file && (
                            <>
                              <img
                                src={
                                  !company.file ||
                                  company.file === "null" ||
                                  company.file === "undefined" ||
                                  !company.file.startsWith("http") ||
                                  company.file === "http://localhost:5026/file/"
                                    ? "/profile.jpg"
                                    : company.file
                                }
                                alt={company.title}
                                className="w-full h-40 sm:h-48 object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    iconMap["companycard1"];
                                }}
                              />
                            </>
                          )}
                        </div>
                        <div className="absolute top-6 left-6 flex gap-2 flex-wrap">
                          {(Array.isArray(company.profession)
                            ? company.profession
                            : [company.profession]
                          ).map((item, i) => (
                            <span
                              key={i}
                              className="text-[12px] inline-flex items-center justify-center rounded-full px-3 py-2 leading-none font-medium bg-[#F3F3F3] text-[#8A8A8A]"
                              style={{ fontFamily: "Poppins, sans-serif" }}
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                        <div className="w-full flex justify-between items-center gap-3">
                          <h3 className="text-base sm:text-base font-semibold mb-1 sm:mb-2 line-clamp-2">
                            {company.title}
                          </h3>
                          <div>
                            {!company.is_bp_following ? (
                              <button
                                className="px-5 py-1.5 rounded-full text-white text-[13px] font-medium bg-[#7077FE] hover:bg-[#6A6DEB] whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleFollow(company.id, "profession");
                                }}
                                disabled={followLoading[company.id]}
                              >
                                {followLoading[company.id] ? (
                                  <div className="flex items-center">
                                    <div className="w-3 h-3 border-t-2 border-b-2 border-white rounded-full animate-spin mr-1"></div>
                                    Loading...
                                  </div>
                                ) : (
                                  "+ Follow"
                                )}
                              </button>
                            ) : (
                              <button
                                className="px-5 py-1.5 rounded-full text-white text-[13px] font-medium bg-[#F396FF] whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleFollow(company.id, "profession");
                                }}
                                disabled={followLoading[company.id]}
                              >
                                {followLoading[company.id] ? (
                                  <div className="flex items-center">
                                    <div className="w-3 h-3 border-t-2 border-b-2 border-white rounded-full animate-spin mr-1"></div>
                                    Loading...
                                  </div>
                                ) : (
                                  "Following"
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                        <p className="text-sm font-semibold text-gray-900">
                          Overview
                        </p>

                        <p className="text-sm text-gray-600 leading-snug wrap-break-word whitespace-pre-line">
                          <span
                            dangerouslySetInnerHTML={{
                              __html: DOMPurify.sanitize(
                                expandedDescriptions[company.id]
                                  ? company.description
                                  : truncateText(company.description, 100)
                              ),
                            }}
                          />
                          {company.description.length > 100 && (
                            <span className="text-purple-600 underline cursor-pointer ml-1">
                              {expandedDescriptions[company.id]
                                ? "Read Less"
                                : "Read More"}
                            </span>
                          )}
                        </p>
                      </div>
                      <div className="flex items-end justify-between px-4 py-2 mt-2 text-xs sm:text-sm text-gray-600 ">
                        <div className="flex items-center space-x-6 mb-2">
                          <span
                            className="flex items-center gap-1 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLike(company.id, index, "profession");
                            }}
                          >
                            <img
                              src={like}
                              alt="Like Icon"
                              className="w-5 h-5"
                            />
                            <span>{company.likesCount || 0}</span>
                          </span>

                          <span className="flex items-center gap-1">
                            <img
                              src={comment}
                              alt="Comment Icon"
                              className="w-5 h-5"
                            />
                            <span>{company.commentsCount || 0}</span>
                          </span>
                        </div>

                        <div
                          className="cursor-pointer mb-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSave(company.id, "profession");
                          }}
                        >
                          <div className="flex items-center gap-2 cursor-pointer">
                            <Bookmark
                              className={`w-5 h-5 transition-all duration-200 ${
                                saveLoading[company.id] ? "opacity-50" : ""
                              }`}
                              fill={company.is_saved ? "#72DBF2" : "none"}
                              stroke={company.is_saved ? "#72DBF2" : "#4338CA"}
                            />
                            <span
                              className={`text-sm font-normal text-gray-700 ${
                                saveLoading[company.id] ? "opacity-50" : ""
                              }`}
                            >
                              {saveLoading[company.id]
                                ? "Saving..."
                                : company.is_saved
                                ? "Saved"
                                : "Save"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 py-10 text-center">
              No Best Practices found for Profession.
            </p>
          )}

          {paginationProfession.totalPages > 1 && (
            <div className="mt-6 sm:mt-8">
              <div className="flex justify-center">
                <nav className="inline-flex rounded-md shadow-sm -space-x-px text-xs sm:text-sm">
                  <button
                    onClick={() =>
                      fetchBestPracticesByProfession(
                        paginationProfession.currentPage - 1,
                        selectedFilter.id,
                        searchText
                      )
                    }
                    disabled={
                      paginationProfession.currentPage === 1 ||
                      isLoading.profession
                    }
                    className="px-2 sm:px-3 py-1 rounded-l-md bg-white border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-40"
                  >
                    «
                  </button>

                  {!isMobile && (
                    <>
                      <button
                        onClick={() =>
                          fetchBestPracticesByProfession(
                            1,
                            selectedFilter.id,
                            searchText
                          )
                        }
                        disabled={isLoading.profession}
                        className={`px-2 sm:px-3 py-1 border border-gray-300 ${
                          1 === paginationProfession.currentPage
                            ? "bg-indigo-500 text-white"
                            : "bg-white text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        1
                      </button>

                      {paginationProfession.currentPage > 3 && (
                        <span className="px-2 sm:px-3 py-1 border border-gray-300 bg-white">
                          ...
                        </span>
                      )}
                    </>
                  )}

                  {[
                    paginationProfession.currentPage - 1,
                    paginationProfession.currentPage,
                    paginationProfession.currentPage + 1,
                  ]
                    .filter(
                      (page) =>
                        page > 1 && page < paginationProfession.totalPages
                    )
                    .map((page) => (
                      <button
                        key={page}
                        onClick={() =>
                          fetchBestPracticesByProfession(
                            page,
                            selectedFilter.id,
                            searchText
                          )
                        }
                        disabled={isLoading.profession}
                        className={`px-2 sm:px-3 py-1 border border-gray-300 ${
                          page === paginationProfession.currentPage
                            ? "bg-indigo-500 text-white"
                            : "bg-white text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                  {!isMobile && (
                    <>
                      {paginationProfession.currentPage <
                        paginationProfession.totalPages - 2 && (
                        <span className="px-2 sm:px-3 py-1 border border-gray-300 bg-white">
                          ...
                        </span>
                      )}

                      {paginationProfession.totalPages > 1 && (
                        <button
                          onClick={() =>
                            fetchBestPracticesByProfession(
                              paginationProfession.totalPages,
                              selectedFilter.id,
                              searchText
                            )
                          }
                          disabled={isLoading.profession}
                          className={`px-2 sm:px-3 py-1 border border-gray-300 ${
                            paginationProfession.totalPages ===
                            paginationProfession.currentPage
                              ? "bg-indigo-500 text-white"
                              : "bg-white text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {paginationProfession.totalPages}
                        </button>
                      )}
                    </>
                  )}

                  <button
                    onClick={() =>
                      fetchBestPracticesByProfession(
                        paginationProfession.currentPage + 1,
                        selectedFilter.id,
                        searchText
                      )
                    }
                    disabled={
                      paginationProfession.currentPage ===
                        paginationProfession.totalPages || isLoading.profession
                    }
                    className="px-2 sm:px-3 py-1 rounded-r-md bg-white border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-40"
                  >
                    »
                  </button>
                </nav>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Best Practices for Interest Section */}
      <section className="py-8 px-1 sm:py-16 bg-[#f9f9f9] border-t border-gray-100">
        <div className="w-full mx-auto ">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
            {(selectedFilter.id || searchText) && (
              <h4 className="poppins font-medium text-base sm:text-lg leading-[150%] tracking-normal">
                Best Practices For Interest
                {/* {selectedFilter.id && (
                  <span className="text-[#7077FE] ml-1 font-semibold">
                    "
                    {selectedFilter.type === "profession"
                      ? profession.find((p) => p.id === selectedFilter.id)
                          ?.title
                      : interest.find((i: any) => i.id === selectedFilter.id)
                          ?.name}
                    "
                  </span>
                )}
                {searchText?.trim() && (
                  <>
                    {selectedFilter.id ? " and " : " "}
                    <span className="text-[#7077FE] font-semibold">
                      "{searchText.trim()}"
                    </span>
                  </>
                )} */}
              </h4>
            )}

            {!selectedFilter.id && !searchText && (
              <h4 className="poppins font-medium text-base sm:text-lg leading-[150%] tracking-normal">
                Best practices for Interest
              </h4>
            )}

            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              {/* Certification and Sort dropdowns commented out */}
            </div>
          </div>

          {isLoading.interest ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : bestPracticesInterest.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-x-4 gap-y-4">
              {bestPracticesInterest?.map((company, index) => {
                return (
                  <div
                    key={company.id}
                    className="relative bg-white w-full h-full flex flex-col cursor-pointer rounded-2xl border border-gray-200 shadow-md overflow-hidden transition-all duration-300 hover:shadow-sm hover:ring-[1.5px] hover:ring-[#F07EFF]/40"
                    onClick={() =>
                      navigate(
                        `/dashboard/bestpractices/${company.id}/${slugify(
                          company.title
                        )}`,
                        {
                          state: {
                            likesCount: company.likesCount,
                            isLiked: company.isLiked,
                          },
                        }
                      )
                    }
                  >
                    {/* Card content remains the same */}
                    <CardHeader className="px-4 pt-4 pb-0 relative z-0">
                      <div className="flex items-start gap-1 pr-12">
                        <img
                          src={
                            !company?.user?.profilePicture ||
                            company?.user?.profilePicture === "null" ||
                            company?.user?.profilePicture === "undefined" ||
                            !company?.user?.profilePicture.startsWith("http") ||
                            company?.user?.profilePicture ===
                              "http://localhost:5026/file/"
                              ? "/profile.jpg"
                              : company?.user?.profilePicture
                          }
                          alt={company.user.username}
                          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover mr-2 sm:mr-3"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "/profile.png";
                          }}
                        />
                        <div>
                          <CardTitle className="text-sm font-semibold">
                            {company.user.firstName} {company.user.lastName}
                          </CardTitle>
                          <CardDescription className="text-xs text-gray-500">
                            @{company.user.username}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <div className="h-full flex flex-col justify-between items-scretch px-4 pt-4 pb-0 relative z-0">
                      <div className="">
                        <div className="relative rounded-xl overflow-hidden mb-3 ">
                          {company.file && (
                            <>
                              <img
                                src={
                                  !company.file ||
                                  company.file === "null" ||
                                  company.file === "undefined" ||
                                  !company.file.startsWith("http") ||
                                  company.file === "http://localhost:5026/file/"
                                    ? "/profile.jpg"
                                    : company.file
                                }
                                alt={company.title}
                                className="w-full h-40 sm:h-48 object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    iconMap["companycard1"];
                                }}
                              />
                            </>
                          )}
                        </div>
                        <div className="absolute top-6 left-6 flex gap-2 flex-wrap">
                          {(Array.isArray(company.interest)
                            ? company.interest
                            : [company.interest || company.profession]
                          ).map((item, i) => (
                            <span
                              key={i}
                              className="text-[12px] inline-flex items-center justify-center rounded-full px-3 py-2 leading-none font-medium bg-[#F3F3F3] text-[#8A8A8A]"
                              style={{ fontFamily: "Poppins, sans-serif" }}
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                        <div className="w-full flex justify-between items-center gap-3">
                          <h3 className="text-base sm:text-base font-semibold mb-1 sm:mb-2 line-clamp-2">
                            {company.title}
                          </h3>
                          <div>
                            {!company.is_bp_following ? (
                              <button
                                className="px-5 py-1.5 rounded-full text-white text-[13px] font-medium bg-[#7077FE] hover:bg-[#6A6DEB] whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleFollow(company.id, "interest");
                                }}
                                disabled={followLoading[company.id]}
                              >
                                {followLoading[company.id] ? (
                                  <div className="flex items-center">
                                    <div className="w-3 h-3 border-t-2 border-b-2 border-white rounded-full animate-spin mr-1"></div>
                                    Loading...
                                  </div>
                                ) : (
                                  "+ Follow"
                                )}
                              </button>
                            ) : (
                              <button
                                className="px-5 py-1.5 rounded-full text-white text-[13px] font-medium bg-[#F396FF] whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleFollow(company.id, "interest");
                                }}
                                disabled={followLoading[company.id]}
                              >
                                {followLoading[company.id] ? (
                                  <div className="flex items-center">
                                    <div className="w-3 h-3 border-t-2 border-b-2 border-white rounded-full animate-spin mr-1"></div>
                                    Loading...
                                  </div>
                                ) : (
                                  "Following"
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                        <p className="text-sm font-semibold text-gray-900">
                          Overview
                        </p>

                        <p className="text-sm text-gray-600 leading-snug wrap-break-word whitespace-pre-line">
                          <span
                            dangerouslySetInnerHTML={{
                              __html: DOMPurify.sanitize(
                                expandedDescriptions[company.id]
                                  ? company.description
                                  : truncateText(company.description, 100)
                              ),
                            }}
                          />
                          {company.description.length > 100 && (
                            <span className="text-purple-600 underline cursor-pointer ml-1">
                              {expandedDescriptions[company.id]
                                ? "Read Less"
                                : "Read More"}
                            </span>
                          )}
                        </p>
                      </div>
                      <div className="flex items-end justify-between px-4 py-2 mt-2 text-xs sm:text-sm text-gray-600 ">
                        <div className="flex items-center space-x-6 mb-2">
                          <span
                            className="flex items-center gap-1 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLike(company.id, index, "interest");
                            }}
                          >
                            <img
                              src={like}
                              alt="Like Icon"
                              className="w-5 h-5"
                            />
                            <span>{company.likesCount || 0}</span>
                          </span>

                          <span className="flex items-center gap-1">
                            <img
                              src={comment}
                              alt="Comment Icon"
                              className="w-5 h-5"
                            />
                            <span>{company.commentsCount || 0}</span>
                          </span>
                        </div>

                        <div
                          className="cursor-pointer mb-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSave(company.id, "interest");
                          }}
                        >
                          <div className="flex items-center gap-2 cursor-pointer">
                            <Bookmark
                              className={`w-5 h-5 transition-all duration-200 ${
                                saveLoading[company.id] ? "opacity-50" : ""
                              }`}
                              fill={company.is_saved ? "#72DBF2" : "none"}
                              stroke={company.is_saved ? "#72DBF2" : "#4338CA"}
                            />
                            <span
                              className={`text-sm font-normal text-gray-700 ${
                                saveLoading[company.id] ? "opacity-50" : ""
                              }`}
                            >
                              {saveLoading[company.id]
                                ? "Saving..."
                                : company.is_saved
                                ? "Saved"
                                : "Save"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 py-10 text-center">
              No Best Practices found for Interest.
            </p>
          )}

          {paginationInterest.totalPages > 1 && (
            <div className="mt-6 sm:mt-8">
              <div className="flex justify-center">
                <nav className="inline-flex rounded-md shadow-sm -space-x-px text-xs sm:text-sm">
                  <button
                    onClick={() =>
                      fetchBestPracticesByInterest(
                        paginationInterest.currentPage - 1,
                        selectedFilter.id,
                        searchText
                      )
                    }
                    disabled={
                      paginationInterest.currentPage === 1 || isLoading.interest
                    }
                    className="px-2 sm:px-3 py-1 rounded-l-md bg-white border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-40"
                  >
                    «
                  </button>

                  {!isMobile && (
                    <>
                      <button
                        onClick={() =>
                          fetchBestPracticesByInterest(
                            1,
                            selectedFilter.id,
                            searchText
                          )
                        }
                        disabled={isLoading.interest}
                        className={`px-2 sm:px-3 py-1 border border-gray-300 ${
                          1 === paginationInterest.currentPage
                            ? "bg-indigo-500 text-white"
                            : "bg-white text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        1
                      </button>

                      {paginationInterest.currentPage > 3 && (
                        <span className="px-2 sm:px-3 py-1 border border-gray-300 bg-white">
                          ...
                        </span>
                      )}
                    </>
                  )}

                  {[
                    paginationInterest.currentPage - 1,
                    paginationInterest.currentPage,
                    paginationInterest.currentPage + 1,
                  ]
                    .filter(
                      (page) => page > 1 && page < paginationInterest.totalPages
                    )
                    .map((page) => (
                      <button
                        key={page}
                        onClick={() =>
                          fetchBestPracticesByInterest(
                            page,
                            selectedFilter.id,
                            searchText
                          )
                        }
                        disabled={isLoading.interest}
                        className={`px-2 sm:px-3 py-1 border border-gray-300 ${
                          page === paginationInterest.currentPage
                            ? "bg-indigo-500 text-white"
                            : "bg-white text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                  {!isMobile && (
                    <>
                      {paginationInterest.currentPage <
                        paginationInterest.totalPages - 2 && (
                        <span className="px-2 sm:px-3 py-1 border border-gray-300 bg-white">
                          ...
                        </span>
                      )}

                      {paginationInterest.totalPages > 1 && (
                        <button
                          onClick={() =>
                            fetchBestPracticesByInterest(
                              paginationInterest.totalPages,
                              selectedFilter.id,
                              searchText
                            )
                          }
                          disabled={isLoading.interest}
                          className={`px-2 sm:px-3 py-1 border border-gray-300 ${
                            paginationInterest.totalPages ===
                            paginationInterest.currentPage
                              ? "bg-indigo-500 text-white"
                              : "bg-white text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {paginationInterest.totalPages}
                        </button>
                      )}
                    </>
                  )}

                  <button
                    onClick={() =>
                      fetchBestPracticesByInterest(
                        paginationInterest.currentPage + 1,
                        selectedFilter.id,
                        searchText
                      )
                    }
                    disabled={
                      paginationInterest.currentPage ===
                        paginationInterest.totalPages || isLoading.interest
                    }
                    className="px-2 sm:px-3 py-1 rounded-r-md bg-white border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-40"
                  >
                    »
                  </button>
                </nav>
              </div>
            </div>
          )}
        </div>
      </section>

      <AddBestPracticeModal
        open={activeModal === "bestpractices"}
        onClose={closeModal}
        newPractice={newPractice}
        profession={profession}
        interest={interest}
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
    </>
  );
}
