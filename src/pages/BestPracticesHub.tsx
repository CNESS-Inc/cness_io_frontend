import { useEffect, useRef, useState, type ReactNode } from "react";
import { iconMap } from "../assets/icons";
import AnimatedBackground from "../components/ui/AnimatedBackground";
import {
  CreateBestPractice,
  GetAllBestPractices,
  GetValidProfessionalDetails,
} from "../Common/ServerAPI";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/ui/Toast/ToastProvider";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import { useMediaQuery } from "../hooks/useMediaQuery";

type Company = {
  file: any;
  title: string;
  user: any;
  profession: ReactNode;
  likesCount: ReactNode;
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
  const [selectedProfession, setSelectedProfession] = useState("");
  const [activeModal, setActiveModal] = useState<"bestpractices" | null>(null);
  const [textWidth, setTextWidth] = useState(0);
  const measureRef = useRef<HTMLSpanElement>(null);
  const [selectedDomainText, setSelectedDomainText] = useState("All Domains");
  const isMobile = useMediaQuery("(max-width: 640px)");

  // Modal states
  const [newPractice, setNewPractice] = useState({
    title: "",
    description: "",
    profession: "",
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
  console.log("🚀 ~ BestPracticesHub ~ bestPractices:", bestPractices);
  const [isLoading, setIsLoading] = useState({
    popular: false,
  });

  useEffect(() => {
    if (measureRef.current) {
      setTextWidth(measureRef.current.offsetWidth);
    }
  }, [selectedProfession]);

  const handleProfessionChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const professionId = e.target.value;
    setSelectedProfession(professionId);

    // Update the selected domain text
    const selectedText = e.target.options[e.target.selectedIndex].text;
    setSelectedDomainText(selectedText);

    // Fetch best practices with the new profession filter
    await fetchBestPractices(1, professionId, searchText);
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

  const fetchBestPractices = async (
    page: number = 1,
    professionId: string = "",
    searchText: string = ""
  ) => {
    setIsLoading((prev) => ({ ...prev, popular: true }));
    try {
      const res = await GetAllBestPractices(
        page,
        pagination.itemsPerPage,
        professionId,
        searchText
      );
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
            commentsCount: practice.total_comment_count || 0,
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
    fetchBestPractices();
  }, []);

  const handleSearch = () => {
    fetchBestPractices(1, selectedProfession, searchText);
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
    if (e.target.files && e.target.files[0]) {
      setNewPractice((prev) => ({
        ...prev,
        file: e.target.files![0],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", newPractice.title);
      formData.append("description", newPractice.description);
      formData.append("profession", newPractice.profession);
      if (newPractice.file) {
        formData.append("file", newPractice.file);
      }

      await CreateBestPractice(formData);

      showToast({
        message: "Best practice created successfully!",
        type: "success",
        duration: 3000,
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
      setActiveModal("bestpractices");
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
        <div className="relative z-10 flex flex-col items-center justify-center max-w-4xl mx-auto h-full px-4 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-6 sm:mb-10 mt-0 sm:-mt-35">
            Find Your Conscious Best Practices here.
          </h1>

          <div className="w-full mx-auto bg-white border border-gray-200 rounded-lg md:rounded-full flex flex-col md:flex-row items-stretch md:items-center px-3 py-2 shadow-sm gap-2">
            {/* Profession Selector */}

            <div className="relative rounded-full">
              {/* Measurement span with exact same text styling */}
              <span
                className="invisible absolute whitespace-nowrap text-[12px] font-semibold px-3 md:px-4 py-2"
                ref={measureRef}
                style={{
                  fontFamily: "inherit",
                  fontSize: "12px", // Explicitly set to match select
                }}
              >
                {selectedDomainText || "All Profession"}
              </span>

              <select
                className="bg-[#7077FE] rounded-full text-white h-full font-semibold px-3 md:px-4 py-2 appearance-none focus:outline-none cursor-pointer text-[12px]"
                style={{
                  width: `${textWidth}px`, // Adjusted padding
                  maxWidth: "100%",
                  minWidth: "120px",
                }}
                value={selectedProfession}
                onChange={handleProfessionChange}
              >
                <option value="" className="text-white text-[12px]">
                  All Profession
                </option>
                {profession.map((prof: any) => (
                  <option key={prof.id} value={prof.id} className="text-black">
                    {prof.title}
                  </option>
                ))}
              </select>
              <div className="absolute top-1/2 right-3 transform -translate-y-1/2 text-white text-[10px] pointer-events-none">
                ▼
              </div>
            </div>

            {/* Search Input */}
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search best practices..."
                className="w-full py-2 bg-transparent text-xs md:text-sm text-gray-700 placeholder:text-gray-400 outline-none border-none h-[29px] px-2"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={handleKeyPress}
              />
              <button
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#7077FE]"
                onClick={handleSearch}
              >
                🔍
              </button>
            </div>
          </div>

          <p className="text-gray-700 text-xs md:text-sm mt-3 md:mt-5">
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
      <section className="py-8 sm:py-16 bg-[#f9f9f9] border-t border-gray-100">
        <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
            <h2 className="text-lg sm:text-xl font-semibold">Best Practices</h2>
          </div>

          {isLoading.popular ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : bestPractices.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {bestPractices?.map((company) => (
                <div
                  key={company.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                  onClick={() =>
                    navigate(
                      `/dashboard/bestpractices/${company.id}/${slugify(
                        company.title
                      )}`
                    )
                  }
                >
                  {company.file && (
                    <img
                      src={
                        company.file &&
                        company.file !== "http://localhost:5026/file/"
                          ? company.file
                          : iconMap["companycard1"]
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
                  <div className="p-3 sm:p-4">
                    <div className="flex items-center mb-2 sm:mb-3">
                      <img
                        src={
                          company?.user?.profilePicture &&
                          company?.user?.profilePicture !==
                            "http://localhost:5026/file/"
                            ? company?.user?.profilePicture
                            : "/profile.png"
                        }
                        alt={company.user.username}
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover mr-2 sm:mr-3"
                        onError={(e) => {
                          // Fallback if the image fails to load
                          const target = e.target as HTMLImageElement;
                          target.src = "/profile.png";
                        }}
                      />
                      <div className="overflow-hidden">
                        <h3 className="font-semibold text-sm sm:text-base truncate">
                          {company.user.firstName} {company.user.lastName}
                        </h3>
                        <p className="text-xs text-gray-500 truncate">
                          @{company.user.username}
                        </p>
                      </div>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold mb-1 sm:mb-2 line-clamp-2">
                      {company.title}
                    </h3>
                    <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-3">
                      {company.description}
                    </p>
                    <div className="flex justify-between items-center text-xs sm:text-sm text-gray-500">
                      <span className="truncate max-w-[50%]">
                        {company.profession}
                      </span>
                      <div className="flex space-x-2 sm:space-x-4">
                        <span className="flex items-center">
                          ♥️ {company.likesCount}
                        </span>
                        <span className="flex items-center">
                          💬 {company.commentsCount}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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
                      fetchBestPractices(pagination.currentPage - 1)
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
                        onClick={() => fetchBestPractices(1)}
                        disabled={isLoading.popular}
                        className={`px-2 sm:px-3 py-1 border border-gray-300 ${
                          1 === pagination.currentPage
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
                        onClick={() => fetchBestPractices(page)}
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
                            fetchBestPractices(pagination.totalPages)
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
                      fetchBestPractices(pagination.currentPage + 1)
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

      <Modal isOpen={activeModal === "bestpractices"} onClose={closeModal}>
        <div className="p-4 sm:p-6 w-full max-w-md mx-auto">
          <h2 className="text-xl font-bold mb-4">Add Best Practice</h2>
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
                onChange={handleInputChange}
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
                onChange={handleInputChange}
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
                Profession*
              </label>
              <select
                id="profession"
                name="profession"
                value={newPractice.profession}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                required
              >
                <option value="">Select a profession</option>
                {profession.map((prof) => (
                  <option key={prof.id} value={prof.id}>
                    {prof.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="file"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                File (Optional)
              </label>
              <input
                type="file"
                id="file"
                name="file"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                accept="image/*, .pdf, .doc, .docx"
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
              <Button
                type="button"
                onClick={closeModal}
                variant="white-outline"
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="gradient-primary"
                className="w-full sm:w-auto py-2 px-6 sm:py-3 sm:px-8"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
