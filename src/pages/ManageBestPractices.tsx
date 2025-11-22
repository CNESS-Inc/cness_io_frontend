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

const Managebestpractices = () => {
  const [activeTab, setActiveTab] = useState<"saved" | "mine">("saved");
  const [inputValue, setInputValue] = useState("");
  const [editInputValue, setEditInputValue] = useState(""); // Separate input for edit modal

  const [activeStatusTab, setActiveStatusTab] = useState<0 | 1 | 2>(0); // 0: Pending, 1: Approved, 2: Rejected

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
    itemsPerPage: 10,
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
  const [createTags, setCreateTags] = useState<string[]>([]); // Separate tags for create modal

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

  // Add these new state variables for create modal
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
      // Only fetch if not already loaded
      if (profession.length === 0) {
        fetchProfession();
      }
      if (interest.length === 0) {
        fetchIntrusts();
      }
      fetchMineBestPractices();
    }
  }, [activeTab]);

  // Filtered best practices by status
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
        message: error?.response?.data?.error?.message || "Failed to delete best practice",
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
        setEditInputValue(""); // Reset edit input value
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate that at least one of profession or interest is provided
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
        // For edit mode, send as FormData to include file
        const formData = new FormData();
        formData.append("id", currentPractice.id);

        // Append profession if available
        if (currentPractice?.profession_data?.id) {
          formData.append("profession", currentPractice.profession_data.id);
        }

        formData.append("title", currentPractice.title);
        formData.append("description", currentPractice.description);
        formData.append("tags", JSON.stringify(tags));

        // Append file if it's a new file (File object), not a string URL
        if (currentPractice.file && typeof currentPractice.file !== "string") {
          formData.append("file", currentPractice.file);
        }

        // Append interest if available
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

  // Function to open create modal
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

  // Function to close create modal
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

  // Function to handle input changes for create form
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

  // Function to handle file change for create form
  const handleCreateFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  // Function to handle create form submission
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreateSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", newPractice.title);
      formData.append("description", newPractice.description);
      formData.append("profession", newPractice.profession);
      formData.append("interest", newPractice.interest);
      formData.append("tags", JSON.stringify(createTags)); // Add tags to form data

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
      // Refresh the mine best practices list
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

  return (
    <>
      <div className="w-full min-h-screen mt-8 px-1">
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-6 mt-8">
          <button
            className={`px-4 py-2 cursor-pointer font-medium ${
              activeTab === "saved"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("saved")}
          >
            Saved Best Practices
          </button>
          <button
            className={`px-4 py-2 cursor-pointer font-medium ${
              activeTab === "mine"
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
  <div className="min-h-screen bg-white p-6 font-sans">

    {/* TITLE + BUTTON IN ONE ROW */}
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-[Poppins] font-medium text-[18px] leading-[150%] tracking-normal">
        My Submissions
      </h3>

      <Button
                  variant="gradient-primary"
                  className="jakarta font-medium w-fit rounded-[100px] h-[42px] py-1 px-6 self-stretch text-[16px] "
        onClick={openCreateModal}
       
      >
        Create New Best Practice
      </Button>
    </div>



            {/* Status Tabs */}
            <div className="flex border-b border-gray-100">
              <button
                className={`shrink-0 
                      min-w-[120px]  
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
                        activeStatusTab === 0
                          ? "text-purple-600 h-[45px] bg-[#F8F3FF] border-0"
                          : "text-gray-500 bg-white border-[#ECEEF2] border-b-0 hover:text-purple-500"
                      }`}
                onClick={() => setActiveStatusTab(0)}
              >
                Pending
              </button>
              <button
                className={`shrink-0 
                      min-w-[120px]  
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
                      border ms-2 ${
                        activeStatusTab === 1
                          ? "text-purple-600 h-[45px] bg-[#F8F3FF] border-0"
                          : "text-gray-500 bg-white border-[#ECEEF2] border-b-0 hover:text-purple-500"
                      }`}
                onClick={() => setActiveStatusTab(1)}
              >
                Approved
              </button>
              <button
                className={`shrink-0 
                      min-w-[120px]  
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
                      border
                      ms-2 ${
                        activeStatusTab === 2
                          ? "text-purple-600 h-[45px] bg-[#F8F3FF] border-0"
                          : "text-gray-500 bg-white border-[#ECEEF2] border-b-0 hover:text-purple-500"
                      }`}
                onClick={() => setActiveStatusTab(2)}
              >
                Rejected
              </button>
            </div>

            {isLoading.my_added ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : filteredMineBestPractices.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-x-4 gap-y-4 bg-[#F8F3FF] pt-6 px-4 pb-6 rounded-lg rounded-tl-none rounded-tr-none">
                {filteredMineBestPractices?.map((company) => {
                  return (
                    <div
                      key={company.id}
                      className="relative bg-white cursor-pointer rounded-2xl border border-gray-200 shadow-md overflow-hidden transition-all duration-300 hover:shadow-sm hover:ring-[1.5px] hover:ring-[#F07EFF]/40"
                    >
                      {/* Edit and Delete buttons (absolute positioned in top-right) */}
                      {company.status !== 2 && (
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
                        <CardHeader className="px-4 pt-4 pb-0 relative z-0">
                          <div className="flex items-start gap-1 pr-12">
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
                        <div className="px-4 pt-4 pb-0 relative z-0">
                          <div className="rounded-xl overflow-hidden mb-3">
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

                          <p className="text-sm text-gray-600 mb-2 leading-snug wrap-break-word whitespace-pre-line">
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
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-10 bg-[#F8F3FF] pt-6 px-4 pb-6 rounded-lg rounded-tl-none rounded-tr-none">
                <p className="text-gray-500 mb-4">
                  {activeStatusTab === 0 &&
                    "There is no best practice data in Pending list."}
                  {activeStatusTab === 1 &&
                    "There is no best practice data in Approved list."}
                  {activeStatusTab === 2 &&
                    "There is no best practice data in Rejected list."}
                </p>
               
              </div>
            )}
          </div>
        )}

        {activeTab === "saved" && (
          <div className="min-h-screen bg-white p-6 font-sans">
            <h3 className="font-[Poppins] font-medium text-[18px] leading-[150%] tracking-normal mb-4">
              View Saved Best Practices
            </h3>

            {isLoading.save ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : saveBestPractices.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-x-4 gap-y-4">
                {saveBestPractices?.map((company) => {
                  return (
                    <div
                      key={company.id}
                      className="relative bg-white  cursor-pointer rounded-2xl border border-gray-200 shadow-md overflow-hidden transition-all duration-300 hover:shadow-sm hover:ring-[1.5px] hover:ring-[#F07EFF]/40"
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
                      <CardHeader className="px-4 pt-4 pb-0 relative z-0">
                        <div className="flex items-start gap-1 pr-12">
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
                      <div className="px-4 pt-4 pb-0 relative z-0">
                        <div className="rounded-xl overflow-hidden mb-3">
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
                              className="w-full h-40 sm:h-48 object-cover"
                              onError={(e) => {
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

                        <p className="text-sm text-gray-600 mb-2 leading-snug wrap-break-word whitespace-pre-line">
                          {expandedDescriptions[company.id]
                            ? company.description
                            : truncateText(company.description, 100)}
                          {company.description.length > 100 && (
                            <span
                              className="text-purple-600 underline cursor-pointer ml-1"
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
              <p className="text-gray-500 py-10 text-center">
                No Best Practices found.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Create Best Practice Modal */}
      {/* <Modal isOpen={createModalActive} onClose={closeCreateModal}>
        <div className="p-4 sm:p-6 w-full max-w-md mx-auto">
          <h2 className="text-xl font-bold mb-4">Create New Best Practice</h2>
          <form
            onSubmit={handleCreateSubmit}
            className="space-y-3 sm:space-y-4"
          >
            <div>
              <label
                htmlFor="create-title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Title*
              </label>
              <input
                type="text"
                id="create-title"
                name="title"
                value={newPractice.title}
                onChange={handleCreateInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                required
              />
            </div>

            <div>
              <label
                htmlFor="create-description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description*
              </label>
              <textarea
                id="create-description"
                name="description"
                value={newPractice.description}
                onChange={handleCreateInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                required
              />
            </div>

            <div>
              <label
                htmlFor="create-profession"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Profession*
              </label>
              <select
                id="create-profession"
                name="profession"
                value={newPractice.profession}
                onChange={handleCreateInputChange}
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
                htmlFor="create-tags"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Tags
              </label>
              <div className="w-full border border-gray-300 bg-white rounded-md px-3 py-2">
                <div className="flex flex-wrap gap-2 mb-1">
                  {createTags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="flex items-center bg-[#f3f1ff] text-[#6269FF] px-3 py-1 rounded-full text-[14px]"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(idx, true)}
                        className="ml-1 text-[#6269FF] hover:text-red-500 font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  id="create-tags"
                  className="w-full text-sm bg-white focus:outline-none placeholder-gray-400"
                  placeholder="Add tags (e.g. therapy, online, free-consult)"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => handleTagKeyDown(e, true)}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="create-file"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                File (Optional)
              </label>
              <input
                type="file"
                id="create-file"
                name="file"
                onChange={handleCreateFileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                accept="image/*, .pdf, .doc, .docx"
              />
              {newPractice?.file && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600">
                    Selected file: {newPractice.file.name}
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
              <Button
                type="button"
                onClick={closeCreateModal}
                variant="white-outline"
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="gradient-primary"
                className="w-full sm:w-auto py-2 px-6 sm:py-3 sm:px-8"
                disabled={isCreateSubmitting}
              >
                {isCreateSubmitting ? "Creating..." : "Create"}
              </Button>
            </div>
          </form>
        </div>
      </Modal> */}
      <AddBestPracticeModal
        open={createModalActive}
        onClose={closeCreateModal}
        newPractice={newPractice}
        profession={profession}
        interest={interest}
        tags={tags}
        inputValue={inputValue}
        setInputValue={setInputValue}
        removeTag={removeTag}
        handleTagKeyDown={handleTagAddKeyDown}
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
      {/* <Modal isOpen={activeModal === "bestpractices"} onClose={closeModal}>
        <div className="p-4 sm:p-6 w-full max-w-md mx-auto">
          <h2 className="text-xl font-bold mb-4">
            {isEditMode ? "Edit Best Practice" : "Add Best Practice"}
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
                value={currentPractice?.title}
                onChange={(e) =>
                  setCurrentPractice({
                    ...currentPractice,
                    title: e.target.value,
                  })
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
                value={currentPractice?.description}
                onChange={(e) =>
                  setCurrentPractice({
                    ...currentPractice,
                    description: e.target.value,
                  })
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
                Profession*
              </label>
              <select
                id="profession"
                name="profession"
                value={currentPractice?.profession_data.id}
                onChange={(e) =>
                  setCurrentPractice({
                    ...currentPractice,
                    profession: e.target.value,
                  })
                }
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

            <label
              htmlFor="interest"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Tags
            </label>
            <div className="w-full border border-gray-300 bg-white rounded-md px-3 py-2">
              <div className="flex flex-wrap gap-2 mb-1">
                {tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="flex items-center bg-[#f3f1ff] text-[#6269FF] px-3 py-1 rounded-full text-[14px]"
                  >
                    {tag}
                    <button
                      type="button"
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
                value={editInputValue}
                onChange={(e) => setEditInputValue(e.target.value)}
                onKeyDown={(e) => handleTagKeyDown(e, false)}
              />
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
                onChange={(e) => {
                  if (e.target.files) {
                    setCurrentPractice({
                      ...currentPractice,
                      file: e.target.files[0],
                    });
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                accept="image/*, .pdf, .doc, .docx"
              />
              {isEditMode && currentPractice?.file && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600 break-all">
                    Current file:
                    <span className="block">
                      {typeof currentPractice.file === "string"
                        ? currentPractice.file.split("/").pop()
                        : currentPractice.file.name}
                    </span>
                  </p>
                </div>
              )}
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
                {isSubmitting
                  ? "Submitting..."
                  : isEditMode
                  ? "Update"
                  : "Submit"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>*/}

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
              variant="white-outline"
              className="w-full sm:w-auto"
              disabled={isLoading.delete}
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
              className="w-full sm:w-auto py-2 px-6 sm:py-3 sm:px-8"
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
