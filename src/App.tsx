import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  ArrowRight,
  Calendar,
  MapPin,
  Check,
  Share2,
  Lock,
  Unlock,
  Image as ImageIcon,
  Compass,
} from 'lucide-react';
import {
  KeychainProduct,
  CartItem,
  SupporterReview,
  CollaborationEvent,
  StoreConfig,
  LeagueId,
  HardwareFinish,
} from './types/store';
import {
  INITIAL_STORE_CONFIG,
  INITIAL_PRODUCTS,
  INITIAL_REVIEWS,
  COLLABORATIONS_AND_EVENTS,
} from './data/initialStoreData';
import {
  formatRupiah,
  convertIdrToUsd,
  calculateDiscountPercent,
  calculateCartSummary,
} from './utils/storeLogic';
import { PromoVideoHero } from './components/PromoVideoHero';
import { InteractiveAbout } from './components/InteractiveAbout';
import { InteractiveCustomizer } from './components/InteractiveCustomizer';
import { ShopCatalog } from './components/ShopCatalog';
import { CartCheckoutDrawer } from './components/CartCheckoutDrawer';
import { StoreEditorModal } from './components/StoreEditorModal';
import { KeychainArtwork } from './components/KeychainArtwork';

const STORAGE_KEYS = {
  CONFIG: 'bkeychains_config_v2',
  PRODUCTS: 'bkeychains_products_v2',
  REVIEWS: 'bkeychains_reviews_v2',
  EVENTS: 'bkeychains_events_v2',
  CART: 'bkeychains_cart_v2',
  OWNER_UNLOCKED: 'bkeychains_owner_unlocked_v2',
};

