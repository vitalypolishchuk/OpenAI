import axios from "axios";
import { Configuration, OpenAIApi } from "openai";

const url = "/completions";

const API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

const configuration = new Configuration({
  organization: process.env.REACT_APP_OPENAI_ORGANIZATION,
  apiKey: `${API_KEY}`,
});

const openai = new OpenAIApi(configuration);

export function abortRequest(controller) {
  controller.abort();
}

const data = {
  model: "",
  prompt: "",
  temperature: 0.5,
  max_tokens: 1024,
};

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${API_KEY}`,
};

export async function apiCall(message = "Say this is a test", model = "text-davinci-003", signal) {
  data.prompt = message;
  data.model = model;

  try {
    const response = await openai.axios.post(openai.basePath + url, data, { headers: headers, signal });
    console.log(response.data.choices);
    return { message: response.data.choices[0].text };
  } catch (err) {
    throw err;
  }
  // res.json({ message: response.data.choices[0].text });
}
