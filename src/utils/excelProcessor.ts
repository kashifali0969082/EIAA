import * as XLSX from 'xlsx';
import { FormattingOptions } from '../components/AIFormatter';

export interface ProcessedData {
  headers: string[];
  data: any[][];
  originalData: any[][];
}

export const processExcelFile = async (file: File): Promise<ProcessedData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Get the first worksheet
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Convert to JSON array
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        if (jsonData.length === 0) {
          reject(new Error('The file appears to be empty'));
          return;
        }
        
        const headers = (jsonData[0] as string[]) || [];
        const dataRows = jsonData.slice(1) as any[][];
        
        resolve({
          headers: headers.map(h => h?.toString() || ''),
          data: dataRows,
          originalData: dataRows.map(row => [...row])
        });
      } catch (error) {
        reject(new Error('Failed to process the Excel file. Please ensure it\'s a valid Excel file.'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read the file'));
    };
    
    reader.readAsArrayBuffer(file);
  });
};

export const formatDataWithAI = async (
  data: ProcessedData,
  options: FormattingOptions
): Promise<ProcessedData> => {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  let { headers, data: rows } = data;
  let processedRows = [...rows];
  
  // Clean data
  if (options.cleanData) {
    processedRows = processedRows.map(row =>
      row.map(cell => {
        if (typeof cell === 'string') {
          return cell.trim().replace(/\s+/g, ' ');
        }
        return cell;
      })
    );
  }
  
  // Standardize headers
  if (options.standardizeHeaders) {
    headers = headers.map(header =>
      header
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '_')
        .replace(/_+/g, '_')
        .replace(/^_|_$/g, '')
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    );
  }
  
  // Remove empty rows
  if (options.removeEmpty) {
    processedRows = processedRows.filter(row =>
      row.some(cell => cell !== null && cell !== undefined && cell !== '')
    );
  }
  
  // Format dates
  if (options.formatDates) {
    processedRows = processedRows.map(row =>
      row.map(cell => {
        if (typeof cell === 'number' && cell > 25000 && cell < 50000) {
          // Excel date serial number
          const date = XLSX.SSF.parse_date_code(cell);
          return `${date.m}/${date.d}/${date.y}`;
        }
        if (typeof cell === 'string' && /^\d{4}-\d{2}-\d{2}/.test(cell)) {
          const date = new Date(cell);
          return date.toLocaleDateString();
        }
        return cell;
      })
    );
  }
  
  return {
    headers,
    data: processedRows,
    originalData: data.originalData
  };
};

export const downloadFormattedFile = (data: ProcessedData, originalFileName: string) => {
  const worksheet = XLSX.utils.aoa_to_sheet([data.headers, ...data.data]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Formatted Data');
  
  const fileName = originalFileName.replace(/\.[^/.]+$/, '_formatted.xlsx');
  XLSX.writeFile(workbook, fileName);
};