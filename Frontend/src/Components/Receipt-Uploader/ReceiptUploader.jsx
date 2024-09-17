import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Link } from 'react-router-dom';
import './ReceiptUploader.css';
import { Line } from 'react-chartjs-2';

const UploadReceipt = () => {
    const [uploadedImages, setUploadedImages] = useState([]);
    const [totalSpent, setTotalSpent] = useState(12345.67); // Example value for the total spent in the last 30 days
    const [isLoading, setIsLoading] = useState(false);

    const onDrop = useCallback((acceptedFiles) => {
        const filesWithPreview = acceptedFiles.map(file =>
            Object.assign(file, {
                preview: URL.createObjectURL(file)
            })
        );
        setUploadedImages(prev => [...prev, ...filesWithPreview]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: 'image/*',
        multiple: true,
        maxFiles: 5,
    });

    const spendingData = {
        labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'],
        datasets: [
            {
                label: 'Amount Spent (LKR)',
                data: [2000, 3500, 1500, 4000, 3000],
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="min-h-screen p-6 bg-gray-100">
            {/* Header with Navigation */}
            <header className="flex justify-between items-center py-4">
                <h2 className="text-3xl font-bold text-blue-800">Receipt Uploader</h2>
                <nav>
                    <Link to="/ChargesTable" className="text-blue-600 hover:text-blue-800 mx-2">Charges Table</Link>
                    <Link to="/DataVisualizer" className="text-blue-600 hover:text-blue-800 mx-2">Data Visualizer</Link>
                    <Link to="/Dashboard" className="text-blue-600 hover:text-blue-800 mx-2">Dashboard</Link>
                    <Link to="/Settings" className="text-blue-600 hover:text-blue-800 mx-2">Settings</Link>
                </nav>
            </header>
    
            {/* Receipt Uploader Section */}
            <div {...getRootProps()} className={`border-2 border-dashed p-6 text-center rounded-lg ${isDragActive ? 'bg-blue-50 border-blue-400' : 'bg-white border-gray-300'}`}>
                <input {...getInputProps()} />
                {
                    uploadedImages.length > 0 ? (
                        <div className="grid grid-cols-2 gap-4 mt-4">
                            {uploadedImages.map((file, index) => (
                                <div key={index} className="overflow-hidden rounded-lg">
                                    <img src={file.preview} alt={`preview-${index}`} className="object-cover h-48 w-full" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        isDragActive ?
                            <p>Drop the files here...</p> :
                            <p>Drag 'n' drop up to 5 images here, or click to select files</p>
                    )
                }
            </div>
    
            {/* Visual Summary Section */}
            <div className="mt-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Uploaded Receipts Summary */}
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h4 className="text-xl font-semibold text-gray-800">Uploaded Receipts</h4>
                        <p className="text-gray-600">You have uploaded 4 receipts.</p> {/* Updated to show 4 receipts */}
                    </div>
    
                    {/* Spending in Last 30 Days */}
                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h4 className="text-xl font-semibold text-gray-800">Total Spend in Last 30 Days</h4>
                        <p className="text-2xl font-bold text-green-600">LKR 12,345.67</p>
                    </div>
                </div>
                {/* Spending Visualization */}
                <div className="bg-white p-6 rounded-lg shadow-md mt-8">
                    <h4 className="text-xl font-semibold text-gray-800 mb-4">Spending Trend</h4>
                    <div className="h-64"> {/* Adjusted height */}
                        <Line
                            data={{
                                labels: ["01/08/2024", "02/08/2024", "03/08/2024", "04/08/2024", "05/08/2024"],  // Sample dates
                                datasets: [{
                                    label: 'Amount Spent (LKR)',
                                    data: [2000, 3500, 1500, 3800, 3000],  // Sample amounts
                                    borderColor: 'rgba(75, 192, 192, 1)',
                                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                    fill: true,
                                }],
                            }}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                scales: {
                                    x: {
                                        type: 'category',
                                        title: {
                                            display: true,
                                            text: 'Date'
                                        }
                                    },
                                    y: {
                                        beginAtZero: true,
                                        title: {
                                            display: true,
                                            text: 'Amount (LKR)'
                                        }
                                    }
                                }
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
    
    
    
};

export default UploadReceipt;
