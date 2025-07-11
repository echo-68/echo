const axios = require("axios");
const fs = require("fs");
const path = require("path");

const ELEVEN_API_KEY = process.env.ELEVEN_API_KEY;
const VOICE_ID = "pNInz6obpgDQGcFmaJgB"; // Rachel

async function generateVoiceAudio(text, filename = "echo") {
  if (!text || text.trim() === "") {
    console.warn("❗ No text provided for TTS.");
    return null;
  }

  const outputPath = path.join(__dirname, "..", "public", "audio");
  const filePath = path.join(outputPath, `${filename}.mp3`);

  try {
    const response = await axios({
      method: "POST",
      url: `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      headers: {
        "xi-api-key": ELEVEN_API_KEY,
        "Content-Type": "application/json",
      },
      responseType: "stream",
      data: {
        text,
        voice_settings: {
          stability: 0.2,
          similarity_boost: 0.9,
        },
      },
      validateStatus: () => true, // allows custom handling of errors
    });

    if (response.status !== 200) {
      let errorBody = "";
      for await (const chunk of response.data) {
        errorBody += chunk.toString();
      }
      console.error("❌ ElevenLabs API Error:", response.status, errorBody);
      return null;
    }

    await new Promise((resolve, reject) => {
      const stream = fs.createWriteStream(filePath);
      response.data.pipe(stream);
      stream.on("finish", resolve);
      stream.on("error", reject);
    });

    console.log("✅ Voice audio saved:", filePath);
    return `/audio/${filename}.mp3`;
  } catch (error) {
    console.error("🎤 ElevenLabs TTS Error:", error.message || error);
    return null;
  }
}

module.exports = generateVoiceAudio;
