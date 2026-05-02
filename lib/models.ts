// models/index.ts
import mongoose from 'mongoose';

// ─────────────────────────────────────────────────────────────────────────────
// USER SCHEMA - მომხმარებლის მონაცემები
// ─────────────────────────────────────────────────────────────────────────────
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  isVerified: { type: Boolean, default: false },
  verificationCode: { type: String },
  resetPasswordCode: { type: String },
  phone: { type: String },
  username: { type: String, unique: true, sparse: true },
  instagram: { type: String },
  facebook: { type: String },
  whatsapp: {type: String},
  telegram: {type: String},

  avatar: { type: String },
  balance: { type: Number, default: 0 },
  role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },
  savedListings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Listing' }],
  dailyPostCount: { type: Number, default: 0 },
  lastPostDate: { type: Date, default: Date.now },
  isBlocked: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  facebookId: { type: String, sparse: true },
});

// ─────────────────────────────────────────────────────────────────────────────
// LISTING SCHEMA - განცხადების მონაცემები
// ─────────────────────────────────────────────────────────────────────────────
const ListingSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  city: { type: String, required: true },
  condition: { type: String, enum: ['NEW', 'USED'], required: true },
  images: [{ type: String }],
  wantedItems: [{ type: String }],
  listingType: { type: String, enum: ['NORMAL', 'SILVER', 'VIP'], default: 'NORMAL' },
  isVIP: { type: Boolean, default: false },
  isTraded: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date },
  serviceWanted: { type: String, default: '' },
  wantedType: { type: String, enum: ['items', 'service'], default: 'items' },

  // ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
  // 🔁 გაცვლის პერიოდის ველები - ახალი დამატება (2026)
  // ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
  
  /**
   * გაცვლის ტიპი:
   * - "permanent" = მუდმივი გაცვლა (დეფოლტი)
   * - "temporary" = დროებითი გაცვლა (მითითებული ვადით)
   */
  tradePeriod: { 
    type: String, 
    enum: ['permanent', 'temporary'], 
    default: 'permanent' 
  },
  
  /**
   * გაცვლის ხანგრძლივობა (რიცხვი)
   * - მნიშვნელობა: 1-დან 999-მდე
   * - ინახება მხოლოდ თუ tradePeriod === "temporary"
   * - permanent-ის შემთხვევაში: null
   */
  tradeDuration: { 
    type: Number, 
    default: null,
    min: 1,
    max: 999
  },
  
  /**
   * დროის ერთეული:
   * - "day" = დღე, "week" = კვირა, "month" = თვე, "year" = წელი
   * - ინახება მხოლოდ თუ tradePeriod === "temporary"
   */
  tradeUnit: { 
    type: String, 
    enum: ['day', 'week', 'month', 'year'], 
    default: null 
  },
  
  // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲
  // 🔁 გაცვლის პერიოდის ველები - დასრულებულია
  // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲
});

// ─────────────────────────────────────────────────────────────────────────────
// OFFER SCHEMA - შეთავაზების მონაცემები
// ─────────────────────────────────────────────────────────────────────────────
const OfferSchema = new mongoose.Schema({
  listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  description: { type: String, required: true },
  images: [{ type: String }],
  status: { type: String, enum: ['PENDING', 'ACCEPTED', 'DECLINED', 'THINKING'], default: 'PENDING' },
  createdAt: { type: Date, default: Date.now }
});

// ავტომატური წაშლა 3 დღის შემდეგ (TTL index)
OfferSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 3 });

// ─────────────────────────────────────────────────────────────────────────────
// NOTIFICATION SCHEMA - შეტყობინებების მონაცემები
// ─────────────────────────────────────────────────────────────────────────────
const NotificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['NEW_OFFER', 'OFFER_ACCEPTED', 'OFFER_DECLINED', 'OFFER_THINKING'], required: true },
  offer: { type: mongoose.Schema.Types.ObjectId, ref: 'Offer' },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// ─────────────────────────────────────────────────────────────────────────────
// SETTINGS SCHEMA - საიტის გლობალური პარამეტრები
// ─────────────────────────────────────────────────────────────────────────────
const SettingsSchema = new mongoose.Schema({
  siteName: { type: String, default: 'GAMITSVALE.GE' },
  logo: { type: String },
  seoTitle: { type: String },
  seoDescription: { type: String },
  seoKeywords: { type: String },
  contactEmail: { type: String },
  facebookUrl: { type: String },
  instagramUrl: { type: String },
  updatedAt: { type: Date, default: Date.now }
});

// ─────────────────────────────────────────────────────────────────────────────
// ექსპორტი - ასე იმპორტდება სხვა ფაილებში
// ─────────────────────────────────────────────────────────────────────────────
export const User = mongoose.models.User || mongoose.model('User', UserSchema);
export const Listing = mongoose.models.Listing || mongoose.model('Listing', ListingSchema);
export const Offer = mongoose.models.Offer || mongoose.model('Offer', OfferSchema);
export const Notification = mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);
export const Settings = mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);