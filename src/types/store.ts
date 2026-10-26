export type LeagueId = 'Premier League' | 'Ligue 1' | 'LaLiga' | 'Serie A';

export type KeychainModelType = '3D Kit Jersey' | 'Club Shield' | 'Striker Boot' | 'Trophy Edition';

export type HardwareFinish = '18K Brushed Gold' | 'Anodized Gunmetal' | 'Mirror Surgical Steel';

export interface KeychainProduct {
  id: string;
  name: string;
  clubInspiration: string;
  league: LeagueId;
  modelType: KeychainModelType;
  priceIdr: number;
  originalPriceIdr?: number;
  isFeaturedDiscount?: boolean;
  weightGrams: number;
  materialSpec: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  kitNumber: string;
  engravingDefault: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  editionTag: string;
  description: string;
  customImageUrl?: string;
}

export interface CartItem {
  cartItemId: string;
  product: KeychainProduct;
  quantity: number;
  selectedFinish: HardwareFinish;
  customEngraving?: string;
}

export interface SupporterReview {
  id: string;
  authorName: string;
  role: string;
  organization: string;
  league: LeagueId;
  rating: number;
  comment: string;
  verifiedPurchase: string;
  date: string;
}

export interface CollaborationEvent {
  id: string;
  type: 'Collaboration' | 'Upcoming Event';
  title: string;
  partner: string;
  date: string;
  location: string;
  description: string;
  EditionNote: string;
  spotsRemaining: number;
  customBannerUrl?: string;
}

export interface StoreConfig {
  brandName: string;
  heroKicker: string;
  heroHeadline: string;
  heroSubheadline: string;
  promoVideoTitle: string;
  customVideoUrl?: string;
  aboutHeadline: string;
  aboutStory: string;
  whatsappNumber: string;
  publicShareUrl: string;
  freeShippingThresholdIdr: number;
  ownerEmail: string;
  ownerPasscode: string;
}

export type PaymentMethodId = 'QRIS' | 'GOPAY' | 'DANA' | 'PAYPAL' | 'WHATSAPP';
