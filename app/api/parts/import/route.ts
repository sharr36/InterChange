import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parse } from "csv-parse/sync";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const userId = formData.get("userId") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 401 });
    }

    // Read CSV file
    const text = await file.text();
    const records = parse(text, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    // Create import job
    const importJob = await prisma.importJob.create({
      data: {
        fileName: file.name,
        status: "processing",
        totalRows: records.length,
      },
    });

    // Process records
    let processedCount = 0;
    let errorCount = 0;
    const errors: any[] = [];

    for (const record of records) {
      try {
        // Validate required fields
        if (!record.partNumber || !record.manufacturer || !record.description) {
          throw new Error("Missing required fields");
        }

        // Get or create category
        let category = await prisma.category.findUnique({
          where: { name: record.category || "Uncategorized" },
        });

        if (!category) {
          category = await prisma.category.create({
            data: {
              name: record.category || "Uncategorized",
              slug: (record.category || "uncategorized")
                .toLowerCase()
                .replace(/\s+/g, "-"),
            },
          });
        }

        // Parse specifications from CSV
        const specifications: any = {};
        Object.keys(record).forEach((key) => {
          if (
            !["partNumber", "manufacturer", "description", "category"].includes(
              key
            )
          ) {
            specifications[key] = record[key];
          }
        });

        // Create part
        await prisma.part.create({
          data: {
            partNumber: record.partNumber,
            manufacturerPartNumber: record.manufacturerPartNumber,
            manufacturer: record.manufacturer,
            description: record.description,
            categoryId: category.id,
            specifications: specifications,
            status: "PENDING",
            createdById: userId,
          },
        });

        processedCount++;
      } catch (error: any) {
        errorCount++;
        errors.push({
          row: processedCount + errorCount,
          error: error.message,
          data: record,
        });
      }
    }

    // Update import job
    await prisma.importJob.update({
      where: { id: importJob.id },
      data: {
        status: errorCount === records.length ? "failed" : "completed",
        processedRows: processedCount,
        errorRows: errorCount,
        errors: errors,
        completedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      importJobId: importJob.id,
      totalRows: records.length,
      processedRows: processedCount,
      errorRows: errorCount,
      errors: errors.slice(0, 10), // Return first 10 errors
    });
  } catch (error: any) {
    console.error("Import error:", error);
    return NextResponse.json(
      { error: "Failed to import CSV", details: error.message },
      { status: 500 }
    );
  }
}
