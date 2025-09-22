import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, DollarSign, Briefcase } from 'lucide-react';
export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const marketplaces = [{
    id: 'courses',
    title: 'Course Marketplace',
    description: 'Discover and enroll in courses tailored for SMEs to help grow your business',
    icon: <BookOpen size={24} className="text-white" />,
    path: '/marketplace/courses',
    gradientFrom: 'from-blue-600',
    gradientTo: 'to-indigo-600'
  }, {
    id: 'financial',
    title: 'Financial Services',
    description: 'Access financial products and services to support your business growth',
    icon: <DollarSign size={24} className="text-white" />,
    path: '/marketplace/financial',
    gradientFrom: 'from-emerald-600',
    gradientTo: 'to-teal-600'
  }, {
    id: 'non-financial',
    title: 'Business Services',
    description: 'Find professional services to support and grow your business',
    icon: <Briefcase size={24} className="text-white" />,
    path: '/marketplace/non-financial',
    gradientFrom: 'from-purple-600',
    gradientTo: 'to-pink-600'
  }];
  return <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Business Growth Marketplace
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover resources, services, and support to help your business thrive
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {marketplaces.map(marketplace => <div key={marketplace.id} className={`bg-gradient-to-br ${marketplace.gradientFrom} ${marketplace.gradientTo} rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer`} onClick={() => navigate(marketplace.path)}>
            <div className="p-6 flex flex-col h-full">
              <div className="bg-white/20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                {marketplace.icon}
              </div>
              <h2 className="text-xl font-bold text-white mb-2">
                {marketplace.title}
              </h2>
              <p className="text-white/90 mb-6 flex-grow">
                {marketplace.description}
              </p>
              <button className="mt-auto bg-white text-gray-800 px-4 py-2 rounded-md font-medium hover:bg-gray-100 transition-colors w-full" onClick={e => {
            e.stopPropagation();
            navigate(marketplace.path);
          }}>
                Explore Now
              </button>
            </div>
          </div>)}
      </div>
    </div>;
};
export default HomePage;