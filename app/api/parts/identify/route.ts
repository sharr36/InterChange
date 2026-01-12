import { NextResponse } from "next/server";
import { analyzePartImage } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // Convert to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");

    // Analyze with AI
    const analysis = await analyzePartImage(base64, file.type);

    return NextResponse.json({
      success: true,
      analysis,
    });
  } catch (error) {
    console.error("Part identification error:", error);
    return NextResponse.json(
      { error: "Failed to identify part" },
      { status: 500 }
    );
  }
}
