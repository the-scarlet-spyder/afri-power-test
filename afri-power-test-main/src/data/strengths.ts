
import { Strength, Question, StrengthCategory } from '../models/strength';

// Helper function to get category display name
export const getCategoryDisplayName = (category: StrengthCategory): string => {
  switch (category) {
    case "thinking-learning":
      return "Thinking & Learning";
    case "interpersonal":
      return "Interpersonal";
    case "leadership-influence":
      return "Leadership & Influence";
    case "execution-discipline":
      return "Execution & Discipline";
    case "identity-purpose-values":
      return "Identity, Purpose & Values";
    default:
      return category;
  }
};

export const strengthCategories = {
  "thinking-learning": "Thinking & Learning",
  "interpersonal": "Interpersonal",
  "leadership-influence": "Leadership & Influence",
  "execution-discipline": "Execution & Discipline",
  "identity-purpose-values": "Identity, Purpose & Values"
};

export const strengths: Strength[] = [
  // Thinking & Learning Strengths
  {
    id: "insight-seeker",
    name: "Insight Seeker",
    tagline: "You see patterns others miss",
    description: "You enjoy digging deep into problems, uncovering insights, and connecting dots across topics or experiences.",
    category: "thinking-learning",
    recommendations: [
      "Set aside time for deep reflection on complex problems",
      "Share your unique insights with teams during planning phases",
      "Look for roles that require connecting seemingly disparate information",
      "Keep a journal of patterns and connections you observe"
    ]
  },
  {
    id: "strategic-mind",
    name: "Strategic Mind",
    tagline: "You always have a game plan",
    description: "You naturally consider different pathways and make calculated decisions with the future in mind.",
    category: "thinking-learning",
    recommendations: [
      "Focus on long-term planning and vision setting",
      "Create contingency plans for important projects",
      "Help others see beyond immediate challenges",
      "Practice scenario planning to refine your foresight"
    ]
  },
  {
    id: "curious-learner",
    name: "Curious Learner",
    tagline: "Your hunger for growth never ends",
    description: "You are energized by learning, always exploring new topics and improving your understanding of the world.",
    category: "thinking-learning",
    recommendations: [
      "Dedicate time each week to learning something new",
      "Share your knowledge with others through teaching",
      "Seek roles that require continuous learning",
      "Connect with others who share your thirst for knowledge"
    ]
  },
  {
    id: "analyst",
    name: "Analyst",
    tagline: "You think with precision",
    description: "You are logical, careful, and driven by clarity. You break problems into pieces and rebuild smarter solutions.",
    category: "thinking-learning",
    recommendations: [
      "Take on complex problems that require methodical analysis",
      "Help teams structure their thinking around difficult challenges",
      "Document your analytical processes to help others learn",
      "Pair with more intuitive thinkers to balance perspectives"
    ]
  },
  
  // Interpersonal Strengths
  {
    id: "connector",
    name: "Connector",
    tagline: "You bring people together",
    description: "You thrive in social settings, quickly build relationships, and create harmony in groups.",
    category: "interpersonal",
    recommendations: [
      "Organize gatherings that bring diverse people together",
      "Help teammates build stronger relationships",
      "Create opportunities for collaboration across teams",
      "Maintain and nurture your network intentionally"
    ]
  },
  {
    id: "empath",
    name: "Empath",
    tagline: "You feel what others feel",
    description: "You are highly attuned to people's emotions and often support or uplift others when they need it most.",
    category: "interpersonal",
    recommendations: [
      "Create safe spaces for people to express their feelings",
      "Help teams navigate emotionally charged situations",
      "Practice setting boundaries to avoid emotional burnout",
      "Use your emotional intelligence to improve team dynamics"
    ]
  },
  {
    id: "mentor",
    name: "Mentor",
    tagline: "You grow others with care",
    description: "You naturally take people under your wing and are fulfilled when you help others succeed.",
    category: "interpersonal",
    recommendations: [
      "Seek formal or informal mentorship opportunities",
      "Share your expertise through teaching or writing",
      "Develop a structured approach to guiding others",
      "Celebrate the successes of those you've helped"
    ]
  },
  {
    id: "cultural-bridge",
    name: "Cultural Bridge",
    tagline: "You respect and unite differences",
    description: "You have a natural ability to respect diverse backgrounds and foster inclusive environments.",
    category: "interpersonal",
    recommendations: [
      "Help teams become more inclusive and culturally aware",
      "Facilitate cross-cultural collaborations",
      "Advocate for diverse perspectives in decision-making",
      "Continue learning about different cultures and worldviews"
    ]
  },
  
  // Leadership & Influence Strengths
  {
    id: "pathfinder",
    name: "Pathfinder",
    tagline: "You lead with vision",
    description: "You think boldly, dream big, and inspire others to follow a meaningful direction.",
    category: "leadership-influence",
    recommendations: [
      "Develop and communicate compelling visions for the future",
      "Help teams connect daily work to broader purpose",
      "Seek leadership roles that allow you to shape direction",
      "Practice articulating your vision in clear, inspiring ways"
    ]
  },
  {
    id: "mobilizer",
    name: "Mobilizer",
    tagline: "You move people to act",
    description: "You are action-oriented and persuasive, rallying others around ideas or causes.",
    category: "leadership-influence",
    recommendations: [
      "Take the lead on initiatives that need momentum",
      "Help translate ideas into actionable plans",
      "Develop your persuasion skills further",
      "Create opportunities for others to get involved"
    ]
  },
  {
    id: "courageous-voice",
    name: "Courageous Voice",
    tagline: "You speak truth, even when it's hard",
    description: "You advocate for what's right, challenge the status quo, and influence through integrity.",
    category: "leadership-influence",
    recommendations: [
      "Speak up for important principles in key moments",
      "Help create cultures where honest feedback is valued",
      "Develop diplomatic ways to deliver difficult messages",
      "Support others in finding their voice"
    ]
  },
  {
    id: "respected-presence",
    name: "Respected Presence",
    tagline: "People take you seriously",
    description: "Your quiet confidence and reliability earn you trust, authority, and leadership by example.",
    category: "leadership-influence",
    recommendations: [
      "Lead by example in challenging situations",
      "Share your wisdom thoughtfully in key moments",
      "Build your expertise to further strengthen your authority",
      "Mentor others in developing their leadership presence"
    ]
  },
  
  // Execution & Discipline Strengths
  {
    id: "grounded-achiever",
    name: "Grounded Achiever",
    tagline: "You get things done",
    description: "You are practical, disciplined, and love completing tasks. You're a finisher, not just a starter.",
    category: "execution-discipline",
    recommendations: [
      "Take ownership of projects that need reliable completion",
      "Break large goals into actionable steps",
      "Help teams focus on practical implementation",
      "Celebrate milestones to maintain motivation"
    ]
  },
  {
    id: "resilient-driver",
    name: "Resilient Driver",
    tagline: "You push through storms",
    description: "You bounce back from adversity and keep moving forward no matter how hard the journey gets.",
    category: "execution-discipline",
    recommendations: [
      "Take on challenging projects that others might avoid",
      "Share your resilience strategies with your team",
      "Build in reflection time after setbacks to learn from them",
      "Help create a culture that embraces challenges"
    ]
  },
  {
    id: "organizer",
    name: "Organizer",
    tagline: "You create order in chaos",
    description: "You're detail-oriented, structured, and keep things on track even when others lose focus.",
    category: "execution-discipline",
    recommendations: [
      "Help teams create effective systems and processes",
      "Take on roles that require strong organizational skills",
      "Document your organizational systems to help others",
      "Balance your attention to detail with big-picture thinking"
    ]
  },
  {
    id: "resourceful-doer",
    name: "Resourceful Doer",
    tagline: "You make things work",
    description: "You excel in low-resource settings, using creativity and grit to solve problems others avoid.",
    category: "execution-discipline",
    recommendations: [
      "Leverage your ability to do more with less",
      "Share your improvisational problem-solving approaches",
      "Look for opportunities in resource-constrained environments",
      "Help others see constraints as creative challenges"
    ]
  },
  
  // Identity, Purpose & Values Strengths
  {
    id: "purpose-driven",
    name: "Purpose-Driven",
    tagline: "You live by your why",
    description: "Your actions are guided by a strong internal compass and desire to make a meaningful impact.",
    category: "identity-purpose-values",
    recommendations: [
      "Align your work with your deeper purpose",
      "Help teams connect to meaningful impact",
      "Regularly reflect on how your actions serve your purpose",
      "Share your sense of purpose to inspire others"
    ]
  },
  {
    id: "faith-led",
    name: "Faith-Led",
    tagline: "Your strength flows from something greater",
    description: "You draw guidance, confidence, or resilience from spiritual beliefs or higher principles.",
    category: "identity-purpose-values",
    recommendations: [
      "Create space for your spiritual practices in your daily routine",
      "Connect your work to your deeper beliefs and values",
      "Respect diverse faith perspectives in your environment",
      "Draw on your faith as a source of resilience in challenges"
    ]
  },
  {
    id: "legacy-builder",
    name: "Legacy-Builder",
    tagline: "You think beyond yourself",
    description: "You care deeply about the impact you leave behind and strive to build things that last.",
    category: "identity-purpose-values",
    recommendations: [
      "Consider the long-term impact of your decisions",
      "Mentor others to extend your influence",
      "Document lessons learned to pass on knowledge",
      "Invest in initiatives with lasting significance"
    ]
  },
  {
    id: "authentic-self",
    name: "Authentic Self",
    tagline: "You are unapologetically you",
    description: "You live and work in alignment with your values, regardless of external pressures.",
    category: "identity-purpose-values",
    recommendations: [
      "Seek environments that value your authentic expression",
      "Help create cultures where people can be themselves",
      "Stand firm in your values when facing pressure",
      "Mentor others in finding their authentic voice"
    ]
  }
];

