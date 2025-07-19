<<<<<<< Updated upstream
=======
<<<<<<< HEAD
>>>>>>> Stashed changes
  import { useState } from 'react';
  import CompanyCard from '../components/ui/CompanyCard';
  import Header from "../layout/Header/Header";
  import Footer from "../layout/Footer/Footer";
  import { iconMap } from '../assets/icons';
  import AnimatedBackground from "../components/ui/AnimatedBackground";
<<<<<<< Updated upstream
=======


  const itemsPerPage = 6;
=======
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
>>>>>>> bffa1a25b402748218cbdde95389950382c4d8dc

  const domains = [
    "Domain 1", "Domain 2", "Domain 3", "Domain 4", "Domain 5", "Domain 6", "Domain 7","Domain 8", "Domain 9", "Domain 10", "Domain 11", "Domain 12", "Domain 13", "Domain 14",
    "Domain 1", "Domain 2", "Domain 3", "Domain 4", "Domain 5", "Domain 6", "Domain 7","Domain 8", "Domain 9", "Domain 10", "Domain 11", "Domain 12", "Domain 13", "Domain 14",
  ];

  const sampleCompanies: Company[] = [
    {
      id: 1,
      name: "EcoTech",
      location: "Hyderabad",
      domain: "Domain 1",
      category: "Popular",
      logo: iconMap['companylogo1'],
      banner: iconMap['companycard1'],
      description: "EcoTech description",
      tags: ["Green", "Tech"],
      rating: 4,
      isCertified: true,
    },

<<<<<<< HEAD
      {
      id: 2,
      name: "Innovative Solutions",
      location: "Bangalore",
      domain: "Domain 2",
      category: "Popular",
      logo: iconMap['companylogo2'],
      banner: iconMap['companycard2'],
      description: "Innovative Solutions",
      tags: ["Tag1", "Tag2"],
      rating: 3,
      isCertified: true,
    },
=======
  const location = useLocation();
  const isInDashboard = location.pathname.includes("/dashboard");
  const measureRef = useRef<HTMLSpanElement>(null);
  const [selectedDomainText, setSelectedDomainText] = useState("All Profession");
  const [textWidth, setTextWidth] = useState(0);
>>>>>>> bffa1a25b402748218cbdde95389950382c4d8dc

    {
      id: 3,
      name: "Innovative Solutions",
      location: "Bangalore",
      domain: "Domain 2",
      category: "Popular",
      logo: iconMap['companylogo2'],
      banner: iconMap['companycard2'],
      description: "Innovative Solutions",
      tags: ["Tag1", "Tag2"],
      rating: 3,
      isCertified: true,
    },


<<<<<<< HEAD
    {
      id: 4,
      name: "Tech Innovations Inc.",
      location: "Chennai",
      domain: "Domain 5",
      category: "Popular",
      logo: iconMap['companylogo2'],
      banner: iconMap['companycard2'],
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
      logo: iconMap['companylogo2'],
      banner: iconMap['companycard2'],
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
    logo: iconMap['aspcompany1'],
    banner: iconMap['aspcompany1'],
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
    logo: iconMap['aspcompany2'],
    banner: iconMap['aspcompany2'],
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
    logo: iconMap['aspcompany2'],
    banner: iconMap['aspcompany2'],
    description: "Empowering change through innovation.",
    tags: ["Ethical", "Tech"],
    rating: 4,
    isCertified: false,
  }
    // ...more
  ];

  type Company = {
    id: number;
    name: string;
    location: string;
    domain: string;
    category: 'Popular' | 'Aspiring';
    logo: string;
    banner: string;
    description: string;
    tags: string[];
    rating: number;
    isCertified?: boolean;
  };

  {sampleCompanies.map((company: Company) => (
    <CompanyCard
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

=======
  const [popularCompanies, setPopularCompanies] = useState<Company[]>([]);
  console.log("🚀 ~ DirectoryPage ~ popularCompanies:", popularCompanies);
  const [aspiringCompanies, setAspiringCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState({
    popular: false,
    inspiring: false,
  });
>>>>>>> Stashed changes


  const itemsPerPage = 6;

  const domains = [
    "Domain 1", "Domain 2", "Domain 3", "Domain 4", "Domain 5", "Domain 6", "Domain 7","Domain 8", "Domain 9", "Domain 10", "Domain 11", "Domain 12", "Domain 13", "Domain 14",
    "Domain 1", "Domain 2", "Domain 3", "Domain 4", "Domain 5", "Domain 6", "Domain 7","Domain 8", "Domain 9", "Domain 10", "Domain 11", "Domain 12", "Domain 13", "Domain 14",
  ];

  const sampleCompanies: Company[] = [
    {
      id: 1,
      name: "EcoTech",
      location: "Hyderabad",
      domain: "Domain 1",
      category: "Popular",
      logo: iconMap['companylogo1'],
      banner: iconMap['companycard1'],
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
      logo: iconMap['companylogo2'],
      banner: iconMap['companycard2'],
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
      logo: iconMap['companylogo2'],
      banner: iconMap['companycard2'],
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
      logo: iconMap['companylogo2'],
      banner: iconMap['companycard2'],
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
      logo: iconMap['companylogo2'],
      banner: iconMap['companycard2'],
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
    logo: iconMap['aspcompany1'],
    banner: iconMap['aspcompany1'],
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
    logo: iconMap['aspcompany2'],
    banner: iconMap['aspcompany2'],
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
    logo: iconMap['aspcompany2'],
    banner: iconMap['aspcompany2'],
    description: "Empowering change through innovation.",
    tags: ["Ethical", "Tech"],
    rating: 4,
    isCertified: false,
  }
    // ...more
  ];

  type Company = {
    id: number;
    name: string;
    location: string;
    domain: string;
    category: 'Popular' | 'Aspiring';
    logo: string;
    banner: string;
    description: string;
    tags: string[];
    rating: number;
    isCertified?: boolean;
  };

  {sampleCompanies.map((company: Company) => (
    <CompanyCard
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

<<<<<<< Updated upstream



  export default function DirectoryPage() {
    const [selectedDomain, setSelectedDomain] = useState("");
    // const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
=======
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
>>>>>>> bffa1a25b402748218cbdde95389950382c4d8dc


<<<<<<< HEAD

  export default function DirectoryPage() {
    const [selectedDomain, setSelectedDomain] = useState("");
    // const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
=======
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
>>>>>>> bffa1a25b402748218cbdde95389950382c4d8dc
>>>>>>> Stashed changes

  const filteredCompanies = selectedDomain
      ? sampleCompanies.filter((c) => c.domain === selectedDomain)
      : sampleCompanies;

<<<<<<< Updated upstream
    const popularCompanies = filteredCompanies.filter((c) => c.category === 'Popular');
    const aspiringCompanies = filteredCompanies.filter((c) => c.category === 'Aspiring');

    const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);
=======
<<<<<<< HEAD
    const popularCompanies = filteredCompanies.filter((c) => c.category === 'Popular');
    const aspiringCompanies = filteredCompanies.filter((c) => c.category === 'Aspiring');

    const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);
=======
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
>>>>>>> bffa1a25b402748218cbdde95389950382c4d8dc
>>>>>>> Stashed changes

    const paginatedPopular = popularCompanies.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

    const paginatedAspiring = aspiringCompanies.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );

<<<<<<< Updated upstream
=======
<<<<<<< HEAD
>>>>>>> Stashed changes
  const topRow = domains.slice(0, 7);
  const bottomRow = domains.slice(7);

    return (
      <>
        <Header />
<<<<<<< Updated upstream

      {/* Hero Section */}
      
    <div className="w-full h-[650px]  relative overflow-hidden">
    <AnimatedBackground />
    {/* Building background image */}
    <img
      src={iconMap['heroimg']} // adjust path if needed
      alt="City Skyline"
      className="absolute bottom-[-150px] left-0 w-full object-cover z-0 pointer-events-none"
    />
=======

      {/* Hero Section */}
      
    <div className="w-full h-[650px]  relative overflow-hidden">
    <AnimatedBackground />
    {/* Building background image */}
    <img
      src={iconMap['heroimg']} // adjust path if needed
      alt="City Skyline"
      className="absolute bottom-[-150px] left-0 w-full object-cover z-0 pointer-events-none"
    />
=======
  return (
    <>
      {!isInDashboard && <Header />}

      {/* Hero Section */}
      <section className="relative h-auto md:h-[692px] rounded-[12px] overflow-hidden mx-4 sm:mx-6 md:mx-8">
        <AnimatedBackground />
>>>>>>> bffa1a25b402748218cbdde95389950382c4d8dc
>>>>>>> Stashed changes

    {/* Hero Content */}
    <div className="px-6 sm:px-8 lg:px-10 text-center py-25 relative z-10">
      <p className="text-xl text-[#7077FE] font-bold mb-15">Conscious Directory</p>
      <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-12">
        Conscious Search Stops here.
      </h1>

      {/* Dropdown + Search */}
      <div className="w-full max-w-3xl mx-auto bg-white border border-gray-200 rounded-full flex items-center px-2 py-2 shadow-sm">
        <div className="relative">
          <select
            className="bg-[#7077FE] text-white font-medium rounded-full px-5 py-2 appearance-none focus:outline-none cursor-pointer"
          >
            <option>Explore</option>
            <option>Domain 1</option>
            <option>Domain 2</option>
            <option>Domain 3</option>
            <option>Domain 4</option>
            <option>Domain 5</option>
            <option>Domain 6</option>
          </select>
          <div className="absolute top-3 right-3 text-white text-xs pointer-events-none">▼</div>
        </div>

        <input
          type="text"
          placeholder="Find & Choose your perfect organization"
          className="flex-1 px-4 bg-transparent text-gray-700 placeholder:text-gray-400 outline-none border-none"
        />

<<<<<<< Updated upstream
=======
<<<<<<< HEAD
>>>>>>> Stashed changes
        <button className="text-gray-500 hover:text-black p-2">
          🔍
        </button>
      </div>
<<<<<<< Updated upstream
=======

      <p className="text-gray-700 text-18px mt-6">
        <span className="font-medium underline cursor-pointer">List your company now</span> and connect with conscious audience
      </p>
=======
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 py-12 md:py-20 max-w-4xl mx-auto">
          <p className="text-lg sm:text-xl text-[#7077FE] font-bold mb-4">
            Conscious Directory
          </p>
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-gray-800 mb-4">
            Conscious Search Stops here.
          </h1>
>>>>>>> Stashed changes

      <p className="text-gray-700 text-18px mt-6">
        <span className="font-medium underline cursor-pointer">List your company now</span> and connect with conscious audience
      </p>

<<<<<<< Updated upstream
      <div className="flex justify-center gap-4 mt-6 flex-wrap">
        <span className="bg-white px-4 py-2 rounded-full shadow text-sm font-medium flex items-center gap-2">
          <img src={iconMap['verified']} alt="Verified" className="w-5 h-5" /> Get certified
        </span>
        <span className="bg-white px-4 py-2 rounded-full shadow text-sm font-medium flex items-center gap-2">
          <img src={iconMap['verified']} alt="Verified" className="w-5 h-5" /> Listed on the top
        </span>
        <span className="bg-white px-4 py-2 rounded-full shadow text-sm font-medium flex items-center gap-2">
          <img src={iconMap['verified']} alt="Verified" className="w-5 h-5" /> 15+ Domains
        </span>
      </div>
    </div>
  </div>


  {/* Marquee Section */}
      {/* Marquee Section */}
=======
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
>>>>>>> bffa1a25b402748218cbdde95389950382c4d8dc

      <div className="flex justify-center gap-4 mt-6 flex-wrap">
        <span className="bg-white px-4 py-2 rounded-full shadow text-sm font-medium flex items-center gap-2">
          <img src={iconMap['verified']} alt="Verified" className="w-5 h-5" /> Get certified
        </span>
        <span className="bg-white px-4 py-2 rounded-full shadow text-sm font-medium flex items-center gap-2">
          <img src={iconMap['verified']} alt="Verified" className="w-5 h-5" /> Listed on the top
        </span>
        <span className="bg-white px-4 py-2 rounded-full shadow text-sm font-medium flex items-center gap-2">
          <img src={iconMap['verified']} alt="Verified" className="w-5 h-5" /> 15+ Domains
        </span>
      </div>
    </div>
  </div>


  {/* Marquee Section */}
      {/* Marquee Section */}
<<<<<<< HEAD
>>>>>>> Stashed changes
          {/* Marquee Section */}
<div className="bg-white py-10">
  <div className="max-w-screen-xl mx-auto px-2 sm:px-6 lg:px-8">
    <div className="space-y-4">
      {/* Top Row (Left ↔ Right) */}
      <div className="overflow-hidden">
        <div className="flex gap-6 animate-bounce-x-left w-max">
          {topRow.map((domain, i) => {
            const key = domain.toLowerCase().replace(/\s/g, '');
            const icon = iconMap[key] ?? '/fallback-icon.svg'; // fallback if missing
            return (
              <div
                key={`top-${i}`}
                onClick={() => setSelectedDomain(domain)}
                className=" h-[48px] border border-purple-100 rounded-[24px] px-6 py-3 flex items-center gap-3 bg-white shadow-sm hover:shadow-md cursor-pointer transition"
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
<<<<<<< Updated upstream
=======
        </div>
      </div>

      {/* Bottom Row (Right ↔ Left) */}
      <div className="overflow-hidden">
        <div className="flex gap-6 animate-bounce-x-right w-max">
          {bottomRow.map((domain, i) => { 
            const key = domain.toLowerCase().replace(/\s/g, '');
            const icon = iconMap[key] ?? '/fallback-icon.svg';
            return (
              <div
  key={`bottom-${i}`}
  onClick={() => setSelectedDomain(domain)}
  className=" h-[48px] border border-purple-100 rounded-[24px] px-6 py-2 flex items-center gap-3 bg-white shadow-sm hover:shadow-md cursor-pointer transition"
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
    </div>
  </div>
</div>
=======
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
>>>>>>> Stashed changes
        </div>
      </div>
>>>>>>> bffa1a25b402748218cbdde95389950382c4d8dc

<<<<<<< Updated upstream
      {/* Bottom Row (Right ↔ Left) */}
      <div className="overflow-hidden">
        <div className="flex gap-6 animate-bounce-x-right w-max">
          {bottomRow.map((domain, i) => { 
            const key = domain.toLowerCase().replace(/\s/g, '');
            const icon = iconMap[key] ?? '/fallback-icon.svg';
            return (
              <div
  key={`bottom-${i}`}
  onClick={() => setSelectedDomain(domain)}
  className=" h-[48px] border border-purple-100 rounded-[24px] px-6 py-2 flex items-center gap-3 bg-white shadow-sm hover:shadow-md cursor-pointer transition"
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
    </div>
  </div>
</div>

=======
>>>>>>> Stashed changes




          {/* Why List Section */}
      <section className="bg-[#FAFAFA] py-16">
<<<<<<< Updated upstream
=======
<<<<<<< HEAD
>>>>>>> Stashed changes
  <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="bg-[#FAFAFA]  flex flex-col md:flex-row items-start gap-25 shadow-none">
      
      {/* Left Image */}
      <img
        src={iconMap['leftimg']}
        alt="Listing Benefits"
        className="w-full max-w-sm rounded-sm shadow"
      />
<<<<<<< Updated upstream
=======
=======
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
            <div className="w-full md:w-auto flex justify-center">
              <img
                src={iconMap["leftimg"]}
                alt="Listing Benefits"
                className="w-full max-w-sm rounded-sm shadow"
              />
            </div>
>>>>>>> bffa1a25b402748218cbdde95389950382c4d8dc
>>>>>>> Stashed changes

      {/* Right Text Block */}
      <div className="flex-1">
        <h2 className="text-md font-bold text-[#7077FE] uppercase mb-6">
          Why List in the Directory?
        </h2>

        <ul className="list-disc list-inside space-y-5 text-gray-700 text-base leading-relaxed">
          <li><strong>Visibility:</strong> Showcase your conscious brand to a growing community.</li>
          <li><strong>Credibility:</strong> Get CNESS certified to build trust with users and clients.</li>
          <li><strong>Networking:</strong> Connect with like-minded individuals and organizations.</li>
          <li><strong>Searchable by Industry:</strong> Make it easy for people to find your offering by sector.</li>
          <li><strong>Impact:</strong> Lead the change and inspire others in the conscious ecosystem.</li>
        </ul>
<br></br>
        <button
  className="text-white px-6 py-2 rounded-full shadow transition font-medium"
  style={{
    background: 'linear-gradient(97.01deg, #7077FE 7.84%, #F07EFF 106.58%)'
  }}
>
  Register Now
</button>
      </div>
    </div>
  </div>
</section>

<<<<<<< Updated upstream
=======
<<<<<<< HEAD
>>>>>>> Stashed changes

  {/* Section: Popular Companies */}

        {/* Popular Companies Section */}
{/* Popular Companies Section */}
<section className="py-16 border-t border-gray-100">
  <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
    <h2 className="text-xl font-semibold mb-4">Popular Companies</h2>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {paginatedPopular.length > 0 ? (
        paginatedPopular.map((company) => (
          <CompanyCard
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
          <nav className="inline-flex rounded-md shadow-sm -space-x-px text-sm" aria-label="Pagination">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-l-md bg-white border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-40"
            >«</button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 border border-gray-300 ${
                  page === currentPage
                    ? "bg-indigo-500 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >{page}</button>
            ))}

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-r-md bg-white border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-40"
            >»</button>
          </nav>
          
<<<<<<< Updated upstream
=======
=======
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
>>>>>>> bffa1a25b402748218cbdde95389950382c4d8dc
>>>>>>> Stashed changes
        </div>
        
      </div>
            
      
  

        {/* Aspiring Companies Section */}
        <section className="py-16 border-t border-gray-100">
  <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
    <h2 className="text-xl font-semibold mb-4">Aspiring Companies</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {paginatedAspiring.length > 0 ? paginatedAspiring.map((company) => (
        <CompanyCard
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
      )) : <p className="text-gray-500">No aspiring companies found.</p>}
    </div>
  </div>
</section>

<<<<<<< Updated upstream
=======
<<<<<<< HEAD
>>>>>>> Stashed changes
      <div className="mt-8">
  <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-end">
          <nav className="inline-flex rounded-md shadow-sm -space-x-px text-sm" aria-label="Pagination">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded-l-md bg-white border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-40"
            >«</button>
<<<<<<< Updated upstream
=======
=======
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
>>>>>>> bffa1a25b402748218cbdde95389950382c4d8dc
>>>>>>> Stashed changes

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 border border-gray-300 ${
                  page === currentPage
                    ? "bg-indigo-500 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >{page}</button>
            ))}

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded-r-md bg-white border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-40"
            >»</button>
          </nav>
          
        </div>
        
      </div>
  

<<<<<<< Updated upstream
=======
<<<<<<< HEAD
>>>>>>> Stashed changes
        <Footer />
      </>
    );
  }
<<<<<<< Updated upstream
=======
=======
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
>>>>>>> bffa1a25b402748218cbdde95389950382c4d8dc
>>>>>>> Stashed changes
