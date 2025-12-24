import { useState, useEffect, useRef } from "react";
import CompanyCard from "../components/ui/CompanyCard";
import { iconMap } from "../assets/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  GetBadgeListDetails,
  GetUsersearchProfileDetails,
  GetValidProfessionalDetails,
} from "../Common/ServerAPI";
import { useToast } from "../components/ui/Toast/ToastProvider";
import { CiSearch } from "react-icons/ci";
import {
  Award,
  ChevronUp,
  ChevronDown,
  SortAsc,
  SortDesc,
  X,
  Search,
} from "lucide-react";
import { useClickOutside } from "../hooks/useClickOutside";

interface Company {
  logo: string;
  banner: string;
  interests: unknown;
  professions: unknown;
  id: string;
  name: string;
  domain: string;
  logoUrl: string;
  bannerUrl: string;
  location: string;
  description: string;
  tags: string[];
  rating?: number;
  isCertified?: boolean;
  level?: string;
  is_organization?: boolean;
  is_person?: boolean;
}

interface Profession {
  id: string;
  title: string;
  slug?: string;
}

interface Badge {
  id: string;
  slug: string;
  level: string;
}

type SelectedFilter = {
  id: string | number;
  type: "profession";
} | null;

export default function DashboardTechnology() {
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search");
  const urlDomain = searchParams.get("profession");
  const certification = searchParams.get("certification"); // Get certification from URL
  const { showToast } = useToast();

  // Professions (formerly Domain) typed properly
  const [professions, setProfessions] = useState<Profession[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);

  // selectedDomain holds the profession id (string)
  const [selectedDomain, setSelectedDomain] = useState<string>(urlDomain || "");

  const hasFetched = useRef(false);
  const [searchQuery, setSearchQuery] = useState<string>(search || "");
  const [sort, setSort] = useState<"az" | "za">("az");
  const [companies, setCompanies] = useState<Company[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useClickOutside(() => {
      setIsDropdownOpen(false);
    });

      const filteredProfessions = professions.filter((prof) =>
        prof.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    
      const [selectedFilter, setSelectedFilter] = useState<SelectedFilter>(null);

  // Friendly label shown in the UI for the selected profession
  const defaultProfessionText = "All Profession";
  const initialSelectedDomainText =
    urlDomain && professions.find((p) => p.id === urlDomain)
      ? professions.find((p) => p.id === urlDomain)!.title
      : defaultProfessionText;

  const [selectedDomainText, setSelectedDomainText] = useState<string>(
    initialSelectedDomainText
  );

  const [open, setOpen] = useState<"cert" | "sort" | null>(null);
  const [selectedCert, setSelectedCert] = useState<string>(
    certification || ""
  );

  const navigate = useNavigate();

  useEffect(() => {
    // When the URL certification param changes, reflect it in state
    if (certification) {
      setSelectedCert(certification);
    } else {
      // If certification param removed, clear selection
      setSelectedCert("");
    }
  }, [certification]);

  useEffect(() => {
    // When the URL profession param or fetched professions change, update the label
    if (urlDomain && professions.length > 0) {
      const found = professions.find((p) => p.id === urlDomain);
      if (found) {
        setSelectedDomainText(found.title);
        setSelectedDomain(urlDomain);
        setSelectedFilter({
          id: found.id,
          type: "profession"
        });
      } else {
        setSelectedDomainText(defaultProfessionText);
      }
    }
  }, [urlDomain, professions]);


  useEffect(() => {
    if (urlDomain) {
      const foundProfession = professions.find((p) => p.id === urlDomain);
      if (foundProfession) {
        setSelectedFilter({
          id: foundProfession.id,
          type: "profession"
        });
        setSelectedDomain(foundProfession.id);
        setSelectedDomainText(foundProfession.title);
      }
    } else {
      // Clear filter if no profession in URL
      setSelectedFilter(null);
      setSelectedDomain("");
      setSelectedDomainText(defaultProfessionText);
    }
  }, [urlDomain, professions]);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const fetchUsersearchProfileDetails = async (page: number = 1) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await GetUsersearchProfileDetails(
        selectedDomain,
        searchQuery,
        page,
        itemsPerPage,
        selectedCert,
        sort
      );
      if (res?.data) {
        setTotalCount(res.data.data.count);

        const transformedCompanies = res.data.data.rows
          .map((company: any) => ({
            id: company.id,
            name: company.name,
            domain: selectedDomain || "Technology and AI",
            logoUrl: company.profile_picture || iconMap["comlogo"],
            bannerUrl: company.profile_banner || iconMap["companycard1"],
            location: company.location || "Unknown location",
            description: company.bio || "No description available",
            tags: company.tags || [],
            rating: company?.average,
            isCertified: Math.random() > 0.5,
            is_organization: company?.is_organization,
            is_person: company?.is_person,
            level: company?.level?.level,
            professions: company?.professions,
            interests: company?.interests,
          }))
          .sort((a: Company, b: Company) => {
            if (sort === "az") return a.name.localeCompare(b.name);
            if (sort === "za") return b.name.localeCompare(a.name);
            return 0;
          });
        console.log(
          "🚀 ~ fetchUsersearchProfileDetails ~ transformedCompanies:",
          transformedCompanies
        );
        setCompanies(transformedCompanies);
      } else {
        setCompanies([]);
        setTotalCount(0);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to fetch companies");
      console.error("Error fetching companies:", err);
      showToast({
        message: err?.response?.data?.error?.message || "Failed to fetch data",
        type: "error",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDomain = async () => {
    try {
      const res = await GetValidProfessionalDetails();
      // Defensive: ensure array
      const data = Array.isArray(res?.data?.data) ? res.data.data : [];
      setProfessions(data);
    } catch (error: any) {
      showToast({
        message: error?.response?.data?.error?.message || "Failed to fetch professions",
        type: "error",
        duration: 5000,
      });
    }
  };

  const fetchBadge = async () => {
    try {
      const res = await GetBadgeListDetails();
      const data = Array.isArray(res?.data?.data) ? res.data.data : [];
      setBadges(data);
    } catch (error: any) {
      showToast({
        message: error?.response?.data?.error?.message || "Failed to fetch badges",
        type: "error",
        duration: 5000,
      });
    }
  };

  useEffect(() => {
    if (!hasFetched.current) {
      fetchDomain();
      fetchBadge();
      hasFetched.current = true;
    }
    // Always fetch search results for the current page (first load and page changes)
    fetchUsersearchProfileDetails(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  useEffect(() => {
    // whenever filters/sort change, reset to page 1 and fetch
    setCurrentPage(1);
    fetchUsersearchProfileDetails(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sort, selectedDomain, selectedCert]);

  // Update URL when filters change to include certification
   const updateURL = (
    domainValue: string,
    searchValue: string,
    certValue: string
  ) => {
    const params = new URLSearchParams();

    if (domainValue) params.set("profession", domainValue);
    if (searchValue) params.set("search", searchValue);
    if (certValue) params.set("certification", certValue);

    navigate(`?${params.toString()}`);
  };

  const handleSearch = () => {
    if (selectedDomain || searchQuery) {
      updateURL(selectedDomain, searchQuery, selectedCert);
      fetchUsersearchProfileDetails(1);
    } else {
      // even if nothing selected, clear query params and fetch
      updateURL("", "", selectedCert);
      fetchUsersearchProfileDetails(1);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Update certification selection handler to also update URL
  const handleCertChange = (certSlug: string) => {
    setSelectedCert(certSlug);
    setOpen(null);
    updateURL(selectedDomain, searchQuery, certSlug);
  };

  // Update domain selection handler to also update URL
  const handleDomainChange = (domainValue: string) => {
    const profession = professions.find((p) => p.id === domainValue);
    
    if (profession) {
      setSelectedFilter({
        id: profession.id,
        type: "profession"
      });
      setSelectedDomain(profession.id);
      setSelectedDomainText(profession.title);
      updateURL(profession.id, searchQuery, selectedCert);
    } else {
      // Clear filter if "All Profession" selected
      setSelectedFilter(null);
      setSelectedDomain("");
      setSelectedDomainText(defaultProfessionText);
      updateURL("", searchQuery, selectedCert);
    }
  };


  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const hasActiveFilters =
    Boolean(selectedDomain) || Boolean(searchQuery) || Boolean(selectedCert) || sort !== "az";

  const handleClearFilters = () => {
    setSelectedDomain("");
    setSelectedDomainText(defaultProfessionText);
    setSearchQuery("");
    setSelectedCert("");
    setSort("az");
    setCurrentPage(1);

    // Clear URL parameters
    navigate("?");

    // Fetch data with cleared filters
    fetchUsersearchProfileDetails(1);
  };

   const clearFilter = () => {
    setSelectedFilter(null);
    setSelectedDomain("");
    setSelectedDomainText(defaultProfessionText);
    setIsDropdownOpen(false);
    
    // Update URL
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (selectedCert) params.set("certification", selectedCert);
    navigate(`?${params.toString()}`);
    
    // Fetch data with cleared filters
    fetchUsersearchProfileDetails(1);
  };

  return (
    <>
      <section className="relative max-w-full h-[350px] sm:h-[400px] md:h-[500px] mx-auto rounded-xl mt-2 flex items-center justify-center">
        {/* Background Image Full Fit */}
        <img
          src="https://cdn.cness.io/Directory.svg"
          alt="City Skyline"
          className="absolute w-full h-full object-cover z-0 pointer-events-none"
        />

        {/* CENTER CONTENT - DO NOT TOUCH INSIDE */}
        <div className="relative z-10 max-w-7xl pb-10 text-center flex-col items-center justify-center">
          <h1
            className="text-center font-[poppins] font-semibold mb-6 
      text-[32px] leading-[1.3] bg-linear-to-b from-[#4E4E4E] to-[#232323] 
      bg-clip-text text-transparent"
          >
            Search for Individuals and Services
          </h1>

          {/* Search Bar Wrapper */}
          <div className="w-full flex justify-center mb-4">
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
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
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
                      <span className="text-xs">{selectedDomainText !== "All Domains" &&
                        selectedDomainText !== ""
                          ? selectedDomainText
                          : "Professions"}</span>
                      <ChevronDown
                        className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-200 ${
                          isDropdownOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isDropdownOpen && (
                      <div
                        className="
                          fixed inset-x-0 top-0 bottom-0
                          sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:mt-2
                          w-full sm:w-80
                          bg-white border border-gray-200 rounded-lg shadow-lg
                          z-9999
                          sm:max-h-96 max-h-full
                          overflow-hidden
                        "
                      >
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
        !selectedFilter ? "bg-blue-50 text-[#7077FE] font-medium" : ""
      }`}
      onClick={() => {
        clearFilter();
        setIsDropdownOpen(false);
      }}
    >
      All Profession
    </button>
  </div>

                          {filteredProfessions.map((prof) => (
    <button
      key={`p-${prof.id}`}
      className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 ${
        selectedFilter?.id === prof.id && selectedFilter?.type === "profession"
          ? "bg-blue-50 text-[#7077FE] font-medium"
          : ""
      }`}
      onClick={() => {
        handleDomainChange(prof.id);
        setIsDropdownOpen(false);
      }}
    >
      {prof.title}
    </button>
  ))}
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

          <p className="text-xs text-[#6340FF] font-semibold md:text-sm ">
Showcase your professional services and connect with like-minded individuals.
          </p>
        </div>
      </section>

      <div className="container mx-auto py-6 px-1">
        {/* Combined Search Results and Filters Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex-1">
            <h4 className="poppins font-medium text-lg leading-[150%] tracking-normal">
              Search results for
              {(selectedDomainText !== "All Profession" ||
                searchQuery ||
                selectedCert) && (
                <span className="poppins ml-1 text-[#7077FE] font-medium text-lg leading-[150%] tracking-normal">
                  "
                  {selectedDomainText !== "All Profession" &&
                    selectedDomainText}
                  {selectedDomainText !== "All Profession" &&
                    (searchQuery || selectedCert) &&
                    " "}
                  {searchQuery}
                  {searchQuery && selectedCert && " "}
                  {selectedCert &&
                    badges.find((b) => b.slug === selectedCert)?.level}
                  "
                </span>
              )}
            </h4>
          </div>

          {/* Filters moved here - horizontal layout */}
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto items-center">
            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 hover:text-gray-700 transition-colors"
              >
                <X size={16} />
                Clear Filters
              </button>
            )}
            {/* Certification Filter - Dropdown */}
            <div className="relative">
              <div
                className="flex items-center justify-between cursor-pointer bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm"
                onClick={() => setOpen(open === "cert" ? null : "cert")}
              >
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-purple-500" />
                  <span className="font-medium text-sm">
                    {badges.find((b) => b.slug === selectedCert)?.level ||
                      "Certification Level"}
                  </span>
                </div>
                {open === "cert" ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
              {open === "cert" && (
                <div className="absolute z-10 mt-1 w-auto bg-white border border-gray-200 rounded-lg shadow-lg p-2">
                  {badges.map((item) => (
                    <label
                      key={item.id}
                      className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-50 rounded"
                    >
                      <input
                        type="radio"
                        name="cert"
                        value={item.slug}
                        checked={selectedCert === item.slug}
                        onChange={() => handleCertChange(item.slug)}
                        className="accent-[#897AFF]"
                      />
                      <span
                        className={`text-sm ${
                          selectedCert === item.slug ? "text-[#9747FF] font-medium" : "text-gray-600"
                        }`}
                      >
                        {item.level}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Sort Options - Dropdown */}
            <div className="relative">
              <div
                className="flex items-center justify-between cursor-pointer bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm"
                onClick={() => setOpen(open === "sort" ? null : "sort")}
              >
                <div className="flex items-center gap-2">
                  {sort === "az" && <SortAsc size={16} />}
                  {sort === "za" && <SortDesc size={16} />}
                  <span className="font-medium text-sm">{sort === "az" ? "A-Z" : "Z-A"}</span>
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
            </div>
          </div>
        </div>

        {/* Rest of the component remains the same */}
        <div className="w-full max-w-[2100px] mx-auto py-6">
          <main className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-x-4 gap-y-4">
            {isLoading ? (
              <div className="col-span-full flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : error ? (
              <div className="col-span-full text-center py-10 text-red-500">{error}</div>
            ) : companies.length === 0 ? (
              <div className="col-span-full text-center py-10 text-gray-500">No people found</div>
            ) : (
              companies.map((company) => (
                <CompanyCard
                  key={company.id}
                  id={company.id}
                  name={company.name}
                  domain={company.domain}
                  logoUrl={company.logoUrl}
                  bannerUrl={company.bannerUrl}
                  location={company.location}
                  description={company.description}
                  tags={company.tags}
                  rating={company.rating}
                  isCertified={company.isCertified}
                  is_organization={company.is_organization}
                  is_person={company.is_person}
                  routeKey={company.id}
                  level={company.level}
                  interest={company.interests}
                  profession={company.professions}
                />
              ))
            )}
          </main>
        </div>

        {/* Pagination remains the same */}
        {!isLoading && !error && totalCount > 0 && (
          <div className="mt-8 mb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-1 flex justify-center">
              <nav className="inline-flex rounded-md shadow-sm -space-x-px text-sm" aria-label="Pagination">
                <button
                  onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-l-md bg-white border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-40"
                >
                  «
                </button>

                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-1 border border-gray-300 ${
                        pageNum === currentPage ? "bg-indigo-500 text-white" : "bg-white text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                {totalPages > 5 && currentPage < totalPages - 2 && <span className="px-3 py-1 border border-gray-300 bg-white">...</span>}

                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    className="px-3 py-1 border border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
                  >
                    {totalPages}
                  </button>
                )}

                <button
                  onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded-r-md bg-white border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-40"
                >
                  »
                </button>
              </nav>
            </div>
            <div className="text-center mt-2 text-sm text-gray-500">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} companies
            </div>
          </div>
        )}
      </div>
    </>
  );
}
