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