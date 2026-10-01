export type MascotMood = "locking-in" | "cheering" | "curious";

export interface HeroPillTag {
  id: string;
  icon: string;
  label: string;
}

export interface PainPointCard {
  id: string;
  badge: string;
  icon: string;
  title: string;
  description: string;
  symptom: string;
}

export interface ClosedLoopStep {
  id: string;
  stepNumber: string;
  icon: string;
  title: string;
  subtitle: string;
}

export interface CorePillarItem {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  highlights: string[];
  visualType: "maze-funnel" | "feynman-brain" | "gamified-xp";
}

export interface ComparisonRow {
  feature: string;
  notionObsidian: string;
  todoistTickTick: string;
  ankiHabitica: string;
  gonApp: string;
}

export interface PlaygroundDemoTask {
  id: string;
  title: string;
  tag: string;
  xpReward: number;
  isGoldZone: boolean;
  completed: boolean;
}

export interface FeynmanPreset {
  id: string;
  concept: string;
  rawJargon: string;
  simplifiedExplanation: string;
  extractedAction: string;
  xpBonus: number;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}
