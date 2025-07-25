import React, { useCallback, useState } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, isProcessing }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): boolean => {
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'application/pdf',
      'text/plain',
      'application/json'
    ];
    
    const validExtensions = ['.xlsx', '.xls', '.csv', '.docx', '.doc', '.pdf', '.txt', '.json'];
    const hasValidExtension = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
    
    if (!validTypes.includes(file.type) && !hasValidExtension) {
      setError('Please upload a valid file (.xlsx, .xls, .csv, .docx, .doc, .pdf, .txt, .json)');
      return false;
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setError('File size must be less than 10MB');
      return false;
    }
    
    setError(null);
    return true;
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const file = files[0];
      if (validateFile(file)) {
        onFileSelect(file);
      }
    }
  }, [onFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (validateFile(file)) {
        onFileSelect(file);
      }
    }
  }, [onFileSelect]);

  return (
    <div className="w-full max-w-2xl mx-auto px-2 sm:px-0">
      <div
        className={`
          relative border-2 border-dashed rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-12 text-center transition-all duration-300 ease-in-out
          ${isDragOver 
            ? 'border-seagreen-500 bg-seagreen-50 dark:bg-seagreen-900/20 scale-105' 
            : 'border-gray-300 dark:border-gray-600 hover:border-seagreen-400 dark:hover:border-seagreen-500 hover:bg-seagreen-50/50 dark:hover:bg-seagreen-900/10'
          }
          ${isProcessing ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}
          bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".xlsx,.xls,.csv,.docx,.doc,.pdf,.txt,.json"
          onChange={handleFileInput}
          disabled={isProcessing}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="flex flex-col items-center space-y-3 sm:space-y-4">
          <div className={`
            p-3 sm:p-4 rounded-full transition-all duration-300 transform hover:scale-110
            ${isDragOver ? 'bg-seagreen-100 dark:bg-seagreen-900' : 'bg-gray-100 dark:bg-gray-700'}
          `}>
            <Upload className={`
              w-6 sm:w-8 md:w-12 h-6 sm:h-8 md:h-12 transition-colors duration-300
              ${isDragOver ? 'text-seagreen-600 dark:text-seagreen-400' : 'text-gray-600 dark:text-gray-400'}
            `} />
          </div>
          
          <div>
            <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Drop your file here
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-3 sm:mb-4 text-sm sm:text-base">
              or click to browse and select a file
            </p>
            <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              <FileText className="w-4 h-4" />
              <span className="text-center">Supports Excel, Word, PDF, CSV, TXT, JSON files up to 10MB</span>
            </div>
          </div>
        </div>
      </div>
      
      {error && (
        <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start space-x-2 animate-slideInDown">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
          <p className="text-red-700 dark:text-red-400 text-sm sm:text-base">{error}</p>
        </div>
      )}
    </div>
  );
};