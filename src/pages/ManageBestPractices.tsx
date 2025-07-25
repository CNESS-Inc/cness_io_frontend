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
} from "../Common/ServerAPI";
import { useNavigate } from "react-router-dom";
import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/DashboardCard";
import Modal from "../components/ui/Modal";
import Button from "../components/ui/Button";

const Managebestpractices = () => {
  const [activeTab, setActiveTab] = useState<"saved" | "mine">("saved");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState({
    save: false,
    my_added: false,
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
  console.log("🚀 ~ Managebestpractices ~ currentPractice:", currentPractice);
  const [isEditMode, setIsEditMode] = useState(false);
  const [profession, setProfession] = useState<any[]>([]);

  const { showToast } = useToast();

  const [expandedDescriptions, setExpandedDescriptions] = useState<
    Record<string, boolean>
  >({});

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

  useEffect(() => {
    fetchProfession();
    fetchBestPractices();
    fetchMineBestPractices();
  }, []);

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
    } finally {
      setIsLoading((prev) => ({ ...prev, popular: false }));
    }
  };

  const handleEditBestPractice = async (id: any) => {
    try {
      setIsLoading((prev) => ({ ...prev, popular: true }));
      const response = await GetBestPracticesById(id);
      if (response?.data?.data) {
        setCurrentPractice(response.data.data);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isEditMode) {
        // For edit mode, send as JSON
        const payload = {
          id: currentPractice.id,
          profession: currentPractice.profession,
          title: currentPractice.title,
          description: currentPractice.description,
        };

        await UpdateBestPractice(payload);
        showToast({
          message: "Best practice updated successfully!",
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
  };

  return (
    <>
      <div className="w-full min-h-screen mt-8">
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
            <h3 className="font-[Poppins] font-medium text-[18px] leading-[150%] tracking-normal mb-4">
              View My Best Practices
            </h3>
            {isLoading.my_added ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : mineBestPractices.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-x-4 gap-y-4">
                {mineBestPractices?.map((company) => {
                  return (
                    <div
                      key={company.id}
                      className="relative bg-white cursor-pointer rounded-2xl border border-gray-200 shadow-md overflow-hidden transition-all duration-300 hover:shadow-sm hover:ring-[1.5px] hover:ring-[#F07EFF]/40"
                    >
                      {/* Edit and Delete buttons (absolute positioned in top-right) */}
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
                          </div>
                          <h3 className="text-base sm:text-base font-semibold mb-1 sm:mb-2 line-clamp-2">
                            {company.title}
                          </h3>
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
                          <p className="text-sm text-gray-600 mb-2 leading-snug break-words whitespace-pre-line">
                            {expandedDescriptions[company.id]
                              ? company.description
                              : truncateText(company.description, 100)}
                            {company.description.length > 100 && (
                              <span
                                className="text-purple-600 underline cursor-pointer ml-1"
                                onClick={(e) =>
                                  toggleDescription(e, company.id)
                                }
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
              <div className="text-center py-10">
                <p className="text-gray-500 mb-4">No Best Practices found.</p>
                <button
                  onClick={() => navigate("/dashboard/bestpractices/create")}
                  className="px-4 py-2 bg-[#F07EFF] text-white rounded-md hover:bg-[#E06EE5] transition-colors"
                >
                  Create New Best Practice
                </button>
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
                  //const isSaved = savedItems.has(company.id); // ✅ declare inside

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
                        </div>
                        <h3 className="text-base sm:text-base font-semibold mb-1 sm:mb-2 line-clamp-2">
                          {company.title}
                        </h3>
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
                        <p className="text-sm text-gray-600 mb-2 leading-snug break-words whitespace-pre-line">
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

      <Modal isOpen={activeModal === "bestpractices"} onClose={closeModal}>
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
                  <p className="text-sm text-gray-600">
                    Current file:{" "}
                    {typeof currentPractice.file === "string"
                      ? currentPractice.file.split("/").pop()
                      : currentPractice.file.name}
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
      </Modal>

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
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Managebestpractices;
