const axios = require("axios");
const { db } = require("../firebase");
const buildPrompt = require("../utils/buildPrompt");
const analyzeMessage = require("../utils/analyzeMessage");

exports.generateEchoResponse = async (req, res) => {
    const { userId, userMessage } = req.body;
  
    console.log("Received userId:", userId);
    console.log("Received message:", userMessage);
  
    try {
      // Step 1: Fetch user profile
      const userDoc = await db.collection("users").doc(userId).get();
      let profile = userDoc.data()?.personalityProfile;
      if (!profile) {
        console.log("No profile found, using default traits.");
        const newTraits = analyzeMessage(userMessage);
        profile = newTraits; // 🧠 use this for prompt
      
        await db.collection("users").doc(userId).set({
          personalityProfile: newTraits
        });
      }   
      
  
      console.log("Fetched profile from Firebase:", profile);
  
      if (!profile) {
        return res.status(404).json({ error: "Personality profile not found" });
      }
  
      // Step 2: Learn from current message
      const newTraits = analyzeMessage(userMessage);
      const systemPrompt = buildPrompt(profile, newTraits.mood);
      console.log("System prompt being sent to Groq:", systemPrompt);
  
      // Step 3: Save chat log
      const timestamp = new Date().toISOString();
      await db
        .collection("chatLogs")
        .doc(userId)
        .collection("logs")
        .add({
          message: userMessage,
          timestamp,
          ...newTraits,
        });
  
      console.log("Learned traits:", newTraits);
  
      // Step 4: Update Firebase
      await db.collection("users").doc(userId).set(
        {
          personalityProfile: newTraits,
        },
        { merge: true }
      );
  
      // Step 5: Call Groq API
      const response = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          model: "llama3-70b-8192",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      const reply = response.data.choices[0].message.content;
      res.json({ reply });
    } catch (error) {
      console.error("🔥 Full error log:", error.response?.data || error.message);
      res.status(500).json({ error: "Echo AIP failed" });
    }
  };
  