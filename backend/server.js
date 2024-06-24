require('dotenv').config();;
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
// const { OpenAIApi, default: OpenAI } = require('openai'); // Importing OpenAIApi instead of Configuration
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const Dictionary = require('./models/Dictionary');

// const upload = multer({ storage: multer.memoryStorage() });

// Import routes
// const dictionaryRoutes = require('./routes/dictionaryRoutes');

const app = express();
const port = process.env.PORT || 7000; // Use the PORT from .env or default to 7000

// const openai = new OpenAI({ apiKey: 'process.env.OPENAI_API_KEY' }); // Initialize OpenAIApi with API key directly

// Middleware
app.use(bodyParser.json({ limit: '50mb' }));
app.use(cors());


const Uri = process.env.MONGO_URI;
mongoose.connect(Uri)

    .then(() => {
        console.log("Connected to MongoDB");
        return Dictionary.countDocuments({});
    })
    .then(async (count) => {
        if (count === 0) {
            console.log('Dictionary collection is empty, populating data...');
            const filePath = path.join(__dirname, 'dict.json');
            const dictionaryData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            await Dictionary.insertMany(dictionaryData);
            console.log('Dictionary data inserted successfully');
        } else {
            console.log('Dictionary collection already has data, no need to populate.');
        }
    })
    .catch(err => console.error('MongoDB connection error:', err));

// Use routes
// app.use('/api/dictionary', dictionaryRoutes);

// Configure Multer for image uploads
// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// // Route to handle image recognition
// app.post('/api/recognize-text', upload.single('image'), async (req, res) => {
//     try {
//         // const buffer = req.file.buffer;
//         // const response = await openai.images.recognizeText({ image: buffer });
//         // const recognizedText = response.data.text;
//         // res.json({ recognizedText });
//         if (!req.file) {
//             return res.status(400).json({ error: 'No file uploaded' });
//         } const buffer = req.file.buffer;
//     } catch (error) {
//         console.error('Error recognizing text:', error);
//         res.status(500).json({ error: 'Failed to recognize text' });
//     }
// });

// Route to get the meaning of a word
app.get('/api/dictionary/meaning/:word', async (req, res) => {
    // Remove all symbols and non-alphanumeric characters from the word
    const recognizedText = req.params.word.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    const language = req.query.language || 'English'; // Default to English if language is not specified

    try {
        const dictionaryEntry = await Dictionary.findOne({ word: { $regex: new RegExp(`^${recognizedText}$`, 'i') } });
        if (dictionaryEntry) {
            const meanings = dictionaryEntry.meanings[language];
            res.json({ word: recognizedText, meanings: meanings ? [meanings] : [] });
        } else {
            res.json({ word: recognizedText, meanings: [] });
        }
    } catch (error) {
        console.error('Error fetching meanings:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// app.post('/image_to_text/upload', upload.single('file'), async (req, res) => {
//     try {
//         // Ensure the file exists in the request
//         if (!req.file) {
//             console.error('No file uploaded');
//             return res.status(400).json({ error: 'No file uploaded' });
//         }

//         // Create a FormData object and append the file buffer
//         const form = new FormData();
//         form.append('file', req.file.buffer, req.file.originalname);

//         // Make the request to the external API
//         const response = await fetch('http://api.apilayer.com/image_to_text/upload', {
//             method: 'POST',
//             headers: {
//                 'apikey': 'FEmvQr5uj99ZUvk3essuYb6P5lLLBS20', // Replace with your actual API key
//                 ...form.getHeaders() // Include the form-data headers
//             },
//             body: form
//         });

//         // Parse the response
//         const data = await response.json();
//         res.json(data);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });



app.listen(port, () => {
    console.log(`Server running on ${port}`);
});






































// .................................................................

// require('dotenv').config();
// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const Tesseract = require('tesseract.js');
// const sharp = require('sharp');

// const app = express();
// const port = process.env.PORT || 7000;

// app.use(bodyParser.json({ limit: '50mb' }));
// app.use(cors());

// const preprocessImage = async (imageBuffer) => {
//     return sharp(imageBuffer)
//         .grayscale()
//         .threshold()
//         .toBuffer();
// };

// app.post('/api/recognize-text', async (req, res) => {
//     const { image } = req.body;

//     try {
//         const buffer = Buffer.from(image.replace(/^data:image\/\w+;base64,/, ""), 'base64');
//         const processedBuffer = await preprocessImage(buffer);

//         const { data: { words } } = await Tesseract.recognize(
//             processedBuffer,
//             'eng',
//             {
//                 logger: m => console.log(m)
//             }
//         );

//         const textData = words.map(word => ({
//             text: word.text,
//             bbox: word.bbox
//         }));

//         res.json({ textData });
//     } catch (error) {
//         console.error('Error recognizing text:', error);
//         res.status(500).json({ error: 'Failed to recognize text' });
//     }
// });

// app.listen(port, () => {
//     console.log(`Server running on http://localhost:${port}`);
// });