// Function to convert HTML to PDF blob
export async function htmlToPdfBlobForQuotation(htmlContent: string): Promise<Blob> {
    // Create a temporary div to render the HTML
    const element = document.createElement("div");
    element.innerHTML = htmlContent;
    element.style.position = "absolute";
    element.style.left = "-9999px";
    element.style.top = "-9999px";
    document.body.appendChild(element);
  
    try {
      const { jsPDF } = await import("jspdf");
      const { default: html2canvas } = await import("html2canvas");
  
      const canvas = await html2canvas(element, {
        scale: 1,
        useCORS: true,
        logging: false,
        windowWidth: 1200, // Set fixed width to avoid layout issues
      });
  
      const imgData = canvas.toDataURL("image/png");
  
      // Initialize jsPDF
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
  
      // Calculate dimensions
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
  
      let heightLeft = imgHeight;
      let position = 0;
  
      // Add first page
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
  
      // Add additional pages if needed
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
  
      // Get the PDF as blob
      const pdfBlob = pdf.output("blob");
      return pdfBlob;
    } catch (error) {
      console.error("Error generating PDF blob:", error);
      throw new Error("Failed to generate PDF blob");
    } finally {
      // Clean up
      document.body.removeChild(element);
    }
  }
  
  // Updated htmlToPdfBlob function with proper TypeScript support
 export async function htmlToPdfBlob(htmlContent: string): Promise<Blob> {
    try {
      // Import pdfmake
      const pdfMakeModule = await import("pdfmake/build/pdfmake");
      const pdfMake = pdfMakeModule.default || pdfMakeModule;
  
      // Import vfs_fonts properly - this is the key fix
      const vfs = await import("pdfmake/build/vfs_fonts");
  
      // Set fonts directly
      pdfMake.vfs = vfs.vfs;
  
      // Import html-to-pdfmake
      const htmlToPdfMakeModule = await import("html-to-pdfmake");
      const htmlToPdfMake = htmlToPdfMakeModule.default || htmlToPdfMakeModule;
  
      // Pre-process HTML content to handle emojis and styles
      let processedHtml = htmlContent;
  
      // Simple emoji mapping
      const emojiMap = {
        "📌": " ",
        "✅": " ",
        "🔷": " ",
        "🔹": " ",
        "1️⃣": " ",
        "2️⃣": " ",
        "3️⃣": " ",
        // Add more emoji mappings as needed
      };
  
  
      // Replace emojis with text representations
      Object.entries(emojiMap).forEach(([emoji, text]) => {
        processedHtml = processedHtml.replace(new RegExp(emoji, "g"), text);
      });
  
      // Remove style tags but keep their selectors for manual styling later
      processedHtml = processedHtml.replace(/<style>[\s\S]*?<\/style>/gi, "");
      // Create a temporary div to parse the HTML
      const element = document.createElement("div");
      element.innerHTML = processedHtml;
      try {
        // Convert HTML to pdfmake compatible format
        const pdfContent = htmlToPdfMake(element.innerHTML, {
          tableAutoSize: true,
          imagesByReference: false,
        });
  
        // Generate the PDF document definition
        const docDefinition = {
          content: pdfContent,
          defaultStyle: {
            fontSize: 11,
          },
          styles: {
            h1: {
              fontSize: 18,
              bold: true,
              margin: [0, 10, 0, 5] as [number, number, number, number],
            },
            h2: {
              fontSize: 16,
              bold: true,
              margin: [0, 10, 0, 5] as [number, number, number, number],
            },
            h3: {
              fontSize: 14,
              bold: true,
              margin: [0, 10, 0, 5] as [number, number, number, number],
            },
            p: { margin: [0, 5, 0, 5] as [number, number, number, number] },
            ul: { margin: [0, 5, 0, 15] as [number, number, number, number] },
          },
        };
  
        // Create and return the PDF blob
        return new Promise((resolve, reject) => {
          try {
            const pdfDocGenerator = pdfMake.createPdf(docDefinition);
            pdfDocGenerator.getBlob((blob: Blob) => {
              resolve(blob);
            });
          } catch (error) {
            reject(error);
          }
        });
      } finally {
        // No need to remove from DOM since we didn't append
      }
    } catch (error) {
      console.error("Error generating PDF blob:", error);
      throw new Error(
        error instanceof Error
          ? `Failed to generate PDF: ${error.message}`
          : "Failed to generate PDF blob"
      );
    }
  }