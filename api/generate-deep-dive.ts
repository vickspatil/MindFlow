import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { currentTopic, difficulty } = req.body;

  if (!currentTopic || !difficulty) {
    return res.status(400).json({ error: 'Missing currentTopic or difficulty' });
  }

  const PERPLEXITY_API_URL = "https://api.perplexity.ai/chat/completions";
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

    const result = JSON.parse(jsonString) as { topics: string[] };
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error generating deep dive topics:', error);
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}

