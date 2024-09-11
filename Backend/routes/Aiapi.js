require('dotenv').config();
const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const multer = require('multer');
const Tesseract = require('tesseract.js');

const router = express.Router();
const API_KEY = 'AIzaSyDvlKC5Yjfrhjp8t-ECy0_0pMG8fl2hlyY';
const genAI = new GoogleGenerativeAI(API_KEY);

const upload = multer({ dest: 'uploads/' }); // Store uploaded files in 'uploads/' folder

router.post('/upload', upload.array('images', 5), async (req, res) => {
    try {
        const { text } = req.body; // Retrieve text input from user
        const images = req.files;  // Retrieve uploaded image files (array)

        if (!images || images.length === 0) {
            return res.status(400).json({ error: 'No images uploaded' });
        }

        let extractedText = '';

        // Loop through images, process them with Tesseract OCR
        for (let image of images) {
            const ocrResult = await Tesseract.recognize(image.path, 'eng');
            extractedText += ocrResult.data.text + '\n';
        }

        console.log(`Extracted text: ${extractedText}`);

        // Combine the user text input with the extracted text from images
        const combinedText = `${text}\n\nExtracted Text from Receipts:\n${extractedText}`;

        // Use the combined text as input for the Gemini model
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent([combinedText]);

        // Send the Gemini result back to the frontend
        res.json(result.response.text());

    } catch (error) {
        console.error('Error processing images and text:', error);
        res.status(500).json({ error: 'Failed to process the images and text' });
    }
});

module.exports = router;

