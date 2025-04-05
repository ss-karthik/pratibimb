import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyA9jgY9UGGB2Z3lmyB8nQh3nzDsQLqe9CY";
if (!API_KEY) {
  throw new Error("GOOGLE_API_KEY environment variable is not set");
}
const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * @typedef {Object} MedicalCondition
 * @property {string} condition - Name of the health condition
 * @property {string} description - Brief overview of the condition
 * @property {string[]} preventiveMeasures - Methods to prevent or manage the condition
 * @property {string[]} dos - Recommended practices
 * @property {string[]} donts - Practices to avoid
 * @property {string} specialist - Type of medical specialist to consult
 * @property {string[]} foodToAvoid - Foods that may worsen the condition
 * @property {string[]} foodToEat - Foods that may help with the condition
 */

/**
 * Analyze medical report images to provide health recommendations
 * @param {string} base64Image - Base64 encoded image data of medical report
 * @returns {Promise<{conditions: MedicalCondition[], rawResponse: string}>}
 */
export default async function analyzeMedicalReport(base64Image) {
  console.log("Starting medical report analysis...");
  try {
    if (!base64Image) {
      throw new Error("No image data provided");
    }

    const base64Data = base64Image.split(",")[1];
    if (!base64Data) {
      throw new Error("Invalid image data format");
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    console.log("Initialized Gemini model");

    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType: "image/jpeg",
      },
    };

    console.log("Sending image to API...", { imageSize: base64Data.length });
    const prompt = `Analyze this medical report image and extract important health information. The image is of a medical test report, lab result, or diagnostic report. Look for:

1. Test Results and Values:
   - Abnormal values (highlighted or marked with H/L indicators)
   - Values outside reference ranges
   - Critical values or concerning results

2. Diagnoses or Conditions:
   - Any explicitly mentioned diagnoses
   - Indications of potential health conditions based on test results
   - Risk factors identified in the report

3. Health Parameters:
   - Blood test results (CBC, lipid profile, glucose, etc.)
   - Vital signs (blood pressure, heart rate, etc.)
   - Organ function tests (liver, kidney, thyroid, etc.)
   - Other specialized test results visible in the report

For each identified health condition or abnormal parameter, return a JSON object in this exact format:

{
  "conditions": [
    {
      "condition": "Name of the health condition or parameter",
      "description": "Brief explanation of what this condition means",
      "preventiveMeasures": ["Measure 1", "Measure 2", "Measure 3"],
      "dos": ["Do 1", "Do 2", "Do 3"],
      "donts": ["Don't 1", "Don't 2", "Don't 3"],
      "specialist": "Type of specialist to consult",
      "foodToAvoid": ["Food 1", "Food 2", "Food 3"],
      "foodToEat": ["Food 1", "Food 2", "Food 3"]
    }
  ]
}

If multiple conditions are detected, include multiple objects in the array. If no conditions are detected or if the image is not a medical report, return an empty array.

IMPORTANT:
1. Focus only on information visible in the report. Do not invent or assume diagnoses not supported by the report.
2. Provide practical, evidence-based recommendations for each condition.
3. Include a disclaimer that this analysis is not a substitute for professional medical advice.`;

    try {
      const result = await model.generateContent([prompt, imagePart]);

      const response = await result.response;
      const text = response.text();
      console.log("Raw API Response:", text);

      // Try to extract JSON from the response, handling potential code blocks
      let jsonStr = text;

      // First try to extract content from code blocks if present
      const codeBlockMatch = text.match(/```(?:json)?\s*({[\s\S]*?})\s*```/);
      if (codeBlockMatch) {
        jsonStr = codeBlockMatch[1];
        console.log("Extracted JSON from code block:", jsonStr);
      } else {
        // If no code block, try to find raw JSON
        const jsonMatch = text.match(/\{[^]*\}/);
        if (jsonMatch) {
          jsonStr = jsonMatch[0];
          console.log("Extracted raw JSON:", jsonStr);
        }
      }

      try {
        const parsed = JSON.parse(jsonStr);
        return {
          conditions: parsed.conditions || [],
          rawResponse: text,
        };
      } catch (parseError) {
        console.error("Error parsing JSON:", parseError);
        throw new Error("Failed to parse API response");
      }
    } catch (error) {
      console.error("Error calling API:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error in analyzeMedicalReport:", error);
    throw error;
  }
}