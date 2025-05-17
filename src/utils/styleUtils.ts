
// Style utility functions for category styling

export const getCategoryCardClass = (category: string): string => {
  switch (category) {
    case "thinking-learning": return "strength-card-thinking";
    case "interpersonal": return "strength-card-interpersonal";
    case "leadership-influence": return "strength-card-leadership";
    case "execution-discipline": return "strength-card-execution";
    case "identity-purpose-values": return "strength-card-identity";
    default: return "border-l-primary";
  }
};

export const getCategoryBadgeClass = (category: string): string => {
  switch (category) {
    case "thinking-learning": return "strength-badge-thinking";
    case "interpersonal": return "strength-badge-interpersonal";
    case "leadership-influence": return "strength-badge-leadership";
    case "execution-discipline": return "strength-badge-execution";
    case "identity-purpose-values": return "strength-badge-identity";
    default: return "";
  }
};

export const getCategoryProgressClass = (category: string): string => {
  switch (category) {
    case "thinking-learning": return "bg-strength-blue";
    case "interpersonal": return "bg-strength-yellow";
    case "leadership-influence": return "bg-strength-red";
    case "execution-discipline": return "bg-strength-green";
    case "identity-purpose-values": return "bg-strength-purple";
    default: return "bg-primary";
  }
};

// Helper function to get color based on category
export const getCategoryColor = (category: string): string => {
  const categoryColors: Record<string, string> = {
    "thinking-learning": "#3B82F6", // Blue
    "interpersonal": "#FACC15",     // Yellow
    "leadership-influence": "#EF4444", // Red
    "execution-discipline": "#22C55E", // Green
    "identity-purpose-values": "#8B5CF6" // Purple
  };
  
  return categoryColors[category] || "#C92A2A"; // Default to crimson
};
