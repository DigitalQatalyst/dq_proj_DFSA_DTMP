import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, SearchIcon, SlidersIcon, TrendingUpIcon, ZapIcon, DatabaseIcon, GlobeIcon, ShoppingBagIcon, HeartIcon, BookOpenIcon, TruckIcon, LeafIcon, PaletteIcon, PlaneIcon, FilterIcon, XIcon, ChevronDownIcon, ChevronUpIcon, CheckIcon, DownloadIcon } from 'lucide-react';
import SectorCard from '../components/SectorCard';
// Types for our marketplace
interface Sector {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  growth: string;
  investment: string;
  color: string;
  detailsContent?: React.ReactNode;
  growthValue: number;
  investmentValue: number;
  category: string;
}
// Filter options
type SortOption = 'default' | 'growthAsc' | 'growthDesc' | 'investmentAsc' | 'investmentDesc';
type CategoryFilter = string | 'all';
const GrowthAreasMarketplace = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [filteredSectors, setFilteredSectors] = useState<Sector[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const sectorsPerPage = 9;
  const pageRef = useRef<HTMLDivElement>(null);
  // Populate the sectors data
  useEffect(() => {
    // This would normally come from an API
    const allSectors: Sector[] = [{
      id: '1',
      title: 'Technology',
      description: 'Leading innovation hub for AI, fintech, and digital transformation with world-class infrastructure.',
      icon: <TrendingUpIcon size={28} className="text-primary" />,
      growth: '12.5%',
      investment: '$10B+',
      color: 'bg-primary',
      growthValue: 12.5,
      investmentValue: 10,
      category: 'Digital Economy',
      detailsContent: <div>
            <h4 className="font-display text-lg font-bold mb-4">
              Key Opportunities
            </h4>
            <ul className="space-y-3">
              <li className="flex">
                <CheckIcon size={18} className="text-primary mr-3 mt-1 flex-shrink-0" />
                <span>
                  AI and Machine Learning research partnerships with MBZUAI
                </span>
              </li>
              <li className="flex">
                <CheckIcon size={18} className="text-primary mr-3 mt-1 flex-shrink-0" />
                <span>
                  Hub71 startup ecosystem with global connections and funding
                </span>
              </li>
              <li className="flex">
                <CheckIcon size={18} className="text-primary mr-3 mt-1 flex-shrink-0" />
                <span>Smart City initiatives with government backing</span>
              </li>
            </ul>
            <div className="mt-6">
              <button id="download-Technology" className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors shadow-sm" onClick={() => handleDownloadReport('Technology')}>
                <DownloadIcon size={16} className="mr-2" />
                Download Report
              </button>
            </div>
          </div>
    }, {
      id: '2',
      title: 'Energy',
      description: 'Pioneering sustainable energy solutions while leveraging traditional energy expertise.',
      icon: <ZapIcon size={28} className="text-teal" />,
      growth: '8.3%',
      investment: '$15B+',
      color: 'bg-teal',
      growthValue: 8.3,
      investmentValue: 15,
      category: 'Sustainability',
      detailsContent: <div>
            <h4 className="font-display text-lg font-bold mb-4">
              Key Opportunities
            </h4>
            <ul className="space-y-3">
              <li className="flex">
                <CheckIcon size={18} className="text-teal mr-3 mt-1 flex-shrink-0" />
                <span>Masdar City clean technology partnerships</span>
              </li>
              <li className="flex">
                <CheckIcon size={18} className="text-teal mr-3 mt-1 flex-shrink-0" />
                <span>Solar energy development with IRENA headquarters</span>
              </li>
              <li className="flex">
                <CheckIcon size={18} className="text-teal mr-3 mt-1 flex-shrink-0" />
                <span>
                  Energy transition consulting for traditional energy companies
                </span>
              </li>
            </ul>
            <div className="mt-6">
              <button id="download-Energy" className="inline-flex items-center px-4 py-2 bg-teal text-white rounded-lg font-medium hover:bg-teal-dark transition-colors shadow-sm" onClick={() => handleDownloadReport('Energy')}>
                <DownloadIcon size={16} className="mr-2" />
                Download Report
              </button>
            </div>
          </div>
    }, {
      id: '3',
      title: 'Finance',
      description: 'International financial center with progressive regulatory frameworks and global connections.',
      icon: <DatabaseIcon size={28} className="text-purple" />,
      growth: '7.2%',
      investment: '$8B+',
      color: 'bg-purple',
      growthValue: 7.2,
      investmentValue: 8,
      category: 'Financial Services',
      detailsContent: <div>
            <h4 className="font-display text-lg font-bold mb-4">
              Key Opportunities
            </h4>
            <ul className="space-y-3">
              <li className="flex">
                <CheckIcon size={18} className="text-purple mr-3 mt-1 flex-shrink-0" />
                <span>
                  Abu Dhabi Global Market (ADGM) financial services licensing
                </span>
              </li>
              <li className="flex">
                <CheckIcon size={18} className="text-purple mr-3 mt-1 flex-shrink-0" />
                <span>Sovereign wealth fund partnerships with ADIA</span>
              </li>
              <li className="flex">
                <CheckIcon size={18} className="text-purple mr-3 mt-1 flex-shrink-0" />
                <span>Islamic Finance innovation hub</span>
              </li>
            </ul>
            <div className="mt-6">
              <button id="download-Finance" className="inline-flex items-center px-4 py-2 bg-purple text-white rounded-lg font-medium hover:bg-purple-dark transition-colors shadow-sm" onClick={() => handleDownloadReport('Finance')}>
                <DownloadIcon size={16} className="mr-2" />
                Download Report
              </button>
            </div>
          </div>
    }, {
      id: '4',
      title: 'Tourism',
      description: 'Luxury destination blending cultural heritage with modern attractions and world-class hospitality.',
      icon: <GlobeIcon size={28} className="text-primary-light" />,
      growth: '9.5%',
      investment: '$12B+',
      color: 'bg-primary-light',
      growthValue: 9.5,
      investmentValue: 12,
      category: 'Hospitality',
      detailsContent: <div>
            <h4 className="font-display text-lg font-bold mb-4">
              Key Opportunities
            </h4>
            <ul className="space-y-3">
              <li className="flex">
                <CheckIcon size={18} className="text-primary-light mr-3 mt-1 flex-shrink-0" />
                <span>
                  Luxury hospitality investments with beachfront properties
                </span>
              </li>
              <li className="flex">
                <CheckIcon size={18} className="text-primary-light mr-3 mt-1 flex-shrink-0" />
                <span>
                  Cultural tourism leveraging Louvre Abu Dhabi and Zayed
                  National Museum
                </span>
              </li>
              <li className="flex">
                <CheckIcon size={18} className="text-primary-light mr-3 mt-1 flex-shrink-0" />
                <span>
                  MICE (Meetings, Incentives, Conferences, Exhibitions) industry
                  growth
                </span>
              </li>
            </ul>
            <div className="mt-6">
              <button id="download-Tourism" className="inline-flex items-center px-4 py-2 bg-primary-light text-white rounded-lg font-medium hover:bg-primary transition-colors shadow-sm" onClick={() => handleDownloadReport('Tourism')}>
                <DownloadIcon size={16} className="mr-2" />
                Download Report
              </button>
            </div>
          </div>
    }, {
      id: '5',
      title: 'Retail',
      description: 'Premium shopping destination with innovative retail concepts and digital marketplace growth.',
      icon: <ShoppingBagIcon size={28} className="text-teal-light" />,
      growth: '6.8%',
      investment: '$5B+',
      color: 'bg-teal-light',
      growthValue: 6.8,
      investmentValue: 5,
      category: 'Consumer Markets',
      detailsContent: <div>
            <h4 className="font-display text-lg font-bold mb-4">
              Key Opportunities
            </h4>
            <ul className="space-y-3">
              <li className="flex">
                <CheckIcon size={18} className="text-teal-light mr-3 mt-1 flex-shrink-0" />
                <span>
                  Luxury retail expansion in premium malls and destinations
                </span>
              </li>
              <li className="flex">
                <CheckIcon size={18} className="text-teal-light mr-3 mt-1 flex-shrink-0" />
                <span>E-commerce and omnichannel retail solutions</span>
              </li>
              <li className="flex">
                <CheckIcon size={18} className="text-teal-light mr-3 mt-1 flex-shrink-0" />
                <span>
                  Retail technology and experiential shopping concepts
                </span>
              </li>
            </ul>
            <div className="mt-6">
              <button id="download-Retail" className="inline-flex items-center px-4 py-2 bg-teal-light text-white rounded-lg font-medium hover:bg-teal transition-colors shadow-sm" onClick={() => handleDownloadReport('Retail')}>
                <DownloadIcon size={16} className="mr-2" />
                Download Report
              </button>
            </div>
          </div>
    }, {
      id: '6',
      title: 'Healthcare',
      description: 'Expanding medical tourism and healthcare innovation with state-of-the-art facilities.',
      icon: <HeartIcon size={28} className="text-purple-light" />,
      growth: '10.2%',
      investment: '$7B+',
      color: 'bg-purple-light',
      growthValue: 10.2,
      investmentValue: 7,
      category: 'Life Sciences',
      detailsContent: <div>
            <h4 className="font-display text-lg font-bold mb-4">
              Key Opportunities
            </h4>
            <ul className="space-y-3">
              <li className="flex">
                <CheckIcon size={18} className="text-purple-light mr-3 mt-1 flex-shrink-0" />
                <span>Medical tourism and specialized treatment centers</span>
              </li>
              <li className="flex">
                <CheckIcon size={18} className="text-purple-light mr-3 mt-1 flex-shrink-0" />
                <span>
                  Health tech innovations and digital health solutions
                </span>
              </li>
              <li className="flex">
                <CheckIcon size={18} className="text-purple-light mr-3 mt-1 flex-shrink-0" />
                <span>Pharmaceutical research and manufacturing</span>
              </li>
            </ul>
            <div className="mt-6">
              <button id="download-Healthcare" className="inline-flex items-center px-4 py-2 bg-purple-light text-white rounded-lg font-medium hover:bg-purple transition-colors shadow-sm" onClick={() => handleDownloadReport('Healthcare')}>
                <DownloadIcon size={16} className="mr-2" />
                Download Report
              </button>
            </div>
          </div>
    }, {
      id: '7',
      title: 'Education',
      description: 'World-class academic institutions and research centers fostering innovation and knowledge exchange.',
      icon: <BookOpenIcon size={28} className="text-primary" />,
      growth: '7.8%',
      investment: '$4.5B+',
      color: 'bg-primary',
      growthValue: 7.8,
      investmentValue: 4.5,
      category: 'Knowledge Economy',
      detailsContent: <div>
            <h4 className="font-display text-lg font-bold mb-4">
              Key Opportunities
            </h4>
            <ul className="space-y-3">
              <li className="flex">
                <CheckIcon size={18} className="text-primary mr-3 mt-1 flex-shrink-0" />
                <span>International university partnerships and campuses</span>
              </li>
              <li className="flex">
                <CheckIcon size={18} className="text-primary mr-3 mt-1 flex-shrink-0" />
                <span>EdTech innovations and digital learning platforms</span>
              </li>
              <li className="flex">
                <CheckIcon size={18} className="text-primary mr-3 mt-1 flex-shrink-0" />
                <span>
                  Vocational training aligned with economic diversification
                </span>
              </li>
            </ul>
            <div className="mt-6">
              <button id="download-Education" className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors shadow-sm" onClick={() => handleDownloadReport('Education')}>
                <DownloadIcon size={16} className="mr-2" />
                Download Report
              </button>
            </div>
          </div>
    }, {
      id: '8',
      title: 'Logistics',
      description: 'Strategic hub connecting global trade routes with advanced supply chain and transportation infrastructure.',
      icon: <TruckIcon size={28} className="text-teal" />,
      growth: '8.9%',
      investment: '$6.2B+',
      color: 'bg-teal',
      growthValue: 8.9,
      investmentValue: 6.2,
      category: 'Infrastructure',
      detailsContent: <div>
            <h4 className="font-display text-lg font-bold mb-4">
              Key Opportunities
            </h4>
            <ul className="space-y-3">
              <li className="flex">
                <CheckIcon size={18} className="text-teal mr-3 mt-1 flex-shrink-0" />
                <span>
                  Port expansion and maritime logistics hub development
                </span>
              </li>
              <li className="flex">
                <CheckIcon size={18} className="text-teal mr-3 mt-1 flex-shrink-0" />
                <span>Supply chain technology and automation solutions</span>
              </li>
              <li className="flex">
                <CheckIcon size={18} className="text-teal mr-3 mt-1 flex-shrink-0" />
                <span>
                  E-commerce fulfillment and last-mile delivery innovations
                </span>
              </li>
            </ul>
            <div className="mt-6">
              <button id="download-Logistics" className="inline-flex items-center px-4 py-2 bg-teal text-white rounded-lg font-medium hover:bg-teal-dark transition-colors shadow-sm" onClick={() => handleDownloadReport('Logistics')}>
                <DownloadIcon size={16} className="mr-2" />
                Download Report
              </button>
            </div>
          </div>
    }, {
      id: '9',
      title: 'Agritech',
      description: 'Innovative agricultural technologies addressing food security in arid environments through sustainable solutions.',
      icon: <LeafIcon size={28} className="text-purple" />,
      growth: '11.3%',
      investment: '$3.8B+',
      color: 'bg-purple',
      growthValue: 11.3,
      investmentValue: 3.8,
      category: 'Sustainability',
      detailsContent: <div>
            <h4 className="font-display text-lg font-bold mb-4">
              Key Opportunities
            </h4>
            <ul className="space-y-3">
              <li className="flex">
                <CheckIcon size={18} className="text-purple mr-3 mt-1 flex-shrink-0" />
                <span>Desert agriculture and vertical farming solutions</span>
              </li>
              <li className="flex">
                <CheckIcon size={18} className="text-purple mr-3 mt-1 flex-shrink-0" />
                <span>Water conservation and desalination technologies</span>
              </li>
              <li className="flex">
                <CheckIcon size={18} className="text-purple mr-3 mt-1 flex-shrink-0" />
                <span>
                  Food security initiatives and sustainable agriculture
                </span>
              </li>
            </ul>
            <div className="mt-6">
              <button id="download-Agritech" className="inline-flex items-center px-4 py-2 bg-purple text-white rounded-lg font-medium hover:bg-purple-dark transition-colors shadow-sm" onClick={() => handleDownloadReport('Agritech')}>
                <DownloadIcon size={16} className="mr-2" />
                Download Report
              </button>
            </div>
          </div>
    }, {
      id: '10',
      title: 'Creative Industries',
      description: 'Vibrant ecosystem for media, design, and cultural production with global reach and local authenticity.',
      icon: <PaletteIcon size={28} className="text-primary-light" />,
      growth: '9.2%',
      investment: '$2.7B+',
      color: 'bg-primary-light',
      growthValue: 9.2,
      investmentValue: 2.7,
      category: 'Digital Economy',
      detailsContent: <div>
            <h4 className="font-display text-lg font-bold mb-4">
              Key Opportunities
            </h4>
            <ul className="space-y-3">
              <li className="flex">
                <CheckIcon size={18} className="text-primary-light mr-3 mt-1 flex-shrink-0" />
                <span>Film and media production with regional incentives</span>
              </li>
              <li className="flex">
                <CheckIcon size={18} className="text-primary-light mr-3 mt-1 flex-shrink-0" />
                <span>Gaming and digital content development</span>
              </li>
              <li className="flex">
                <CheckIcon size={18} className="text-primary-light mr-3 mt-1 flex-shrink-0" />
                <span>Cultural and heritage tourism experiences</span>
              </li>
            </ul>
            <div className="mt-6">
              <button id="download-Creative" className="inline-flex items-center px-4 py-2 bg-primary-light text-white rounded-lg font-medium hover:bg-primary transition-colors shadow-sm" onClick={() => handleDownloadReport('Creative Industries')}>
                <DownloadIcon size={16} className="mr-2" />
                Download Report
              </button>
            </div>
          </div>
    }, {
      id: '11',
      title: 'Aerospace',
      description: 'Growing aerospace sector with manufacturing, maintenance, and space technology development capabilities.',
      icon: <PlaneIcon size={28} className="text-teal-light" />,
      growth: '7.5%',
      investment: '$5.5B+',
      color: 'bg-teal-light',
      growthValue: 7.5,
      investmentValue: 5.5,
      category: 'Manufacturing',
      detailsContent: <div>
            <h4 className="font-display text-lg font-bold mb-4">
              Key Opportunities
            </h4>
            <ul className="space-y-3">
              <li className="flex">
                <CheckIcon size={18} className="text-teal-light mr-3 mt-1 flex-shrink-0" />
                <span>
                  Aircraft maintenance, repair, and overhaul (MRO) facilities
                </span>
              </li>
              <li className="flex">
                <CheckIcon size={18} className="text-teal-light mr-3 mt-1 flex-shrink-0" />
                <span>Space technology and satellite development</span>
              </li>
              <li className="flex">
                <CheckIcon size={18} className="text-teal-light mr-3 mt-1 flex-shrink-0" />
                <span>Aviation training and simulation technology</span>
              </li>
            </ul>
            <div className="mt-6">
              <button id="download-Aerospace" className="inline-flex items-center px-4 py-2 bg-teal-light text-white rounded-lg font-medium hover:bg-teal transition-colors shadow-sm" onClick={() => handleDownloadReport('Aerospace')}>
                <DownloadIcon size={16} className="mr-2" />
                Download Report
              </button>
            </div>
          </div>
    }];
    setSectors(allSectors);
    setFilteredSectors(allSectors);
  }, []);
  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo(0, 0);
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('opacity-100', 'translate-y-0');
      }
    }, {
      threshold: 0.1
    });
    if (pageRef.current) {
      observer.observe(pageRef.current);
    }
    return () => {
      if (pageRef.current) {
        observer.unobserve(pageRef.current);
      }
    };
  }, []);
  // Apply filters and sorting
  useEffect(() => {
    let result = [...sectors];
    // Apply search filter
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(sector => sector.title.toLowerCase().includes(query) || sector.description.toLowerCase().includes(query));
    }
    // Apply category filter
    if (categoryFilter !== 'all') {
      result = result.filter(sector => sector.category === categoryFilter);
    }
    // Apply sorting
    switch (sortBy) {
      case 'growthAsc':
        result.sort((a, b) => a.growthValue - b.growthValue);
        break;
      case 'growthDesc':
        result.sort((a, b) => b.growthValue - a.growthValue);
        break;
      case 'investmentAsc':
        result.sort((a, b) => a.investmentValue - b.investmentValue);
        break;
      case 'investmentDesc':
        result.sort((a, b) => b.investmentValue - a.investmentValue);
        break;
      default:
        // Default sorting (by id)
        result.sort((a, b) => Number(a.id) - Number(b.id));
    }
    setFilteredSectors(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchQuery, sortBy, categoryFilter, sectors]);
  // Get current sectors for pagination
  const indexOfLastSector = currentPage * sectorsPerPage;
  const indexOfFirstSector = indexOfLastSector - sectorsPerPage;
  const currentSectors = filteredSectors.slice(indexOfFirstSector, indexOfLastSector);
  const totalPages = Math.ceil(filteredSectors.length / sectorsPerPage);
  // Get unique categories for filter
  const categories = ['all', ...new Set(sectors.map(sector => sector.category))];
  // Handle pagination
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // Scroll to top of the grid
    document.getElementById('sector-grid')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  };
  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setSortBy('default');
    setCategoryFilter('all');
    setShowFilters(false);
  };
  return <div ref={pageRef} className="min-h-screen w-full bg-gray-50 pt-24 pb-20 px-6 md:px-12 opacity-0 -translate-y-4 transition-all duration-1000">
      <div className="container mx-auto">
        {/* Back button */}
        <div className="mb-8">
          <Link to="/discover-abudhabi" className="inline-flex items-center text-primary hover:text-primary-dark transition-colors transform hover:-translate-x-1 duration-200">
            <ArrowLeftIcon size={18} className="mr-2" />
            <span>Back to Home</span>
          </Link>
        </div>
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
            Explore Strategic Growth Areas
          </h1>
          <p className="font-body text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover Abu Dhabi's commitment to innovation, sustainability, and
            global investment through diverse sectors offering exceptional
            growth opportunities.
          </p>
        </div>
        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-md mb-12 transition-all duration-300">
          <div className="p-6 flex flex-col md:flex-row md:items-center gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <input type="text" placeholder="Search sectors, keywords, or opportunities..." className="w-full py-4 pl-12 pr-4 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all text-base" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
              <SearchIcon size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            {/* Filter Toggle Button */}
            <button className={`px-5 py-4 rounded-lg flex items-center justify-center transition-colors ${showFilters ? 'bg-primary text-white' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`} onClick={() => setShowFilters(!showFilters)} aria-expanded={showFilters} aria-label="Toggle filters">
              <FilterIcon size={20} className="mr-2" />
              <span>Filters</span>
            </button>
          </div>
          {/* Expanded Filters */}
          {showFilters && <div className="p-6 border-t border-gray-100 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Category Filter */}
                <div>
                  <label className="block font-medium text-gray-700 mb-2">
                    Sector Category
                  </label>
                  <div className="relative">
                    <select className="w-full p-3 bg-gray-50 rounded-lg appearance-none border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
                      {categories.map(category => <option key={category} value={category}>
                          {category === 'all' ? 'All Categories' : category}
                        </option>)}
                    </select>
                    <ChevronDownIcon size={20} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                {/* Sort By Growth */}
                <div>
                  <label className="block font-medium text-gray-700 mb-2">
                    Sort by Growth Rate
                  </label>
                  <div className="relative">
                    <select className="w-full p-3 bg-gray-50 rounded-lg appearance-none border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary" value={sortBy === 'growthAsc' ? 'growthAsc' : sortBy === 'growthDesc' ? 'growthDesc' : ''} onChange={e => {
                  if (e.target.value) {
                    setSortBy(e.target.value as SortOption);
                  }
                }}>
                      <option value="">No sorting</option>
                      <option value="growthAsc">Lowest to Highest</option>
                      <option value="growthDesc">Highest to Lowest</option>
                    </select>
                    <ChevronDownIcon size={20} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                {/* Sort By Investment */}
                <div>
                  <label className="block font-medium text-gray-700 mb-2">
                    Sort by Investment Size
                  </label>
                  <div className="relative">
                    <select className="w-full p-3 bg-gray-50 rounded-lg appearance-none border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary" value={sortBy === 'investmentAsc' ? 'investmentAsc' : sortBy === 'investmentDesc' ? 'investmentDesc' : ''} onChange={e => {
                  if (e.target.value) {
                    setSortBy(e.target.value as SortOption);
                  }
                }}>
                      <option value="">No sorting</option>
                      <option value="investmentAsc">Lowest to Highest</option>
                      <option value="investmentDesc">Highest to Lowest</option>
                    </select>
                    <ChevronDownIcon size={20} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
              {/* Reset Filters */}
              <div className="mt-6 flex justify-end">
                <button onClick={resetFilters} className="flex items-center text-gray-500 hover:text-primary transition-colors">
                  <XIcon size={16} className="mr-1" />
                  Reset Filters
                </button>
              </div>
            </div>}
        </div>
        {/* Active Filters Summary */}
        {(searchQuery || categoryFilter !== 'all' || sortBy !== 'default') && <div className="mb-8 flex flex-wrap items-center gap-2">
            <span className="text-gray-500">Active filters:</span>
            {searchQuery && <div className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center">
                <span className="mr-2">Search: {searchQuery}</span>
                <button onClick={() => setSearchQuery('')} className="text-gray-400 hover:text-gray-600">
                  <XIcon size={14} />
                </button>
              </div>}
            {categoryFilter !== 'all' && <div className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center">
                <span className="mr-2">Category: {categoryFilter}</span>
                <button onClick={() => setCategoryFilter('all')} className="text-gray-400 hover:text-gray-600">
                  <XIcon size={14} />
                </button>
              </div>}
            {sortBy !== 'default' && <div className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center">
                <span className="mr-2">
                  Sort:{' '}
                  {sortBy === 'growthAsc' ? 'Growth (Low to High)' : sortBy === 'growthDesc' ? 'Growth (High to Low)' : sortBy === 'investmentAsc' ? 'Investment (Low to High)' : 'Investment (High to Low)'}
                </span>
                <button onClick={() => setSortBy('default')} className="text-gray-400 hover:text-gray-600">
                  <XIcon size={14} />
                </button>
              </div>}
            <button onClick={resetFilters} className="text-primary hover:text-primary-dark text-sm ml-auto">
              Clear All
            </button>
          </div>}
        {/* Results Count */}
        <div className="mb-6 flex justify-between items-center">
          <div className="text-gray-500">
            Showing {filteredSectors.length}{' '}
            {filteredSectors.length === 1 ? 'sector' : 'sectors'}
          </div>
          {/* Pagination Controls - Top */}
          {totalPages > 1 && <div className="flex items-center space-x-1">
              <button onClick={() => paginate(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className={`p-2 rounded ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}>
                <ChevronUpIcon size={16} className="transform rotate-90" />
              </button>
              {Array.from({
            length: totalPages
          }, (_, i) => i + 1).map(number => <button key={number} onClick={() => paginate(number)} className={`w-8 h-8 rounded ${currentPage === number ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                  {number}
                </button>)}
              <button onClick={() => paginate(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className={`p-2 rounded ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}>
                <ChevronDownIcon size={16} className="transform rotate-90" />
              </button>
            </div>}
        </div>
        {/* Sector Grid */}
        <div id="sector-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {currentSectors.length > 0 ? currentSectors.map(sector => <SectorCard key={sector.id} title={sector.title} description={sector.description} icon={sector.icon} growth={sector.growth} investment={sector.investment} color={sector.color} detailsContent={sector.detailsContent} />) : <div className="col-span-full text-center py-20 bg-white rounded-xl shadow-sm">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-xl font-bold mb-2">No sectors found</h3>
              <p className="text-gray-500">
                Try adjusting your search or filter criteria
              </p>
              <button onClick={resetFilters} className="mt-6 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
                Reset Filters
              </button>
            </div>}
        </div>
        {/* Pagination Controls - Bottom */}
        {totalPages > 1 && <div className="flex justify-center mt-8 mb-12">
            <div className="flex items-center space-x-1">
              <button onClick={() => paginate(Math.max(1, currentPage - 1))} disabled={currentPage === 1} className={`p-2 rounded ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}>
                <ChevronUpIcon size={16} className="transform rotate-90" />
              </button>
              {Array.from({
            length: totalPages
          }, (_, i) => i + 1).map(number => <button key={number} onClick={() => paginate(number)} className={`w-8 h-8 rounded ${currentPage === number ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                  {number}
                </button>)}
              <button onClick={() => paginate(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} className={`p-2 rounded ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}>
                <ChevronDownIcon size={16} className="transform rotate-90" />
              </button>
            </div>
          </div>}
        {/* CTA Section */}
        {/* <div className="bg-white rounded-xl shadow-md p-8 md:p-12 text-center">
          <h2 className="font-display text-3xl font-bold mb-6">
            Ready to Invest in Abu Dhabi?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Connect with our investment specialists to explore opportunities,
            incentives, and support services tailored to your business needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/" className="px-8 py-4 bg-primary text-white font-body font-medium rounded-lg hover:bg-primary-dark transition-colors shadow-md hover:shadow-lg">
              Contact an Advisor
            </Link>
            <Link to="/" className="px-8 py-4 border-2 border-primary text-primary font-body font-medium rounded-lg hover:bg-primary hover:text-white transition-colors">
              Download Sector Reports
            </Link>
          </div>
        </div> */}
      </div>
    </div>;
};
export default GrowthAreasMarketplace;