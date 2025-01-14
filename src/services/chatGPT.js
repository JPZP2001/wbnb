import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: "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",
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