export const questions: Question[] = [
  // Insight Seeker questions
  {
    id: "q1",
    text: "I enjoy digging deep into problems, uncovering insights.",
    strengthId: "insight-seeker"
  },
  {
    id: "q2",
    text: "I see patterns where others see chaos.",
    strengthId: "insight-seeker"
  },
  {
    id: "q3",
    text: "I connect dots across seemingly unrelated topics or experiences.",
    strengthId: "insight-seeker"
  },
  {
    id: "q4",
    text: "I'm often told my perspective is unique or unexpected.",
    strengthId: "insight-seeker"
  },
  {
    id: "q5",
    text: "I enjoy exploring beneath the surface of issues.",
    strengthId: "insight-seeker"
  },

  // Strategic Mind questions
  {
    id: "q6",
    text: "I find ways to work around challenges before they arise.",
    strengthId: "strategic-mind"
  },
  {
    id: "q7",
    text: "I plan ahead for potential setbacks.",
    strengthId: "strategic-mind"
  },
  {
    id: "q8",
    text: "I always have a backup plan.",
    strengthId: "strategic-mind"
  },
  {
    id: "q9",
    text: "I focus on long-term goals, even with limited resources.",
    strengthId: "strategic-mind"
  },
  {
    id: "q10",
    text: "I adapt quickly to unexpected situations.",
    strengthId: "strategic-mind"
  },

  // Curious Learner questions
  {
    id: "q11",
    text: "I am energized by learning new things.",
    strengthId: "curious-learner"
  },
  {
    id: "q12",
    text: "I actively seek out new knowledge and skills.",
    strengthId: "curious-learner"
  },
  {
    id: "q13",
    text: "I enjoy exploring topics outside my expertise.",
    strengthId: "curious-learner"
  },
  {
    id: "q14",
    text: "I ask questions to better understand concepts.",
    strengthId: "curious-learner"
  },
  {
    id: "q15",
    text: "I'm continuously looking for ways to grow intellectually.",
    strengthId: "curious-learner"
  },

  // Analyst questions
  {
    id: "q16",
    text: "I break problems into pieces to find solutions.",
    strengthId: "analyst"
  },
  {
    id: "q17",
    text: "I approach challenges with logical precision.",
    strengthId: "analyst"
  },
  {
    id: "q18",
    text: "I value clarity and precision in thinking.",
    strengthId: "analyst"
  },
  {
    id: "q19",
    text: "I examine details thoroughly before making decisions.",
    strengthId: "analyst"
  },
  {
    id: "q20",
    text: "I rebuild solutions in smarter, more efficient ways.",
    strengthId: "analyst"
  },

  // Connector questions
  {
    id: "q21",
    text: "I bring people together, even in tough situations.",
    strengthId: "connector"
  },
  {
    id: "q22",
    text: "I thrive in social settings and group environments.",
    strengthId: "connector"
  },
  {
    id: "q23",
    text: "I build relationships quickly and naturally.",
    strengthId: "connector"
  },
  {
    id: "q24",
    text: "I create harmony in groups with different personalities.",
    strengthId: "connector"
  },
  {
    id: "q25",
    text: "I help people find common ground in disagreements.",
    strengthId: "connector"
  },

  // Empath questions
  {
    id: "q26",
    text: "I can sense how others are feeling.",
    strengthId: "empath"
  },
  {
    id: "q27",
    text: "I support people when they're going through difficulties.",
    strengthId: "empath"
  },
  {
    id: "q28",
    text: "I'm attuned to the emotional climate of groups.",
    strengthId: "empath"
  },
  {
    id: "q29",
    text: "I help others process their emotions.",
    strengthId: "empath"
  },
  {
    id: "q30",
    text: "I uplift people when they need emotional support.",
    strengthId: "empath"
  },

  // Mentor questions
  {
    id: "q31",
    text: "I enjoy helping others develop their skills.",
    strengthId: "mentor"
  },
  {
    id: "q32",
    text: "I naturally take people under my wing.",
    strengthId: "mentor"
  },
  {
    id: "q33",
    text: "I feel fulfilled when I help others succeed.",
    strengthId: "mentor"
  },
  {
    id: "q34",
    text: "I provide guidance that helps people grow.",
    strengthId: "mentor"
  },
  {
    id: "q35",
    text: "I'm patient with others as they learn and develop.",
    strengthId: "mentor"
  },

  // Cultural Bridge questions
  {
    id: "q36",
    text: "I respect diverse backgrounds and perspectives.",
    strengthId: "cultural-bridge"
  },
  {
    id: "q37",
    text: "I foster inclusive environments where everyone belongs.",
    strengthId: "cultural-bridge"
  },
  {
    id: "q38",
    text: "I help people from different cultures connect.",
    strengthId: "cultural-bridge"
  },
  {
    id: "q39",
    text: "I adapt my communication style to different cultural contexts.",
    strengthId: "cultural-bridge"
  },
  {
    id: "q40",
    text: "I'm curious about cultural differences and similarities.",
    strengthId: "cultural-bridge"
  },

  // Pathfinder questions
  {
    id: "q41",
    text: "I think boldly about what could be possible.",
    strengthId: "pathfinder"
  },
  {
    id: "q42",
    text: "I inspire others to follow a meaningful direction.",
    strengthId: "pathfinder"
  },
  {
    id: "q43",
    text: "I dream big about future possibilities.",
    strengthId: "pathfinder"
  },
  {
    id: "q44",
    text: "I help others see a clear path forward.",
    strengthId: "pathfinder"
  },
  {
    id: "q45",
    text: "I create compelling visions that motivate action.",
    strengthId: "pathfinder"
  },

  // Mobilizer questions
  {
    id: "q46",
    text: "I move people to take action.",
    strengthId: "mobilizer"
  },
  {
    id: "q47",
    text: "I'm persuasive when advocating for ideas.",
    strengthId: "mobilizer"
  },
  {
    id: "q48",
    text: "I rally others around causes I believe in.",
    strengthId: "mobilizer"
  },
  {
    id: "q49",
    text: "I'm action-oriented and drive for results.",
    strengthId: "mobilizer"
  },
  {
    id: "q50",
    text: "I generate enthusiasm for projects and initiatives.",
    strengthId: "mobilizer"
  },

  // Courageous Voice questions
  {
    id: "q51",
    text: "I speak truth, even when it's difficult.",
    strengthId: "courageous-voice"
  },
  {
    id: "q52",
    text: "I advocate for what's right, regardless of popularity.",
    strengthId: "courageous-voice"
  },
  {
    id: "q53",
    text: "I challenge the status quo when needed.",
    strengthId: "courageous-voice"
  },
  {
    id: "q54",
    text: "I influence through integrity and honesty.",
    strengthId: "courageous-voice"
  },
  {
    id: "q55",
    text: "I stand firm in my principles under pressure.",
    strengthId: "courageous-voice"
  },

  // Respected Presence questions
  {
    id: "q56",
    text: "People take me seriously in professional settings.",
    strengthId: "respected-presence"
  },
  {
    id: "q57",
    text: "My quiet confidence earns me trust.",
    strengthId: "respected-presence"
  },
  {
    id: "q58",
    text: "I lead by example rather than force.",
    strengthId: "respected-presence"
  },
  {
    id: "q59",
    text: "My reliability gives me authority in groups.",
    strengthId: "respected-presence"
  },
  {
    id: "q60",
    text: "People listen carefully when I speak.",
    strengthId: "respected-presence"
  },

  // Grounded Achiever questions
  {
    id: "q61",
    text: "I am practical and focused on results.",
    strengthId: "grounded-achiever"
  },
  {
    id: "q62",
    text: "I love completing tasks and projects.",
    strengthId: "grounded-achiever"
  },
  {
    id: "q63",
    text: "I'm disciplined in pursuing my goals.",
    strengthId: "grounded-achiever"
  },
  {
    id: "q64",
    text: "I finish what I start rather than jumping to new things.",
    strengthId: "grounded-achiever"
  },
  {
    id: "q65",
    text: "I value concrete accomplishments over abstract ideas.",
    strengthId: "grounded-achiever"
  },

  // Resilient Driver questions
  {
    id: "q66",
    text: "I bounce back quickly from setbacks.",
    strengthId: "resilient-driver"
  },
  {
    id: "q67",
    text: "I keep moving forward despite obstacles.",
    strengthId: "resilient-driver"
  },
  {
    id: "q68",
    text: "I view challenges as opportunities for growth.",
    strengthId: "resilient-driver"
  },
  {
    id: "q69",
    text: "I persist through difficult circumstances.",
    strengthId: "resilient-driver"
  },
  {
    id: "q70",
    text: "I maintain focus on goals during hardship.",
    strengthId: "resilient-driver"
  },

  // Organizer questions
  {
    id: "q71",
    text: "I create structure in unstructured environments.",
    strengthId: "organizer"
  },
  {
    id: "q72",
    text: "I'm detail-oriented in managing projects.",
    strengthId: "organizer"
  },
  {
    id: "q73",
    text: "I keep things on track when others lose focus.",
    strengthId: "organizer"
  },
  {
    id: "q74",
    text: "I develop systems to manage complexity.",
    strengthId: "organizer"
  },
  {
    id: "q75",
    text: "I bring order to chaotic situations.",
    strengthId: "organizer"
  },

  // Resourceful Doer questions
  {
    id: "q76",
    text: "I excel in environments with limited resources.",
    strengthId: "resourceful-doer"
  },
  {
    id: "q77",
    text: "I find creative solutions to challenging problems.",
    strengthId: "resourceful-doer"
  },
  {
    id: "q78",
    text: "I make things work with whatever is available.",
    strengthId: "resourceful-doer"
  },
  {
    id: "q79",
    text: "I solve problems others might avoid due to constraints.",
    strengthId: "resourceful-doer"
  },
  {
    id: "q80",
    text: "I use grit and creativity to overcome limitations.",
    strengthId: "resourceful-doer"
  },

  // Purpose-Driven questions
  {
    id: "q81",
    text: "My actions are guided by a strong internal compass.",
    strengthId: "purpose-driven"
  },
  {
    id: "q82",
    text: "I'm driven by making a meaningful impact.",
    strengthId: "purpose-driven"
  },
  {
    id: "q83",
    text: "I stay focused on my 'why' during challenges.",
    strengthId: "purpose-driven"
  },
  {
    id: "q84",
    text: "I align my decisions with my deeper values.",
    strengthId: "purpose-driven"
  },
  {
    id: "q85",
    text: "I help others connect to meaningful purpose.",
    strengthId: "purpose-driven"
  },

  // Faith-Led questions
  {
    id: "q86",
    text: "I draw strength from my spiritual beliefs.",
    strengthId: "faith-led"
  },
  {
    id: "q87",
    text: "My confidence flows from something greater than myself.",
    strengthId: "faith-led"
  },
  {
    id: "q88",
    text: "I find resilience through higher principles.",
    strengthId: "faith-led"
  },
  {
    id: "q89",
    text: "I seek guidance from spiritual practices in decisions.",
    strengthId: "faith-led"
  },
  {
    id: "q90",
    text: "I integrate my faith into my daily actions.",
    strengthId: "faith-led"
  },

  // Legacy-Builder questions
  {
    id: "q91",
    text: "I care deeply about the impact I leave behind.",
    strengthId: "legacy-builder"
  },
  {
    id: "q92",
    text: "I strive to build things that will last beyond me.",
    strengthId: "legacy-builder"
  },
  {
    id: "q93",
    text: "I think about how my work benefits future generations.",
    strengthId: "legacy-builder"
  },
  {
    id: "q94",
    text: "I'm motivated by creating lasting positive change.",
    strengthId: "legacy-builder"
  },
  {
    id: "q95",
    text: "I invest in initiatives with long-term significance.",
    strengthId: "legacy-builder"
  },

  // Authentic Self questions
  {
    id: "q96",
    text: "I live and work in alignment with my values.",
    strengthId: "authentic-self"
  },
  {
    id: "q97",
    text: "I stay true to myself despite external pressures.",
    strengthId: "authentic-self"
  },
  {
    id: "q98",
    text: "I express my genuine thoughts and feelings appropriately.",
    strengthId: "authentic-self"
  },
  {
    id: "q99",
    text: "I make decisions that honor who I truly am.",
    strengthId: "authentic-self"
  },
  {
    id: "q100",
    text: "I'm comfortable being my authentic self with others.",
    strengthId: "authentic-self"
  }
];
