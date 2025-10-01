import React from "react";
import { Calendar, MapPin } from "lucide-react";

export interface ScheduleTabProps {
  item: any;
}

const ScheduleTab: React.FC<ScheduleTabProps> = ({ item }) => {
  return (
    <div className="space-y-6">
      <p className="text-gray-600 text-lg mb-6">Here's the complete schedule and timeline for this course.</p>
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center mb-6 bg-blue-50 p-3 rounded-lg">
          <div className="flex-grow flex items-center">
            <Calendar className="text-blue-600 mr-3" size={18} />
            <div>
              <p className="font-medium text-gray-800">
                Start Date: <span className="text-blue-700">{item.startDate}</span>
              </p>
              <p className="text-sm text-gray-600">Duration: {item.duration}</p>
            </div>
          </div>
          <div className="mt-2 md:mt-0 md:ml-auto">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-50 text-green-700 border border-green-100">
              {item.deliveryMode}
            </span>
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Timeline</h3>
        <div className="space-y-4">
          <div className="relative pl-8 pb-4 border-l-2 border-blue-200">
            <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-blue-500"></div>
            <h4 className="font-semibold text-gray-900">Week 1</h4>
            <p className="text-gray-700">Introduction and foundation concepts</p>
          </div>
          <div className="relative pl-8 pb-4 border-l-2 border-blue-200">
            <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-blue-500"></div>
            <h4 className="font-semibold text-gray-900">Week 2</h4>
            <p className="text-gray-700">Core principles and practical exercises</p>
          </div>
          {(item.durationType === "Medium" || item.durationType === "Long") && (
            <div className="relative pl-8 pb-4 border-l-2 border-blue-200">
              <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-blue-500"></div>
              <h4 className="font-semibold text-gray-900">Week 3-4</h4>
              <p className="text-gray-700">Advanced techniques and final projects</p>
            </div>
          )}
          {item.durationType === "Long" && (
            <div className="relative pl-8">
              <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-blue-500"></div>
              <h4 className="font-semibold text-gray-900">Final Week</h4>
              <p className="text-gray-700">Project presentations and certification</p>
            </div>
          )}
        </div>
        {item.location && (
          <div className="mt-6 pt-4 border-t border-gray-100">
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
              <MapPin className="text-blue-600 mr-2" size={16} />
              Location Details
            </h4>
            <p className="text-gray-700 ml-6">{item.location}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduleTab;