export default function App() {
  const [activePage, setActivePage] = useState<'home' | 'about' | 'shop'>(() => {
    if (typeof window !== 'undefined') {
      const p = window.location.pathname.toLowerCase();
      if (p.includes('/shop')) return 'shop';
      if (p.includes('/about')) return 'about';
    }
    return 'home';
  });
  const [shopLeagueFilter, setShopLeagueFilter] = useState<LeagueId | 'ALL'>('ALL');
  const [failedDropImages, setFailedDropImages] = useState<Record<string, boolean>>({});

  // Sync browser URL path with basename '/' ('/', '/about', or '/shop')
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const currentPath = window.location.pathname;
    if (currentPath.toLowerCase().includes('/customizer')) {
      setTimeout(() => {
        document.getElementById('customizer-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    }
    const targetPath =
      activePage === 'shop'
        ? '/shop'
        : activePage === 'about'
        ? '/about'
        : '/';
    if (window.location.pathname !== targetPath) {
      try {
        window.history.replaceState({}, '', targetPath);
      } catch {
        // ignore in restricted sandbox frames
      }
    }
  }, [activePage]);

  // Owner Authentication Lock State
  const [isOwnerUnlocked, setIsOwnerUnlocked] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(STORAGE_KEYS.OWNER_UNLOCKED) === 'true';
    } catch {
      return false;
    }
  });

  // Persistent Store State
  const [storeConfig, setStoreConfig] = useState<StoreConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CONFIG);
      const parsed = saved ? JSON.parse(saved) : {};
      return {
        ...INITIAL_STORE_CONFIG,
        ...parsed,
        publicShareUrl:
          typeof window !== 'undefined' && window.location?.origin
            ? `${window.location.origin}/`
            : INITIAL_STORE_CONFIG.publicShareUrl,
      };
    } catch {
      return INITIAL_STORE_CONFIG;
    }
  });

  const [products, setProducts] = useState<KeychainProduct[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [reviews, setReviews] = useState<SupporterReview[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  });

  const [eventsList, setEventsList] = useState<CollaborationEvent[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EVENTS);
      return saved ? JSON.parse(saved) : COLLABORATIONS_AND_EVENTS;
    } catch {
      return COLLABORATIONS_AND_EVENTS;
    }
  });

  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      return saved
        ? JSON.parse(saved)
        : [
            {
              cartItemId: 'seed-1',
              product: INITIAL_PRODUCTS[0],
              quantity: 1,
              selectedFinish: '18K Brushed Gold',
              customEngraving: 'THEATRE #07',
            },
          ];
    } catch {
      return [];
    }
  });

  const [rsvpClaimedMap, setRsvpClaimedMap] = useState<Record<string, string>>({});
  const [justAddedDropId, setJustAddedDropId] = useState<string | null>(null);

  // Drawers & Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [studioModalState, setStudioModalState] = useState<{
    open: boolean;
    mode: 'editor' | 'share';
  }>({ open: false, mode: 'editor' });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(storeConfig));
    } catch {
      // ignore
    }
  }, [storeConfig]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch {
      // ignore
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
    } catch {
      // ignore
    }
  }, [reviews]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(eventsList));
    } catch {
      // ignore
    }
  }, [eventsList]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cartItems));
    } catch {
      // ignore
    }
  }, [cartItems]);

  const handleUnlockOwner = () => {
    setIsOwnerUnlocked(true);
    try {
      sessionStorage.setItem(STORAGE_KEYS.OWNER_UNLOCKED, 'true');
    } catch {
      // ignore
    }
  };

  const handleLockOwner = () => {
    setIsOwnerUnlocked(false);
    try {
      sessionStorage.removeItem(STORAGE_KEYS.OWNER_UNLOCKED);
    } catch {
      // ignore
    }
  };

  // Cart Handlers
  const handleAddToBag = (
    product: KeychainProduct,
    finish: HardwareFinish = '18K Brushed Gold',
    customEngraving?: string
  ) => {
    const cleanEngraving = (customEngraving || product.engravingDefault).trim();
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedFinish === finish &&
          (item.customEngraving || '') === cleanEngraving
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1,
        };
        return updated;
      }
      return [
        ...prev,
        {
          cartItemId: `${product.id}-${finish}-${Date.now()}`,
          product,
          quantity: 1,
          selectedFinish: finish,
          customEngraving: cleanEngraving,
        },
      ];
    });
  };

  const handleUpdateQuantity = (cartItemId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleAddReview = (newRev: Omit<SupporterReview, 'id' | 'date'>) => {
    const created: SupporterReview = {
      ...newRev,
      id: `rev-${Date.now()}`,
      date: 'October 2026',
    };
    setReviews((prev) => [created, ...prev]);
  };

  const handleClaimEventPass = (eventId: string) => {
    if (rsvpClaimedMap[eventId]) return;
    const passCode = `PASS-BK-${Math.floor(100 + Math.random() * 900)}`;
    setRsvpClaimedMap((prev) => ({ ...prev, [eventId]: passCode }));
    setEventsList((prev) =>
      prev.map((ev) =>
        ev.id === eventId && ev.spotsRemaining > 0
          ? { ...ev, spotsRemaining: ev.spotsRemaining - 1 }
          : ev
      )
    );
  };

  const handleUpdateProduct = (updated: KeychainProduct) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleAddProduct = (created: KeychainProduct) => {
    setProducts((prev) => [created, ...prev]);
  };

  const handleResetAll = () => {
    setStoreConfig(INITIAL_STORE_CONFIG);
    setProducts(INITIAL_PRODUCTS);
    setReviews(INITIAL_REVIEWS);
    setEventsList(COLLABORATIONS_AND_EVENTS);
  };

  // Navigation Helpers
  const navigateToShopLeague = (league: LeagueId | 'ALL') => {
    setShopLeagueFilter(league);
    setActivePage('shop');
    window.scrollTo(0, 0);
  };

  const navigateToAboutPage = () => {
    setActivePage('about');
    window.scrollTo(0, 0);
  };

  const scrollToSection = (sectionId: string) => {
    if (activePage !== 'home') {
      setActivePage('home');
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const featuredDiscountProducts = products
    .filter(
      (p) =>
        p.isFeaturedDiscount ||
        (p.originalPriceIdr !== undefined && p.originalPriceIdr > p.priceIdr)
    )
    .slice(0, 4);

  const cartSummary = calculateCartSummary(
    cartItems,
    storeConfig.freeShippingThresholdIdr
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#09090B] text-zinc-100">
      {/* STRICT 3-ZONE TOP BAR CONTRACT */}
      <header className="sticky top-0 z-40 bg-[#09090B]/95 backdrop-blur border-b border-zinc-800/90">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single Text Element Brand Wordmark */}
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              setActivePage('home');
              window.scrollTo(0, 0);
            }}
            className="font-display text-2xl font-bold tracking-wider text-white uppercase whitespace-nowrap shrink-0"
          >
            {storeConfig.brandName}
          </a>

          {/* Zone 2: 5 Concise Single-Line Text Navigation Links */}
          <nav
            className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-300"
            aria-label="Primary Store Navigation"
          >
            <button
              type="button"
              onClick={() => {
                setActivePage('home');
                window.scrollTo(0, 0);
              }}
              className={`hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activePage === 'home' ? 'text-amber-400 font-semibold' : ''
              }`}
            >
              Home
            </button>

            <button
              type="button"
              onClick={navigateToAboutPage}
              className={`hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activePage === 'about' ? 'text-amber-400 font-semibold' : ''
              }`}
            >
              About Us
            </button>

            <button
              type="button"
              onClick={() => navigateToShopLeague('ALL')}
              className={`hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activePage === 'shop' ? 'text-amber-400 font-semibold' : ''
              }`}
            >
              Official Shop
            </button>

            <button
              type="button"
              onClick={() => scrollToSection('customizer-section')}
              className="hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              3D Customizer
            </button>

            <button
              type="button"
              onClick={() => setStudioModalState({ open: true, mode: 'share' })}
              className="hover:text-white hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Share Link
            </button>
          </nav>

          {/* Zone 3: 1 Primary Action Button */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              aria-label={`Open shopping bag with ${cartSummary.totalQuantity} items`}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs uppercase tracking-wider rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Bag ({cartSummary.totalQuantity}) · {formatRupiah(cartSummary.subtotalIdr)}
            </button>
          </div>
        </div>
      </header>

      {/* ACTIVE OWNER STUDIO RIBBON (ONLY SHOWN WHEN OWNER IS VERIFIED & UNLOCKED) */}
      {isOwnerUnlocked && (
        <div className="bg-emerald-950/80 border-b border-emerald-500/40 px-4 py-2">
          <div className="max-w-[1320px] mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-emerald-300 font-medium">
              <Unlock className="w-3.5 h-3.5" />
              <span>
                Owner Mode Active ({storeConfig.ownerEmail}) — You can edit text, upload custom product pictures, and change the welcome video.
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setStudioModalState({ open: true, mode: 'editor' })}
                className="px-3 py-1 rounded bg-amber-400 text-zinc-950 font-bold inline-flex items-center gap-1 cursor-pointer"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Open Owner Studio (Pictures & Video)</span>
              </button>
              <button
                type="button"
                onClick={handleLockOwner}
                className="px-3 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 inline-flex items-center gap-1 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Lock Owner Mode</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Secondary Page Switcher Bar */}
      <div className="md:hidden border-b border-zinc-800 bg-zinc-950 px-4 py-2 flex items-center justify-between gap-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => {
            setActivePage('home');
            window.scrollTo(0, 0);
          }}
          className={`px-3 py-1 rounded text-xs font-semibold whitespace-nowrap shrink-0 ${
            activePage === 'home' ? 'bg-amber-400 text-zinc-950' : 'text-zinc-300'
          }`}
        >
          1. Welcome
        </button>
        <button
          type="button"
          onClick={navigateToAboutPage}
          className={`px-3 py-1 rounded text-xs font-semibold whitespace-nowrap shrink-0 ${
            activePage === 'about' ? 'bg-amber-400 text-zinc-950' : 'text-zinc-300'
          }`}
        >
          2. About Us Lab
        </button>
        <button
          type="button"
          onClick={() => navigateToShopLeague('ALL')}
          className={`px-3 py-1 rounded text-xs font-semibold whitespace-nowrap shrink-0 ${
            activePage === 'shop' ? 'bg-amber-400 text-zinc-950' : 'text-zinc-300'
          }`}
        >
          3. Shop (IDR)
        </button>
      </div>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1">
        {activePage === 'home' && (
          <>
            {/* SECTION 1: WELCOME PROMO VIDEO HERO */}
            <PromoVideoHero
              config={storeConfig}
              isOwnerUnlocked={isOwnerUnlocked}
              onNavigateShop={() => navigateToShopLeague('ALL')}
              onScrollToCustomizer={() => scrollToSection('customizer-section')}
              onOpenShareModal={() => setStudioModalState({ open: true, mode: 'share' })}
              onOpenVideoEditor={() => setStudioModalState({ open: true, mode: 'editor' })}
            />

            {/* CINEMATIC PORTAL STRIP TO STANDALONE ABOUT US & FORGE LAB PAGE */}
            <section className="py-10 border-b border-zinc-800/80 bg-zinc-950">
              <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="rounded-2xl border border-zinc-800 bg-gradient-to-r from-zinc-900/90 via-zinc-900/50 to-zinc-950 p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="space-y-2 max-w-2xl">
                    <div className="text-xs font-mono-num text-amber-400 uppercase tracking-widest">
                      DEDICATED BRAND & METALLURGY EXPERIENCE · /BKEYCHAINS/ABOUT
                    </div>
                    <h2 className="font-display text-2xl sm:text-3xl font-bold text-white uppercase">
                      ENTER THE BKEYCHAINS 4-LEAGUE FORGE & DURABILITY LAB
                    </h2>
                    <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                      Explore our interactive 4-Stage Metalcraft Simulator, live club colorway previewer for Premier League, LaLiga, Serie A, and Ligue 1, torture-test lab, and supporter reviews on our dedicated About Us page.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={navigateToAboutPage}
                    className="px-6 py-3.5 bg-zinc-100 hover:bg-amber-400 text-zinc-950 font-bold text-xs uppercase tracking-wider rounded-lg transition-colors inline-flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Compass className="w-4 h-4" />
                    <span>Explore Interactive About Us Page</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </section>

            {/* SECTION 2: 4 FEATURED DISCOUNTED PRODUCTS */}
            <section
              id="discounted-drops-section"
              className="py-16 border-b border-zinc-800/80 bg-[#09090B]"
            >
              <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                    <div className="text-xs font-semibold tracking-widest text-amber-400 uppercase">
                      01. Matchday Flash Drops — 4 Special Offers
                    </div>
                    <h2 className="font-display text-3xl sm:text-4xl font-bold text-white uppercase mt-1">
                      SEASON OPENER DISCOUNTED EDITIONS
                    </h2>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    {isOwnerUnlocked && (
                      <button
                        type="button"
                        onClick={() => setStudioModalState({ open: true, mode: 'editor' })}
                        className="px-4 py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-amber-400/50 text-xs font-semibold text-amber-400 cursor-pointer"
                      >
                        Change Product Pictures / Prices
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => navigateToShopLeague('ALL')}
                      className="px-5 py-2.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-bold text-white uppercase tracking-wider inline-flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <span>Browse All {products.length} Keychains in Store</span>
                      <ArrowRight className="w-4 h-4 text-amber-400" />
                    </button>
                  </div>
                </div>

                {/* 4 Discounted Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {featuredDiscountProducts.map((product) => {
                    const discountPct = calculateDiscountPercent(
                      product.priceIdr,
                      product.originalPriceIdr
                    );
                    const isAdded = justAddedDropId === product.id;
                    const showCustomImg =
                      Boolean(product.customImageUrl) && !failedDropImages[product.id];

                    return (
                      <article
                        key={product.id}
                        className="rounded-xl border border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 transition-all duration-150 hover:-translate-y-0.5 flex flex-col justify-between overflow-hidden"
                      >
                        <div>
                          <div className="relative aspect-[4/3] bg-[#121215] border-b border-zinc-800 p-5 flex items-center justify-center overflow-hidden">
                            {showCustomImg ? (
                              <img
                                src={product.customImageUrl}
                                alt={product.name}
                                referrerPolicy="no-referrer"
                                onError={() =>
                                  setFailedDropImages((prev) => ({
                                    ...prev,
                                    [product.id]: true,
                                  }))
                                }
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <div className="w-40 h-40">
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
                            <div className="absolute top-3 left-3 text-[11px] font-mono-num font-bold text-amber-400 uppercase">
                              SAVE {discountPct}%
                            </div>
                            <div className="absolute top-3 right-3 text-[11px] font-mono-num text-zinc-400">
                              {product.weightGrams}g
                            </div>
                          </div>

                          <div className="p-4 space-y-1.5">
                            <div className="text-[11px] text-zinc-400 uppercase tracking-wider">
                              {product.league} · {product.modelType}
                            </div>
                            <h3 className="text-sm font-bold text-white leading-snug">
                              {product.name}
                            </h3>
                            <p className="text-xs text-zinc-400 line-clamp-2">
                              {product.description}
                            </p>
                          </div>
                        </div>

                        <div className="p-4 pt-3 border-t border-zinc-800/60 space-y-3">
                          <div className="flex items-baseline justify-between">
                            <div>
                              <span className="font-mono-num text-base font-bold text-white">
                                {formatRupiah(product.priceIdr)}
                              </span>
                              {product.originalPriceIdr && (
                                <span className="font-mono-num text-xs text-zinc-500 line-through ml-2">
                                  {formatRupiah(product.originalPriceIdr)}
                                </span>
                              )}
                            </div>
                            <span className="font-mono-num text-[11px] text-zinc-400">
                              {convertIdrToUsd(product.priceIdr)}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              handleAddToBag(
                                product,
                                '18K Brushed Gold',
                                product.engravingDefault
                              );
                              setJustAddedDropId(product.id);
                              setTimeout(() => setJustAddedDropId(null), 1500);
                            }}
                            className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs uppercase tracking-wider rounded-lg inline-flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            {isAdded ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Added to Bag</span>
                              </>
                            ) : (
                              <>
                                <ShoppingBag className="w-3.5 h-3.5" />
                                <span>Add Deal to Bag</span>
                              </>
                            )}
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* SECTION 3: INTERACTIVE 3D MODEL SHOWCASE & BESPOKE CUSTOMIZER */}
            <InteractiveCustomizer onAddCustomToBag={handleAddToBag} />

            {/* SECTION 4: COLLABORATIONS & UPCOMING EVENTS */}
            <section
              id="events-section"
              className="py-16 border-b border-zinc-800/80 bg-[#09090B]"
            >
              <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                    <div className="text-xs font-semibold tracking-widest text-amber-400 uppercase">
                      03. Community Culture, Collaborations & Pop-Up Schedule
                    </div>
                    <h2 className="font-display text-3xl sm:text-4xl font-bold text-white uppercase mt-1">
                      OFFICIAL COLLABORATIONS & UPCOMING EVENTS
                    </h2>
                  </div>

                  <div className="text-xs text-zinc-400">
                    Free live back-plate laser engraving at all physical pop-ups
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {eventsList.map((ev) => {
                    const claimedPass = rsvpClaimedMap[ev.id];
                    return (
                      <article
                        key={ev.id}
                        className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 flex flex-col justify-between space-y-6"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-xs text-amber-400 font-mono-num uppercase">
                            <span>{ev.type}</span>
                            <span>{ev.spotsRemaining} Passes Left</span>
                          </div>

                          <h3 className="font-display text-2xl font-bold text-white uppercase leading-snug">
                            {ev.title}
                          </h3>

                          <div className="text-xs text-zinc-400 space-y-1">
                            <div className="flex items-center gap-1.5 text-zinc-300">
                              <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                              <span>{ev.date}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-zinc-300">
                              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                              <span>{ev.location}</span>
                            </div>
                          </div>

                          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed pt-1">
                            {ev.description}
                          </p>
                        </div>

                        <div className="pt-4 border-t border-zinc-800 space-y-3">
                          <div className="text-[11px] text-zinc-400">
                            Perk: <span className="text-zinc-200">{ev.EditionNote}</span>
                          </div>

                          {claimedPass ? (
                            <div className="p-2.5 rounded-lg bg-emerald-950/50 border border-emerald-500/40 text-xs text-emerald-300 font-mono-num text-center">
                              VIP Pass Reserved: {claimedPass}
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleClaimEventPass(ev.id)}
                              className="w-full py-2.5 rounded-lg bg-zinc-800 hover:bg-amber-400 hover:text-zinc-950 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                            >
                              RSVP Free Collector Pass
                            </button>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            </section>
          </>
        )}

        {activePage === 'about' && (
          /* DEDICATED STANDALONE CINEMATIC ABOUT US & FORGE LAB PAGE */
          <InteractiveAbout
            config={storeConfig}
            reviews={reviews}
            onAddReview={handleAddReview}
            onShopLeague={(league) => navigateToShopLeague(league)}
            onBackHome={() => {
              setActivePage('home');
              window.scrollTo(0, 0);
            }}
          />
        )}

        {activePage === 'shop' && (
          /* OFFICIAL FLAGSHIP SHOP CATALOG PAGE */
          <ShopCatalog
            products={products}
            initialLeagueFilter={shopLeagueFilter}
            isOwnerUnlocked={isOwnerUnlocked}
            onAddToBag={handleAddToBag}
            onOpenCart={() => setIsCartOpen(true)}
            onOpenEditor={() => setStudioModalState({ open: true, mode: 'editor' })}
          />
        )}
      </main>

      {/* CLEAN FOOTER WITH OWNER-ONLY STUDIO GATE & PUBLIC SHARE LINK */}
      <footer className="bg-zinc-950 border-t border-zinc-800/90 py-12">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 justify-between">
            <div className="md:col-span-5 space-y-3">
              <div className="font-display text-2xl font-bold text-white uppercase tracking-wider">
                {storeConfig.brandName}
              </div>
              <p className="text-xs text-zinc-400 max-w-sm leading-relaxed">
                Architectural 316L zinc-alloy football keychains for Premier League, LaLiga, Serie A, and Ligue 1 supporters. Priced in Indonesian Rupiah (IDR) with worldwide shipping.
              </p>
              <div className="text-xs font-mono-num text-zinc-400">
                Public Storefront Link:{' '}
                <a
                  href={storeConfig.publicShareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-400 underline"
                >
                  {storeConfig.publicShareUrl}
                </a>
              </div>
            </div>

            <div className="md:col-span-3 space-y-2 text-xs">
              <div className="font-bold text-white uppercase tracking-wider">
                Store Pages
              </div>
              <ul className="space-y-1.5 text-zinc-400">
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setActivePage('home');
                      window.scrollTo(0, 0);
                    }}
                    className="hover:text-white cursor-pointer"
                  >
                    Page 1: Welcome Film, 4 Deals & 3D Customizer
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={navigateToAboutPage}
                    className="hover:text-white cursor-pointer"
                  >
                    Page 2: Interactive About Us & Forge Lab
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => navigateToShopLeague('ALL')}
                    className="hover:text-white cursor-pointer"
                  >
                    Page 3: Official Flagship Store (IDR)
                  </button>
                </li>
              </ul>
            </div>

            <div className="md:col-span-4 space-y-3 text-xs">
              <div className="font-bold text-white uppercase tracking-wider">
                Share Store & Owner Administration
              </div>
              <p className="text-zinc-400">
                Share the public storefront link with customers. Store editing (pictures, video, and prices) is restricted exclusively to the verified owner:
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setStudioModalState({ open: true, mode: 'share' })}
                  className="px-3.5 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share Website Link</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStudioModalState({ open: true, mode: 'editor' })}
                  className="px-3.5 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-200 font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  {isOwnerUnlocked ? (
                    <>
                      <Unlock className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Owner Studio (Unlocked)</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Owner Access Only</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
            <div>
              © 2026 {storeConfig.brandName}. All Rights Reserved.
            </div>
            <div>
              Accepted Payments: QRIS · GoPay · DANA · PayPal · WhatsApp Direct
            </div>
          </div>
        </div>
      </footer>

      {/* SLIDE-OVER SHOPPING BAG & MULTI-PAYMENT CHECKOUT DRAWER */}
      <CartCheckoutDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        config={storeConfig}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

      {/* OWNER-ONLY STOREFRONT EDITOR & PUBLIC SHARE LINK MODAL */}
      <StoreEditorModal
        isOpen={studioModalState.open}
        initialMode={studioModalState.mode}
        isOwnerUnlocked={isOwnerUnlocked}
        onUnlockOwner={handleUnlockOwner}
        onLockOwner={handleLockOwner}
        onClose={() => setStudioModalState({ ...studioModalState, open: false })}
        config={storeConfig}
        products={products}
        events={eventsList}
        onUpdateConfig={setStoreConfig}
        onUpdateProduct={handleUpdateProduct}
        onDeleteProduct={handleDeleteProduct}
        onAddProduct={handleAddProduct}
        onUpdateEvents={setEventsList}
        onResetAll={handleResetAll}
      />
    </div>
  );
}
