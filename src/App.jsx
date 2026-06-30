import { useState, useRef, useEffect } from "react";

// ─────────────────────────────────────────────
// MEZI — Thérapeute de poche interculturel
// FR / EN / SR · V1 Beta
// API calls sécurisées via /api/* (Vercel)
// ─────────────────────────────────────────────

const LANGS = {
  FR: {
    code: "FR", label: "Français", flag: "🇫🇷",
    betaTitle: "Mezi est en beta privée",
    betaSubtitle: "Vous avez reçu une invitation personnelle de Diana.",
    betaNameLabel: "Votre prénom",
    betaNamePlaceholder: "Comment vous appeler ?",
    betaEmailLabel: "Votre email",
    betaEmailPlaceholder: "pour confirmer votre accès",
    betaCodeLabel: "Code d'accès",
    betaCodePlaceholder: "Code reçu sur WhatsApp",
    betaBtn: "Accéder à Mezi",
    betaPending: "✓ Demande envoyée à Diana",
    betaPendingDesc: "Elle vous confirme votre accès sous 24h sur WhatsApp.",
    betaInvalid: "Code invalide ou email non reconnu. Vérifiez votre invitation WhatsApp.",
    betaError: "Erreur de connexion. Réessayez.",
    betaLoading: "Vérification en cours…",
    betaHave: "Vous avez un code ?",
    betaRequest: "Demander un accès",
    betaSwitch: "J'ai déjà un code →",
    betaSwitchBack: "← Demander un accès",
    appName: "Mezi",
    tagline: "Votre espace thérapeutique interculturel",
    disclaimer: "Mezi est un outil de bien-être personnel. Il ne remplace pas un professionnel de santé mentale agréé. En cas de détresse sérieuse, contactez le 3114.",
    step1: { title: "Qui êtes-vous ?", subtitle: "Pour mieux vous accompagner" },
    step2: { title: "Votre contexte", subtitle: "Choisissez votre mode et votre approche" },
    step3: { title: "Vos langues", subtitle: "Je m'adapte à votre réalité" },
    nameLabel: "Votre prénom", namePlaceholder: "Comment vous appeler ?",
    originLabel: "Vos racines culturelles", originPlaceholder: "Ex: franco-ivoirienne, serbo-française…",
    modeLabel: "Mode de session",
    modes: [
      { id: "solo", icon: "🌿", label: "Solo", desc: "Je veux explorer mon ressenti seul(e)" },
      { id: "couple", icon: "🫂", label: "Couple", desc: "Nous voulons dialoguer à deux" },
      { id: "famille", icon: "🏡", label: "Famille", desc: "Dynamique familiale ou intergénérationnelle" },
    ],
    therapyLabel: "Approche thérapeutique",
    therapies: [
      { id: "interculturel", icon: "🌍", label: "Biais interculturels", desc: "Conflits de valeurs, double identité, regards croisés" },
      { id: "anxiete", icon: "🌊", label: "Anxiété identitaire", desc: "Stress de l'entre-deux, sentiment d'appartenance" },
      { id: "attachement", icon: "🔗", label: "Attachement & lien", desc: "Relations à l'autre, besoins affectifs" },
      { id: "deuil", icon: "🕊️", label: "Deuil & transition", desc: "Perte, changement, nouveau chapitre" },
      { id: "cnv", icon: "💬", label: "Communication CNV", desc: "Mieux s'exprimer, mieux écouter" },
    ],
    langLabel: "Langue(s) parlée(s)",
    langNote: "Si vous êtes deux avec des langues différentes, je traduirai mes réponses pour chacun.",
    start: "Commencer ma session",
    back: "Retour", next: "Suivant →",
    you: "Vous", therapist: "Mezi",
    placeholder: "Écrivez ici… (Entrée pour envoyer)",
    newSession: "Nouvelle session",
    crisisMsg: "⚠️ Si vous traversez une crise sérieuse, appelez le 3114 (France) ou le 112 (urgence européenne).",
  },
  EN: {
    code: "EN", label: "English", flag: "🇬🇧",
    betaTitle: "Mezi is in private beta",
    betaSubtitle: "You received a personal invitation from Diana.",
    betaNameLabel: "Your first name", betaNamePlaceholder: "What should I call you?",
    betaEmailLabel: "Your email", betaEmailPlaceholder: "to confirm your access",
    betaCodeLabel: "Access code", betaCodePlaceholder: "Code received on WhatsApp",
    betaBtn: "Access Mezi",
    betaPending: "✓ Request sent to Diana",
    betaPendingDesc: "She will confirm your access within 24h on WhatsApp.",
    betaInvalid: "Invalid code or unrecognized email. Check your WhatsApp invitation.",
    betaError: "Connection error. Please try again.",
    betaLoading: "Verifying…",
    betaHave: "You have a code?",
    betaRequest: "Request access",
    betaSwitch: "I already have a code →",
    betaSwitchBack: "← Request access",
    appName: "Mezi", tagline: "Your intercultural therapy companion",
    disclaimer: "Mezi is a personal wellbeing tool. It does not replace a licensed mental health professional. In serious distress, contact a crisis line.",
    step1: { title: "Who are you?", subtitle: "So I can support you better" },
    step2: { title: "Your context", subtitle: "Choose your mode and approach" },
    step3: { title: "Your languages", subtitle: "I adapt to your reality" },
    nameLabel: "Your first name", namePlaceholder: "What should I call you?",
    originLabel: "Your cultural roots", originPlaceholder: "e.g. Franco-Ivorian, Serbian-French…",
    modeLabel: "Session mode",
    modes: [
      { id: "solo", icon: "🌿", label: "Solo", desc: "I want to explore my feelings alone" },
      { id: "couple", icon: "🫂", label: "Couple", desc: "We want to dialogue together" },
      { id: "famille", icon: "🏡", label: "Family", desc: "Family or intergenerational dynamics" },
    ],
    therapyLabel: "Therapeutic approach",
    therapies: [
      { id: "interculturel", icon: "🌍", label: "Intercultural bias", desc: "Value conflicts, dual identity, crossed perspectives" },
      { id: "anxiete", icon: "🌊", label: "Identity anxiety", desc: "In-between stress, sense of belonging" },
      { id: "attachement", icon: "🔗", label: "Attachment & bonds", desc: "Relationships, emotional needs" },
      { id: "deuil", icon: "🕊️", label: "Grief & transition", desc: "Loss, change, new chapters" },
      { id: "cnv", icon: "💬", label: "NVC Communication", desc: "Express better, listen better" },
    ],
    langLabel: "Language(s) spoken",
    langNote: "If two of you speak different languages, I will translate my responses for each.",
    start: "Start my session", back: "Back", next: "Next →",
    you: "You", therapist: "Mezi",
    placeholder: "Write here… (Enter to send)",
    newSession: "New session",
    crisisMsg: "⚠️ If you are in serious crisis, call 116 123 (Samaritans) or 988 (US).",
  },
  SR: {
    code: "SR", label: "Srpski", flag: "🇷🇸",
    betaTitle: "Mezi je u privatnoj beta verziji",
    betaSubtitle: "Dobili ste lični poziv od Diane.",
    betaNameLabel: "Vaše ime", betaNamePlaceholder: "Kako da vas zovem?",
    betaEmailLabel: "Vaš email", betaEmailPlaceholder: "za potvrdu pristupa",
    betaCodeLabel: "Pristupni kod", betaCodePlaceholder: "Kod primljen na WhatsApp",
    betaBtn: "Pristupite Mezi",
    betaPending: "✓ Zahtev poslat Diani",
    betaPendingDesc: "Ona će potvrditi vaš pristup u roku od 24h na WhatsApp-u.",
    betaInvalid: "Nevažeći kod ili neprepoznati email. Proverite WhatsApp pozivnicu.",
    betaError: "Greška veze. Pokušajte ponovo.",
    betaLoading: "Proveravanje…",
    betaHave: "Imate kod?",
    betaRequest: "Zatražite pristup",
    betaSwitch: "Već imam kod →",
    betaSwitchBack: "← Zatražite pristup",
    appName: "Mezi", tagline: "Vaš interkulturalni terapeutski prostor",
    disclaimer: "Mezi je alat za lično blagostanje. Ne zamenjuje licenciranog stručnjaka za mentalno zdravlje.",
    step1: { title: "Ko ste vi?", subtitle: "Da bih vam bolje pomogao/la" },
    step2: { title: "Vaš kontekst", subtitle: "Izaberite način i pristup" },
    step3: { title: "Vaši jezici", subtitle: "Prilagođavam se vašoj stvarnosti" },
    nameLabel: "Vaše ime", namePlaceholder: "Kako da vas zovem?",
    originLabel: "Vaše kulturno poreklo", originPlaceholder: "Npr. srpsko-francusko…",
    modeLabel: "Način sesije",
    modes: [
      { id: "solo", icon: "🌿", label: "Solo", desc: "Želim sam/a da istražim svoja osećanja" },
      { id: "couple", icon: "🫂", label: "Par", desc: "Želimo da razgovaramo nas dvoje" },
      { id: "famille", icon: "🏡", label: "Porodica", desc: "Porodična ili međugeneracijska dinamika" },
    ],
    therapyLabel: "Terapeutski pristup",
    therapies: [
      { id: "interculturel", icon: "🌍", label: "Interkulturalni pristup", desc: "Sukobi vrednosti, dvostruki identitet" },
      { id: "anxiete", icon: "🌊", label: "Identitetska anksioznost", desc: "Stres između dve kulture" },
      { id: "attachement", icon: "🔗", label: "Vezanost & odnosi", desc: "Odnosi sa drugima, emocionalne potrebe" },
      { id: "deuil", icon: "🕊️", label: "Tuga & tranzicija", desc: "Gubitak, promena, novo poglavlje" },
      { id: "cnv", icon: "💬", label: "NNK Komunikacija", desc: "Bolje se izraziti, bolje slušati" },
    ],
    langLabel: "Jezik(ci) koji koristite",
    langNote: "Ako dvoje govorite različitim jezicima, preveću svoje odgovore za svakoga.",
    start: "Počni sesiju", back: "Nazad", next: "Sledeće →",
    you: "Vi", therapist: "Mezi",
    placeholder: "Pišite ovde… (Enter za slanje)",
    newSession: "Nova sesija",
    crisisMsg: "⚠️ Ako ste u ozbiljnoj krizi, pozovite 0800 100 600 (SOS Serbia).",
  }
};

