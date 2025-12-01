import React, { useState } from "react";
import { ocrAPI } from "../services/api";

const OcrUpload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResult("");
    setError("");
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select an image file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      setError("");
      setResult("");

      const response = await ocrAPI.extract(formData);
      setResult(response?.data?.text || "No text extracted.");
    } catch (err) {
      setError("Failed to extract text. Check console.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };  

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>OCR Image Text Extractor</h2>
      <input type="file" accept=".png,.jpg,.jpeg,.pdf,.txt,image/png,image/jpeg,application/pdf,text/plain" onChange={handleFile} />
      <button style={styles.button} onClick={handleUpload} disabled={loading}>
        {loading ? "Extracting..." : "Upload & Extract"}
      </button>

      {error && <p style={styles.error}>{error}</p>}

      {result && (
        <div style={styles.resultBox}>
          <h3>Extracted Text:</h3>
          <pre style={styles.pre}>{result}</pre>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { maxWidth: 600, margin: "auto", padding: 20 },
  title: { textAlign: "center" },
  button: {
    marginTop: 10,
    padding: "10px 18px",
    cursor: "pointer",
    background: "#1976d2",
    color: "#fff",
    border: "none",
    borderRadius: 6,
  },
  error: { color: "red" },
  resultBox: {
    marginTop: 20,
    padding: 15,
    border: "1px solid #ccc",
    borderRadius: 6,
    background: "#fafafa",
  },
  pre: {
    whiteSpace: "pre-wrap",
    background: "#fff",
    padding: 10,
    borderRadius: 4,
  },
};

export default OcrUpload;
