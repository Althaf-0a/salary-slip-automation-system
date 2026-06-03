const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend Server Running");
});
app.get("/api/test", (req, res) => {
  res.json({
    message: "API is working successfully"
  });
});
app.post("/generate-pdf", (req, res) => {

  const employee = req.body;

  const doc = new PDFDocument();

  const fileName =
    `${employee.name}_SalarySlip.pdf`;

  const filePath = path.join(
    __dirname,
    "pdfs",
    fileName
  );

  doc.pipe(fs.createWriteStream(filePath));

  doc.fontSize(20).text("Salary Slip", {
    align: "center"
  });

  doc.moveDown();

  doc.fontSize(14).text(
    `Employee Name: ${employee.name}`
  );

  doc.text(
    `Designation: ${employee.designation}`
  );

  doc.text(
    `Base Salary: ${employee.base_salary}`
  );

  doc.text(
    `HRA: ${employee.hra}`
  );

  doc.text(
    `Allowances: ${employee.allowances}`
  );

  doc.text(
    `Deductions: ${employee.deductions}`
  );

  doc.text(
    `Net Salary: ${employee.net_salary}`
  );

  doc.end();

  res.json({
    message: "PDF generated successfully"
  });
});


app.listen(5000, () => {
  console.log("Server running on port 5000");
});