const AVAILABLE_LANGS = [
  { code: "FR", flag: "🇫🇷", label: "Français" },
  { code: "EN", flag: "🇬🇧", label: "English" },
  { code: "SR", flag: "🇷🇸", label: "Srpski" },
];

function buildSystemPrompt(profile) {
  const langNames = profile.langs.map(l => AVAILABLE_LANGS.find(a => a.code === l)?.label).join(" et ");
  const multilingual = profile.langs.length > 1;
  const therapyLabels = {
    interculturel: "Interculturelle (biais culturels, double identité, conflits de valeurs entre cultures)",
    anxiete: "Anxiété identitaire (stress de l'entre-deux, sentiment d'appartenance)",
    attachement: "Attachement et relation à l'autre (besoins affectifs, styles d'attachement)",
    deuil: "Deuil et transition de vie (perte, deuil migratoire, changement)",
    cnv: "Communication Non Violente (expression des besoins, écoute active)"
  };
  const therapyDesc = profile.therapy ? therapyLabels[profile.therapy] : "Approche intégrative";
  return `Tu es Mezi, un thérapeute de poche bienveillant, neutre et professionnel, spécialisé dans les identités interculturelles.

PROFIL
- Prénom : ${profile.name || "non renseigné"}
- Racines culturelles : ${profile.origin || "non renseignées"}
- Mode : ${profile.mode}
- Approche : ${therapyDesc}
- Langue(s) : ${langNames}

LANGUE
${multilingual
  ? `Réponds TOUJOURS dans les ${profile.langs.length} langues, séparées par "— — —". Commence par le français.`
  : `Réponds uniquement en ${langNames}.`}

POSTURE
- Neutre, jamais du côté d'un partenaire.
- Valide les émotions, pas les comportements blessants.
- Questions ouvertes avant propositions.
- Rappelle que tu es une IA si nécessaire.
- Dimension interculturelle intégrée : codes culturels différents ≠ mauvaise volonté.
- Valorise les ressources culturelles propres à l'utilisateur.

MODE : ${profile.mode.toUpperCase()}
${profile.mode === "solo" ? "Écoute active, reformulation, exploration des besoins profonds." : ""}
${profile.mode === "couple" ? "Facilitation du dialogue, reformulation équitable, jamais de prise de parti." : ""}
${profile.mode === "famille" ? "Attention aux rapports de pouvoir et héritages culturels transmis." : ""}

LIMITES ABSOLUES
- Violence ou idées suicidaires → ressources d'urgence immédiatement + arrêt de session.
  FR: 3114 | UK: 116 123 | US: 988 | SR: 0800 100 600
- Pas de diagnostic, pas de prescription.

TON : Chaleureux, calme, sans jugement. Toujours terminer par une question.`;
}

