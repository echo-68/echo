module.exports = function analyzeMessage(message) {
    const lower = message.toLowerCase();
  
    // 🔍 Tone detection
    const tone = lower.includes("please") || lower.includes("kindly")
      ? "formal"
      : "casual";
  
    // 😅 Emoji detection
    const emoji = /[\u{1F600}-\u{1F64F}]/u.test(message);
  
    // 🧃 Slang detection
    const slangList = ["bruh", "fr", "vibe", "no cap", "lowkey"];
    const usedSlang = slangList.filter(word => lower.includes(word));
  
    // 🧮 Response length
    const response_length = message.length < 50 ? "short" : "long";
  
    // 🧠 Mood detection
    function detectMood(msg) {
      const lower = msg.toLowerCase();
  
      if (lower.includes("😭") || lower.includes("ugh") || lower.includes("tired")) return "sad";
      if (lower.includes("😡") || lower.includes("angry") || lower.includes("hate")) return "angry";
      if (lower.includes("😂") || lower.includes("lol") || lower.includes("lmao")) return "happy";
      if (lower.includes("😩") || lower.includes("bruh") || lower.includes("idk")) return "tired";
  
      return "neutral";
    }
  
    const mood = detectMood(message);
  
    // 🤨 Sarcasm detection
    function detectSarcasm(msg) {
      const lower = msg.toLowerCase();
      const sarcasticPhrases = ["yeah right", "sure", "obviously", "as if", "of course"];
      const hasSarcasmWords = sarcasticPhrases.some(p => lower.includes(p));
      const hasSarcasmEmojis = /🙄|😏/.test(msg);
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
  