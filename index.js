const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

const prodiaApiKey = process.env.PRODIA_API_KEY || 'fbd48460-616c-4beb-bc8b-5ff153f54be9'; // Use environment variable

app.use(cors()); // Enable CORS

app.get('/prodia', async (req, res) => {
  const prompt = req.query.prompt;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt parameter is required' });
  }

  const options = {
    method: 'POST',
    url: 'https://api.prodia.com/v1/sd/generate',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      'X-Prodia-Key': prodiaApiKey
    },
    data: {
      model: 'v1-5-pruned-emaonly.safetensors [d7049739]',
      prompt: prompt,
      negative_prompt: 'badly drawn',
      steps: 20,
      style_preset: '3d-model',
      cfg_scale: 7,
      seed: -1,
      upscale: true,
      sampler: 'DPM++ 2M Karras',
      width: 512,
      height: 512
    }
  };

  try {
    const response = await axios.request(options);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: `An error occurred: ${error.message}` });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
