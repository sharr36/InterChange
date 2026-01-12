import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { findCrossReferences } from "@/lib/ai";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const partId = searchParams.get("partId");

    if (!partId) {
      return NextResponse.json({ error: "Part ID required" }, { status: 400 });
    }

    // Get the part
    const part = await prisma.part.findUnique({
      where: { id: partId },
      include: {
        category: true,
        subCategory: true,
        equivalents: {
          include: {
            equivalentPart: {
              include: {
                category: true,
              },
            },
          },
        },
      },
    });

    if (!part) {
      return NextResponse.json({ error: "Part not found" }, { status: 404 });
    }

    // Get existing cross-references
    const existingCrossRefs = part.equivalents.map((e) => e.equivalentPart);

    // Get all parts in same category for AI analysis
    const categoryParts = await prisma.part.findMany({
      where: {
        categoryId: part.categoryId,
        status: "APPROVED",
        id: { not: partId },
      },
      include: {
        category: true,
        subCategory: true,
      },
      take: 100,
    });

    // Use AI to find additional cross-references
    const aiSuggestions = await findCrossReferences(part, categoryParts);

    // Merge existing and AI-suggested cross-references
    const allCrossRefs = [
      ...existingCrossRefs.map((p) => ({
        ...p,
        source: "database",
        confidence: 1.0,
      })),
      ...aiSuggestions
        .map((s: any) => {
          const partData = categoryParts.find((p) => p.id === s.partId);
          if (partData) {
            return {
              ...partData,
              source: "ai",
              confidence: s.confidenceScore,
              compatibilityType: s.compatibilityType,
              notes: s.notes,
            };
          }
          return null;
        })
        .filter(Boolean),
    ];

    return NextResponse.json({ crossReferences: allCrossRefs });
  } catch (error) {
    console.error("Cross-reference error:", error);
    return NextResponse.json(
      { error: "Failed to find cross-references" },
      { status: 500 }
    );
  }
}
