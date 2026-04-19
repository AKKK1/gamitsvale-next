// ============================================================
// config.ts — საიტის ყველა ცვლადი ერთ ადგილას
// აქ შეცვალე რიცხვები და სხვა ლოგიკა ეგრევე განახლდება
// ============================================================

export const CONFIG = {

  // 📝 განცხადებები
  LISTINGS: {
    DAILY_LIMIT: 3,           // დღეში მაქს რამდენი პოსტი შეიძლება
    MAX_IMAGES: 5,            // პოსტზე მაქს ფოტო
    MAX_WANTED_ITEMS: 3,      // "გაცვლა მინდა" მაქს რაოდენობა
    IMAGE_MAX_SIZE_MB: 10,    // ფოტოს მაქს ზომა MB-ში
  },

  // 💰 ფასები
  PRICING: {
    NORMAL: 0,   // უფასო
    SILVER: 25,  // SILVER განცხადება — ₾
    VIP: 50,     // VIP განცხადება — ₾
  },

  // 🤝 შეთავაზებები
  OFFERS: {
    MAX_IMAGES: 3,  // შეთავაზებაზე მაქს ფოტო
  },

  // 💰 ბალანსი
  BALANCE: {
    TOP_UP_AMOUNT: 50,           // ერთჯერადი შევსების თანხა
    TOP_UP_COOLDOWN_HOURS: 24,   // შევსებებს შორის დრო საათებში
  },

  // 🖼 Cloudinary
  CLOUDINARY: {
    IMAGE_MAX_WIDTH: 1200,
    IMAGE_QUALITY: 'auto:good' as const,
  },

  // ⏰ JWT
  JWT: {
    EXPIRES_IN: '7d',  // ტოკენის ვადა
  },

} as const;