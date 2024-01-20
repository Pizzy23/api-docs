const express = require("express");
const multer = require("multer");

const { PDF_Reader } = require("../service/pdf");
const { GPT } = require("../service/gpt");
const { PDF_Generator } = require("../service/generatePdf");

const router = express.Router();
const storage = multer.diskStorage({
  destination: "./pdfsFiles",
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

const servicePDF = new PDF_Reader();
const serviceGPT = new GPT();
const serviceGenerate = new PDF_Generator();

router.post("/upload-pdf", upload.single("pdf"), async (req, res) => {
  try {
    const uploadedPdfPath = req.file.path;
    const { page } = req.headers;
    if (page && uploadedPdfPath) {
      const array = await servicePDF.extractPages(uploadedPdfPath, page);
      const text = await servicePDF.arrayForText(array);
      const result = await serviceGPT.gptResume(text);

      res.status(200).json({ message: result });
    } else {
      throw new Error("Pdf Invalid");
    }
  } catch (error) {
    res.status(500).json({ error: "Internal error in pdf." });
  }
});

router.post("/diagram", async (req, res) => {
  try { 
    const response = await serviceGPT.sendChatRequest();
  } catch (error) {
    res.status(500).json({ error: "Internal error in pdf." });
  }
});

router.post("/generate", upload.single("pdf"), async (req, res) => {
  const uploadedPdfPath = req.file.path;
  try {
    const { word } = req.headers;
    const result = await serviceGenerate.extractPageWithContentWord(
      uploadedPdfPath,
      word
    );
    res.status(200).json({ message: result });
  } catch (error) {
    res.status(500).json({ error: "Internal error in pdf." });
  }
});

module.exports = router;
