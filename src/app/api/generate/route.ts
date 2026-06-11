import { NextRequest, NextResponse } from "next/server";
import { getOpenAI } from "@/lib/openai";
import { getPrisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const styleDescriptions: Record<string, string> = {
  cartoon: "cute cartoon style with bold outlines and simple shapes",
  realistic: "realistic style with detailed outlines and natural proportions",
  mandala: "mandala and geometric pattern style with intricate symmetrical designs",
  anime: "anime/manga style with clean lines and expressive features",
};

const difficultyDescriptions: Record<string, string> = {
  easy: "very simple with large areas, thick bold outlines, minimal detail, suitable for young children ages 3-6",
  medium: "moderate detail, medium-sized areas, suitable for children ages 6-12",
  hard: "highly detailed with intricate patterns, fine lines, suitable for adults and advanced colorists",
};

export async function POST(req: NextRequest) {
  try {
    const { prompt, style, difficulty, sessionId } = await req.json();

    if (!prompt || prompt.trim().length < 3) {
      return NextResponse.json({ error: "Please describe what you want to color" }, { status: 400 });
    }

    const styleDesc = styleDescriptions[style] || styleDescriptions.cartoon;
    const diffDesc = difficultyDescriptions[difficulty] || difficultyDescriptions.medium;

    const imagePrompt = `Create a black and white coloring page illustration: ${prompt}. 
Style: ${styleDesc}. 
Complexity: ${diffDesc}.
Requirements: pure black outlines on pure white background, NO shading, NO gray fills, NO color, NO background textures, clear defined areas for coloring, clean printable coloring book page, high contrast crisp lines only.`;

    const response = await getOpenAI().images.generate({
      model: "dall-e-3",
      prompt: imagePrompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
      style: "natural",
    });

    const imageUrl = (response.data as Array<{url?: string}>)[0]?.url;
    if (!imageUrl) throw new Error("No image generated");

    // Save to DB (fire and forget)
    getPrisma().coloringPage
      .create({
        data: {
          prompt,
          style: style || "cartoon",
          difficulty: difficulty || "medium",
          imageUrl,
          sessionId: sessionId || null,
        },
      })
      .catch(console.error);

    return NextResponse.json({ imageUrl, success: true });
  } catch (error) {
    console.error("Coloring page generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate coloring page. Please try again." },
      { status: 500 }
    );
  }
}
