import {
  KeychainProduct,
  CartItem,
  LeagueId,
  KeychainModelType,
  PaymentMethodId,
} from '../types/store';

const IDR_TO_USD_RATE = 15800;

/**
 * Formats an integer amount into Indonesian Rupiah (e.g. Rp 129.000)
 */
export function formatRupiah(amountIdr: number): string {
  const safeAmount = Math.max(0, Math.round(amountIdr));
  const formatted = safeAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `Rp ${formatted}`;
}

/**
 * Converts IDR to USD for PayPal display
 */
export function convertIdrToUsd(amountIdr: number): string {
  const usd = Math.max(0, amountIdr) / IDR_TO_USD_RATE;
  return `$${usd.toFixed(2)} USD`;
}

/**
 * Calculates integer discount percentage between original and current price
 */
export function calculateDiscountPercent(
  priceIdr: number,
  originalPriceIdr?: number
): number {
  if (!originalPriceIdr || originalPriceIdr <= priceIdr || originalPriceIdr <= 0) {
    return 0;
  }
  return Math.round(((originalPriceIdr - priceIdr) / originalPriceIdr) * 100);
}

export interface ProductFilterOptions {
  league: LeagueId | 'ALL';
  modelType: KeychainModelType | 'ALL';
  searchQuery: string;
  onlyDiscounted: boolean;
  maxPriceIdr?: number;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating-desc';
}

/**
 * Filters and sorts the product catalog deterministically
 */
export function filterAndSortProducts(
  products: KeychainProduct[],
  options: ProductFilterOptions
): KeychainProduct[] {
  const query = options.searchQuery.trim().toLowerCase();

  const filtered = products.filter((item) => {
    if (options.league !== 'ALL' && item.league !== options.league) {
      return false;
    }
    if (options.modelType !== 'ALL' && item.modelType !== options.modelType) {
      return false;
    }
    if (options.onlyDiscounted) {
      const hasDiscount =
        Boolean(item.originalPriceIdr && item.originalPriceIdr > item.priceIdr) ||
        Boolean(item.isFeaturedDiscount);
      if (!hasDiscount) return false;
    }
    if (
      typeof options.maxPriceIdr === 'number' &&
      item.priceIdr > options.maxPriceIdr
    ) {
      return false;
    }
    if (query.length > 0) {
      const haystack = `${item.name} ${item.clubInspiration} ${item.league} ${item.modelType} ${item.materialSpec}`.toLowerCase();
      if (!haystack.includes(query)) {
        return false;
      }
    }
    return true;
  });

  return [...filtered].sort((a, b) => {
    if (options.sortBy === 'price-asc') {
      return a.priceIdr - b.priceIdr;
    }
    if (options.sortBy === 'price-desc') {
      return b.priceIdr - a.priceIdr;
    }
    if (options.sortBy === 'rating-desc') {
      if (b.rating !== a.rating) return b.rating - a.rating;
      return b.reviewCount - a.reviewCount;
    }
    // featured default: discounted first, then reviewCount
    const aDisc = a.isFeaturedDiscount ? 1 : 0;
    const bDisc = b.isFeaturedDiscount ? 1 : 0;
    if (bDisc !== aDisc) return bDisc - aDisc;
    return b.reviewCount - a.reviewCount;
  });
}

export interface CartSummary {
  totalQuantity: number;
  subtotalIdr: number;
  totalSavingsIdr: number;
  shippingIdr: number;
  grandTotalIdr: number;
  qualifiesForFreeShipping: boolean;
}

/**
 * Computes subtotal, savings, shipping, and grand total in IDR
 */
export function calculateCartSummary(
  items: CartItem[],
  freeShippingThresholdIdr = 250000
): CartSummary {
  let totalQuantity = 0;
  let subtotalIdr = 0;
  let totalSavingsIdr = 0;

  for (const item of items) {
    if (item.quantity <= 0) continue;
    totalQuantity += item.quantity;
    subtotalIdr += item.product.priceIdr * item.quantity;
    if (
      item.product.originalPriceIdr &&
      item.product.originalPriceIdr > item.product.priceIdr
    ) {
      totalSavingsIdr +=
        (item.product.originalPriceIdr - item.product.priceIdr) * item.quantity;
    }
  }

  const qualifiesForFreeShipping =
    subtotalIdr >= freeShippingThresholdIdr || subtotalIdr === 0;
  const shippingIdr =
    subtotalIdr === 0 ? 0 : qualifiesForFreeShipping ? 0 : 18000;
  const grandTotalIdr = subtotalIdr + shippingIdr;

  return {
    totalQuantity,
    subtotalIdr,
    totalSavingsIdr,
    shippingIdr,
    grandTotalIdr,
    qualifiesForFreeShipping,
  };
}

