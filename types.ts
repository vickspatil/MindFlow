export enum DifficultyLevel {
  CHILD = "5 Year Old (ELI5)",
  TEENAGER = "High School Student",
  UNDERGRAD = "Undergraduate Student",
  PROFESSIONAL = "Industry Professional"
}

export interface Concept {
  id: string;
  title: string;
  definition: string;
  analogy: string;
  keyTakeaway: string;
}

export interface FlowNode {
  id: string;
  label: string;
  description: string;
  stepOrder: number; // For layout
}

export interface FlowEdge {
  from: string;
  to: string;
  label?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Curriculum {
  topic: string;
  difficulty: string;
  introduction: string;
  concepts: Concept[];
  flowchart: {
    nodes: FlowNode[];
    edges: FlowEdge[];
  };
  quiz: QuizQuestion[];
}

export type AppStatus = 'IDLE' | 'GENERATING' | 'READY' | 'ERROR';