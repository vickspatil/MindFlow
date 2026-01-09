import { Curriculum, DifficultyLevel } from "../types";

const PERPLEXITY_API_URL = "https://api.perplexity.ai/chat/completions";

export const generateCurriculum = async (topic: string, difficulty: DifficultyLevel): Promise<Curriculum> => {
  const model = "sonar";

  const prompt = `
    Create a comprehensive, interactive-style learning module about "${topic}".
    Target Audience: ${difficulty}.
    
    The content must be structured to be visualized in a web app.
    1. **Concepts**: Break the topic down into 4-6 core concepts.
    2. **Flowchart**: Create a logical flow or process map (e.g., Step A leads to Step B, or Hierarchy) representing how the system/concept works. Ensure the 'stepOrder' roughly corresponds to a vertical hierarchy (1 is top/start).
    3. **Quiz**: Create 3-5 multiple choice questions to test understanding.
    
    Make the tone appropriate for the "${difficulty}" audience.
    For a child, use simple words and fun analogies.
    For a professional, use industry standard terminology and deep technical insight.

    You MUST respond with valid JSON only, no markdown, no explanation. Use this exact structure:
    {
      "topic": "string",
      "difficulty": "string",
      "introduction": "A engaging 2-3 sentence hook introducing the topic.",
      "concepts": [
        {
          "id": "string",
          "title": "string",
          "definition": "string",
          "analogy": "A relatable analogy to explain the concept.",
          "keyTakeaway": "One sentence summary."
        }
      ],
      "flowchart": {
        "nodes": [
          {
            "id": "string",
            "label": "string",
            "description": "string",
            "stepOrder": 1
          }
        ],
        "edges": [
          {
            "from": "string",
            "to": "string",
            "label": "optional string"
          }
        ]
      },
      "quiz": [
        {
          "id": "string",
          "question": "string",
          "options": ["option1", "option2", "option3", "option4"],
          "correctIndex": 0,
          "explanation": "string"
        }
      ]
    }
  `;

  const response = await fetch(PERPLEXITY_API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.PERPLEXITY_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: model,
      messages: [
        {
          role: "system",
          content: "You are an expert educator. You respond only with valid JSON, no markdown code blocks, no explanations."
        },
        {
          role: "user",
          content: prompt
        }
      ]
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Perplexity API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("No content generated");
  }

  // Clean up the response in case it has markdown code blocks
  let jsonString = content.trim();
  if (jsonString.startsWith("```json")) {
    jsonString = jsonString.slice(7);
  } else if (jsonString.startsWith("```")) {
    jsonString = jsonString.slice(3);
  }
  if (jsonString.endsWith("```")) {
    jsonString = jsonString.slice(0, -3);
  }
  jsonString = jsonString.trim();

  return JSON.parse(jsonString) as Curriculum;
};

export const generateDeepDiveTopics = async (currentTopic: string, difficulty: DifficultyLevel): Promise<string[]> => {
  const model = "sonar";

  const prompt = `
    The user just completed a quiz about "${currentTopic}" with a high score (>80%).
    They want to dive deeper into related topics to fuel their curiosity and continue learning.
    
    Generate 4-6 specific, engaging topic suggestions that are:
    1. Directly related to or build upon "${currentTopic}"
    2. More advanced or specialized than the base topic
    3. Curious and thought-provoking (e.g., "Different types of engines", "Jet engines", "Rocket engines" if the topic was "Engines")
    4. Appropriate for ${difficulty} level
    
    Make the topics specific enough to be interesting, but broad enough to create a full learning module.
    Focus on topics that will make the learner think more and explore deeper aspects.
    
    You MUST respond with valid JSON only, no markdown, no explanation. Use this exact structure:
    {
      "topics": ["topic1", "topic2", "topic3", "topic4", "topic5", "topic6"]
    }
  `;

  const response = await fetch(PERPLEXITY_API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.PERPLEXITY_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: model,
      messages: [
        {
          role: "system",
          content: "You are an expert educator. You respond only with valid JSON, no markdown code blocks, no explanations."
        },
        {
          role: "user",
          content: prompt
        }
      ]
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Perplexity API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("No content generated");
  }

  // Clean up the response in case it has markdown code blocks
  let jsonString = content.trim();
  if (jsonString.startsWith("```json")) {
    jsonString = jsonString.slice(7);
  } else if (jsonString.startsWith("```")) {
    jsonString = jsonString.slice(3);
  }
  if (jsonString.endsWith("```")) {
    jsonString = jsonString.slice(0, -3);
  }
  jsonString = jsonString.trim();

  const result = JSON.parse(jsonString) as { topics: string[] };
  return result.topics;
};

