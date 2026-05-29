// app/api/listings/[id]/route.ts
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Listing, User } from '@/lib/models';
import { getUserFromRequest } from '@/lib/auth';
import { CONFIG } from '@/lib/config';

// ─────────────────────────────────────────────────────────────────────────────
// ✏️ PATCH: განცხადების რედაქტირება
// ─────────────────────────────────────────────────────────────────────────────
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // ◄── Next.js 15: params არის Promise!
) {
  await connectDB();
  const decoded = getUserFromRequest(request);
  if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await User.findById(decoded.id);
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const body = await request.json();
  
  // ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
  // 🔑 Next.js 15 FIX: params უნდა იყოს awaited!
  // ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
  const { id } = await params; // ◄── აუცილებელია await!
  // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

  console.log("📦 PATCH received for id:", id, "body:", {
    tradePeriod: body.tradePeriod,
    tradeDuration: body.tradeDuration,
    tradeUnit: body.tradeUnit,
  });

  // ▼▼▼ ვალიდაცია: განცხადება არსებობს? ▼▼▼
  const existingListing = await Listing.findById(id);
  if (!existingListing) {
    return NextResponse.json({ error: 'განცხადება არ მოიძებნა' }, { status: 404 });
  }
  
  // ▼▼▼ ვალიდაცია: მფლობელობა ▼▼▼
  if (existingListing.owner.toString() !== decoded.id && user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'არ აქვს წვდომა' }, { status: 403 });
  }

  if (
    body.listingType === 'EXCLUSIVE' &&
    user.role !== 'ADMIN' &&
    !user.canPostExclusive
  ) {
    return NextResponse.json(
      { error: 'ამ ანგარიშისთვის EXCLUSIVE განცხადების შექმნა ჯერ ჩართული არ არის' },
      { status: 403 }
    );
  }

  // ▼▼▼ სავალდებულო ველების ვალიდაცია ▼▼▼
  const { title, category, city, description } = body;
  if (title !== undefined && !title?.trim()) 
    return NextResponse.json({ error: 'სათაური სავალდებულოა' }, { status: 400 });
  if (category !== undefined && !category?.trim()) 
    return NextResponse.json({ error: 'კატეგორია სავალდებულოა' }, { status: 400 });
  if (city !== undefined && !city?.trim()) 
    return NextResponse.json({ error: 'ქალაქი სავალდებულოა' }, { status: 400 });
  if (description !== undefined && !description?.trim()) 
    return NextResponse.json({ error: 'აღწერა სავალდებულოა' }, { status: 400 });

  // ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
  // 🔁 გაცვლის პერიოდის ველების დამუშავება
  // ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
  
  // 1. ვქმნით "სუფთა" ობიექტს გარეშე გაცვლის ველების (რათა ...body არ გადაფაროს)
  const { tradePeriod: _, tradeDuration: __, tradeUnit: ___, ...cleanBody } = body;
  
  const updateData: any = { ...cleanBody };
  if (body.listingType !== undefined) {
    updateData.isVIP =
      body.listingType === 'VIP' || body.listingType === 'EXCLUSIVE';
  }
  
  // 2. თუ tradePeriod არის გაგზავნილი, დავამუშავოთ
  if (body.tradePeriod !== undefined) {
    const tradePeriod = body.tradePeriod === 'temporary' ? 'temporary' : 'permanent';
    updateData.tradePeriod = tradePeriod;
    
    if (tradePeriod === 'temporary') {
      // დროებითი: ვამოწმებთ და ვინარჩუნებთ
      updateData.tradeDuration = Math.max(1, Math.min(999, parseInt(body.tradeDuration) || 1));
      updateData.tradeUnit = ['day', 'week', 'month', 'year'].includes(body.tradeUnit) 
        ? body.tradeUnit 
        : 'month';
    } else {
      // მუდმივი: ვასუფთავებთ
      updateData.tradeDuration = null;
      updateData.tradeUnit = null;
    }
  }
  
  console.log("💾 PATCH will update:", { 
    tradePeriod: updateData.tradePeriod,
    tradeDuration: updateData.tradeDuration,
    tradeUnit: updateData.tradeUnit 
  });
  // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

  // ▼▼▼ განახლება ▼▼▼
  const updatedListing = await Listing.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true }
  );

  console.log("✅ PATCH updated listing._id:", updatedListing?._id);

  return NextResponse.json(updatedListing);
}

// ─────────────────────────────────────────────────────────────────────────────
// 🗑️ DELETE: განცხადების წაშლა
// ─────────────────────────────────────────────────────────────────────────────
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // ◄── Next.js 15: params არის Promise!
) {
  await connectDB();
  const decoded = getUserFromRequest(request);
  if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await User.findById(decoded.id);
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  // ▼▼▼ Next.js 15 FIX ▼▼▼
  const { id } = await params; // ◄── აუცილებელია await!
  // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲
  
  const listing = await Listing.findById(id);
  if (!listing) {
    return NextResponse.json({ error: 'განცხადება არ მოიძებნა' }, { status: 404 });
  }
  
  if (listing.owner.toString() !== decoded.id && user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'არ აქვს წვდომა' }, { status: 403 });
  }

  await Listing.findByIdAndDelete(id);
  
  return NextResponse.json({ message: 'განცხადება წაიშალა' });
}

// ─────────────────────────────────────────────────────────────────────────────
// 🔍 GET: ერთი განცხადების მიღება (ოფციონალური, თუ გჭირდება)
// ─────────────────────────────────────────────────────────────────────────────
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  
  const { id } = await params; // ◄── Next.js 15 FIX
  
  const listing = await Listing.findById(id)
    .populate('owner', 'name avatar username');
    
  if (!listing) {
    return NextResponse.json({ error: 'განცხადება არ მოიძებნა' }, { status: 404 });
  }
  
  return NextResponse.json(listing);
}
