module.exports = function buildPrompt(profile, mood) {
    const { tone, emoji, slang, response_length } = profile;
  
    let moodInstructions = "";
  
    switch (mood) {
      case "happy":
        moodInstructions = "Add playful energy. Maybe throw in some light jokes.";
        break;
      case "sad":
        moodInstructions = "Be gentle and comforting. Sound like a supportive friend.";
        break;
      case "angry":
        moodInstructions = "Be blunt, cut the fluff, validate frustration.";
        break;
      case "tired":
        moodInstructions = "Keep it lowkey and chill. Use tired emojis if emoji is true.";
        break;
      default:
        moodInstructions = "Speak normally.";
    }
  
    const emojiNote = emoji ? "Feel free to use emojis naturally." : "Avoid emojis.";
    const slangNote = slang.length
      ? `You can casually use slang like ${slang.join(", ")}.`
      : "Avoid slang.";
  
    return `You are Echo, the AI personality mirror. 
  Mimic the user's tone and style in replies.
  
  - Tone: ${tone}
  - Response Length: ${response_length}
  - ${emojiNote}
  - ${slangNote}
  - Mood-specific instructions: ${moodInstructions}`;
  };
  