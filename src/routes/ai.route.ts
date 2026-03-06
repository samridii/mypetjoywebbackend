import { Router } from "express";
import axios from "axios";

const router = Router();

router.post("/quiz", async (req, res, next) => {
  try {
    const { answers } = req.body;

    if (!answers) {
      return res.status(400).json({
        success: false,
        error: 'Please provide an "answers" field in the request body.',
      });
    }

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "user",
            content: `Based on these answers suggest the best pet: ${answers}`,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({
      success: true,
      recommendation: response.data.choices[0].message.content,
    });
  } catch (error) {
    next(error);
  }
});

export default router;