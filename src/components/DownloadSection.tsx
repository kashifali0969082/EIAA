import React from 'react';
import { Download, FileText, CheckCircle } from 'lucide-react';

interface DownloadSectionProps {
  onDownload: () => void;
  fileName: string;
  isReady: boolean;
}

export const DownloadSection: React.FC<DownloadSectionProps> = ({ 
  onDownload, 
  fileName, 
  isReady 
}) => {
  if (!isReady) return null;

  return (
    <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl shadow-lg border border-emerald-200 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-emerald-100 rounded-full">
            <CheckCircle className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Formatting Complete!
            </h3>
            <p className="text-gray-600 flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>{fileName}</span>
            </p>
          </div>
        </div>
        
        <button
          onClick={onDownload}
          className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:from-emerald-700 hover:to-blue-700 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <Download className="w-4 h-4" />
          <span>Download Formatted File</span>
        </button>
      </div>
      
      <div className="mt-4 p-4 bg-white bg-opacity-60 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Applied Formatting:</h4>
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
            Data Cleaned
          </span>
          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
            Headers Standardized
          </span>
          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm">
            Empty Rows Removed
          </span>
          <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
            Dates Formatted
          </span>
        </div>
      </div>
    </div>
  );
};