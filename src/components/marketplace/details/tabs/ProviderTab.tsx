import React from "react";
import { ExternalLinkIcon } from "lucide-react";

export interface ProviderTabProps {
  provider: { name: string; logoUrl: string; description?: string };
  marketplaceType: "courses" | "financial" | "non-financial";
  item: any;
}

const ProviderTab: React.FC<ProviderTabProps> = ({ provider, marketplaceType, item }) => {
  return (
    <div className="space-y-6">
      <p className="text-gray-600 text-lg mb-6">
        Learn more about the provider and their expertise in this field.
      </p>
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
          <img src={provider.logoUrl} alt={provider.name} className="h-16 w-16 object-contain rounded-lg" />
          <div>
            <h3 className="text-xl font-bold text-gray-900">{provider.name}</h3>
            <p className="text-gray-600 text-sm">
              {marketplaceType === "courses"
                ? "Leading provider of business education"
                : marketplaceType === "financial"
                ? "Trusted financial services provider"
                : "Expert business services provider"}
            </p>
          </div>
          <div className="md:ml-auto flex flex-col md:items-end">
            <div className="text-sm text-gray-500">Established</div>
            <div className="font-medium text-blue-600">
              {(item as any).providerEstablished || "2007"} {(item as any).providerLocation || "UAE"}
            </div>
          </div>
        </div>
        <p className="text-gray-700 mb-6">
          {provider.description || `${provider.name} is an independent, not-for-profit small and medium enterprises (SMEs) socio-economic development organization established in 2007.`}
        </p>
        <h4 className="text-md font-semibold text-gray-900 mb-3">Areas of Expertise</h4>
        <div className="flex flex-wrap gap-2 mb-6">
          {(item as any).providerExpertise ? (
            (item as any).providerExpertise.map((expertise: string, index: number) => (
              <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                {expertise}
              </span>
            ))
          ) : (
            <>
              <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">SME Financing</span>
              <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">Business Advisory</span>
              <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm font-medium">Entrepreneurship</span>
              <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-sm font-medium">Financial Planning</span>
            </>
          )}
        </div>
        <button className="text-blue-600 font-medium hover:text-blue-800 transition-colors flex items-center">
          Visit Provider Website
          <ExternalLinkIcon size={16} className="ml-1" />
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
          <h4 className="text-sm text-gray-500 mb-1">Location</h4>
          <p className="font-medium text-gray-900">{(item as any).providerLocation || "Abu Dhabi, UAE"}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
          <h4 className="text-sm text-gray-500 mb-1">Contact</h4>
          <p className="font-medium text-gray-900">{(item as any).providerContact || "info@provider.ae"}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
          <h4 className="text-sm text-gray-500 mb-1">Services</h4>
          <p className="font-medium text-gray-900">{(item as any).providerServices || "20+ Financial Products"}</p>
        </div>
      </div>
    </div>
  );
};

export default ProviderTab;
