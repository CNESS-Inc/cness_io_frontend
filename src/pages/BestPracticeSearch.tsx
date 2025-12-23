import { useEffect, useRef, useState, type ReactNode } from "react";
import { iconMap } from "../assets/icons";
import { CiSearch } from "react-icons/ci";
import "../App.css";
import {
  CreateBestPractice,
  GetAllBestPractices,
  //GetAllFormDetails,
  LikeBestpractices,
  SaveBestpractices,
  GetSaveBestpractices,
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
import { useClickOutside } from "../hooks/useClickOutside";

const truncateText = (text: string, maxLength: number): string => {
  if (!text) return "";
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
};

type Company = {
  user_id: any;
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

export default function BestPracticeSearch() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { showToast } = useToast();
  const id = localStorage.getItem("Id");
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
  const interestNameFromParams = searchParams.get("interest") || "";
  const initialProfessionId = professionTitleFromParams
    ? profession.find((p) => p.title === professionTitleFromParams)?.id || ""
    : "";

  const initialInterestId = interestNameFromParams
    ? interest.find((i) => i.name === interestNameFromParams)?.id || ""
    : "";

  const initialFilter = initialProfessionId
    ? { id: initialProfessionId, type: "profession" as const }
    : initialInterestId
    ? { id: initialInterestId, type: "interest" as const }
    : { id: "", type: "" as const };

  const [selectedFilter, setSelectedFilter] = useState<{
    id: string;
    type: "profession" | "interest" | "";
  }>(initialFilter);

  const [activeModal, setActiveModal] = useState<"bestpractices" | null>(null);
  const [, setTextWidth] = useState(0);
  const measureRef = useRef<HTMLSpanElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProfessions = profession.filter((prof) =>
    prof.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredInterests = interest.filter((int) =>
    int.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const dropdownRef = useClickOutside(() => {
    setIsDropdownOpen(false);
  });
  // Initialize selected domain text from query params
  const getSelectedDomainText = () => {
    const professionTitle = searchParams.get("profession");
    const interestName = searchParams.get("interest");

    if (professionTitle) {
      return professionTitle;
    }
    if (interestName) {
      return interestName;
    }
    return "All Domains";
  };

  const [selectedDomainText, setSelectedDomainText] = useState(
    getSelectedDomainText()
  );

  const isMobile = useMediaQuery("(max-width: 640px)");
  const [savedItems, setSavedItems] = useState<Set<string>>(new Set());

  // Update selectedDomainText when profession data is loaded or query params change
  // Re-initialize filter when professions/interests are loaded and we have params
  useEffect(() => {
    if (
      (profession.length > 0 || interest.length > 0) &&
      (searchParams.get("profession") || searchParams.get("interest"))
    ) {
      const professionTitle = searchParams.get("profession") || "";
      const interestName = searchParams.get("interest") || "";

      const professionId = professionTitle
        ? profession.find((p) => p.title === professionTitle)?.id || ""
        : "";

      const interestId = interestName
        ? interest.find((i) => i.name === interestName)?.id || ""
        : "";

      // Only update if we found a matching ID and it's different from current
      if (professionId && professionId !== selectedFilter.id) {
        setSelectedFilter({
          id: professionId,
          type: "profession",
        });
        setSelectedDomainText(professionTitle);

        const search = searchParams.get("search") || "";
        fetchBestPractices(1, professionId, "profession", search);
      } else if (interestId && interestId !== selectedFilter.id) {
        setSelectedFilter({
          id: interestId,
          type: "interest",
        });
        setSelectedDomainText(interestName);

        const search = searchParams.get("search") || "";
        fetchBestPractices(1, interestId, "interest", search);
      }
    }
  }, [profession, interest, searchParams]);

  // Fetch saved best practices and store in variable
  useEffect(() => {
    const fetchSavedBestPractices = async () => {
      try {
        const res = await GetSaveBestpractices();
        const savedIds =
          res?.data?.data?.rows.map((item: any) => item.id) || [];
        setSavedItems(new Set(savedIds));
      } catch (error) {
        setSavedItems(new Set());
      }
    };
    fetchSavedBestPractices();
  }, []);

  const toggleSave = async (id: string) => {
    try {
      const data = { post_id: id };
      await SaveBestpractices(data);
      setSavedItems((prev) => {
        const updated = new Set(prev);
        if (updated.has(id)) {
          updated.delete(id);
        } else {
          updated.add(id);
        }
        return updated;
      });
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

  // Pagination states
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });
  const [bestPractices, setBestPractices] = useState<Company[]>([]);
  const [expandedDescriptions, _setExpandedDescriptions] = useState<
    Record<string, boolean>
  >({});
  const [isLoading, setIsLoading] = useState({
    popular: false,
  });

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
  // Update query params when filter changes
  const updateQueryParams = (
    professionId: string,
    interestId: string,
    search: string
  ) => {
    const params = new URLSearchParams();

    if (professionId) {
      const professionTitle =
        profession.find((p) => p.id === professionId)?.title || "";
      if (professionTitle) {
        params.set("profession", professionTitle);
      }
      // Remove interest if profession is selected
      params.delete("interest");
    } else if (interestId) {
      const interestName =
        interest.find((i) => i.id === interestId)?.name || "";
      if (interestName) {
        params.set("interest", interestName);
      }
      // Remove profession if interest is selected
      params.delete("profession");
    } else {
      // Clear both if no filter
      params.delete("profession");
      params.delete("interest");
    }

    if (search) {
      params.set("search", search);
    }

    setSearchParams(params);
  };

  // const handleFilterChange = async (
  //   e: React.ChangeEvent<HTMLSelectElement>
  // ) => {
  //   const id = e.target.value;
  //   const type = e.target.options[e.target.selectedIndex].dataset.type as
  //     | "profession"
  //     | "interest"
  //     | "";

  //   setSelectedFilter({ id, type });

  //   const selectedText = e.target.options[e.target.selectedIndex].text;
  //   setSelectedDomainText(selectedText);

  //   // Update query params with profession title
  //   updateQueryParams(id, searchText);

  //   await fetchBestPractices(1, id, type, searchText);
  // };

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

  const fetchBestPractices = async (
    page: number = 1,
    id: string = "",
    type: "profession" | "interest" | "" = "",
    searchText: string = ""
  ) => {
    setIsLoading((prev) => ({ ...prev, popular: true }));
    try {
      const res = await GetAllBestPractices(
        page,
        pagination.itemsPerPage,
        type === "profession" ? id : "",
        type === "interest" ? id : "",
        searchText
      );
      console.log("res.data.data.rowsfghghggg", res.data.data.rows);
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
            user_id: practice.user_id || "",
          })
        );
        setBestPractices(transformedCompanies);
        setPagination((prev: PaginationData) => ({
          ...prev,
          currentPage: page,
          totalPages: Math.ceil(res.data.data.count / prev.itemsPerPage),
          totalItems: res.data.data.count,
        }));
      }
    } catch (error: any) {
      console.error("Error fetching inspiring companies:", error);
      showToast({
        message: error?.response?.data?.error?.message,
        type: "error",
        duration: 5000,
      });
    } finally {
      setIsLoading((prev) => ({ ...prev, popular: false }));
    }
  };

  // Initialize data from query params on component mount
  // Initialize data from query params on component mount
  useEffect(() => {
    fetchProfession();
    fetchIntrusts();

    // Get initial values from query params
    const initialProfessionTitle = searchParams.get("profession") || "";
    const initialInterestName = searchParams.get("interest") || "";
    const initialSearch = searchParams.get("search") || "";

    // Find IDs from titles after data is loaded
    const findProfessionIdFromTitle = (title: string) => {
      return profession.find((p) => p.title === title)?.id || "";
    };

    const findInterestIdFromName = (name: string) => {
      return interest.find((i) => i.name === name)?.id || "";
    };

    // Set initial filter state after data is loaded
    const initializeFilter = async () => {
      await fetchProfession();
      await fetchIntrusts();

      const initialProfessionId = initialProfessionTitle
        ? findProfessionIdFromTitle(initialProfessionTitle)
        : "";

      const initialInterestId = initialInterestName
        ? findInterestIdFromName(initialInterestName)
        : "";

      // Determine which filter to use (profession takes priority if both exist)
      let initialFilterId = "";
      let initialFilterType: "profession" | "interest" | "" = "";

      if (initialProfessionId) {
        initialFilterId = initialProfessionId;
        initialFilterType = "profession";
      } else if (initialInterestId) {
        initialFilterId = initialInterestId;
        initialFilterType = "interest";
      }

      setSelectedFilter({
        id: initialFilterId,
        type: initialFilterType,
      });

      // Set selected domain text
      if (initialProfessionTitle) {
        setSelectedDomainText(initialProfessionTitle);
      } else if (initialInterestName) {
        setSelectedDomainText(initialInterestName);
      } else {
        setSelectedDomainText("All Domains");
      }

      // Fetch data with initial params
      fetchBestPractices(1, initialFilterId, initialFilterType, initialSearch);
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
        fetchBestPractices(1, professionId, "profession", search);
      }
    }
  }, [profession, searchParams]);

  const handleSearch = () => {
    // Update query params based on current filter type
    if (selectedFilter.type === "profession") {
      updateQueryParams(selectedFilter.id, "", searchText);
    } else if (selectedFilter.type === "interest") {
      updateQueryParams("", selectedFilter.id, searchText);
    } else {
      updateQueryParams("", "", searchText);
    }

    fetchBestPractices(1, selectedFilter.id, selectedFilter.type, searchText);
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

  const handleLike = async (id: string, index: Number) => {
    try {
      let data = {
        post_id: id,
      };
      const response = await LikeBestpractices(data);

      const message = response?.success?.message || "";

      setBestPractices((prev) =>
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
      await fetchBestPractices();
      setTags([]);
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

  const toggleFollow = async (id: string) => {
    try {
      const res = await SendBpFollowRequest({ bp_id: id });

      if (res?.success?.statusCode === 200) {
        const isFollowing = res?.data?.data !== null;
        setBestPractices((prev) =>
          prev.map((practice) => {
            if (practice.id === id) {
              return { ...practice, is_bp_following: isFollowing };
            }
            return practice;
          })
        );

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
    }
  };

  const clearFilter = () => {
    setSelectedFilter({ id: "", type: "" });
    setSelectedDomainText("All Domains");
    setIsDropdownOpen(false);
    setSearchQuery("");

    // Update query params
    updateQueryParams("", "", searchText);

    // Fetch data
    fetchBestPractices(1, "", "", searchText);
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

    // Update query params - pass empty string for the other type
    if (type === "profession") {
      updateQueryParams(id, "", searchText);
    } else if (type === "interest") {
      updateQueryParams("", id, searchText);
    } else {
      updateQueryParams("", "", searchText);
    }

    // Fetch data
    fetchBestPractices(1, id, type, searchText);
  };

  // const isOwnProfile =
  //   (id && String(id) === String(loggedInUserID)) ||
  //   (userDetails?.user_id &&
  //     String(userDetails.user_id) === String(loggedInUserID));

  const handleExploreClick = () => {
    const el = document.getElementById("explore");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      <div className="px-2 sm:px-4 lg:px-6">
        <section className="relative w-full h-[350px] sm:h-[300px] md:h-[400px] lg:h-[500px] mx-auto rounded-xl overflow-hidden sm:overflow-visible mt-2">
          {/* Background Image */}
          <img
            src="https://cdn.cness.io/Best%20practice.svg"
            alt="City Skyline"
            className="absolute left-0 w-full h-full object-cover z-0 pointer-events-none"
          />

          {/* Foreground Content */}
          <div className="relative z-10 flex flex-col items-center justify-center max-w-4xl mx-auto h-full px-4 text-center -mt-5">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-2 sm:mb-3">
              Best Practices Hub
            </h1>

            <p className="text-sm font-semibold sm:text-base text-[#242424] font-openSans -mt-1 px-2">
              Empowering greater solutions for life and profession.
            </p>

            <div className="w-full max-w-xl items-center gap-3 mt-4 sm:mt-5 px-2">
              {/* Combined Search Input + Professions Pill */}
              <div className="relative w-full">
                <div className="flex items-center bg-white border border-gray-200 rounded-full shadow-sm overflow-hidden sm:overflow-visible min-h-11">
                  {/* Left search icon + text input */}
                  <div className="flex items-center pl-3 shrink-0">
                    <CiSearch className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  </div>

                  <input
                    type="text"
                    placeholder="Search Best Practice"
                    className="flex-1 min-w-0 text-xs sm:text-sm md:text-base font-openSans py-2 sm:py-3 pr-2 sm:pr-4 pl-2 text-gray-700 placeholder:text-gray-400 outline-none bg-transparent"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    onKeyDown={handleKeyPress}
                    aria-label="Search best practices"
                  />

                  {/* Right purple pill (dropdown trigger) */}
                  <div className="relative shrink-0" ref={dropdownRef}>
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex items-center gap-1 sm:gap-2 bg-[#7077FE] text-white font-semibold rounded-full px-3 sm:px-4 py-2 h-full focus:outline-none whitespace-nowrap min-h-11"
                      aria-haspopup="listbox"
                      aria-expanded={isDropdownOpen}
                      type="button"
                    >
                      <span className="text-xs">
                        {selectedDomainText !== "All Domains" &&
                        selectedDomainText !== ""
                          ? selectedDomainText
                          : "Professions"}
                      </span>
                      <ChevronDown
                        className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-200 ${
                          isDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isDropdownOpen && (
                      <div className="fixed inset-x-0 top-0 bottom-0 sm:absolute sm:inset-auto sm:left-auto sm:right-0 sm:top-full sm:mt-2 w-full sm:w-80 bg-white border border-gray-200 rounded-lg sm:rounded-lg shadow-lg z-50 sm:max-h-96 max-h-full overflow-hidden">
                        {/* Mobile header for dropdown */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-200 sm:hidden bg-[#7077FE] text-white">
                          <h3 className="font-semibold">Filter by</h3>
                          <button
                            onClick={() => setIsDropdownOpen(false)}
                            className="p-1"
                            aria-label="Close filter"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Search inside dropdown */}
                        <div className="p-3 border-b border-gray-100">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-4 sm:h-4" />
                            <input
                              type="text"
                              placeholder="Search professions & interests..."
                              className="w-full pl-10 pr-10 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#7077FE] focus:border-transparent"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                            />
                            {searchQuery && (
                              <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                              >
                                <X className="w-4 h-4 sm:w-4 sm:h-4" />
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="overflow-y-auto h-full sm:max-h-64">
                          <div className="border-b border-gray-100">
                            <button
                              className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 ${
                                !selectedFilter.id
                                  ? "bg-blue-50 text-[#7077FE]"
                                  : ""
                              }`}
                              onClick={() => {
                                clearFilter();
                                setIsDropdownOpen(false);
                              }}
                            >
                              All Profession & Interests
                            </button>
                          </div>

                          {filteredProfessions.length > 0 && (
                            <div>
                              <div className="px-4 py-2 text-left text-xs font-semibold text-white bg-[#7077FE] uppercase tracking-wide">
                                Professions
                              </div>
                              {filteredProfessions.map((prof) => (
                                <button
                                  key={`p-${prof.id}`}
                                  className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 ${
                                    selectedFilter.id === prof.id &&
                                    selectedFilter.type === "profession"
                                      ? "bg-blue-50 text-[#7077FE] font-medium"
                                      : ""
                                  }`}
                                  onClick={() => {
                                    handleFilterSelect(
                                      prof.id,
                                      "profession",
                                      prof.title
                                    );
                                    setIsDropdownOpen(false);
                                  }}
                                >
                                  {prof.title}
                                </button>
                              ))}
                            </div>
                          )}

                          {filteredInterests.length > 0 && (
                            <div>
                              <div className="px-4 py-2 text-xs font-semibold text-gray-500 bg-gray-50 uppercase tracking-wide">
                                Interests
                              </div>
                              {filteredInterests.map((int) => (
                                <button
                                  key={`i-${int.id}`}
                                  className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 ${
                                    selectedFilter.id === int.id &&
                                    selectedFilter.type === "interest"
                                      ? "bg-blue-50 text-[#7077FE] font-medium"
                                      : ""
                                  }`}
                                  onClick={() => {
                                    handleFilterSelect(
                                      int.id,
                                      "interest",
                                      int.name
                                    );
                                    setIsDropdownOpen(false);
                                  }}
                                >
                                  {int.name}
                                </button>
                              ))}
                            </div>
                          )}

                          {filteredProfessions.length === 0 &&
                            filteredInterests.length === 0 && (
                              <div className="px-4 py-3 text-sm text-gray-500 text-center">
                                No results found for "{searchQuery}"
                              </div>
                            )}
                        </div>

                        {/* Close button for mobile (full-width) */}
                        <div className="sm:hidden p-4 border-t border-gray-200 bg-white">
                          <button
                            onClick={() => setIsDropdownOpen(false)}
                            className="w-full py-3 bg-[#7077FE] text-white rounded-lg font-medium"
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Cards */}
            <div className="flex flex-col sm:flex-row mt-4 sm:mt-6 gap-3 sm:gap-4 p-2 sm:p-4">
              <div
                onClick={handleExploreClick}
                className="flex items-center gap-2 sm:gap-3 bg-white shadow-md rounded-xl px-4 sm:px-5 py-3 cursor-pointer hover:bg-[#F9FDFF] transition w-full sm:w-auto"
              >
                <img
                  src="https://cdn.cness.io/toy-with-red-handle-green-plastic-handle%201.svg"
                  alt="Explore Best Practice Icon"
                  className="w-10 h-10 sm:w-12 sm:h-12 md:w-15 md:h-15"
                />
                <span className="text-gray-800 font-openSans font-semibold leading-tight text-sm sm:text-base">
                  Explore
                  <br />
                  Best Practice
                </span>
              </div>

              <div
                onClick={openModal}
                className="flex items-center gap-2 sm:gap-3 bg-white shadow-md rounded-xl px-4 sm:px-5 py-3 cursor-pointer hover:bg-[#F9FDFF] transition w-full sm:w-auto"
              >
                <img
                  src="https://cdn.cness.io/yellow-paper-clip-isolated-back-school-education-minimal-icon-3d-illustration%201.svg"
                  alt="Add Your Impact Story Icon"
                  className="w-10 h-10 sm:w-12 sm:h-12 md:w-15 md:h-15"
                />
                <span className="text-gray-800 font-openSans font-semibold leading-tight text-sm sm:text-base">
                  Add Your
                  <br />
                  Impact Story
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Rest of the component remains the same */}
      <section
        className="py-8 px-1 sm:py-16 bg-[#f9f9f9] border-t border-gray-100"
        id="explore"
      >
        <div className="w-full mx-auto ">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
            {(selectedFilter.id || searchText) && (
              <h4 className="poppins font-medium text-base sm:text-lg leading-[150%] tracking-normal">
                Best Practices For{" "}
                {selectedFilter.id && (
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
                )}
              </h4>
            )}

            {!selectedFilter.id && !searchText && (
              <h4 className="poppins font-medium text-base sm:text-lg leading-[150%] tracking-normal">
                Popular Best Practices
              </h4>
            )}

            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              {/* Certification and Sort dropdowns commented out */}
            </div>
          </div>

          {isLoading.popular ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : bestPractices.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-x-4 gap-y-4">
              {bestPractices?.map((company, index) => {
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
                          {selectedFilter.type === "interest" &&
                          company.interest
                            ? // Show interest when filter is by interest
                              (Array.isArray(company.interest)
                                ? company.interest
                                : [company.interest]
                              )
                                .filter((item) => item) // Filter out null/undefined values
                                .map((item, i) => (
                                  <span
                                    key={i}
                                    className="text-[12px] inline-flex items-center justify-center rounded-full px-3 py-2 leading-none font-medium bg-[#F3F3F3] text-[#8A8A8A]"
                                    style={{
                                      fontFamily: "Poppins, sans-serif",
                                    }}
                                  >
                                    {item}
                                  </span>
                                ))
                            : company.profession
                            ? // Show profession by default or when filter is by profession
                              (Array.isArray(company.profession)
                                ? company.profession
                                : [company.profession]
                              )
                                .filter((item) => item) // Filter out null/undefined values
                                .map((item, i) => (
                                  <span
                                    key={i}
                                    className="text-[12px] inline-flex items-center justify-center rounded-full px-3 py-2 leading-none font-medium bg-[#F3F3F3] text-[#8A8A8A]"
                                    style={{
                                      fontFamily: "Poppins, sans-serif",
                                    }}
                                  >
                                    {item}
                                  </span>
                                ))
                            : null}
                        </div>
                        <div className="w-full flex justify-between items-center gap-3">
                          <h3 className="text-base sm:text-base font-semibold mb-1 sm:mb-2 line-clamp-2">
                            {company.title}
                          </h3>
                          {company.user_id !== id ? (
                            <div>
                              {!company.is_bp_following ? (
                                <button
                                  className="px-5 py-1.5 rounded-full text-white text-[13px] font-medium bg-[#7077FE] hover:bg-[#6A6DEB] whitespace-nowrap"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleFollow(company.id);
                                  }}
                                >
                                  + Follow
                                </button>
                              ) : (
                                <button
                                  className="px-5 py-1.5 rounded-full text-white text-[13px] font-medium bg-[#F396FF] whitespace-nowrap"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleFollow(company.id);
                                  }}
                                >
                                  Following
                                </button>
                              )}
                            </div>
                          ) : (
                            ""
                          )}
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
                              handleLike(company.id, index);
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
                            toggleSave(company.id);
                          }}
                        >
                          <div className="flex items-center gap-2 cursor-pointer">
                            <Bookmark
                              className="w-5 h-5 transition-all duration-200"
                              fill={
                                savedItems.has(company.id) ? "#72DBF2" : "none"
                              }
                              stroke={
                                savedItems.has(company.id)
                                  ? "#72DBF2"
                                  : "#4338CA"
                              }
                            />
                            <span className="text-sm font-normal text-gray-700">
                              {savedItems.has(company.id) ? "Saved" : "Save"}
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
              No Best Practices found.
            </p>
          )}

          {pagination.totalPages > 1 && (
            <div className="mt-6 sm:mt-8">
              <div className="flex justify-center">
                <nav className="inline-flex rounded-md shadow-sm -space-x-px text-xs sm:text-sm">
                  <button
                    onClick={() =>
                      fetchBestPractices(
                        pagination.currentPage - 1,
                        selectedFilter.id,
                        selectedFilter.type,
                        searchText
                      )
                    }
                    disabled={pagination.currentPage === 1 || isLoading.popular}
                    className="px-2 sm:px-3 py-1 rounded-l-md bg-white border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-40"
                  >
                    «
                  </button>

                  {!isMobile && (
                    <>
                      <button
                        onClick={() =>
                          fetchBestPractices(
                            1,
                            selectedFilter.id,
                            selectedFilter.type,
                            searchText
                          )
                        }
                        disabled={isLoading.popular}
                        className={`px-2 sm:px-3 py-1 border border-gray-300 ${
                          1 === pagination.currentPage
                            ? "bg-indigo-500 text-white"
                            : "bg-white text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        1
                      </button>

                      {pagination.currentPage > 3 && (
                        <span className="px-2 sm:px-3 py-1 border border-gray-300 bg-white">
                          ...
                        </span>
                      )}
                    </>
                  )}

                  {[
                    pagination.currentPage - 1,
                    pagination.currentPage,
                    pagination.currentPage + 1,
                  ]
                    .filter((page) => page > 1 && page < pagination.totalPages)
                    .map((page) => (
                      <button
                        key={page}
                        onClick={() =>
                          fetchBestPractices(
                            page,
                            selectedFilter.id,
                            selectedFilter.type,
                            searchText
                          )
                        }
                        disabled={isLoading.popular}
                        className={`px-2 sm:px-3 py-1 border border-gray-300 ${
                          page === pagination.currentPage
                            ? "bg-indigo-500 text-white"
                            : "bg-white text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                  {!isMobile && (
                    <>
                      {pagination.currentPage < pagination.totalPages - 2 && (
                        <span className="px-2 sm:px-3 py-1 border border-gray-300 bg-white">
                          ...
                        </span>
                      )}

                      {pagination.totalPages > 1 && (
                        <button
                          onClick={() =>
                            fetchBestPractices(
                              pagination.totalPages,
                              selectedFilter.id,
                              selectedFilter.type,
                              searchText
                            )
                          }
                          disabled={isLoading.popular}
                          className={`px-2 sm:px-3 py-1 border border-gray-300 ${
                            pagination.totalPages === pagination.currentPage
                              ? "bg-indigo-500 text-white"
                              : "bg-white text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {pagination.totalPages}
                        </button>
                      )}
                    </>
                  )}

                  <button
                    onClick={() =>
                      fetchBestPractices(
                        pagination.currentPage + 1,
                        selectedFilter.id,
                        selectedFilter.type,
                        searchText
                      )
                    }
                    disabled={
                      pagination.currentPage === pagination.totalPages ||
                      isLoading.popular
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
