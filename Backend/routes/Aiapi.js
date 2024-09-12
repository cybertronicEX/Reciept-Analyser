require('dotenv').config();
const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const multer = require('multer');
const Tesseract = require('tesseract.js');

const router = express.Router();
const API_KEY = 'AIzaSyDvlKC5Yjfrhjp8t-ECy0_0pMG8fl2hlyY';
const genAI = new GoogleGenerativeAI(API_KEY);

// Set up multer to store files in memory (as Buffer objects)
const storage = multer.memoryStorage();  // Store files in memory instead of disk
const upload = multer({ storage });  // Initialize multer with memory storage

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
            const ocrResult = await Tesseract.recognize(image.buffer, 'eng');
            extractedText += ocrResult.data.text + '\n';
        }

        console.log(`Extracted text: ${extractedText}`);

        // Combine the user text input with the extracted text from images
        const combinedText = `${text}\n\nExtracted Text from Receipts:\n${extractedText}`;

        // Use the combined text as input for the Gemini model
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent([combinedText]);
        
        // Log the response to check its structure
        console.log('Gemini response:', result);

        // Parse and clean up the response
        let responseText = result.response.text(); // Assuming this returns a string
        responseText = responseText.replace(/```json/g, '').replace(/```/g, ''); // Remove markdown code blocks if present

        // Attempt to parse the cleaned-up response text as JSON
        const jsonResponse = JSON.parse(responseText);

        res.json(jsonResponse); // Send the parsed JSON response to the frontend
    } catch (error) {
        console.error('Error processing images and text:', error);
        res.status(500).json({ error: 'Failed to process the images and text' });
    }
});

module.exports = router;

