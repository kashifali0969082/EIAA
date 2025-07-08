import React from 'react';
import { Download, FileText, CheckCircle, FileSpreadsheet, Copy } from 'lucide-react';

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
  const [copied, setCopied] = React.useState(false);
  
  const handleCopyFileName = () => {
    navigator.clipboard.writeText(fileName);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isReady) return null;

  return (
    <div className="space-y-6">
      {/* Success Banner */}
      <div className="bg-gradient-to-r from-seagreen-50 to-emerald-50 dark:from-seagreen-900/20 dark:to-emerald-900/20 rounded-xl shadow-lg border border-seagreen-200 dark:border-seagreen-700 p-4 sm:p-6 animate-slideInUp">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
            <div className="p-3 bg-seagreen-100 dark:bg-seagreen-900 rounded-full animate-bounce">
              <CheckCircle className="w-6 h-6 text-seagreen-600 dark:text-seagreen-400" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                Processing Complete!
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <FileText className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <span className="text-gray-600 dark:text-gray-300 truncate">{fileName}</span>
                <button
                  onClick={handleCopyFileName}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                  title="Copy filename"
                >
                  <Copy className="w-3 h-3" />
                </button>
                {copied && (
                  <span className="text-xs text-seagreen-600 dark:text-seagreen-400 animate-fadeIn">
                    Copied!
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Download Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden animate-slideInUp">
        <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 border-b border-gray-200 dark:border-gray-600">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-seagreen-100 dark:bg-seagreen-900 rounded-lg">
              <FileSpreadsheet className="w-5 h-5 text-seagreen-600 dark:text-seagreen-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Processed File Ready
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Your file has been processed and is ready for download
              </p>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-br from-seagreen-100 to-emerald-100 dark:from-seagreen-900 dark:to-emerald-900 rounded-lg">
                <FileText className="w-6 h-6 text-seagreen-600 dark:text-seagreen-400" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {fileName.replace(/\.[^/.]+$/, '_processed.xlsx')}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Excel format • Ready for download
                </p>
              </div>
            </div>
            
            <button
              onClick={onDownload}
              className="bg-gradient-to-r from-seagreen-600 to-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:from-seagreen-700 hover:to-emerald-700 transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
          </div>
          
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">Applied Processing:</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="flex items-center space-x-2 px-3 py-2 bg-seagreen-100 dark:bg-seagreen-900 text-seagreen-700 dark:text-seagreen-300 rounded-lg text-sm">
                <div className="w-2 h-2 bg-seagreen-500 rounded-full"></div>
                <span>Data Cleaned</span>
              </div>
              <div className="flex items-center space-x-2 px-3 py-2 bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 rounded-lg text-sm">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span>Headers Fixed</span>
              </div>
              <div className="flex items-center space-x-2 px-3 py-2 bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 rounded-lg text-sm">
                <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                <span>Empty Removed</span>
              </div>
              <div className="flex items-center space-x-2 px-3 py-2 bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 rounded-lg text-sm">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span>Dates Fixed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}