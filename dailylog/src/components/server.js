const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use(express.json());

app.post('/send-sms', async (req, res) => {
  const { url, options } = req.body;

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
