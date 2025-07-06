const { db } = require("../firebase");
const buildPrompt = require("../utils/buildPrompt");
const analyzeMessage = require("../utils/analyzeMessage");
const model = require("../geminiclient"); // Gemini Flash client

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

    // ✍️ Step 3: Save current message
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

    // 🤖 Step 5: Generate reply with chat memory + systemPrompt
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
    const reply = response.text();

    // 💾 Save bot reply to chat history
    await db
      .collection("chatLogs")
      .doc(userId)
      .collection("logs")
      .add({
        message: reply,
        sender: "bot",
        timestamp: new Date().toISOString(),
      });

      const badReplies = ["haan", "bol", "haan.", "bol.", "haan?", "bol?"];
    if (badReplies.includes(reply.trim().toLowerCase())) {
      reply = "Arre haan bata rahi hu na... sun dhyan se 😤";
    }

    res.json({ reply });
  } catch (error) {
    console.error("❌ Gemini error:", error.message || error);
    res.status(500).json({ error: "Echo Gemini failed" });
  }
};
