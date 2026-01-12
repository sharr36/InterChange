import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { searchPartsWithAI } from "@/lib/ai";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");
    const type = searchParams.get("type") || "partNumber";

    if (!query) {
      return NextResponse.json({ error: "Query required" }, { status: 400 });
    }

    let parts = [];

    if (type === "ai") {
      // AI-powered search
      const allParts = await prisma.part.findMany({
        where: { status: "APPROVED" },
        include: {
          category: true,
          subCategory: true,
        },
        take: 100, // Limit for AI processing
      });

      const aiResults = await searchPartsWithAI(query, allParts);

      // Map AI results back to full part objects
      const partIds = aiResults.map((r: any) => r.partId);
      parts = await prisma.part.findMany({
        where: {
          id: { in: partIds },
          status: "APPROVED",
        },
        include: {
          category: true,
          subCategory: true,
        },
      });

      // Sort by AI confidence
      parts = parts.sort((a, b) => {
        const aConf = aiResults.find((r: any) => r.partId === a.id)?.confidence || 0;
        const bConf = aiResults.find((r: any) => r.partId === b.id)?.confidence || 0;
        return bConf - aConf;
      });
    } else {
      // Traditional search
      const whereClause: any = {
        status: "APPROVED",
      };

      if (type === "partNumber") {
        whereClause.OR = [
          { partNumber: { contains: query, mode: "insensitive" } },
          { manufacturerPartNumber: { contains: query, mode: "insensitive" } },
        ];
      } else if (type === "description") {
        whereClause.description = { contains: query, mode: "insensitive" };
      } else if (type === "manufacturer") {
        whereClause.manufacturer = { contains: query, mode: "insensitive" };
      }

      parts = await prisma.part.findMany({
        where: whereClause,
        include: {
          category: true,
          subCategory: true,
        },
        take: 50,
        orderBy: { updatedAt: "desc" },
      });
    }

    return NextResponse.json({ parts, count: parts.length });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    );
  }
}
