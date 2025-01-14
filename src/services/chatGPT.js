import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export const getChatGPTResponse = async (prompt) => {
  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4o-mini"
    });

    return {
      response: completion.choices[0].message.content,
      error: null
    };
  } catch (error) {
    console.error('Error calling ChatGPT API:', error);
    return {
      response: null,
      error: 'Failed to get recommendations. Please try again.'
    };
  }
} 