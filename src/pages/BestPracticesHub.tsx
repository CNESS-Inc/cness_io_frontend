import { useEffect, useRef, useState, type ReactNode } from "react";
import { iconMap } from "../assets/icons";
import "../App.css";
import AnimatedBackground from "../components/ui/AnimatedBackground";
import {
  CreateBestPractice,
  GetAllBestPractices,
  //GetAllFormDetails,
  LikeBestpractices,
  SaveBestpractices,
  GetSaveBestpractices,
  GetValidProfessionalDetails,
  GetInterestsDetails,
  // SendBpFollowRequest,
} from "../Common/ServerAPI";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/ui/Toast/ToastProvider";
import { useMediaQuery } from "../hooks/useMediaQuery";
import like from "../assets/like.svg";
import comment from "../assets/comment.svg";
import { Bookmark } from "lucide-react"; // Import icons
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/DashboardCard";
import AddBestPracticeModal from "../components/sections/bestPractiseHub/AddBestPractiseModal";
//import {  ChevronUp, ChevronDown, SortAsc, SortDesc } from "lucide-react"; // Import icons

//import {
// GetBadgeListDetails
//} from "../Common/ServerAPI";

const truncateText = (text: string, maxLength: number): string => {
  if (!text) return "";
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
};
type Company = {
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

export default function BestPracticesHub() {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const { showToast } = useToast();
  const [profession, setProfession] = useState<Profession[]>([]);
  const [interest, setInterestData] = useState<any[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<{
    id: string;
    type: "profession" | "interest" | "";
  }>({
    id: "",
    type: "",
  });
  // const [selectedProfession, setSelectedProfession] = useState("");
  const [activeModal, setActiveModal] = useState<"bestpractices" | null>(null);
  const [textWidth, setTextWidth] = useState(0);
  const measureRef = useRef<HTMLSpanElement>(null);
  const [selectedDomainText, setSelectedDomainText] = useState("All Domains");
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [savedItems, setSavedItems] = useState<Set<string>>(new Set());
  //const [badge, setBadge] = useState<any>([]);
  //const [selectedCert, setSelectedCert] = useState<string>("");
  //const [sort, setSort] = useState<"az" | "za">("az");
  //const [open, setOpen] = useState<"cert" | "sort" | null>(null);
  // Fetch saved best practices and store in variable
  useEffect(() => {
    const fetchSavedBestPractices = async () => {
      try {
        const res = await GetSaveBestpractices();
        // Assuming the response contains an array of saved post IDs
        const savedIds =
          res?.data?.data?.rows.map((item: any) => item.id) || [];
        setSavedItems(new Set(savedIds));
      } catch (error) {
        // Optionally handle error
        setSavedItems(new Set());
      }
    };
    fetchSavedBestPractices();
  }, []);

  {
    /*const fetchBadge = async () => {
  try {
    const res = await GetBadgeListDetails();
    setBadge(res?.data?.data);
  } catch (error: any) {
    showToast({
      message: error?.response?.data?.error?.message,
      type: "error",
      duration: 5000,
    });
  }
};

useEffect(() => {
  fetchBadge();
}, []);
*/
  }

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

  /*const toggleFollow = async (bpId: string) => {
    try {
      const payload = { bp_id: bpId };
      const res = await SendBpFollowRequest(payload);

      if (res?.success?.statusCode === 200) {
        const isNowFollowing = res?.data?.data !== null;

        setBestPractices((prevPractices) =>
          prevPractices.map((practice) =>
            practice.id === bpId
              ? { ...practice, is_bp_following: isNowFollowing }
              : practice
          )
        );

        showToast({
          message: isNowFollowing
            ? "Followed successfully - stay updated!"
            : "Unfollowed - no longer receiving updates.",
          type: isNowFollowing ? "success" : "info",
          duration: 2000,
        });
      } else {
        console.warn("Unexpected status code:", res?.success?.statusCode);
      }
    } catch (error) {
      showToast({
        message: "Failed to update follow. Please try again.",
        type: "error",
        duration: 2000,
      });
    }
  };*/

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

  // const toggleDescription = (e: React.MouseEvent, id: string) => {
  //   e.stopPropagation();
  //   setExpandedDescriptions((prev) => ({
  //     ...prev,
  //     [id]: !prev[id],
  //   }));
  // };
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

  const handleFilterChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const id = e.target.value;
    const type = e.target.options[e.target.selectedIndex].dataset.type as
      | "profession"
      | "interest"
      | "";

    setSelectedFilter({ id, type });

    const selectedText = e.target.options[e.target.selectedIndex].text;
    setSelectedDomainText(selectedText);

    await fetchBestPractices(1, id, type, searchText);
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
      console.log('res.data.data.rowsfghghggg', res.data.data.rows)
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

  useEffect(() => {
    fetchProfession();
    fetchIntrusts();
    fetchBestPractices();
  }, []);

  const handleSearch = () => {
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
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        e.target.value = '';

        showToast?.({
          message: "Please select only JPG, JPEG or PNG files.",
          type: "error",
          duration: 3000,
        });
        return;
      }

      setNewPractice((prev) => ({
        ...prev,
        file: file,
      }));
    }
  };

  // Sample like handler (replace with your actual API call)
  const handleLike = async (id: string, index: Number) => {
    try {
      // Example: await LikeBestPractice(id);
      let data = {
        post_id: id,
      };
      const response = await LikeBestpractices(data);

      const message = response?.success?.message || "";

      // Optimistically update likesCount in bestPractices state
      setBestPractices((prev) =>
        prev.map((item, i) => {
          if (i !== index) return item;

          const currentLikes = Number(item.likesCount) || 0;
          const isLiked = message.includes("Liked!"); // checks both Liked/Unliked
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

  return (
    <>
      <section className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] mx-auto rounded-[12px] overflow-hidden">
        <AnimatedBackground />

        {/* Background Image (city illustration) */}
        <img
          src={iconMap["heroimg"]}
          alt="City Skyline"
          className="absolute bottom-[-200px] left-0 w-full object-cover z-0 pointer-events-none"
        />

        {/* Foreground Content */}
        <div className="relative z-10 flex flex-col items-center justify-center max-w-4xl mx-auto h-full px-4 text-center mt-20">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-6 sm:mb-10 mt-0 sm:-mt-35">
            Find Your Conscious Best Practices here.
          </h1>

          <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Profession Selector */}

            <div className="relative rounded-full">
              {/* Measurement span with exact same text styling */}
              <span
                className="invisible absolute whitespace-nowrap text-[12px] font-semibold px-3 md:px-4 py-2 "
                ref={measureRef}
                style={{
                  fontFamily: "inherit",
                  fontSize: "12px", // Explicitly set to match select
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
                  <select
                    className="bg-[#7077FE] rounded-full text-white font-semibold px-3 py-2 pr-6 appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-[#7077FE] cursor-pointer text-[12px] w-full transition-all duration-200"
                    value={selectedFilter.id}
                    onChange={handleFilterChange}
                  >
                    <option value="" className="text-white text-[12px]">
                      All Profession & Interests
                    </option>
                    {profession.length > 0 && (
                      <optgroup label="Professions">
                        {profession.map((prof: any) => (
                          <option
                            key={`p-${prof.id}`}
                            value={prof.id}
                            className="text-black"
                            data-type="profession"
                          >
                            {prof.title}
                          </option>
                        ))}
                      </optgroup>
                    )}
                    {interest && interest.length > 0 && (
                      <optgroup label="Interests">
                        {interest.map((interest: any) => (
                          <option
                            key={`i-${interest.id}`}
                            value={interest.id}
                            className="text-black"
                            data-type="interest"
                          >
                            {interest.name}
                          </option>
                        ))}
                      </optgroup>
                    )}
                  </select>

                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white text-xs pointer-events-none">
                    <span className="block">▼</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Search Input */}
            <div className="relative flex-grow">
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

      {/* Best Practices Section */}
      <section className="py-8 px-1 sm:py-16 bg-[#f9f9f9] border-t border-gray-100">
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
                Best Practices For{" "}
              </h4>
            )}

            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              {/* Certification Filter Dropdown
              <div className="relative">
                <div
                  className="flex items-center justify-between cursor-pointer bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm"
                  onClick={() => setOpen(open === "cert" ? null : "cert")}
                >
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-purple-500" />
                    <span className="font-medium text-sm">
                      {badge.find((b: any) => b.slug === selectedCert)?.level || "Certification"}
                    </span>
                  </div>
                  {open === "cert" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>

                {open === "cert" && (
                  <div className="absolute z-10 mt-1 w-auto bg-white border border-gray-200 rounded-lg shadow-lg p-2">
                    {badge.map((item: any) => (
                      <label
                        key={item.id}
                        className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-50 rounded"
                      >
                        <input
                          type="radio"
                          name="cert"
                          value={item.slug}
                          checked={selectedCert === item.slug}
                          onChange={() => {
                            setSelectedCert(item.slug);
                            setOpen(null);
                          }}
                          className="accent-[#897AFF]"
                        />
                        <span
                          className={`text-sm ${
                            selectedCert === item.slug
                              ? "text-[#9747FF] font-medium"
                              : "text-gray-600"
                          }`}
                        >
                          {item.level}
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Sort Options Dropdown 
              <div className="relative">
                <div
                  className="flex items-center justify-between cursor-pointer bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm"
                  onClick={() => setOpen(open === "sort" ? null : "sort")}
                >
                  <div className="flex items-center gap-2">
                    {sort === "az" && <SortAsc size={16} />}
                    {sort === "za" && <SortDesc size={16} />}
                    <span className="font-medium text-sm">
                      {sort === "az" && "A-Z"}
                      {sort === "za" && "Z-A"}
                    </span>
                  </div>
                  {open === "sort" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>

                {open === "sort" && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg p-2">
                    <div
                      className={`flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-50 rounded ${
                        sort === "az" ? "text-indigo-500 font-medium" : ""
                      }`}
                      onClick={() => {
                        setSort("az");
                        setOpen(null);
                      }}
                    >
                      <SortAsc size={16} /> A-Z
                    </div>
                    <div
                      className={`flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-50 rounded ${
                        sort === "za" ? "text-indigo-500 font-medium" : ""
                      }`}
                      onClick={() => {
                        setSort("za");
                        setOpen(null);
                      }}
                    >
                      <SortDesc size={16} /> Z-A
                    </div>
                  </div>
                )}
              </div>*/}
            </div>
          </div>

          {isLoading.popular ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : bestPractices.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-x-4 gap-y-4">
              {bestPractices?.map((company, index) => {
                //const isSaved = savedItems.has(company.id); // ✅ declare inside

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
                            isLiked: company.isLiked, // ensure this is coming from backend
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
                            // Fallback if the image fails to load
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
                        <div className="rounded-xl overflow-hidden mb-3">
                          {company.file && (
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
                                // Fallback in case the image fails to load
                                (e.target as HTMLImageElement).src =
                                  iconMap["companycard1"];
                              }}
                            />
                          )}
                        </div>
                        <div className="w-full flex justify-between items-center gap-3">
                          <h3 className="text-base sm:text-base font-semibold mb-1 sm:mb-2 line-clamp-2">
                            {company.title}
                          </h3>
                          {/*<div>
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
                          </div>*/}
                        </div>
                        <p className="text-sm font-semibold text-gray-900">
                          Overview
                        </p>

                        {/* <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-3">
                        {truncateText(company.description, 100)}
                        {company.description.length > 50 && (
                          <span className="text-[#F07EFF] underline ml-1">
                            Read More
                          </span>
                        )}
                      </p> */}
                        <p className="text-sm text-gray-600 leading-snug break-words whitespace-pre-line">
                          {expandedDescriptions[company.id]
                            ? company.description
                            : truncateText(company.description, 100)}
                          {company.description.length > 100 && (
                            <span
                              className="text-purple-600 underline cursor-pointer ml-1"
                            // onClick={(e) => toggleDescription(e, company.id)}
                            >
                              {expandedDescriptions[company.id]
                                ? "Read Less"
                                : "Read More"}
                            </span>
                          )}
                        </p>
                      </div>
                      <div className="flex items-end justify-between px-4 py-2 mt-2 text-xs sm:text-sm text-gray-600 ">
                        {/* Likes & Comments */}
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

                        {/* Bookmark */}
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
                              } // full yellow when saved
                              stroke={
                                savedItems.has(company.id)
                                  ? "#72DBF2"
                                  : "#4338CA"
                              } // yellow or indigo
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
                      {/* Always show first page */}
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
                        className={`px-2 sm:px-3 py-1 border border-gray-300 ${1 === pagination.currentPage
                          ? "bg-indigo-500 text-white"
                          : "bg-white text-gray-700 hover:bg-gray-100"
                          }`}
                      >
                        1
                      </button>

                      {/* Show ellipsis if current page is far from start */}
                      {pagination.currentPage > 3 && (
                        <span className="px-2 sm:px-3 py-1 border border-gray-300 bg-white">
                          ...
                        </span>
                      )}
                    </>
                  )}

                  {/* Show pages around current page */}
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
                        className={`px-2 sm:px-3 py-1 border border-gray-300 ${page === pagination.currentPage
                          ? "bg-indigo-500 text-white"
                          : "bg-white text-gray-700 hover:bg-gray-100"
                          }`}
                      >
                        {page}
                      </button>
                    ))}

                  {!isMobile && (
                    <>
                      {/* Show ellipsis if current page is far from end */}
                      {pagination.currentPage < pagination.totalPages - 2 && (
                        <span className="px-2 sm:px-3 py-1 border border-gray-300 bg-white">
                          ...
                        </span>
                      )}

                      {/* Always show last page if it's not the first page */}
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
                          className={`px-2 sm:px-3 py-1 border border-gray-300 ${pagination.totalPages === pagination.currentPage
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
        handleSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </>
  );
}
