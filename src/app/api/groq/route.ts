import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { systemPrompt, userMessage, conversationHistory } = await req.json();
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error("GROQ_API_KEY is not configured");
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          ...(conversationHistory || []).map((msg: any) => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.text || msg.content
          })),
          { role: "user", content: userMessage }
        ],
        temperature: 0.7,
        max_tokens: 300,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || "Groq API call failed");
    }

    return NextResponse.json({
      reply: data.choices[0]?.message?.content || "Achha... let me check that for you.",
      usage: data.usage,
    });
  } catch (error: any) {
    console.error("Groq API Error:", error);
    // Seamless fallback if API key is invalid/rate-limited
    return NextResponse.json({
      reply: "Haan toh... dekhiye Aveon E1 ka real-world range around 400km hai, aur 28 mins mein fast charge ho jata hai. Kya main aaj shaam ko test drive schedule karoon?",
      isFallback: true,
    });
  }
}
