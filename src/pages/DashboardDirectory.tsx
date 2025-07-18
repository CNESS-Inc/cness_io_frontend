import { useEffect, useState } from "react";
import CompanyCard from "../components/ui/CompanyCard";

import { iconMap } from "../assets/icons";
import AnimatedBackground from "../components/ui/AnimatedBackground";
import {
  GetDomainDetails,
  GetInspiringCompanies,
  GetPopularCompanyDetails,
} from "../Common/ServerAPI";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/ui/Toast/ToastProvider";

type Company = {
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
  const [selectedDomain, setSelectedDomain] = useState("");
  const [searchText, setSearchText] = useState("");
  const [Domain, setDomain] = useState([]);
  const { showToast } = useToast();

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

  const [popularCompanies, setPopularCompanies] = useState<Company[]>([]);
  console.log("🚀 ~ DirectoryPage ~ popularCompanies:", popularCompanies);
  const [aspiringCompanies, setAspiringCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState({
    popular: false,
    inspiring: false,
  });

  const fetchDomain = async () => {
    try {
      const res = await GetDomainDetails();
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
          rating: company.rating || 4,
          isCertified: company.is_certified || true,
          is_person: company.is_person,
          is_organization: company.is_organization,
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
          rating: company.rating || 3,
          isCertified: company.is_certified || false,
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

  useEffect(() => {
    fetchDomain();
    fetchPopularCompany();
    fetchInspiringCompany();
  }, []);

  const handleSearch = () => {
    if (selectedDomain || searchText) {
      const domainSlug = selectedDomain || "";
      navigate(
        `/dashboard/DashboardDirectory/technology?search=${encodeURIComponent(
          searchText
        )}&domain=${domainSlug}`
      );
    }
  };

  const handleDomainChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDomain = e.target.value;
    console.log("🚀 ~ handleDomainChange ~ newDomain:", newDomain);
    setSelectedDomain(newDomain);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
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
            Conscious Search Stops here.
          </h1>

          {/* Search Bar */}
          <div className="w-full max-w-2xl bg-white border border-gray-200 rounded-full flex items-center px-3 py-2 shadow-sm gap-2 mt-2">
            {/* Dropdown */}
            <div className="relative">
              <select
                className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-full px-4 py-2 w-[130px] text-center appearance-none cursor-pointer"
                value={selectedDomain}
                onChange={handleDomainChange}
              >
                <option value="">Explore</option>
                {Domain.map((domain: any) => (
                  <option
                    key={domain.id}
                    value={domain.slug}
                    className="text-black"
                  >
                    {domain.name}
                  </option>
                ))}
              </select>
              <div className="absolute top-2.5 right-3 text-white text-xs pointer-events-none">
                ▼
              </div>
            </div>

            {/* Input */}
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

          {/* Subtext */}
          <p className="text-gray-700 text-[12px] mt-5">
            <span className="font-medium underline cursor-pointer text-[#F07EFF]">
              List your company now
            </span>{" "}
            and connect with conscious audience
          </p>
        </div>
      </section>

      {/* Popular Companies Section */}
      <section className="py-16 bg-[#f9f9f9] border-t border-gray-100">
        <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-semibold mb-4">Popular Companies</h2>

          {isLoading.popular ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : popularCompanies.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
              {popularCompanies.map((company) => (
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
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No popular companies found.</p>
          )}

          {popularPagination.totalPages > 1 && (
            <div className="mt-8">
              <div className="flex justify-end">
                <nav
                  className="inline-flex rounded-md shadow-sm -space-x-px text-sm"
                  aria-label="Pagination"
                >
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

                  {Array.from(
                    { length: popularPagination.totalPages },
                    (_, i) => i + 1
                  ).map((page) => (
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

      {/* Inspiring Companies Section */}
      <section className="py-16 border-t border-gray-100">
        <div className="relative w-full  mx-auto rounded-[12px] overflow-hidden">
          <h2 className="text-xl font-semibold mb-4">Aspiring Companies</h2>

          {isLoading.inspiring ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : aspiringCompanies.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-6 px-4 items-start">
              {aspiringCompanies.map((company) => (
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
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No inspiring companies found.</p>
          )}

          {aspiringPagination.totalPages > 1 && (
            <div className="mt-8 overflow-x-auto">
              <div className="flex justify-center sm:justify-end flex-wrap gap-2">
                <nav
                  className="inline-flex rounded-md shadow-sm -space-x-px text-sm"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() =>
                      fetchInspiringCompany(aspiringPagination.currentPage - 1)
                    }
                    disabled={
                      aspiringPagination.currentPage === 1 ||
                      isLoading.inspiring
                    }
                    className="px-3 py-1 rounded-l-md bg-white border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-40"
                  >
                    «
                  </button>

                  {Array.from(
                    { length: aspiringPagination.totalPages },
                    (_, i) => i + 1
                  ).map((page) => (
                    <button
                      key={page}
                      onClick={() => fetchInspiringCompany(page)}
                      disabled={isLoading.inspiring}
                      className={`px-3 py-1 border border-gray-300 ${
                        page === aspiringPagination.currentPage
                          ? "bg-indigo-500 text-white"
                          : "bg-white text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() =>
                      fetchInspiringCompany(aspiringPagination.currentPage + 1)
                    }
                    disabled={
                      aspiringPagination.currentPage ===
                        aspiringPagination.totalPages || isLoading.inspiring
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
    </>
  );
}
