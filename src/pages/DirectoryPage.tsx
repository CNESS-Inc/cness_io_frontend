import { useEffect, useRef, useState } from "react";
import CompanyCard from "../components/ui/CompanyCard";
import Header from "../layout/Header/Header";
import Footer from "../layout/Footer/Footer";
import { iconMap } from "../assets/icons";
import AnimatedBackground from "../components/ui/AnimatedBackground";
import {
  GetInspiringCompanies,
  GetPopularCompanyDetails,
  GetProfessionalDetails,
} from "../Common/ServerAPI";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/ui/Toast/ToastProvider";
import Button from "../components/ui/Button";
import { useLocation } from "react-router-dom";

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

export default function DirectoryPage() {
  const navigate = useNavigate();
  const [selectedDomain, setSelectedDomain] = useState("");
  const [searchText, setSearchText] = useState("");
  const [Domain, setDomain] = useState([]);
  const { showToast } = useToast();

  const location = useLocation();
  const isInDashboard = location.pathname.includes("/dashboard");
  const measureRef = useRef<HTMLSpanElement>(null);
  const [selectedDomainText, setSelectedDomainText] = useState("All Profession");
  const [textWidth, setTextWidth] = useState(0);

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



    useEffect(() => {
    if (measureRef.current) {
      setTextWidth(measureRef.current.offsetWidth);
    }
  }, [selectedDomainText]);

  const fetchDomain = async () => {
    try {
      const res = await GetProfessionalDetails();
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
          rating: company.average,
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
        `/directory/technology-ai?search=${encodeURIComponent(
          searchText
        )}&profession=${domainSlug}`
      );
    }
  };

  // const handleDomainChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   const newDomain = e.target.value;
  //   console.log("🚀 ~ handleDomainChange ~ newDomain:", newDomain);
  //   setSelectedDomain(newDomain);
  // };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const topRow = Domain.slice(0, 7);
  const bottomRow = Domain.slice(7);

  return (
    <>
      {!isInDashboard && <Header />}

      {/* Hero Section */}
      <section className="relative h-auto md:h-[692px] rounded-[12px] overflow-hidden mx-4 sm:mx-6 md:mx-8">
        <AnimatedBackground />

        <img
          src={iconMap["heroimg"]}
          alt="City Skyline"
          className="absolute bottom-[-150px] left-0 w-full object-cover z-0 pointer-events-none"
        />

        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 py-12 md:py-20 max-w-4xl mx-auto">
          <p className="text-lg sm:text-xl text-[#7077FE] font-bold mb-4">
            Conscious Directory
          </p>
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-gray-800 mb-4">
            Conscious Search Stops here.
          </h1>

          <div className="w-full max-w-3xl mx-auto bg-white border border-gray-200 rounded-full flex flex-nowrap items-center px-3 py-2 shadow-sm gap-2">
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
              <div className="absolute top-1.5 right-2 text-white text-xs pointer-events-none">
                ▼
              </div>
            </div>
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Find & Choose your perfect organization"
                className="w-full px-4 py-2 pr-10 bg-transparent text-sm text-gray-700 placeholder:text-gray-400 outline-none border-none"
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

          <p className="text-gray-700 text-sm mt-6">
            <span className="font-medium underline cursor-pointer">
              List your company now
            </span>{" "}
            and connect with conscious audience
          </p>

          <div className="flex justify-center gap-3 flex-wrap mt-6">
            {["Get certified", "Listed on the top", "15+ Domains"].map(
              (label, index) => (
                <span
                  key={index}
                  className="bg-white px-4 py-2 rounded-full shadow text-sm font-medium flex items-center gap-2"
                >
                  <img
                    src={iconMap["verified"]}
                    alt="Verified"
                    className="w-5 h-5"
                  />
                  {label}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      {/* Marquee Section */}
      <div className="bg-white py-10">
        <div className="max-w-screen-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-x-6 gap-y-4 justify-center">
            {[...topRow, ...bottomRow].map((domain: any, i: any) => {
              const iconKeys = Object.keys(iconMap);
              const validIconKeys = iconKeys.filter(
                (key) => !["domain1Icon", "domain2Icon"].includes(key)
              );
              const randomIconKey =
                validIconKeys[Math.floor(Math.random() * validIconKeys.length)];
              const icon = iconMap[randomIconKey];

              return (
                <div
                  key={i}
                  onClick={() => setSelectedDomain(domain.slug)}
                  className="border border-purple-100 rounded-[24px] px-6 py-2 flex items-center gap-2 sm:gap-3 bg-white shadow-sm hover:shadow-md cursor-pointer transition"
                >
                  {icon && (
                    <img
                      src={icon}
                      alt={domain.name}
                      className="w-5 h-5 min-w-[20px] object-contain shrink-0"
                    />
                  )}
                  <span className="text-sm font-medium text-gray-800 leading-none">
                    {domain.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Why List Section */}
      <section className="bg-[#FAFAFA] py-16">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
            <div className="w-full md:w-auto flex justify-center">
              <img
                src={iconMap["leftimg"]}
                alt="Listing Benefits"
                className="w-full max-w-sm rounded-sm shadow"
              />
            </div>

            <div className="flex-1 text-center md:text-left">
              <h2 className="text-sm sm:text-md font-bold text-[#7077FE] uppercase mb-7">
                Why List in the Directory?
              </h2>

              <ul className="list-disc list-inside text-left md:text-left space-y-5 text-gray-700 text-base leading-relaxed px-4 sm:px-0">
                <li>
                  <strong>Visibility:</strong> Showcase your conscious brand to
                  a growing community.
                </li>
                <li>
                  <strong>Credibility:</strong> Get CNESS certified to build
                  trust with users and clients.
                </li>
                <li>
                  <strong>Networking:</strong> Connect with like-minded
                  individuals and organizations.
                </li>
                <li>
                  <strong>Searchable by Industry:</strong> Make it easy for
                  people to find your offering by sector.
                </li>
                <li>
                  <strong>Impact:</strong> Lead the change and inspire others in
                  the conscious ecosystem.
                </li>
              </ul>

              <div className="mt-6 flex justify-center md:justify-start">
                <Button
                  variant="gradient-primary"
                  onClick={() => navigate("/sign-up")}
                >
                  Register Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Companies Section */}
      <section className="py-16 border-t border-gray-100">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-semibold mb-4">Aspiring Professionals</h2>

          {isLoading.popular ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : popularCompanies.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-semibold mb-4">
            Inspiring Professionals
          </h2>

          {isLoading.inspiring ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : aspiringCompanies.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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

      {!isInDashboard && <Footer />}
    </>
  );
}
