import { useEffect, useRef, useState } from "react";
import CompanyCard from "../components/ui/CompanyCard";
//import { Filter } from "lucide-react";
import { CiSearch } from "react-icons/ci";

import { iconMap } from "../assets/icons";
import {
  GetAspiringCompanies,
  GetBadgeListDetails,
  GetInspiringCompanies,
  GetPopularCompanyDetails,
  GetPublicDetails,
  GetValidProfessionalDetails,
} from "../Common/ServerAPI";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/ui/Toast/ToastProvider";
import CompanyFilters from "../components/directory/CompanyFilters";
import Pagination from "../components/directory/CompanyPagination";
import { ChevronDown, Search, X } from "lucide-react";
import { useClickOutside } from "../hooks/useClickOutside";

type Company = {
  interests: any;
  professions: any;
  level: unknown;
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

type SelectedFilter = {
  id: string | number;
  type: "profession";
} | null;
export default function DashboardDirectory() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [selectedDomain, setSelectedDomain] = useState("");
  const [searchQuery, setSearchQuery] = useState<any>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useClickOutside(() => {
    setIsDropdownOpen(false);
  });
  const [, setSelectedDomainText] = useState("");
  const [, setTextWidth] = useState(0);
  const [Domain, setDomain] = useState<
    Array<{ id: string | number; title: string }>
  >([]);
  const [badge, setBadge] = useState<any>([]);
  const measureRef = useRef<HTMLSpanElement>(null);
  const hasFetched = useRef(false);
  const [, setIsMobile] = useState(false);

  type Filter = "" | "popular" | "aspiring" | "inspired";
  const [selected, setSelected] = useState<Filter>(""); // All
  const [order, setOrder] = useState<"asc" | "desc">("asc");

  const [isLoading, setIsLoading] = useState({
    public: false,
    popular: false,
    aspiring: false,
    inspiring: false,
  });

  // Pagination states
  const [popularPagination, setPopularPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });

  const [aspiringPagination, setAspiringPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });

  const [inspiringPagination, setInspiringPagination] =
    useState<PaginationData>({
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      itemsPerPage: 10,
    });

  const [popularCompanies, setPopularCompanies] = useState<Company[]>([]);
  const [aspiringCompanies, setAspiringCompanies] = useState<Company[]>([]);
  const [inspiringCompanies, setInspiringCompanies] = useState<Company[]>([]);

  const filteredProfessions = Domain.filter((prof) =>
    prof.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [selectedFilter, setSelectedFilter] = useState<SelectedFilter>(null);

  // Check for mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
  }, []); // run once

  const fetchDomain = async () => {
    try {
      const res = await GetValidProfessionalDetails();
      setDomain(res?.data?.data);
    } catch (error: any) {
      console.error("Error fetching domains:", error);
      showToast({
        message: error?.response?.data?.error?.message,
        type: "error",
        duration: 5000,
      });
    }
  };

  const fetchPublicCompany = async (page: number = 1) => {
    setIsLoading((prev) => ({ ...prev, popular: true }));
    try {
      const res = await GetPublicDetails(page, popularPagination.itemsPerPage);
      console.log("🚀 ~ fetchPopularCompany ~ res:", res);

      if (res?.data?.data) {
        const transformedCompanies = res.data.data.rows.map((company: any) => {
          return {
            id: company.id,
            name: company.name,
            location: company.location || "",
            domain: company.domain || "General",
            category: "Popular",
            logo: company.profile_picture || iconMap["companylogo1"],
            banner: company.profile_banner || iconMap["companycard1"],
            description: company.bio || "No description available",
            tags: company.tags || [],
            rating: company.average,
            isCertified: company.is_certified || true,
            is_person: company.is_person,
            is_organization: company.is_organization,
            level: company?.level?.level,
            professions: company?.professions,
            interests: company?.interests,
          };
        });

        setPopularCompanies(transformedCompanies);

        setPopularPagination((prev) => ({
          ...prev,
          currentPage: page,
          totalPages: Math.ceil(res.data.data.count / prev.itemsPerPage),
          totalItems: res.data.data.count,
        }));
      }
    } catch (error: any) {
      console.error("Error fetching popular companies:", error);
      showToast({
        message: error?.response?.data?.error?.message,
        type: "error",
        duration: 5000,
      });
    } finally {
      setIsLoading((prev) => ({ ...prev, popular: false }));
    }
  };
  const fetchPopularCompany = async (page: number = 1) => {
    setIsLoading((prev) => ({ ...prev, popular: true }));
    try {
      const res = await GetPopularCompanyDetails(
        page,
        popularPagination.itemsPerPage
      );
      console.log("🚀 ~ fetchPopularCompany ~ res:", res);

      if (res?.data?.data) {
        const transformedCompanies = res.data.data.rows.map((company: any) => {
          return {
            id: company.id,
            name: company.name,
            location: company.location || "",
            domain: company.domain || "General",
            category: "Popular",
            logo: company.profile_picture || iconMap["companylogo1"],
            banner: company.profile_banner || iconMap["companycard1"],
            description: company.bio || "No description available",
            tags: company.tags || [],
            rating: company.average,
            isCertified: company.is_certified || true,
            is_person: company.is_person,
            is_organization: company.is_organization,
            level: company?.level?.level,
            professions: company?.professions,
            interests: company?.interests,
          };
        });

        setPopularCompanies(transformedCompanies);

        setPopularPagination((prev) => ({
          ...prev,
          currentPage: page,
          totalPages: Math.ceil(res.data.data.count / prev.itemsPerPage),
          totalItems: res.data.data.count,
        }));
      }
    } catch (error: any) {
      console.error("Error fetching popular companies:", error);
      showToast({
        message: error?.response?.data?.error?.message,
        type: "error",
        duration: 5000,
      });
    } finally {
      setIsLoading((prev) => ({ ...prev, popular: false }));
    }
  };

  const fetchInspiringCompany = async (page: number = 1) => {
    setIsLoading((prev) => ({ ...prev, inspiring: true }));
    try {
      const res = await GetInspiringCompanies(
        page,
        aspiringPagination.itemsPerPage
      );
      if (res?.data?.data) {
        const transformedCompanies = res.data.data.rows.map((company: any) => ({
          id: company.id,
          name: company.name,
          location: company.location || "",
          domain: company.domain || "General",
          category: "Inspiring",
          logo: company.profile_picture || iconMap["aspcompany1"],
          banner: company.profile_banner || iconMap["aspcompany1"],
          description: company.bio || "No description available",
          tags: company.tags || [],
          rating: company.average,
          isCertified: company.is_certified || false,
          level: company?.level?.level,
          professions: company?.professions,
          interests: company?.interests,
        }));
        setInspiringCompanies(transformedCompanies);
        setInspiringPagination((prev) => ({
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
      setIsLoading((prev) => ({ ...prev, inspiring: false }));
    }
  };

  const fetchAspiringCompany = async (page: number = 1) => {
    setIsLoading((prev) => ({ ...prev, inspiring: true }));
    try {
      const res = await GetAspiringCompanies(
        page,
        aspiringPagination.itemsPerPage
      );
      if (res?.data?.data) {
        const transformedCompanies = res.data.data.rows.map((company: any) => ({
          id: company.id,
          name: company.name,
          location: company.location || "",
          domain: company.domain || "General",
          category: "Inspiring",
          logo: company.profile_picture || iconMap["aspcompany1"],
          banner: company.profile_banner || iconMap["aspcompany1"],
          description: company.bio || "No description available",
          tags: company.tags || [],
          rating: company.average,
          isCertified: company.is_certified || false,
          level: company?.level?.level,
          professions: company?.professions,
          interests: company?.interests,
        }));
        setAspiringCompanies(transformedCompanies);
        setAspiringPagination((prev) => ({
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
      setIsLoading((prev) => ({ ...prev, inspiring: false }));
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
      fetchBadge();
      fetchDomain();
      fetchPublicCompany();
      // fetchPopularCompany();
      // fetchInspiringCompany();
      // fetchAspiringCompany();
      hasFetched.current = true;
    }
  }, []);

  useEffect(() => {
    if (selected === "popular") fetchPopularCompany(1);
    if (selected === "aspiring") fetchAspiringCompany(1);
    if (selected === "inspired") fetchInspiringCompany(1);
  }, [selected]);

  const handleSearch = () => {
    if (selectedDomain || searchQuery) {
      const domainSlug = selectedDomain || "";
      navigate(
        `/dashboard/search-listing?search=${encodeURIComponent(
          searchQuery
        )}&profession=${domainSlug}`
      );
    }
  };
  useEffect(() => {
    handleSearch();
  }, [selectedDomain]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const sortByName = (list: Company[]) =>
    [...list].sort((a, b) =>
      order === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    );

  const activeList = (() => {
    if (selected === "popular")
      return {
        title: "Popular People",
        list: sortByName(popularCompanies),
        loading: isLoading.popular,
        pagination: popularPagination,
        onPage: fetchPopularCompany,
      };
    if (selected === "aspiring")
      return {
        title: "Aspiring People",
        list: sortByName(aspiringCompanies),
        loading: isLoading.aspiring,
        pagination: aspiringPagination,
        onPage: fetchAspiringCompany,
      };
    if (selected === "inspired")
      return {
        title: "Inspiring People",
        list: sortByName(inspiringCompanies),
        loading: isLoading.inspiring,
        pagination: inspiringPagination,
        onPage: fetchInspiringCompany,
      };
    return null; // All
  })();

  return (
    <>
      <div className="px-1">
        {/* Hero Section - Mobile Optimized */}
        {/* <section className="relative h-auto max-w-full sm:h-[350px] md:h-[400px] lg:h-[500px] mx-auto rounded-xl overflow-hidden mt-2 sm:mt-4 flex items-center justify-center"> */}
        <section className="relative mx-auto mt-2 sm:mt-4  rounded-xl">
          {/* Background Image Full Fit */}
          <img
            src="https://cdn.cness.io/Directory.svg"
            alt="City Skyline"
            className="w-full lg:w-screen h-[300px] lg:h-auto rounded-xl pointer-events-none select-none object-cover"
          />

          {/* CENTER CONTENT - Mobile Responsive */}
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-4 sm:px-6 pb-8 sm:pb-10">
            <h1
              className="text-center font-[poppins] font-semibold mb-4 sm:mb-6
                  text-xl sm:text-2xl lg:text-[32px] leading-[1.3] sm:leading-[1.4]
                  bg-linear-to-b from-[#4E4E4E] to-[#232323] 
                  bg-clip-text text-transparent"
            >
              Search for Individuals and Services
            </h1>
            {/* Search Bar Wrapper - Mobile Responsive */}
            <div className="w-full max-w-xl items-center gap-3 mt-4 sm:mt-5 px-2 mb-2">
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
                      <span className="text-xs">Professions</span>
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
                              className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 
                                
                                `}
                              onClick={() => {
                                // clearFilter();
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
                                selectedFilter?.id === prof.id &&
                                selectedFilter?.type === "profession"
                                  ? "bg-blue-50 text-[#7077FE] font-medium"
                                  : ""
                              }`}
                              onClick={() => {
                                setSelectedFilter({
                                  id: prof.id,
                                  type: "profession",
                                });
                                setSelectedDomain(prof.id.toString());
                                setSelectedDomainText(prof.title);
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

            <p className="text-xs sm:text-sm text-[#6340FF] font-semibold">
              Showcase your professional services and connect with like-minded
              individuals.
            </p>
          </div>
        </section>
      </div>

      {/* Filter Section - Mobile Responsive */}
      <section className="py-4 sm:py-6 px-4 sm:px-1 bg-[#f9f9f9] border-t border-gray-100">
        <div className="w-full mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-0">
          <h2 className="font-['Poppins'] text-lg sm:text-xl font-semibold">
            {selected === "popular"
              ? "Leader Board"
              : selected === "aspiring"
              ? "Aspiring People"
              : selected === "inspired"
              ? "Inspired People"
              : "All Individuals"}
          </h2>

          <CompanyFilters
            options={badge}
            selected={selected}
            setSelected={setSelected as any}
            order={order}
            setOrder={setOrder}
            ClassName="sm:ml-auto w-full sm:w-auto"
            searchQuery={searchQuery}
            selectedDomain={selectedDomain}
          />
        </div>
      </section>

      {/* Companies List - Mobile Responsive */}
      {activeList ? (
        <section className="py-4 sm:py-6 border-t border-gray-100 px-4 sm:px-1">
          <div className="w-full mx-auto">
            {activeList.loading ? (
              <div className="flex justify-center py-8 sm:py-10">
                <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : activeList.list.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                  {activeList.list.map((company) => {
                    return (
                      <CompanyCard
                        id={company.id}
                        key={company.id}
                        name={company.name}
                        domain={company.domain}
                        logoUrl={company.logo}
                        bannerUrl={company.banner}
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
                    );
                  })}
                </div>

                <div className="mt-6 sm:mt-8">
                  <Pagination
                    pagination={activeList.pagination}
                    isLoading={activeList.loading}
                    onPageChange={activeList.onPage}
                  />
                </div>
              </>
            ) : (
              <p className="text-gray-500 text-center py-8 sm:py-10">
                No results found.
              </p>
            )}
          </div>
        </section>
      ) : (
        <>
          <section className="py-8 sm:py-12 px-4 sm:px-1 bg-[#f9f9f9] border-t border-gray-100">
            <div className="w-full mx-auto">
              {isLoading.public ? (
                <div className="flex justify-center py-8 sm:py-10">
                  <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              ) : popularCompanies.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                    {sortByName(popularCompanies).map((company) => {
                      return (
                        <CompanyCard
                          id={company.id}
                          key={company.id}
                          name={company.name}
                          domain={company.domain}
                          logoUrl={company.logo}
                          bannerUrl={company.banner}
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
                      );
                    })}
                  </div>
                  <div className="mt-6 sm:mt-8">
                    <Pagination
                      pagination={popularPagination}
                      isLoading={isLoading.popular}
                      onPageChange={fetchPopularCompany}
                    />
                  </div>
                </>
              ) : (
                <p className="text-gray-500 text-center py-8 sm:py-10">
                  No popular people found.
                </p>
              )}
            </div>
          </section>
          {/* <section className="py-12 px-1 bg-[#f9f9f9] border-t border-gray-100 pt-2">
            <div className="w-full mx-auto">
              <h3 className="text-lg font-semibold mb-4">Popular People</h3>
              {isLoading.popular ? (
                <div className="flex justify-center py-10">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              ) : popularCompanies.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-x-4 gap-y-4">
                    {sortByName(popularCompanies).map((company) => {
                      console.log("🚀 ~ DashboardDirectory ~ company:", company)
                      return <CompanyCard
                        id={company.id}
                        key={company.id}
                        name={company.name}
                        domain={company.domain}
                        logoUrl={company.logo}
                        bannerUrl={company.banner}
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
                      />;
                    })}
                  </div>
                  <Pagination
                    pagination={popularPagination}
                    isLoading={isLoading.popular}
                    onPageChange={fetchPopularCompany}
                    align="end"
                  />
                </>
              ) : (
                <p className="text-gray-500">No popular people found.</p>
              )}
            </div>
          </section> */}

          {/* Aspiring */}
          {/* <section className="py-12 border-t border-gray-100">
            <div className="w-full mx-auto">
              <h3 className="text-lg font-semibold mb-4">Aspiring People</h3>
              {isLoading.aspiring ? (
                <div className="flex justify-center py-10">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              ) : aspiringCompanies.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-x-4 gap-y-4">
                    {sortByName(aspiringCompanies).map((company) => (
                      <CompanyCard
                        id={company.id}
                        key={company.id}
                        name={company.name}
                        domain={company.domain}
                        logoUrl={company.logo}
                        bannerUrl={company.banner}
                        location={company.location}
                        description={company.description}
                        tags={company.tags}
                        rating={company.rating}
                        isCertified={company.isCertified}
                        routeKey={company.id}
                        level={company.level}
                        interest={company.interests}
                        profession={company.professions}
                      />
                    ))}
                  </div>
                  <Pagination
                    pagination={aspiringPagination}
                    isLoading={isLoading.aspiring}
                    onPageChange={fetchAspiringCompany}
                    align="end"
                  />
                </>
              ) : (
                <p className="text-gray-500">No aspiring people found.</p>
              )}
            </div>
          </section> */}

          {/* Inspiring */}
          {/* <section className="py-12 border-t border-gray-100">
            <div className="w-full mx-auto">
              <h3 className="text-lg font-semibold mb-4">Inspiring People</h3>
              {isLoading.inspiring ? (
                <div className="flex justify-center py-10">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              ) : inspiringCompanies.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-x-4 gap-y-4">
                    {sortByName(inspiringCompanies).map((company) => (
                      <CompanyCard
                        id={company.id}
                        key={company.id}
                        name={company.name}
                        domain={company.domain}
                        logoUrl={company.logo}
                        bannerUrl={company.banner}
                        location={company.location}
                        description={company.description}
                        tags={company.tags}
                        rating={company.rating}
                        isCertified={company.isCertified}
                        routeKey={company.id}
                        level={company.level}
                        interest={company.interests}
                        profession={company.professions}
                      />
                    ))}
                  </div>
                  <Pagination
                    pagination={inspiringPagination}
                    isLoading={isLoading.inspiring}
                    onPageChange={fetchInspiringCompany}
                    align="end"
                  />
                </>
              ) : (
                <p className="text-gray-500">No inspiring people found.</p>
              )}
            </div>
          </section> */}
        </>
      )}
    </>
  );
}
