import axios from "axios";

const API_KEY = "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";

const url = "https://api.openai.com/v1/completions";

const data = {
  model: "text-davinci-003",
  prompt: "Say this is a test",
  temperature: 0.5,
  max_tokens: 120,
};

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${API_KEY}`,
};

export default async function apiCall(message) {
  data.prompt = message;
  const response = await axios.post(url, data, { headers: headers });
  return { message: response.data.choices[0].text };
  // res.json({ message: response.data.choices[0].text });
}
