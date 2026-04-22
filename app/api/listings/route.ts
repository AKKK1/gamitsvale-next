// app/api/listings/route.ts
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Listing, User } from '@/lib/models';
import { getUserFromRequest } from '@/lib/auth';
import { CONFIG } from '@/lib/config';

// ─────────────────────────────────────────────────────────────────────────────
// 🔍 GET: განცხადებების მიღება
// ─────────────────────────────────────────────────────────────────────────────
export async function GET(request: Request) {
  await connectDB();
  const { searchParams } = new URL(request.url);

  // ── ?counts=1 — კატეგორიების count-ები ──────────────────────────────────
  // გამოიყენება CategoriesSection + /categories გვერდზე
  if (searchParams.get('counts') === '1') {
    const pipeline = [
      { $match: { isTraded: false } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ];
    const result = await Listing.aggregate(pipeline);
    const map = Object.fromEntries(
      result.map((r: { _id: string; count: number }) => [r._id, r.count])
    );
    return NextResponse.json(map);
  }

  // ── ჩვეულებრივი ფილტრი ──────────────────────────────────────────────────
  const query: any = { isTraded: false };

  const category     = searchParams.get('category');
  const city         = searchParams.get('city');
  const condition    = searchParams.get('condition');
  const owner        = searchParams.get('owner');
  const search       = searchParams.get('search');
  const type         = searchParams.get('type');
  const listingType  = searchParams.get('listingType');
  const tradePeriod  = searchParams.get('tradePeriod');   // ← ახალი: "temporary" | "permanent"

  if (category)    query.category    = category;
  if (city)        query.city        = city;
  if (condition)   query.condition   = condition;
  if (owner)       query.owner       = owner;
  if (listingType) query.listingType = listingType;

  // გაცვლის პერიოდი: swap-temporary გვერდი იყენებს tradePeriod=temporary
  if (tradePeriod) query.tradePeriod = tradePeriod;

  if (search) {
    if (type === 'want') {
      query.$or = [
        { title:       { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    } else if (type === 'give') {
      query.wantedItems = { $regex: search, $options: 'i' };
    }
  }

  // პაგინაცია (swap-temporary გვერდი იყენებს page + limit)
  const page  = parseInt(searchParams.get('page')  || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '0', 10); // 0 = ყველა

  let dbQuery = Listing.find(query)
    .sort({ isVIP: -1, createdAt: -1 })
    .populate('owner', 'name avatar');

  let total = 0;
  if (limit > 0) {
    total = await Listing.countDocuments(query);
    dbQuery = dbQuery.skip((page - 1) * limit).limit(limit) as typeof dbQuery;
  }

  const listings = await dbQuery;

  const res = NextResponse.json(listings);
  if (limit > 0) {
    res.headers.set('X-Total-Count', String(total));
  }
  return res;
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

  const { title, category, city, description, condition, listingType } = body;

  const isNormal = !listingType || listingType === 'NORMAL';

  if (isNormal && user.role !== 'ADMIN') {
    const today    = new Date(); today.setHours(0, 0, 0, 0);
    const lastPost = new Date(user.lastPostDate || 0); lastPost.setHours(0, 0, 0, 0);
    if (today > lastPost) {
      user.dailyPostCount = 0;
      user.lastPostDate   = new Date();
    }
    if (user.dailyPostCount >= CONFIG.LISTINGS.DAILY_LIMIT) {
      return NextResponse.json({ error: 'დღიური ლიმიტი ამოწურულია' }, { status: 403 });
    }
  }

  if (!title?.trim())       return NextResponse.json({ error: 'სათაური სავალდებულოა' },  { status: 400 });
  if (!category?.trim())    return NextResponse.json({ error: 'კატეგორია სავალდებულოა' }, { status: 400 });
  if (!city?.trim())        return NextResponse.json({ error: 'ქალაქი სავალდებულოა' },    { status: 400 });
  if (!description?.trim()) return NextResponse.json({ error: 'აღწერა სავალდებულოა' },    { status: 400 });

  const cost = CONFIG.PRICING[listingType as keyof typeof CONFIG.PRICING] ?? 0;
  if (user.balance < cost)
    return NextResponse.json({ error: 'ბალანსი არ არის საკმარისი' }, { status: 403 });

  // ── გაცვლის პერიოდი ────────────────────────────────────────────────────
  const { tradePeriod: _tp, tradeDuration: _td, tradeUnit: _tu, ...cleanBody } = body;

  const tradePeriod  = body.tradePeriod === 'temporary' ? 'temporary' : 'permanent';
  const tradeDuration = tradePeriod === 'temporary'
    ? Math.max(1, Math.min(999, parseInt(body.tradeDuration) || 1))
    : null;
  const tradeUnit = tradePeriod === 'temporary'
    ? (['day', 'week', 'month', 'year'].includes(body.tradeUnit) ? body.tradeUnit : 'month')
    : null;

  const listing = await Listing.create({
    ...cleanBody,
    owner: decoded.id,
    isVIP: listingType === 'VIP',
    tradePeriod,
    tradeDuration,
    tradeUnit,
  });

  if (isNormal) user.dailyPostCount += 1;
  user.balance -= cost;
  await user.save();

  return NextResponse.json(listing, { status: 201 });
}