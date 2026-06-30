// api/beta-request.js
// Enregistre une demande d'accès beta via Google Apps Script.

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const scriptUrl = process.env.APPS_SCRIPT_URL;
  if (!scriptUrl) {
    console.error("APPS_SCRIPT_URL manquante");
    return res.status(500).json({ error: "Configuration serveur manquante." });
  }

  const { name, email, lang } = req.body || {};

  if (!name || typeof name !== "string" || !email || typeof email !== "string") {
    return res.status(400).json({ error: "Nom et email requis." });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "Format email invalide." });
  }

  const allowedLangs = ["FR", "EN", "SR"];
  const sanitizedLang = allowedLangs.includes(lang) ? lang : "FR";

  try {
    // Google Apps Script avec no-cors ne retourne pas de corps utile,
    // on envoie et on considère comme succès si pas d'erreur réseau
    await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim().slice(0, 100),
        email: email.trim().slice(0, 200),
        lang: sanitizedLang,
      }),
    });

    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Erreur demande beta:", err);
    return res.status(500).json({ error: "Erreur d'envoi. Réessayez." });
  }
}
