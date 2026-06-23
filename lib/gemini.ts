import { GoogleGenerativeAI } from "@google/generative-ai";
import { ScanResult, type ScanInput } from "@/types";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const SCAM_ANALYSIS_PROMPT = `You are InternShield AI, an expert cybersecurity analyst specializing in detecting fake internship offers, scam job postings, and fraudulent recruiter activities targeting college students.

Analyze the following content for scam indicators. Be thorough and explain your reasoning.

## DETECTION CRITERIA:

### Payment Scams (Critical)
- Registration fees, training fees, security deposits
- Verification fees, processing fees
- Any request for money upfront

### Fake Recruiters (High Risk)
- Gmail, Yahoo, Hotmail recruiters instead of company domain
- Generic email domains
- Missing or unverifiable recruiter identity
- No LinkedIn profile

### Psychological Manipulation (Medium Risk)
- Urgency tactics ("act now", "limited time")
- Fear tactics ("miss this opportunity")
- Scarcity ("only 3 seats left")
- Pressure to decide immediately

### Unrealistic Claims (High Risk)
- Extremely high salary for simple work
- Guaranteed income without interview
- "No experience needed" for high-paying roles
- Instant hiring without proper process

### Missing Details (Medium Risk)
- No company website
- No physical address
- No recruiter identity or contact
- Vague job description
- No clear company registration

## OUTPUT FORMAT:
Return a valid JSON object with this exact structure:
{
  "scam_score": <number 0-100>,
  "risk_level": "<safe|low|medium|high|critical>",
  "red_flags": [
    {
      "category": "<payment_scam|fake_recruiter|psychological_manipulation|unrealistic_claims|missing_details>",
      "severity": "<low|medium|high|critical>",
      "title": "<short title>",
      "description": "<detailed explanation>",
      "evidence": "<specific text from input that triggered this>"
    }
  ],
  "ai_explanation": "<2-3 paragraph detailed analysis>",
  "recommendations": [
    "<actionable recommendation>"
  ],
  "extracted_info": {
    "company_name": "<if found>",
    "recruiter_name": "<if found>",
    "recruiter_email": "<if found>",
    "salary_mentioned": "<if found>",
    "payment_requested": "<if found>",
    "platform": "<where this was posted>"
  }
}

Risk Level Thresholds:
- 0-20: safe
- 21-40: low
- 41-60: medium
- 61-80: high
- 81-100: critical

Return ONLY valid JSON. No markdown, no code blocks, just the raw JSON object.`;

export async function analyzeContent(input: ScanInput): Promise<ScanResult> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const userMessage = `Analyze the following content for potential scam indicators:

Content Type: ${input.type}
Platform: ${input.platform || "Unknown"}

Content:
${input.text}

Provide a comprehensive scam analysis following the criteria and output format specified.`;

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: SCAM_ANALYSIS_PROMPT + "\n\n" + userMessage }] }],
      generationConfig: {
        temperature: 0.3,
        topP: 0.8,
        maxOutputTokens: 4096,
        responseMimeType: "application/json",
      },
    });

    const response = result.response;
    const text = response.text();

    const parsed = JSON.parse(text);

    return {
      scam_score: parsed.scam_score ?? 50,
      risk_level: parsed.risk_level ?? "medium",
      red_flags: parsed.red_flags ?? [],
      ai_explanation: parsed.ai_explanation ?? "Analysis completed but no detailed explanation was provided.",
      recommendations: parsed.recommendations ?? [
        "Verify the company through official channels",
        "Never pay any upfront fees",
        "Research the recruiter on LinkedIn",
      ],
      extracted_info: parsed.extracted_info ?? {},
      raw_response: parsed,
    };
  } catch (error) {
    console.error("Gemini analysis error:", error);
    throw new Error(
      "Failed to analyze content. Please try again or check your API key configuration."
    );
  }
}

export async function analyzeOfferLetter(text: string): Promise<ScanResult> {
  const offerLetterPrompt = `You are analyzing an internship/job offer letter for potential fraud.

Look for these specific indicators in offer letters:
- Missing company letterhead or official formatting
- Generic salutation instead of personalized
- Unrealistic compensation
- Requests for payment or bank details upfront
- Missing HR contact information
- No company registration number
- Poor grammar or formatting inconsistencies
- Missing start date, location, or role specifics
- No mention of interview process
- Guaranteed placement without proper assessment

Analyze this offer letter content:

${text}

Return the same JSON structure as the main analysis, but with focus on offer letter specific fraud indicators.`;

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: SCAM_ANALYSIS_PROMPT + "\n\n" + offerLetterPrompt }] }],
      generationConfig: {
        temperature: 0.3,
        topP: 0.8,
        maxOutputTokens: 4096,
        responseMimeType: "application/json",
      },
    });

    const response = result.response;
    const text = response.text();
    const parsed = JSON.parse(text);

    return {
      scam_score: parsed.scam_score ?? 50,
      risk_level: parsed.risk_level ?? "medium",
      red_flags: parsed.red_flags ?? [],
      ai_explanation: parsed.ai_explanation ?? "Offer letter analysis completed.",
      recommendations: parsed.recommendations ?? [
        "Verify the offer directly with the company's HR department",
        "Check if the company domain matches the email domain",
        "Look up the company registration number",
        "Never pay any fees to accept an offer",
      ],
      extracted_info: parsed.extracted_info ?? {},
      raw_response: parsed,
    };
  } catch (error) {
    console.error("Gemini offer letter analysis error:", error);
    throw new Error("Failed to analyze offer letter. Please try again.");
  }
}
