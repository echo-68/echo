module.exports = function analyzeMessage(message) {
  const lower = message.toLowerCase();

  // 🔍 Tone detection
  const tone = lower.includes("please") || lower.includes("kindly") || lower.includes("thank you")
    ? "formal"
    : "casual";

  // 😅 Emoji detection (broader)
  const emoji = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u.test(message);

  // 🧃 Slang detection
  const slangList = [
    "bruh", "fr", "vibe", "no cap", "lowkey", "lit", "cringe", "sus", "bro", "yo",
    "scene", "shi", "abe", "oyee", "pagal", "moj", "htt", "nikal", "bhai", "chal", "sahi"
  ];
  const usedSlang = slangList.filter(word => lower.includes(word));

  // 🧮 Response length
  const response_length = message.length < 50 ? "short" : "long";

  // 🧠 Mood detection (more Hindi/Hinglish words)
  function detectMood(msg) {
    if (/😭|ugh|sad|thak|boring|alone|so lonely|breakup|udaas|bura lagta|🫠/.test(msg)) return "sad";
    if (/😡|angry|hate|gussa|bkwas|bhayankar|bkl|👿/.test(msg)) return "angry";
    if (/😂|lol|lmao|haha|moj|maza|mazedaar|mast|🤣|😆/.test(msg)) return "happy";
    if (/😩|bruh|uff|idk|thak gya|bored|tired|🥱/.test(msg)) return "tired";
    return "neutral";
  }

  const mood = detectMood(message);

  // 🤨 Sarcasm detection (added desi phrases)
  function detectSarcasm(msg) {
    const sarcasticPhrases = [
      "yeah right", "sure", "obviously", "as if", "of course",
      "wah kya baat", "tu toh bht sahi h", "mahan h bhai", "mast joke maara",
      "bhaisaab", "kya chalaki hai", "👏", "🙄", "😏"
    ];
    const hasSarcasmWords = sarcasticPhrases.some(p => lower.includes(p));
    const hasSarcasmEmojis = /🙄|😏|😒/.test(msg);
    return hasSarcasmWords || hasSarcasmEmojis;
  }

  const sarcasm = detectSarcasm(message);

  // 🎯 Return the full analysis
  return {
    tone,
    emoji,
    slang: usedSlang,
    response_length,
    mood,
    sarcasm
  };
};
