import React from "react";
import { PlusIcon, MenuIcon, XIcon } from "lucide-react";
import { BurgerMenuButton } from "../Sidebar";

import { Link } from "react-router-dom";

interface ServiceRequestsHeaderProps {
  onRequestNewService: () => void;
  setIsOpen: (value: boolean) => void;
  isLoggedIn: boolean;
}
export function ServiceRequestsHeader({
  onRequestNewService,
  setIsOpen,
  isLoggedIn,
}: ServiceRequestsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 md:p-6 pb-3 pl-5">
      <div className="flex gap-4">
        <div className="lg:hidden">
          <BurgerMenuButton
            onClick={() => setIsOpen(true)}
            isLoggedIn={isLoggedIn}
          />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Service Requests</h1>
      </div>

      {/* Mobile: Icon-only button, Desktop: Full button with text */}
      <Link
        to="/#services-marketplaces"
        onClick={onRequestNewService}
        className="inline-flex items-center px-3 py-2 sm:px-4 sm:py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        aria-label="Request new service"
      >
        <PlusIcon className="w-4 h-4 sm:mr-2" />
        <span className="hidden sm:inline">Request New Service</span>
        <span className="inline sm:hidden">New Request</span>
      </Link>
    </div>
  );
}
