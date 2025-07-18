import { useEffect, useState, type ReactNode } from "react";
import { iconMap } from "../assets/icons";
import AnimatedBackground from "../components/ui/AnimatedBackground";
import { CreateBestPractice, GetAllBestPractices, GetAllFormDetails } from "../Common/ServerAPI";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/ui/Toast/ToastProvider";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal"; // Assuming you have a Modal component
import cnesslogo from "../assets/cnesslogo.png";
import certifiedbadge from "../assets/indv_aspiring.svg";
import banner from "../assets/companycard1.png";
import like from "../assets/like.svg";
import comment from "../assets/comment.svg";

const truncateText = (text: string, maxLength: number): string => {
  if (!text) return '';
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
};
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
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });
  const [bestPractices, setBestPractices] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState({
    popular: false,
  });

  const handleProfessionChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
  const professionId = e.target.value;
  setSelectedProfession(professionId);
  // Reset to page 1 when profession changes
  await fetchBestPractices(1, professionId, searchText);
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

  const fetchBestPractices = async (page: number = 1, professionId: string = "",searchText: string = "") => {
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

<div className="w-full max-w-3xl mx-auto bg-white border border-gray-200 rounded-full flex flex-nowrap items-center px-3 py-2 shadow-sm gap-2">
<div className="relative">
              <select
  className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-full px-4 py-2 appearance-none focus:outline-none cursor-pointer w-[130px] text-center"
                value=""
                onChange={handleProfessionChange}
              >
                <option value="">Profession</option>
                {profession.map((prof: any) => (
                  <option key={prof.id} value={prof.id} className="text-black">
                    {prof.title}
                  </option>
                ))}
              </select>
  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-xs pointer-events-none">
                ▼
              </div>
            </div>

            <div className="relative flex-grow">
              <input
               
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
            <h2 className="text-xl font-semibold mb-4">Best Practices</h2>
            <Button
              variant="gradient-primary"
  className="w-[168px] h-[45px] rounded-[100px] px-6 py-4 text-[18px] leading-[100%] font-medium font-[Plus Jakarta Sans] text-center tracking-[0px] transition-colors duration-500 ease-in-out whitespace-nowrap flex items-center justify-center"
              onClick={openModal}
            >
              Add Best Practices
            </Button>
          </div>

          {isLoading.popular ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : bestPractices.length > 0 ? (
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
              {bestPractices?.map((company) => (
                <div
                  key={company.id}
                  onClick={() => navigate(`/dashboard/bestpractices/${company.id}/${slugify(company.title)}`)}
  className="w-[359px] h-[388px]  border border-gray-200 rounded-[12px] bg-white p-4 shadow-sm cursor-pointer hover:shadow-md transition-all flex flex-col justify-between"



                >

                  {/* Badge or Logo */}
<img
  src={company.isCertified ? certifiedbadge : cnesslogo}
  alt="Badge"
  className="absolute top-2 right-2 w-8 h-8 rounded-full border border-white shadow-md z-10"
/>
<div className="flex items-center gap-3 mb-3">
      <img
        src={company.user.profilePicture}
        className="w-10 h-10 rounded-full object-cover"
        alt={company.user.username}
      />
      <div>
        <h3 className="font-semibold text-sm">{company.user.firstName} {company.user.lastName}</h3>
        <p className="text-xs text-gray-500">{company.location}</p>
                <p className="text-xs text-gray-500">{company.profession}</p>

      </div>
  </div>
                  {company.file && (
                    <img
                      src={company.file}
                      alt={company.title}
                      className="w-full h-40 object-cover rounded-md mb-3"
                    />
                  )}

{/* Second image: Best Practice Banner or Default */}
  <img
    src={banner}
    alt="Best Practice Banner"
    className="w-full h-[150px] object-cover rounded-md mb-3"
  />

{/* About + Description */}


  <h4 className="text-sm font-semibold mb-1 text-gray-700">About</h4>
    <p className="text-sm text-gray-600">
  {truncateText(company.description, 80)}
 
    <span className="text-[#F07EFF] underline">Read More
  
  </span>
</p>
   


  {/* Like / Comment Bottom Right */}
  <div className="flex justify-end gap-4 pt-4 text-sm text-gray-500">
    <div className="flex items-center gap-1">
      <img src={like} alt="Like Icon" className="w-6 h-6" />
      <span>{company?.likesCount || 0}</span>
    </div>
    <div className="flex items-center gap-1">
      <img src={comment} alt="Comment Icon" className="w-6 h-6" />
      <span>{company?.commentsCount || 0}</span>
    </div>
  </div>
</div>
               
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No Best Practices found.</p>
          )}

          {pagination.totalPages > 1 && (
            <div className="mt-8">
              <div className="flex justify-center">
                <nav className="inline-flex rounded-md shadow-sm -space-x-px text-sm">
                  <button
                    onClick={() =>
                      fetchBestPractices(pagination.currentPage - 1)
                    }
                    disabled={
                      pagination.currentPage === 1 || isLoading.popular
                    }
                    className="px-3 py-1 rounded-l-md bg-white border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-40"
                  >
                    «
                  </button>

                  {/* Always show first page */}
                  <button
                    onClick={() => fetchBestPractices(1)}
                    disabled={isLoading.popular}
                    className={`px-3 py-1 border border-gray-300 ${
                      1 === pagination.currentPage
                        ? "bg-indigo-500 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    1
                  </button>

                  {/* Show ellipsis if current page is far from start */}
                  {pagination.currentPage > 3 && (
                    <span className="px-3 py-1 border border-gray-300 bg-white">
                      ...
                    </span>
                  )}

                  {/* Show pages around current page */}
                  {[
                    pagination.currentPage - 2,
                    pagination.currentPage - 1,
                    pagination.currentPage,
                    pagination.currentPage + 1,
                    pagination.currentPage + 2,
                  ]
                    .filter(
                      (page) => page > 1 && page < pagination.totalPages
                    )
                    .map((page) => (
                      <button
                        key={page}
                        onClick={() => fetchBestPractices(page)}
                        disabled={isLoading.popular}
                        className={`px-3 py-1 border border-gray-300 ${
                          page === pagination.currentPage
                            ? "bg-indigo-500 text-white"
                            : "bg-white text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                  {/* Show ellipsis if current page is far from end */}
                  {pagination.currentPage <
                    pagination.totalPages - 2 && (
                    <span className="px-3 py-1 border border-gray-300 bg-white">
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
                      className={`px-3 py-1 border border-gray-300 ${
                        pagination.totalPages ===
                        pagination.currentPage
                          ? "bg-indigo-500 text-white"
                          : "bg-white text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {pagination.totalPages}
                    </button>
                  )}

                  <button
                    onClick={() =>
                      fetchBestPractices(pagination.currentPage + 1)
                    }
                    disabled={
                      pagination.currentPage ===
                        pagination.totalPages || isLoading.popular
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
