import imageCompression from 'browser-image-compression';
import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';


export const compressImage = async (file: File, quality: number = 0.7, targetSizeMB?: number, outputFormat?: string): Promise<File> => {
  const options: any = {
    maxSizeMB: targetSizeMB || 50,
    maxWidthOrHeight: 4096,
    useWebWorker: true,
    initialQuality: quality,
  };

  if (outputFormat) {
    options.fileType = outputFormat;
  }
  
  try {
    const compressedBlob = await imageCompression(file, options);
    // Maintain original filename but just return new generic File object
    const finalExt = outputFormat ? outputFormat.split('/')[1] : (file.name.split('.').pop() || 'jpg');
    const baseName = file.name.includes('.') ? file.name.substring(0, file.name.lastIndexOf('.')) : file.name;
    const fileName = `compressed_${baseName}.${finalExt}`;
    return new File([compressedBlob], fileName, { type: outputFormat || file.type });
  } catch (error) {
    console.error("Image compression error:", error);
    throw error;
  }
};

export const compressPDF = async (file: File, quality: number = 0.7, targetSizeMB?: number): Promise<File> => {
  try {
    // Load pdfjs
    const pdfjsLib = await new Promise<any>((resolve, reject) => {
      if ((window as any).pdfjsLib) return resolve((window as any).pdfjsLib);
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      script.onload = () => {
        const lib = (window as any).pdfjsLib;
        lib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        resolve(lib);
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
    const numPages = pdf.numPages;
    const pdfDoc = await PDFDocument.create();

    // Render each page as image and embed it
    // Use lower scale for more compression (default 1.5 is good balance)
    const scale = quality > 0.8 ? 2.0 : (quality < 0.4 ? 1.0 : 1.5);
    const targetMBPerPage = targetSizeMB ? (targetSizeMB / numPages) : undefined;

    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale });
      
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) throw new Error("Could not create canvas context");
      
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      
      await page.render({ canvasContext: context, viewport }).promise;
      
      // Compress to JPEG based on quality
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality));
      if (!blob) throw new Error("Failed to create blob from canvas");
      
      let imgBuffer = await blob.arrayBuffer();
      
      // If we have a target size, run image compression on this page
      if (targetMBPerPage) {
        const pageFile = new File([blob], `page_${i}.jpg`, { type: 'image/jpeg' });
        const compressedPageBlob = await imageCompression(pageFile, {
          maxSizeMB: targetMBPerPage,
          maxWidthOrHeight: 4096,
          useWebWorker: true,
          initialQuality: quality,
        });
        imgBuffer = await compressedPageBlob.arrayBuffer();
      }
      
      const image = await pdfDoc.embedJpg(imgBuffer);
      
      // Original dimensions for the page
      const originalViewport = page.getViewport({ scale: 1.0 });
      const pdfPage = pdfDoc.addPage([originalViewport.width, originalViewport.height]);
      
      pdfPage.drawImage(image, {
        x: 0,
        y: 0,
        width: originalViewport.width,
        height: originalViewport.height,
      });
    }

    const pdfBytes = await pdfDoc.save();
    return new File([pdfBytes as any], `compressed_${file.name}`, { type: 'application/pdf' });
  } catch (error) {
    console.error("PDF compression error:", error);
    // Fallback to basic saving if rasterization fails
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer, { updateMetadata: false });
      const pdfBytes = await pdfDoc.save({ useObjectStreams: false });
      return new File([pdfBytes as any], `compressed_${file.name}`, { type: 'application/pdf' });
    } catch (fallbackError) {
      throw error;
    }
  }
};

export const pdfToImages = async (
  file: File, 
  dpi: number = 150, 
  onProgress: (progress: number) => void
): Promise<File> => {
  try {
    // Load pdfjs via CDN to avoid Next.js Webpack build issues
    const pdfjsLib = await new Promise<any>((resolve, reject) => {
      if ((window as any).pdfjsLib) {
        resolve((window as any).pdfjsLib);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      script.onload = () => {
        const lib = (window as any).pdfjsLib;
        lib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        resolve(lib);
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
    
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
    const numPages = pdf.numPages;
    const zip = new JSZip();
    
    const scale = dpi / 72; // Default PDF DPI is 72

    if (numPages === 1) {
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale });
      
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) throw new Error("Could not create canvas context");
      
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      
      await page.render({ canvasContext: context, viewport }).promise;
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.9));
      if (!blob) throw new Error("Failed to create blob from canvas");
      
      onProgress(100);
      return new File([blob], `${file.name.replace('.pdf', '')}.jpg`, { type: 'image/jpeg' });
    }

    // Multiple pages: zip them together
    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale });
      
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) throw new Error("Could not create canvas context");
      
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      
      const renderContext: any = {
        canvasContext: context,
        viewport: viewport
      };
      
      await page.render(renderContext).promise;
      
      // Convert to JPG blob
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.9));
      if (blob) {
        zip.file(`page_${i}.jpg`, blob);
      }
      
      onProgress(Math.round((i / numPages) * 100));
    }
    
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    return new File([zipBlob], `${file.name.replace('.pdf', '')}_images.zip`, { type: 'application/zip' });
  } catch (error) {
    console.error("PDF to Image conversion error:", error);
    throw error;
  }
};

export const imagesToPDF = async (files: File[], pageSize: 'A4' | 'Letter' | 'Fit'): Promise<File> => {
  try {
    const pdfDoc = await PDFDocument.create();
    
    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      let image;
      if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
        image = await pdfDoc.embedJpg(arrayBuffer);
      } else if (file.type === 'image/png') {
        image = await pdfDoc.embedPng(arrayBuffer);
      } else {
        continue;
      }
      
      // Let's use A4 size as default for standard conversion (595.28 x 841.89 points)
      let pageDims = [595.28, 841.89];
      if (pageSize === 'Letter') pageDims = [612, 792];
      
      if (pageSize === 'Fit') {
        const page = pdfDoc.addPage([image.width, image.height]);
        page.drawImage(image, {
          x: 0,
          y: 0,
          width: image.width,
          height: image.height,
        });
      } else {
        const page = pdfDoc.addPage([pageDims[0], pageDims[1]]);
        
        // Calculate scaling
        const imgRatio = image.width / image.height;
        const pageRatio = pageDims[0] / pageDims[1];
        
        let drawWidth, drawHeight;
        if (imgRatio > pageRatio) {
           drawWidth = pageDims[0];
           drawHeight = drawWidth / imgRatio;
        } else {
           drawHeight = pageDims[1];
           drawWidth = drawHeight * imgRatio;
        }
        
        page.drawImage(image, {
          x: (pageDims[0] - drawWidth) / 2,
          y: (pageDims[1] - drawHeight) / 2,
          width: drawWidth,
          height: drawHeight,
        });
      }
    }
    
    const pdfBytes = await pdfDoc.save();
    return new File([pdfBytes as any], 'merged_images.pdf', { type: 'application/pdf' });
  } catch (error) {
    console.error("Images to PDF error:", error);
    throw error;
  }
};
