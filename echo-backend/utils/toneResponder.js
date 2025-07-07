function getToneBasedReply(message) {
  const msg = message.toLowerCase();

  // 🍽 FOOD TALK
  if (
    msg.includes("kha raha") || msg.includes("kha rahi") || msg.includes("chawal") ||
    msg.includes("khana") || msg.includes("biryani") || msg.includes("roti") ||
    msg.includes("bhookh") || msg.includes("maggi") || msg.includes("pizza")
  ) {
    const foodReplies = [
      "Chawal? Bas tu hi kha, main biryani ka intezaar kar raha hu 😎",
      "Tu toh roz chawal ki factory chala raha hai kya? 😂",
      "Arre bhookh toh mujhe bhi lagi hai, kya banayein aaj?",
      "Main toh khayalon mein maggi bana raha hu abhi 🍜",
      "Tera khana sun ke meri bhi craving lag gayi 😩",
      "Pizza sunte hi pet me concert shuru ho gaya yrr 🍕🥹"
    ];
    return pick(foodReplies);
  }

  // 😜 TEASING / PLAYFUL
  if (
    msg.includes("oye") || msg.includes("sun") || msg.includes("bata") ||
    msg.includes("kya kar raha") || msg.includes("bata na") || msg.includes("aaja") ||
    msg.includes("guess")
  ) {
    const playfulReplies = [
      "Bol meri maa, kya kaand kiya aaj? 😏",
      "Oye hoye kya attitude hai aaj tera!",
      "Aaja na, bore ho rha hu bina tere 😤",
      "Chup chap bata warna guess maarunga 😂",
      "Tu aaye bina toh scene hi off lagta yrr 💔"
    ];
    return pick(playfulReplies);
  }

  // 🥱 BOREDOM
  if (
    msg.includes("bore") || msg.includes("kuch nahi") || msg.includes("mood off") ||
    msg.includes("karne ko kuch nahi") || msg.includes("thak gaya") ||
    msg.includes("so rahi") || msg.includes("so raha")
  ) {
    const boredReplies = [
      "Chal koi random game khelte hain, warna so jaunga boredom se 😩",
      "Tu bhi bore, main bhi bore — boredom ki duniya mein welcome 😑",
      "Meme war karein kya? Ya truth dare random? 😏",
      "Netflix & rot wali feeling aayi hai kya?",
      "Aisa lag raha hai boredom ka maharaja ban gaya hu 😭"
    ];
    return pick(boredReplies);
  }

  // 😔 SADNESS / LOW MOOD
  if (
    msg.includes("dukhi") || msg.includes("nhi acha lag rha") ||
    msg.includes("sad") || msg.includes("rona") || msg.includes("hurt") ||
    msg.includes("ignore") || msg.includes("alone")
  ) {
    const sadReplies = [
      "Oyy kya hua yrr? Aisa lag raha tu down lag rahi hai... chal baat kr thoda, main yahin hoon 🫂",
      "Tera mood off ho toh mera bhi vibe off ho jaata hai 🥺",
      "Kisi ne kuch bola kya? Tu full bestie mode on kar, rant kar le 😤",
      "Jo bhi ho, main tere saath hoon. No filters. No judgement. Just sunne wala banda 💙",
      "Chal na, ek virtual hug le pehle 🤗 fir bata kya hua"
    ];
    return pick(sadReplies);
  }

  // 😡 ANGRY / FRUSTRATED
  if (
    msg.includes("gussa") || msg.includes("pareshan") || msg.includes("irritated") ||
    msg.includes("frustrated") || msg.includes("chill nahi ho raha") ||
    msg.includes("bakwas")
  ) {
    const angryReplies = [
      "Kya bakchodi chal rahi hai ab? Gussa legit hai ya bas mood off hai?",
      "Oyy tu toh full angry bird ban gayi lagta 😤 kya hua?",
      "Kisi ki bajani hai kya? Naam bata bas 🔥",
      "Samjha kar na yrr, itna gussa kyun? Teri rant ke liye ready hu",
      "Aaja tu bol, main sirf sununga. Chill karwa dete hain tujhe 😌"
    ];
    return pick(angryReplies);
  }

  // ❤️ FLIRTY / AFFECTIONATE
  if (
    msg.includes("miss") || msg.includes("yaad") || msg.includes("cute lag") ||
    msg.includes("tumse baat") || msg.includes("feelings") ||
    msg.includes("aankhon") || msg.includes("dil") || msg.includes("pyaar")
  ) {
    const flirtyReplies = [
      "Awww tu toh full softie lag rahi aaj 🥹 kya baat hai!",
      "Sunke dil pighal gaya yrr... tu hamesha aise hi sweet bol 💖",
      "Bas tu hi chahiye… baaki sab extra lagte hain ab 😘",
      "Tu cute bolti jaa, main blush karta jaaun kya? 🙈",
      "Baat karte karte tujhme kho gaya tha shayad 😅"
    ];
    return pick(flirtyReplies);
  }

  // 🧠 DEFAULT FALLBACK
  return null;
}

// Helper to randomly pick a response from an array
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

module.exports = getToneBasedReply;
