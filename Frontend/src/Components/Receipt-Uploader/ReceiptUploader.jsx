import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import './ReceiptUploader.css'; // Assuming you have a CSS file for styling

const UploadReceipt = () => {
    const [uploadedImages, setUploadedImages] = useState([]);
    const [textInput, setTextInput] = useState('');
    const [geminiResponse, setGeminiResponse] = useState([]);
    const [isLoading, setIsLoading] = useState(false);  // For the progress bar
    const [showDone, setShowDone] = useState(false);    // For the "done" popup
 
    const instructions =
            `the following is text extracted from a bunch of receipts. ONLY reply to the following in JSON. create the body of an API post request, in JSON format, as follows:
            {
            "charges": String,
            "amount": number,
            "category": String,
            "payee": String,
            "payment_type": String,
            "date": String,
            "time": String,
            "receipt_id": String,
            "receipt_ref_no": String,
            "qty": number
            }
            Each billed item of the receipt should be added as one record. Additionally, qty should mean quantity of the item, category should be something like "grocery" or "utility" or something like that. If any of the information is not available, set it to null. Here is the receipt:
        `;
   

    const onDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles.length + uploadedImages.length > 5) {
            alert('You can only upload up to 5 images.');
            return;
        }

        const filesWithPreview = acceptedFiles.map(file =>
            Object.assign(file, {
                preview: URL.createObjectURL(file)
            })
        );
        setUploadedImages(prev => [...prev, ...filesWithPreview]);
    }, [uploadedImages]);

    const handleCancel = () => {
        setUploadedImages([]);
    };

    const handleSubmit = async () => {
        if (uploadedImages.length === 0) {
            console.log('No images uploaded');
            return;
        }
    
        setIsLoading(true);  // Start showing progress bar
    
        const formData = new FormData();
        formData.append('text', instructions + textInput);
        uploadedImages.forEach((image, index) => {
            formData.append('images', image);
        });
    
        try {
            const response = await fetch('http://localhost:5001/api/ai/upload', {
                method: 'POST',
                body: formData,
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const data = await response.json();
    
            console.log('Data received from API:', data); // This should be an array of items
    
            setGeminiResponse(data); // Directly set the response data as it's already an array
    
            setIsLoading(false);  // Stop showing progress bar
            setShowDone(true);    // Show "Done" popup for 2 seconds
    
            setTimeout(() => {
                setShowDone(false);
            }, 2000);
    
        } catch (error) {
            console.error('Error submitting the images and text:', error);
            setIsLoading(false);
        }
    };
    

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: 'image/*',
        multiple: true,
        maxFiles: 5,
    });

    return (
        <div className="upload-container">
            <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
                <input {...getInputProps()} />
                {
                    uploadedImages.length > 0 ? (
                        <div className="preview-container">
                            {uploadedImages.map((file, index) => (
                                <div key={index} className="image-preview">
                                    <img src={file.preview} alt={`preview-${index}`} />
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
            {uploadedImages.length > 0 && (
                <div>
                    <textarea
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        placeholder="Please enter any additional data to the uploaded receipts"
                        className="text-input"
                    />
                    <div className="button-container">
                        <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
                        <button className="submit-btn" onClick={handleSubmit} disabled={isLoading}>
                            {isLoading ? 'Submitting...' : 'Submit'}
                        </button>
                    </div>
                </div>
            )}

            {/* Progress bar */}
            {isLoading && <div className="progress-bar"><div className="progress" /></div>}

            {/* Done popup */}
            {showDone && <div className="done-popup">Done!</div>}

            <div className="instructions">
                <p>You can upload images of your receipts here. The AI system will analyze it</p>
            </div>

            {/* Gemini Response Table */}
{/* Gemini Response Table */}
{geminiResponse && Array.isArray(geminiResponse) && (
    <div className="gemini-response">
        <h3>Receipt Details:</h3>
        <table className="response-table">
            <thead>
                <tr>
                    <th>Charges</th>
                    <th>Amount</th>
                    <th>Category</th>
                    <th>Payee</th>
                    <th>Payment Type</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Receipt ID</th>
                    <th>Receipt Ref No</th>
                    <th>Quantity</th>
                </tr>
            </thead>
            <tbody>
                {geminiResponse.map((item, index) => (
                    <tr key={index}>
                        <td>{item.charges}</td>
                        <td>{item.amount}</td>
                        <td>{item.category}</td>
                        <td>{item.payee}</td>
                        <td>{item.payment_type || 'N/A'}</td>
                        <td>{item.date}</td>
                        <td>{item.time}</td>
                        <td>{item.receipt_id}</td>
                        <td>{item.receipt_ref_no || 'N/A'}</td>
                        <td>{item.qty}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
)}
        </div>
    );
};

export default UploadReceipt;
