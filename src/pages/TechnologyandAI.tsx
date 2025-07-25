import Header from "../layout/Header/Header";
import Footer from "../layout/Footer/Footer";
import { useState, useEffect, useRef } from "react";
import CompanyCard from "../components/ui/CompanyCard";
import { iconMap } from "../assets/icons";
import { Filter, SortAsc, SortDesc, X } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import {
  GetBadgeListDetails,
  GetProfessionalDetails,
  GetUsersearchProfileDetails,
} from "../Common/ServerAPI";
import { useToast } from "../components/ui/Toast/ToastProvider";

interface Company {
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
  certificationLevel?: string;
}

export default function TechnologyAndAIPage() {
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search");
  const domain = searchParams.get("profession");
  const { showToast } = useToast();
  const [Domain, setDomain] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState<any>(domain);
  const hasFetched = useRef(false);
  const [searchQuery, setSearchQuery] = useState<any>(search);
  const [sort, setSort] = useState<"az" | "za">("az");
  const [companies, setCompanies] = useState<Company[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const [selectedDomainText, setSelectedDomainText] = useState("All Domains");
  const [textWidth, setTextWidth] = useState(0);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [certificationLevels, setCertificationLevels] = useState<any[]>([]);
  const [selectedCertificationLevel, setSelectedCertificationLevel] =
    useState<string>("");
  console.log(
    "🚀 ~ TechnologyAndAIPage ~ selectedCertificationLevel:",
    selectedCertificationLevel
  );

  useEffect(() => {
    if (measureRef.current) {
      setTextWidth(measureRef.current.offsetWidth);
    }
  }, [selectedDomainText]);

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
        selectedCertificationLevel,
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
            rating: company.average,
            isCertified: Math.random() > 0.5,
            is_organization: company?.is_organization,
            is_person: company?.is_person,
            level: company?.level?.level,
          }))
          .sort((a: Company, b: Company) => {
            if (sort === "az") return a.name.localeCompare(b.name);
            if (sort === "za") return b.name.localeCompare(a.name);
            return 0;
          });
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
      const res = await GetProfessionalDetails();
      setDomain(res?.data?.data);
      const foundDomain = res?.data?.data?.find((d: any) => d.slug === domain);
      if (foundDomain) {
        setSelectedDomain(foundDomain.slug);
      }
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
      // Transform the badge data to have label and value properties
      const transformedBadges = res?.data?.data.map((badge: any) => ({
        label: badge.level,
        value: badge.slug,
      }));
      setCertificationLevels(transformedBadges);
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
  }, [sort, selectedDomain, selectedCertificationLevel]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearch = () => {
    if (selectedDomain || searchQuery) {
      fetchUsersearchProfileDetails(1);
    }
  };
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <>
      <Header />

      <div className="w-full bg-[#f9f7ff] px-4 sm:px-6 py-[34px]">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-gray-900">Technology and AI</h1>
          <button
            className="lg:hidden flex items-center gap-2 rounded-full shadow-sm border border-gray-200 bg-[#7077FE] text-white h-full font-semibold px-3 md:px-4 py-2 appearance-none focus:outline-none cursor-pointer text-[12px]"
            onClick={() => setMobileFiltersOpen(true)}
          >
            <Filter size={16} />
            <span className="text-sm">Filters</span>
          </button>
        </div>

        <div className="relative z-10 text-center max-w-4xl">
          {/* Updated responsive container */}
          <div className="w-full mx-auto flex flex-col md:flex-row items-stretch md:items-center h-[34px] gap-2">
            {/* Domain Selector - now full width on mobile */}
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
                {selectedDomainText || "All Domains"}
              </span>

              <select
                className="bg-[#7077FE] rounded-full text-white h-full font-semibold px-3 md:px-4 py-2 appearance-none focus:outline-none cursor-pointer text-[12px]"
                style={{
                  width: `${textWidth}px`, // Adjusted padding
                  maxWidth: "100%",
                  minWidth: "120px",
                }}
                value={selectedDomain}
                onChange={(e) => {
                  setSelectedDomain(e.target.value);
                  const selectedText =
                    e.target.options[e.target.selectedIndex].text;
                  setSelectedDomainText(selectedText);
                }}
              >
                <option value="" className="text-white text-[12px]">
                  All Profession
                </option>
                {Domain.map((domain: any) => (
                  <option
                    key={domain.id}
                    value={domain.id}
                    className="text-white text-[12px]"
                  >
                    {domain.title}
                  </option>
                ))}
              </select>
              <div className="absolute top-1/2 right-3 transform -translate-y-1/2 text-white text-[10px] pointer-events-none">
                ▼
              </div>
            </div>

            {/* Search Input - full width on mobile */}
            <div className="relative flex-grow bg-white border border-gray-200 rounded-full md:rounded-full px-3 h-[100%] shadow-sm">
              <input
                type="text"
                placeholder="Find & Choose your perfect organization"
                className="w-full py-2 bg-transparent text-sm text-gray-700 placeholder:text-gray-400 outline-none border-none h-[29px] px-2"
                value={searchQuery || ""}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyPress}
              />
              <button
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#7077FE] cursor-pointer"
                onClick={handleSearch}
              >
                🔍
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile filters dialog */}
      <div
        className={`fixed inset-0 z-40 lg:hidden ${
          mobileFiltersOpen ? "block" : "hidden"
        }`}
      >
        <div className="fixed inset-0 bg-black bg-opacity-25" />
        <div className="fixed inset-y-0 left-0 z-40 w-full max-w-xs overflow-y-auto bg-white px-4 py-4 sm:max-w-sm sm:px-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Filters</h2>
            <button
              type="button"
              className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md p-2 text-gray-400 hover:text-gray-500"
              onClick={() => setMobileFiltersOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="mt-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-5">Filter</h3>
            <div className="mb-6">
              <h4 className="text-xs font-medium text-gray-500 mb-2">
                Certification Level
              </h4>
              <ul className="space-y-2 text-sm text-gray-800">
                {certificationLevels.map((level) => (
                  <li
                    key={level.value}
                    className={`flex items-center gap-2 cursor-pointer p-2 rounded ${
                      selectedCertificationLevel === level.value
                        ? "bg-[#7077FE] text-white"
                        : ""
                    }`}
                    onClick={() => {
                      setSelectedCertificationLevel(level.value);
                      setMobileFiltersOpen(false);
                    }}
                  >
                    {level.label}
                  </li>
                ))}
              </ul>
            </div>
            {/* <ul className="space-y-8 text-sm text-gray-800">
              <li className="flex items-center gap-2 cursor-pointer">
                <Filter size={16} /> Certification Level
              </li>
              <li className="flex items-center gap-2 cursor-pointer">
                <Filter size={16} /> Industry
              </li>
              <li className="flex items-center gap-2 cursor-pointer">
                <Filter size={16} /> Geographic Location
              </li>
              <li className="flex items-center gap-2 cursor-pointer">
                <Filter size={16} /> Tags
              </li>
            </ul> */}
          </div>

          <div className="mt-8">
            <h3 className="text-sm font-semibold text-gray-900 mb-5">Sort</h3>
            <ul className="space-y-7 text-sm text-gray-700">
              <li
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => {
                  setSort("az");
                  setMobileFiltersOpen(false);
                }}
              >
                <SortAsc size={16} /> Sort A-Z
              </li>
              <li
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => {
                  setSort("za");
                  setMobileFiltersOpen(false);
                }}
              >
                <SortDesc size={16} /> Sort Z-A
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="w-full max-w-[2100px] mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-3">
        {/* Left Sidebar - Desktop */}
        <aside className="hidden lg:block w-[200px] px-4 py-8 border-r border-gray-100 bg-white">
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-5">Filter</h2>
            <div className="mb-6">
              <h4 className="text-xs font-medium text-gray-500 mb-2">
                Certification Level
              </h4>
              <ul className="space-y-2 text-sm text-gray-800">
                {certificationLevels.map((level) => (
                  <li
                    key={level.value}
                    className={`flex items-center gap-2 cursor-pointer p-2 rounded ${
                      selectedCertificationLevel === level.value
                        ? "bg-[#7077FE] text-white"
                        : ""
                    }`}
                    onClick={() => setSelectedCertificationLevel(level.value)}
                  >
                    {level.label}
                  </li>
                ))}
              </ul>
            </div>
            {/* <ul className="space-y-8 text-sm text-gray-800">
              <li className="flex items-center gap-2 cursor-pointer">
                <Filter size={16} /> Certification Level
              </li>
              <li className="flex items-center gap-2 cursor-pointer">
                <Filter size={16} /> Industry
              </li>
              <li className="flex items-center gap-2 cursor-pointer">
                <Filter size={16} /> Geographic Location
              </li>
              <li className="flex items-center gap-2 cursor-pointer">
                <Filter size={16} /> Tags
              </li>
            </ul> */}
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-5">Sort</h3>
            <ul className="space-y-7 text-sm text-gray-700">
              <li
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => setSort("az")}
              >
                <SortAsc size={16} /> Sort A-Z
              </li>
              <li
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => setSort("za")}
              >
                <SortDesc size={16} /> Sort Z-A
              </li>
            </ul>
          </div>
        </aside>

        {/* Right Content (Company Grid) */}
        <main className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
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
              <CompanyCard key={company.id} {...company} />
            ))
          )}
        </main>
      </div>

      {/* Pagination */}
      {!isLoading && !error && totalCount > 0 && (
        <div className="mt-8 mb-12">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-1 flex justify-center">
            <nav
              className="inline-flex rounded-md shadow-sm -space-x-px text-sm"
              aria-label="Pagination"
            >
              <button
                onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 rounded-l-md bg-white border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-40"
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
                    className={`px-4 py-2 border border-gray-300 ${
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
                <span className="px-4 py-2 border border-gray-300 bg-white">
                  ...
                </span>
              )}

              {totalPages > 5 && currentPage < totalPages - 2 && (
                <button
                  onClick={() => handlePageChange(totalPages)}
                  className="px-4 py-2 border border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
                >
                  {totalPages}
                </button>
              )}

              <button
                onClick={() =>
                  handlePageChange(Math.min(currentPage + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-2 rounded-r-md bg-white border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-40"
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
      <Footer />
    </>
  );
}
