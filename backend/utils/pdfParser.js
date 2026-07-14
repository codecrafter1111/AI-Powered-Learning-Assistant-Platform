import fs from "fs/promises";
import { PDFParse } from "pdf-parse";

export const extractTextFromPDF = async (filepath) => {
  try {
    const dataBuffer = await fs.readFile(filepath);

    const parser = new PDFParse({
      data: new Uint8Array(dataBuffer),
    });

    const data = await parser.getText();

    await parser.destroy();

    return {
      text: data.text,
      numPages: data.numPages,
      info: data.info,
    };
  } catch (error) {
    console.error("PDF parsing error:", error);
    throw new Error("Failed to extract text from PDF");
  }
};