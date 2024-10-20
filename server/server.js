const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// Route to generate essay
app.post('/generate-essay', async (req, res) => {
    const { topic } = req.body;

    try {
        const response = await axios.post(
            'https://api-inference.huggingface.co/models/EleutherAI/gpt-neo-2.7B',
            {
                inputs: `Write an essay on the following topic: ${topic}`,
                parameters: {
                    max_new_tokens: 200,  // Adjust token size for a longer essay
                    temperature: 0.7,     // Creativity parameter
                    top_p: 0.95,          // Top-p sampling
                    num_return_sequences: 1
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
                },
            }
        );

        const essay = response.data[0]?.generated_text;
        res.json({ essay });
    } catch (error) {
        console.error('Error generating essay:', error);
        res.status(500).send('Error generating essay');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
