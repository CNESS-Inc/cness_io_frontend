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
import AnimatedBackground from "../components/ui/AnimatedBackground";
import {
  Award,
  ChevronUp,
  ChevronDown,
  SortAsc,
  SortDesc,
  X,
} from "lucide-react";

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

export default function DashboardTechnology() {
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search");
  const domain = searchParams.get("profession");
  const certification = searchParams.get("certification"); // Get certification from URL
  const { showToast } = useToast();
  const [Domain, setDomain] = useState<any>([]);
  const [badge, setBadge] = useState<any>([]);
  const [selectedDomain, setSelectedDomain] = useState<any>(domain);

  const hasFetched = useRef(false);
  const [searchQuery, setSearchQuery] = useState<any>(search);
  const [sort, setSort] = useState<"az" | "za">("az");
  const [companies, setCompanies] = useState<Company[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDomainText, setSelectedDomainText] = useState(
    domain
      ? Domain.find((d: any) => d.id === domain)?.title || "All Profession"
      : "All Profession"
  );
  const [textWidth, setTextWidth] = useState(0);
  const [open, setOpen] = useState<"cert" | "sort" | null>(null);
  const [selectedCert, setSelectedCert] = useState<string>(certification || ""); // Initialize with URL parameter
  const measureRef = useRef<HTMLSpanElement>(null);
  const navigate = useNavigate();

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
  }, []);

  // Update selected certification when URL parameter changes
  useEffect(() => {
    if (certification) {
      setSelectedCert(certification);
    }
  }, [certification]);

  useEffect(() => {
    if (domain && Domain.length > 0) {
      const foundDomain = Domain.find((d: any) => d.id === domain);
      if (foundDomain) {
        setSelectedDomainText(foundDomain.title);
      }
    }
  }, [domain, Domain]);

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
        console.log("🚀 ~ fetchUsersearchProfileDetails ~ transformedCompanies:", transformedCompanies)
        setCompanies(transformedCompanies);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch companies");
      console.error("Error fetching companies:", err);
      showToast({
        message: err?.response?.data?.error?.message,
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
      setDomain(res?.data?.data);
    } catch (error: any) {
      showToast({
        message: error?.response?.data?.error?.message,
        type: "error",
        duration: 5000,
      });
    }
  };

  const fetchBadge = async () => {
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
    if (!hasFetched.current) {
      fetchDomain();
      fetchBadge();
      hasFetched.current = true;
    }
    fetchUsersearchProfileDetails(currentPage);
  }, [currentPage]);

  useEffect(() => {
    setCurrentPage(1);
    fetchUsersearchProfileDetails(1);
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
    setSelectedDomain(domainValue);
    const selectedText =
      Domain.find((d: any) => d.id === domainValue)?.title || "All Profession";
    setSelectedDomainText(selectedText);
    updateURL(domainValue, searchQuery, selectedCert);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const hasActiveFilters =
    selectedDomain || searchQuery || selectedCert || sort !== "az";

  const handleClearFilters = () => {
    setSelectedDomain("");
    setSelectedDomainText("All Profession");
    setSearchQuery("");
    setSelectedCert("");
    setSort("az");
    setCurrentPage(1);

    // Clear URL parameters
    navigate("?");

    // Fetch data with cleared filters
    fetchUsersearchProfileDetails(1);
  };
  

  return (
    <>
      <section className="relative h-auto md:h-[325px] rounded-xl overflow-hidden">
        <AnimatedBackground />
        <img
          src={iconMap["heroimgs"]}
          alt="City Skyline"
          className="absolute bottom-0 left-0 w-full object-cover z-0 pointer-events-none"
        />

        <div className="relative z-30 max-w-5xl px-6 flex flex-col items-center justify-center text-center">
                    <h1
                      className="text-center font-[poppins] font-semibold mb-6
                          text-[26px] sm:text-[32px] md:text-[36px] leading-[1.15]
                          bg-clip-text text-transparent"
                      style={{
                        backgroundImage: "linear-gradient(#111827, #111827)",
                      }}
                    >
                      Connect with professionals and
                      <br />
                      like-minded individuals.
                    </h1>
        
                    {/* Search Bar Wrapper */}
                    <div className="w-full flex justify-center mb-4">
                      <div
                        className="w-full bg-white rounded-full shadow-[0_10px_30px_rgba(112,119,254,0.12)]
                               flex items-center pl-4 pr-1 h-10 sm:h-10 max-w-[780px]"
                        role="search"
                        aria-label="Search best practice"
                      >
                        <span className="text-[#7077FE] mr-3 text-lg">
                          <CiSearch />
                        </span>
        
                        <input
                          type="text"
                          aria-label="Search"
                          placeholder="Search Best Practice"
                          className="flex-1 bg-transparent text-sm text-gray-700 placeholder:text-gray-400 outline-none py-2"
                          value={searchQuery || ""}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onKeyDown={handleKeyPress}
                        />
        
                        {/* Dropdown */}
                        <div className="relative shrink-0 ml-3">
                          <select
                            className="bg-[#6340FF] text-white font-semibold rounded-full h-10 sm:h-10 px-4 pr-8 text-sm appearance-none
                                       focus:outline-none cursor-pointer shadow-[0_10px_30px_rgba(112,119,254,0.35)]"
                            value={selectedDomain}
                            onChange={(e) => {
                              setSelectedDomain(e.target.value);
                              const selectedText = e.target.options[e.target.selectedIndex].text;
                              setSelectedDomainText(selectedText);
                            }}
                            aria-label="Select profession"
                          >
                            <option value="">{selectedDomainText || "Professions"}</option>
                            {Domain.map((domain) => (
                              <option key={domain.id} value={domain.id}>
                                {domain.title}
                              </option>
                            ))}
                          </select>
        
                          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white text-xs select-none">
                            ▼
                          </div>
                        </div>
                      </div>
                    </div>
        
                    <p className="text-xs text-[#6340FF] font-[600] md:text-sm">Connect with conscious audience</p>
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
                    badge.find((b: any) => b.slug === selectedCert)?.level}
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
                    {badge.find((b: any) => b.slug === selectedCert)?.level ||
                      "Certification Level"}
                  </span>
                </div>
                {open === "cert" ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
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
                        onChange={() => handleCertChange(item.slug)}
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

            {/* Sort Options - Dropdown */}
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
                {open === "sort" ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
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
              <div className="col-span-full text-center py-10 text-red-500">
                {error}
              </div>
            ) : companies.length === 0 ? (
              <div className="col-span-full text-center py-10 text-gray-500">
                No people found
              </div>
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
              <nav
                className="inline-flex rounded-md shadow-sm -space-x-px text-sm"
                aria-label="Pagination"
              >
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
                        pageNum === currentPage
                          ? "bg-indigo-500 text-white"
                          : "bg-white text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <span className="px-3 py-1 border border-gray-300 bg-white">
                    ...
                  </span>
                )}

                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    className="px-3 py-1 border border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
                  >
                    {totalPages}
                  </button>
                )}

                <button
                  onClick={() =>
                    handlePageChange(Math.min(currentPage + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded-r-md bg-white border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-40"
                >
                  »
                </button>
              </nav>
            </div>
            <div className="text-center mt-2 text-sm text-gray-500">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount}{" "}
              companies
            </div>
          </div>
        )}
      </div>
    </>
  );
}
