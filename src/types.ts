export interface ApprenticeProfile {
  fullName: string;
  documentType: 'CC' | 'TI' | 'CE' | 'PPT';
  documentNumber: string;
  email: string;
  regional: string;
  centroFormacion: string;
  programaFormacion: string;
  numeroFicha: string;
  fechaIngreso: string;
}

export interface RegulationChapter {
  id: string;
  title: string;
  articleRef: string;
  summary: string;
  content: string[];
  keyHighlights: string[];
  practicalApplication?: string;
}

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
  articleRef: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  context?: string;
  options: QuizOption[];
  points: number;
  category: 'principios' | 'derechos' | 'deberes' | 'prohibiciones' | 'medidas_sanciones' | 'tramites';
}

export interface ModuleData {
  id: string;
  order: number;
  title: string;
  shortTitle: string;
  description: string;
  iconName: string;
  badgeId: string;
  durationMinutes: number;
  xpReward: number;
  chapters: RegulationChapter[];
  quiz: QuizQuestion[];
}

export interface ScenarioChoice {
  id: string;
  actionText: string;
  isBestDecision: boolean;
  xpGained: number;
  outcomeDescription: string;
  legalBasis: string;
  consequenceType: 'success' | 'warning' | 'danger';
}

export interface RealCaseScenario {
  id: string;
  title: string;
  moduleCategory: string;
  situation: string;
  characters: string;
  contextLocation: string;
  dilemma: string;
  choices: ScenarioChoice[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  xpValue: number;
  criteria: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface UserInductionProgress {
  completedModules: string[];
  completedScenarios: string[];
  quizScores: Record<string, number>;
  totalXp: number;
  streakDays: number;
  badges: string[];
  finalExamScore?: number;
  isCertified: boolean;
  certifiedDate?: string;
  certificateCode?: string;
}

export type AppRole = 'aprendiz' | 'instructor';

export interface InstructorApprenticeRecord {
  timestamp: string;
  fullName: string;
  documentType: string;
  documentNumber: string;
  email: string;
  programaFormacion: string;
  numeroFicha: string;
  regional: string;
  centroFormacion: string;
  finalExamScore: string;
  completedModules: string;
  completedScenarios: string;
  totalXp: string;
  status: string;
  certificateCode: string;
  certifiedDate: string;
  rawRowIndex?: number;
}

export interface ApprenticeStudentRecord {
  profile: ApprenticeProfile;
  progress: UserInductionProgress;
  createdAt: string;
  updatedAt: string;
}


