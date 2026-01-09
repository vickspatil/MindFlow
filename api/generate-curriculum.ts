import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Curriculum, DifficultyLevel } from '../types';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { topic, difficulty } = req.body;

  if (!topic || !difficulty) {
    return res.status(400).json({ error: 'Missing topic or difficulty' });
  }

  const PERPLEXITY_API_URL = "https://api.perplexity.ai/chat/completions";
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

  try {
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
      return res.status(response.status).json({ 
        error: `Perplexity API error: ${response.status} - ${error}` 
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return res.status(500).json({ error: "No content generated" });
    }

    // Clean up the response
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

    const curriculum = JSON.parse(jsonString) as Curriculum;
    return res.status(200).json(curriculum);
  } catch (error) {
    console.error('Error generating curriculum:', error);
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}

