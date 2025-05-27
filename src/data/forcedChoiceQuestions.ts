
export interface ForcedChoiceQuestion {
  id: number;
  statementA: string;
  statementB: string;
  traitA: string;
  traitB: string;
}

export interface TraitDefinition {
  name: string;
  tagline: string;
  description: string;
  category: string;
}

export const traitDefinitions: Record<string, TraitDefinition> = {
  "Strategic Mind": {
    name: "Strategic Mind",
    tagline: "You always have a game plan.",
    description: "You naturally consider different pathways and make calculated decisions with the future in mind.",
    category: "Thinking & Learning"
  },
  "Connector": {
    name: "Connector",
    tagline: "You bring people together.",
    description: "You thrive in social settings, quickly build relationships, and create harmony in groups.",
    category: "Interpersonal"
  },
  "Purpose-Driven": {
    name: "Purpose-Driven",
    tagline: "You live by your why.",
    description: "Your actions are guided by a strong internal compass and desire to make a meaningful impact.",
    category: "Identity, Purpose & Values"
  },
  "Respected Presence": {
    name: "Respected Presence",
    tagline: "People take you seriously.",
    description: "Your quiet confidence and reliability earn you trust, authority, and leadership by example.",
    category: "Leadership & Influence"
  },
  "Resourceful Doer": {
    name: "Resourceful Doer",
    tagline: "You make things work.",
    description: "You excel in low-resource settings, using creativity and grit to solve problems others avoid.",
    category: "Execution & Discipline"
  },
  "Community Builder": {
    name: "Community Builder",
    tagline: "You invest in people and places.",
    description: "You naturally build and strengthen communities, creating environments where people thrive together.",
    category: "Interpersonal"
  },
  "Grit": {
    name: "Grit",
    tagline: "You keep pushing, no matter what.",
    description: "You bounce back from adversity and keep moving forward no matter how hard the journey gets.",
    category: "Execution & Discipline"
  },
  "Visionary": {
    name: "Visionary",
    tagline: "You see what others don't.",
    description: "You think boldly, dream big, and inspire others to follow a meaningful direction.",
    category: "Leadership & Influence"
  },
  "Detail Keeper": {
    name: "Detail Keeper",
    tagline: "You notice the little things that matter.",
    description: "You're detail-oriented, structured, and keep things on track even when others lose focus.",
    category: "Execution & Discipline"
  },
  "Lifelong Learner": {
    name: "Lifelong Learner",
    tagline: "You grow through learning.",
    description: "You are energized by learning, always exploring new topics and improving your understanding of the world.",
    category: "Thinking & Learning"
  },
  "Confident Voice": {
    name: "Confident Voice",
    tagline: "You speak with courage and clarity.",
    description: "You advocate for what's right, challenge the status quo, and influence through integrity.",
    category: "Leadership & Influence"
  },
  "Peacekeeper": {
    name: "Peacekeeper",
    tagline: "You calm storms and resolve tension.",
    description: "You have a natural ability to mediate conflicts and create harmony in challenging situations.",
    category: "Interpersonal"
  },
  "Compassionate Soul": {
    name: "Compassionate Soul",
    tagline: "You care deeply for others.",
    description: "You are highly attuned to people's emotions and often support or uplift others when they need it most.",
    category: "Interpersonal"
  },
  "Self-Starter": {
    name: "Self-Starter",
    tagline: "You don't wait — you begin.",
    description: "You are action-oriented and driven, taking initiative without waiting for permission or direction.",
    category: "Execution & Discipline"
  },
  "Risk Taker": {
    name: "Risk Taker",
    tagline: "You act boldly when others hesitate.",
    description: "You embrace uncertainty and take calculated risks to achieve meaningful outcomes.",
    category: "Leadership & Influence"
  },
  "Builder": {
    name: "Builder",
    tagline: "You love creating from scratch.",
    description: "You enjoy developing new systems, processes, or solutions that create lasting value.",
    category: "Execution & Discipline"
  },
  "Organizer": {
    name: "Organizer",
    tagline: "You bring order to chaos.",
    description: "You create structure in unstructured environments and manage complexity effectively.",
    category: "Execution & Discipline"
  },
  "Steady Support": {
    name: "Steady Support",
    tagline: "You are consistent and dependable.",
    description: "Others can count on you to be reliable, stable, and present when they need support.",
    category: "Interpersonal"
  },
  "Opportunity Seeker": {
    name: "Opportunity Seeker",
    tagline: "You spot chances others miss.",
    description: "You have a keen eye for identifying opportunities and potential that others might overlook.",
    category: "Thinking & Learning"
  },
  "Optimist": {
    name: "Optimist",
    tagline: "You always see a better tomorrow.",
    description: "You maintain a positive outlook and help others see possibilities even in challenging circumstances.",
    category: "Identity, Purpose & Values"
  }
};

