// api/chat.js
// Proxy sécurisé vers l'API Anthropic.
// La clé API ne quitte jamais le serveur.

const ALLOWED_MODELS = ["claude-sonnet-4-6"];
const MAX_TOKENS_LIMIT = 1000;

// Limite simple basée sur IP (en mémoire, reset à chaque cold start)
// Pour une vraie prod, utilisez Upstash Redis ou KV Vercel
const rateLimits = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 20;

function checkRateLimit(ip) {
  const now = Date.now();
  const key = ip;
  const entry = rateLimits.get(key);

  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimits.set(key, { windowStart: now, count: 1 });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }

  entry.count++;
  return true;
}

export default async function handler(req, res) {
  // CORS preflight
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Rate limiting
  const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket?.remoteAddress || "unknown";
  if (!checkRateLimit(ip)) {
    return res.status(429).json({ error: "Trop de requêtes. Veuillez patienter une minute." });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("ANTHROPIC_API_KEY manquante");
    return res.status(500).json({ error: "Configuration serveur manquante." });
  }

  const { model, max_tokens, system, messages } = req.body || {};

  // Validation de base
  if (!model || !ALLOWED_MODELS.includes(model)) {
    return res.status(400).json({ error: "Modèle non autorisé." });
  }
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "Messages invalides." });
  }
  if (messages.length > 100) {
    return res.status(400).json({ error: "Trop de messages dans la conversation." });
  }

  // Vérification basique du contenu des messages
  for (const msg of messages) {
    if (!["user", "assistant"].includes(msg.role)) {
      return res.status(400).json({ error: "Rôle de message invalide." });
    }
    if (typeof msg.content !== "string" || msg.content.length > 10000) {
      return res.status(400).json({ error: "Contenu de message invalide." });
    }
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model,
        max_tokens: Math.min(max_tokens || 1000, MAX_TOKENS_LIMIT),
        system: typeof system === "string" ? system.slice(0, 5000) : undefined,
        messages,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Anthropic API error:", data);
      return res.status(response.status).json({
        error: data?.error?.message || "Erreur API Anthropic.",
      });
    }

    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(200).json(data);
  } catch (err) {
    console.error("Erreur proxy chat:", err);
    return res.status(500).json({ error: "Erreur serveur interne." });
  }
}
