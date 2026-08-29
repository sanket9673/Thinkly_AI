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
        model: "openai/gpt-oss-120b",
        messages: [
          { role: "system", content: systemPrompt },
          ...(conversationHistory || []).map((msg: any) => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.text || msg.content
          })),
          { role: "user", content: userMessage }
        ],
        temperature: 0.7,
        max_tokens: 2048,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error?.message || "Groq API call failed");
    }

    console.log("[Groq API Response Content]:", data.choices[0]?.message?.content);
    if (!data.choices[0]?.message?.content) {
      console.log("[Groq API Response Full Data]:", JSON.stringify(data));
    }

    return NextResponse.json({
      reply: data.choices[0]?.message?.content || "Achha... let me check that for you.",
      usage: data.usage,
    });
  } catch (error: any) {
    console.error("Groq API Error:", error);
    return NextResponse.json(
      { error: error.message || "Groq API call failed" },
      { status: 500 }
    );
  }
}
