import { useEffect, useState, type ReactNode } from "react";
import { iconMap } from "../assets/icons";
import AnimatedBackground from "../components/ui/AnimatedBackground";
import { CreateBestPractice, GetAllBestPractices, GetAllFormDetails } from "../Common/ServerAPI";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/ui/Toast/ToastProvider";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal"; // Assuming you have a Modal component

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
  // Modal states
  const [newPractice, setNewPractice] = useState({
    title: "",
    description: "",
    profession: "",
    file: null as File | null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pagination states
  const [popularPagination, setPopularPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });
  const [popularCompanies, setPopularCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState({
    popular: false,
  });

  const handleProfessionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProfession(e.target.value);
  };

  const fetchProfession = async () => {
    try {
      const res = await GetAllFormDetails();
      setProfession(
        res?.data?.data?.profession
          .filter((item: { is_blocked: boolean }) => !item.is_blocked)
          .map((item: { id: string; title: string }) => ({
            id: item.id,
            title: item.title,
          }))
      );
    } catch (error: any) {
      console.error("Error fetching professions:", error);
      showToast({
        message: error?.response?.data?.error?.message,
        type: "error",
        duration: 5000,
      });
    }
  };

  const fetchPopularCompany = async (page: number = 1) => {
    setIsLoading((prev) => ({ ...prev, popular: true }));
    try {
      const res = await GetAllBestPractices(
        page,
        popularPagination.itemsPerPage
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
        setPopularCompanies(transformedCompanies);
        setPopularPagination((prev: PaginationData) => ({
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
    fetchPopularCompany();
  }, []);

  const handleSearch = () => {
    if (selectedProfession || searchText) {
      const professionSlug = selectedProfession || "";
      navigate(
        `/dashboard/DashboardDirectory/technology?search=${encodeURIComponent(
          searchText
        )}&profession=${professionSlug}`
      );
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
      fetchPopularCompany(); // Refresh the list
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
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-')   // Replace multiple - with single -
    .replace(/^-+/, '')       // Trim - from start of text
    .replace(/-+$/, '');      // Trim - from end of text
};

  return (
    <>
      <section className="relative w-full h-[500px] mx-auto rounded-[12px] overflow-hidden">
        <AnimatedBackground />

        {/* Background Image (city illustration) */}
        <img
          src={iconMap["heroimg"]}
          alt="City Skyline"
          className="absolute bottom-[-200px] left-0 w-full object-cover z-0 pointer-events-none"
        />

        {/* Foreground Content */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">
          <h1 className="text-[32px] sm:text-2xl md:text-4xl font-bold text-gray-800 mb-10 -mt-35">
            Find Your Conscious Best Practices here.
          </h1>

          <div className="w-full max-w-2xl bg-white border border-gray-200 rounded-full flex items-center px-3 py-2 shadow-sm gap-2 mt-2">
            <div className="relative">
              <select
                className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-full px-4 py-2 w-[180px] sm:w-[220px] text-center appearance-none cursor-pointer"
                value=""
                onChange={handleProfessionChange}
              >
                <option value="">Explore</option>
                {profession.map((prof: any) => (
                  <option key={prof.id} value={prof.id} className="text-black">
                    {prof.title}
                  </option>
                ))}
              </select>
              <div className="absolute top-2.5 right-3 text-white text-xs pointer-events-none">
                ▼
              </div>
            </div>

            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Find & Choose your perfect organization"
                className="w-full px-4 py-2 pr-10 text-sm text-gray-700 placeholder:text-gray-400 bg-transparent outline-none"
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

          <p className="text-gray-700 text-[12px] mt-5">
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

      {/* Popular Companies Section */}
      <section className="py-16 bg-[#f9f9f9] border-t border-gray-100">
        <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold mb-4">Popular Companies</h2>
            <Button
              variant="gradient-primary"
              className="rounded-[100px] py-2 px-8 self-stretch transition-colors duration-500 ease-in-out"
              onClick={openModal}
            >
              Add Best Practices
            </Button>
          </div>

          {isLoading.popular ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : popularCompanies.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
              {popularCompanies?.map((company) => (
                <div
                  key={company.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                  onClick={() => navigate(`/dashboard/bestpractices/${company.id}/${slugify(company.title)}`)}
                >
                  {company.file && (
                    <img
                      src={company.file}
                      alt={company.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <div className="flex items-center mb-3">
                      <img
                        src={company.user.profilePicture}
                        alt={company.user.username}
                        className="w-10 h-10 rounded-full object-cover mr-3"
                      />
                      <div>
                        <h3 className="font-semibold">
                          {company.user.firstName} {company.user.lastName}
                        </h3>
                        <p className="text-sm text-gray-500 break-all">
                          @{company.user.username}
                        </p>
                      </div>
                    </div>
                    <h3 className="text-lg font-bold mb-2">{company.title}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {company.description}
                    </p>
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>{company.profession}</span>
                      <div className="flex space-x-4">
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
            <p className="text-gray-500">No popular companies found.</p>
          )}

          {popularPagination.totalPages > 1 && (
            <div className="mt-8">
              <div className="flex justify-center">
                <nav className="inline-flex rounded-md shadow-sm -space-x-px text-sm">
                  <button
                    onClick={() =>
                      fetchPopularCompany(popularPagination.currentPage - 1)
                    }
                    disabled={
                      popularPagination.currentPage === 1 || isLoading.popular
                    }
                    className="px-3 py-1 rounded-l-md bg-white border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-40"
                  >
                    «
                  </button>

                  {/* Always show first page */}
                  <button
                    onClick={() => fetchPopularCompany(1)}
                    disabled={isLoading.popular}
                    className={`px-3 py-1 border border-gray-300 ${
                      1 === popularPagination.currentPage
                        ? "bg-indigo-500 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    1
                  </button>

                  {/* Show ellipsis if current page is far from start */}
                  {popularPagination.currentPage > 3 && (
                    <span className="px-3 py-1 border border-gray-300 bg-white">
                      ...
                    </span>
                  )}

                  {/* Show pages around current page */}
                  {[
                    popularPagination.currentPage - 2,
                    popularPagination.currentPage - 1,
                    popularPagination.currentPage,
                    popularPagination.currentPage + 1,
                    popularPagination.currentPage + 2,
                  ]
                    .filter(
                      (page) => page > 1 && page < popularPagination.totalPages
                    )
                    .map((page) => (
                      <button
                        key={page}
                        onClick={() => fetchPopularCompany(page)}
                        disabled={isLoading.popular}
                        className={`px-3 py-1 border border-gray-300 ${
                          page === popularPagination.currentPage
                            ? "bg-indigo-500 text-white"
                            : "bg-white text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                  {/* Show ellipsis if current page is far from end */}
                  {popularPagination.currentPage <
                    popularPagination.totalPages - 2 && (
                    <span className="px-3 py-1 border border-gray-300 bg-white">
                      ...
                    </span>
                  )}

                  {/* Always show last page if it's not the first page */}
                  {popularPagination.totalPages > 1 && (
                    <button
                      onClick={() =>
                        fetchPopularCompany(popularPagination.totalPages)
                      }
                      disabled={isLoading.popular}
                      className={`px-3 py-1 border border-gray-300 ${
                        popularPagination.totalPages ===
                        popularPagination.currentPage
                          ? "bg-indigo-500 text-white"
                          : "bg-white text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {popularPagination.totalPages}
                    </button>
                  )}

                  <button
                    onClick={() =>
                      fetchPopularCompany(popularPagination.currentPage + 1)
                    }
                    disabled={
                      popularPagination.currentPage ===
                        popularPagination.totalPages || isLoading.popular
                    }
                    className="px-3 py-1 rounded-r-md bg-white border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-40"
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
        <div className="p-6 max-w-md">
          <form onSubmit={handleSubmit} className="space-y-4">
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                accept="image/*, .pdf, .doc, .docx"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                onClick={closeModal}
                variant="white-outline"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="gradient-primary"
                className="rounded-full py-3 px-8 transition-all"
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
