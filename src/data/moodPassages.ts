/**
 * Mood-Based Bible Passages
 * Curated passages for different emotional states
 */

export interface Mood {
  id: string;
  name: string;
  emoji: string;
  description: string;
  passages: string[];
}

const moods: Mood[] = [
  {
    id: "anxious",
    name: "Anxious",
    emoji: "😰",
    description: "Finding peace in worry",
    passages: [
      "Philippians 4:6-7",
      "Matthew 6:25-34",
      "1 Peter 5:7",
      "Psalm 23:1-6",
      "Isaiah 41:10",
      "John 14:27",
      "Psalm 94:19",
      "Proverbs 12:25",
      "2 Timothy 1:7",
      "Psalm 55:22",
      "Matthew 11:28-30",
      "Joshua 1:9",
      "Psalm 46:1-3",
      "Romans 8:38-39"
    ]
  },
  {
    id: "grateful",
    name: "Grateful",
    emoji: "🙏",
    description: "Expressing thankfulness",
    passages: [
      "Psalm 100:1-5",
      "1 Thessalonians 5:16-18",
      "Colossians 3:15-17",
      "Psalm 103:1-5",
      "Psalm 136:1-3",
      "Ephesians 5:19-20",
      "Psalm 107:1",
      "1 Chronicles 16:8-10",
      "Psalm 118:24",
      "James 1:17",
      "Psalm 95:1-2",
      "Philippians 4:4-6",
      "Luke 17:11-19",
      "Psalm 34:1-3"
    ]
  },
  {
    id: "sad",
    name: "Sad",
    emoji: "😢",
    description: "Hope in sorrow",
    passages: [
      "Psalm 34:18",
      "Matthew 5:4",
      "Psalm 147:3",
      "2 Corinthians 1:3-4",
      "Revelation 21:4",
      "Psalm 30:5",
      "John 16:20-22",
      "Psalm 42:11",
      "Isaiah 61:1-3",
      "Romans 8:18",
      "Psalm 126:5-6",
      "Lamentations 3:22-23",
      "Psalm 73:26",
      "John 14:1-3"
    ]
  },
  {
    id: "joyful",
    name: "Joyful",
    emoji: "😊",
    description: "Celebrating goodness",
    passages: [
      "Psalm 16:11",
      "Nehemiah 8:10",
      "Philippians 4:4",
      "Psalm 118:24",
      "Proverbs 17:22",
      "John 15:11",
      "Romans 15:13",
      "1 Thessalonians 5:16",
      "Psalm 126:3",
      "Habakkuk 3:18",
      "Psalm 47:1",
      "Zephaniah 3:17",
      "Psalm 32:11",
      "Luke 6:23"
    ]
  },
  {
    id: "confused",
    name: "Confused",
    emoji: "🤔",
    description: "Seeking clarity",
    passages: [
      "Proverbs 3:5-6",
      "James 1:5",
      "Psalm 32:8",
      "Isaiah 30:21",
      "Proverbs 16:9",
      "John 16:13",
      "Psalm 25:4-5",
      "Proverbs 2:6-8",
      "Jeremiah 29:11-13",
      "Romans 12:2",
      "Proverbs 20:24",
      "Psalm 119:105",
      "Colossians 1:9-10",
      "Ephesians 1:17-18"
    ]
  },
  {
    id: "angry",
    name: "Angry",
    emoji: "😤",
    description: "Managing frustration",
    passages: [
      "Ephesians 4:26-27",
      "Proverbs 15:1",
      "James 1:19-20",
      "Psalm 37:8",
      "Proverbs 14:29",
      "Colossians 3:8",
      "Proverbs 16:32",
      "Ecclesiastes 7:9",
      "Matthew 5:21-24",
      "Romans 12:19-21",
      "Proverbs 19:11",
      "Psalm 4:4",
      "Proverbs 29:11",
      "1 Peter 3:9"
    ]
  },
  {
    id: "lonely",
    name: "Lonely",
    emoji: "😔",
    description: "Finding companionship",
    passages: [
      "Psalm 68:6",
      "Deuteronomy 31:6",
      "Matthew 28:20",
      "Isaiah 41:10",
      "Psalm 23:4",
      "Hebrews 13:5",
      "Joshua 1:9",
      "Romans 8:38-39",
      "Psalm 27:10",
      "John 14:18",
      "Psalm 147:3",
      "Isaiah 43:2",
      "Proverbs 18:24",
      "Matthew 11:28"
    ]
  },
  {
    id: "hopeful",
    name: "Hopeful",
    emoji: "🌅",
    description: "Looking ahead",
    passages: [
      "Jeremiah 29:11",
      "Romans 15:13",
      "Psalm 42:5",
      "Hebrews 11:1",
      "Romans 5:3-5",
      "1 Peter 1:3",
      "Lamentations 3:22-24",
      "Psalm 39:7",
      "Romans 8:24-25",
      "Proverbs 23:18",
      "Hebrews 6:19",
      "Psalm 130:5",
      "Titus 2:13",
      "1 Thessalonians 5:8"
    ]
  },
  {
    id: "fearful",
    name: "Fearful",
    emoji: "😨",
    description: "Finding courage",
    passages: [
      "2 Timothy 1:7",
      "Psalm 27:1",
      "Isaiah 41:10",
      "Deuteronomy 31:6",
      "Psalm 56:3-4",
      "John 14:27",
      "1 John 4:18",
      "Psalm 118:6",
      "Joshua 1:9",
      "Proverbs 29:25",
      "Isaiah 35:4",
      "Psalm 91:1-2",
      "Romans 8:15",
      "Hebrews 13:6"
    ]
  },
  {
    id: "peaceful",
    name: "Peaceful",
    emoji: "☮️",
    description: "Resting in calm",
    passages: [
      "John 14:27",
      "Philippians 4:7",
      "Psalm 4:8",
      "Isaiah 26:3",
      "Colossians 3:15",
      "Numbers 6:24-26",
      "Psalm 29:11",
      "John 16:33",
      "Romans 5:1",
      "2 Thessalonians 3:16",
      "Psalm 119:165",
      "Isaiah 32:17",
      "Romans 15:33",
      "Psalm 37:11"
    ]
  },
  {
    id: "motivated",
    name: "Motivated",
    emoji: "💪",
    description: "Ready to take action",
    passages: [
      "Philippians 4:13",
      "Joshua 1:9",
      "Colossians 3:23",
      "Proverbs 16:3",
      "Isaiah 40:31",
      "Galatians 6:9",
      "1 Corinthians 15:58",
      "Proverbs 21:5",
      "2 Timothy 4:7",
      "Hebrews 12:1-2",
      "Ephesians 6:10",
      "Philippians 3:13-14",
      "Proverbs 13:4",
      "1 Corinthians 9:24"
    ]
  },
  {
    id: "overwhelmed",
    name: "Overwhelmed",
    emoji: "😵",
    description: "Finding rest",
    passages: [
      "Matthew 11:28-30",
      "Psalm 61:2",
      "2 Corinthians 4:8-9",
      "Exodus 14:14",
      "Isaiah 40:29",
      "Psalm 55:22",
      "Philippians 4:6-7",
      "1 Peter 5:7",
      "Psalm 46:10",
      "Nahum 1:7",
      "Psalm 73:26",
      "2 Corinthians 12:9",
      "Psalm 94:18-19",
      "Matthew 6:34"
    ]
  }
];

/**
 * Get all available moods
 */
export const getAllMoods = (): Mood[] => {
  return moods;
};

/**
 * Get a specific mood by ID
 */
export const getMoodById = (moodId: string): Mood | undefined => {
  return moods.find(m => m.id === moodId);
};

/**
 * Get a random passage for a mood
 */
export const getRandomPassageForMood = (moodId: string): string | null => {
  const mood = getMoodById(moodId);
  
  if (!mood || mood.passages.length === 0) {
    return null;
  }
  
  const randomIndex = Math.floor(Math.random() * mood.passages.length);
  return mood.passages[randomIndex];
};

/**
 * Get all passages for a mood
 */
export const getPassagesForMood = (moodId: string): string[] => {
  const mood = getMoodById(moodId);
  return mood?.passages || [];
};
