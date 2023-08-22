import * as html_to_pdf from "html-pdf-node";

export async function generatePdfToBase64(template, res) {
  let file = { content: template };
  let options = { format: "A4" };

  try {
    const pdfBuffer = await html_to_pdf.generatePdf(file, options);
    res.json({ response: pdfBuffer.toString("base64") });
  } catch (err) {
    res.sendStatus(500);
  }
}