export const forcedChoiceQuestions: ForcedChoiceQuestion[] = [
  {
    id: 1,
    statementA: "I find ways to work around challenges.",
    statementB: "I notice small errors others often miss.",
    traitA: "Strategic Mind",
    traitB: "Detail Keeper"
  },
  {
    id: 2,
    statementA: "I bring people together, even in tough situations.",
    statementB: "I take action without being pushed.",
    traitA: "Connector",
    traitB: "Self-Starter"
  },
  {
    id: 3,
    statementA: "My actions are guided by a strong internal compass.",
    statementB: "People take me seriously in professional settings.",
    traitA: "Purpose-Driven",
    traitB: "Respected Presence"
  },
  {
    id: 4,
    statementA: "I make things work with whatever is available.",
    statementB: "I invest in building strong communities.",
    traitA: "Resourceful Doer",
    traitB: "Community Builder"
  },
  {
    id: 5,
    statementA: "I keep pushing through difficult circumstances.",
    statementB: "I think boldly about what could be possible.",
    traitA: "Grit",
    traitB: "Visionary"
  },
  {
    id: 6,
    statementA: "I am energized by learning new things.",
    statementB: "I speak truth, even when it's difficult.",
    traitA: "Lifelong Learner",
    traitB: "Confident Voice"
  },
  {
    id: 7,
    statementA: "I help calm tensions and resolve conflicts.",
    statementB: "I care deeply about others' wellbeing.",
    traitA: "Peacekeeper",
    traitB: "Compassionate Soul"
  },
  {
    id: 8,
    statementA: "I act boldly when others hesitate.",
    statementB: "I love creating new systems from scratch.",
    traitA: "Risk Taker",
    traitB: "Builder"
  },
  {
    id: 9,
    statementA: "I create structure in chaotic situations.",
    statementB: "Others can count on me to be reliable.",
    traitA: "Organizer",
    traitB: "Steady Support"
  },
  {
    id: 10,
    statementA: "I spot opportunities others miss.",
    statementB: "I always see a better tomorrow.",
    traitA: "Opportunity Seeker",
    traitB: "Optimist"
  },
  {
    id: 11,
    statementA: "I plan ahead for potential setbacks.",
    statementB: "I thrive in social settings and group environments.",
    traitA: "Strategic Mind",
    traitB: "Connector"
  },
  {
    id: 12,
    statementA: "I stay focused on my 'why' during challenges.",
    statementB: "My quiet confidence earns me trust.",
    traitA: "Purpose-Driven",
    traitB: "Respected Presence"
  },
  {
    id: 13,
    statementA: "I solve problems others might avoid due to constraints.",
    statementB: "I help people find common ground.",
    traitA: "Resourceful Doer",
    traitB: "Community Builder"
  },
  {
    id: 14,
    statementA: "I bounce back quickly from setbacks.",
    statementB: "I inspire others to follow a meaningful direction.",
    traitA: "Grit",
    traitB: "Visionary"
  },
  {
    id: 15,
    statementA: "I'm detail-oriented in managing projects.",
    statementB: "I actively seek out new knowledge and skills.",
    traitA: "Detail Keeper",
    traitB: "Lifelong Learner"
  },
  {
    id: 16,
    statementA: "I advocate for what's right, regardless of popularity.",
    statementB: "I create harmony in groups with different personalities.",
    traitA: "Confident Voice",
    traitB: "Peacekeeper"
  },
  {
    id: 17,
    statementA: "I support people when they're going through difficulties.",
    statementB: "I don't wait for permission — I begin.",
    traitA: "Compassionate Soul",
    traitB: "Self-Starter"
  },
  {
    id: 18,
    statementA: "I embrace uncertainty to achieve meaningful outcomes.",
    statementB: "I enjoy developing new processes and solutions.",
    traitA: "Risk Taker",
    traitB: "Builder"
  },
  {
    id: 19,
    statementA: "I bring order to chaotic situations.",
    statementB: "I'm consistently present when others need support.",
    traitA: "Organizer",
    traitB: "Steady Support"
  },
  {
    id: 20,
    statementA: "I identify potential that others might overlook.",
    statementB: "I help others see possibilities in challenges.",
    traitA: "Opportunity Seeker",
    traitB: "Optimist"
  },
  {
    id: 21,
    statementA: "I always have a backup plan.",
    statementB: "I build relationships quickly and naturally.",
    traitA: "Strategic Mind",
    traitB: "Connector"
  },
  {
    id: 22,
    statementA: "I align my decisions with my deeper values.",
    statementB: "I lead by example rather than force.",
    traitA: "Purpose-Driven",
    traitB: "Respected Presence"
  },
  {
    id: 23,
    statementA: "I use grit and creativity to overcome limitations.",
    statementB: "I create environments where people thrive together.",
    traitA: "Resourceful Doer",
    traitB: "Community Builder"
  },
  {
    id: 24,
    statementA: "I persist through difficult circumstances.",
    statementB: "I dream big about future possibilities.",
    traitA: "Grit",
    traitB: "Visionary"
  },
  {
    id: 25,
    statementA: "I keep things on track when others lose focus.",
    statementB: "I explore topics outside my expertise.",
    traitA: "Detail Keeper",
    traitB: "Lifelong Learner"
  },
  {
    id: 26,
    statementA: "I stand firm in my principles under pressure.",
    statementB: "I mediate conflicts effectively.",
    traitA: "Confident Voice",
    traitB: "Peacekeeper"
  },
  {
    id: 27,
    statementA: "I uplift people when they need emotional support.",
    statementB: "I take initiative without waiting for direction.",
    traitA: "Compassionate Soul",
    traitB: "Self-Starter"
  },
  {
    id: 28,
    statementA: "I take calculated risks for meaningful outcomes.",
    statementB: "I love creating lasting value through new solutions.",
    traitA: "Risk Taker",
    traitB: "Builder"
  },
  {
    id: 29,
    statementA: "I develop systems to manage complexity.",
    statementB: "Others depend on my stability and reliability.",
    traitA: "Organizer",
    traitB: "Steady Support"
  },
  {
    id: 30,
    statementA: "I have a keen eye for identifying opportunities.",
    statementB: "I maintain hope even in difficult circumstances.",
    traitA: "Opportunity Seeker",
    traitB: "Optimist"
  },
  {
    id: 31,
    statementA: "I adapt quickly to unexpected situations.",
    statementB: "I help people from different backgrounds connect.",
    traitA: "Strategic Mind",
    traitB: "Connector"
  },
  {
    id: 32,
    statementA: "I help others connect to meaningful purpose.",
    statementB: "People listen carefully when I speak.",
    traitA: "Purpose-Driven",
    traitB: "Respected Presence"
  },
  {
    id: 33,
    statementA: "I excel in environments with limited resources.",
    statementB: "I strengthen communities wherever I go.",
    traitA: "Resourceful Doer",
    traitB: "Community Builder"
  },
  {
    id: 34,
    statementA: "I maintain focus on goals during hardship.",
    statementB: "I help others see a clear path forward.",
    traitA: "Grit",
    traitB: "Visionary"
  },
  {
    id: 35,
    statementA: "I notice the little things that matter most.",
    statementB: "I'm continuously looking for ways to grow intellectually.",
    traitA: "Detail Keeper",
    traitB: "Lifelong Learner"
  },
  {
    id: 36,
    statementA: "I influence through integrity and honesty.",
    statementB: "I resolve tension in challenging situations.",
    traitA: "Confident Voice",
    traitB: "Peacekeeper"
  },
  {
    id: 37,
    statementA: "I feel deeply for others and their struggles.",
    statementB: "I generate momentum without external motivation.",
    traitA: "Compassionate Soul",
    traitB: "Self-Starter"
  },
  {
    id: 38,
    statementA: "I act when others prefer to wait and see.",
    statementB: "I build things that create lasting impact.",
    traitA: "Risk Taker",
    traitB: "Builder"
  },
  {
    id: 39,
    statementA: "I create order where there was none before.",
    statementB: "I provide consistent support others can count on.",
    traitA: "Organizer",
    traitB: "Steady Support"
  },
  {
    id: 40,
    statementA: "I see potential where others see problems.",
    statementB: "I bring hope and positivity to difficult situations.",
    traitA: "Opportunity Seeker",
    traitB: "Optimist"
  },
  {
    id: 41,
    statementA: "I focus on long-term goals, even with limited resources.",
    statementB: "I foster inclusive environments where everyone belongs.",
    traitA: "Strategic Mind",
    traitB: "Connector"
  },
  {
    id: 42,
    statementA: "I'm driven by making a meaningful impact.",
    statementB: "My reliability gives me authority in groups.",
    traitA: "Purpose-Driven",
    traitB: "Respected Presence"
  },
  {
    id: 43,
    statementA: "I find creative solutions to challenging problems.",
    statementB: "I invest in initiatives that benefit communities.",
    traitA: "Resourceful Doer",
    traitB: "Community Builder"
  },
  {
    id: 44,
    statementA: "I view challenges as opportunities for growth.",
    statementB: "I create compelling visions that motivate action.",
    traitA: "Grit",
    traitB: "Visionary"
  },
  {
    id: 45,
    statementA: "I examine details thoroughly before making decisions.",
    statementB: "I ask questions to better understand concepts.",
    traitA: "Detail Keeper",
    traitB: "Lifelong Learner"
  },
  {
    id: 46,
    statementA: "I challenge the status quo when needed.",
    statementB: "I calm storms and bring peace to conflicts.",
    traitA: "Confident Voice",
    traitB: "Peacekeeper"
  },
  {
    id: 47,
    statementA: "I'm attuned to the emotional climate of groups.",
    statementB: "I drive initiatives forward with personal motivation.",
    traitA: "Compassionate Soul",
    traitB: "Self-Starter"
  },
  {
    id: 48,
    statementA: "I pursue opportunities that others consider too risky.",
    statementB: "I develop systems and structures that last.",
    traitA: "Risk Taker",
    traitB: "Builder"
  },
  {
    id: 49,
    statementA: "I organize complex projects into manageable parts.",
    statementB: "I'm the steady presence others rely upon.",
    traitA: "Organizer",
    traitB: "Steady Support"
  },
  {
    id: 50,
    statementA: "I discover possibilities that others haven't considered.",
    statementB: "I inspire confidence that things will work out.",
    traitA: "Opportunity Seeker",
    traitB: "Optimist"
  }
];
