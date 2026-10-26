import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatRupiah,
  convertIdrToUsd,
  calculateDiscountPercent,
  filterAndSortProducts,
  calculateCartSummary,
  buildWhatsAppOrderUrl,
  validateProductInput,
  verifyOwnerCredentials,
} from './storeLogic';
import { INITIAL_PRODUCTS } from '../data/initialStoreData';

test('formatRupiah formats Indonesian Rupiah with dot thousands separators', () => {
  assert.equal(formatRupiah(129000), 'Rp 129.000');
  assert.equal(formatRupiah(1500000), 'Rp 1.500.000');
  assert.equal(formatRupiah(0), 'Rp 0');
});

test('convertIdrToUsd converts Rupiah to USD string', () => {
  assert.equal(convertIdrToUsd(158000), '$10.00 USD');
});

test('calculateDiscountPercent returns accurate integer percentage', () => {
  assert.equal(calculateDiscountPercent(129000, 189000), 32);
  assert.equal(calculateDiscountPercent(150000, undefined), 0);
  assert.equal(calculateDiscountPercent(150000, 140000), 0);
});

test('filterAndSortProducts filters by league, discount, and sorts by price', () => {
  const discountedOnly = filterAndSortProducts(INITIAL_PRODUCTS, {
    league: 'ALL',
    modelType: 'ALL',
    searchQuery: '',
    onlyDiscounted: true,
    sortBy: 'price-asc',
  });
  assert.equal(discountedOnly.length, 4);
  assert.ok(discountedOnly[0].priceIdr <= discountedOnly[1].priceIdr);

  const serieA = filterAndSortProducts(INITIAL_PRODUCTS, {
    league: 'Serie A',
    modelType: 'ALL',
    searchQuery: '',
    onlyDiscounted: false,
    sortBy: 'featured',
  });
  assert.equal(serieA.length, 3);
  assert.ok(serieA.every((p) => p.league === 'Serie A'));
});

test('calculateCartSummary computes subtotal, savings, and free shipping threshold', () => {
  const sampleItem = {
    cartItemId: 'item-1',
    product: INITIAL_PRODUCTS[0], // 129,000 (orig 189,000)
    quantity: 2,
    selectedFinish: '18K Brushed Gold' as const,
    customEngraving: 'BRUNO 08',
  };

  const summary = calculateCartSummary([sampleItem], 250000);
  assert.equal(summary.totalQuantity, 2);
  assert.equal(summary.subtotalIdr, 258000);
  assert.equal(summary.totalSavingsIdr, 120000);
  assert.equal(summary.qualifiesForFreeShipping, true);
  assert.equal(summary.shippingIdr, 0);
  assert.equal(summary.grandTotalIdr, 258000);
});

test('buildWhatsAppOrderUrl encodes customer and itemized IDR details', () => {
  const sampleItem = {
    cartItemId: 'item-1',
    product: INITIAL_PRODUCTS[0],
    quantity: 1,
    selectedFinish: '18K Brushed Gold' as const,
    customEngraving: 'CR7',
  };
  const summary = calculateCartSummary([sampleItem], 250000);
  const { url, message } = buildWhatsAppOrderUrl({
    whatsappNumber: '+62 812-9876-5432',
    customerName: 'Andi Wijaya',
    customerPhone: '08123456789',
    shippingAddress: 'Jl. Sudirman No. 45, Jakarta',
    paymentMethod: 'QRIS',
    items: [sampleItem],
    summary,
    orderCode: 'BK-9012',
  });

  assert.ok(url.startsWith('https://wa.me/6281298765432?text='));
  assert.ok(message.includes('BK-9012'));
  assert.ok(message.includes('Rp 129.000'));
  assert.ok(message.includes('QRIS'));
});

test('validateProductInput enforces valid product name and IDR pricing', () => {
  assert.deepEqual(
    validateProductInput({
      name: 'AB',
      clubInspiration: 'Valid Club',
      priceIdr: 120000,
      kitNumber: '10',
    }),
    { valid: false, error: 'Product name must be at least 3 characters.' }
  );

  assert.deepEqual(
    validateProductInput({
      name: 'Madrid Golden Kit',
      clubInspiration: 'Madrid Blancos',
      priceIdr: 150000,
      originalPriceIdr: 120000,
      kitNumber: '09',
    }),
    {
      valid: false,
      error: 'Original price before discount must be higher than selling price.',
    }
  );

  assert.deepEqual(
    validateProductInput({
      name: 'Madrid Golden Kit',
      clubInspiration: 'Madrid Blancos',
      priceIdr: 150000,
      originalPriceIdr: 190000,
      kitNumber: '09',
    }),
    { valid: true }
  );
});

test('verifyOwnerCredentials restricts editing strictly to owner email and passkey', () => {
  assert.deepEqual(
    verifyOwnerCredentials({
      inputEmail: 'visitor@gmail.com',
      inputPasscode: 'BKEY2026',
      expectedEmail: 'bkeychains5@gmail.com',
      expectedPasscode: 'BKEY2026',
    }),
    {
      authorized: false,
      error: 'Access denied: Only the registered owner email can edit this store.',
    }
  );

  assert.deepEqual(
    verifyOwnerCredentials({
      inputEmail: 'bkeychains5@gmail.com',
      inputPasscode: 'BKEY2026',
      expectedEmail: 'bkeychains5@gmail.com',
      expectedPasscode: 'BKEY2026',
    }),
    { authorized: true }
  );
});

