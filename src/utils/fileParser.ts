import * as pdfjs from 'pdfjs-dist';
import mammoth from 'mammoth';

// Set PDF worker source securely to prevent missing worker dependency issues
pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

export async function parseTxtFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

export async function parseDocxFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const arrayBuffer = reader.result as ArrayBuffer;
        const result = await mammoth.extractRawText({ arrayBuffer });
        resolve(result.value);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
}

export async function parsePdfFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const arrayBuffer = reader.result as ArrayBuffer;
        const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        let extractedText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map((item: any) => item.str).join(' ');
          extractedText += pageText + '\n';
        }
        if (!extractedText.trim()) {
          throw new Error('No text content found inside PDF.');
        }
        resolve(extractedText);
      } catch (err) {
        console.warn('PDF.js text extraction failed, using fallback raw byte conversion:', err);
        try {
          const arrayBuffer = reader.result as ArrayBuffer;
          const fallbackText = fallbackBytesToString(arrayBuffer);
          resolve(fallbackText);
        } catch (fallbackErr) {
          reject(fallbackErr);
        }
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });
}

function fallbackBytesToString(arrayBuffer: ArrayBuffer): string {
  const arr = new Uint8Array(arrayBuffer);
  let str = '';
  for (let i = 0; i < arr.length; i++) {
    const char = arr[i];
    if ((char >= 32 && char <= 126) || char === 10 || char === 13 || char === 9) {
      str += String.fromCharCode(char);
    }
  }
  return str.replace(/\s+/g, ' ').trim();
}

export async function parseCVFile(file: File): Promise<string> {
  const extension = file.name.split('.').pop()?.toLowerCase();
  if (extension === 'txt') {
    return parseTxtFile(file);
  } else if (extension === 'docx') {
    return parseDocxFile(file);
  } else if (extension === 'pdf') {
    return parsePdfFile(file);
  } else {
    return parseTxtFile(file);
  }
}
