export const generateAISuggestions = (lastMessage: string): string[] => {
  const suggestions = [
    "That sounds great!",
    "I understand completely.",
    "Thanks for letting me know.",
    "Looking forward to it!",
    "No problem at all.",
    "That works for me.",
    "I appreciate your help.",
    "Sounds like a plan!",
  ];

  // Simple keyword-based suggestions
  const lowerMessage = lastMessage.toLowerCase();
  
  if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
    return ["You're welcome!", "Happy to help!", "Anytime!"];
  }
  
  if (lowerMessage.includes('sorry') || lowerMessage.includes('apologize')) {
    return ["No worries!", "It's okay!", "Don't worry about it!"];
  }
  
  if (lowerMessage.includes('how are you') || lowerMessage.includes('how\'re you')) {
    return ["I'm doing well, thanks!", "Great, how about you?", "All good here!"];
  }
  
  if (lowerMessage.includes('meeting') || lowerMessage.includes('call')) {
    return ["Sounds good!", "What time works?", "I'll be there!"];
  }

  // Return random suggestions if no keywords match
  return suggestions.slice(0, 3).sort(() => Math.random() - 0.5);
};