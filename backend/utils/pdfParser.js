import fs from "fs/promises";
import pdf from "pdf-parse";

/**
 * Extract text from PDF file
 * @param {string} filepath
 * @returns {Promise<{text:string,numPages:number,info:any}>}
 */

export const extractTextFromPDF = async (filepath) => {
  try {
    const dataBuffer = await fs.readFile(filepath);

    const data = await pdf(dataBuffer);

    return {
      text: data.text,
      numPages: data.numpages,
      info: data.info,
    };
  } catch (error) {
    console.error("PDF parsing error:", error);
    throw new Error("Failed to extract text from PDF");
  }
};