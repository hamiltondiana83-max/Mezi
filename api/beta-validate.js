// api/beta-validate.js
// Valide un code d'accès beta via Google Apps Script.
// L'URL du script reste côté serveur.

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

  const { email, code } = req.body || {};

  if (!email || typeof email !== "string" || !code || typeof code !== "string") {
    return res.status(400).json({ error: "Email et code requis." });
  }

  // Validation basique format email
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "Format email invalide." });
  }

  // Sanitisation du code (alphanumeric seulement)
  const sanitizedCode = code.toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (sanitizedCode.length < 4 || sanitizedCode.length > 20) {
    return res.status(400).json({ valid: false });
  }

  try {
    const url = `${scriptUrl}?email=${encodeURIComponent(email.trim())}&code=${encodeURIComponent(sanitizedCode)}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Apps Script error: ${response.status}`);
    }

    const data = await response.json();

    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.status(200).json({ valid: !!data.valid });
  } catch (err) {
    console.error("Erreur validation beta:", err);
    return res.status(500).json({ error: "Erreur de vérification. Réessayez." });
  }
}
