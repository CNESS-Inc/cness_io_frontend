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

export default function DashboardDirectory() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [selectedDomain, setSelectedDomain] = useState("");
  const [searchQuery, setSearchQuery] = useState<any>("");
  const [, setSelectedDomainText] = useState("");
  const [, setTextWidth] = useState(0);
  const [Domain, setDomain] = useState<Array<{ id: string | number; title: string }>>([]);
  const [badge, setBadge] = useState<any>([]);
  const measureRef = useRef<HTMLSpanElement>(null);
  const hasFetched = useRef(false);

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
  console.log("🚀 ~ DashboardDirectory ~ popularCompanies:", popularCompanies);
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
  console.log("🚀 ~ DashboardDirectory ~ activeList:", activeList);

  return (
    <>
      <div className="px-2 sm:px-2 lg:px-1">
<section className="relative h-auto max-w-full h-[350px] sm:h-[400px] md:h-[500px] mx-auto rounded-xl overflow-hidden mt-2 flex items-center justify-center">

  {/* Background Image Full Fit */}
  <img
    src="https://cdn.cness.io/Directory%20(1).svg"
    alt="City Skyline"
    className="absolute w-full h-full object-cover z-0 pointer-events-none"
  />

  {/* CENTER CONTENT - DO NOT TOUCH INSIDE */}
  <div className="relative z-10 max-w-7xl pb-10 text-center flex-col items-center justify-center">

    <h1 className="text-center font-[poppins] font-semibold mb-6 
      text-[32px] leading-[1.3] bg-linear-to-b from-[#4E4E4E] to-[#232323] 
      bg-clip-text text-transparent">
      Connect with professionals and<br />
      like-minded individuals.
    </h1>

    {/* Search Bar Wrapper */}
    <div className="w-full flex justify-center mb-4">
      <div className="w-full bg-white rounded-full shadow-[0_10px_30px_rgba(112,119,254,0.15)] 
        flex items-center pl-5 h-14 max-w-[650px]">

        <span className="text-[#7077FE] mr-3 text-lg">
          <CiSearch />
        </span>

        <input
          type="text"
          placeholder="Search Best Practice"
          className="flex-1 bg-transparent text-sm text-gray-700 placeholder:text-gray-400 outline-none"
          value={searchQuery || ""}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyPress}
        />

        {/* Dropdown */}
        <div className="relative shrink-0">
          <select
            className="bg-[#6340FF] text-white font-semibold rounded-full h-12 px-6 pr-1 text-sm appearance-none 
              focus:outline-none cursor-pointer shadow-[0_10px_30px_rgba(112,119,254,0.35)]"
            value={selectedDomain}
            onChange={(e) => {
              setSelectedDomain(e.target.value);
              const selectedText = e.target.options[e.target.selectedIndex].text;
              setSelectedDomainText(selectedText);
            }}
          >
            <option value="">Professions</option>
            {Domain.map((domain) => (
              <option key={domain.id} value={domain.id}>
                {domain.title}
              </option>
            ))}
          </select>

          <div className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-white text-xs">
            ▼
          </div>
        </div>

      </div>
    </div>

    <p className="text-xs text-[#6340FF] font-[600] md:text-sm ">
      Connect with conscious audience
    </p>

  </div>
</section>


      </div>

      <section className="py-6 px-1 bg-[#f9f9f9] border-t border-gray-100 ">
        <div className="w-full mx-auto flex items-center">
          <h2 className="font-['Poppins'] text-xl font-semibold">
            {selected === "popular"
              ? "Leader Board"
              : selected === "aspiring"
              ? "Aspiring People"
              : selected === "inspired"
              ? "Inspired People"
              : "All People"}
          </h2>
          {/*<button className="p-2 rounded-lg hover:bg-gray-100 transition ml-335">
      <Filter className="h-5 w-5 text-gray-300" />
    </button>*/}
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
              {/* <h3 className="text-lg font-semibold mb-4">Popular People</h3> */}
              {isLoading.public ? (
                <div className="flex justify-center py-10">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              ) : popularCompanies.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-x-4 gap-y-4">
                    {sortByName(popularCompanies).map((company) => {
                      console.log(
                        "🚀 ~ DashboardDirectory ~ company:",
                        company
                      );
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
