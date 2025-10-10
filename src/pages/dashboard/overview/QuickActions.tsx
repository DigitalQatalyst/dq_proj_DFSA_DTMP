import React from "react";
import {
  FileUpIcon,
  FileTextIcon,
  UserIcon,
  HelpCircleIcon,
} from "lucide-react";

import { Link } from "react-router-dom";

export const QuickActions: React.FC = () => {
  const actions = [
    {
      id: "submit-request",
      label: "Create Request",
      icon: <FileTextIcon className="h-5 w-5" />,
      onClick: () => console.log("Submit Request clicked"),
      primary: true,
      to: "/marketplace/financial",
    },
    {
      id: "upload-documents",
      label: "Upload Document",
      icon: <FileUpIcon className="h-5 w-5" />,
      onClick: () => console.log("Upload Documents clicked"),
      primary: false,
      to: "/dashboard/documents",
    },
    {
      id: "view-reports",
      label: "View Reports",
      icon: <UserIcon className="h-5 w-5" />,
      onClick: () => console.log("View Reports clicked"),
      primary: false,
      to: "/dashboard/reporting-obligations",
    },
    {
      id: "contact-support",
      label: "Contact Support",
      icon: <HelpCircleIcon className="h-5 w-5" />,
      onClick: () => console.log("Contact Support clicked"),
      primary: false,
      to: "/dashboard/support",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {actions.map((action) => (
        <Link
          to={action.to}
          key={action.id}
          onClick={action.onClick}
          className={`flex flex-col items-center justify-center p-4 rounded-lg transition-colors ${
            action.primary
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-white border border-gray-200 hover:border-blue-300 hover:bg-gray-50"
          }`}
        >
          <div
            className={`p-2 rounded-full mb-3 ${
              action.primary
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {action.icon}
          </div>
          <span
            className={`text-sm font-medium ${
              action.primary ? "text-white" : "text-gray-700"
            }`}
          >
            {action.label}
          </span>
        </Link>
      ))}
    </div>
  );
};
