import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import './ReceiptUploader.css'; // Assuming you have a CSS file for styling

const UploadReceipt = () => {
    const [uploadedImages, setUploadedImages] = useState([]);

    const onDrop = useCallback((acceptedFiles) => {
        const filesWithPreview = acceptedFiles.map(file =>
            Object.assign(file, {
                preview: URL.createObjectURL(file)
            })
        );
        setUploadedImages(filesWithPreview);
    }, []);

    const handleCancel = () => {
        // Clear the uploaded images
        setUploadedImages([]);
    };

    const handleSubmit = () => {
        // Handle submit action (like uploading to server)
        console.log("Submit clicked!", uploadedImages);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: 'image/*' });

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
                            <p>Drag 'n' drop some files here, or click to select files</p>
                    )
                }
            </div>
            {uploadedImages.length > 0 && (
                <div className="button-container">
                    <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
                    <button className="submit-btn" onClick={handleSubmit}>Submit</button>
                </div>
            )}
            <div className="instructions">
                <p>You can upload images of your receipts here. Simply drag and drop them into the box or click to browse your files.</p>
            </div>
        </div>
    );
};

export default UploadReceipt;
