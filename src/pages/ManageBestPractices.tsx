import { useEffect, useState } from "react";
import { useToast } from "../components/ui/Toast/ToastProvider";
import { iconMap } from "../assets/icons";
import {
  DeleteBestPractices,
  GetAllmineBestPractices,
  GetAllSavedBestPractices,
  GetBestPracticesById,
  GetValidProfessionalDetails,
  UpdateBestPractice,
  CreateBestPractice,
  GetInterestsDetails,
} from "../Common/ServerAPI";
import { useNavigate } from "react-router-dom";
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/DashboardCard";
import Modal from "../components/ui/Modal";
import Button from "../components/ui/Button";
import AddBestPracticeModal from "../components/sections/bestPractiseHub/AddBestPractiseModal";
import EditBestPracticeModal from "../components/sections/bestPractiseHub/EditBestPracticesModel";
import DOMPurify from "dompurify";
import { useMediaQuery } from "../hooks/useMediaQuery";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  // totalItems,
  onPageChange,
  isLoading,
}) => {
  const isMobile = window.innerWidth < 768;

  if (totalPages <= 1) return null;

  return (
    <div className="mt-4 sm:mt-6 md:mt-8">
      <div className="flex justify-center">
        <nav className="inline-flex rounded-md shadow-sm -space-x-px text-xs sm:text-sm">
          {/* Previous Button */}
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1 || isLoading}
            className="px-2 sm:px-3 py-1 rounded-l-md bg-white border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            «
          </button>

          {/* First Page - Desktop Only */}
          {!isMobile && (
            <>
              <button
                onClick={() => onPageChange(1)}
                disabled={isLoading}
                className={`px-2 sm:px-3 py-1 border border-gray-300 ${1 === currentPage
                    ? "bg-indigo-500 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
              >
                1
              </button>

              {currentPage > 3 && (
                <span className="px-2 sm:px-3 py-1 border border-gray-300 bg-white">
                  ...
                </span>
              )}
            </>
          )}

          {/* Current Page and Adjacent Pages */}
          {[currentPage - 1, currentPage, currentPage + 1]
            .filter((page) => page > 1 && page < totalPages)
            .map((page) => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                disabled={isLoading}
                className={`px-2 sm:px-3 py-1 border border-gray-300 ${page === currentPage
                    ? "bg-indigo-500 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
              >
                {page}
              </button>
            ))}

          {/* Last Page - Desktop Only */}
          {!isMobile && (
            <>
              {currentPage < totalPages - 2 && (
                <span className="px-2 sm:px-3 py-1 border border-gray-300 bg-white">
                  ...
                </span>
              )}

              {totalPages > 1 && (
                <button
                  onClick={() => onPageChange(totalPages)}
                  disabled={isLoading}
                  className={`px-2 sm:px-3 py-1 border border-gray-300 ${totalPages === currentPage
                      ? "bg-indigo-500 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                >
                  {totalPages}
                </button>
              )}
            </>
          )}

          {/* Next Button */}
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages || isLoading}
            className="px-2 sm:px-3 py-1 rounded-r-md bg-white border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            »
          </button>
        </nav>
      </div>
    </div>
  );
};

const Managebestpractices = () => {
  const [activeTab, setActiveTab] = useState<"saved" | "mine">("saved");
  const [inputValue, setInputValue] = useState("");
  const [editInputValue, setEditInputValue] = useState("");
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [activeStatusTab, setActiveStatusTab] = useState<0 | 1 | 2>(0);

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState({
    save: false,
    my_added: false,
    delete: false,
  });

  const [pagination, setPagination] = useState<any>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 12,
  });
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    practiceId: string | null;
  }>({ isOpen: false, practiceId: null });
  const [saveBestPractices, setSaveBestPractices] = useState<any[]>([]);
  const [mineBestPractices, setmineBestPractices] = useState<any[]>([]);
  const [activeModal, setActiveModal] = useState<"bestpractices" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPractice, setCurrentPractice] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [profession, setProfession] = useState<any[]>([]);
  const [interest, setInterestData] = useState<any[]>([]);

  const { showToast } = useToast();

  const [expandedDescriptions, setExpandedDescriptions] = useState<
    Record<string, boolean>
  >({});
  const [tags, setTags] = useState<string[]>([]);
  const [createTags, setCreateTags] = useState<string[]>([]);

  const truncateText = (text: string, maxLength: number): string => {
    if (!text) return "";
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  const toggleDescription = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setExpandedDescriptions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
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

  const [createModalActive, setCreateModalActive] = useState(false);
  const [newPractice, setNewPractice] = useState({
    title: "",
    description: "",
    profession: "",
    interest: "",
    file: null as File | null,
  });
  const [isCreateSubmitting, setIsCreateSubmitting] = useState(false);

  const fetchBestPractices = async (
    page: number = 1,
    professionId: string = "",
    searchText: string = ""
  ) => {
    setIsLoading((prev) => ({ ...prev, popular: true }));
    try {
      const res = await GetAllSavedBestPractices(
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
            isLiked: practice.is_liked || false,
            commentsCount: practice.total_comment_count || 0,
          })
        );
        setSaveBestPractices(transformedCompanies);
        setPagination((prev: any) => ({
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

  const fetchMineBestPractices = async (
    page: number = 1,
    professionId: string = "",
    searchText: string = ""
  ) => {
    setIsLoading((prev) => ({ ...prev, popular: true }));
    try {
      const res = await GetAllmineBestPractices(
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
            isLiked: practice.is_liked || false,
            commentsCount: practice.total_comment_count || 0,
            status: practice.status,
          })
        );
        setmineBestPractices(transformedCompanies);
        setPagination((prev: any) => ({
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

  useEffect(() => {
    fetchBestPractices();
  }, []);

  useEffect(() => {
    if (activeTab === "mine") {
      if (profession.length === 0) {
        fetchProfession();
      }
      if (interest.length === 0) {
        fetchIntrusts();
      }
      fetchMineBestPractices();
    }
  }, [activeTab]);

  const filteredMineBestPractices = mineBestPractices.filter(
    (practice) => practice.status === activeStatusTab
  );

  const handleDeleteBestPractice = async (id: any) => {
    setIsLoading((prev) => ({ ...prev, delete: true }));
    try {
      await DeleteBestPractices(id);
      showToast({
        message: "Best practice deleted successfully!",
        type: "success",
        duration: 3000,
      });
    } catch (error: any) {
      console.error("Error deleting best practice:", error);
      showToast({
        message:
          error?.response?.data?.error?.message ||
          "Failed to delete best practice",
        type: "error",
        duration: 5000,
      });
    } finally {
      setIsLoading((prev) => ({ ...prev, delete: false }));
    }
  };

  const handleEditBestPractice = async (id: any) => {
    try {
      setIsLoading((prev) => ({ ...prev, popular: true }));
      const response = await GetBestPracticesById(id);
      if (response?.data?.data) {
        setCurrentPractice(response.data.data);
        setTags(response.data.data.tags || []);
        setEditInputValue("");
        setIsEditMode(true);
        setActiveModal("bestpractices");
      }
    } catch (error: any) {
      console.error("Error fetching best practice:", error);
      showToast({
        message: error?.response?.data?.error?.message,
        type: "error",
        duration: 5000,
      });
    } finally {
      setIsLoading((prev) => ({ ...prev, popular: false }));
    }
  };

  const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png"];
    const maxSize = 2 * 1024 * 1024;

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

    setCurrentPractice({
      ...currentPractice,
      file,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPractice?.profession_data?.id && !currentPractice?.interest) {
      showToast({
        message: "Please provide either a profession or an interest",
        type: "error",
        duration: 3000,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditMode) {
        const formData = new FormData();
        formData.append("id", currentPractice.id);

        if (currentPractice?.profession_data?.id) {
          formData.append("profession", currentPractice.profession_data.id);
        }

        formData.append("title", currentPractice.title);
        formData.append("description", currentPractice.description);
        formData.append("tags", JSON.stringify(tags));

        if (currentPractice.file && typeof currentPractice.file !== "string") {
          formData.append("file", currentPractice.file);
        }

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
      await fetchBestPractices();
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

  const closeModal = () => {
    setActiveModal(null);
    setTags([]);
    setEditInputValue("");
  };

  const openCreateModal = () => {
    setCreateModalActive(true);
    setNewPractice({
      title: "",
      description: "",
      profession: "",
      interest: "",
      file: null,
    });
    setCreateTags([]);
    setInputValue("");
  };

  const closeCreateModal = () => {
    setCreateModalActive(false);
    setNewPractice({
      title: "",
      description: "",
      profession: "",
      interest: "",
      file: null,
    });
    setCreateTags([]);
    setInputValue("");
  };

  const handleCreateInputChange = (
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

  const handleCreateFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png"];
    const maxSize = 2 * 1024 * 1024;

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

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreateSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", newPractice.title);
      formData.append("description", newPractice.description);
      formData.append("profession", newPractice.profession);
      formData.append("interest", newPractice.interest);
      formData.append("tags", JSON.stringify(createTags));

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

      closeCreateModal();
      await fetchMineBestPractices();
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
      setIsCreateSubmitting(false);
    }
  };

  const removeTag = (index: number, isCreateModal: boolean = false) => {
    if (isCreateModal) {
      const newTags = [...createTags];
      newTags.splice(index, 1);
      setCreateTags(newTags);
    } else {
      const newTags = [...tags];
      newTags.splice(index, 1);
      setTags(newTags);
    }
  };

  const handleTagKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    isCreateModal: boolean = false
  ) => {
    const value = isCreateModal ? inputValue : editInputValue;
    const isTriggerKey =
      e.key === "Enter" ||
      e.key === "Tab" ||
      e.key === " " ||
      e.key === "Space" ||
      e.key === "Spacebar" ||
      e.code === "Space";

    if (isTriggerKey && value.trim()) {
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

  return (
    <>
      <div className="w-full min-h-screen px-1 sm:px-2 md:px-4 lg:px-6 mt-4 sm:mt-6 md:mt-8">
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-4 sm:mb-6 mt-4 sm:mt-6 md:mt-8 overflow-x-auto">
          <button
            className={`px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base cursor-pointer font-medium whitespace-nowrap ${activeTab === "saved"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500"
              }`}
            onClick={() => setActiveTab("saved")}
          >
            Saved Best Practices
          </button>
          <button
            className={`px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base cursor-pointer font-medium whitespace-nowrap ${activeTab === "mine"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500"
              }`}
            onClick={() => setActiveTab("mine")}
          >
            My Best Practices
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "mine" && (
          <div className="min-h-screen bg-white p-3 sm:p-4 md:p-6 font-sans">
            {/* TITLE + BUTTON IN ONE ROW */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
              <h3 className="font-[Poppins] font-medium text-[16px] sm:text-[18px] leading-[150%] tracking-normal">
                My Submissions
              </h3>

              <Button
                variant="gradient-primary"
                className="jakarta font-medium w-full sm:w-fit rounded-[100px] h-[42px] py-1 px-4 sm:px-6 text-[14px] sm:text-[16px]"
                onClick={openCreateModal}
              >
                Create New Best Practice
              </Button>
            </div>

            {/* Status Tabs - Mobile Responsive */}
            <div className="flex overflow-x-auto pb-2 -mx-3 sm:mx-0 px-3 sm:px-0 sm:pb-0">
              <div className="flex space-x-2 min-w-max sm:min-w-0">
                <button
                  className={`shrink-0 
                      min-w-[100px] sm:min-w-[120px]  
                      max-w-[200px] 
                      text-sm 
                      font-medium 
                      poppins
                      py-2
                      px-3 
                      rounded-lg 
                      rounded-bl-none
                      rounded-br-none
                      whitespace-nowrap 
                      overflow-hidden 
                      text-ellipsis 
                      text-center
                      focus:outline-none
                      border ${activeStatusTab === 0
                      ? "text-purple-600 h-[42px] sm:h-[45px] bg-[#F8F3FF] border-0"
                      : "text-gray-500 bg-white border-[#ECEEF2] border-b-0 hover:text-purple-500"
                    }`}
                  onClick={() => setActiveStatusTab(0)}
                >
                  Submitted
                </button>
                <button
                  className={`shrink-0 
                      min-w-[100px] sm:min-w-[120px]  
                      max-w-[200px] 
                      text-sm 
                      font-medium 
                      poppins
                      py-2
                      px-3 
                      rounded-lg 
                      rounded-bl-none
                      rounded-br-none
                      whitespace-nowrap 
                      overflow-hidden 
                      text-ellipsis 
                      text-center
                      focus:outline-none
                      border ${activeStatusTab === 1
                      ? "text-purple-600 h-[42px] sm:h-[45px] bg-[#F8F3FF] border-0"
                      : "text-gray-500 bg-white border-[#ECEEF2] border-b-0 hover:text-purple-500"
                    }`}
                  onClick={() => setActiveStatusTab(1)}
                >
                  Listed
                </button>
                {/*<button
                  className={`shrink-0 
                      min-w-[100px] sm:min-w-[120px]  
                      max-w-[200px] 
                      text-sm 
                      font-medium 
                      poppins
                      py-2
                      px-3 
                      rounded-lg 
                      rounded-bl-none
                      rounded-br-none
                      whitespace-nowrap 
                      overflow-hidden 
                      text-ellipsis 
                      text-center
                      focus:outline-none
                      border ${
                        activeStatusTab === 2
                          ? "text-purple-600 h-[42px] sm:h-[45px] bg-[#F8F3FF] border-0"
                          : "text-gray-500 bg-white border-[#ECEEF2] border-b-0 hover:text-purple-500"
                      }`}
                  onClick={() => setActiveStatusTab(2)}
                >
                  Rejected
                </button>*/}
              </div>
            </div>

            {isLoading.my_added ? (
              <div className="flex justify-center py-8 sm:py-10">
                <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : filteredMineBestPractices.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 bg-[#F8F3FF] pt-4 sm:pt-6 px-3 sm:px-4 pb-4 sm:pb-6 rounded-lg rounded-tl-none rounded-tr-none">
                {filteredMineBestPractices?.map((company) => {
                  return (
                    <div
                      key={company.id}
                      className="relative bg-white cursor-pointer rounded-xl sm:rounded-2xl border border-gray-200 shadow-md overflow-hidden transition-all duration-300 hover:shadow-sm hover:ring-[1.5px] hover:ring-[#F07EFF]/40"
                    >
                      {/* Edit and Delete buttons */}
                      {company.status !== 2 && (
                        <div className="absolute top-2 right-2 z-10 flex gap-1 sm:gap-2">
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
                              className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600"
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
                              className="h-4 w-4 sm:h-5 sm:w-5 text-red-600"
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
                        <CardHeader className="px-3 sm:px-4 pt-3 sm:pt-4 pb-0 relative z-0">
                          <div className="flex items-start gap-1 pr-10 sm:pr-12">
                            <img
                              src={
                                !company?.user?.profilePicture ||
                                  company?.user?.profilePicture === "null" ||
                                  company?.user?.profilePicture === "undefined" ||
                                  !company?.user?.profilePicture.startsWith(
                                    "http"
                                  ) ||
                                  company?.user?.profilePicture ===
                                  "http://localhost:5026/file/"
                                  ? "/profile.png"
                                  : company?.user?.profilePicture
                              }
                              alt={company.user.username}
                              className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full object-cover mr-2 sm:mr-3"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = "/profile.png";
                              }}
                            />
                            <div className="min-w-0 flex-1">
                              <CardTitle className="text-sm font-semibold truncate">
                                {company.user.firstName} {company.user.lastName}
                              </CardTitle>
                              <CardDescription className="text-xs text-gray-500 truncate">
                                @{company.user.username}
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <div className="px-3 sm:px-4 pt-3 sm:pt-4 pb-0">
                          <div className="rounded-lg sm:rounded-xl overflow-hidden mb-2 sm:mb-3">
                            {company.file && (
                              <img
                                src={
                                  !company.file ||
                                    company.file === "null" ||
                                    company.file === "undefined" ||
                                    !company.file.startsWith("http") ||
                                    company.file === "http://localhost:5026/file/"
                                    ? iconMap["companycard1"]
                                    : company.file
                                }
                                alt={company.title}
                                className="w-full h-36 sm:h-40 md:h-48 object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    iconMap["companycard1"];
                                }}
                              />
                            )}
                          </div>
                          <h3 className="text-sm sm:text-base font-semibold mb-1 sm:mb-2 line-clamp-2 min-h-10 sm:min-h-12">
                            {company.title}
                          </h3>
                          <p className="text-xs sm:text-sm font-semibold text-gray-900 mb-1">
                            Overview
                          </p>

                          <p className="text-xs sm:text-sm text-gray-600 mb-2 leading-snug wrap-break-word whitespace-pre-line">
                            <span
                              dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(
                                  expandedDescriptions[company.id]
                                    ? company.description
                                    : truncateText(company.description, 80)
                                ),
                              }}
                            />
                            {company.description.length > 80 && (
                              <span
                                className="text-purple-600 underline cursor-pointer ml-1 text-xs sm:text-sm"
                                onClick={(e) => toggleDescription(e, company.id)}
                              >
                                {expandedDescriptions[company.id]
                                  ? "Read Less"
                                  : "Read More"}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 sm:py-10 bg-[#F8F3FF] pt-4 sm:pt-6 px-3 sm:px-4 pb-4 sm:pb-6 rounded-lg rounded-tl-none rounded-tr-none">
                <p className="text-gray-500 text-sm sm:text-base mb-4">
                  {activeStatusTab === 0 &&
                    "There is no best practice data in Pending list."}
                  {activeStatusTab === 1 &&
                    "There is no best practice data in Approved list."}
                  {activeStatusTab === 2 &&
                    "There is no best practice data in Rejected list."}
                </p>
              </div>
            )}

            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalItems={pagination.totalItems}
              onPageChange={(page) => fetchMineBestPractices(page)}
              isLoading={isLoading.my_added}
            />
          </div>
        )}

        {activeTab === "saved" && (
          <div className="min-h-screen bg-white p-3 sm:p-4 md:p-6 font-sans">
            <h3 className="font-[Poppins] font-medium text-[16px] sm:text-[18px] leading-[150%] tracking-normal mb-3 sm:mb-4">
              View Saved Best Practices
            </h3>

            {isLoading.save ? (
              <div className="flex justify-center py-8 sm:py-10">
                <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : saveBestPractices.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                {saveBestPractices?.map((company) => {
                  return (
                    <div
                      key={company.id}
                      className="relative bg-white cursor-pointer rounded-xl sm:rounded-2xl border border-gray-200 shadow-md overflow-hidden transition-all duration-300 hover:shadow-sm hover:ring-[1.5px] hover:ring-[#F07EFF]/40"
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
                      <CardHeader className="px-3 sm:px-4 pt-3 sm:pt-4 pb-0">
                        <div className="flex items-start gap-1">
                          <img
                            src={
                              !company?.user?.profilePicture ||
                                company?.user?.profilePicture === "null" ||
                                company?.user?.profilePicture === "undefined" ||
                                !company?.user?.profilePicture.startsWith(
                                  "http"
                                ) ||
                                company?.user?.profilePicture ===
                                "http://localhost:5026/file/"
                                ? "/profile.png"
                                : company?.user?.profilePicture
                            }
                            alt={company.user.username}
                            className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full object-cover mr-2 sm:mr-3"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/profile.png";
                            }}
                          />
                          <div className="min-w-0 flex-1">
                            <CardTitle className="text-sm font-semibold truncate">
                              {company.user.firstName} {company.user.lastName}
                            </CardTitle>
                            <CardDescription className="text-xs text-gray-500 truncate">
                              @{company.user.username}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <div className="px-3 sm:px-4 pt-3 sm:pt-4 pb-0">
                        <div className="rounded-lg sm:rounded-xl overflow-hidden mb-2 sm:mb-3">
                          {company.file && (
                            <img
                              src={
                                !company.file ||
                                  company.file === "null" ||
                                  company.file === "undefined" ||
                                  !company.file.startsWith("http") ||
                                  company.file === "http://localhost:5026/file/"
                                  ? iconMap["companycard1"]
                                  : company.file
                              }
                              alt={company.title}
                              className="w-full h-36 sm:h-40 md:h-48 object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  iconMap["companycard1"];
                              }}
                            />
                          )}
                        </div>
                        <h3 className="text-sm sm:text-base font-semibold mb-1 sm:mb-2 line-clamp-2 min-h-10 sm:min-h-12">
                          {company.title}
                        </h3>
                        <p className="text-xs sm:text-sm font-semibold text-gray-900 mb-1">
                          Overview
                        </p>

                        <p className="text-xs sm:text-sm text-gray-600 mb-2 leading-snug wrap-break-word whitespace-pre-line">
                          <span
                            dangerouslySetInnerHTML={{
                              __html: DOMPurify.sanitize(
                                expandedDescriptions[company.id]
                                  ? company.description
                                  : truncateText(
                                    company.description,
                                    isMobile ? 80 : 100
                                  )
                              ),
                            }}
                          />
                          {company.description.length > 80 && (
                            <span
                              className="text-purple-600 underline cursor-pointer ml-1 text-xs sm:text-sm"
                              onClick={(e) => toggleDescription(e, company.id)}
                            >
                              {expandedDescriptions[company.id]
                                ? "Read Less"
                                : "Read More"}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-sm sm:text-base py-8 sm:py-10 text-center">
                No Best Practices found.
              </p>
            )}

            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalItems={pagination.totalItems}
              onPageChange={(page) => fetchBestPractices(page)}
              isLoading={isLoading.save}
            />
          </div>
        )}
      </div>

      {/* Modals */}
      <AddBestPracticeModal
        open={createModalActive}
        onClose={closeCreateModal}
        newPractice={newPractice}
        profession={profession}
        interest={interest}
        tags={createTags}
        inputValue={inputValue}
        setInputValue={setInputValue}
        removeTag={(idx) => removeTag(idx, true)}
        handleTagKeyDown={(e) => handleTagKeyDown(e, true)}
        handleInputChange={handleCreateInputChange}
        handleFileChange={handleCreateFileChange}
        handleRemoveFile={handleRemoveFile}
        handleSubmit={handleCreateSubmit}
        isSubmitting={isCreateSubmitting}
      />

      <EditBestPracticeModal
        open={activeModal === "bestpractices"}
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

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteConfirmation.isOpen}
        onClose={() =>
          setDeleteConfirmation({ isOpen: false, practiceId: null })
        }
      >
        <div className="p-4 sm:p-6 w-full max-w-md mx-auto">
          <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Confirm Deletion</h2>
          <p className="mb-4 sm:mb-6 text-sm sm:text-base">
            Are you sure you want to delete this best practice? This action
            cannot be undone.
          </p>

          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
            <Button
              type="button"
              onClick={() =>
                setDeleteConfirmation({ isOpen: false, practiceId: null })
              }
              variant="white-outline"
              className="w-full sm:w-auto py-2 px-4"
              disabled={isLoading.delete}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={async () => {
                if (deleteConfirmation.practiceId) {
                  await handleDeleteBestPractice(deleteConfirmation.practiceId);
                  await fetchMineBestPractices();
                  setDeleteConfirmation({ isOpen: false, practiceId: null });
                }
              }}
              className="w-full sm:w-auto py-2 px-6"
            >
              {isLoading.delete ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Managebestpractices;