import React, { useState } from 'react';
import { FileSpreadsheet, Sparkles } from 'lucide-react';
import { FileUpload } from './components/FileUpload';
import { DataPreview } from './components/DataPreview';
import { AIFormatter, FormattingOptions } from './components/AIFormatter';
import { DownloadSection } from './components/DownloadSection';
import { processExcelFile, formatDataWithAI, downloadFormattedFile, ProcessedData } from './utils/excelProcessor';

type AppState = 'upload' | 'preview' | 'formatting' | 'complete';

function App() {
  const [state, setState] = useState<AppState>('upload');
  const [originalData, setOriginalData] = useState<ProcessedData | null>(null);
  const [formattedData, setFormattedData] = useState<ProcessedData | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    }
  };

  const handleStartOver = () => {
    setState('upload');
    setOriginalData(null);
    setFormattedData(null);
    setFileName('');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
              <FileSpreadsheet className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Excel AI Formatter</h1>
              <p className="text-gray-600">Transform your spreadsheets with intelligent formatting</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="space-y-8">
          {/* Step 1: Upload */}
          {state === 'upload' && (
            <div className="text-center">
              <div className="mb-8">
                <Sparkles className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Upload Your Excel File
                </h2>
                <p className="text-gray-600 text-lg">
                  Let AI transform your data into a perfectly formatted spreadsheet
                </p>
              </div>
              <FileUpload onFileSelect={handleFileSelect} isProcessing={isProcessing} />
            </div>
          )}

          {/* Step 2: Preview and Format */}
          {(state === 'preview' || state === 'formatting') && originalData && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Review Your Data
                </h2>
                <p className="text-gray-600">
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
                  className="text-gray-600 hover:text-gray-900 underline"
                >
                  Upload a different file
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Complete */}
          {state === 'complete' && formattedData && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Formatting Complete!
                </h2>
                <p className="text-gray-600">
                  Your data has been transformed and is ready for download
                </p>
              </div>

              <DownloadSection
                onDownload={handleDownload}
                fileName={fileName}
                isReady={true}
              />

              <div className="grid md:grid-cols-2 gap-8">
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
                  className="bg-white text-gray-700 px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  Format Another File
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p>Built with AI-powered formatting capabilities</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;