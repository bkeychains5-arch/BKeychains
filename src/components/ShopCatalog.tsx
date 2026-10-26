import React, { useState } from 'react';
import {
  Search,
  ShoppingBag,
  Eye,
  X,
  Check,
  SlidersHorizontal,
  ShieldCheck,
  Truck,
  Lock,
  Edit3,
} from 'lucide-react';
import {
  KeychainProduct,
  LeagueId,
  KeychainModelType,
  HardwareFinish,
} from '../types/store';
import {
  formatRupiah,
  convertIdrToUsd,
  calculateDiscountPercent,
  filterAndSortProducts,
} from '../utils/storeLogic';
import { KeychainArtwork } from './KeychainArtwork';

interface ShopCatalogProps {
  products: KeychainProduct[];
  initialLeagueFilter?: LeagueId | 'ALL';
  isOwnerUnlocked: boolean;
  onAddToBag: (
    product: KeychainProduct,
    finish: HardwareFinish,
    customEngraving?: string
  ) => void;
  onOpenCart: () => void;
  onOpenEditor: () => void;
}

const LEAGUES: Array<LeagueId | 'ALL'> = [
  'ALL',
  'Premier League',
  'LaLiga',
  'Serie A',
  'Ligue 1',
];

const MODELS: Array<KeychainModelType | 'ALL'> = [
  'ALL',
  '3D Kit Jersey',
  'Club Shield',
  'Striker Boot',
  'Trophy Edition',
];

const FINISHES: HardwareFinish[] = [
  '18K Brushed Gold',
  'Anodized Gunmetal',
  'Mirror Surgical Steel',
];

