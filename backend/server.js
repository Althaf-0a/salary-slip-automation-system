require("dotenv").config();
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
const transporter = nodemailer.createTransport({
  service: "gmail",

 auth: {
  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASS
}
});

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

  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${fileName}"`
  );

  res.setHeader(
    "Content-Type",
    "application/pdf"
  );

  doc.pipe(res);

doc
  .fontSize(24)
  .text("ABC COMPANY", {
    align: "center"
  });

doc
  .fontSize(18)
  .text("Salary Slip", {
    align: "center"
  });

doc.moveDown(2);

doc
  .fontSize(14)
  .text(`Employee Name: ${employee.name}`);

doc.text(
  `Designation: ${employee.designation}`
);

doc.text(
  `Month: ${employee.month} ${employee.year}`
);

doc.moveDown();

doc.text("--------------------------------");

doc.text(
  `Base Salary: ${employee.base_salary}`
);

doc.text(`HRA: ${employee.hra}`);

doc.text(
  `Allowances: ${employee.allowances}`
);

doc.text(
  `Deductions: ${employee.deductions}`
);

doc.text("--------------------------------");

doc
  .fontSize(16)
  .text(
    `Net Salary: ${employee.net_salary}`
  );

doc.text("--------------------------------");

doc.moveDown(2);

doc
  .fontSize(12)
  .text(
    "This is a system generated salary slip.",
    {
      align: "center"
    }
  );

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
});
app.post("/send-email", async (req, res) => {

  const employee = req.body;

  const mailOptions = {

    from: "althafabubaker0@gmail.com",

    to: employee.email,

    subject: "Salary Slip",

    text:
`Hello ${employee.name},

Please find attached your salary slip.`

  };

  try {

    await transporter.sendMail(mailOptions);

    res.json({
      message: "Email sent successfully"
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Email failed"
    });

  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});