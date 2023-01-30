import axios from "axios";

const API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

const url = "https://api.openai.com/v1/completions";

const data = {
  model: "",
  prompt: "",
  temperature: 0.5,
  max_tokens: 120,
};

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${API_KEY}`,
};

export default async function apiCall(message = "Say this is a test", model = "text-davinci-003") {
  data.prompt = message;
  data.model = model;
  const response = await axios.post(url, data, { headers: headers });
  return { message: response.data.choices[0].text };
  // res.json({ message: response.data.choices[0].text });
}
