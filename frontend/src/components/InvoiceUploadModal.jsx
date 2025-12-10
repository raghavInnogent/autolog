import { useState } from 'react'
import { servicesAPI } from '../services/api'
import '../styles/components/InvoiceUploadModal.css'

export default function InvoiceUploadModal({ onClose, onDataExtracted }) {
    const [file, setFile] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleUpload = async (e) => {
        e.preventDefault()

        if (!file) {
            setError('Please select a file to upload')
            return
        }

        setLoading(true)
        setError('')

        try {
            const formData = new FormData()
            formData.append('image', file)

            const response = await servicesAPI.fetchDataFromImage(formData)
            console.log('Full API Response:', response)
            console.log('response.data:', response.data)
            console.log('response.data.data:', response.data?.data)

            // Check where the actual data is
            const extractedData = response.data?.data || response.data
            console.log('Extracted data to use:', extractedData)

            // Call success callback with extracted data FIRST
            if (onDataExtracted && extractedData) {
                onDataExtracted(extractedData)
            } else {
                console.error('No data extracted or callback missing!')
            }

            // Close modal AFTER setting the data
            if (onClose) {
                onClose()
            }
        } catch (err) {
            console.error('Upload error:', err)
            setError(err?.response?.data?.message || 'Failed to extract data from invoice')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="invoice-upload-modal">
            <form onSubmit={handleUpload} style={{ display: 'grid', gap: 12 }}>
                <h3 style={{ margin: 0 }}>Upload Invoice</h3>

                <p style={{ fontSize: 14, color: 'var(--muted)', margin: '0 0 8px 0' }}>
                    Upload an invoice image or PDF to automatically extract service data
                </p>

                <label>Select Invoice File
                    <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={e => setFile(e.target.files?.[0] || null)}
                        required
                        style={{ marginTop: 8 }}
                    />
                </label>

                {file && (
                    <div style={{
                        padding: 8,
                        background: 'var(--card)',
                        borderRadius: 6,
                        fontSize: 13,
                        color: 'var(--text)'
                    }}>
                        Selected: <strong>{file.name}</strong> ({(file.size / 1024).toFixed(2)} KB)
                    </div>
                )}

                {error && <div style={{ color: 'crimson', fontSize: 13 }}>{error}</div>}

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
                    <button
                        type="button"
                        onClick={onClose}
                        className="navy-btn"
                        style={{ background: 'var(--card)', color: 'var(--text)', border: '1px solid var(--border)' }}
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button type="submit" className="navy-btn" disabled={loading}>
                        {loading ? 'Processing...' : 'Upload & Extract'}
                    </button>
                </div>
            </form>
        </div>
    )
}
