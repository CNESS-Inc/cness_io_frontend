import Header from "../layout/Header/Header";
import Footer from "../layout/Footer/Footer";
import { useState, useEffect, useRef } from "react";
import CompanyCard from "../components/ui/CompanyCard";
import { iconMap } from "../assets/icons";
import { Filter, SortAsc, SortDesc, X } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import {
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
}

export default function TechnologyAndAIPage() {
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search");
  const domain = searchParams.get("domain");
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
        itemsPerPage
      );

      if (res?.data) {
        setTotalCount(res.data.data.count);

        const transformedCompanies = res.data.data.rows.map((company: any) => ({
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
        }));

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

  useEffect(() => {
    if (!hasFetched.current) {
      fetchDomain();
      hasFetched.current = true;
    }
    fetchUsersearchProfileDetails(currentPage);
  }, [currentPage]);

  useEffect(() => {
    setCurrentPage(1);
    fetchUsersearchProfileDetails(1);
  }, [searchQuery, sort, selectedDomain]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <Header />

      <div className="w-full bg-[#f9f7ff] px-4 sm:px-6 py-[34px]">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-gray-900">Technology and AI</h1>
          <button
            className="lg:hidden flex items-center gap-2 p-2 rounded-md bg-white shadow-sm border border-gray-200"
            onClick={() => setMobileFiltersOpen(true)}
          >
            <Filter size={16} />
            <span className="text-sm">Filters</span>
          </button>
        </div>

        <div className="relative z-10 text-center max-w-4xl">
          {/* Updated responsive container */}
          <div className="w-full mx-auto bg-white border border-gray-200 rounded-full md:rounded-full flex flex-col md:flex-row items-stretch md:items-center px-3 py-2 shadow-sm gap-2">
            {/* Domain Selector - now full width on mobile */}
            <div className="relative rounded-full">
              <span
                className="invisible rounded-full text-[12px] md:rounded-full absolute whitespace-nowrap font-semibold px-3 md:px-4 md:text-base"
                ref={measureRef}
              >
                {selectedDomainText || "All Domains"}
              </span>

              <select
                className="bg-[#7077FE] py-2 rounded-full text-[12px] md:rounded-full text-white h-full w-full font-semibold px-3 md:px-4 appearance-none focus:outline-none cursor-pointer "
                style={{
                  width: `${textWidth}px`,
                  maxWidth: "100%",
                }}
                value={selectedDomain}
                onChange={(e) => {
                  setSelectedDomain(e.target.value);
                  const selectedText =
                    e.target.options[e.target.selectedIndex].text;
                  setSelectedDomainText(selectedText);
                }}
              >
                <option value="" className="text-white">
                  All Profession
                </option>
                {Domain.map((domain: any) => (
                  <option
                    key={domain.id}
                    value={domain.id}
                    className="text-white"
                  >
                    {domain.title}
                  </option>
                ))}
              </select>
              <div className="absolute top-1.5 right-2 text-white text-xs pointer-events-none hidden sm:block">
                ▼
              </div>
            </div>

            {/* Search Input - full width on mobile */}
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Find & Choose your perfect organization"
                className="w-full py-2 bg-transparent text-sm text-gray-700 placeholder:text-gray-400 outline-none border-none h-[29px] px-2"
                value={searchQuery || ""}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#7077FE]">
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
            <ul className="space-y-8 text-sm text-gray-800">
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
            </ul>
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

      <div className="w-full max-w-[2100px] mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-3">
        {/* Left Sidebar - Desktop */}
        <aside className="hidden lg:block w-64 px-4 py-8 border-r border-gray-100 bg-white">
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-5">Filter</h2>
            <ul className="space-y-8 text-sm text-gray-800">
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
            </ul>
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
        <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-8 items-stretch">
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
              No companies found
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
