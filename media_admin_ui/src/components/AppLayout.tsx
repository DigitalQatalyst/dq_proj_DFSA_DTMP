import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from './KFHeader';
import { HomeIcon, BookOpenIcon, PlusIcon, SettingsIcon, MenuIcon, XIcon } from 'lucide-react';
import { Header } from './KFHeader';
import { Footer } from './KFFooter/Footer';
interface AppLayoutProps {
  children: React.ReactNode;
  title: string;
}
const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  title
}) => {
  const {
    user,
    signOut
  } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigationItems = [{
    path: '/admin-ui/dashboard',
    label: 'Dashboard',
    icon: <HomeIcon className="w-5 h-5" />
  }, {
    path: '/admin-ui/media',
    label: 'Media Library',
    icon: <BookOpenIcon className="w-5 h-5" />
  }, {
    path: '/admin-ui/media/new',
    label: 'New Media',
    icon: <PlusIcon className="w-5 h-5" />
  }, {
    path: '/admin-ui/settings',
    label: 'Settings',
    icon: <SettingsIcon className="w-5 h-5" />
  }];
  return <div className="min-h-screen grid grid-rows-[auto_1fr_auto]">
      {/* Row 1: Header */}
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
      {/* Row 2: Content (Sidebar + Main) */}
      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr]">
        {/* Sidebar - part of the grid */}
        <aside className={`bg-white border-r border-gray-200 overflow-y-auto
            ${sidebarOpen ? 'fixed inset-0 z-50 w-full md:sticky md:top-16 md:h-auto md:max-h-[calc(100vh-64px)]' : 'hidden md:sticky md:block md:top-16 md:h-auto md:max-h-[calc(100vh-64px)]'}`}>
          {/* Mobile close button */}
          <div className="flex justify-end p-4 md:hidden">
            <button onClick={() => setSidebarOpen(false)} className="text-gray-500 hover:text-gray-700" aria-label="Close sidebar">
              <XIcon className="w-6 h-6" />
            </button>
          </div>
          {/* Navigation */}
          <nav className="mt-4">
            <ul>
              {navigationItems.map(item => <li key={item.path}>
                  <Link to={item.path} onClick={() => window.innerWidth < 768 ? setSidebarOpen(false) : null} className={`flex items-center px-4 py-3 hover:bg-gray-100 ${location.pathname === item.path ? 'bg-gray-100 text-blue-600 font-medium' : 'text-gray-700'}`}>
                    {item.icon}
                    <span className="ml-3">{item.label}</span>
                  </Link>
                </li>)}
            </ul>
          </nav>
        </aside>
        {/* Main Content */}
        <main className="flex flex-col">
          {/* Mobile header with hamburger */}
          <div className="md:hidden sticky top-0 z-10 bg-white shadow-sm flex items-center px-4 py-3">
            <button onClick={() => setSidebarOpen(true)} className="text-gray-700 mr-3" aria-label="Open sidebar">
              <MenuIcon className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
          </div>
          {/* Desktop/Tablet header */}
          <header className="hidden md:block bg-white shadow-sm z-10 sticky top-0">
            <div className="flex justify-between items-center px-6 py-3">
              <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
            </div>
          </header>
          {/* Page Content */}
          <div className="p-4 md:p-6 pb-16">{children}</div>
        </main>
      </div>
      {/* Row 3: Footer */}
      <Footer isLoggedIn={true} />
      {/* Backdrop for mobile when sidebar is open */}
      {sidebarOpen && <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setSidebarOpen(false)} aria-hidden="true" />}
    </div>;
};
export default AppLayout;