const CRISIS_KEYWORDS = ["suicide", "me tuer", "mourir", "violence", "frapper", "battre", "убити", "kill myself", "hurt myself"];
const detectCrisis = (text) => CRISIS_KEYWORDS.some(k => text.toLowerCase().includes(k));

// ── STYLES ────────────────────────────────────
const css = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Inter:wght@400;500;600&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --sand: #F6F0E8; --sand-deep: #EDE3D4;
  --terra: #B8714E; --terra-light: #D4956F; --terra-pale: #F2DDD1;
  --slate: #4A4540; --slate-mid: #7A7370; --slate-light: #ABA7A4;
  --ivory: #FDFAF5;
  --green: #7A9E7E; --green-pale: #D6EBD8;
  --indigo: #6B7FB8; --indigo-pale: #DDE2F2;
  --gold: #C4973A; --gold-pale: #F5EAD0;
  --radius: 18px; --radius-sm: 10px;
  --shadow: 0 2px 12px rgba(74,69,64,0.08);
  --shadow-md: 0 4px 20px rgba(74,69,64,0.12);
}
body { background: var(--sand); font-family: 'Inter', system-ui, sans-serif; color: var(--slate); -webkit-font-smoothing: antialiased; }
.app { min-height: 100vh; max-width: 480px; margin: 0 auto; display: flex; flex-direction: column; background: linear-gradient(170deg, var(--sand) 0%, #EFE8DC 100%); }

/* HEADER */
.header { padding: 16px 20px 12px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--sand-deep); background: rgba(253,250,245,0.9); backdrop-filter: blur(8px); position: sticky; top: 0; z-index: 10; }
.header-brand { display: flex; align-items: baseline; gap: 8px; }
.header-logo { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 22px; font-weight: 600; color: var(--terra); letter-spacing: 0.04em; }
.header-badge { font-size: 10px; font-weight: 600; letter-spacing: 0.1em; color: var(--slate-light); text-transform: uppercase; background: var(--sand-deep); padding: 2px 7px; border-radius: 10px; }
.header-actions { display: flex; gap: 6px; align-items: center; }
.lang-pill { background: var(--ivory); border: 1.5px solid var(--sand-deep); color: var(--slate); border-radius: 20px; padding: 5px 10px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.18s; display: flex; align-items: center; gap: 4px; }
.lang-pill:hover { border-color: var(--terra-light); background: var(--terra-pale); }
.icon-btn { background: none; border: none; color: var(--slate-mid); cursor: pointer; font-size: 13px; padding: 5px 8px; border-radius: 8px; transition: color 0.18s; white-space: nowrap; }
.icon-btn:hover { color: var(--slate); background: var(--sand-deep); }

/* BETA GATE */
.beta-gate { flex: 1; padding: 40px 24px 32px; display: flex; flex-direction: column; align-items: center; }
.beta-symbol { font-size: 52px; margin-bottom: 20px; filter: drop-shadow(0 4px 14px rgba(184,113,78,0.2)); }
.beta-title { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 26px; font-weight: 500; color: var(--slate); text-align: center; line-height: 1.25; margin-bottom: 6px; }
.beta-subtitle { font-size: 13px; color: var(--slate-mid); text-align: center; margin-bottom: 32px; line-height: 1.5; }
.beta-form { width: 100%; display: flex; flex-direction: column; gap: 14px; }
.field-label { font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--slate-mid); margin-bottom: 6px; display: block; }
.field-input { width: 100%; background: var(--ivory); border: 1.5px solid var(--sand-deep); border-radius: var(--radius-sm); padding: 12px 14px; font-size: 14px; color: var(--slate); font-family: 'Inter', sans-serif; outline: none; transition: border-color 0.2s; }
.field-input:focus { border-color: var(--terra-light); }
.field-input::placeholder { color: var(--slate-light); }
.beta-btn { width: 100%; background: linear-gradient(135deg, var(--terra) 0%, var(--terra-light) 100%); color: white; border: none; border-radius: var(--radius); padding: 16px; font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 14px rgba(184,113,78,0.35); margin-top: 4px; }
.beta-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(184,113,78,0.4); }
.beta-btn:disabled { opacity: 0.45; cursor: not-allowed; transform: none; box-shadow: none; }
.beta-switch { background: none; border: none; color: var(--indigo); font-size: 13px; cursor: pointer; margin-top: 16px; text-decoration: underline; }
.beta-pending { text-align: center; padding: 24px; }
.beta-pending-icon { font-size: 44px; margin-bottom: 12px; }
.beta-pending-title { font-family: 'Cormorant Garamond', serif; font-size: 22px; font-weight: 500; color: var(--green); margin-bottom: 8px; }
.beta-pending-desc { font-size: 13px; color: var(--slate-mid); line-height: 1.6; }
.beta-error { background: #FEE2E2; border: 1px solid #FECACA; border-radius: var(--radius-sm); padding: 10px 14px; font-size: 13px; color: #991B1B; margin-top: 4px; text-align: center; }

/* ONBOARDING */
.onboarding { flex: 1; padding: 28px 20px 32px; display: flex; flex-direction: column; overflow-y: auto; }
.step-indicator { display: flex; gap: 6px; justify-content: center; margin-bottom: 28px; }
.step-dot { width: 28px; height: 4px; border-radius: 4px; background: var(--sand-deep); transition: background 0.3s; }
.step-dot.active { background: var(--terra); }
.step-dot.done { background: var(--terra-light); }
.step-header { margin-bottom: 24px; }
.step-title { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 26px; font-weight: 500; color: var(--slate); line-height: 1.2; margin-bottom: 4px; }
.step-subtitle { font-size: 13px; color: var(--slate-mid); }
.field { margin-bottom: 20px; }
.cards { display: flex; flex-direction: column; gap: 8px; margin-bottom: 8px; }
.card { background: var(--ivory); border: 2px solid transparent; border-radius: var(--radius); padding: 14px 16px; display: flex; align-items: center; gap: 14px; cursor: pointer; transition: all 0.18s; box-shadow: var(--shadow); }
.card:hover { border-color: var(--terra-light); transform: translateY(-1px); }
.card.selected { border-color: var(--terra); background: var(--terra-pale); box-shadow: var(--shadow-md); }
.card-icon { font-size: 24px; flex-shrink: 0; }
.card-label { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 17px; font-weight: 500; color: var(--slate); line-height: 1.1; margin-bottom: 2px; }
.card-desc { font-size: 12px; color: var(--slate-mid); line-height: 1.4; }
.card[data-therapy="interculturel"].selected { border-color: var(--indigo); background: var(--indigo-pale); }
.card[data-therapy="anxiete"].selected { border-color: var(--gold); background: var(--gold-pale); }
.card[data-therapy="deuil"].selected { border-color: var(--slate-mid); background: #EDEAE7; }
.card[data-therapy="cnv"].selected { border-color: var(--green); background: var(--green-pale); }
.lang-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 12px; }
.lang-card { background: var(--ivory); border: 2px solid var(--sand-deep); border-radius: var(--radius-sm); padding: 12px 8px; text-align: center; cursor: pointer; transition: all 0.18s; }
.lang-card:hover { border-color: var(--terra-light); }
.lang-card.selected { border-color: var(--terra); background: var(--terra-pale); }
.lang-card .flag { font-size: 22px; display: block; margin-bottom: 4px; }
.lang-card .lname { font-size: 12px; font-weight: 600; color: var(--slate); }
.lang-note { font-size: 12px; color: var(--slate-mid); background: var(--indigo-pale); border-radius: var(--radius-sm); padding: 10px 12px; line-height: 1.5; margin-bottom: 4px; }
.disclaimer { background: var(--terra-pale); border-left: 3px solid var(--terra-light); border-radius: var(--radius-sm); padding: 10px 14px; font-size: 12px; color: var(--slate); line-height: 1.5; margin-bottom: 24px; }
.nav-row { display: flex; gap: 10px; margin-top: auto; padding-top: 16px; }
.btn-back { background: none; border: 1.5px solid var(--sand-deep); color: var(--slate-mid); border-radius: var(--radius); padding: 14px 20px; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.18s; }
.btn-back:hover { border-color: var(--slate-mid); color: var(--slate); }
.btn-next { flex: 1; background: linear-gradient(135deg, var(--terra) 0%, var(--terra-light) 100%); color: white; border: none; border-radius: var(--radius); padding: 14px 20px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 14px rgba(184,113,78,0.35); }
.btn-next:hover { transform: translateY(-1px); }
.btn-next:disabled { opacity: 0.45; cursor: not-allowed; transform: none; box-shadow: none; }

/* CHAT */
.chat { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
.chat-meta { padding: 10px 20px; display: flex; gap: 6px; flex-wrap: wrap; border-bottom: 1px solid var(--sand-deep); }
.meta-chip { font-size: 11px; font-weight: 600; letter-spacing: 0.05em; padding: 3px 10px; border-radius: 20px; }
.chip-mode { background: var(--green-pale); color: var(--green); }
.chip-therapy { background: var(--indigo-pale); color: var(--indigo); }
.chip-lang { background: var(--gold-pale); color: var(--gold); }
.messages { flex: 1; overflow-y: auto; padding: 16px 16px 8px; display: flex; flex-direction: column; gap: 12px; scroll-behavior: smooth; }
.messages::-webkit-scrollbar { width: 3px; }
.messages::-webkit-scrollbar-thumb { background: var(--sand-deep); border-radius: 3px; }
.msg { display: flex; flex-direction: column; max-width: 85%; }
.msg.user { align-self: flex-end; align-items: flex-end; }
.msg.assistant { align-self: flex-start; align-items: flex-start; }
.msg-name { font-size: 10.5px; font-weight: 600; letter-spacing: 0.07em; text-transform: uppercase; margin-bottom: 4px; color: var(--slate-light); }
.msg.user .msg-name { color: var(--terra); }
.msg.assistant .msg-name { color: var(--green); }
.msg-bubble { padding: 11px 15px; border-radius: var(--radius); font-size: 14px; line-height: 1.65; color: var(--slate); white-space: pre-wrap; }
.msg.user .msg-bubble { background: linear-gradient(135deg, var(--terra) 0%, var(--terra-light) 100%); color: white; border-bottom-right-radius: 4px; box-shadow: 0 3px 10px rgba(184,113,78,0.25); }
.msg.assistant .msg-bubble { background: var(--ivory); border-bottom-left-radius: 4px; box-shadow: var(--shadow); }
.typing { display: flex; gap: 5px; padding: 5px 2px; }
.typing span { width: 7px; height: 7px; background: var(--slate-light); border-radius: 50%; animation: bounce 1.2s infinite; }
.typing span:nth-child(2) { animation-delay: 0.18s; }
.typing span:nth-child(3) { animation-delay: 0.36s; }
@keyframes bounce { 0%, 60%, 100% { transform: translateY(0); } 30% { transform: translateY(-6px); } }
.crisis-bar { margin: 6px 16px; background: #FEF3C7; border: 1px solid #FCD34D; border-radius: var(--radius-sm); padding: 10px 14px; font-size: 12.5px; color: #92400E; line-height: 1.5; }
.error-bar { margin: 6px 16px; background: #FEE2E2; border: 1px solid #FECACA; border-radius: var(--radius-sm); padding: 10px 14px; font-size: 12.5px; color: #991B1B; }
.input-area { padding: 10px 14px 20px; display: flex; gap: 8px; align-items: flex-end; background: linear-gradient(to top, var(--sand) 60%, transparent); }
.input-wrap { flex: 1; background: var(--ivory); border: 1.5px solid var(--sand-deep); border-radius: var(--radius); padding: 10px 14px; box-shadow: var(--shadow); transition: border-color 0.2s; }
.input-wrap:focus-within { border-color: var(--terra-light); }
.input-field { width: 100%; background: none; border: none; outline: none; resize: none; font-size: 14px; color: var(--slate); line-height: 1.5; max-height: 110px; font-family: 'Inter', sans-serif; }
.input-field::placeholder { color: var(--slate-light); }
.send-btn { width: 44px; height: 44px; background: linear-gradient(135deg, var(--terra) 0%, var(--terra-light) 100%); border: none; border-radius: 50%; color: white; font-size: 16px; cursor: pointer; flex-shrink: 0; display: flex; align-items: center; justify-content: center; box-shadow: 0 3px 10px rgba(184,113,78,0.35); transition: all 0.18s; }
.send-btn:hover { transform: scale(1.06); }
.send-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
`;

export default function App() {
  const [uiLang, setUiLang] = useState("FR");
  // beta: "request" | "pending" | "code" | "loading" | "granted"
  const [betaState, setBetaState] = useState("request");
  const [betaForm, setBetaForm] = useState({ name: "", email: "", code: "" });
  const [betaError, setBetaError] = useState("");
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState({ name: "", origin: "", mode: null, therapy: null, langs: ["FR"] });
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [crisis, setCrisis] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const t = LANGS[uiLang];

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  const autoResize = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 110) + "px";
  };

  const cycleUiLang = () => {
    const order = ["FR", "EN", "SR"];
    setUiLang(l => order[(order.indexOf(l) + 1) % order.length]);
  };

  // ── BETA: demande d'accès → /api/beta-request ──
  const handleBetaRequest = async () => {
    if (!betaForm.name.trim() || !betaForm.email.trim()) return;
    setBetaState("loading");
    setBetaError("");
    try {
      const res = await fetch("/api/beta-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: betaForm.name, email: betaForm.email, lang: uiLang }),
      });
      if (!res.ok) throw new Error("server_error");
      setBetaState("pending");
    } catch {
      setBetaError(t.betaError);
      setBetaState("request");
    }
  };

  // ── BETA: validation du code → /api/beta-validate ──
  const handleBetaCode = async () => {
    if (!betaForm.email.trim() || !betaForm.code.trim()) return;
    setBetaState("loading");
    setBetaError("");
    try {
      const res = await fetch("/api/beta-validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: betaForm.email, code: betaForm.code }),
      });
      const data = await res.json();
      if (data.valid) {
        setProfile(p => ({ ...p, name: betaForm.name }));
        setBetaState("granted");
      } else {
        setBetaError(data.error || t.betaInvalid);
        setBetaState("code");
      }
    } catch {
      setBetaError(t.betaError);
      setBetaState("code");
    }
  };

  const toggleLang = (code) => {
    setProfile(p => {
      const has = p.langs.includes(code);
      if (has && p.langs.length === 1) return p;
      return { ...p, langs: has ? p.langs.filter(l => l !== code) : [...p.langs, code] };
    });
  };

  const canNext = () => {
    if (step === 0) return profile.name.trim().length > 0;
    if (step === 1) return profile.mode && profile.therapy;
    if (step === 2) return profile.langs.length > 0;
    return false;
  };

  // ── Chat API → /api/chat ──
  const callChat = async (sys, msgs) => {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        system: sys,
        messages: msgs,
      }),
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    return data.content?.find(b => b.type === "text")?.text || "";
  };

  const handleNext = async () => {
    if (step < 2) { setStep(s => s + 1); return; }
    setStep(3); setLoading(true); setError(null);
    const sys = buildSystemPrompt(profile);
    const openingMsg = uiLang === "FR"
      ? `L'utilisateur s'appelle ${profile.name}, racines : ${profile.origin || "non précisées"}. Mode : ${profile.mode}. Approche : ${profile.therapy}. Ouvre la session avec un accueil chaleureux personnalisé puis pose une première question ouverte.`
      : uiLang === "EN"
      ? `User's name is ${profile.name}, roots: ${profile.origin || "not specified"}. Mode: ${profile.mode}. Approach: ${profile.therapy}. Open with a warm welcome then one open question.`
      : `Korisnik se zove ${profile.name}, poreklo: ${profile.origin || "nije navedeno"}. Način: ${profile.mode}. Otvori sesiju toplim pozdravom i jednim otvorenim pitanjem.`;
    try {
      const text = await callChat(sys, [{ role: "user", content: openingMsg }]);
      setMessages([{ role: "assistant", text }]);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput(""); if (textareaRef.current) textareaRef.current.style.height = "auto";
    setError(null);
    if (detectCrisis(text)) setCrisis(true);
    const newMsgs = [...messages, { role: "user", text }];
    setMessages(newMsgs); setLoading(true);
    try {
      const reply = await callChat(
        buildSystemPrompt(profile),
        newMsgs.map(m => ({ role: m.role, content: m.text }))
      );
      setMessages([...newMsgs, { role: "assistant", text: reply }]);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  const handleKeyDown = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } };

  const reset = () => {
    setStep(0); setMessages([]); setInput(""); setError(null); setCrisis(false);
    setProfile({ name: betaForm.name, origin: "", mode: null, therapy: null, langs: ["FR"] });
  };

  const modeObj = t.modes.find(m => m.id === profile.mode);
  const therapyObj = t.therapies.find(th => th.id === profile.therapy);

  return (
    <>
      <style>{css}</style>
      <div className="app">
        {/* HEADER */}
        <div className="header">
          <div className="header-brand">
            <span className="header-logo">Mezi</span>
            <span className="header-badge">Beta</span>
          </div>
          <div className="header-actions">
            <button className="lang-pill" onClick={cycleUiLang}>{LANGS[uiLang].flag} {uiLang}</button>
            {step === 3 && <button className="icon-btn" onClick={reset}>↺ {t.newSession}</button>}
          </div>
        </div>

        {/* ── BETA GATE ── */}
        {betaState !== "granted" && (
          <div className="beta-gate">
            <div className="beta-symbol">🌸</div>
            <div className="beta-title">{t.betaTitle}</div>
            <div className="beta-subtitle">{t.betaSubtitle}</div>

            {betaState === "pending" && (
              <div className="beta-pending">
                <div className="beta-pending-icon">✉️</div>
                <div className="beta-pending-title">{t.betaPending}</div>
                <div className="beta-pending-desc">{t.betaPendingDesc}</div>
                <button className="beta-switch" onClick={() => setBetaState("code")}>{t.betaSwitch}</button>
              </div>
            )}

            {betaState === "request" && (
              <div className="beta-form">
                <div className="field">
                  <label className="field-label">{t.betaNameLabel}</label>
                  <input className="field-input" placeholder={t.betaNamePlaceholder}
                    value={betaForm.name} onChange={e => setBetaForm(f => ({ ...f, name: e.target.value }))} />
                </div>
                <div className="field">
                  <label className="field-label">{t.betaEmailLabel}</label>
                  <input className="field-input" type="email" placeholder={t.betaEmailPlaceholder}
                    value={betaForm.email} onChange={e => setBetaForm(f => ({ ...f, email: e.target.value }))} />
                </div>
                {betaError && <div className="beta-error">{betaError}</div>}
                <button className="beta-btn" onClick={handleBetaRequest}
                  disabled={!betaForm.name.trim() || !betaForm.email.trim()}>
                  {t.betaBtn}
                </button>
                <button className="beta-switch" onClick={() => setBetaState("code")}>{t.betaSwitch}</button>
              </div>
            )}

            {betaState === "code" && (
              <div className="beta-form">
                <div className="field">
                  <label className="field-label">{t.betaEmailLabel}</label>
                  <input className="field-input" type="email" placeholder={t.betaEmailPlaceholder}
                    value={betaForm.email} onChange={e => setBetaForm(f => ({ ...f, email: e.target.value }))} />
                </div>
                <div className="field">
                  <label className="field-label">{t.betaCodeLabel}</label>
                  <input className="field-input" placeholder={t.betaCodePlaceholder}
                    value={betaForm.code} onChange={e => setBetaForm(f => ({ ...f, code: e.target.value }))}
                    style={{ letterSpacing: "0.1em", fontWeight: 600 }} />
                </div>
                {betaError && <div className="beta-error">{betaError}</div>}
                <button className="beta-btn" onClick={handleBetaCode}
                  disabled={!betaForm.email.trim() || !betaForm.code.trim()}>
                  {t.betaBtn}
                </button>
                <button className="beta-switch" onClick={() => { setBetaState("request"); setBetaError(""); }}>{t.betaSwitchBack}</button>
              </div>
            )}

            {betaState === "loading" && (
              <div style={{ marginTop: 32, color: "var(--slate-mid)", fontSize: 14 }}>
                <div className="typing" style={{ justifyContent: "center" }}><span/><span/><span/></div>
                <div style={{ marginTop: 10, textAlign: "center" }}>{t.betaLoading}</div>
              </div>
            )}
          </div>
        )}

        {/* ── ONBOARDING ── */}
        {betaState === "granted" && step === 0 && (
          <div className="onboarding">
            <div className="step-indicator">
              {[0,1,2].map(i => <div key={i} className={`step-dot ${i === 0 ? "active" : ""}`} />)}
            </div>
            <div className="step-header">
              <div className="step-title">{t.step1.title}</div>
              <div className="step-subtitle">{t.step1.subtitle}</div>
            </div>
            <div className="disclaimer">🌸 {t.disclaimer}</div>
            <div className="field">
              <label className="field-label">{t.nameLabel}</label>
              <input className="field-input" placeholder={t.namePlaceholder}
                value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="field">
              <label className="field-label">{t.originLabel}</label>
              <input className="field-input" placeholder={t.originPlaceholder}
                value={profile.origin} onChange={e => setProfile(p => ({ ...p, origin: e.target.value }))} />
            </div>
            <div className="nav-row">
              <button className="btn-next" onClick={handleNext} disabled={!canNext()}>{t.next}</button>
            </div>
          </div>
        )}

        {betaState === "granted" && step === 1 && (
          <div className="onboarding">
            <div className="step-indicator">
              {[0,1,2].map(i => <div key={i} className={`step-dot ${i < 1 ? "done" : i === 1 ? "active" : ""}`} />)}
            </div>
            <div className="step-header">
              <div className="step-title">{t.step2.title}</div>
              <div className="step-subtitle">{t.step2.subtitle}</div>
            </div>
            <div className="field">
              <label className="field-label">{t.modeLabel}</label>
              <div className="cards">
                {t.modes.map(m => (
                  <div key={m.id} className={`card${profile.mode === m.id ? " selected" : ""}`}
                    onClick={() => setProfile(p => ({ ...p, mode: m.id }))}>
                    <span className="card-icon">{m.icon}</span>
                    <div><div className="card-label">{m.label}</div><div className="card-desc">{m.desc}</div></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="field">
              <label className="field-label">{t.therapyLabel}</label>
              <div className="cards">
                {t.therapies.map(th => (
                  <div key={th.id} data-therapy={th.id}
                    className={`card${profile.therapy === th.id ? " selected" : ""}`}
                    onClick={() => setProfile(p => ({ ...p, therapy: th.id }))}>
                    <span className="card-icon">{th.icon}</span>
                    <div><div className="card-label">{th.label}</div><div className="card-desc">{th.desc}</div></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="nav-row">
              <button className="btn-back" onClick={() => setStep(0)}>{t.back}</button>
              <button className="btn-next" onClick={handleNext} disabled={!canNext()}>{t.next}</button>
            </div>
          </div>
        )}

        {betaState === "granted" && step === 2 && (
          <div className="onboarding">
            <div className="step-indicator">
              {[0,1,2].map(i => <div key={i} className={`step-dot ${i < 2 ? "done" : i === 2 ? "active" : ""}`} />)}
            </div>
            <div className="step-header">
              <div className="step-title">{t.step3.title}</div>
              <div className="step-subtitle">{t.step3.subtitle}</div>
            </div>
            <div className="field">
              <label className="field-label">{t.langLabel}</label>
              <div className="lang-grid">
                {AVAILABLE_LANGS.map(l => (
                  <div key={l.code} className={`lang-card${profile.langs.includes(l.code) ? " selected" : ""}`}
                    onClick={() => toggleLang(l.code)}>
                    <span className="flag">{l.flag}</span>
                    <span className="lname">{l.label}</span>
                  </div>
                ))}
              </div>
              {profile.langs.length > 1 && <div className="lang-note">🔄 {t.langNote}</div>}
            </div>
            <div className="nav-row">
              <button className="btn-back" onClick={() => setStep(1)}>{t.back}</button>
              <button className="btn-next" onClick={handleNext} disabled={!canNext()}>{t.start}</button>
            </div>
          </div>
        )}

        {/* CHAT */}
        {betaState === "granted" && step === 3 && (
          <div className="chat">
            <div className="chat-meta">
              {modeObj && <span className="meta-chip chip-mode">{modeObj.icon} {modeObj.label}</span>}
              {therapyObj && <span className="meta-chip chip-therapy">{therapyObj.icon} {therapyObj.label}</span>}
              {profile.langs.map(l => (
                <span key={l} className="meta-chip chip-lang">{AVAILABLE_LANGS.find(a => a.code === l)?.flag} {l}</span>
              ))}
            </div>
            <div className="messages">
              {messages.map((m, i) => (
                <div key={i} className={`msg ${m.role}`}>
                  <span className="msg-name">{m.role === "user" ? (profile.name || t.you) : t.therapist}</span>
                  <div className="msg-bubble">{m.text}</div>
                </div>
              ))}
              {loading && (
                <div className="msg assistant">
                  <span className="msg-name">{t.therapist}</span>
                  <div className="msg-bubble"><div className="typing"><span/><span/><span/></div></div>
                </div>
              )}
              {crisis && <div className="crisis-bar">{t.crisisMsg}</div>}
              {error && <div className="error-bar">⚠️ {error}</div>}
              <div ref={messagesEndRef} />
            </div>
            <div className="input-area">
              <div className="input-wrap">
                <textarea ref={textareaRef} className="input-field" rows={1}
                  placeholder={t.placeholder} value={input} disabled={loading}
                  onChange={e => { setInput(e.target.value); autoResize(); }}
                  onKeyDown={handleKeyDown} />
              </div>
              <button className="send-btn" onClick={handleSend} disabled={!input.trim() || loading}>➤</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
