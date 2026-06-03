import "./App.css";
import { useState } from "react";
import Papa from "papaparse";

function App() {
  const [employees, setEmployees] = useState([]);
  const [salaries, setSalaries] = useState([]);
  const [mergedData, setMergedData] = useState([]);

  const handleEmployeeFile = (event) => {
    const file = event.target.files[0];

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,

      complete: function (results) {
        console.log(results.data);
        setEmployees(results.data);
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
};
const testBackend = async () => {
  const response = await fetch(
    "http://localhost:5000/api/test"
  );

  const data = await response.json();

  console.log(data);
};
const generatePDF = async (employee) => {

  const response = await fetch(
    "http://localhost:5000/generate-pdf",
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
};


  return (
    <div className="container">
      <div className="card">
        <h1>Employee Salary Slip Automation System</h1>

        <p>
          Upload payroll data, generate salary slips and send emails
          automatically.
        </p>

        <input
          type="file"
          accept=".csv"
          onChange={handleEmployeeFile}
        />
        {employees.length > 0 && (
  <p>Employee file uploaded successfully ✅</p>
)}

        <br />
        <br />
        <br />
<br />

<input
  type="file"
  accept=".csv"
  onChange={handleSalaryFile}
/>
{salaries.length > 0 && (
  <p>Salary file uploaded successfully ✅</p>
)}
<br />

<button onClick={mergeData}>
  Merge Data
</button>
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
      </tr>
    </thead>

    <tbody>
      {mergedData.map((employee, index) => (
        <tr key={index}>
          <td>{employee.name}</td>
          <td>{employee.base_salary}</td>
          <td>{employee.hra}</td>
          <td>{employee.allowances}</td>
          <td>{employee.deductions}</td>
          <td>{employee.net_salary}</td>
          <td>
  <button onClick={() => generatePDF(employee)}>
    Generate PDF
  </button>
</td>
        </tr>
      ))}
    </tbody>
  </table>
)}
      </div>
    </div>
  );
}

export default App;