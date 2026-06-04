import "./App.css";
import { useState } from "react";
import Papa from "papaparse";
import { ToastContainer, toast }
from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

function App() {
  const [employees, setEmployees] = useState([]);
  const [salaries, setSalaries] = useState([]);
  const [mergedData, setMergedData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [pdfLoading, setPdfLoading] =
  useState(false);

const [emailLoading, setEmailLoading] =
  useState(false);

  const handleEmployeeFile = (event) => {
    const file = event.target.files[0];

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,

      complete: function (results) {
        console.log(results.data);
        setEmployees(results.data);
        toast.success(
  "Employee file uploaded successfully"
);
      },
    });
  };
  const handleSalaryFile = (event) => {
    const file = event.target.files[0];

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,

      complete: function (results) {
        console.log(results.data);
        setSalaries(results.data);
        toast.success(
  "Salary file uploaded successfully"
);
      },
    });
  };
  const mergeData = () => {
    console.log("Employees:", employees);
console.log("Salaries:", salaries);
  const merged = employees.map((employee) => {

    const salaryRecord = salaries.find(
      (salary) =>
        salary.employee_id === employee.employee_id
    );

   return {
  ...employee,
  ...salaryRecord,

  net_salary:
    Number(salaryRecord.base_salary) +
    Number(salaryRecord.hra) +
    Number(salaryRecord.allowances) -
    Number(salaryRecord.deductions)
};
  });

  console.log(merged);

  setMergedData(merged);
  toast.success("Data merged successfully");
};
const testBackend = async () => {
  const response = await fetch(
    "https://salary-slip-backend.onrender.com/api/test"
  );

  const data = await response.json();

  console.log(data);
};
const generatePDF = async (employee) => {
  setPdfLoading(true);

  const response = await fetch(
    "https://salary-slip-backend.onrender.com/generate-pdf",
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify(employee)
    }
  );

  const blob = await response.blob();

  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");

  a.href = url;

  a.download =
    `${employee.name}_SalarySlip.pdf`;

  a.click();
  toast.success("PDF downloaded successfully");
  setPdfLoading(false);
};
const sendEmail = async (employee) => {
  setEmailLoading(true);

  const response = await fetch(
    "https://salary-slip-backend.onrender.com/send-email",
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify(employee)
    }
  );

  const data = await response.json();

  console.log(data);
  toast.success("Email sent successfully");
  setEmailLoading(false);
};
const filteredEmployees = mergedData.filter(
  (employee) =>
    employee.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
);


  return (
  <>
  <ToastContainer />
    <div className="container">
      <div className="card">
        <h1>Employee Salary Slip Automation System</h1>
        <div className="stats-container">

  <div className="stat-card">
    <h2>{employees.length}</h2>
    <p>Employees</p>
  </div>

  <div className="stat-card">
    <h2>{salaries.length}</h2>
    <p>Salary Records</p>
  </div>

  <div className="stat-card">
    <h2>{mergedData.length}</h2>
    <p>Merged Records</p>
  </div>

</div>

        <p>
          Upload payroll data, generate salary slips and send emails
          automatically.
        </p>

       <div className="upload-box">

  <label className="custom-upload">

    <input
      type="file"
      accept=".csv"
      onChange={handleEmployeeFile}
      hidden
    />

    <div className="upload-content">
      <h3>📁 Upload Employee CSV</h3>
      <p>Click to browse employee file</p>
    </div>

  </label>

  {employees.length > 0 && (
    <p className="success-text">
      Employee file uploaded successfully ✅
    </p>
  )}

</div>
   

        <br />
        <br />
        <br />
<br />
<div className="upload-box">

  <label className="custom-upload">

    <input
      type="file"
      accept=".csv"
      onChange={handleSalaryFile}
      hidden
    />

    <div className="upload-content">
      <h3>💰 Upload Salary CSV</h3>
      <p>Click to browse salary file</p>
    </div>

  </label>

  {salaries.length > 0 && (
    <p className="success-text">
      Salary file uploaded successfully ✅
    </p>
  )}

</div>

<br />

<button onClick={mergeData}>
  Merge Data
</button>
<br />
<br />

<input
  type="text"
  placeholder="Search employee..."
  value={searchTerm}
  onChange={(e) =>
    setSearchTerm(e.target.value)
  }
  className="search-input"
/>
<br />
<br />

<button onClick={testBackend}>
  Test Backend Connection
</button>
        {employees.length > 0 && (
          <table border="1" width="100%">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Designation</th>
              </tr>
            </thead>

            <tbody>
              {employees.map((employee, index) => (
                <tr key={index}>
                  <td>{employee.employee_id}</td>
                  <td>{employee.name}</td>
                  <td>{employee.email}</td>
                  <td>{employee.designation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <br />
<br />

{mergedData.length > 0 && (
  <table border="1" width="100%">
    <thead>
      <tr>
        <th>Employee</th>
        <th>Base Salary</th>
        <th>HRA</th>
        <th>Allowances</th>
        <th>Deductions</th>
        <th>Net Salary</th>
        <th>PDF</th>
        <th>Email</th>
      </tr>
    </thead>

    <tbody>
      {filteredEmployees.map((employee, index) => (
        <tr key={index}>
          <td>{employee.name}</td>
          <td>{employee.base_salary}</td>
          <td>{employee.hra}</td>
          <td>{employee.allowances}</td>
          <td>{employee.deductions}</td>
          <td>{employee.net_salary}</td>
          <td>
  <button
  onClick={() => generatePDF(employee)}
  disabled={pdfLoading}
>
  {pdfLoading
    ? "Generating..."
    : "Generate PDF"}
</button>
</td>
<td>
  <button
  onClick={() => sendEmail(employee)}
  disabled={emailLoading}
>
  {emailLoading
    ? "Sending..."
    : "Send Email"}
</button>
</td>
        </tr>
      ))}
    </tbody>
  </table>
)}
        </div>
  </div>

</>
);
}

export default App;