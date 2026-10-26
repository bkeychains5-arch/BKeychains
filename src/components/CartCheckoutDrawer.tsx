import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  CheckCircle2,
  MessageCircle,
  QrCode,
  Wallet,
  CreditCard,
  Copy,
  Check,
} from 'lucide-react';
import { CartItem, PaymentMethodId, StoreConfig } from '../types/store';
import {
  formatRupiah,
  convertIdrToUsd,
  calculateCartSummary,
  buildWhatsAppOrderUrl,
} from '../utils/storeLogic';

interface CartCheckoutDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  config: StoreConfig;
  onUpdateQuantity: (cartItemId: string, delta: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onClearCart: () => void;
}

const PAYMENT_OPTIONS: Array<{
  id: PaymentMethodId;
  label: string;
  subtitle: string;
}> = [
  {
    id: 'QRIS',
    label: 'QRIS Instant Scan',
    subtitle: 'BCA, Mandiri, BRI, BNI, GoPay, OVO, ShopeePay',
  },
  {
    id: 'GOPAY',
    label: 'GoPay E-Wallet',
    subtitle: 'Instant Gojek / GoPay account link in IDR',
  },
  {
    id: 'DANA',
    label: 'DANA Digital Wallet',
    subtitle: 'Zero-fee DANA balance transfer in IDR',
  },
  {
    id: 'PAYPAL',
    label: 'PayPal Express',
    subtitle: 'International checkout with automatic USD conversion',
  },
  {
    id: 'WHATSAPP',
    label: 'WhatsApp Direct Concierge',
    subtitle: 'Send itemized Rupiah order directly to our admin',
  },
];

