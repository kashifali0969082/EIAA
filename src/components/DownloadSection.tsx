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
    <div className="bg-gradient-to-r from-seagreen-50 to-emerald-50 dark:from-seagreen-900/20 dark:to-emerald-900/20 rounded-xl shadow-lg border border-seagreen-200 dark:border-seagreen-700 p-4 sm:p-6 animate-slideInUp">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
          <div className="p-3 bg-seagreen-100 dark:bg-seagreen-900 rounded-full animate-bounce">
            <CheckCircle className="w-6 h-6 text-seagreen-600 dark:text-seagreen-400" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
              Formatting Complete!
            </h3>
            <p className="text-gray-600 dark:text-gray-300 flex items-center space-x-2 truncate">
              <FileText className="w-4 h-4" />
              <span className="truncate">{fileName}</span>
            </p>
          </div>
        </div>
        
        <button
          onClick={onDownload}
          className="bg-gradient-to-r from-seagreen-600 to-emerald-600 text-white px-4 sm:px-6 py-3 rounded-lg font-medium hover:from-seagreen-700 hover:to-emerald-700 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105 ml-4"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Download Formatted File</span>
          <span className="sm:hidden">Download</span>
        </button>
      </div>
      
      <div className="mt-4 p-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg">
        <h4 className="font-medium text-gray-900 dark:text-white mb-2">Applied Formatting:</h4>
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-seagreen-100 dark:bg-seagreen-900 text-seagreen-700 dark:text-seagreen-300 rounded-full text-sm">
            Data Cleaned
          </span>
          <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 rounded-full text-sm">
            Headers Standardized
          </span>
          <span className="px-3 py-1 bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 rounded-full text-sm">
            Empty Rows Removed
          </span>
          <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 rounded-full text-sm">
            Dates Formatted
          </span>
        </div>
      </div>
    </div>
  );
}