import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal, CheckCircle } from 'lucide-react';

const HorizontalTabs = () => {
  const [activeTabIndex, setActiveTabIndex] = useState(4); // Set to "Operational Information" as active
  const [showTabsMenu, setShowTabsMenu] = useState(false);
  const tabsRef = useRef(null);

  // Sample data matching your image
  const sectionsToDisplay = [
    { id: 'vision', title: 'Vision & Strategy', completion: 100, mandatoryCompletion: { percentage: 100 } },
    { id: 'contact', title: 'Contact Information', completion: 100, mandatoryCompletion: { percentage: 100 } },
    { id: 'legal', title: 'Legal Information', completion: 100, mandatoryCompletion: { percentage: 100 } },
    { id: 'financial', title: 'Financial Information', completion: 0, mandatoryCompletion: { percentage: 0 } },
    { id: 'operational', title: 'Operational Information', completion: 0, mandatoryCompletion: { percentage: 0 } },
  ];

  const scrollLeft = () => {
    if (tabsRef.current) {
      tabsRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (tabsRef.current) {
      tabsRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full bg-white">
      <div className="flex items-center max-w-full border-b border-gray-200">
        <button
          className="px-2 py-3 text-gray-500 hover:text-gray-700 focus:outline-none"
          onClick={scrollLeft}
          aria-label="Scroll tabs left"
        >
          <ChevronLeft size={16} />
        </button>

        <div
          ref={tabsRef}
          className="flex-1 overflow-x-auto whitespace-nowrap scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          role="tablist"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight') {
              scrollRight();
              if (activeTabIndex < sectionsToDisplay.length - 1) {
                setActiveTabIndex(activeTabIndex + 1);
              }
            } else if (e.key === 'ArrowLeft') {
              scrollLeft();
              if (activeTabIndex > 0) {
                setActiveTabIndex(activeTabIndex - 1);
              }
            }
          }}
        >
          <div className="flex">
            {sectionsToDisplay.map((section, index) => (
              <button
                key={section.id}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap flex items-center border-b-2 ${
                  activeTabIndex === index
                    ? 'text-blue-600 border-blue-600 bg-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-transparent'
                }`}
                onClick={() => setActiveTabIndex(index)}
                role="tab"
                aria-selected={activeTabIndex === index}
                id={`tab-${section.id}`}
                aria-controls={`panel-${section.id}`}
              >
                <span>{section.title}</span>
                <div className="flex items-center ml-2">
                  {section.mandatoryCompletion.percentage === 100 ? (
                    <CheckCircle size={16} className="text-green-500" />
                  ) : (
                    <span className="w-3 h-3 rounded-full bg-gray-400"></span>
                  )}
                  <span className={`ml-1 text-xs font-medium ${
                    section.mandatoryCompletion.percentage === 100 ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {section.completion}%
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <button
          className="px-2 py-3 text-gray-500 hover:text-gray-700 focus:outline-none"
          onClick={scrollRight}
          aria-label="Scroll tabs right"
        >
          <ChevronRight size={16} />
        </button>

        <div className="relative">
          <button
            className="px-2 py-3 text-gray-500 hover:text-gray-700 focus:outline-none"
            onClick={() => setShowTabsMenu(!showTabsMenu)}
            aria-label="Show all tabs"
          >
            <MoreHorizontal size={16} />
          </button>
          {showTabsMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-10 border border-gray-200">
              <div className="py-1 max-h-64 overflow-y-auto">
                {sectionsToDisplay.map((section, index) => (
                  <button
                    key={section.id}
                    className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between ${
                      activeTabIndex === index
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => {
                      setActiveTabIndex(index);
                      setShowTabsMenu(false);
                    }}
                  >
                    <span>{section.title}</span>
                    <div className="flex items-center">
                      {section.mandatoryCompletion.percentage === 100 ? (
                        <CheckCircle size={16} className="text-green-500 mr-1" />
                      ) : (
                        <span className="w-3 h-3 rounded-full bg-gray-400 mr-1"></span>
                      )}
                      <span className={`text-xs font-medium ${
                        section.mandatoryCompletion.percentage === 100 ? 'text-green-600' : 'text-gray-500'
                      }`}>
                        {section.completion}%
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HorizontalTabs;