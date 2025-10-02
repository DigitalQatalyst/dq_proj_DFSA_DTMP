/**
 * Settings Tab Navigation Component
 *
 * Provides responsive tab navigation for the Settings page with horizontal
 * scrolling support on mobile devices.
 *
 * @component
 * @example
 * ```tsx
 * <SettingsTabNavigation
 *   tabs={tabs}
 *   activeTabIndex={0}
 *   onTabChange={handleTabChange}
 * />
 * ```
 *
 * @param {TabItem[]} tabs - Array of tab configuration objects
 * @param {number} activeTabIndex - Index of currently active tab
 * @param {(index: number) => void} onTabChange - Callback fired when tab changes
 */
import React, { useEffect, useState, useRef, Component } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { TabItem } from '../types/settings';
interface SettingsTabNavigationProps {
  tabs: TabItem[];
  activeTabIndex: number;
  onTabChange: (index: number) => void;
}
export default function SettingsTabNavigation({
  tabs,
  activeTabIndex,
  onTabChange
}: SettingsTabNavigationProps) {
  const tabsRef = useRef<HTMLDivElement>(null);
  const [showScrollButtons, setShowScrollButtons] = useState(false);
  // Check if tabs overflow and need scrolling
  useEffect(() => {
    const checkOverflow = () => {
      if (tabsRef.current) {
        const {
          scrollWidth,
          clientWidth
        } = tabsRef.current;
        setShowScrollButtons(scrollWidth > clientWidth);
      }
    };
    checkOverflow();
    // SSR-safe window access
    const handleResize = () => {
      checkOverflow();
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [tabs]);
  const scrollTabsLeft = () => {
    if (tabsRef.current) {
      tabsRef.current.scrollBy({
        left: -200,
        behavior: 'smooth'
      });
    }
  };
  const scrollTabsRight = () => {
    if (tabsRef.current) {
      tabsRef.current.scrollBy({
        left: 200,
        behavior: 'smooth'
      });
    }
  };
  return <div className="px-4 md:px-8 pt-4 flex items-center">
      {/* Mobile scroll controls - only show if needed */}
      {showScrollButtons && <button onClick={scrollTabsLeft} className="md:hidden flex-shrink-0 p-1 mr-1 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" aria-label="Scroll tabs left">
          <ChevronLeftIcon className="h-5 w-5" />
        </button>}
      {/* Scrollable tabs container */}
      <div ref={tabsRef} className="flex justify-start gap-2 md:gap-6 overflow-x-auto scrollbar-hide" style={{
      scrollbarWidth: 'none',
      msOverflowStyle: 'none'
    }} role="tablist" aria-orientation="horizontal">
        {tabs.map((tab, index) => <div key={tab.id} className="relative group">
            <button onClick={() => onTabChange(index)} className={`relative flex-shrink-0 flex items-center py-4 px-2 border-b-2 whitespace-nowrap text-sm ${activeTabIndex === index ? 'border-blue-600 text-blue-600 font-bold' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} ${tab.comingSoon ? 'opacity-60 cursor-not-allowed' : ''}`} disabled={tab.comingSoon} role="tab" aria-selected={activeTabIndex === index} aria-controls={`tab-panel-${tab.id}`} id={`tab-${tab.id}`} tabIndex={activeTabIndex === index ? 0 : -1}>
              <span className="truncate max-w-[120px]" title={tab.title}>
                {tab.title}
              </span>
              {tab.comingSoon && <span className="ml-1 sm:ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                  Soon
                </span>}
            </button>
            {/* Tooltip for truncated text */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 hidden group-hover:block z-10">
              <div className="bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                {tab.title}
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
              </div>
            </div>
          </div>)}
      </div>
      {/* Mobile scroll controls - only show if needed */}
      {showScrollButtons && <button onClick={scrollTabsRight} className="md:hidden flex-shrink-0 p-1 ml-1 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" aria-label="Scroll tabs right">
          <ChevronRightIcon className="h-5 w-5" />
        </button>}
    </div>;
}