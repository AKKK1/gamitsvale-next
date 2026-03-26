// app/listing/[id]/page.tsx

import { Metadata } from "next";
import ListingPageClient from "./ListingPageClient";

const APP_URL = process.env.APP_URL || "https://gamitsvale.ge";

async function getListing(id: string) {
  try {
    const res = await fetch(`${APP_URL}/api/listings/${id}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const listing = await getListing(id);

  if (!listing) {
    return { title: "განცხადება | GAMITSVALE.GE" };
  }

  const title = `${listing.title} — გაცვლა ${listing.city || "საქართველოში"}`;
  const description = listing.description
    ? listing.description.slice(0, 155)
    : `${listing.title} — გაცვლა GAMITSVALE.GE-ზე`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${APP_URL}/listing/${id}`,
      siteName: "GAMITSVALE.GE",
      locale: "ka_GE",
      type: "website",
      images: [
        {
          url: `${APP_URL}/listing/${id}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${APP_URL}/listing/${id}/opengraph-image`],
    },
  };
}

export default async function ListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const initialListing = await getListing(id);
  return <ListingPageClient id={id} initialListing={initialListing} />;
}
