import React from "react";

export interface AboutTabProps {
  serviceApplication: string;
  itemDescription: string;
  marketplaceType: "courses" | "financial" | "non-financial";
  item: any;
  config: { itemName: string } & Record<string, any>;
  highlights: string[];
}

const AboutTab: React.FC<AboutTabProps> = ({
  serviceApplication,
  itemDescription,
  marketplaceType,
  item,
  config,
  highlights,
}) => {
  return (
    <div className="space-y-6">
      <p className="text-gray-600 text-lg mb-6">
        Learn more about this {config.itemName.toLowerCase()} and what it offers
        for your business.
      </p>
      <div className="prose max-w-none">
        <p className="text-gray-700 mb-5">{itemDescription}</p>

        {marketplaceType === "financial" && (
          <p className="text-gray-700">{serviceApplication}</p>
        )}
        {marketplaceType === "non-financial" && (
          <p className="text-gray-700">{serviceApplication}</p>
        )}
      </div>
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Key Highlights</h3>
        <ul className="space-y-2">
          {highlights.map((highlight, index) => (
            <li key={index} className="flex items-start">
              <span className="text-green-500 mr-3 mt-1">•</span>
              <span className="text-gray-700">{highlight}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AboutTab;
