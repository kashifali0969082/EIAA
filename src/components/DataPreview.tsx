import React from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface DataPreviewProps {
  data: any[][];
  headers: string[];
  title: string;
  maxRows?: number;
}

export const DataPreview: React.FC<DataPreviewProps> = ({ 
  data, 
  headers, 
  title, 
  maxRows = 5 
}) => {
  const [isVisible, setIsVisible] = React.useState(true);
  
  if (!data || data.length === 0) return null;

  const displayData = data.slice(0, maxRows);
  const hasMoreRows = data.length > maxRows;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-xl">
      <div className="px-4 sm:px-6 py-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 flex items-center justify-between">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        <button
          onClick={() => setIsVisible(!isVisible)}
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
        >
          {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          <span className="text-sm">{isVisible ? 'Hide' : 'Show'}</span>
        </button>
      </div>
      
      {isVisible && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 dark:bg-gray-600">
              <tr>
                {headers.map((header, index) => (
                  <th
                    key={index}
                    className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {displayData.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                  {headers.map((_, colIndex) => (
                    <td
                      key={colIndex}
                      className="px-3 sm:px-4 py-3 text-sm text-gray-900 dark:text-gray-100 whitespace-nowrap"
                    >
                      {row[colIndex] || ''}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          
          {hasMoreRows && (
            <div className="px-4 sm:px-6 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing {displayData.length} of {data.length} rows
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};