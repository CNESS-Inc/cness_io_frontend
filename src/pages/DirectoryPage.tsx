import { useEffect, useState } from "react";
import CompanyCard from "../components/ui/CompanyCard";
import Header from "../layout/Header/Header";
import Footer from "../layout/Footer/Footer";
import { iconMap } from "../assets/icons";
import AnimatedBackground from "../components/ui/AnimatedBackground";
import { GetIndustryDetails } from "../Common/ServerAPI";
import { useNavigate } from "react-router-dom";

const itemsPerPage = 6;

const domains = [
  "Domain 1",
  "Domain 2",
  "Domain 3",
  "Domain 4",
  "Domain 5",
  "Domain 6",
  "Domain 7",
  "Domain 8",
  "Domain 9",
  "Domain 10",
  "Domain 11",
  "Domain 12",
  "Domain 13",
  "Domain 14",
  "Domain 1",
  "Domain 2",
  "Domain 3",
  "Domain 4",
  "Domain 5",
  "Domain 6",
  "Domain 7",
  "Domain 8",
  "Domain 9",
  "Domain 10",
  "Domain 11",
  "Domain 12",
  "Domain 13",
  "Domain 14",
];

const sampleCompanies: Company[] = [
  {
    id: 1,
    name: "EcoTech",
    location: "Hyderabad",
    domain: "Domain 1",
    category: "Popular",
    logo: iconMap["companylogo1"],
    banner: iconMap["companycard1"],
    description: "EcoTech description",
    tags: ["Green", "Tech"],
    rating: 4,
    isCertified: true,
  },

  {
    id: 2,
    name: "Innovative Solutions",
    location: "Bangalore",
    domain: "Domain 2",
    category: "Popular",
    logo: iconMap["companylogo2"],
    banner: iconMap["companycard2"],
    description: "Innovative Solutions",
    tags: ["Tag1", "Tag2"],
    rating: 3,
    isCertified: true,
  },

  {
    id: 3,
    name: "Innovative Solutions",
    location: "Bangalore",
    domain: "Domain 2",
    category: "Popular",
    logo: iconMap["companylogo2"],
    banner: iconMap["companycard2"],
    description: "Innovative Solutions",
    tags: ["Tag1", "Tag2"],
    rating: 3,
    isCertified: true,
  },

  {
    id: 4,
    name: "Tech Innovations Inc.",
    location: "Chennai",
    domain: "Domain 5",
    category: "Popular",
    logo: iconMap["companylogo2"],
    banner: iconMap["companycard2"],
    description: "Innovative Solutions",
    tags: ["Tag1", "Tag2"],
    rating: 3,
    isCertified: true,
  },

  {
    id: 5,
    name: "Info Tech",
    location: "Bangalore",
    domain: "Domain 5",
    category: "Popular",
    logo: iconMap["companylogo2"],
    banner: iconMap["companycard2"],
    description: "Innovative Solutions",
    tags: ["Tag1", "Tag2"],
    rating: 3,
    isCertified: true,
  },

  {
    id: 6,
    name: "AspireTech",
    location: "Delhi",
    domain: "Domain 6", // 👈 Must match selected domain
    category: "Aspiring",
    logo: iconMap["aspcompany1"],
    banner: iconMap["aspcompany1"],
    description: "Empowering change through innovation.",
    tags: ["Ethical", "Tech"],
    rating: 4,
    isCertified: false,
  },
  {
    id: 7,
    name: "Creative solutions",
    location: "Delhi",
    domain: "Domain 10", // 👈 Must match selected domain
    category: "Aspiring",
    logo: iconMap["aspcompany2"],
    banner: iconMap["aspcompany2"],
    description: "Empowering change through innovation.",
    tags: ["Ethical", "Tech"],
    rating: 4,
    isCertified: false,
  },

  {
    id: 8,
    name: "Inventive solutions",
    location: "Delhi",
    domain: "Domain 10", // 👈 Must match selected domain
    category: "Aspiring",
    logo: iconMap["aspcompany2"],
    banner: iconMap["aspcompany2"],
    description: "Empowering change through innovation.",
    tags: ["Ethical", "Tech"],
    rating: 4,
    isCertified: false,
  },
  // ...more
];

