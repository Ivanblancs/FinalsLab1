import React, { useState } from 'react';
import Papa from 'papaparse';

const FileUpload = ({ onDataProcessed }) => {
    const [fileName, setFileName] = useState('');

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setFileName(file.name);

        // Parse CSV using PapaParse
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (result) => {
                // Preprocess data
                const processedData = result.data.map((row) => ({
                    sales_date: new Date(row.sales_date).getMonth() + 1, // Convert month to numeric format
                    product_description: row.product_description,
                    quantity_sold: parseFloat(row.quantity_sold),
                }));
                onDataProcessed(processedData);
            },
            error: (error) => {
                console.error('Error parsing CSV:', error);
            },
        });
    };

    return (
        <div>
            <label htmlFor="file-upload" className="form-label">Upload CSV File:</label>
            <input
                id="file-upload"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="form-control"
            />
            {fileName && <p>File Uploaded: {fileName}</p>}
        </div>
    );
};

export default FileUpload;
