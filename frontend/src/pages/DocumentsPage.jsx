import React, { useEffect, useState, useRef } from 'react'
import { ocrAPI } from '../services/api'
import { useParams, useLocation } from 'react-router-dom'

function useQuery() {
  return new URLSearchParams(useLocation().search)
}

export default function DocumentsPage() {

  const [showUploadBox, setShowUploadBox] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [extractedData, setExtractedData] = useState(null)
  const fileInputRef = useRef(null)

  const { type } = useParams()
  const query = useQuery()
  const qtype = type || query.get('type')

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append("file", file)

    try {
      setUploading(true)
      const response = await ocrAPI.extract(formData)

      setExtractedData(response.data)
      setShowUploadBox(false)

    } catch (err) {
      console.error("OCR Error:", err)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>

      {/* Header */}
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <h2>OCR Document Extractor</h2>
        <button className="navy-btn" onClick={() => setShowUploadBox(!showUploadBox)}>
          Upload Document
        </button>
      </div>

      {/* Upload Box */}
      {showUploadBox && (
        <div style={{
          marginTop: 15,
          padding: 15,
          border: "1px solid var(--border)",
          borderRadius: 8,
          background: "rgba(255,255,255,0.05)"
        }}>
          <h4>Select Document to Extract</h4>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
          />

          {uploading && <p>Extracting text…</p>}
        </div>
      )}

      {/* Extracted OCR Result */}
      {extractedData && (
        <div style={{
          marginTop: 20,
          padding: 15,
          background:'rgba(255,255,255,0.07)',
          borderRadius: 8,
          border:'1px solid var(--border)'
        }}>
          <h3>Extracted OCR Data</h3>
          <pre style={{whiteSpace:'pre-wrap', padding:10}}>
            {JSON.stringify(extractedData, null, 2)}
          </pre>
        </div>
      )}

    </div>
  )
}
