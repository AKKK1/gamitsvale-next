// app/api/listings/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Listing, User } from "@/lib/models";
import { getUserFromRequest } from "@/lib/auth";
import { CONFIG } from "@/lib/config";

// ─────────────────────────────────────────────────────────────────────────────
// 🔍 GET: განცხადებების მიღება (ფილტრებით + pagination + X-Total-Count)
// ─────────────────────────────────────────────────────────────────────────────
export async function GET(request: Request) {
  await connectDB();
  const { searchParams } = new URL(request.url);

  // ── სპეციალური: კატეგორიების count ──────────────────────────────────────
  // GET /api/listings?counts=1  →  { electronics: 340, vehicles: 95, ... }
  if (searchParams.get("counts") === "1") {
    const agg = await Listing.aggregate([
      { $match: { isTraded: false } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);
    const result: Record<string, number> = {};
    for (const row of agg) {
      if (row._id) result[row._id] = row.count;
    }
    return NextResponse.json(result);
  }

  // ── ჩვეულებრივი query ────────────────────────────────────────────────────
  const query: Record<string, unknown> = { isTraded: false };

  const category = searchParams.get("category");
  const city = searchParams.get("city");
  const condition = searchParams.get("condition");
  const owner = searchParams.get("owner");
  const search = searchParams.get("search");
  const type = searchParams.get("type");
  // დროებითი გაცვლა ფილტრი
  const tradePeriod = searchParams.get("tradePeriod"); // 'temporary' | 'permanent'

  if (category) query.category = category;
  if (city) query.city = city;
  if (condition) query.condition = condition;
  if (owner) query.owner = owner;
  if (tradePeriod) query.tradePeriod = tradePeriod;

  if (search) {
    if (type === "give") {
      query.wantedItems = { $regex: search, $options: "i" };
    } else {
      // default: 'want'
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
  }

  // ── pagination ───────────────────────────────────────────────────────────
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(50, parseInt(searchParams.get("limit") || "20", 10));
  const skip = (page - 1) * limit;

  // ── sort ─────────────────────────────────────────────────────────────────
  const sortParam = searchParams.get("sort") || "newest";
  const sortOrder = sortParam === "oldest" ? 1 : -1;

  // ── ერთდროულად: total count + page data ──────────────────────────────────
  const [totalCount, listings] = await Promise.all([
    Listing.countDocuments(query),
    Listing.find(query)
      .sort({ isVIP: -1, listingType: 1, createdAt: sortOrder })
      .skip(skip)
      .limit(limit)
      .populate("owner", "name avatar"),
  ]);

  const response = NextResponse.json(listings);
  // ── X-Total-Count header — frontend-ი ამ header-ს კითხულობს ──────────────
  response.headers.set("X-Total-Count", String(totalCount));
  response.headers.set("Access-Control-Expose-Headers", "X-Total-Count");

  return response;
}

// ─────────────────────────────────────────────────────────────────────────────
// ➕ POST: ახალი განცხადების შექმნა
// ─────────────────────────────────────────────────────────────────────────────
export async function POST(request: Request) {
  await connectDB();
  const decoded = getUserFromRequest(request);
  if (!decoded)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await User.findById(decoded.id);
  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  const body = await request.json();

  console.log("📦 API RECEIVED body:", {
    tradePeriod: body.tradePeriod,
    tradeDuration: body.tradeDuration,
    tradeUnit: body.tradeUnit,
  });

  const { title, category, city, description, condition, listingType } = body;

  // ── დღიური ლიმიტი ────────────────────────────────────────────────────────
  const isNormal = !listingType || listingType === "NORMAL";
  if (isNormal && user.role !== "ADMIN") {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastPost = new Date(user.lastPostDate || 0);
    lastPost.setHours(0, 0, 0, 0);
    if (today > lastPost) {
      user.dailyPostCount = 0;
      user.lastPostDate = new Date();
    }
    if (user.dailyPostCount >= CONFIG.LISTINGS.DAILY_LIMIT)
      return NextResponse.json(
        { error: "დღიური ლიმიტი ამოწურულია" },
        { status: 403 },
      );
  }

  // ── ვალიდაცია ─────────────────────────────────────────────────────────────
  if (!title?.trim())
    return NextResponse.json(
      { error: "სათაური სავალდებულოა" },
      { status: 400 },
    );
  if (!category?.trim())
    return NextResponse.json(
      { error: "კატეგორია სავალდებულოა" },
      { status: 400 },
    );
  if (!city?.trim())
    return NextResponse.json({ error: "ქალაქი სავალდებულოა" }, { status: 400 });
  if (!description?.trim())
    return NextResponse.json({ error: "აღწერა სავალდებულოა" }, { status: 400 });

  // ── ბალანსი ───────────────────────────────────────────────────────────────
  const cost = CONFIG.PRICING[listingType as keyof typeof CONFIG.PRICING] ?? 0;
  if (user.balance < cost)
    return NextResponse.json(
      { error: "ბალანსი არ არის საკმარისი" },
      { status: 403 },
    );

  // ── გაცვლის პერიოდი ───────────────────────────────────────────────────────
  const {
    tradePeriod: _tp,
    tradeDuration: _td,
    tradeUnit: _tu,
    ...cleanBody
  } = body;

  const tradePeriod =
    body.tradePeriod === "temporary" ? "temporary" : "permanent";
  const tradeDuration =
    tradePeriod === "temporary"
      ? Math.max(1, Math.min(999, parseInt(body.tradeDuration) || 1))
      : null;
  const tradeUnit =
    tradePeriod === "temporary"
      ? ["day", "week", "month", "year"].includes(body.tradeUnit)
        ? body.tradeUnit
        : "month"
      : null;

  console.log("💾 WILL SAVE trade fields:", {
    tradePeriod,
    tradeDuration,
    tradeUnit,
  });

  const listing = await Listing.create({
    ...cleanBody,
    owner: decoded.id,
    isVIP: listingType === "VIP",
    tradePeriod,
    tradeDuration,
    tradeUnit,
  });

  console.log(
    "✅ SAVED listing._id:",
    listing._id,
    "tradePeriod:",
    listing.tradePeriod,
  );

  if (isNormal) user.dailyPostCount += 1;
  user.balance -= cost;
  await user.save();

  return NextResponse.json(listing, { status: 201 });
}
