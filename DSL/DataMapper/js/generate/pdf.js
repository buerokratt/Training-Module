import * as html_to_pdf from "html-pdf-node";

export async function generatePdf(filename, template, res) {
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename=${filename}.pdf`);

  let file = { content: template };
  let options = { format: "A4" };

  try {
    const pdfBuffer = await html_to_pdf.generatePdf(file, options);
    res.send(pdfBuffer);
  } catch (err) {
    console.error(err)
    res.sendStatus(500);
  }
}
