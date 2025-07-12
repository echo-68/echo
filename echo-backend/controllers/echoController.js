const { db } = require("../firebase");
const buildPrompt = require("../utils/buildPrompt");
const analyzeMessage = require("../utils/analyzeMessage");
const getToneBasedReply = require("../utils/toneResponder"); // NEW
const model = require("../geminiclient"); // Gemini Flash client
const generateVoiceAudio = require("../utils/generateVoice");

exports.generateEchoResponse = async (req, res) => {
  const { userId, userMessage } = req.body;

  try {
    // 🧠 Step 1: Get or analyze profile
    const userRef = db.collection("users").doc(userId);
    const userDoc = await userRef.get();

    const profile = userDoc.exists
      ? userDoc.data().personalityProfile
      : analyzeMessage(userMessage);

    const newTraits = analyzeMessage(userMessage);
    const systemPrompt = buildPrompt(profile, newTraits.mood);

    // 💡 Step 1.5: Check tone-based shortcut reply (NEW)
    const toneReply = getToneBasedReply(userMessage);
    if (toneReply) {
      // Save user message
      await db
        .collection("chatLogs")
        .doc(userId)
        .collection("logs")
        .add({
          message: userMessage,
          sender: "user",
          timestamp: new Date().toISOString(),
          ...newTraits,
        });

      // Save Echo's reply
      await db
        .collection("chatLogs")
        .doc(userId)
        .collection("logs")
        .add({
          message: toneReply,
          sender: "bot",
          timestamp: new Date().toISOString(),
        });

      return res.json({ reply: toneReply });
    }

    // 📚 Step 2: Fetch recent chat history
    const chatLogsSnapshot = await db
      .collection("chatLogs")
      .doc(userId)
      .collection("logs")
      .orderBy("timestamp", "desc")
      .get();

    const recentMessages = [];
    chatLogsSnapshot.forEach((doc) => {
      const data = doc.data();
      if (!data.sender || !data.message) return;

      recentMessages.unshift({
        role: data.sender === "bot" ? "model" : "user",
        parts: [{ text: data.message }],
      });
    });

    // ✍️ Step 3: Save user message
    await db
      .collection("chatLogs")
      .doc(userId)
      .collection("logs")
      .add({
        message: userMessage,
        sender: "user",
        timestamp: new Date().toISOString(),
        ...newTraits,
      });

    // 🔁 Step 4: Update personality profile
    await userRef.set({ personalityProfile: newTraits }, { merge: true });

    // 🤖 Step 5: Generate reply using Gemini
    const result = await model.generateContent({
      contents: [
        ...recentMessages,
        {
          role: "user",
          parts: [{ text: systemPrompt + `\n\nUser: ${userMessage}\nEcho:` }],
        },
      ],
      generationConfig: {
        temperature: 0.9,
        maxOutputTokens: 512,
      },
    });

    const response = await result.response;
    let reply = response.text();

    // 🧽 Step 6: Filter out bad replies
    const badReplies = ["haan", "bol", "haan.", "bol.", "haan?", "bol?"];
    if (badReplies.includes(reply.trim().toLowerCase())) {
      reply = "Arre haan bata rahi hu na... sun dhyan se 😤";
    }

    let audioUrl = null;
try {
  audioUrl = await generateVoiceAudio(reply); 
  console.log("🎯 Final audioUrl to frontend:", audioUrl);// <- returns filename or full path
} catch (err) {
  console.error("🎤 Voice generation error:", err.message || err);
}

    // 💾 Save Echo's reply to logs
    await db
      .collection("chatLogs")
      .doc(userId)
      .collection("logs")
      .add({
        message: reply,
        sender: "bot",
        timestamp: new Date().toISOString(),
      });

    res.json({ reply,
      audioUrl: audioUrl ? `/audio/${audioUrl}` : null,
     });
  } catch (error) {
    console.error("❌ Gemini error:", error.message || error);
    res.status(500).json({ error: "Echo Gemini failed" });
  }
};
