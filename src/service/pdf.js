const fs = require("fs").promises;
const pdfParse = require("pdf-parse");
const { PDFDocument } = require("pdf-lib");

class PDF_Reader {
  async extractPages(pdfPath, pageNumbersToKeep) {
    try {
      const pageSlices = pageNumbersToKeep.split(",").map(Number);
      const existingPdfBytes = await fs.readFile(pdfPath);
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const pages = pdfDoc.getPages();

      for (let i = pages.length - 1; i >= 0; i--) {
        if (!pageSlices.includes(i + 1)) {
          pdfDoc.removePage(i);
        }
      }
      const modifiedPdfBytes = await pdfDoc.save();

      return modifiedPdfBytes;
    } catch (error) {
      throw new Error(`Error extracting text: ${error.message}`);
    }
  }
  async bytesText(bytes) {
    try {
      const pdfData = await pdfParse(bytes);
      const pdfText = pdfData.text;
      const pdfClear = pdfText.replace(/\n/g, " ");
      return pdfClear;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = { PDF_Reader };
