import React, { useState } from 'react';
import { Brain, Settings, Wand2, CheckCircle, Clock } from 'lucide-react';

interface AIFormatterProps {
  onFormat: (options: FormattingOptions) => void;
  isProcessing: boolean;
}

export interface FormattingOptions {
  cleanData: boolean;
  standardizeHeaders: boolean;
  removeEmpty: boolean;
  formatDates: boolean;
  addSummary: boolean;
  customPrompt?: string;
}

export const AIFormatter: React.FC<AIFormatterProps> = ({ onFormat, isProcessing }) => {
  const [options, setOptions] = useState<FormattingOptions>({
    cleanData: true,
    standardizeHeaders: true,
    removeEmpty: true,
    formatDates: true,
    addSummary: false,
    customPrompt: ''
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleOptionChange = (key: keyof FormattingOptions, value: boolean | string) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  const handleFormat = () => {
    onFormat(options);
  };

  const formatOptions = [
    {
      key: 'cleanData' as keyof FormattingOptions,
      label: 'Clean Data',
      description: 'Remove inconsistencies and standardize formatting',
      icon: <Wand2 className="w-5 h-5" />
    },
    {
      key: 'standardizeHeaders' as keyof FormattingOptions,
      label: 'Standardize Headers',
      description: 'Convert headers to consistent naming conventions',
      icon: <Settings className="w-5 h-5" />
    },
    {
      key: 'removeEmpty' as keyof FormattingOptions,
      label: 'Remove Empty Rows/Columns',
      description: 'Clean up empty cells and rows automatically',
      icon: <CheckCircle className="w-5 h-5" />
    },
    {
      key: 'formatDates' as keyof FormattingOptions,
      label: 'Format Dates',
      description: 'Standardize date formats across the spreadsheet',
      icon: <Clock className="w-5 h-5" />
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-purple-100 rounded-lg">
          <Brain className="w-6 h-6 text-purple-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">AI Formatting Options</h3>
          <p className="text-gray-600 text-sm">Choose how you want to enhance your data</p>
        </div>
      </div>

      <div className="space-y-4">
        {formatOptions.map((option) => (
          <div key={option.key} className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex-shrink-0 mt-1">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={options[option.key] as boolean}
                  onChange={(e) => handleOptionChange(option.key, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                {option.icon}
                <h4 className="font-medium text-gray-900">{option.label}</h4>
              </div>
              <p className="text-sm text-gray-600">{option.description}</p>
            </div>
          </div>
        ))}

        <div className="border-t border-gray-200 pt-4">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            {showAdvanced ? 'Hide' : 'Show'} Advanced Options
          </button>
        </div>

        {showAdvanced && (
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <div className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg">
              <div className="flex-shrink-0 mt-1">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={options.addSummary}
                    onChange={(e) => handleOptionChange('addSummary', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 mb-1">Add Data Summary</h4>
                <p className="text-sm text-gray-600">Generate insights and summary statistics</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custom AI Instructions (Optional)
              </label>
              <textarea
                value={options.customPrompt}
                onChange={(e) => handleOptionChange('customPrompt', e.target.value)}
                placeholder="Enter specific instructions for how you want your data formatted..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                rows={3}
              />
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleFormat}
          disabled={isProcessing}
          className={`
            px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2
            ${isProcessing
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105'
            }
          `}
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Processing...</span>
            </>
          ) : (
            <>
              <Brain className="w-4 h-4" />
              <span>Format with AI</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};