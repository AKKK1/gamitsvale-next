// app/api/listings/route.ts
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Listing, User } from '@/lib/models';
import { getUserFromRequest } from '@/lib/auth';
import { CONFIG } from '@/lib/config';

// ─────────────────────────────────────────────────────────────────────────────
// 🔍 GET: განცხადებების მიღება (ფილტრებით)
// ─────────────────────────────────────────────────────────────────────────────
export async function GET(request: Request) {
  await connectDB();
  const { searchParams } = new URL(request.url);

  const query: any = { isTraded: false };
  const category = searchParams.get('category');
  const city = searchParams.get('city');
  const condition = searchParams.get('condition');
  const owner = searchParams.get('owner');
  const search = searchParams.get('search');
  const type = searchParams.get('type');

  if (category) query.category = category;
  if (city) query.city = city;
  if (condition) query.condition = condition;
  if (owner) query.owner = owner;

  if (search) {
    if (type === 'want') {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    } else if (type === 'give') {
      query.wantedItems = { $regex: search, $options: 'i' };
    }
  }

  const listings = await Listing.find(query)
    .sort({ isVIP: -1, createdAt: -1 })
    .populate('owner', 'name avatar');

  return NextResponse.json(listings);
}

// ─────────────────────────────────────────────────────────────────────────────
// ➕ POST: ახალი განცხადების შექმნა
// ─────────────────────────────────────────────────────────────────────────────
export async function POST(request: Request) {
  await connectDB();
  const decoded = getUserFromRequest(request);
  if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await User.findById(decoded.id);
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const body = await request.json();
  
  console.log("📦 API RECEIVED body:", {
    tradePeriod: body.tradePeriod,
    tradeDuration: body.tradeDuration,
    tradeUnit: body.tradeUnit,
  });

  const { title, category, city, description, condition, listingType } = body;

  // ── დღიური ლიმიტი ──────────────────────────────────────────────────
  const isNormal = !listingType || listingType === 'NORMAL';

  if (isNormal && user.role !== 'ADMIN') {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const lastPost = new Date(user.lastPostDate || 0); lastPost.setHours(0, 0, 0, 0);
    if (today > lastPost) {
      user.dailyPostCount = 0;
      user.lastPostDate = new Date();
    }
    if (user.dailyPostCount >= CONFIG.LISTINGS.DAILY_LIMIT) {
      return NextResponse.json({ error: 'დღიური ლიმიტი ამოწურულია' }, { status: 403 });
    }
  }

  // ── ვალიდაცია ───────────────────────────────────────────────────────
  if (!title?.trim()) return NextResponse.json({ error: 'სათაური სავალდებულოა' }, { status: 400 });
  if (!category?.trim()) return NextResponse.json({ error: 'კატეგორია სავალდებულოა' }, { status: 400 });
  if (!city?.trim()) return NextResponse.json({ error: 'ქალაქი სავალდებულოა' }, { status: 400 });
  if (!description?.trim()) return NextResponse.json({ error: 'აღწერა სავალდებულოა' }, { status: 400 });

  // ── ფასი ────────────────────────────────────────────────────────────
  const cost = CONFIG.PRICING[listingType as keyof typeof CONFIG.PRICING] ?? 0;
  if (user.balance < cost)
    return NextResponse.json({ error: 'ბალანსი არ არის საკმარისი' }, { status: 403 });

  // ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
  // 🔁 გაცვლის პერიოდის ველების დამუშავება
  // ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
  
  // 1. ვქმნით "სუფთა" ობიექტს გარეშე გაცვლის ველების
  const { tradePeriod: _, tradeDuration: __, tradeUnit: ___, ...cleanBody } = body;
  
  // 2. ვამუშავებთ გაცვლის პერიოდს
  const tradePeriod = body.tradePeriod === 'temporary' ? 'temporary' : 'permanent';
  
  const tradeDuration = tradePeriod === 'temporary' 
    ? Math.max(1, Math.min(999, parseInt(body.tradeDuration) || 1))
    : null;
    
  const tradeUnit = tradePeriod === 'temporary' 
    ? ['day', 'week', 'month', 'year'].includes(body.tradeUnit) 
      ? body.tradeUnit 
      : 'month'
    : null;
  
  console.log("💾 WILL SAVE trade fields:", { tradePeriod, tradeDuration, tradeUnit });
  // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

  // ▼▼▼ შექმნა ▼▼▼
  const listing = await Listing.create({
    ...cleanBody,  // ◄── cleanBody, არა body!
    owner: decoded.id,
    isVIP: listingType === 'VIP',
    tradePeriod,   // ◄── ცალკე დამატება
    tradeDuration, // ◄── ცალკე დამატება
    tradeUnit,     // ◄── ცალკე დამატება
  });

  console.log("✅ SAVED listing._id:", listing._id, "tradePeriod:", listing.tradePeriod);

  if (isNormal) {
    user.dailyPostCount += 1;
  }
  user.balance -= cost;
  await user.save();

  return NextResponse.json(listing, { status: 201 });
}