export const ShopCatalog: React.FC<ShopCatalogProps> = ({
  products,
  initialLeagueFilter = 'ALL',
  isOwnerUnlocked,
  onAddToBag,
  onOpenCart,
  onOpenEditor,
}) => {
  const [leagueFilter, setLeagueFilter] = useState<LeagueId | 'ALL'>(initialLeagueFilter);
  const [modelFilter, setModelFilter] = useState<KeychainModelType | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyDiscounted, setOnlyDiscounted] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating-desc'>(
    'featured'
  );
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  // Selected Product for Contiguous PDP Modal
  const [activeProduct, setActiveProduct] = useState<KeychainProduct | null>(null);
  const [pdpFinish, setPdpFinish] = useState<HardwareFinish>('18K Brushed Gold');
  const [pdpEngraving, setPdpEngraving] = useState('');
  const [pdpViewMode, setPdpViewMode] = useState<'photo' | 'front' | 'back' | 'exploded'>(
    'front'
  );
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  React.useEffect(() => {
    setLeagueFilter(initialLeagueFilter);
  }, [initialLeagueFilter]);

  const filteredProducts = filterAndSortProducts(products, {
    league: leagueFilter,
    modelType: modelFilter,
    searchQuery,
    onlyDiscounted,
    sortBy,
  });

  const handleQuickAdd = (product: KeychainProduct) => {
    onAddToBag(product, '18K Brushed Gold', product.engravingDefault);
    setJustAddedId(product.id);
    setTimeout(() => setJustAddedId(null), 1600);
  };

  const handleOpenPdp = (product: KeychainProduct) => {
    setActiveProduct(product);
    setPdpFinish('18K Brushed Gold');
    setPdpEngraving(product.engravingDefault);
    setPdpViewMode(
      product.customImageUrl && !failedImages[product.id] ? 'photo' : 'front'
    );
  };

  const resetFilters = () => {
    setLeagueFilter('ALL');
    setModelFilter('ALL');
    setSearchQuery('');
    setOnlyDiscounted(false);
    setSortBy('featured');
  };

  return (
    <div className="min-h-screen bg-[#09090B] py-10">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Storefront Athletic Campaign Header */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 sm:p-8 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="text-xs font-semibold tracking-widest text-amber-400 uppercase">
              BKEYCHAINS FLAGSHIP STORE · INDONESIAN RUPIAH (IDR) CATALOG
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-white uppercase tracking-tight">
              ALL-LEAGUE MATCHDAY METALWARE
            </h1>
            <p className="text-zinc-300 text-sm sm:text-base max-w-2xl">
              Engineered to athletic flagship standards. Every keychain ships in a magnetic collector box with instant checkout via QRIS, GoPay, DANA, PayPal, or WhatsApp.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {isOwnerUnlocked && (
              <button
                type="button"
                onClick={onOpenEditor}
                className="px-4 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-amber-400 text-xs font-semibold border border-amber-400/40 inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Pictures & Products (Owner)</span>
              </button>
            )}
            <button
              type="button"
              onClick={onOpenCart}
              className="px-5 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-bold uppercase tracking-wider whitespace-nowrap shrink-0 cursor-pointer"
            >
              Open Checkout Bag
            </button>
          </div>
        </div>

        {/* Supported Payment Methods Trust Bar */}
        <div className="rounded-xl border border-zinc-800/90 bg-zinc-950 px-5 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Official Instant Checkout Methods Accepted:</span>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-mono-num font-semibold text-zinc-200">
            <span>QRIS (All Banks & E-Wallets)</span>
            <span className="text-zinc-600" aria-hidden="true">·</span>
            <span>GOPAY</span>
            <span className="text-zinc-600" aria-hidden="true">·</span>
            <span>DANA</span>
            <span className="text-zinc-600" aria-hidden="true">·</span>
            <span>PAYPAL (USD Auto-Convert)</span>
            <span className="text-zinc-600" aria-hidden="true">·</span>
            <span className="text-amber-400">WHATSAPP DIRECT ORDER</span>
          </div>
        </div>

        {/* Interactive Filter & Search Controls Bar */}
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* League Tabs */}
            <div
              className="flex flex-wrap items-center gap-1.5 p-1.5 bg-zinc-900 border border-zinc-800 rounded-lg"
              role="group"
              aria-label="Filter by football league"
            >
              {LEAGUES.map((lg) => (
                <button
                  key={lg}
                  type="button"
                  onClick={() => setLeagueFilter(lg)}
                  className={`px-3.5 py-2 rounded-md text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    leagueFilter === lg
                      ? 'bg-amber-400 text-zinc-950 font-bold'
                      : 'text-zinc-300 hover:text-white'
                  }`}
                >
                  {lg === 'ALL' ? 'All Leagues (4)' : lg}
                </button>
              ))}
            </div>

            {/* Search, Discount Toggle & Sort */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="search"
                  aria-label="Search keychains by club, league, or number"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search club, kit #, league..."
                  className="w-full pl-9 pr-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white placeholder-zinc-500"
                />
              </div>

              <button
                type="button"
                onClick={() => setOnlyDiscounted((d) => !d)}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  onlyDiscounted
                    ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white'
                }`}
              >
                On Sale Only
              </button>

              <select
                aria-label="Sort products"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-zinc-200 cursor-pointer"
              >
                <option value="featured">Sort: Featured Drops</option>
                <option value="price-asc">Price: Low to High (IDR)</option>
                <option value="price-desc">Price: High to Low (IDR)</option>
                <option value="rating-desc">Highest Collector Rating</option>
              </select>
            </div>
          </div>

          {/* Model Silhouette Sub-Filter */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-zinc-400 inline-flex items-center gap-1 mr-1">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Model Silhouette:</span>
              </span>
              {MODELS.map((mod) => (
                <button
                  key={mod}
                  type="button"
                  onClick={() => setModelFilter(mod)}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    modelFilter === mod
                      ? 'bg-zinc-100 text-zinc-950 font-semibold'
                      : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                  }`}
                >
                  {mod === 'ALL' ? 'All Models' : mod}
                </button>
              ))}
            </div>

            <div className="text-xs text-zinc-400 font-mono-num">
              Showing {filteredProducts.length} of {products.length} Products
            </div>
          </div>
        </div>

        {/* 3-Column Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-12 text-center space-y-4">
            <div className="font-display text-2xl font-bold text-white uppercase">
              No Matching Keychains Found
            </div>
            <p className="text-sm text-zinc-400 max-w-md mx-auto">
              Try clearing your search filter or switching to All Leagues to browse our full 4-league catalog.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="px-5 py-2.5 bg-amber-400 text-zinc-950 font-bold text-xs uppercase rounded-lg cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProducts.map((product) => {
              const discountPct = calculateDiscountPercent(
                product.priceIdr,
                product.originalPriceIdr
              );
              const isJustAdded = justAddedId === product.id;
              const showCustomPhoto =
                Boolean(product.customImageUrl) && !failedImages[product.id];

              return (
                <article
                  key={product.id}
                  className="group rounded-xl border border-zinc-800/90 bg-zinc-900/40 hover:border-zinc-700 transition-all duration-150 hover:-translate-y-0.5 flex flex-col justify-between overflow-hidden"
                >
                  <div>
                    <div
                      onClick={() => handleOpenPdp(product)}
                      className="relative aspect-[4/3] w-full bg-[#121215] border-b border-zinc-800/80 p-6 flex items-center justify-center cursor-pointer overflow-hidden"
                    >
                      {showCustomPhoto ? (
                        <img
                          src={product.customImageUrl}
                          alt={product.name}
                          referrerPolicy="no-referrer"
                          onError={() =>
                            setFailedImages((prev) => ({ ...prev, [product.id]: true }))
                          }
                          className="w-full h-full object-contain transition-transform duration-200 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-48 h-48 transition-transform duration-200 group-hover:scale-105">
                          <KeychainArtwork
                            modelType={product.modelType}
                            primaryColor={product.primaryColor}
                            secondaryColor={product.secondaryColor}
                            accentColor={product.accentColor}
                            kitNumber={product.kitNumber}
                            engravingText={product.engravingDefault}
                          />
                        </div>
                      )}

                      <div className="absolute top-3 left-4 text-[11px] font-mono-num uppercase tracking-wider text-amber-400">
                        {discountPct > 0 ? `Save ${discountPct}%` : product.editionTag}
                      </div>

                      <div className="absolute top-3 right-4 text-[11px] font-mono-num text-zinc-400">
                        {product.weightGrams}g
                      </div>
                    </div>

                    <div className="p-5 space-y-2">
                      <div className="flex items-center gap-2 text-xs text-zinc-400 uppercase tracking-wider">
                        <span>{product.league}</span>
                        <span aria-hidden="true">·</span>
                        <span>{product.modelType}</span>
                      </div>

                      <h2 className="text-base font-semibold text-white leading-snug">
                        <button
                          type="button"
                          onClick={() => handleOpenPdp(product)}
                          className="text-left hover:text-amber-400 transition-colors cursor-pointer"
                        >
                          {product.name}
                        </button>
                      </h2>

                      <p className="text-xs text-zinc-400 line-clamp-1">
                        {product.clubInspiration}
                      </p>
                    </div>
                  </div>

                  <div className="px-5 pb-5 pt-2 flex items-center justify-between gap-3 border-t border-zinc-800/50">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="font-mono-num text-[15px] font-bold text-white">
                          {formatRupiah(product.priceIdr)}
                        </span>
                        {product.originalPriceIdr &&
                          product.originalPriceIdr > product.priceIdr && (
                            <span className="font-mono-num text-xs text-zinc-500 line-through">
                              {formatRupiah(product.originalPriceIdr)}
                            </span>
                          )}
                      </div>
                      <div className="font-mono-num text-[11px] text-zinc-500">
                        {convertIdrToUsd(product.priceIdr)}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleOpenPdp(product)}
                        aria-label={`Inspect ${product.name}`}
                        className="p-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors cursor-pointer"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleQuickAdd(product)}
                        className="px-3.5 py-2.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        {isJustAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Add to Bag</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>

      {/* Contiguous Product Detail Modal (PDP) */}
      {activeProduct && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="pdp-modal-title"
        >
          <div className="relative w-full max-w-4xl rounded-2xl border border-zinc-800 bg-zinc-950 overflow-hidden my-8">
            <button
              type="button"
              onClick={() => setActiveProduct(null)}
              aria-label="Close product detail view"
              className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-12 items-stretch">
              <div className="md:col-span-6 bg-[#121215] p-6 sm:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-zinc-800">
                <div className="flex flex-wrap items-center gap-1 bg-zinc-900 p-1 rounded-lg border border-zinc-800 w-fit">
                  {activeProduct.customImageUrl && !failedImages[activeProduct.id] && (
                    <button
                      type="button"
                      onClick={() => setPdpViewMode('photo')}
                      className={`px-2.5 py-1 rounded text-xs font-semibold uppercase whitespace-nowrap cursor-pointer ${
                        pdpViewMode === 'photo'
                          ? 'bg-amber-400 text-zinc-950'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      Photo
                    </button>
                  )}
                  {(['front', 'back', 'exploded'] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setPdpViewMode(mode)}
                      className={`px-2.5 py-1 rounded text-xs font-semibold uppercase whitespace-nowrap cursor-pointer ${
                        pdpViewMode === mode
                          ? 'bg-amber-400 text-zinc-950'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>

                <div className="py-6 flex items-center justify-center">
                  <div className="w-64 h-64 flex items-center justify-center">
                    {pdpViewMode === 'photo' &&
                    activeProduct.customImageUrl &&
                    !failedImages[activeProduct.id] ? (
                      <img
                        src={activeProduct.customImageUrl}
                        alt={activeProduct.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain rounded-lg"
                      />
                    ) : (
                      <KeychainArtwork
                        modelType={activeProduct.modelType}
                        primaryColor={activeProduct.primaryColor}
                        secondaryColor={activeProduct.secondaryColor}
                        accentColor={activeProduct.accentColor}
                        kitNumber={activeProduct.kitNumber}
                        engravingText={pdpEngraving || activeProduct.engravingDefault}
                        finish={pdpFinish}
                        viewMode={pdpViewMode === 'photo' ? 'front' : pdpViewMode}
                      />
                    )}
                  </div>
                </div>

                <div className="text-xs text-zinc-400 flex items-center justify-between border-t border-zinc-800/80 pt-3">
                  <span>Weight: {activeProduct.weightGrams}g Solid Alloy</span>
                  <span>Rating: {activeProduct.rating} ★ ({activeProduct.reviewCount})</span>
                </div>
              </div>

              <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="text-xs text-amber-400 uppercase tracking-wider font-semibold">
                    {activeProduct.league} · {activeProduct.modelType}
                  </div>

                  <h2
                    id="pdp-modal-title"
                    className="font-display text-3xl font-bold text-white uppercase"
                  >
                    {activeProduct.name}
                  </h2>

                  <div className="flex items-baseline gap-3">
                    <span className="font-mono-num text-2xl font-bold text-white">
                      {formatRupiah(activeProduct.priceIdr)}
                    </span>
                    {activeProduct.originalPriceIdr &&
                      activeProduct.originalPriceIdr > activeProduct.priceIdr && (
                        <span className="font-mono-num text-sm text-zinc-500 line-through">
                          {formatRupiah(activeProduct.originalPriceIdr)}
                        </span>
                      )}
                    <span className="font-mono-num text-xs text-zinc-400">
                      ({convertIdrToUsd(activeProduct.priceIdr)})
                    </span>
                  </div>

                  <p className="text-sm text-zinc-300 leading-relaxed">
                    {activeProduct.description}
                  </p>

                  <div className="text-xs text-zinc-400">
                    Specs: {activeProduct.materialSpec}
                  </div>

                  <div className="pt-2">
                    <label className="block text-xs font-semibold text-zinc-300 uppercase mb-2">
                      Select Hardware Plating
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {FINISHES.map((fin) => (
                        <button
                          key={fin}
                          type="button"
                          onClick={() => setPdpFinish(fin)}
                          className={`px-2.5 py-2 rounded-lg text-xs font-medium border truncate cursor-pointer ${
                            pdpFinish === fin
                              ? 'bg-amber-400 text-zinc-950 border-amber-400 font-bold'
                              : 'bg-zinc-900 text-zinc-300 border-zinc-800'
                          }`}
                        >
                          {fin}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="pdp-engraving-input"
                      className="block text-xs font-semibold text-zinc-300 uppercase mb-1"
                    >
                      Custom Back-Plate Laser Engraving (Free)
                    </label>
                    <input
                      id="pdp-engraving-input"
                      type="text"
                      maxLength={14}
                      value={pdpEngraving}
                      onChange={(e) => {
                        setPdpEngraving(e.target.value);
                        setPdpViewMode('back');
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-sm font-mono-num text-white uppercase"
                    />
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-zinc-800">
                  <button
                    type="button"
                    onClick={() => {
                      onAddToBag(activeProduct, pdpFinish, pdpEngraving);
                      setActiveProduct(null);
                      onOpenCart();
                    }}
                    className="w-full py-3.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs uppercase tracking-wider rounded-lg inline-flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Bag — {formatRupiah(activeProduct.priceIdr)}</span>
                  </button>

                  <div className="flex items-center justify-between text-[11px] text-zinc-400">
                    <span className="inline-flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-amber-400" />
                      Free Indonesia shipping over Rp 250.000
                    </span>
                    <span>QRIS · GoPay · DANA · PayPal · WA</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
