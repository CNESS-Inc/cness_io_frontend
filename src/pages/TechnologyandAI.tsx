  import Header from "../layout/Header/Header";
  import Footer from "../layout/Footer/Footer";

  import { useState, useEffect } from 'react';
  import CompanyCard from '../components/ui/CompanyCard';
  import { iconMap } from '../assets/icons';


interface Company {
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
      name: 'Innovative Solutions',
      domain: 'Technology and AI',
      logoUrl: iconMap['companylogo2'],
      bannerUrl:  iconMap['companycard1'],
      location: 'Bangalore',
      description: 'We deliver cutting-edge technology solutions globally.',
      tags: ['Tag 4', 'Tag 2', 'Tag 5'],
      rating: 5,
      isCertified: true,
    },
    {
      name: 'Creative Innovations',
      domain: 'Technology and AI',
      logoUrl: '/images/creative-logo.png',
      bannerUrl: '/images/creative-banner.jpg',
      location: 'Chennai',
      description: 'Driving creativity with advanced tech tools.',
      tags: ['Tag 3', 'Tag 6'],
      rating: 4,
      isCertified: true,
    },
    // Add more entries as needed
  ];

  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'az' | 'za'>('az');
  const [page, setPage] = useState(1);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>(companyListMock);

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

  const companiesPerPage = 9;
  const paginated = filteredCompanies.slice(
    (page - 1) * companiesPerPage,
    page * companiesPerPage
  );

  return (
    <div className="bg-[#FFF6E8] min-h-screen">
      {/* Header */}
      <div className="p-6">
        <h1 className="text-2xl font-bold">Technology and AI</h1>
      </div>

      {/* Search + Content */}
      <div className="flex flex-col md:flex-row gap-6 px-4 md:px-10">
        {/* Sidebar */}
        <aside className="md:w-1/4">
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Sort</h3>
              <label className="block">
                <input
                  type="radio"
                  name="sort"
                  checked={sort === 'az'}
                  onChange={() => setSort('az')}
                />{' '}
                A - Z
              </label>
              <label className="block">
                <input
                  type="radio"
                  name="sort"
                  checked={sort === 'za'}
                  onChange={() => setSort('za')}
                />{' '}
                Z - A
              </label>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="md:w-3/4">
          <div className="flex gap-2 mb-6">
            <input
              type="text"
              placeholder="Find & Choose your perfect organization"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border rounded-full px-4 py-2"
            />
          </div>

          {/* Company Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginated.map((company) => (
              <CompanyCard key={company.name} {...company} />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-6">
            <button onClick={() => setPage(p => Math.max(p - 1, 1))}>&lt;</button>
            <span className="mx-4 font-semibold">{page}</span>
            <button
              onClick={() =>
                setPage(p => (p * companiesPerPage < filteredCompanies.length ? p + 1 : p))
              }
            >
              &gt;
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}