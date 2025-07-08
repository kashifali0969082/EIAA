import React, { useState } from 'react';
import { FileSpreadsheet, Sparkles } from 'lucide-react';
import { ThemeProvider } from './contexts/ThemeContext';
import { ThemeToggle } from './components/ThemeToggle';
import { FileUpload } from './components/FileUpload';
import { DataPreview } from './components/DataPreview';
import { AIFormatter, FormattingOptions } from './components/AIFormatter';
import { DownloadSection } from './components/DownloadSection';
import { CompletedFilesSection } from './components/CompletedFilesSection';
import { processExcelFile, formatDataWithAI, downloadFormattedFile, ProcessedData } from './utils/excelProcessor';

type AppState = 'upload' | 'preview' | 'formatting' | 'complete';

function App() {
  const [state, setState] = useState<AppState>('upload');
  const [originalData, setOriginalData] = useState<ProcessedData | null>(null);
  const [formattedData, setFormattedData] = useState<ProcessedData | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completedFiles, setCompletedFiles] = useState<any[]>([]);

  const handleFileSelect = async (file: File) => {
    setIsProcessing(true);
    setError(null);
    setFileName(file.name);
    
    try {
      const data = await processExcelFile(file);
      setOriginalData(data);
      setState('preview');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while processing the file');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFormat = async (options: FormattingOptions) => {
    if (!originalData) return;
    
    setIsProcessing(true);
    setState('formatting');
    
    try {
      const formatted = await formatDataWithAI(originalData, options);
      setFormattedData(formatted);
      setState('complete');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during formatting');
      setState('preview');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (formattedData) {
      downloadFormattedFile(formattedData, fileName);
      
      // Add to completed files
      const completedFile = {
        id: Date.now().toString(),
        name: fileName.replace(/\.[^/.]+$/, '_formatted.xlsx'),
        originalName: fileName,
        processedAt: new Date(),
        size: '~' + Math.round(formattedData.data.length * 0.1) + 'KB',
        data: formattedData
      };
      setCompletedFiles(prev => [completedFile, ...prev]);
    }
  };

  const handleDownloadCompleted = (file: any) => {
    downloadFormattedFile(file.data, file.originalName);
  };

  const handleDeleteCompleted = (fileId: string) => {
    setCompletedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const handleStartOver = () => {
    setState('upload');
    setOriginalData(null);
    setFormattedData(null);
    setFileName('');
    setError(null);
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-seagreen-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 transition-all duration-500">
        {/* Header */}
        <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 transition-all duration-300">
          <div className="max-w-6xl mx-auto px-4 py-4 sm:py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-seagreen-500 to-emerald-500 rounded-lg shadow-lg transform hover:scale-110 transition-transform duration-200">
                  <FileSpreadsheet className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">AI File Processor</h1>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Transform your files with intelligent processing</p>
                </div>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
          {error && (
            <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg animate-slideInDown">
              <p className="text-red-700 dark:text-red-400">{error}</p>
            </div>
          )}

          <div className="space-y-6 sm:space-y-8">
            {/* Completed Files Section */}
            {completedFiles.length > 0 && (
              <div className="animate-fadeIn">
                <CompletedFilesSection
                  files={completedFiles}
                  onDownload={handleDownloadCompleted}
                  onDelete={handleDeleteCompleted}
                />
              </div>
            )}

            {/* Step 1: Upload */}
            {state === 'upload' && (
              <div className="text-center animate-fadeIn">
                <div className="mb-8">
                  <div className="relative inline-block">
                    <Sparkles className="w-12 sm:w-16 h-12 sm:h-16 text-seagreen-600 dark:text-seagreen-400 mx-auto mb-4 animate-pulse" />
                    <div className="absolute inset-0 w-12 sm:w-16 h-12 sm:h-16 bg-seagreen-400 rounded-full opacity-20 animate-ping mx-auto"></div>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Upload Your File
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg">
                    Let AI transform your data into a perfectly formatted file
                  </p>
                </div>
                <FileUpload onFileSelect={handleFileSelect} isProcessing={isProcessing} />
              </div>
            )}

            {/* Step 2: Preview and Format */}
            {(state === 'preview' || state === 'formatting') && originalData && (
              <div className="space-y-6 sm:space-y-8 animate-slideInUp">
                <div className="text-center">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Review Your Data
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Preview your data and choose formatting options
                  </p>
                </div>

                <DataPreview
                  data={originalData.data}
                  headers={originalData.headers}
                  title="Original Data Preview"
                  maxRows={5}
                />

                <AIFormatter
                  onFormat={handleFormat}
                  isProcessing={isProcessing && state === 'formatting'}
                />

                <div className="flex justify-center">
                  <button
                    onClick={handleStartOver}
                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white underline transition-colors duration-200"
                  >
                    Upload a different file
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Complete */}
            {state === 'complete' && formattedData && (
              <div className="space-y-6 sm:space-y-8 animate-slideInUp">
                <div className="text-center">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Processing Complete!
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Your file has been processed and is ready for download
                  </p>
                </div>

                <DownloadSection
                  onDownload={handleDownload}
                  fileName={fileName}
                  isReady={true}
                />

                <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
                  <DataPreview
                    data={originalData?.data || []}
                    headers={originalData?.headers || []}
                    title="Original Data"
                    maxRows={5}
                  />
                  <DataPreview
                    data={formattedData.data}
                    headers={formattedData.headers}
                    title="Formatted Data"
                    maxRows={5}
                  />
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={handleStartOver}
                    className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 transform hover:scale-105"
                  >
                    Process Another File
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-t border-gray-200 dark:border-gray-700 mt-16">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="text-center text-gray-600 dark:text-gray-400">
              <p>Built with AI-powered file processing capabilities</p>
            </div>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
}

export default App;