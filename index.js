const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();
app.use(cors());
app.use(express.json());

// pega a chave da OpenAI das variáveis do Railway
const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  console.error("⚠️ OPENAI_API_KEY NÃO ESTÁ DEFINIDA NAS VARIÁVEIS DO RAILWAY.");
}

let client = null;
if (apiKey) {
  client = new OpenAI({ apiKey });
}

// rota que o Roblox chama
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message || "";
  const userName = req.body.user || "Jogador";

  if (!client) {
    return res.status(500).json({
      reply:
        "[A IA não está configurada corretamente no servidor (sem OPENAI_API_KEY). Fale com o dono do jogo.]",
    });
  }

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

    const text =
      response.output &&
      response.output[0] &&
      response.output[0].content &&
      response.output[0].content[0] &&
      response.output[0].content[0].text
        ? response.output[0].content[0].text
        : "[Erro: resposta vazia da IA.]";

    return res.status(200).json({ reply: text });
  } catch (err) {
    console.error("Erro na OpenAI:", err);
    return res.status(500).json({
      reply: "[Erro ao falar com a IA. Tente novamente mais tarde.]",
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("✅ Servidor de IA rodando na porta " + PORT);
});
