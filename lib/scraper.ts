import axios from "axios";
import * as cheerio from "cheerio";
import { extractPartDataFromText } from "./ai";

export interface ScrapedPartData {
  partNumber?: string;
  manufacturer?: string;
  description?: string;
  specifications?: Record<string, any>;
  images?: string[];
  price?: string;
  url: string;
}

export async function scrapePartData(url: string): Promise<ScrapedPartData | null> {
  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
      timeout: 10000,
    });

    const $ = cheerio.load(response.data);

    // Extract text content
    const title = $("title").text();
    const metaDescription = $('meta[name="description"]').attr("content") || "";

    // Common selectors for part numbers
    const partNumberSelectors = [
      '[itemprop="productID"]',
      '[class*="part-number"]',
      '[id*="part-number"]',
      '[class*="sku"]',
      '[id*="sku"]',
    ];

    let partNumber = "";
    for (const selector of partNumberSelectors) {
      const element = $(selector).first();
      if (element.length) {
        partNumber = element.text().trim();
        break;
      }
    }

    // Extract images
    const images: string[] = [];
    $('img[src*="product"], img[class*="product"], [itemprop="image"]').each((i, el) => {
      const src = $(el).attr("src");
      if (src && !src.includes("logo") && !src.includes("icon")) {
        images.push(src);
      }
    });

    // Get all text for AI processing
    const bodyText = $("body").text().replace(/\s+/g, " ").trim().substring(0, 5000);

    // Use AI to extract structured data
    const aiExtracted = await extractPartDataFromText(bodyText);

    return {
      partNumber: partNumber || aiExtracted?.partNumber,
      manufacturer: aiExtracted?.manufacturer,
      description: aiExtracted?.description || metaDescription || title,
      specifications: aiExtracted?.specifications || {},
      images: images.slice(0, 5),
      url,
    };
  } catch (error) {
    console.error("Scraping error:", error);
    return null;
  }
}

export async function scrapeMultipleUrls(urls: string[]): Promise<ScrapedPartData[]> {
  const results: ScrapedPartData[] = [];

  for (const url of urls) {
    try {
      const data = await scrapePartData(url);
      if (data) {
        results.push(data);
      }
      // Add delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Failed to scrape ${url}:`, error);
    }
  }

  return results;
}

export function extractPartNumberFromUrl(url: string): string | null {
  // Try to extract part number from common URL patterns
  const patterns = [
    /\/([A-Z0-9\-]+)$/i,
    /part[=\/]([A-Z0-9\-]+)/i,
    /sku[=\/]([A-Z0-9\-]+)/i,
    /product[=\/]([A-Z0-9\-]+)/i,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}
