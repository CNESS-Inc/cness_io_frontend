import { useEffect, useRef, useState } from "react";
import CompanyCard from "../components/ui/CompanyCard";

import { iconMap } from "../assets/icons";
import AnimatedBackground from "../components/ui/AnimatedBackground";
import {
  GetAspiringCompanies,
  GetBadgeListDetails,
  GetInspiringCompanies,
  GetPopularCompanyDetails,
  GetValidProfessionalDetails,
} from "../Common/ServerAPI";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/ui/Toast/ToastProvider";
import CompanyFilters from "../components/directory/CompanyFilters";
import Pagination from "../components/directory/CompanyPagination";

type Company = {
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

export default function DashboardDirectory() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [selectedDomain, setSelectedDomain] = useState("");
  const [searchQuery, setSearchQuery] = useState<any>("");
  const [selectedDomainText, setSelectedDomainText] = useState("");
  const [textWidth, setTextWidth] = useState(0);
  const [Domain, setDomain] = useState([]);
  const [badge, setBadge] = useState<any>([]);
  const measureRef = useRef<HTMLSpanElement>(null);
  const hasFetched = useRef(false);

  type Filter = "" | "popular" | "aspiring" | "inspired";
  const [selected, setSelected] = useState<Filter>(""); // All
  const [order, setOrder] = useState<"asc" | "desc">("asc");

  const [isLoading, setIsLoading] = useState({
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
  console.log("popularCompanies", popularCompanies);
  const [aspiringCompanies, setAspiringCompanies] = useState<Company[]>([]);
  const [inspiringCompanies, setInspiringCompanies] = useState<Company[]>([]);

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

  const fetchPopularCompany = async (page: number = 1) => {
    setIsLoading((prev) => ({ ...prev, popular: true }));
    try {
      const res = await GetPopularCompanyDetails(
        page,
        popularPagination.itemsPerPage
      );
      console.log("🚀 ~ fetchPopularCompany ~ res:", res);

      if (res?.data?.data) {
        const transformedCompanies = res.data.data.rows.map((company: any) => ({
          id: company.id,
          name: company.name,
          location: company.location || "Unknown",
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
        }));

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
          location: company.location || "Unknown",
          domain: company.domain || "General",
          category: "Inspiring",
          logo: company.profile_picture || iconMap["aspcompany1"],
          banner: company.profile_banner || iconMap["aspcompany1"],
          description: company.bio || "No description available",
          tags: company.tags || [],
          rating: company.average,
          isCertified: company.is_certified || false,
          level: company?.level?.level,
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
          location: company.location || "Unknown",
          domain: company.domain || "General",
          category: "Inspiring",
          logo: company.profile_picture || iconMap["aspcompany1"],
          banner: company.profile_banner || iconMap["aspcompany1"],
          description: company.bio || "No description available",
          tags: company.tags || [],
          rating: company.average,
          isCertified: company.is_certified || false,
          level: company?.level?.level,
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
      fetchPopularCompany();
      fetchInspiringCompany();
      fetchAspiringCompany();
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
      <section className="relative w-full h-[350px] sm:h-[400px] md:h-[500px] mx-auto rounded-[12px] overflow-hidden">
        <AnimatedBackground />
        <img
          src={iconMap["heroimgs"]}
          alt="City Skyline"
          className="absolute bottom-[0px] left-0 w-full object-cover z-0 pointer-events-none"
        />

        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 py-8 md:py-20 max-w-4xl mx-auto mt-20">
          <h1 className="text-center font-poppins font-semibold mb-6 text-[32px] leading-[100%] tracking-[0px] bg-gradient-to-b from-[#4E4E4E] to-[#232323] bg-clip-text text-transparent">
            Conscious Search Stops here.
          </h1>

          {/* Updated responsive container */}
          <div className="w-full mx-auto flex flex-col md:flex-row items-stretch md:items-center gap-2 h-[34px]">
            {/* Domain Selector - now full width on mobile */}
            <div className="relative rounded-full ">
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

              <div className="w-full flex justify-center md:justify-start items-center my-1 px-4 md:px-0">
                <div
                  className="relative w-full max-w-[200px] md:w-fit"
                  style={{
                    width: textWidth ? `${textWidth}px` : "100%",
                    minWidth: "120px",
                    maxWidth: "100%",
                  }}
                >
                  <select
                    className="bg-[#7077FE] rounded-full text-white font-semibold px-3 py-2 pr-6 appearance-none focus:outline-none cursor-pointer text-[12px] w-full"
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
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white text-xs pointer-events-none">
                    ▼
                  </div>
                </div>
              </div>
            </div>
            {/* Search Input - full width on mobile */}
            <div className="relative flex-grow bg-white border border-gray-200 rounded-full md:rounded-full px-3 h-[100%] shadow-sm ">
              <input
                type="text"
                placeholder="Technology and AI"
                className="w-full py-2 bg-transparent text-sm text-gray-700 placeholder:text-gray-400 outline-none border-none h-full px-2"
                value={searchQuery || ""}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyPress}
              />
              <button
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#7077FE] cursor-pointer"
                onClick={handleSearch}
              >
                🔍
              </button>
            </div>
          </div>

          <p className="text-gray-700 text-xs md:text-sm mt-16 sm:mt-4 md:mt-2 text-center px-2 sm:px-0">
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

      <section className="py-6 px-1 bg-[#f9f9f9] border-t border-gray-100 ">
        <div className="w-full mx-auto flex items-center">
          <h2 className="text-xl font-semibold">
            {selected === "popular"
              ? "Leader Board"
              : selected === "aspiring"
              ? "Aspiring People"
              : selected === "inspired"
              ? "Inspired People"
              : "All People"}
          </h2>

          <CompanyFilters
            options={badge}
            selected={selected}
            setSelected={setSelected as any}
            order={order}
            setOrder={setOrder}
            ClassName="ml-auto"
            searchQuery={searchQuery}
            selectedDomain={selectedDomain}
          />
        </div>
      </section>

      {/* Popular Companies Section */}
      {activeList ? (
        <section className="py-6 border-t border-gray-100">
          <div className="w-full mx-auto">
            {activeList.loading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : activeList.list.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-x-4 gap-y-4">
                  {activeList.list.map((company) => (
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
                    />
                  ))}
                </div>

                <Pagination
                  pagination={activeList.pagination}
                  isLoading={activeList.loading}
                  onPageChange={activeList.onPage}
                  align="end"
                />
              </>
            ) : (
              <p className="text-gray-500">No results found.</p>
            )}
          </div>
        </section>
      ) : (
        <>
          <section className="py-12 px-1 bg-[#f9f9f9] border-t border-gray-100 pt-2">
            <div className="w-full mx-auto">
              <h3 className="text-lg font-semibold mb-4">Popular People</h3>
              {isLoading.popular ? (
                <div className="flex justify-center py-10">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              ) : popularCompanies.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-x-4 gap-y-4">
                    {sortByName(popularCompanies).map((company) => (
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
                      />
                    ))}
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
          </section>

          {/* Aspiring */}
          <section className="py-12 border-t border-gray-100">
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
          </section>

          {/* Inspiring */}
          <section className="py-12 border-t border-gray-100">
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
          </section>
        </>
      )}
    </>
  );
}
