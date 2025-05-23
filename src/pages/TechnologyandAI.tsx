  import Header from "../layout/Header/Header";
  import Footer from "../layout/Footer/Footer";

  import { useState, useEffect } from 'react';
  import CompanyCard from '../components/ui/CompanyCard';
  import { iconMap } from '../assets/icons';
  import {
  Filter,
  SortAsc,
  SortDesc,
} from 'lucide-react';


interface Company {
   id: number;
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


  const companyListMock: Company[] = [
    {
      id: 1,
      name: 'Stellar Innovation',
      domain: 'Technology and AI',
      logoUrl: iconMap['companylogo1'],
      bannerUrl: iconMap['companycard1'],
      location: 'Hyderabad',
      description: 'We transform innovative ideas into tangible realities.',
      tags: ['Tag 1', 'Tag 2', 'Tag 3'],
      rating: 4,
      isCertified: true,
    },
    {
         id: 2,
      name: 'Innovative Solutions',
      domain: 'Technology and AI',
      logoUrl: iconMap["companylogo2"],
      bannerUrl:  iconMap["companycard2"],
      location: 'Bangalore',
      description: 'We deliver cutting-edge technology solutions globally.',
      tags: ['Tag 4', 'Tag 2', 'Tag 5'],
      rating: 5,
      isCertified: true,
    },
    {
       id: 3,
      name: 'Info Tech',
      domain: 'Technology and AI',
      logoUrl: iconMap["companylogo3"],
      bannerUrl: iconMap["companycard3"],
      location: 'Chennai',
      description: 'Driving creativity with advanced tech tools.',
      tags: ['Tag 3', 'Tag 6'],
      rating: 4,
      isCertified: true,
    },


    {
       id: 4,
      name: 'Tech innovations',
      domain: 'Technology and AI',
      logoUrl: iconMap['comlogo'],
      bannerUrl: iconMap['companycard3'],
      location: 'Chennai',
      description: 'Driving creativity with advanced tech tools.',
      tags: ['Tag 3', 'Tag 6'],
      rating: 4,
      isCertified: true,
    },

        {
           id: 5,
      name: 'Stellar Innovation',
      domain: 'Technology and AI',
      logoUrl: iconMap['companylogo1'],
      bannerUrl: iconMap['companycard1'],
      location: 'Hyderabad',
      description: 'We transform innovative ideas into tangible realities.',
      tags: ['Tag 1', 'Tag 2', 'Tag 3'],
      rating: 4,
      isCertified: true,
    },

       {
         id: 6,
      name: 'Innovative Solutions',
      domain: 'Technology and AI',
      logoUrl: iconMap['companylogo2'],
      bannerUrl:  iconMap['companycard2'],
      location: 'Bangalore',
      description: 'We deliver cutting-edge technology solutions globally.',
      tags: ['Tag 4', 'Tag 2', 'Tag 5'],
      rating: 5,
      isCertified: true,
    },
    // Add more entries as needed
  ];

  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'az' | 'za'>('az');
  const [page, setPage] = useState(1);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>(companyListMock);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);



useEffect(() => {
  let results = [...companyListMock];

  if (search) {
    results = results.filter(company =>
      company.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  results.sort((a, b) =>
    sort === 'az' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
  );

  setFilteredCompanies(results);
}, [search, sort]);


const paginated = filteredCompanies.slice(
  (currentPage - 1) * itemsPerPage,
  currentPage * itemsPerPage
);

useEffect(() => {
  setCurrentPage(1);
}, [search, sort]);


  return (
    <>
    <Header />
    
    <div className="w-full bg-[#f9f7ff] px-8 py-[34px]">
  <h1 className="text-xl font-bold text-gray-900 mb-4">Technology and AI</h1>

  <div className="flex items-center w-full max-w-2xl rounded-full bg-white overflow-hidden shadow-sm border border-[#CBD5E1]  ">
     <div className="relative">
              <select className="bg-[#7077FE] text-white font-medium rounded-full px-5 py-2 appearance-none focus:outline-none cursor-pointer">
                <option>Explore</option>
                <option>Domain 1</option>
                <option>Domain 2</option>
                <option>Domain 3</option>
                <option>Domain 4</option>
                <option>Domain 5</option>
                <option>Domain 6</option>
              </select>
              <div className="absolute top-3 right-3 text-white text-xs pointer-events-none">
                ▼
              </div>
            </div>

    <input
      type="text"
       value={search}
  onChange={(e) => setSearch(e.target.value)}
      placeholder="Find & Choose your perfect organization"
      className="flex-1 px-4 py-2 text-sm text-gray-500 placeholder-gray-400 outline-none"
    />
    <div className="pr-4 text-gray-700">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M9.5 17a7.5 7.5 0 100-15 7.5 7.5 0 000 15z" />
      </svg>
    </div>
  </div>
  </div>

<div className="w-full max-w-[2100px] mx-auto px-9 py-6 grid grid-cols-[300px_1fr] gap-3">
  {/* Left Sidebar */}
  <aside className="w-64 px-4 py-8 border-r border-gray-100 bg-white">
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
          <li className="flex items-center gap-2 cursor-pointer">
            <SortAsc size={16} /> Sort A-Z
          </li>
          <li className="flex items-center gap-2 cursor-pointer">
            <SortDesc size={16} /> Sort Z-A
          </li>
        </ul>
      </div>
    </aside>

  {/* Right Content (Company Grid) */}
<main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-2 gap-y-7 items-stretch">
  {paginated.map((company) => (
    <CompanyCard key={company.id} {...company} />
  ))}
</main>
</div>



{/* pagination */}
      <div className="mt-8">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-1 flex justify-end">
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