import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import './ReceiptUploader.css';
import axios from 'axios';

const UploadReceipt = () => {
    const [uploadedImages, setUploadedImages] = useState([]);
    const [textInput, setTextInput] = useState('');
    const [geminiResponse, setGeminiResponse] = useState([]);
    const [isLoading, setIsLoading] = useState(false);  
    const [showDone, setShowDone] = useState(false);  
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const [isError, setIsError] = useState(false);  

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
            make sure the date is in formate dd/mm/yyyy if year isnt known, assume its 2024 always. receipt_id should be a generated simple unique ID for the receipt using timestamp. For one receipt there can only be 1 receipt_Id and receipt_ref_no should be the unique Id of the receipt given by the shop. it may be referred as 'No.','receipt','Invoice','ref', etc..
            Each billed item of the receipt should be added as one record. Additionally, qty should mean quantity of the item, category should be one of the following "Utilities","Food & Beverages", "Transport", "Entertainment", "Healthcare","Education",Housing","Clothing","Personal Care","Travel", "Grocery","Electronics","Dining out","Fitness","Miscellaneous","Savings","Investment","Gifts","Subscriptions","Taxes" . If any of the information is not available, set it to null. Additionally, convert prices to LKR according to whatever data you have. this doesnt have to be accurate. Here are the receipts (could be text extracted from one or more):
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

        setIsLoading(true);  
        setIsError(false); 
        setIsModalOpen(true); 

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
            setGeminiResponse(data); 
            setIsLoading(false); 

        } catch (error) {
            console.error('Error submitting the images and text:', error);
            setIsLoading(false);
            setIsError(true); 
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: 'image/*',
        multiple: true,
        maxFiles: 5,
    });

    const saveCharges = async (charges) => {
        try {

            const response = await axios.post('http://localhost:5001/api/charges/bulk', charges);
            console.log('Charges saved:', response.data);
            setShowDone(true)
        } catch (error) {
            console.error('Error saving charges:', error);
        } finally {
            setIsModalOpen(false);
            setTimeout(() => {
                setShowDone(false);
            }, 3000);
        }
    };
    return (
        <div className="upload-container">
           <h2 className='h2'>Receipt Uploader</h2>
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

            {/* Text input and buttons displayed only when there are uploaded images */}
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


            {/* Done popup notification */}
            {showDone && <div className="done-popup">Successfully Added!</div>}

            {/* Instructions for users */}
            <div className="instructions">
                <p>You can upload images of your receipts here. The AI system will analyze them.</p>
            </div>

            {/* Modal for showing loading, error, or results */}
            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        {isLoading ? (
                            <>
                                <p>Loading, please wait...</p>
                                <div className="progress-bar"><div className="progress" /></div>
                            </>
                        ) : isError ? (
                            <p className="error-message">An error occurred while processing the receipts. Please try again.</p>
                        ) : (
                            geminiResponse && Array.isArray(geminiResponse) && (
                                <div className="gemini-response-container">
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
                            )
                        )}
                        {isLoading === false && (
                            <>
                                <button className="close-modal" onClick={() => setIsModalOpen(false)}>Close</button>
                                <button className="submit-btn" style={{ marginTop: '10px' }} onClick={() => saveCharges(geminiResponse)}>Add to Database</button>
                            </>
                        )}

                    </div>
                </div>
            )}
        </div>
    );
};

export default UploadReceipt;
