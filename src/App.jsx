import React, { useState, useRef, useEffect } from "react";

const EnglishLearningPlatform = () => {
  // User State
  const [user, setUser] = useState({
    name: "Student",
    level: 1,
    levelProgress: 0,
    points: 0,
    streak: 0,
    totalPracticeHours: 0,
    sessionsCompleted: 0,
    accuracyRate: 0,
    dailyGoal: 3,
    avatarColor: "#2563eb",
    dailyGoalProgress: 0,
    weeklyGoal: 10,
    weeklyGoalProgress: 0,
    monthlyGoal: 40,
    monthlyGoalProgress: 0,
  });

  // Practice Session State
  const [isListening, setIsListening] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [currentStatus, setCurrentStatus] = useState("Ready to start practice");
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [showSummary, setShowSummary] = useState(false);
  const [sessionSummary, setSessionSummary] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [activeTab, setActiveTab] = useState("conversation");
  const [pronunciationSentences, setPronunciationSentences] = useState([]);
  const [currentPronunciationIndex, setCurrentPronunciationIndex] = useState(0);
  const [pronunciationResults, setPronunciationResults] = useState([]);
  const [isRecordingPronunciation, setIsRecordingPronunciation] =
    useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [aiVoiceEnabled, setAiVoiceEnabled] = useState(true);
  const [activePage, setActivePage] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Learning Progress
  const [learningProgress, setLearningProgress] = useState({
    vocabulary: 0,
    grammar: 0,
    pronunciation: 0,
    fluency: 0,
    listening: 0,
    speaking: 0,
  });

  // Resources State
  const [activeResource, setActiveResource] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [activeResourceTab, setActiveResourceTab] = useState("grammar");
  const [currentLessonContent, setCurrentLessonContent] = useState(null);
  const [lessonProgress, setLessonProgress] = useState({});

  // API Key
  const GROQ_API_KEY =
    "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";

  // Refs
  const recognitionRef = useRef(null);
  const conversationHistoryRef = useRef([]);
  const pronunciationRecognitionRef = useRef(null);
  const messagesEndRef = useRef(null);
  const speechSynthesisRef = useRef(null);
  const isMicrophoneManuallyStopped = useRef(false);
  const mainContainerRef = useRef(null);

  // Color Scheme - Professional Blue Theme
  const colors = {
    primary: "#2563eb",
    primaryLight: "#3b82f6",
    primaryLighter: "#93c5fd",
    primaryDark: "#1d4ed8",
    secondary: "#059669",
    secondaryLight: "#10b981",
    secondaryLighter: "#a7f3d0",
    secondaryDark: "#047857",
    accent: "#d97706",
    accentLight: "#f59e0b",
    accentLighter: "#fde68a",
    accentDark: "#b45309",
    success: "#10b981",
    successLight: "#34d399",
    successLighter: "#a7f3d0",
    warning: "#f59e0b",
    warningLight: "#fbbf24",
    warningLighter: "#fde68a",
    error: "#ef4444",
    errorLight: "#f87171",
    errorLighter: "#fecaca",
    info: "#3b82f6",
    infoLight: "#60a5fa",
    infoLighter: "#bfdbfe",
    background: "#f8fafc",
    surface: "#ffffff",
    surfaceLight: "#f1f5f9",
    surfaceDark: "#e2e8f0",
    textPrimary: "#0f172a",
    textSecondary: "#475569",
    textTertiary: "#64748b",
    border: "#e2e8f0",
    borderLight: "#f1f5f9",
    borderDark: "#cbd5e1",
    gray50: "#f8fafc",
    gray100: "#f1f5f9",
    gray200: "#e2e8f0",
    gray300: "#cbd5e1",
    gray400: "#94a3b8",
    gray500: "#64748b",
    gray600: "#475569",
    gray700: "#334155",
    gray800: "#1e293b",
    gray900: "#0f172a",
  };

  // Scenarios Data
  const scenarios = [
    {
      id: 1,
      title: "Daily Conversations",
      category: "Beginner",
      description: "Practice basic daily conversations and greetings",
      duration: "10-15 minutes",
      sentences: [
        "Hello, how are you today?",
        "What is your name?",
        "Where are you from?",
        "What do you do for work?",
        "Nice to meet you!",
      ],
      color: colors.primary,
      icon: "M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z",
      topics: ["Greetings", "Introductions", "Basic Questions"],
      learningTips: [
        "Use simple present tense for daily routines",
        "Practice common greetings and responses",
        "Focus on clear pronunciation of basic words",
      ],
      iconColor: colors.primaryLight,
    },
    {
      id: 2,
      title: "Restaurant & Food",
      category: "Beginner",
      description: "Order food and drinks at restaurants",
      duration: "15-20 minutes",
      sentences: [
        "I would like to order a coffee",
        "Can I see the menu please?",
        "How much does this cost?",
        "The food is delicious",
        "Can I have the bill please?",
      ],
      color: colors.secondary,
      icon: "M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z",
      topics: ["Ordering", "Menu Items", "Paying"],
      learningTips: [
        "Learn food vocabulary categories",
        "Practice polite requests",
        "Master numbers for prices",
      ],
      iconColor: colors.secondaryLight,
    },
    {
      id: 3,
      title: "Travel & Directions",
      category: "Intermediate",
      description: "Ask for directions and travel information",
      duration: "20-25 minutes",
      sentences: [
        "Where is the nearest bus station?",
        "How do I get to the city center?",
        "What time does the train leave?",
        "Is this seat taken?",
        "Can you help me with my luggage?",
      ],
      color: colors.accent,
      icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
      topics: ["Directions", "Transportation", "Time"],
      learningTips: [
        "Learn prepositions of place and direction",
        "Practice asking for and giving directions",
        "Master time expressions",
      ],
      iconColor: colors.accentLight,
    },
    {
      id: 4,
      title: "Shopping",
      category: "Intermediate",
      description: "Practice shopping conversations",
      duration: "15-20 minutes",
      sentences: [
        "How much does this shirt cost?",
        "Do you have this in a different size?",
        "Can I try this on?",
        "Is there a discount available?",
        "I will take this one",
      ],
      color: colors.info,
      icon: "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z",
      topics: ["Prices", "Sizes", "Bargaining"],
      learningTips: [
        "Learn clothing and size vocabulary",
        "Practice comparative adjectives",
        "Master money-related expressions",
      ],
      iconColor: colors.infoLight,
    },
    {
      id: 5,
      title: "Job Interviews",
      category: "Advanced",
      description: "Practice common interview questions",
      duration: "25-30 minutes",
      sentences: [
        "Tell me about yourself",
        "What are your strengths?",
        "Why do you want this job?",
        "Where do you see yourself in five years?",
        "What are your salary expectations?",
      ],
      color: colors.primaryDark,
      icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
      topics: ["Self-introduction", "Strengths", "Career Goals"],
      learningTips: [
        "Practice self-introduction structure",
        "Learn professional vocabulary",
        "Master present perfect tense for experience",
      ],
      iconColor: colors.primaryLighter,
    },
    {
      id: 6,
      title: "Business Meetings",
      category: "Advanced",
      description: "Participate in professional discussions",
      duration: "30-35 minutes",
      sentences: [
        "Let me present the quarterly results",
        "What are your thoughts on this proposal?",
        "We need to consider all options",
        "Can we schedule a follow-up meeting?",
        "Thank you for your contribution",
      ],
      color: colors.secondaryDark,
      icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
      topics: ["Presentations", "Discussions", "Planning"],
      learningTips: [
        "Learn business vocabulary and jargon",
        "Practice formal expressions",
        "Master passive voice for reports",
      ],
      iconColor: colors.secondaryLighter,
    },
  ];

  // Comprehensive Learning Resources Data
  const resources = {
    grammar: [
      {
        id: 1,
        title: "Present Simple Tense",
        description: "Learn to talk about daily routines and facts",
        difficulty: "Beginner",
        duration: "15 minutes",
        points: 25,
        completed: false,
        color: colors.primary,
        content: {
          overview:
            "The present simple tense is used for habits, routines, and general truths.",
          sections: [
            {
              title: "Usage",
              points: [
                "Habits and routines: I wake up at 7 AM every day.",
                "General truths: The sun rises in the east.",
                "Permanent situations: She works in a bank.",
                "Timetables and schedules: The train leaves at 9 PM.",
              ],
            },
            {
              title: "Formation",
              points: [
                "Positive: Subject + base verb (add 's' for he/she/it): I work, He works",
                "Negative: Subject + do/does + not + base verb: I don't like, She doesn't eat",
                "Questions: Do/Does + subject + base verb: Do you speak English?",
              ],
            },
            {
              title: "Examples",
              points: [
                "I study English every day.",
                "She teaches mathematics at school.",
                "They don't watch TV in the morning.",
                "Do you play football on weekends?",
              ],
            },
            {
              title: "Common Adverbs",
              points: [
                "Always, usually, often",
                "Sometimes, rarely, never",
                "Every day/week/month",
                "On Mondays, in the morning",
              ],
            },
          ],
          exercises: [
            {
              question:
                "Complete the sentence: She _____ (work) in a hospital.",
              answer: "works",
              explanation: "Third person singular takes 's'",
            },
            {
              question: "Make this negative: I like coffee.",
              answer: "I don't like coffee.",
              explanation: "Use 'do not' for negative",
            },
            {
              question: "Form a question: you / speak / French",
              answer: "Do you speak French?",
              explanation: "Use 'Do' for questions with 'you'",
            },
          ],
          practice: [
            "Describe your daily routine using present simple",
            "Talk about your family members' jobs",
            "Discuss your weekly schedule",
          ],
        },
      },
      {
        id: 2,
        title: "Past Simple Tense",
        description: "Talk about completed past actions",
        difficulty: "Beginner",
        duration: "20 minutes",
        points: 25,
        completed: false,
        color: colors.primaryLight,
        content: {
          overview:
            "The past simple tense is used for completed actions at specific times in the past.",
          sections: [
            {
              title: "Usage",
              points: [
                "Completed actions: I visited London last year.",
                "Series of completed actions: I woke up, showered, and went to work.",
                "Past habits: When I was young, I played football every day.",
                "Past facts: She lived in Paris for five years.",
              ],
            },
            {
              title: "Formation",
              points: [
                "Regular verbs: Verb + ed (worked, played, studied)",
                "Irregular verbs: Special forms (go → went, see → saw, eat → ate)",
                "Negative: Subject + did + not + base verb",
                "Questions: Did + subject + base verb",
              ],
            },
            {
              title: "Time Expressions",
              points: [
                "Yesterday, last week/month/year",
                "Two days ago, in 2020",
                "When I was a child",
                "At 5 PM yesterday",
              ],
            },
            {
              title: "Common Irregular Verbs",
              points: [
                "Be → was/were",
                "Have → had",
                "Do → did",
                "Go → went",
                "See → saw",
                "Take → took",
              ],
            },
          ],
          exercises: [
            {
              question: "Complete: I _____ (go) to the cinema yesterday.",
              answer: "went",
              explanation: "'Go' is irregular in past simple",
            },
            {
              question: "Make negative: They finished the project.",
              answer: "They didn't finish the project.",
              explanation: "Use 'did not' for negative",
            },
            {
              question: "Form a question: she / buy / the dress",
              answer: "Did she buy the dress?",
              explanation: "Use 'Did' for past simple questions",
            },
          ],
          practice: [
            "Describe what you did last weekend",
            "Talk about your last vacation",
            "Share an important memory from childhood",
          ],
        },
      },
      {
        id: 3,
        title: "Present Continuous",
        description: "Talk about actions happening now",
        difficulty: "Beginner",
        duration: "15 minutes",
        points: 25,
        completed: false,
        color: colors.primary,
        content: {
          overview:
            "The present continuous tense is used for actions happening now or temporary situations.",
          sections: [
            {
              title: "Usage",
              points: [
                "Actions happening now: I am studying English now.",
                "Temporary situations: She is staying with friends this week.",
                "Future arrangements: We are meeting tomorrow.",
                "Changing situations: The weather is getting better.",
              ],
            },
            {
              title: "Formation",
              points: [
                "Positive: am/is/are + verb + ing",
                "Negative: am/is/are + not + verb + ing",
                "Questions: am/is/are + subject + verb + ing",
              ],
            },
            {
              title: "Spelling Rules",
              points: [
                "Most verbs: add 'ing' (work → working)",
                "Verbs ending in e: remove e, add 'ing' (make → making)",
                "One-syllable verbs with consonant-vowel-consonant: double last letter (run → running)",
              ],
            },
            {
              title: "Time Expressions",
              points: [
                "Now, at the moment",
                "Currently, right now",
                "Today, this week",
                "Look! Listen!",
              ],
            },
          ],
          exercises: [
            {
              question: "Complete: They _____ (watch) TV right now.",
              answer: "are watching",
              explanation: "Present continuous for actions now",
            },
            {
              question: "Correct: She is make a cake.",
              answer: "She is making a cake.",
              explanation: "Make → making (remove e)",
            },
            {
              question: "Make negative: I am working today.",
              answer: "I am not working today.",
              explanation: "Add 'not' after 'am'",
            },
          ],
          practice: [
            "Describe what people around you are doing",
            "Talk about your current projects",
            "Discuss your plans for this week",
          ],
        },
      },
    ],
    pronunciation: [
      {
        id: 4,
        title: "Vowel Sounds",
        description: "Master English vowel sounds",
        difficulty: "Beginner",
        duration: "20 minutes",
        points: 25,
        completed: false,
        color: colors.accent,
        content: {
          overview:
            "English has 12 pure vowel sounds. Mastering them is essential for clear pronunciation.",
          sections: [
            {
              title: "Short Vowels",
              points: [
                "/æ/ as in cat, hat, man",
                "/ɛ/ as in bed, red, said",
                "/ɪ/ as in sit, hit, fish",
                "/ɒ/ as in hot, dog, stop",
                "/ʌ/ as in cup, sun, money",
              ],
            },
            {
              title: "Long Vowels",
              points: [
                "/iː/ as in see, tree, cheese",
                "/ɑː/ as in car, star, father",
                "/ɔː/ as in door, four, ball",
                "/uː/ as in blue, shoe, food",
                "/ɜː/ as in bird, work, learn",
              ],
            },
            {
              title: "Diphthongs",
              points: [
                "/eɪ/ as in day, say, wait",
                "/aɪ/ as in my, eye, time",
                "/ɔɪ/ as in boy, toy, oil",
                "/aʊ/ as in now, cow, house",
                "/oʊ/ as in go, no, boat",
              ],
            },
            {
              title: "Practice Tips",
              points: [
                "Use minimal pairs: ship/sheep, cat/cut",
                "Record yourself and compare",
                "Use tongue twisters",
                "Watch mouth position in videos",
              ],
            },
          ],
          exercises: [
            {
              question: "Practice: say 'ship' and 'sheep' 10 times each",
              answer: "",
              explanation: "Focus on the vowel length difference",
            },
            {
              question: "Practice: 'How now brown cow'",
              answer: "",
              explanation: "Practice the /aʊ/ sound",
            },
            {
              question: "Practice: 'She sells sea shells'",
              answer: "",
              explanation: "Practice /iː/ and /ɛ/ sounds",
            },
          ],
          practice: [
            "Read paragraphs focusing on vowel sounds",
            "Record yourself reading",
            "Practice with minimal pairs daily",
          ],
        },
      },
      {
        id: 5,
        title: "Consonant Clusters",
        description: "Pronounce difficult combinations",
        difficulty: "Intermediate",
        duration: "25 minutes",
        points: 30,
        completed: false,
        color: colors.accentLight,
        content: {
          overview:
            "Consonant clusters are groups of consonants without vowels between them.",
          sections: [
            {
              title: "Initial Clusters",
              points: [
                "st-: stop, stand, story",
                "sp-: speak, sport, special",
                "sk-: school, sky, skill",
                "pl-: play, please, place",
                "pr-: price, proud, practice",
              ],
            },
            {
              title: "Final Clusters",
              points: [
                "-st: first, best, last",
                "-sk: ask, desk, risk",
                "-kt: act, fact, product",
                "-nd: and, end, friend",
                "-mp: camp, jump, lamp",
              ],
            },
            {
              title: "Three-Consonant Clusters",
              points: [
                "str-: street, strong, strange",
                "spr-: spring, spread, spray",
                "skr-: scream, scratch, screen",
                "spl-: splash, split, splendid",
              ],
            },
            {
              title: "Practice Techniques",
              points: [
                "Break clusters into syllables",
                "Practice slowly, then speed up",
                "Use mirror to check mouth position",
                "Repeat difficult words 10 times",
              ],
            },
          ],
          exercises: [
            {
              question: "Practice: 'street' → 's-treet' → 'street'",
              answer: "",
              explanation: "Break and rebuild the cluster",
            },
            {
              question: "Practice: 'asks' /æsks/",
              answer: "",
              explanation: "Three consonants at the end",
            },
            {
              question: "Practice: 'splash', 'spring', 'street'",
              answer: "",
              explanation: "Three-consonant clusters",
            },
          ],
          practice: [
            "Practice tongue twisters with clusters",
            "Read technical words aloud",
            "Record and analyze difficult words",
          ],
        },
      },
    ],
    vocabulary: [
      {
        id: 6,
        title: "Everyday Objects",
        description: "Names of common household items",
        difficulty: "Beginner",
        duration: "15 minutes",
        points: 20,
        completed: false,
        color: colors.primary,
        content: {
          overview:
            "Learn essential vocabulary for objects you encounter daily.",
          sections: [
            {
              title: "Kitchen Items",
              points: [
                "Refrigerator, microwave, oven",
                "Stove, sink, faucet",
                "Knife, fork, spoon, plate",
                "Cup, glass, bowl, mug",
                "Pan, pot, kettle, toaster",
              ],
            },
            {
              title: "Living Room",
              points: [
                "Sofa, armchair, coffee table",
                "Television, remote control",
                "Lamp, light switch, curtains",
                "Bookshelf, carpet, painting",
                "Clock, cushion, rug",
              ],
            },
            {
              title: "Bedroom",
              points: [
                "Bed, mattress, pillow",
                "Blanket, sheet, duvet",
                "Wardrobe, dresser, mirror",
                "Nightstand, alarm clock",
                "Hanger, laundry basket",
              ],
            },
            {
              title: "Bathroom",
              points: [
                "Toilet, sink, bathtub",
                "Shower, showerhead, towel",
                "Soap, shampoo, conditioner",
                "Toothbrush, toothpaste",
                "Mirror, toilet paper",
              ],
            },
          ],
          exercises: [
            {
              question: "What do you use to cook food on?",
              answer: "Stove",
              explanation: "Stove is for cooking",
            },
            {
              question: "Where do you hang your clothes?",
              answer: "Wardrobe",
              explanation: "Wardrobe is for clothes storage",
            },
            {
              question: "What do you use to brush your teeth?",
              answer: "Toothbrush and toothpaste",
              explanation: "For dental hygiene",
            },
          ],
          practice: [
            "Label items in your home",
            "Describe your room in detail",
            "Create a shopping list in English",
          ],
        },
      },
      {
        id: 7,
        title: "Food & Drinks",
        description: "Expand food vocabulary",
        difficulty: "Beginner",
        duration: "20 minutes",
        points: 25,
        completed: false,
        color: colors.secondary,
        content: {
          overview: "Essential vocabulary for food, drinks, and dining.",
          sections: [
            {
              title: "Fruits",
              points: [
                "Apple, banana, orange",
                "Grapes, strawberry, blueberry",
                "Watermelon, pineapple, mango",
                "Lemon, lime, grapefruit",
                "Peach, pear, plum",
              ],
            },
            {
              title: "Vegetables",
              points: [
                "Carrot, potato, tomato",
                "Onion, garlic, lettuce",
                "Cucumber, pepper, broccoli",
                "Spinach, cabbage, mushroom",
                "Corn, peas, beans",
              ],
            },
            {
              title: "Meats & Proteins",
              points: [
                "Chicken, beef, pork",
                "Fish, salmon, tuna",
                "Egg, cheese, yogurt",
                "Tofu, beans, lentils",
                "Bacon, sausage, ham",
              ],
            },
            {
              title: "Drinks",
              points: [
                "Water, coffee, tea",
                "Juice, soda, milk",
                "Wine, beer, cocktail",
                "Smoothie, shake, lemonade",
                "Hot chocolate, herbal tea",
              ],
            },
          ],
          exercises: [
            {
              question: "Name three red fruits",
              answer: "Apple, strawberry, watermelon",
              explanation: "These fruits are commonly red",
            },
            {
              question: "What vegetable makes you cry?",
              answer: "Onion",
              explanation: "Onions release chemicals that irritate eyes",
            },
            {
              question: "Name three dairy products",
              answer: "Milk, cheese, yogurt",
              explanation: "Products made from milk",
            },
          ],
          practice: [
            "Plan a meal in English",
            "Describe your favorite food",
            "Order food in a restaurant scenario",
          ],
        },
      },
    ],
  };

  // Daily Challenges - Fixed to not be completed by default
  const [dailyChallenges, setDailyChallenges] = useState([
    {
      id: 1,
      title: "Complete 1 conversation practice",
      description: "Practice speaking for at least 5 minutes",
      points: 50,
      completed: false,
      color: colors.primary,
      progress: 0,
      total: 1,
      type: "conversation",
    },
    {
      id: 2,
      title: "Learn 5 new vocabulary words",
      description: "Study and memorize new words",
      points: 40,
      completed: false,
      color: colors.secondary,
      progress: 0,
      total: 5,
      type: "vocabulary",
    },
    {
      id: 3,
      title: "Practice pronunciation for 3 minutes",
      description: "Work on your accent and pronunciation",
      points: 30,
      completed: false,
      color: colors.accent,
      progress: 0,
      total: 3,
      type: "pronunciation",
    },
    {
      id: 4,
      title: "Complete 1 grammar lesson",
      description: "Study one grammar topic thoroughly",
      points: 35,
      completed: false,
      color: colors.info,
      progress: 0,
      total: 1,
      type: "grammar",
    },
  ]);

  // Recent Activities
  const [recentActivities, setRecentActivities] = useState([]);

  // Load user data
  useEffect(() => {
    const savedData = localStorage.getItem("englishLearningData");
    const savedActivities = localStorage.getItem("recentActivities");
    const savedChallenges = localStorage.getItem("dailyChallenges");
    const savedLessons = localStorage.getItem("completedLessons");

    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setUser(parsedData);
    }

    if (savedActivities) {
      setRecentActivities(JSON.parse(savedActivities));
    }

    if (savedChallenges) {
      setDailyChallenges(JSON.parse(savedChallenges));
    }

    if (savedLessons) {
      setCompletedLessons(JSON.parse(savedLessons));
    }

    setConversation([
      {
        id: 1,
        role: "ai",
        text: "Welcome to your English learning journey! I'm here to help you improve your English skills. Let's start by choosing a practice scenario.",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);

    // Check for speech synthesis support
    if (!window.speechSynthesis) {
      console.warn("Speech synthesis not supported in this browser");
    }
  }, []);

  // Save user data
  useEffect(() => {
    localStorage.setItem("englishLearningData", JSON.stringify(user));
    localStorage.setItem("recentActivities", JSON.stringify(recentActivities));
    localStorage.setItem("dailyChallenges", JSON.stringify(dailyChallenges));
    localStorage.setItem("completedLessons", JSON.stringify(completedLessons));
  }, [user, recentActivities, dailyChallenges, completedLessons]);

  // Handle scroll for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Scroll to bottom of conversation
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversation]);

  // Initialize speech synthesis
  useEffect(() => {
    speechSynthesisRef.current = window.speechSynthesis;
    return () => {
      if (speechSynthesisRef.current) {
        speechSynthesisRef.current.cancel();
      }
    };
  }, []);

  // Sidebar Component - Fixed for Mobile
  const Sidebar = () => (
    <>
      {/* Mobile Overlay - Fixed */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-40 h-screen transition-all duration-300 ease-in-out
          ${isSidebarOpen ? "w-64" : "w-0"} 
          ${mobileMenuOpen ? "w-64" : ""}
          bg-white border-r border-gray-200 overflow-hidden
          lg:block
        `}
      >
        <div className="h-full flex flex-col">
          {/* Logo Section */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                  style={{ backgroundColor: colors.primary }}
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path
                      fillRule="evenodd"
                      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">
                    English Pro
                  </h1>
                  <p className="text-sm text-gray-500">Learning Platform</p>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="lg:hidden text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto">
            <nav className="p-4 space-y-1">
              {[
                {
                  id: "dashboard",
                  label: "Dashboard",
                  icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
                },
                {
                  id: "practice",
                  label: "Practice",
                  icon: "M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z",
                },
                {
                  id: "resources",
                  label: "Resources",
                  icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
                },
                {
                  id: "progress",
                  label: "Progress",
                  icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
                },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id !== "practice") resetPractice();
                    setActivePage(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`
                    w-full flex items-center space-x-3 p-3 rounded-lg transition-all
                    ${
                      activePage === item.id
                        ? "text-white"
                        : "text-gray-600 hover:bg-gray-50"
                    }
                  `}
                  style={{
                    backgroundColor:
                      activePage === item.id ? colors.primary : "transparent",
                  }}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={item.icon}
                    />
                  </svg>
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>

            {/* Progress Section */}
            <div className="mt-8 px-4">
              <h3 className="text-xs font-semibold text-gray-500 mb-4 uppercase tracking-wider">
                Progress Overview
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">
                      Level {user.level}
                    </span>
                    <span
                      className="text-sm font-medium"
                      style={{ color: colors.primary }}
                    >
                      {user.levelProgress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${user.levelProgress}%`,
                        backgroundColor: colors.primary,
                      }}
                    ></div>
                  </div>
                </div>

                <div
                  className="rounded-lg p-4"
                  style={{ backgroundColor: colors.gray50 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div
                        className="text-lg font-bold"
                        style={{ color: colors.primary }}
                      >
                        {user.points}
                      </div>
                      <div className="text-sm text-gray-500">Points</div>
                    </div>
                    <div style={{ color: colors.accent }}>
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* User Profile */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold"
                style={{ backgroundColor: user.avatarColor }}
              >
                {user.name.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-sm text-gray-500">
                  Level {user.level} Learner
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );

  // Fixed Header Component
  const Header = () => (
    <header
      className={`
        bg-white border-b border-gray-200 fixed top-0 z-30 
        transition-all duration-300 ease-in-out
        ${isSidebarOpen ? "left-0 lg:left-64" : "left-0"}
        right-0
        ${isScrolled ? "shadow-sm" : ""}
      `}
    >
      <div className="px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-gray-600 hover:text-gray-900"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    mobileMenuOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>

            {/* Page Title */}
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {activePage === "dashboard" && "Dashboard"}
                {activePage === "practice" && "Practice Sessions"}
                {activePage === "resources" && "Learning Resources"}
                {activePage === "progress" && "Progress Tracking"}
              </h2>
              <p className="text-sm text-gray-600">
                {activePage === "dashboard" &&
                  "Overview of your learning journey"}
                {activePage === "practice" &&
                  "Practice real conversations with AI"}
                {activePage === "resources" &&
                  "Comprehensive learning materials"}
                {activePage === "progress" &&
                  "Track your improvement and achievements"}
              </p>
            </div>
          </div>

          {/* User Info and Actions */}
          <div className="flex items-center space-x-4">
            {/* Points Display */}
            <div
              className="hidden md:flex items-center space-x-2 px-3 py-2 rounded-lg"
              style={{ backgroundColor: colors.gray50 }}
            >
              <span style={{ color: colors.primary }} className="font-bold">
                {user.points}
              </span>
              <span className="text-sm text-gray-600">Points</span>
            </div>

            {/* Streak Display */}
            <div
              className="hidden sm:flex items-center space-x-2 px-3 py-2 rounded-lg"
              style={{ backgroundColor: colors.gray50 }}
            >
              <span style={{ color: colors.accent }} className="font-bold">
                {user.streak}
              </span>
              <span className="text-sm text-gray-600">Day Streak</span>
            </div>

            {/* User Profile */}
            <div className="flex items-center space-x-3">
              <div className="hidden md:block text-right">
                <div className="text-sm font-medium text-gray-900">
                  {user.name}
                </div>
                <div className="text-sm text-gray-600">Level {user.level}</div>
              </div>
              <div className="relative">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold"
                  style={{ backgroundColor: user.avatarColor }}
                >
                  {user.name.charAt(0)}
                </div>
                <div
                  className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white"
                  style={{ backgroundColor: colors.success }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );

  // Main Content Wrapper
  const MainContent = () => (
    <div
      className={`
        min-h-screen transition-all duration-300 ease-in-out
        ${isSidebarOpen ? "pt-20 lg:ml-64" : "pt-20"}
      `}
      style={{ backgroundColor: colors.background }}
    >
      <div className="p-4 lg:p-6">{renderContent()}</div>
    </div>
  );

  // Add activity
  const addActivity = (action, description, points = 0, type = "activity") => {
    const newActivity = {
      id: recentActivities.length + 1,
      action,
      description,
      time: "Just now",
      points,
      type,
    };
    setRecentActivities((prev) => [newActivity, ...prev.slice(0, 5)]);
  };

  // Update challenge progress
  const updateChallengeProgress = (challengeId, progress) => {
    setDailyChallenges((prev) =>
      prev.map((challenge) =>
        challenge.id === challengeId
          ? {
              ...challenge,
              progress: Math.min(challenge.total, progress),
              completed: Math.min(challenge.total, progress) >= challenge.total,
            }
          : challenge
      )
    );
  };

  // Complete challenge manually
  const completeChallenge = (challengeId) => {
    const challenge = dailyChallenges.find((c) => c.id === challengeId);
    if (!challenge) return;

    // Only complete if progress is at least 80%
    if (challenge.progress >= challenge.total * 0.8) {
      setDailyChallenges((prev) =>
        prev.map((c) =>
          c.id === challengeId
            ? { ...c, completed: true, progress: c.total }
            : c
        )
      );

      setUser((prev) => ({
        ...prev,
        points: prev.points + challenge.points,
        dailyGoalProgress: prev.dailyGoalProgress + 1,
      }));

      addActivity(
        `Completed challenge: ${challenge.title}`,
        challenge.description,
        challenge.points,
        "challenge"
      );

      // Add notification
      setNotifications((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: `Challenge completed! +${challenge.points} points`,
          type: "success",
          read: false,
        },
      ]);
    } else {
      // Add notification that challenge is not ready to complete
      setNotifications((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: `Complete ${challenge.total - challenge.progress} more ${
            challenge.type
          } to finish this challenge`,
          type: "info",
          read: false,
        },
      ]);
    }
  };

  // Start conversation with selected scenario
  const startConversation = (scenario) => {
    setSelectedScenario(scenario);
    setConversation([
      {
        id: 1,
        role: "ai",
        text: `Welcome to ${scenario.title} practice session. I'll help you improve your English conversation skills. Let's begin with some basic conversation practice.`,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
      {
        id: 2,
        role: "ai",
        text: `Learning tip: ${scenario.learningTips[0]}. Now, please introduce yourself to start the conversation.`,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
    conversationHistoryRef.current = [];
    setShowSummary(false);
    setMessageCount(0);
    setActiveTab("conversation");
    setPronunciationSentences(scenario.sentences);
    setCurrentPronunciationIndex(0);
    setPronunciationResults([]);
    setCurrentStatus("Ready to speak - Click 'Start Speaking' to begin");
    setActivePage("practice");
    isMicrophoneManuallyStopped.current = false;
    addActivity(
      `Started ${scenario.title} practice session`,
      scenario.description,
      0,
      "practice"
    );
  };

  // Stop microphone completely
  const stopMicrophone = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.log("Already stopped");
      }
    }
    setIsListening(false);
    setCurrentStatus("Microphone stopped");
  };

  // Start listening
  const startListening = () => {
    isMicrophoneManuallyStopped.current = false;

    if (speechSynthesisRef.current && speechSynthesisRef.current.speaking) {
      speechSynthesisRef.current.cancel();
      setIsSpeaking(false);
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(
        "Speech recognition is not supported in this browser. Please use Chrome or Edge."
      );
      return;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.log("Stopping existing recognition");
      }
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = "en-US";
    recognitionRef.current.maxAlternatives = 1;

    recognitionRef.current.onstart = () => {
      setIsListening(true);
      setCurrentStatus("Listening... Speak now");
    };

    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      processUserSpeech(transcript);
    };

    recognitionRef.current.onerror = (event) => {
      console.error("Speech recognition error:", event.error);

      if (event.error === "no-speech") {
        setCurrentStatus("No speech detected. Try again.");
      } else if (event.error === "audio-capture") {
        setCurrentStatus("No microphone found.");
      } else if (event.error === "not-allowed") {
        setCurrentStatus("Microphone access denied.");
      }

      setIsListening(false);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    try {
      recognitionRef.current.start();
    } catch (error) {
      console.error("Failed to start recognition:", error);
      setCurrentStatus("Failed to start microphone.");
      setIsListening(false);
    }
  };

  // Process user speech
  const processUserSpeech = async (transcript) => {
    const userMessage = {
      id: conversation.length + 1,
      role: "user",
      text: transcript,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setConversation((prev) => [...prev, userMessage]);
    conversationHistoryRef.current.push(userMessage);
    setMessageCount((prev) => prev + 1);

    setCurrentStatus("AI is thinking...");
    setIsThinking(true);

    await getAIResponse(transcript);

    setIsThinking(false);

    const pointsGained = 10;
    setUser((prev) => {
      const newPoints = prev.points + pointsGained;
      const newLevel = Math.floor(newPoints / 500) + 1;
      const newLevelProgress = (newPoints % 500) / 5;

      return {
        ...prev,
        points: newPoints,
        level: newLevel,
        levelProgress: newLevelProgress,
        sessionsCompleted: prev.sessionsCompleted + 1,
        accuracyRate: Math.min(100, prev.accuracyRate + 0.5),
        totalPracticeHours: prev.totalPracticeHours + 0.1,
      };
    });

    setLearningProgress((prev) => ({
      ...prev,
      speaking: Math.min(100, prev.speaking + 2),
      fluency: Math.min(100, prev.fluency + 1),
      listening: Math.min(100, prev.listening + 1),
    }));

    // Update conversation challenge progress
    updateChallengeProgress(1, messageCount + 1);
  };

  // Stop listening manually
  const stopListening = () => {
    isMicrophoneManuallyStopped.current = true;
    stopMicrophone();
  };

  // Get AI response
  const getAIResponse = async (userText) => {
    try {
      const messages = [
        {
          role: "system",
          content: `You are an expert English teacher focused on FAST and SIMPLE learning. 
          Keep responses SHORT (1-2 sentences max). 
          Always include ONE teaching point (grammar/vocabulary/pronunciation). 
          Correct ONE mistake if present. 
          Use simple vocabulary. 
          Focus on PRACTICAL English.`,
        },
        ...conversationHistoryRef.current.slice(-3).map((msg) => ({
          role: msg.role === "user" ? "user" : "assistant",
          content: msg.text,
        })),
        {
          role: "user",
          content: userText,
        },
      ];

      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${GROQ_API_KEY}`,
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: messages,
            temperature: 0.7,
            max_tokens: 80,
          }),
        }
      );

      const data = await response.json();
      let aiText =
        data.choices[0]?.message?.content || "Good! Let's continue practicing.";

      if (aiText.length > 120) {
        aiText = aiText.substring(0, 120) + "...";
      }

      const aiMessage = {
        id: conversation.length + 1,
        role: "ai",
        text: aiText,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setConversation((prev) => [...prev, aiMessage]);
      conversationHistoryRef.current.push(aiMessage);

      if (aiVoiceEnabled) {
        speakAI(aiText);
      } else {
        setCurrentStatus("Ready for response");
      }
    } catch (error) {
      console.error("Error getting AI response:", error);
      const fallback = "Interesting! Could you say more about that?";
      const aiMessage = {
        id: conversation.length + 1,
        role: "ai",
        text: fallback,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setConversation((prev) => [...prev, aiMessage]);

      if (aiVoiceEnabled) {
        speakAI(fallback);
      }
    }
  };

  // Enhanced text-to-speech with voice isolation
  const speakAI = (text) => {
    if (!speechSynthesisRef.current || !aiVoiceEnabled) return;

    stopMicrophone();

    setIsSpeaking(true);
    setCurrentStatus("AI is speaking...");

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setCurrentStatus("AI is speaking...");
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setCurrentStatus("Ready to speak");

      if (!isMicrophoneManuallyStopped.current && selectedScenario) {
        setTimeout(() => {
          startListening();
        }, 500);
      }
    };

    utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event);
      setIsSpeaking(false);
      setCurrentStatus("Ready to speak");
    };

    setTimeout(() => {
      try {
        speechSynthesisRef.current.speak(utterance);
      } catch (error) {
        console.error("Failed to speak:", error);
        setIsSpeaking(false);
        setCurrentStatus("Ready to speak");
      }
    }, 100);
  };

  // Toggle AI voice
  const toggleAiVoice = () => {
    setAiVoiceEnabled(!aiVoiceEnabled);
    if (speechSynthesisRef.current && speechSynthesisRef.current.speaking) {
      speechSynthesisRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  // Pronunciation practice
  const startPronunciationPractice = (sentence, index) => {
    setCurrentPronunciationIndex(index);

    if (speechSynthesisRef.current && speechSynthesisRef.current.speaking) {
      speechSynthesisRef.current.cancel();
      setIsSpeaking(false);
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported");
      return;
    }

    pronunciationRecognitionRef.current = new SpeechRecognition();
    pronunciationRecognitionRef.current.continuous = false;
    pronunciationRecognitionRef.current.interimResults = false;
    pronunciationRecognitionRef.current.lang = "en-US";
    pronunciationRecognitionRef.current.maxAlternatives = 3;

    setIsRecordingPronunciation(true);
    setCurrentStatus("Recording pronunciation...");

    pronunciationRecognitionRef.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      const confidence = event.results[0][0].confidence;

      const result = analyzePronunciation(sentence, transcript, confidence);

      setPronunciationResults((prev) => {
        const newResults = [...prev];
        newResults[index] = result;
        return newResults;
      });

      setIsRecordingPronunciation(false);

      const pointsGained = Math.round(result.score / 10);
      setUser((prev) => {
        const newPoints = prev.points + pointsGained;
        const newLevel = Math.floor(newPoints / 500) + 1;
        const newLevelProgress = (newPoints % 500) / 5;

        return {
          ...prev,
          points: newPoints,
          level: newLevel,
          levelProgress: newLevelProgress,
          totalPracticeHours: prev.totalPracticeHours + 0.05,
        };
      });

      setLearningProgress((prev) => ({
        ...prev,
        pronunciation: Math.min(
          100,
          prev.pronunciation + (result.score > 70 ? 3 : 1)
        ),
      }));

      setCurrentStatus("Pronunciation analyzed!");

      // Update pronunciation challenge progress
      const currentProgress = dailyChallenges[2].progress + 1;
      updateChallengeProgress(3, currentProgress);
    };

    pronunciationRecognitionRef.current.onerror = () => {
      setIsRecordingPronunciation(false);
      setCurrentStatus("Recording failed. Try again.");
    };

    pronunciationRecognitionRef.current.onend = () => {
      setIsRecordingPronunciation(false);
    };

    pronunciationRecognitionRef.current.start();
  };

  const analyzePronunciation = (expected, spoken, confidence) => {
    const similarity = calculateSimilarity(
      expected.toLowerCase(),
      spoken.toLowerCase()
    );
    const score = Math.round(similarity * 100);

    let feedback = "";
    let status = "excellent";

    if (score >= 90) {
      feedback = "Perfect pronunciation! Excellent work!";
      status = "excellent";
    } else if (score >= 75) {
      feedback = "Very good! Just minor improvements needed.";
      status = "good";
    } else if (score >= 60) {
      feedback = "Good effort! Practice this a few more times.";
      status = "fair";
    } else {
      feedback = "Keep practicing! Focus on each word.";
      status = "needs-practice";
    }

    return {
      expected,
      spoken,
      score,
      feedback,
      status,
      confidence: Math.round(confidence * 100),
    };
  };

  const calculateSimilarity = (str1, str2) => {
    const words1 = str1.toLowerCase().split(" ");
    const words2 = str2.toLowerCase().split(" ");

    let matches = 0;
    words1.forEach((word1) => {
      if (
        words2.some((word2) => word2.includes(word1) || word1.includes(word2))
      ) {
        matches++;
      }
    });

    return matches / Math.max(words1.length, words2.length);
  };

  // Complete a lesson
  const completeLesson = (lessonId, category) => {
    const lesson = resources[category].find((l) => l.id === lessonId);
    if (!lesson || completedLessons.includes(lessonId)) return false;

    setCompletedLessons((prev) => [...prev, lessonId]);

    setUser((prev) => {
      const newPoints = prev.points + lesson.points;
      const newLevel = Math.floor(newPoints / 500) + 1;
      const newLevelProgress = (newPoints % 500) / 5;

      return {
        ...prev,
        points: newPoints,
        level: newLevel,
        levelProgress: newLevelProgress,
        sessionsCompleted: prev.sessionsCompleted + 1,
        totalPracticeHours: prev.totalPracticeHours + 0.2,
      };
    });

    setLearningProgress((prev) => ({
      ...prev,
      [category]: Math.min(100, prev[category] + 10),
    }));

    // Update grammar challenge progress
    updateChallengeProgress(4, 1);

    addActivity(
      `Completed lesson: ${lesson.title}`,
      lesson.description,
      lesson.points,
      "lesson"
    );
    return true;
  };

  // View lesson content
  const viewLessonContent = (lesson) => {
    setCurrentLessonContent(lesson);
  };

  // Close lesson content
  const closeLessonContent = () => {
    setCurrentLessonContent(null);
  };

  // Update lesson progress
  const updateLessonProgress = (lessonId, progress) => {
    setLessonProgress((prev) => ({
      ...prev,
      [lessonId]: progress,
    }));
  };

  // End session
  const endSession = () => {
    stopMicrophone();
    if (isSpeaking) {
      speechSynthesisRef.current.cancel();
      setIsSpeaking(false);
    }

    generateSessionSummary();
  };

  const generateSessionSummary = () => {
    const pronunciationScore =
      pronunciationResults.length > 0
        ? Math.round(
            pronunciationResults.reduce(
              (acc, result) => acc + (result?.score || 0),
              0
            ) / pronunciationResults.length
          )
        : 0;

    const conversationScore = Math.min(100, Math.floor(messageCount * 4 + 60));
    const finalScore = Math.round((pronunciationScore + conversationScore) / 2);

    const summary = {
      score: finalScore,
      level:
        finalScore >= 85
          ? "Advanced"
          : finalScore >= 70
          ? "Intermediate"
          : "Beginner",
      strengths: [
        `${messageCount} conversation exchanges completed`,
        pronunciationScore >= 70
          ? "Good pronunciation accuracy"
          : "Good conversation flow",
        "Active participation in practice",
        `Earned ${messageCount * 10} points`,
      ],
      suggestions: [
        "Practice daily for 15 minutes",
        "Review new vocabulary weekly",
        "Try different scenarios to expand skills",
        "Use pronunciation exercises regularly",
      ],
      feedback: `Great work! You completed ${messageCount} conversation exchanges and ${pronunciationResults.length} pronunciation exercises.`,
      totalPoints: messageCount * 10,
    };

    setSessionSummary(summary);
    setShowSummary(true);

    const lastPracticeDate = localStorage.getItem("lastPracticeDate");
    const today = new Date().toDateString();
    if (lastPracticeDate !== today) {
      setUser((prev) => ({ ...prev, streak: prev.streak + 1 }));
      localStorage.setItem("lastPracticeDate", today);
      addActivity(
        "Maintained daily streak",
        "Practice for consecutive days",
        25,
        "streak"
      );
    }

    addActivity(
      `Completed ${selectedScenario?.title} practice session`,
      `Scored ${finalScore}/100 points`,
      messageCount * 10,
      "practice"
    );
  };

  // Reset practice
  const resetPractice = () => {
    setSelectedScenario(null);
    setShowSummary(false);
    setConversation([
      {
        id: 1,
        role: "ai",
        text: "Welcome back! Choose a practice scenario to continue learning.",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
    setCurrentStatus("Ready to start practice");
    stopMicrophone();
    if (isSpeaking) {
      speechSynthesisRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  // Lesson Content Modal
  const LessonContentModal = ({ lesson, onClose }) => {
    const [currentSection, setCurrentSection] = useState(0);
    const [exerciseAnswers, setExerciseAnswers] = useState({});
    const [showAnswers, setShowAnswers] = useState({});

    const handleNextSection = () => {
      if (currentSection < lesson.content.sections.length - 1) {
        setCurrentSection(currentSection + 1);
      }
    };

    const handlePrevSection = () => {
      if (currentSection > 0) {
        setCurrentSection(currentSection - 1);
      }
    };

    const handleExerciseAnswer = (exerciseIndex, answer) => {
      setExerciseAnswers((prev) => ({
        ...prev,
        [exerciseIndex]: answer,
      }));
    };

    const toggleAnswer = (exerciseIndex) => {
      setShowAnswers((prev) => ({
        ...prev,
        [exerciseIndex]: !prev[exerciseIndex],
      }));
    };

    const calculateProgress = () => {
      const totalItems =
        lesson.content.sections.length + lesson.content.exercises.length;
      const completedItems =
        currentSection + 1 + Object.keys(exerciseAnswers).length;
      return Math.round((completedItems / totalItems) * 100);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div className="relative top-4 mx-auto p-4 border w-full max-w-6xl shadow-xl rounded-lg bg-white">
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">
                {lesson.title}
              </h2>
              <p className="text-gray-600 mt-1">{lesson.description}</p>
              <div className="flex items-center space-x-4 mt-3">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    lesson.difficulty === "Beginner"
                      ? "bg-green-100 text-green-800"
                      : lesson.difficulty === "Intermediate"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-purple-100 text-purple-800"
                  }`}
                >
                  {lesson.difficulty}
                </span>
                <span className="text-gray-600">{lesson.duration}</span>
                <span className="text-blue-600 font-medium">
                  +{lesson.points} points
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 ml-4"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                Progress
              </span>
              <span
                className="text-sm font-bold"
                style={{ color: colors.primary }}
              >
                {calculateProgress()}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${calculateProgress()}%`,
                  backgroundColor: colors.primary,
                }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div
                className="rounded-lg p-5 mb-6"
                style={{ backgroundColor: colors.gray50 }}
              >
                <h3
                  className="font-bold mb-2"
                  style={{ color: colors.primary }}
                >
                  Overview
                </h3>
                <p className="text-gray-700">{lesson.content.overview}</p>
              </div>

              {/* Current Section */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">
                    {lesson.content.sections[currentSection].title}
                  </h3>
                  <span className="text-sm text-gray-600">
                    {currentSection + 1} of {lesson.content.sections.length}
                  </span>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-5">
                  <ul className="space-y-3">
                    {lesson.content.sections[currentSection].points.map(
                      (point, idx) => (
                        <li key={idx} className="flex items-start">
                          <div
                            className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"
                            style={{ backgroundColor: colors.primary }}
                          ></div>
                          <span className="text-gray-700">{point}</span>
                        </li>
                      )
                    )}
                  </ul>
                </div>

                {/* Navigation */}
                <div className="flex justify-between mt-6">
                  <button
                    onClick={handlePrevSection}
                    disabled={currentSection === 0}
                    className={`
                      px-4 py-2 rounded-lg font-medium
                      ${
                        currentSection === 0
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }
                    `}
                  >
                    Previous
                  </button>
                  <button
                    onClick={handleNextSection}
                    disabled={
                      currentSection === lesson.content.sections.length - 1
                    }
                    className={`
                      px-4 py-2 rounded-lg font-medium text-white
                      ${
                        currentSection === lesson.content.sections.length - 1
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "hover:opacity-90"
                      }
                    `}
                    style={{
                      backgroundColor:
                        currentSection === lesson.content.sections.length - 1
                          ? colors.gray100
                          : colors.primary,
                    }}
                  >
                    Next Section
                  </button>
                </div>
              </div>

              {/* Exercises */}
              {lesson.content.exercises.length > 0 && (
                <div className="mt-10">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Practice Exercises
                  </h3>
                  <div className="space-y-4">
                    {lesson.content.exercises.map((exercise, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 border border-gray-200 rounded-lg p-5"
                      >
                        <p className="font-medium text-gray-900 mb-3">
                          {exercise.question}
                        </p>

                        {exercise.answer ? (
                          <>
                            <div className="mb-3">
                              <input
                                type="text"
                                value={exerciseAnswers[index] || ""}
                                onChange={(e) =>
                                  handleExerciseAnswer(index, e.target.value)
                                }
                                placeholder="Type your answer here..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <button
                              onClick={() => toggleAnswer(index)}
                              className="text-sm font-medium"
                              style={{ color: colors.primary }}
                            >
                              {showAnswers[index]
                                ? "Hide Answer"
                                : "Show Answer"}
                            </button>
                            {showAnswers[index] && (
                              <div
                                className="mt-3 p-4 rounded-lg"
                                style={{
                                  backgroundColor: colors.successLighter,
                                }}
                              >
                                <p
                                  className="font-medium"
                                  style={{ color: colors.success }}
                                >
                                  Answer: {exercise.answer}
                                </p>
                                <p
                                  className="text-sm mt-1"
                                  style={{ color: colors.secondary }}
                                >
                                  {exercise.explanation}
                                </p>
                              </div>
                            )}
                          </>
                        ) : (
                          <div
                            className="p-4 rounded-lg"
                            style={{ backgroundColor: colors.infoLighter }}
                          >
                            <p style={{ color: colors.info }}>
                              {exercise.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Lesson Sections */}
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <h4 className="font-bold text-gray-900 mb-3">
                  Lesson Sections
                </h4>
                <div className="space-y-2">
                  {lesson.content.sections.map((section, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSection(index)}
                      className={`
                        w-full text-left p-3 rounded-lg transition-all
                        ${
                          currentSection === index
                            ? "border"
                            : "hover:bg-gray-50"
                        }
                      `}
                      style={{
                        backgroundColor:
                          currentSection === index
                            ? colors.infoLighter
                            : "transparent",
                        borderColor:
                          currentSection === index
                            ? colors.info
                            : "transparent",
                      }}
                    >
                      <div className="flex items-center">
                        <div
                          className={`
                            w-6 h-6 rounded-full flex items-center justify-center mr-3 text-sm font-medium
                            ${
                              currentSection === index
                                ? "text-white"
                                : "bg-gray-200 text-gray-600"
                            }
                          `}
                          style={{
                            backgroundColor:
                              currentSection === index
                                ? colors.primary
                                : colors.gray200,
                          }}
                        >
                          {index + 1}
                        </div>
                        <span
                          className={`font-medium ${
                            currentSection === index
                              ? "text-blue-700"
                              : "text-gray-700"
                          }`}
                        >
                          {section.title}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Practice Activities */}
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <h4 className="font-bold text-gray-900 mb-3">
                  Practice Activities
                </h4>
                <div className="space-y-3">
                  {lesson.content.practice?.map((activity, index) => (
                    <div key={index} className="flex items-start">
                      <div
                        className="w-2 h-2 rounded-full mt-2 mr-3"
                        style={{ backgroundColor: colors.success }}
                      ></div>
                      <span className="text-gray-700 text-sm">{activity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => {
                    const progress = calculateProgress();
                    updateLessonProgress(lesson.id, progress);
                    if (
                      progress >= 80 &&
                      !completedLessons.includes(lesson.id)
                    ) {
                      completeLesson(lesson.id, activeResourceTab);
                    }
                    onClose();
                  }}
                  className="w-full py-3 text-white font-medium rounded-lg transition-all hover:opacity-90"
                  style={{ backgroundColor: colors.primary }}
                >
                  Save Progress
                </button>
                <button
                  onClick={() => {
                    completeLesson(lesson.id, activeResourceTab);
                    onClose();
                  }}
                  className="w-full py-3 text-white font-medium rounded-lg transition-all hover:opacity-90"
                  style={{ backgroundColor: colors.success }}
                >
                  Mark as Completed
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-all"
                >
                  Close Lesson
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Dashboard View
  const DashboardView = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div
        className="rounded-xl p-6 text-white"
        style={{
          background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryLight})`,
        }}
      >
        <div className="flex flex-col lg:flex-row items-start justify-between">
          <div className="mb-6 lg:mb-0">
            <h2 className="text-2xl font-bold mb-2">
              Welcome back, {user.name}!
            </h2>
            <p className="text-blue-100">
              Start your English learning journey today. Track your progress and
              improve your skills.
            </p>
            <div className="mt-6">
              <div className="flex flex-wrap gap-4">
                <div className="bg-white/20 backdrop-blur-sm px-4 py-3 rounded-lg">
                  <div className="text-xl font-bold">{user.points}</div>
                  <div className="text-sm">Total Points</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm px-4 py-3 rounded-lg">
                  <div className="text-xl font-bold">{user.level}</div>
                  <div className="text-sm">Current Level</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm px-4 py-3 rounded-lg">
                  <div className="text-xl font-bold">{user.streak}</div>
                  <div className="text-sm">Day Streak</div>
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={() => setActivePage("practice")}
            className="bg-white hover:bg-gray-100 text-gray-900 font-semibold px-6 py-3 rounded-lg transition-all"
            style={{ color: colors.primary }}
          >
            Start Practice Session
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Level Progress */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Level Progress
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Level {user.level} Progress</span>
                  <span className="font-bold" style={{ color: colors.primary }}>
                    {user.levelProgress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="h-3 rounded-full transition-all duration-500"
                    style={{
                      width: `${user.levelProgress}%`,
                      backgroundColor: colors.primary,
                    }}
                  ></div>
                </div>
                <div className="text-sm text-gray-500 mt-2">
                  {500 - (user.points % 500)} points needed for next level
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  className="rounded-lg p-4"
                  style={{ backgroundColor: colors.blue50 }}
                >
                  <div
                    className="text-xl font-bold"
                    style={{ color: colors.blue700 }}
                  >
                    {user.sessionsCompleted}
                  </div>
                  <div className="text-sm text-gray-600">
                    Sessions Completed
                  </div>
                </div>
                <div
                  className="rounded-lg p-4"
                  style={{ backgroundColor: colors.green50 }}
                >
                  <div
                    className="text-xl font-bold"
                    style={{ color: colors.green700 }}
                  >
                    {user.accuracyRate}%
                  </div>
                  <div className="text-sm text-gray-600">Accuracy Rate</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Start Practice */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Quick Start Practice
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {scenarios.slice(0, 4).map((scenario) => (
                <button
                  key={scenario.id}
                  onClick={() => startConversation(scenario)}
                  className="text-left p-4 border border-gray-200 hover:border-blue-300 hover:shadow-sm rounded-lg transition-all"
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                      style={{ backgroundColor: scenario.color }}
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d={scenario.icon}
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {scenario.title}
                      </div>
                      <div className="text-sm text-gray-600">
                        {scenario.category} • {scenario.duration}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    {scenario.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                Recent Activity
              </h3>
              <span className="text-sm text-blue-600 font-medium">
                {recentActivities.length} activities
              </span>
            </div>
            <div className="space-y-3">
              {recentActivities.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    No activities yet. Start learning to see your progress here!
                  </p>
                </div>
              ) : (
                recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {activity.action}
                        </div>
                        <div className="text-sm text-gray-600">
                          {activity.time}
                        </div>
                      </div>
                    </div>
                    {activity.points > 0 && (
                      <div className="text-green-600 font-bold">
                        +{activity.points}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Daily Challenges */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                Daily Challenges
              </h3>
              <span className="text-sm text-blue-600 font-medium">
                {dailyChallenges.filter((c) => c.completed).length}/
                {dailyChallenges.length}
              </span>
            </div>
            <div className="space-y-3">
              {dailyChallenges.map((challenge) => (
                <div
                  key={challenge.id}
                  className={`p-3 rounded ${
                    challenge.completed ? "bg-green-50" : "bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-gray-900">
                      {challenge.title}
                    </div>
                    <div className="text-sm font-bold text-blue-600">
                      +{challenge.points}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    {challenge.description}
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs text-gray-500">
                      Progress: {challenge.progress}/{challenge.total}
                    </div>
                    <div className="text-xs font-medium">
                      {Math.round((challenge.progress / challenge.total) * 100)}
                      %
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${
                          (challenge.progress / challenge.total) * 100
                        }%`,
                        backgroundColor: challenge.color,
                      }}
                    ></div>
                  </div>
                  <button
                    onClick={() => completeChallenge(challenge.id)}
                    disabled={challenge.completed}
                    className={`w-full py-2 rounded text-sm font-medium ${
                      challenge.completed
                        ? "bg-green-100 text-green-800"
                        : challenge.progress >= challenge.total * 0.8
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-gray-300 text-gray-600 cursor-not-allowed"
                    }`}
                  >
                    {challenge.completed
                      ? "Completed"
                      : challenge.progress >= challenge.total * 0.8
                      ? "Complete Challenge"
                      : "In Progress"}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Skill Progress */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Skill Progress
            </h3>
            <div className="space-y-4">
              {Object.entries(learningProgress).map(([skill, value]) => (
                <div key={skill} className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {skill}
                    </span>
                    <span className="text-sm font-bold text-blue-600">
                      {value}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${value}%`,
                        backgroundColor: colors.primary,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Resources */}
          <div
            className="rounded-lg p-6 text-white"
            style={{
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryLight})`,
            }}
          >
            <h3 className="text-lg font-bold mb-3">Continue Learning</h3>
            <p className="text-blue-100 mb-4">Pick up where you left off</p>
            <button
              onClick={() => setActivePage("resources")}
              className="w-full bg-white text-blue-600 hover:bg-gray-100 font-medium py-2 rounded transition-colors"
            >
              Explore Resources
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Practice View
  const PracticeView = () => {
    if (selectedScenario && showSummary && sessionSummary) {
      return (
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8 text-white">
              <div className="text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-2">Session Complete</h2>
                <p className="text-blue-100">{sessionSummary.feedback}</p>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="text-sm font-medium text-blue-700 mb-1">
                    Level
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {sessionSummary.level}
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="text-sm font-medium text-green-700 mb-1">
                    Score
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {sessionSummary.score}/100
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Strengths</h3>
                  <div className="space-y-2">
                    {sessionSummary.strengths.map((strength, index) => (
                      <div
                        key={index}
                        className="flex items-center p-3 bg-green-50 rounded-lg"
                      >
                        <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs mr-3">
                          {index + 1}
                        </div>
                        <span className="text-gray-900">{strength}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 mb-2">
                    Improvement Tips
                  </h3>
                  <div className="space-y-2">
                    {sessionSummary.suggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="flex items-center p-3 bg-blue-50 rounded-lg"
                      >
                        <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs mr-3">
                          {index + 1}
                        </div>
                        <span className="text-gray-900">{suggestion}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200 flex space-x-3">
                <button
                  onClick={() => {
                    setShowSummary(false);
                    setCurrentStatus("Ready to continue");
                    startListening();
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors"
                >
                  Continue Practice
                </button>
                <button
                  onClick={resetPractice}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium py-3 rounded-lg transition-colors"
                >
                  New Session
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (selectedScenario) {
      return (
        <div className="max-w-7xl mx-auto">
          {/* Fixed Practice Controls */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm sticky top-24 z-20 mb-6">
            <div className="p-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                    style={{ backgroundColor: selectedScenario.color }}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d={selectedScenario.icon}
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900">
                      {selectedScenario.title}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {selectedScenario.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      isListening
                        ? "bg-green-100 text-green-800"
                        : isSpeaking
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {currentStatus}
                  </div>
                  <button
                    onClick={toggleAiVoice}
                    className={`px-3 py-1 rounded text-sm ${
                      aiVoiceEnabled
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    AI Voice {aiVoiceEnabled ? "On" : "Off"}
                  </button>
                </div>
              </div>

              {/* Controls */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={isListening ? stopListening : startListening}
                  disabled={isSpeaking}
                  className={`py-3 rounded-lg font-medium ${
                    isListening
                      ? "bg-orange-600 hover:bg-orange-700"
                      : "bg-blue-600 hover:bg-blue-700"
                  } text-white disabled:opacity-50`}
                >
                  {isListening ? "Stop Listening" : "Start Speaking"}
                </button>
                <button
                  onClick={endSession}
                  className="py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg font-medium"
                >
                  End Session
                </button>
              </div>

              {/* Tabs */}
              <div className="mt-4 border-b border-gray-200">
                <div className="flex">
                  <button
                    onClick={() => setActiveTab("conversation")}
                    className={`flex-1 py-3 text-center font-medium ${
                      activeTab === "conversation"
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-600"
                    }`}
                  >
                    Conversation
                  </button>
                  <button
                    onClick={() => setActiveTab("pronunciation")}
                    className={`flex-1 py-3 text-center font-medium ${
                      activeTab === "pronunciation"
                        ? "text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-600"
                    }`}
                  >
                    Pronunciation
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {activeTab === "conversation" ? (
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="font-bold text-gray-900">
                      Conversation Practice
                    </h3>
                  </div>
                  <div className="h-[500px] overflow-y-auto p-4">
                    {conversation.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-gray-400">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                          <svg
                            className="w-6 h-6"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <p className="font-medium">
                          Start speaking to begin conversation
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {conversation.map((msg) => (
                          <div
                            key={msg.id}
                            className={`flex ${
                              msg.role === "user"
                                ? "justify-end"
                                : "justify-start"
                            }`}
                          >
                            <div
                              className={`max-w-[80%] rounded-lg px-4 py-3 ${
                                msg.role === "user"
                                  ? "bg-blue-600 text-white"
                                  : "bg-gray-100 text-gray-900"
                              }`}
                            >
                              <div className="flex justify-between items-center mb-1">
                                <div className="text-xs font-medium">
                                  {msg.role === "user" ? "You" : "AI Teacher"}
                                </div>
                                <div className="text-xs opacity-60">
                                  {msg.timestamp}
                                </div>
                              </div>
                              <div className="text-sm">{msg.text}</div>
                            </div>
                          </div>
                        ))}
                        {isThinking && (
                          <div className="flex justify-start">
                            <div className="bg-gray-100 text-gray-900 rounded-lg px-4 py-3">
                              <div className="flex items-center space-x-2">
                                <div className="flex space-x-1">
                                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                  <div
                                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                    style={{ animationDelay: "0.2s" }}
                                  ></div>
                                  <div
                                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                    style={{ animationDelay: "0.4s" }}
                                  ></div>
                                </div>
                                <span className="text-sm">Thinking...</span>
                              </div>
                            </div>
                          </div>
                        )}
                        <div ref={messagesEndRef} />
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="font-bold text-gray-900">
                      Pronunciation Practice
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Practice these sentences for perfect pronunciation
                    </p>
                  </div>
                  <div className="p-4 space-y-4">
                    {pronunciationSentences.map((sentence, index) => {
                      const result = pronunciationResults[index];
                      return (
                        <div
                          key={index}
                          className={`border rounded-lg p-4 ${
                            result
                              ? result.status === "excellent"
                                ? "border-green-500 bg-green-50"
                                : result.status === "good"
                                ? "border-blue-500 bg-blue-50"
                                : result.status === "fair"
                                ? "border-yellow-500 bg-yellow-50"
                                : "border-red-500 bg-red-50"
                              : "border-gray-200"
                          }`}
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div className="font-medium text-gray-900">
                              {sentence}
                            </div>
                            {result && (
                              <span
                                className={`text-sm font-bold px-2 py-1 rounded ${
                                  result.status === "excellent"
                                    ? "bg-green-100 text-green-800"
                                    : result.status === "good"
                                    ? "bg-blue-100 text-blue-800"
                                    : result.status === "fair"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {result.score}/100
                              </span>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => speakAI(sentence)}
                              className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm font-medium"
                            >
                              Listen
                            </button>
                            <button
                              onClick={() =>
                                startPronunciationPractice(sentence, index)
                              }
                              disabled={
                                isRecordingPronunciation &&
                                currentPronunciationIndex === index
                              }
                              className={`flex-1 py-2 rounded text-sm font-medium ${
                                isRecordingPronunciation &&
                                currentPronunciationIndex === index
                                  ? "bg-gray-600 text-white"
                                  : "bg-blue-600 hover:bg-blue-700 text-white"
                              }`}
                            >
                              {isRecordingPronunciation &&
                              currentPronunciationIndex === index
                                ? "Recording..."
                                : "Record"}
                            </button>
                          </div>
                          {result && (
                            <div className="mt-3 pt-3 border-t border-gray-200">
                              <div className="text-sm text-gray-600 mb-1">
                                You said: {result.spoken}
                              </div>
                              <p
                                className={`text-sm ${
                                  result.status === "excellent"
                                    ? "text-green-700"
                                    : result.status === "good"
                                    ? "text-blue-700"
                                    : result.status === "fair"
                                    ? "text-yellow-700"
                                    : "text-red-700"
                                }`}
                              >
                                {result.feedback}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Side Panel */}
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
                <h3 className="font-bold text-gray-900 mb-3">Session Stats</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Messages</span>
                      <span>{messageCount}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${Math.min(messageCount * 10, 100)}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Pronunciation</span>
                      <span>
                        {pronunciationResults.length > 0
                          ? Math.round(
                              pronunciationResults.reduce(
                                (acc, result) => acc + (result?.score || 0),
                                0
                              ) / pronunciationResults.length
                            )
                          : 0}
                        %
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{
                          width: `${
                            pronunciationResults.length > 0
                              ? Math.round(
                                  pronunciationResults.reduce(
                                    (acc, result) => acc + (result?.score || 0),
                                    0
                                  ) / pronunciationResults.length
                                )
                              : 0
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Learning Tips
                  </h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    {selectedScenario.learningTips.map((tip, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-1 h-1 bg-blue-600 rounded-full mt-2 mr-2"></div>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-blue-600 rounded-lg p-4 text-white">
                <h4 className="font-bold mb-2">Quick Actions</h4>
                <div className="space-y-2">
                  <button
                    onClick={() =>
                      setActiveTab(
                        activeTab === "conversation"
                          ? "pronunciation"
                          : "conversation"
                      )
                    }
                    className="w-full bg-white/20 hover:bg-white/30 p-2 rounded text-sm text-left"
                  >
                    Switch to{" "}
                    {activeTab === "conversation"
                      ? "Pronunciation"
                      : "Conversation"}
                  </button>
                  <button
                    onClick={() => speakAI("Can you repeat that please?")}
                    className="w-full bg-white/20 hover:bg-white/30 p-2 rounded text-sm text-left"
                  >
                    Ask AI to Repeat
                  </button>
                  <button
                    onClick={() => {
                      setConversation([]);
                      setPronunciationResults([]);
                      setMessageCount(0);
                    }}
                    className="w-full bg-white/20 hover:bg-white/30 p-2 rounded text-sm text-left"
                  >
                    Reset Session
                  </button>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
                <h4 className="font-bold text-gray-900 mb-2">
                  Scenario Details
                </h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Category:</span>
                    <span className="font-medium">
                      {selectedScenario.category}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span className="font-medium">
                      {selectedScenario.duration}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Topics:</span>
                    <span className="font-medium">
                      {selectedScenario.topics.join(", ")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Practice Scenarios
            </h2>
            <p className="text-gray-600 mt-2">
              Choose a scenario to practice your English conversation skills
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {scenarios.map((scenario) => (
              <button
                key={scenario.id}
                onClick={() => startConversation(scenario)}
                className="bg-white border border-gray-200 rounded-lg p-6 text-left hover:border-blue-300 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center text-white"
                    style={{ backgroundColor: scenario.color }}
                  >
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d={scenario.icon}
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-xs font-medium px-2 py-1 rounded bg-gray-100 text-gray-700">
                    {scenario.category}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">
                  {scenario.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {scenario.description}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{scenario.duration}</span>
                  <span className="text-blue-600 hover:text-blue-700 font-medium">
                    Start Practice
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-8 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-xl font-bold mb-2">
                Ready to Improve Your English?
              </h3>
              <p className="text-blue-100">
                Start practicing today and see your skills improve
              </p>
            </div>
            <button
              onClick={() => startConversation(scenarios[0])}
              className="bg-white text-blue-600 hover:bg-gray-100 font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Start Learning Now
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Comprehensive Resources View
  const ResourcesView = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Learning Resources
          </h2>
          <p className="text-gray-600 mt-2">
            Comprehensive materials to improve your English skills
          </p>
        </div>

        {/* Resource Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <div className="flex">
            <button
              onClick={() => setActiveResourceTab("grammar")}
              className={`flex-1 py-3 text-center font-medium ${
                activeResourceTab === "grammar"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Grammar Guide
            </button>
            <button
              onClick={() => setActiveResourceTab("pronunciation")}
              className={`flex-1 py-3 text-center font-medium ${
                activeResourceTab === "pronunciation"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Pronunciation
            </button>
            <button
              onClick={() => setActiveResourceTab("vocabulary")}
              className={`flex-1 py-3 text-center font-medium ${
                activeResourceTab === "vocabulary"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Vocabulary
            </button>
          </div>
        </div>

        {/* Resource Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources[activeResourceTab].map((lesson) => (
            <div
              key={lesson.id}
              className={`border border-gray-200 rounded-lg p-5 hover:shadow-md transition-all ${
                completedLessons.includes(lesson.id)
                  ? "bg-green-50 border-green-200"
                  : ""
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    completedLessons.includes(lesson.id)
                      ? "bg-green-100 text-green-600"
                      : "bg-blue-100 text-blue-600"
                  } font-medium`}
                >
                  {lesson.id}
                </div>
                <div className="flex flex-col items-end">
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded mb-1 ${
                      lesson.difficulty === "Beginner"
                        ? "bg-green-100 text-green-800"
                        : lesson.difficulty === "Intermediate"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-purple-100 text-purple-800"
                    }`}
                  >
                    {lesson.difficulty}
                  </span>
                  <span className="text-xs text-gray-600">
                    {lesson.duration}
                  </span>
                </div>
              </div>

              <h3 className="font-bold text-gray-900 mb-2">{lesson.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{lesson.description}</p>

              <div className="mb-4">
                <div className="text-sm text-gray-700 mb-2">
                  Topics Covered:
                </div>
                <div className="flex flex-wrap gap-1">
                  {lesson.content.sections.slice(0, 2).map((section, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                    >
                      {section.title}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-medium text-blue-600">
                  +{lesson.points} points
                </div>
                {completedLessons.includes(lesson.id) && (
                  <span className="text-sm text-green-600 font-medium flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Completed
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => viewLessonContent(lesson)}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors"
                >
                  View Lesson
                </button>
                {!completedLessons.includes(lesson.id) && (
                  <button
                    onClick={() => completeLesson(lesson.id, activeResourceTab)}
                    className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-medium transition-colors"
                  >
                    Mark Complete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-8 text-white">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0">
            <h3 className="text-xl font-bold mb-2">Practice What You Learn</h3>
            <p className="text-blue-100">
              Apply your knowledge in real conversation practice sessions
            </p>
          </div>
          <button
            onClick={() => setActivePage("practice")}
            className="bg-white text-blue-600 hover:bg-gray-100 font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Start Practice Session
          </button>
        </div>
      </div>
    </div>
  );

  // Progress View
  const ProgressView = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Learning Progress
          </h2>
          <p className="text-gray-600 mt-2">
            Track your English learning journey and achievements
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-700 mb-1">
              {user.totalPracticeHours.toFixed(1)}
            </div>
            <div className="text-sm text-gray-600">Practice Hours</div>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-700 mb-1">
              {user.sessionsCompleted}
            </div>
            <div className="text-sm text-gray-600">Sessions Completed</div>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-700 mb-1">
              {user.accuracyRate}%
            </div>
            <div className="text-sm text-gray-600">Accuracy Rate</div>
          </div>
          <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg p-4">
            <div className="text-2xl font-bold text-yellow-700 mb-1">
              {user.streak}
            </div>
            <div className="text-sm text-gray-600">Day Streak</div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Skill Development
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(learningProgress).map(([skill, value]) => (
                <div
                  key={skill}
                  className="bg-white border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {skill}
                    </span>
                    <span className="text-lg font-bold text-blue-600">
                      {value}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${value}%` }}
                    ></div>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    {value < 30
                      ? "Beginner"
                      : value < 70
                      ? "Intermediate"
                      : "Advanced"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Recent Achievements
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
              <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                {user.streak}
              </div>
              <div>
                <div className="font-medium text-gray-900">
                  {user.streak}-Day Streak
                </div>
                <div className="text-sm text-gray-600">
                  Practice for {user.streak} consecutive days
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                {user.sessionsCompleted}
              </div>
              <div>
                <div className="font-medium text-gray-900">
                  {user.sessionsCompleted} Sessions
                </div>
                <div className="text-sm text-gray-600">
                  Complete {user.sessionsCompleted} practice sessions
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
              <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                {user.accuracyRate}
              </div>
              <div>
                <div className="font-medium text-gray-900">
                  {user.accuracyRate}% Accuracy
                </div>
                <div className="text-sm text-gray-600">
                  Achieve high pronunciation accuracy
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Learning Goals
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="font-medium text-gray-900">
                  Daily Practice
                </span>
                <span className="text-sm font-bold text-blue-600">
                  {user.dailyGoalProgress}/{user.dailyGoal}
                </span>
              </div>
              <div className="w-full bg-white rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{
                    width: `${
                      (user.dailyGoalProgress / user.dailyGoal) * 100
                    }%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="font-medium text-gray-900">
                  Vocabulary Goal
                </span>
                <span className="text-sm font-bold text-green-600">
                  {learningProgress.vocabulary}/100
                </span>
              </div>
              <div className="w-full bg-white rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full"
                  style={{ width: `${learningProgress.vocabulary}%` }}
                ></div>
              </div>
            </div>

            <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
              <div className="flex justify-between mb-2">
                <span className="font-medium text-gray-900">
                  Pronunciation Goal
                </span>
                <span className="text-sm font-bold text-purple-600">
                  {learningProgress.pronunciation}/100
                </span>
              </div>
              <div className="w-full bg-white rounded-full h-2">
                <div
                  className="bg-purple-600 h-2 rounded-full"
                  style={{ width: `${learningProgress.pronunciation}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render Content Based on Active Page
  const renderContent = () => {
    switch (activePage) {
      case "dashboard":
        return <DashboardView />;
      case "practice":
        return <PracticeView />;
      case "resources":
        return <ResourcesView />;
      case "progress":
        return <ProgressView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Header />
      <MainContent />
      {currentLessonContent && (
        <LessonContentModal
          lesson={currentLessonContent}
          onClose={closeLessonContent}
        />
      )}
    </div>
  );
};

export default EnglishLearningPlatform;
