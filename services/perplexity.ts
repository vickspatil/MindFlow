import { Curriculum, DifficultyLevel } from "../types";

export const generateCurriculum = async (topic: string, difficulty: DifficultyLevel): Promise<Curriculum> => {
  const response = await fetch('/api/generate-curriculum', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ topic, difficulty }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || `API error: ${response.status}`);
  }

  return response.json() as Promise<Curriculum>;
};

export const generateDeepDiveTopics = async (currentTopic: string, difficulty: DifficultyLevel): Promise<string[]> => {
  const response = await fetch('/api/generate-deep-dive', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ currentTopic, difficulty }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || `API error: ${response.status}`);
  }

  const result = await response.json() as { topics: string[] };
  return result.topics;
};