type Company = {
  id: any;
  name: string;
  location: string;
  domain: string;
  category: "Popular" | "Aspiring";
  logo: string;
  banner: string;
  description: string;
  tags: string[];
  rating: number;
  isCertified?: boolean;
};

{
  sampleCompanies.map((company: Company) => (
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
  ));
}

export default function DirectoryPage() {
  const navigate = useNavigate();
  const [selectedDomain, setSelectedDomain] = useState("");

  const [searchText, setSearchText] = useState("");
  const [Domain, setDomain] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredCompanies = selectedDomain
    ? sampleCompanies.filter((c) => c.domain === selectedDomain)
    : sampleCompanies;

  const popularCompanies = filteredCompanies.filter(
    (c) => c.category === "Popular"
  );
  const aspiringCompanies = filteredCompanies.filter(
    (c) => c.category === "Aspiring"
  );

  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);

  const paginatedPopular = popularCompanies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const paginatedAspiring = aspiringCompanies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const topRow = domains.slice(0, 7);
  const bottomRow = domains.slice(7);

  const fetchDomain = async () => {
    try {
      const res = await GetIndustryDetails();
      setDomain(res?.data?.data);
    } catch (error) {}
  };

  useEffect(() => {
    fetchDomain();
  }, []);

  const handleSearch = () => {
    if (selectedDomain || searchText) {
      const domainSlug = selectedDomain || "";
      navigate(`/directory/technology-ai?search=${encodeURIComponent(searchText)}&domain=${domainSlug}`);
    }
  };

  const handleDomainChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDomain = e.target.value;
    setSelectedDomain(newDomain);

    if (searchText) {
      const domainSlug = newDomain || "";
      navigate(`/directory/technology-ai?search=${encodeURIComponent(searchText)}&domain=${domainSlug}`);
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

      {/* Hero Section */}
<section className="relative h-auto md:h-[692px] rounded-[12px] overflow-hidden mx-4 md:mx-8 lg:mx-[12px]">
  <AnimatedBackground />

  {/* Building background image */}
  <img
    src={iconMap["heroimg"]}
    alt="City Skyline"
    className="absolute bottom-[-150px] left-0 w-full object-cover z-0 pointer-events-none"
  />

  {/* Hero Content */}
  <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 py-16 md:py-20 max-w-4xl mx-auto">
    <p className="text-lg sm:text-xl text-[#7077FE] font-bold mb-4">
      Conscious Directory
    </p>
    <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-6">
      Conscious Search Stops here.
    </h1>

    {/* Dropdown + Search */}
    <div className="w-full max-w-3xl mx-auto bg-white border border-gray-200 rounded-full flex flex-row items-center px-2 py-2 shadow-sm gap-2">
      <div className="relative">
        <select
      className="bg-[#7077FE] text-white font-medium rounded-full px-4 py-2 appearance-none focus:outline-none cursor-pointer w-[110px] sm:w-[150px]"
          value={selectedDomain}
          onChange={handleDomainChange}
        >
          <option value="" disabled>
            Explore
          </option>
          {Domain.map((domain: any) => (
            <option key={domain.id} value={domain.slug}>
              {domain.name}
            </option>
          ))}
        </select>
<div className="absolute top-3 right-3 text-white text-xs pointer-events-none">
            ▼
        </div>
      </div>
 <div className="relative flex-1">
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

    {/* Info badges */}
    <div className="flex justify-center gap-3 flex-wrap mt-6">
      {["Get certified", "Listed on the top", "15+ Domains"].map((label, index) => (
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
      ))}
    </div>
  </div>
</section>

      {/* Marquee Section */}
      <div className="bg-white py-10">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {[topRow, bottomRow].map((row, rowIndex) => (
              <div key={rowIndex} className="overflow-hidden">
                <div className={`flex gap-4 sm:gap-6 w-max animate-bounce-x-${rowIndex === 0 ? "left" : "right"}`}>
                  {row.map((domain, i) => {
                    const key = domain.toLowerCase().replace(/\s/g, "");
                    const icon = iconMap[key] ?? "/fallback-icon.svg";
                    return (
                      <div
                        key={`${rowIndex}-${i}`}
                        onClick={() => setSelectedDomain(domain)}
                        className="h-[48px] border border-purple-100 rounded-[24px] px-5 py-2 sm:px-6 sm:py-3 flex items-center gap-2 sm:gap-3 bg-white shadow-sm hover:shadow-md cursor-pointer transition"
                      >
                        <img
                          src={icon}
                          alt={domain}
                          className="w-6 h-6 min-w-[24px] object-contain shrink-0"
                        />
                        <span className="text-sm font-medium text-gray-800 leading-none">
                          {domain}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Why List Section */}
      <section className="bg-[#FAFAFA] py-16">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-20">
            {/* Left Image */}
            <div className="w-full md:w-auto flex justify-center">
              <img
                src={iconMap["leftimg"]}
                alt="Listing Benefits"
                className="w-full max-w-sm rounded-sm shadow"
              />
            </div>

            {/* Right Text Block */}
            <div className="flex-1 text-center md:text-left">
  <h2 className="text-sm sm:text-md font-bold text-[#7077FE] uppercase mb-7">
    Why List in the Directory?
  </h2>

  <ul className="list-disc list-inside text-left md:text-left space-y-5 text-gray-700 text-base leading-relaxed px-4 sm:px-0">
    <li><strong>Visibility:</strong> Showcase your conscious brand to a growing community.</li>
    <li><strong>Credibility:</strong> Get CNESS certified to build trust with users and clients.</li>
    <li><strong>Networking:</strong> Connect with like-minded individuals and organizations.</li>
    <li><strong>Searchable by Industry:</strong> Make it easy for people to find your offering by sector.</li>
    <li><strong>Impact:</strong> Lead the change and inspire others in the conscious ecosystem.</li>
  </ul>

  <div className="mt-6 flex justify-center md:justify-start">
    <button
      className="text-white px-6 py-2 rounded-full shadow transition font-medium"
      style={{
        background: "linear-gradient(97.01deg, #7077FE 7.84%, #F07EFF 106.58%)",
      }}
    >
      Register Now
    </button>
    </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Popular Companies */}

   
         {/* Popular Companies Section */}
      <section className="py-16 border-t border-gray-100">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-semibold mb-4">Popular Companies</h2>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedPopular.length > 0 ? (
              paginatedPopular.map((company) => (
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
              ))
            ) : (
              <p className="text-gray-500">No popular companies found.</p>
            )}
          </div>
        </div>
      </section>

      {/* pagination */}
      <div className="mt-8">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-end">
          <nav
            className="inline-flex rounded-md shadow-sm -space-x-px text-sm"
            aria-label="Pagination"
          >
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-l-md bg-white border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-40"
            >
              «
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 border border-gray-300 ${
                  page === currentPage
                    ? "bg-indigo-500 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-r-md bg-white border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-40"
            >
              »
            </button>
          </nav>
        </div>
      </div>

      {/* Aspiring Companies Section */}
 <section className="py-16 border-t border-gray-100">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-semibold mb-4">Popular Companies</h2>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedAspiring.length > 0 ? (
              paginatedAspiring.map((company) => (
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
              ))
            ) : (
              <p className="text-gray-500">No aspiring companies found.</p>
            )}
          </div>
        </div>
      </section>

      <div className="mt-8">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-end">
          <nav
            className="inline-flex rounded-md shadow-sm -space-x-px text-sm"
            aria-label="Pagination"
          >
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-l-md bg-white border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-40"
            >
              «
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 border border-gray-300 ${
                  page === currentPage
                    ? "bg-indigo-500 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-r-md bg-white border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-40"
            >
              »
            </button>
          </nav>
        </div>
      </div>

      <Footer />
    </>
  );
}