/**
 * Builds a complete WhatsApp checkout URL and formatted message in English & IDR
 */
export function buildWhatsAppOrderUrl(params: {
  whatsappNumber: string;
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  paymentMethod: PaymentMethodId;
  items: CartItem[];
  summary: CartSummary;
  orderCode: string;
}): { url: string; message: string } {
  const cleanPhone = params.whatsappNumber.replace(/[^0-9]/g, '') || '6281298765432';
  const itemLines = params.items
    .map(
      (item, idx) =>
        `${idx + 1}. ${item.product.name} (${item.product.league}) x${item.quantity} — ${formatRupiah(
          item.product.priceIdr * item.quantity
        )} [${item.selectedFinish}${
          item.customEngraving ? ` | Engraving: "${item.customEngraving}"` : ''
        }]`
    )
    .join('\n');

  const message = [
    `Hello BKeychains Official! I would like to confirm my order ${params.orderCode}:`,
    '',
    `Customer: ${params.customerName.trim()}`,
    `Phone: ${params.customerPhone.trim()}`,
    `Shipping Address: ${params.shippingAddress.trim()}`,
    `Payment Method: ${params.paymentMethod}`,
    '',
    'Order Items:',
    itemLines,
    '',
    `Subtotal: ${formatRupiah(params.summary.subtotalIdr)}`,
    `Shipping: ${params.summary.shippingIdr === 0 ? 'FREE' : formatRupiah(params.summary.shippingIdr)}`,
    `Grand Total: ${formatRupiah(params.summary.grandTotalIdr)} (${convertIdrToUsd(
      params.summary.grandTotalIdr
    )})`,
  ].join('\n');

  const encoded = encodeURIComponent(message);
  return {
    url: `https://wa.me/${cleanPhone}?text=${encoded}`,
    message,
  };
}

/**
 * Validates product form input in the owner Store Editor
 */
export function validateProductInput(input: {
  name: string;
  clubInspiration: string;
  priceIdr: number;
  originalPriceIdr?: number;
  kitNumber: string;
}): { valid: boolean; error?: string } {
  if (!input.name || input.name.trim().length < 3) {
    return { valid: false, error: 'Product name must be at least 3 characters.' };
  }
  if (!input.clubInspiration || input.clubInspiration.trim().length < 3) {
    return { valid: false, error: 'Club inspiration description is required.' };
  }
  if (!Number.isFinite(input.priceIdr) || input.priceIdr < 10000) {
    return { valid: false, error: 'Price must be at least Rp 10.000.' };
  }
  if (
    input.originalPriceIdr !== undefined &&
    input.originalPriceIdr > 0 &&
    input.originalPriceIdr <= input.priceIdr
  ) {
    return {
      valid: false,
      error: 'Original price before discount must be higher than selling price.',
    };
  }
  if (!input.kitNumber || input.kitNumber.trim().length === 0) {
    return { valid: false, error: 'Kit/Badge number is required (e.g., 07, 10).' };
  }
  return { valid: true };
}

/**
 * Verifies that only the authorized store owner can unlock Website Edit Mode
 */
export function verifyOwnerCredentials(params: {
  inputEmail: string;
  inputPasscode: string;
  expectedEmail: string;
  expectedPasscode: string;
}): { authorized: boolean; error?: string } {
  const cleanEmail = params.inputEmail.trim().toLowerCase();
  const targetEmail = params.expectedEmail.trim().toLowerCase();

  if (!cleanEmail || !params.inputPasscode) {
    return {
      authorized: false,
      error: 'Please enter both the owner email and owner passkey.',
    };
  }
  if (cleanEmail !== targetEmail) {
    return {
      authorized: false,
      error: 'Access denied: Only the registered owner email can edit this store.',
    };
  }
  if (params.inputPasscode.trim() !== params.expectedPasscode.trim()) {
    return {
      authorized: false,
      error: 'Invalid owner passkey. Please check your credentials.',
    };
  }
  return { authorized: true };
}

