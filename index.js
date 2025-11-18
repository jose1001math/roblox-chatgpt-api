import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message || "";
  const userName = req.body.user || "Jogador";

  try {
    const response = await client.responses.create({
      model: "gpt-5.1-mini",
      input: [
        {
          role: "system",
          content:
            "Você é o ChatGPT dentro de um jogo Roblox. Responda em português do Brasil, de forma curta, direta e amigável.",
        },
        {
          role: "user",
          content: `${userName}: ${userMessage}`,
        },
      ],
    });

    const text = response.output[0].content[0].text;
    return res.status(200).json({ reply: text });
  } catch (err) {
    console.error("Erro na OpenAI:", err);
    return res
      .status(500)
      .json({ reply: "[Erro ao falar com a IA. Tente novamente mais tarde.]" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor de IA rodando na porta " + PORT);
});
