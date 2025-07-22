import { useState, useEffect, useRef } from "react";
import CompanyCard from "../components/ui/CompanyCard";
import { iconMap } from "../assets/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
// this function is not define in serverapi.tsx so I just commented. 22july 2025
// import {  GetUsersearchProfileDetails, GetValidProfessionalDetails} from "../Common/ServerAPI";
import {  GetUsersearchProfileDetails} from "../Common/ServerAPI";
import { useToast } from "../components/ui/Toast/ToastProvider";
import AnimatedBackground from "../components/ui/AnimatedBackground";

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

export default function DashboardTechnology() {
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search");
  const domain = searchParams.get("domain");
  const { showToast } = useToast();
  // const [Domain, setDomain] = useState([]);
  const [Domain] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState<any>(domain);
  const hasFetched = useRef(false);
  const [searchQuery, setSearchQuery] = useState<any>(search);
  const [sort] = useState<"az" | "za">("az");
  const [companies, setCompanies] = useState<Company[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDomainText, setSelectedDomainText] = useState("All Domains");
  const [textWidth, setTextWidth] = useState(0);
  console.log("🚀 ~ DashboardTechnology ~ textWidth:", textWidth);
  const measureRef = useRef<HTMLSpanElement>(null);
  const navigate = useNavigate();

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
      // this function is not define in serverapi.tsx so I just commented. 22july 2025

      // const res = await GetValidProfessionalDetails();
      // setDomain(res?.data?.data);
      // const foundDomain = res?.data?.data?.find((d: any) => d.slug === domain);
      // if (foundDomain) {
      //   setSelectedDomain(foundDomain.slug);
      // }
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
      {/* <div className="w-full bg-[#f9f7ff] px-4 sm:px-6 py-[34px]">
        <h1 className="text-xl font-bold text-gray-900 mb-4">
          Technology and AI
        </h1>

        <div className="w-full max-w-2xl flex items-center rounded-full bg-white shadow-sm border border-[#CBD5E1] overflow-hidden">
          <div className="relative">
            <select
              className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold px-5 py-2 rounded-l-full appearance-none focus:outline-none cursor-pointer w-[130px]"
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
            >
              <option>Explore</option>
              {Domain.map((domain: any) => (
                <option key={domain.id} value={domain.slug}>
                  {domain.name}
                </option>
              ))}
            </select>
            <div className="absolute top-1/2 right-3 transform -translate-y-1/2 text-white text-xs pointer-events-none">
              ▼
            </div>
          </div>

          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery || ""}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Find & Choose your perfect organization"
              className="w-full px-4 py-2 pr-10 text-sm text-gray-700 placeholder-gray-400 outline-none"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35M9.5 17a7.5 7.5 0 100-15 7.5 7.5 0 000 15z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div> */}

      <section className="relative h-auto md:h-[325px] rounded-[12px] overflow-hidden">
        <AnimatedBackground />
        <img
          src={iconMap["heroimgs"]}
          alt="City Skyline"
          className="absolute bottom-[0px] left-0 w-full object-cover z-0 pointer-events-none"
        />

        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 py-8 md:py-20 max-w-4xl mx-auto">
          <h1 className="text-center font-poppins font-semibold mb-6 text-[32px] leading-[100%] tracking-[0px] bg-gradient-to-b from-[#4E4E4E] to-[#232323] bg-clip-text text-transparent">
            Conscious Search Stops here.
          </h1>

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
                placeholder="Technology and AI"
                className="w-full py-2 bg-transparent text-sm text-gray-700 placeholder:text-gray-400 outline-none border-none h-[29px] px-2"
                value={searchQuery || ""}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#7077FE]">
                🔍
              </button>
            </div>
          </div>

          <p className="text-gray-700 text-sm mt-4 md:mt-6">
            <span
              className="font-medium text-[#F07EFF] underline cursor-pointer"
              onClick={() => navigate("/dashboard/company-profile")}
            >
              List your company now
            </span>{" "}
            and connect with conscious audience
          </p>
        </div>
      </section>

      <div className="w-full max-w-[2100px] mx-auto py-6">
        <main className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-8 items-stretch px-4">
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
              <CompanyCard
                key={company.id}
                {...company}
                routeKey={company.id}
              />
            ))
          )}
        </main>
      </div>

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
    </>
  );
}