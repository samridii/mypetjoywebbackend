import axios from "axios";

export const getPetRecommendation = async (answers: any) => {
  const answersText = typeof answers === "string"
    ? answers
    : JSON.stringify(answers, null, 2);

  const prompt = `
  Recommend one suitable pet (Dog, Cat, Rabbit, Bird, Fish, etc.)
  based on the following user answers:

  ${answersText}

  Give a short explanation.
  `;

  const response = await axios.post(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: "You are a pet expert." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.choices[0].message.content;
};