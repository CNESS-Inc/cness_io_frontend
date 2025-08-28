import { useEffect, useRef, useState } from "react";
import CompanyCard from "../components/ui/CompanyCard";

import { iconMap } from "../assets/icons";
import AnimatedBackground from "../components/ui/AnimatedBackground";
import {
  GetAspiringCompanies,
  GetPopularCompanyDetails,
  GetValidProfessionalDetails,
} from "../Common/ServerAPI";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/ui/Toast/ToastProvider";
import { LiaCertificateSolid } from "react-icons/lia";
import { Menu } from "@headlessui/react";
import {
  FaAngleDown,
  FaAngleUp,
  FaCheck,
  FaSortAlphaDown,
  FaSortAlphaUp,
} from "react-icons/fa";

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
  const [selectedDomain, setSelectedDomain] = useState("");
  const [searchQuery, setSearchQuery] = useState<any>("");
  const [selectedDomainText, setSelectedDomainText] = useState("All Domains");
  const [textWidth, setTextWidth] = useState(0);
  const [Domain, setDomain] = useState([]);
  const { showToast } = useToast();
  const [selected, setSelected] = useState("");
  const [order, setOrder] = useState<"asc" | "desc">("asc");

  const options = [
    { value: "aspiring", label: "Aspiring" },
    { value: "popular", label: "Popular" },
    { value: "inspired", label: "Inspired" },
  ];

  // const handleSelect = (value: string) => {
  //   setSelected(value);
  //   if (value === "aspiring") fetchInspiringCompany();
  //   if (value === "popular") fetchPopularCompany();
  // };

  // Pagination states
  const [popularPagination, setPopularPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });
  console.log(
    "🚀 ~ DashboardDirectory ~ popularPagination:",
    popularPagination
  );

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
  const measureRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (measureRef.current) {
      setTextWidth(measureRef.current.offsetWidth);
    }
  }, [selectedDomainText]);

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

  useEffect(() => {
    fetchDomain();
    fetchPopularCompany();
    fetchInspiringCompany();
  }, []);

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

  return (
    <>
      <section className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] mx-auto rounded-[12px] overflow-hidden">
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
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#7077FE] cursor-pointer"
                onClick={handleSearch}
              >
                🔍
              </button>
            </div>
          </div>

          <p className="text-gray-700 text-xs md:text-sm mt-12 sm:mt-4 md:mt-2 text-center px-2 sm:px-0">
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

      {/* Popular Companies Section */}
      <section className="py-16 px-1 bg-[#f9f9f9] border-t border-gray-100">
        <div className="w-full mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Popular People</h2>

            {/* Filter + Sort */}
            <div className="flex items-center gap-3">
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <Menu.Button className="flex items-center gap-2 px-2 py-2 border border-gray-300 rounded-md bg-white text-sm text-gray-700 hover:bg-gray-50">
                    <LiaCertificateSolid className="text-pink-700" size={20} />
                    {selected
                      ? options.find((o) => o.value === selected)?.label
                      : "Certification Level"}
                  </Menu.Button>
                </div>

                <Menu.Items className="absolute right-0 mt-2 w-32 origin-top-right bg-white border border-gray-200 rounded-md shadow-lg focus:outline-none z-50">
                  <div className="py-2">
                    {options.map((option) => (
                      <Menu.Item key={option.value}>
                        {({ active }) => (
                          <button
                            // onClick={() => handleSelect(option.value)}
                            onClick={() => setSelected(option.value)}
                            className={`flex items-center w-full px-4 py-2 text-sm ${
                              active ? "bg-gray-100" : ""
                            }`}
                          >
                            <span
                              className={`w-4 h-4 mr-3 rounded-full border flex items-center justify-center ${
                                selected === option.value
                                  ? "border-pink-600 bg-pink-600"
                                  : "border-gray-400"
                              }`}
                            >
                              {selected === option.value && (
                                <FaCheck className="text-white text-[10px]" />
                              )}
                            </span>
                            {option.label}
                          </button>
                        )}
                      </Menu.Item>
                    ))}
                  </div>
                </Menu.Items>
              </Menu>

              {/* Sort Dropdown */}
              <button
                onClick={() => setOrder(order === "asc" ? "desc" : "asc")}
                className="flex items-center justify-between w-26 px-4 py-2 border border-gray-300 rounded-md bg-white text-sm text-gray-700 hover:bg-gray-50"
              >
                {/* Left icon + label */}
                <div className="flex items-center gap-2">
                  <FaSortAlphaUp className="text-indigo-600" />
                  <span>A - Z</span>
                </div>

                {/* Right toggle icon */}
                {order === "asc" ? (
                  <FaAngleDown className="text-gray-500" />
                ) : (
                  <FaAngleUp className="text-gray-500" />
                )}
              </button>
            </div>
          </div>

          {isLoading.popular ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : popularCompanies.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 [@media(min-width:1920px)]:grid-cols-6 gap-x-4 gap-y-4">
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
                  routeKey={company.id}
                  level={company.level}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No popular people found.</p>
          )}

          {popularPagination.totalPages > 0 && (
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
        <div className="w-full mx-auto">
          <h2 className="text-xl font-semibold mb-4">Aspiring People</h2>

          {isLoading.inspiring ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : aspiringCompanies.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 [@media(min-width:1920px)]:grid-cols-5 gap-x-4 gap-y-4">
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
                  routeKey={company.id}
                  level={company.level}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No aspiring people found.</p>
          )}

          {aspiringPagination.totalPages > 0 && (
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