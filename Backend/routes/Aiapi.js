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

router.post('/process-data', async (req, res) => {
    try {
        const { filteredData } = req.body;

        if (!filteredData) {
            return res.status(400).json({ error: 'No filtered data provided' });
        }
        const prompt =
        `
        This data is a list of charges extracted from a bunch of receipts. 
        Please go through this data and analyze the spending patterns. 
        Ommit information that is not complete enough for your analysis.
        Please note that quantities for grocery items would most likely be in kilo grams. please assume the logical option when looking at the quantities. Keep an eye out for outliers and ommit them if needed
        Provide insights into spending patterns and suggest potential areas for savings. Do not go into detail, or mention the items you omitted. keep this as natural as possible
        Limit to 100 words.
        `;

        const textInput = `${prompt}\n\n${JSON.stringify(filteredData, null, 2)}`; // Convert to JSON string

        // Use the Gemini model
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent([textInput]);

        // Log the raw response text for debugging
        let responseText = result.response.text();
        console.log('Raw response text:', responseText);

        // Clean up the response text
        // Remove any specific unwanted characters, markdown, or extra content
        responseText = responseText
            .replace(/```json/g, '')     // Remove starting ```json
            .replace(/```/g, '')         // Remove ending ```
            .replace(/\n{2,}/g, '\n')    // Replace multiple newlines with a single newline
            .replace(/\s{2,}/g, ' ')     // Replace multiple spaces with a single space
            .trim();                     // Trim any leading or trailing whitespace

        // Send the cleaned response text
        res.send(responseText);
    } catch (error) {
        console.error('Error processing data:', error);
        res.status(500).json({ error: 'Failed to process the data' });
    }
});


module.exports = router;

