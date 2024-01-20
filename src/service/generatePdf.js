const fs = require("fs");
const PDFDocument = require("pdf-lib").PDFDocument;
const pdfParse = require("pdf-parse");

class PDF_Generator {
  async extractPageWithContentWord(pdfPath, word) {
    try {
      const documentAsBytes = await fs.promises.readFile(pdfPath);

      const pdfDoc = await PDFDocument.load(documentAsBytes);
      const pagesItContent = [];
      const numberOfPages = pdfDoc.getPageCount();

      for (let i = 0; i < numberOfPages; i++) {
        const subDocument = await PDFDocument.create();

        const copiedPage = await subDocument.copyPages(pdfDoc, [i]);
        subDocument.addPage(copiedPage[0]);

        const pdfBytes = await subDocument.save();
        const text = await this.getPageText(pdfBytes);
        if (text.includes(word)) {
          pagesItContent.push({ text: text, originalPage: i + 1 });
        }
      }
      return pagesItContent;
    } catch (error) {
      throw new Error(`Error splitting PDF: ${error.message}`);
    }
  }
  writePdfBytesToFile(fileName, pdfBytes) {
    return fs.promises.writeFile(fileName, pdfBytes);
  }

  async getPageText(pdfBytes) {
    const pdfData = await pdfParse(pdfBytes);
    const pdfText = pdfData.text;
    const pdfClear = pdfText.replace(/\n/g, " ");
    return pdfClear;
  }

  async generateNewPdf(text) {
    try {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage();
      const { width, height } = page.getSize();
      const font = await pdfDoc.embedFont(PDFDocument.Font.Helvetica);

      page.drawText(text, {
        x: 50,
        y: height - 200,
        font,
        size: 12,
        color: rgb(0, 0, 0),
      });

      const newPdfBytes = await pdfDoc.save();
      return newPdfBytes;
    } catch (error) {
      throw new Error(`Error generating new PDF: ${error.message}`);
    }
  }
}

module.exports = { PDF_Generator };
