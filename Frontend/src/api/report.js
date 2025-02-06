import { generateExcelTemplate } from '../path/to/your/generateExcelTemplate'; // Adjust the path accordingly

export const generateExcelReport = async (req, res) => {
  try {
    const rows = req.body.rows || []; // Assuming you send the rows data in the request body
    await generateExcelTemplate(rows, res);
  } catch (error) {
    console.error("Error in generateExcelReport:", error.message);
    res.status(500).json({ error: "Failed to generate Excel report" });
  }
};