import { MetadataRoute } from "next";
import {connectDB} from "@/lib/db";
import { Listing } from "@/lib/models";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: "https://gamitsvale.ge",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: "https://gamitsvale.ge/rules",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  try {
    await connectDB();

    const listings = await Listing.find(
      { status: { $ne: "EXCHANGED" } },
      { _id: 1, updatedAt: 1 }
    )
      .sort({ createdAt: -1 })
      .limit(5000) // Google sitemap-ის ლიმიტი 50,000 — 5000 საკმარისია
      .lean();

    const listingPages: MetadataRoute.Sitemap = listings.map((l: any) => ({
      url: `https://gamitsvale.ge/listing/${l._id}`,
      lastModified: l.updatedAt || new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    return [...staticPages, ...listingPages];
  } catch (err) {
    // DB error-ის შემთხვევაში static გვერდები მაინც დაბრუნდეს
    console.error("Sitemap DB error:", err);
    return staticPages;
  }
}