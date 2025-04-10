import React, { useState } from "react";
import axios from "axios";

export default function UploadGereedschap() {
  const [jsonFile, setJsonFile] = useState(null); // Store the file

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setJsonFile(file);
  };

  // Handle the file upload on submit
  const onSubmit = async (e) => {
    e.preventDefault();

    if (!jsonFile) {
      alert("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("jsonFile", jsonFile);

    try {

       // Ask for the username and password
    const username = prompt("your-username");  // Replace with your actual username
    const password = prompt("Enter your password:");  // Prompt user for the password

    // Encode username and password in base64
    const basicAuth = `Basic ${btoa(username + ":" + password)}`;

      await axios.post("http://localhost:8080/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": basicAuth,
        },
      });
      alert("File uploaded successfully!");
    } catch (error) {
      console.error("Error uploading file", error);
      alert("Error uploading file.");
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
          <h2 className="text-center m-4">Upload JSON File</h2>
          <form onSubmit={onSubmit}>
            <div className="mb-3">
              <label htmlFor="jsonFile" className="form-label">
                Upload JSON file
              </label>
              <input
                type="file"
                className="form-control"
                accept=".json"
                onChange={handleFileChange}
              />
            </div>
            <button type="submit" className="btn btn-outline-primary">
              Upload
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
