import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function analyzePartImage(imageBase64: string, imageType: string) {
  try {
    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: imageType as any,
                data: imageBase64,
              },
            },
            {
              type: "text",
              text: `Analyze this automotive or industrial part image and provide:
1. Part type/category (e.g., filter, bearing, spark plug, belt)
2. Visible part numbers or markings
3. Physical characteristics (dimensions if visible, color, material)
4. Manufacturer if identifiable
5. Any specifications visible (micron rating, size, etc.)
6. Potential cross-reference numbers
7. Condition and notable features

Format your response as JSON with these fields: partType, partNumbers, characteristics, manufacturer, specifications, crossReferences, condition, confidence (0-1 score).`,
            },
          ],
        },
      ],
    });

    const textContent = message.content.find((c) => c.type === "text");
    if (textContent && textContent.type === "text") {
      // Try to extract JSON from the response
      const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return { rawResponse: textContent.text };
    }

    return { error: "No text response from AI" };
  } catch (error) {
    console.error("AI image analysis error:", error);
    throw error;
  }
}

export async function searchPartsWithAI(query: string, existingParts: any[]) {
  try {
    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 2048,
      messages: [
        {
          role: "user",
          content: `I'm searching for: "${query}"

Here are the available parts in the database:
${JSON.stringify(existingParts, null, 2)}

Based on the search query, return the most relevant parts ranked by relevance. Consider:
- Part numbers and cross-references
- Description matching
- Manufacturer compatibility
- Technical specifications
- Alternative/equivalent parts

Return a JSON array of part IDs ranked by relevance with confidence scores (0-1). Format:
[{"partId": "id", "confidence": 0.95, "reason": "exact match"}, ...]

Include only parts with confidence > 0.3.`,
        },
      ],
    });

    const textContent = message.content.find((c) => c.type === "text");
    if (textContent && textContent.type === "text") {
      const jsonMatch = textContent.text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    }

    return [];
  } catch (error) {
    console.error("AI search error:", error);
    throw error;
  }
}

export async function findCrossReferences(partData: any, allParts: any[]) {
  try {
    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 2048,
      messages: [
        {
          role: "user",
          content: `Find cross-reference parts for this part:
${JSON.stringify(partData, null, 2)}

Available parts in database:
${JSON.stringify(allParts.slice(0, 100), null, 2)}

Identify compatible, equivalent, or interchangeable parts based on:
- Part specifications (dimensions, micron rating, etc.)
- Application compatibility
- Manufacturer cross-reference data
- Physical characteristics

Return JSON array: [{"partId": "id", "confidenceScore": 0.9, "compatibilityType": "direct_replacement", "notes": "Identical specs"}]

Only include matches with confidence > 0.5.`,
        },
      ],
    });

    const textContent = message.content.find((c) => c.type === "text");
    if (textContent && textContent.type === "text") {
      const jsonMatch = textContent.text.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    }

    return [];
  } catch (error) {
    console.error("AI cross-reference error:", error);
    throw error;
  }
}

export async function checkCompatibility(
  partId: string,
  targetPartId: string,
  partData: any,
  targetPartData: any
) {
  try {
    const message = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `Check compatibility between these two parts:

Part A:
${JSON.stringify(partData, null, 2)}

Part B:
${JSON.stringify(targetPartData, null, 2)}

Analyze compatibility based on:
- Physical dimensions and fitment
- Specifications (micron rating, pressure, temperature, etc.)
- Application overlap
- Manufacturer recommendations

Return JSON: {"compatible": true/false, "confidence": 0.95, "compatibilityType": "direct_fit/adapter_required/not_compatible", "notes": "explanation"}`,
        },
      ],
    });

    const textContent = message.content.find((c) => c.type === "text");
    if (textContent && textContent.type === "text") {
      const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    }

    return {
      compatible: false,
      confidence: 0,
      compatibilityType: "unknown",
      notes: "Unable to determine compatibility",
    };
  } catch (error) {
    console.error("AI compatibility check error:", error);
    throw error;
  }
}