export const CartCheckoutDrawer: React.FC<CartCheckoutDrawerProps> = ({
  isOpen,
  onClose,
  items,
  config,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethodId>('QRIS');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [formError, setFormError] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState<{
    orderCode: string;
    paymentMethod: PaymentMethodId;
    grandTotalIdr: number;
    whatsappUrl: string;
    whatsappMessage: string;
  } | null>(null);
  const [copiedWaText, setCopiedWaText] = useState(false);

  if (!isOpen) return null;

  const summary = calculateCartSummary(items, config.freeShippingThresholdIdr);

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    if (customerName.trim().length < 2) {
      setFormError('Please enter your full name for delivery.');
      return;
    }
    if (customerPhone.trim().length < 7) {
      setFormError('Please enter a valid WhatsApp / phone number.');
      return;
    }
    if (shippingAddress.trim().length < 8) {
      setFormError('Please enter your complete shipping address and city.');
      return;
    }

    setFormError('');
    const orderCode = `BK-${Math.floor(1000 + Math.random() * 9000)}`;
    const { url, message } = buildWhatsAppOrderUrl({
      whatsappNumber: config.whatsappNumber,
      customerName,
      customerPhone,
      shippingAddress,
      paymentMethod: selectedPayment,
      items,
      summary,
      orderCode,
    });

    setConfirmedOrder({
      orderCode,
      paymentMethod: selectedPayment,
      grandTotalIdr: summary.grandTotalIdr,
      whatsappUrl: url,
      whatsappMessage: message,
    });
    onClearCart();
  };

  const handleCopyMessage = () => {
    if (!confirmedOrder) return;
    navigator.clipboard?.writeText(confirmedOrder.whatsappMessage);
    setCopiedWaText(true);
    setTimeout(() => setCopiedWaText(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Bag and Checkout"
    >
      <div className="w-full max-w-xl bg-zinc-950 border-l border-zinc-800 h-full flex flex-col overflow-hidden">
        {/* Top Drawer Bar */}
        <div className="shrink-0 bg-zinc-950 border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-white uppercase">
              {confirmedOrder
                ? `Order ${confirmedOrder.orderCode} Confirmed`
                : `Your Matchday Bag (${summary.totalQuantity})`}
            </h2>
            <p className="text-xs text-zinc-400">
              All prices in Indonesian Rupiah (IDR) · Free shipping over{' '}
              {formatRupiah(config.freeShippingThresholdIdr)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setConfirmedOrder(null);
              onClose();
            }}
            aria-label="Close Checkout Drawer"
            className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-6 flex-1 overflow-y-auto">
          {confirmedOrder ? (
            /* Post-Order Verification & Receipt State */
            <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/20 p-6 space-y-5">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-xs font-mono-num text-emerald-400 uppercase">
                    PAYMENT & ORDER REGISTERED · {confirmedOrder.paymentMethod}
                  </div>
                  <h3 className="font-display text-2xl font-bold text-white uppercase">
                    Order #{confirmedOrder.orderCode} — Preparing Shipment
                  </h3>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-800 space-y-2 text-xs">
                <div className="flex justify-between text-zinc-300">
                  <span>Selected Payment Method:</span>
                  <span className="font-bold text-amber-400">
                    {confirmedOrder.paymentMethod}
                  </span>
                </div>
                <div className="flex justify-between text-zinc-300">
                  <span>Total Amount Settled:</span>
                  <span className="font-mono-num font-bold text-white">
                    {formatRupiah(confirmedOrder.grandTotalIdr)} (
                    {convertIdrToUsd(confirmedOrder.grandTotalIdr)})
                  </span>
                </div>
              </div>

              {/* Send or Copy WhatsApp Receipt */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-zinc-300 uppercase">
                  Direct WhatsApp Order Dispatch:
                </div>
                <pre className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-300 whitespace-pre-wrap font-mono-num max-h-48 overflow-y-auto">
                  {confirmedOrder.whatsappMessage}
                </pre>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <a
                    href={confirmedOrder.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs uppercase tracking-wider rounded-lg inline-flex items-center justify-center gap-2 whitespace-nowrap"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Send Order to WhatsApp Admin</span>
                  </a>

                  <button
                    type="button"
                    onClick={handleCopyMessage}
                    className="py-3 px-4 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold rounded-lg inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedWaText ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Copied Receipt</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy Receipt</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : items.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="font-display text-2xl font-bold text-white uppercase">
                Your Matchday Bag is Empty
              </div>
              <p className="text-sm text-zinc-400 max-w-xs mx-auto">
                Add a Premier League, LaLiga, Serie A, or Ligue 1 keychain or configure a custom 3D model to begin checkout.
              </p>
            </div>
          ) : (
            <>
              {/* Itemized Cart List */}
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.cartItemId}
                    className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 flex items-center justify-between gap-4"
                  >
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="text-sm font-semibold text-white truncate">
                        {item.product.name}
                      </div>
                      <div className="text-xs text-zinc-400">
                        {item.product.league} · {item.selectedFinish}
                        {item.customEngraving ? ` · Etch: "${item.customEngraving}"` : ''}
                      </div>
                      <div className="font-mono-num text-xs font-bold text-amber-400">
                        {formatRupiah(item.product.priceIdr * item.quantity)}
                      </div>
                    </div>

                    {/* Quantity Steppers */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.cartItemId, -1)}
                        aria-label={`Decrease quantity of ${item.product.name}`}
                        className="p-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-mono-num text-xs font-bold text-white w-5 text-center">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.cartItemId, 1)}
                        aria-label={`Increase quantity of ${item.product.name}`}
                        className="p-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.cartItemId)}
                        aria-label={`Remove ${item.product.name}`}
                        className="p-1.5 rounded bg-zinc-900 hover:bg-rose-950/60 text-zinc-400 hover:text-rose-400 ml-1 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Payment Method Selector: QRIS, GOPAY, DANA, PAYPAL, WHATSAPP */}
              <div className="space-y-3 pt-2">
                <div className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                  Select Payment Method
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {PAYMENT_OPTIONS.map((opt) => {
                    const active = selectedPayment === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setSelectedPayment(opt.id)}
                        className={`p-3.5 rounded-xl border text-left flex items-center justify-between transition-colors cursor-pointer ${
                          active
                            ? 'bg-zinc-900 border-amber-400 text-white'
                            : 'bg-zinc-900/30 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                        }`}
                      >
                        <div>
                          <div className="text-xs font-bold uppercase tracking-wide flex items-center gap-2">
                            {opt.id === 'QRIS' && <QrCode className="w-4 h-4 text-amber-400" />}
                            {(opt.id === 'GOPAY' || opt.id === 'DANA') && (
                              <Wallet className="w-4 h-4 text-amber-400" />
                            )}
                            {opt.id === 'PAYPAL' && (
                              <CreditCard className="w-4 h-4 text-amber-400" />
                            )}
                            {opt.id === 'WHATSAPP' && (
                              <MessageCircle className="w-4 h-4 text-emerald-400" />
                            )}
                            <span>{opt.label}</span>
                          </div>
                          <div className="text-[11px] text-zinc-400 mt-0.5">{opt.subtitle}</div>
                        </div>
                        <span className="font-mono-num text-xs font-bold text-amber-400">
                          {opt.id === 'PAYPAL'
                            ? convertIdrToUsd(summary.grandTotalIdr)
                            : formatRupiah(summary.grandTotalIdr)}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Dynamic Payment Preview Widget */}
                {selectedPayment === 'QRIS' && (
                  <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center gap-4">
                    <div className="w-20 h-20 rounded-lg bg-white p-2 shrink-0 flex items-center justify-center">
                      {/* Crisp SVG QRIS Matrix */}
                      <svg viewBox="0 0 64 64" className="w-full h-full">
                        <rect width="64" height="64" fill="#FFFFFF" />
                        <rect x="4" y="4" width="18" height="18" fill="#09090B" />
                        <rect x="7" y="7" width="12" height="12" fill="#FFFFFF" />
                        <rect x="9" y="9" width="8" height="8" fill="#09090B" />
                        <rect x="42" y="4" width="18" height="18" fill="#09090B" />
                        <rect x="45" y="7" width="12" height="12" fill="#FFFFFF" />
                        <rect x="47" y="9" width="8" height="8" fill="#09090B" />
                        <rect x="4" y="42" width="18" height="18" fill="#09090B" />
                        <rect x="7" y="45" width="12" height="12" fill="#FFFFFF" />
                        <rect x="9" y="47" width="8" height="8" fill="#09090B" />
                        <rect x="26" y="10" width="6" height="6" fill="#09090B" />
                        <rect x="26" y="24" width="12" height="12" fill="#E11D48" />
                        <rect x="42" y="28" width="8" height="8" fill="#09090B" />
                        <rect x="26" y="44" width="8" height="14" fill="#09090B" />
                        <rect x="40" y="42" width="16" height="6" fill="#09090B" />
                        <rect x="46" y="52" width="14" height="8" fill="#09090B" />
                      </svg>
                    </div>
                    <div className="text-xs space-y-1">
                      <div className="font-bold text-white">
                        NMID: ID2026BKEYCHAINS001 · QRIS NATIONAL
                      </div>
                      <div className="text-zinc-400">
                        Scan with BCA Mobile, Livin Mandiri, GoPay, OVO, DANA, or ShopeePay. Exact total:{' '}
                        <span className="font-mono-num text-amber-400 font-bold">
                          {formatRupiah(summary.grandTotalIdr)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Customer Delivery Verification Form */}
              <form id="checkout-form" onSubmit={handleConfirmOrder} className="space-y-3 pt-2">
                <div className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                  Customer Shipping Details
                </div>

                <div>
                  <label htmlFor="chk-name" className="block text-xs text-zinc-400 mb-1">
                    Full Name
                  </label>
                  <input
                    id="chk-name"
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g., Pratama Arhan"
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white"
                  />
                </div>

                <div>
                  <label htmlFor="chk-phone" className="block text-xs text-zinc-400 mb-1">
                    WhatsApp / Mobile Number (For GoPay / DANA / Tracking)
                  </label>
                  <input
                    id="chk-phone"
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="e.g., 0812-3456-7890"
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white font-mono-num"
                  />
                </div>

                <div>
                  <label htmlFor="chk-address" className="block text-xs text-zinc-400 mb-1">
                    Complete Delivery Address & Postal Code
                  </label>
                  <textarea
                    id="chk-address"
                    rows={2}
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="Street address, district, city, postal code..."
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white"
                  />
                </div>

                {formError && <p className="text-xs text-rose-400">{formError}</p>}
              </form>
            </>
          )}
        </div>

        {/* Sticky Subtotal & Complete Checkout Button */}
        {!confirmedOrder && items.length > 0 && (
          <div className="sticky bottom-0 z-20 bg-zinc-950 border-t border-zinc-800 p-6 space-y-4">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-zinc-400">
                <span>Subtotal ({summary.totalQuantity} items)</span>
                <span className="font-mono-num text-zinc-200">
                  {formatRupiah(summary.subtotalIdr)}
                </span>
              </div>
              {summary.totalSavingsIdr > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Matchday Drop Discount Savings</span>
                  <span className="font-mono-num">
                    -{formatRupiah(summary.totalSavingsIdr)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-zinc-400">
                <span>Express Insured Shipping</span>
                <span className="font-mono-num text-zinc-200">
                  {summary.shippingIdr === 0 ? 'FREE' : formatRupiah(summary.shippingIdr)}
                </span>
              </div>
              <div className="pt-2 border-t border-zinc-800 flex justify-between text-sm font-bold text-white">
                <span>Grand Total (IDR / USD)</span>
                <span className="font-mono-num text-amber-400">
                  {formatRupiah(summary.grandTotalIdr)} ({convertIdrToUsd(summary.grandTotalIdr)})
                </span>
              </div>
            </div>

            <button
              type="submit"
              form="checkout-form"
              className="w-full py-3.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs uppercase tracking-wider rounded-lg cursor-pointer"
            >
              Complete Order via {selectedPayment} — {formatRupiah(summary.grandTotalIdr)}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
