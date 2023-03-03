import axios from "axios";
import { Configuration, OpenAIApi } from "openai";

const url = "/chat/completions";

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
  messages: [],
  temperature: 0.5,
  // max_tokens: 4096,
};

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${API_KEY}`,
};

export async function apiCall(messages = "Say this is a test", model = "gpt-3.5-turbo", signal) {
  data.messages = messages;
  data.model = model;

  try {
    const response = await openai.axios.post(openai.basePath + url, data, { headers: headers, signal });
    return { message: response.data.choices[0].message.content };
  } catch (err) {
    throw err;
  }
}
