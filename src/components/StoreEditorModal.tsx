import React, { useState } from 'react';
import {
  X,
  Plus,
  RotateCcw,
  Copy,
  Check,
  Share2,
  ExternalLink,
  Lock,
  Unlock,
  Upload,
  Image as ImageIcon,
  Video,
  Trash2,
} from 'lucide-react';
import {
  KeychainProduct,
  StoreConfig,
  LeagueId,
  KeychainModelType,
  CollaborationEvent,
} from '../types/store';
import {
  formatRupiah,
  validateProductInput,
  verifyOwnerCredentials,
} from '../utils/storeLogic';

interface StoreEditorModalProps {
  isOpen: boolean;
  initialMode: 'editor' | 'share';
  isOwnerUnlocked: boolean;
  onUnlockOwner: () => void;
  onLockOwner: () => void;
  onClose: () => void;
  config: StoreConfig;
  products: KeychainProduct[];
  events: CollaborationEvent[];
  onUpdateConfig: (nextConfig: StoreConfig) => void;
  onUpdateProduct: (updatedProduct: KeychainProduct) => void;
  onDeleteProduct: (productId: string) => void;
  onAddProduct: (newProduct: KeychainProduct) => void;
  onUpdateEvents: (nextEvents: CollaborationEvent[]) => void;
  onResetAll: () => void;
}

export const StoreEditorModal: React.FC<StoreEditorModalProps> = ({
  isOpen,
  initialMode,
  isOwnerUnlocked,
  onUnlockOwner,
  onLockOwner,
  onClose,
  config,
  products,
  events,
  onUpdateConfig,
  onUpdateProduct,
  onDeleteProduct,
  onAddProduct,
  onUpdateEvents,
  onResetAll,
}) => {
  const [activeTab, setActiveTab] = useState<
    'share' | 'brand' | 'products' | 'add' | 'events'
  >(initialMode === 'share' ? 'share' : 'brand');

  React.useEffect(() => {
    setActiveTab(initialMode === 'share' ? 'share' : 'brand');
  }, [initialMode, isOpen]);

  // Owner Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPasscode, setLoginPasscode] = useState('');
  const [loginError, setLoginError] = useState('');

  // Brand Edit State
  const [draftConfig, setDraftConfig] = useState<StoreConfig>(config);
  const [savedBanner, setSavedBanner] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  React.useEffect(() => {
    setDraftConfig(config);
  }, [config]);

  // New Product State
  const [newName, setNewName] = useState('');
  const [newClub, setNewClub] = useState('');
  const [newLeague, setNewLeague] = useState<LeagueId>('Premier League');
  const [newModel, setNewModel] = useState<KeychainModelType>('3D Kit Jersey');
  const [newPrice, setNewPrice] = useState('135000');
  const [newOrigPrice, setNewOrigPrice] = useState('185000');
  const [newKitNum, setNewKitNum] = useState('09');
  const [newPrimaryColor, setNewPrimaryColor] = useState('#DC2626');
  const [newSecondaryColor, setNewSecondaryColor] = useState('#18181B');
  const [newCustomImageUrl, setNewCustomImageUrl] = useState('');
  const [addError, setAddError] = useState('');

  if (!isOpen) return null;

  const liveShareUrl =
    typeof window !== 'undefined' && window.location?.origin
      ? window.location.origin
      : config.publicShareUrl;

  const handleOwnerLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = verifyOwnerCredentials({
      inputEmail: loginEmail,
      inputPasscode: loginPasscode,
      expectedEmail: config.ownerEmail,
      expectedPasscode: config.ownerPasscode,
    });
    if (!res.authorized) {
      setLoginError(res.error || 'Invalid credentials.');
      return;
    }
    setLoginError('');
    onUnlockOwner();
  };

  // Convert uploaded image file to a resized JPEG Data URL so it persists cleanly
  const handleImageFileUpload = (
    file: File | undefined,
    onResult: (dataUrl: string) => void
  ) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onResult(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Convert uploaded video file to Object URL or Data URL for immediate playback
  const handleVideoFileUpload = (file: File | undefined) => {
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    const updated = { ...draftConfig, customVideoUrl: objectUrl };
    setDraftConfig(updated);
    onUpdateConfig(updated);
    setSavedBanner(`Loaded custom welcome video "${file.name}" onto the main page!`);
    setTimeout(() => setSavedBanner(''), 3500);
  };

  const handleSaveBrand = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateConfig(draftConfig);
    setSavedBanner('Storefront configuration & welcome video settings saved!');
    setTimeout(() => setSavedBanner(''), 3000);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = Number(newPrice);
    const origNum = newOrigPrice ? Number(newOrigPrice) : undefined;

    const validation = validateProductInput({
      name: newName,
      clubInspiration: newClub,
      priceIdr: priceNum,
      originalPriceIdr: origNum,
      kitNumber: newKitNum,
    });

    if (!validation.valid) {
      setAddError(validation.error || 'Invalid product data.');
      return;
    }

    setAddError('');
    const created: KeychainProduct = {
      id: `bk-custom-${Date.now()}`,
      name: newName.trim(),
      clubInspiration: newClub.trim(),
      league: newLeague,
      modelType: newModel,
      priceIdr: priceNum,
      originalPriceIdr: origNum,
      isFeaturedDiscount: Boolean(origNum && origNum > priceNum),
      weightGrams: 68,
      materialSpec: '316L Zinc Alloy · Hard Enamel · 18K PVD Trim',
      primaryColor: newPrimaryColor,
      secondaryColor: newSecondaryColor,
      accentColor: '#FBBF24',
      kitNumber: newKitNum.trim(),
      engravingDefault: 'BKEYCHAINS 26',
      rating: 5.0,
      reviewCount: 1,
      inStock: true,
      editionTag: origNum && origNum > priceNum ? 'New Drop Sale' : 'Owner Release',
      description: `Official BKeychains ${newLeague} ${newModel} inspired by ${newClub.trim()}.`,
      customImageUrl: newCustomImageUrl.trim() || undefined,
    };

    onAddProduct(created);
    setNewName('');
    setNewClub('');
    setNewCustomImageUrl('');
    setSavedBanner(`Added "${created.name}" to the live catalog!`);
    setTimeout(() => setSavedBanner(''), 3000);
  };

  const handleCopyShareLink = () => {
    navigator.clipboard?.writeText(config.publicShareUrl || liveShareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const requiresOwnerAuth = activeTab !== 'share' && !isOwnerUnlocked;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="BKeychains Owner Studio and Share Link"
    >
      <div className="w-full max-w-4xl rounded-2xl border border-zinc-800 bg-zinc-950 overflow-hidden my-8 shadow-2xl">
        {/* Top Modal Bar */}
        <div className="px-6 py-4 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            {isOwnerUnlocked ? (
              <Unlock className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <Lock className="w-4 h-4 text-amber-400 shrink-0" />
            )}
            <h2 className="font-display text-2xl font-bold text-white uppercase">
              {activeTab === 'share'
                ? 'Public Store Link & Sharing'
                : isOwnerUnlocked
                ? `BKeychains Owner Studio (${config.ownerEmail})`
                : 'Owner-Only Website Editor Gate'}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {isOwnerUnlocked && (
              <button
                type="button"
                onClick={onLockOwner}
                className="px-3 py-1.5 rounded-lg bg-rose-950/70 hover:bg-rose-900 border border-rose-500/40 text-rose-200 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Lock Owner Mode</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close Studio Modal"
              className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 pt-3 border-b border-zinc-800 flex flex-wrap items-center gap-2 bg-zinc-950">
          <button
            type="button"
            onClick={() => setActiveTab('share')}
            className={`px-3.5 py-2 text-xs font-bold uppercase rounded-t-lg border-b-2 cursor-pointer ${
              activeTab === 'share'
                ? 'border-amber-400 text-amber-400 bg-zinc-900/60'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            Public Store Link
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('brand')}
            className={`px-3.5 py-2 text-xs font-bold uppercase rounded-t-lg border-b-2 cursor-pointer ${
              activeTab === 'brand'
                ? 'border-amber-400 text-amber-400 bg-zinc-900/60'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            Welcome Video & Copy
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('products')}
            className={`px-3.5 py-2 text-xs font-bold uppercase rounded-t-lg border-b-2 cursor-pointer ${
              activeTab === 'products'
                ? 'border-amber-400 text-amber-400 bg-zinc-900/60'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            Edit Pictures & Products ({products.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('add')}
            className={`px-3.5 py-2 text-xs font-bold uppercase rounded-t-lg border-b-2 cursor-pointer ${
              activeTab === 'add'
                ? 'border-amber-400 text-amber-400 bg-zinc-900/60'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            + Add Product & Photo
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('events')}
            className={`px-3.5 py-2 text-xs font-bold uppercase rounded-t-lg border-b-2 cursor-pointer ${
              activeTab === 'events'
                ? 'border-amber-400 text-amber-400 bg-zinc-900/60'
                : 'border-transparent text-zinc-400 hover:text-white'
            }`}
          >
            Edit Events ({events.length})
          </button>
        </div>

        <div className="p-6 max-h-[74vh] overflow-y-auto space-y-6">
          {savedBanner && (
            <div className="p-3 rounded-lg bg-emerald-950/70 border border-emerald-500/50 text-xs text-emerald-300 font-medium">
              {savedBanner}
            </div>
          )}

          {/* OWNER AUTHENTICATION GATE (IF NOT UNLOCKED YET) */}
          {requiresOwnerAuth ? (
            <form
              onSubmit={handleOwnerLoginSubmit}
              className="max-w-md mx-auto my-6 p-6 rounded-xl border border-zinc-800 bg-zinc-900/60 space-y-4"
            >
              <div className="space-y-1">
                <div className="text-xs font-mono-num text-amber-400 uppercase">
                  PROTECTED STOREFRONT ADMINISTRATION
                </div>
                <h3 className="font-display text-2xl font-bold text-white uppercase">
                  Verify Store Owner Identity
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Only the store owner can modify website text, change product pictures, or upload a welcome video. Customers and visitors have read-only shopping access.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label htmlFor="owner-email-input" className="block text-xs text-zinc-300 mb-1">
                    Owner Email Address
                  </label>
                  <input
                    id="owner-email-input"
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="bkeychains5@gmail.com"
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-sm text-white"
                  />
                </div>

                <div>
                  <label htmlFor="owner-pass-input" className="block text-xs text-zinc-300 mb-1">
                    Owner Passkey (Default: BKEY2026)
                  </label>
                  <input
                    id="owner-pass-input"
                    type="password"
                    value={loginPasscode}
                    onChange={(e) => setLoginPasscode(e.target.value)}
                    placeholder="Enter owner passkey..."
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-sm text-white font-mono-num"
                  />
                </div>
              </div>

              {loginError && <p className="text-xs text-rose-400">{loginError}</p>}

              <button
                type="submit"
                className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs uppercase tracking-wider rounded-lg cursor-pointer"
              >
                Unlock Owner Website Editor
              </button>
            </form>
          ) : (
            <>
              {/* TAB 1: PUBLIC SHAREABLE BKEYCHAINS LINKS */}
              {activeTab === 'share' && (
                <div className="space-y-5">
                  <div className="space-y-1">
                    <div className="text-xs font-mono-num text-emerald-400 uppercase font-bold">
                      LIVE PUBLISHED STOREFRONT · ROOT BASENAME (/)
                    </div>
                    <h3 className="font-display text-2xl font-bold text-white uppercase">
                      Official Published BKeychains Links
                    </h3>
                    <p className="text-xs text-zinc-400">
                      Share your BKeychains links below on Instagram, TikTok, or WhatsApp. Customers land directly on your storefront while editing stays locked to you.
                    </p>
                  </div>

                  {/* Primary Branded Link */}
                  <div className="p-5 rounded-xl bg-zinc-900 border border-amber-400/50 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">
                        1. Main Storefront Link (/)
                      </span>
                      <span className="text-[11px] font-mono-num text-emerald-400">
                        ● PUBLIC & LIVE
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        aria-label="Published BKeychains Main URL"
                        value={`${liveShareUrl.replace(/\/$/, '')}/`}
                        className="flex-1 px-3 py-2.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-mono-num text-amber-400 font-semibold"
                      />
                      <button
                        type="button"
                        onClick={handleCopyShareLink}
                        className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs uppercase rounded-lg inline-flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer"
                      >
                        {copiedLink ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span>Copied Store Link!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            <span>Copy Main Link</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Direct Deep Links for About Us, Page 2 Shop & 3D Customizer */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-zinc-800">
                      <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 space-y-1.5">
                        <div className="text-[11px] text-zinc-400 font-semibold uppercase">
                          2. About Us & Forge Lab Page:
                        </div>
                        <div className="font-mono-num text-[11px] text-zinc-200 truncate">
                          {`${liveShareUrl.replace(/\/$/, '')}/about`}
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard?.writeText(
                              `${liveShareUrl.replace(/\/$/, '')}/about`
                            );
                            setSavedBanner('Copied /about link to clipboard!');
                            setTimeout(() => setSavedBanner(''), 2500);
                          }}
                          className="text-xs text-amber-400 hover:underline font-semibold inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Copy About Us Link</span>
                        </button>
                      </div>

                      <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 space-y-1.5">
                        <div className="text-[11px] text-zinc-400 font-semibold uppercase">
                          3. Direct Official Shop Link:
                        </div>
                        <div className="font-mono-num text-[11px] text-zinc-200 truncate">
                          {`${liveShareUrl.replace(/\/$/, '')}/shop`}
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard?.writeText(
                              `${liveShareUrl.replace(/\/$/, '')}/shop`
                            );
                            setSavedBanner('Copied /shop link to clipboard!');
                            setTimeout(() => setSavedBanner(''), 2500);
                          }}
                          className="text-xs text-amber-400 hover:underline font-semibold inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Copy Shop Catalog Link</span>
                        </button>
                      </div>

                      <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 space-y-1.5">
                        <div className="text-[11px] text-zinc-400 font-semibold uppercase">
                          4. Direct 3D Customizer Link:
                        </div>
                        <div className="font-mono-num text-[11px] text-zinc-200 truncate">
                          {`${liveShareUrl.replace(/\/$/, '')}/customizer`}
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard?.writeText(
                              `${liveShareUrl.replace(/\/$/, '')}/customizer`
                            );
                            setSavedBanner('Copied /customizer link to clipboard!');
                            setTimeout(() => setSavedBanner(''), 2500);
                          }}
                          className="text-xs text-amber-400 hover:underline font-semibold inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Copy 3D Customizer Link</span>
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 pt-2 text-xs">
                      <a
                        href={`${liveShareUrl.replace(/\/$/, '')}/`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-200 hover:text-white underline inline-flex items-center gap-1 font-semibold"
                      >
                        <span>Open Storefront in New Tab</span>
                        <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                      </a>

                      <a
                        href={`https://wa.me/?text=${encodeURIComponent(
                          `Shop official BKeychains Football Keychains (Premier League, LaLiga, Serie A, Ligue 1): ${liveShareUrl.replace(/\/$/, '')}/`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-400 hover:text-emerald-300 underline inline-flex items-center gap-1 font-semibold"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Share /BKeychains on WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: EDIT WELCOME VIDEO & BRAND HEADLINES */}
              {activeTab === 'brand' && (
                <form onSubmit={handleSaveBrand} className="space-y-5">
                  {/* Welcome Video Manager Box */}
                  <div className="p-4 rounded-xl border border-amber-400/30 bg-zinc-900/70 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase">
                        <Video className="w-4 h-4" />
                        <span>Welcome Page Video Configuration</span>
                      </div>
                      {draftConfig.customVideoUrl && (
                        <button
                          type="button"
                          onClick={() =>
                            setDraftConfig({ ...draftConfig, customVideoUrl: '' })
                          }
                          className="text-xs text-rose-400 hover:underline cursor-pointer"
                        >
                          Revert to 3D Stadium Commercial Film
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label
                          htmlFor="edit-video-url"
                          className="block text-xs text-zinc-300 mb-1"
                        >
                          Custom Video URL (.mp4 / .webm) — Leave blank for 3D Stadium Film
                        </label>
                        <input
                          id="edit-video-url"
                          type="text"
                          value={draftConfig.customVideoUrl || ''}
                          onChange={(e) =>
                            setDraftConfig({
                              ...draftConfig,
                              customVideoUrl: e.target.value,
                            })
                          }
                          placeholder="https://example.com/my-keychain-promo.mp4"
                          className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-zinc-300 mb-1">
                          Or Upload Video File From Your Device (.mp4 / .webm)
                        </label>
                        <label className="w-full px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-xs text-white font-semibold inline-flex items-center justify-center gap-2 cursor-pointer">
                          <Upload className="w-3.5 h-3.5 text-amber-400" />
                          <span>Choose Video File</span>
                          <input
                            type="file"
                            accept="video/mp4,video/webm,video/quicktime"
                            onChange={(e) => handleVideoFileUpload(e.target.files?.[0])}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="edit-video-title"
                        className="block text-xs text-zinc-300 mb-1"
                      >
                        Welcome Video Banner Title
                      </label>
                      <input
                        id="edit-video-title"
                        type="text"
                        value={draftConfig.promoVideoTitle}
                        onChange={(e) =>
                          setDraftConfig({
                            ...draftConfig,
                            promoVideoTitle: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="edit-brand-name" className="block text-xs text-zinc-300 mb-1">
                        Brand Wordmark
                      </label>
                      <input
                        id="edit-brand-name"
                        type="text"
                        value={draftConfig.brandName}
                        onChange={(e) =>
                          setDraftConfig({ ...draftConfig, brandName: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white"
                      />
                    </div>
                    <div>
                      <label htmlFor="edit-wa-num" className="block text-xs text-zinc-300 mb-1">
                        Merchant WhatsApp Number
                      </label>
                      <input
                        id="edit-wa-num"
                        type="text"
                        value={draftConfig.whatsappNumber}
                        onChange={(e) =>
                          setDraftConfig({
                            ...draftConfig,
                            whatsappNumber: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-sm font-mono-num text-white"
                      />
                    </div>
                    <div>
                      <label htmlFor="edit-passkey" className="block text-xs text-zinc-300 mb-1">
                        Owner Secret Passkey
                      </label>
                      <input
                        id="edit-passkey"
                        type="text"
                        value={draftConfig.ownerPasscode}
                        onChange={(e) =>
                          setDraftConfig({
                            ...draftConfig,
                            ownerPasscode: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-sm font-mono-num text-amber-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="edit-hero-headline"
                      className="block text-xs text-zinc-300 mb-1"
                    >
                      Main Welcome Hero Headline
                    </label>
                    <input
                      id="edit-hero-headline"
                      type="text"
                      value={draftConfig.heroHeadline}
                      onChange={(e) =>
                        setDraftConfig({ ...draftConfig, heroHeadline: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white"
                    />
                  </div>

                  <div>
                    <label htmlFor="edit-hero-sub" className="block text-xs text-zinc-300 mb-1">
                      Hero Subheadline
                    </label>
                    <textarea
                      id="edit-hero-sub"
                      rows={2}
                      value={draftConfig.heroSubheadline}
                      onChange={(e) =>
                        setDraftConfig({
                          ...draftConfig,
                          heroSubheadline: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white"
                    />
                  </div>

                  <div>
                    <label htmlFor="edit-about-story" className="block text-xs text-zinc-300 mb-1">
                      About Us Profile Story
                    </label>
                    <textarea
                      id="edit-about-story"
                      rows={3}
                      value={draftConfig.aboutStory}
                      onChange={(e) =>
                        setDraftConfig({ ...draftConfig, aboutStory: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
                    <button
                      type="button"
                      onClick={onResetAll}
                      className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white text-xs inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset Store to Factory Default</span>
                    </button>

                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs uppercase rounded-lg cursor-pointer"
                    >
                      Save Brand & Video Changes
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 3: EDIT EXISTING PRODUCTS & CHANGE PICTURES */}
              {activeTab === 'products' && (
                <div className="space-y-4">
                  <p className="text-xs text-zinc-400">
                    Change any product’s picture (upload from your computer/phone or paste an image URL), edit its name, description, league, or Rupiah prices:
                  </p>
                  {products.map((prod) => (
                    <div
                      key={prod.id}
                      className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 space-y-3"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                        <div className="sm:col-span-5">
                          <label className="block text-[10px] text-zinc-400">
                            Product Title
                          </label>
                          <input
                            type="text"
                            aria-label={`Product name for ${prod.name}`}
                            value={prod.name}
                            onChange={(e) =>
                              onUpdateProduct({ ...prod, name: e.target.value })
                            }
                            className="w-full px-2.5 py-1.5 rounded bg-zinc-950 border border-zinc-800 text-xs text-white font-medium"
                          />
                        </div>

                        <div className="sm:col-span-3">
                          <label className="block text-[10px] text-zinc-400">
                            League
                          </label>
                          <select
                            value={prod.league}
                            onChange={(e) =>
                              onUpdateProduct({
                                ...prod,
                                league: e.target.value as LeagueId,
                              })
                            }
                            className="w-full px-2.5 py-1.5 rounded bg-zinc-950 border border-zinc-800 text-xs text-white"
                          >
                            <option value="Premier League">Premier League</option>
                            <option value="LaLiga">LaLiga</option>
                            <option value="Serie A">Serie A</option>
                            <option value="Ligue 1">Ligue 1</option>
                          </select>
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-[10px] text-zinc-400">
                            Sale Price (IDR)
                          </label>
                          <input
                            type="number"
                            step={1000}
                            value={prod.priceIdr}
                            onChange={(e) =>
                              onUpdateProduct({
                                ...prod,
                                priceIdr: Math.max(10000, Number(e.target.value) || 0),
                              })
                            }
                            className="w-full px-2.5 py-1.5 rounded bg-zinc-950 border border-zinc-800 text-xs font-mono-num text-amber-400"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-[10px] text-zinc-400">
                            Original Price (IDR)
                          </label>
                          <input
                            type="number"
                            step={1000}
                            value={prod.originalPriceIdr || ''}
                            placeholder="None"
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              onUpdateProduct({
                                ...prod,
                                originalPriceIdr: val > 0 ? val : undefined,
                                isFeaturedDiscount: val > prod.priceIdr,
                              });
                            }}
                            className="w-full px-2.5 py-1.5 rounded bg-zinc-950 border border-zinc-800 text-xs font-mono-num text-zinc-300"
                          />
                        </div>
                      </div>

                      {/* Picture Upload & Image URL Row */}
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center pt-2 border-t border-zinc-800/70">
                        <div className="sm:col-span-6">
                          <label className="block text-[10px] text-zinc-400">
                            Custom Product Picture URL (or upload file on the right)
                          </label>
                          <input
                            type="text"
                            value={prod.customImageUrl || ''}
                            placeholder="Using 3D Metallic Studio Render (Paste URL or upload photo to override)"
                            onChange={(e) =>
                              onUpdateProduct({
                                ...prod,
                                customImageUrl: e.target.value || undefined,
                              })
                            }
                            className="w-full px-2.5 py-1.5 rounded bg-zinc-950 border border-zinc-800 text-xs text-zinc-200"
                          />
                        </div>

                        <div className="sm:col-span-4 flex items-center gap-2 pt-3 sm:pt-0">
                          <label className="flex-1 px-3 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-xs text-white font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer">
                            <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                            <span>Upload Photo</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                handleImageFileUpload(e.target.files?.[0], (dataUrl) => {
                                  onUpdateProduct({ ...prod, customImageUrl: dataUrl });
                                  setSavedBanner(`Updated picture for "${prod.name}"!`);
                                  setTimeout(() => setSavedBanner(''), 2500);
                                })
                              }
                              className="hidden"
                            />
                          </label>

                          {prod.customImageUrl && (
                            <button
                              type="button"
                              onClick={() =>
                                onUpdateProduct({ ...prod, customImageUrl: undefined })
                              }
                              className="px-2.5 py-1.5 rounded bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-400 hover:text-white cursor-pointer"
                            >
                              3D Default
                            </button>
                          )}
                        </div>

                        <div className="sm:col-span-2 flex justify-end">
                          <button
                            type="button"
                            onClick={() => onDeleteProduct(prod.id)}
                            aria-label={`Delete ${prod.name}`}
                            className="px-2.5 py-1.5 rounded bg-rose-950/50 hover:bg-rose-900/70 text-rose-300 text-xs inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 4: ADD NEW PRODUCT WITH PICTURE UPLOAD */}
              {activeTab === 'add' && (
                <form onSubmit={handleCreateProduct} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="new-prod-name" className="block text-xs text-zinc-300 mb-1">
                        Product Name
                      </label>
                      <input
                        id="new-prod-name"
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="e.g., Stamford Bridge Lions #8 Shield"
                        className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white"
                      />
                    </div>
                    <div>
                      <label htmlFor="new-prod-club" className="block text-xs text-zinc-300 mb-1">
                        Club Inspiration Subtitle
                      </label>
                      <input
                        id="new-prod-club"
                        type="text"
                        value={newClub}
                        onChange={(e) => setNewClub(e.target.value)}
                        placeholder="e.g., West London Blues · 2012 Munich Edition"
                        className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white"
                      />
                    </div>
                  </div>

                  {/* Optional Custom Picture Upload for New Product */}
                  <div className="p-3.5 rounded-xl bg-zinc-900/70 border border-zinc-800 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                    <div className="sm:col-span-8">
                      <label
                        htmlFor="new-prod-img"
                        className="block text-xs text-zinc-300 mb-1"
                      >
                        Product Photo URL (Optional — or upload a file)
                      </label>
                      <input
                        id="new-prod-img"
                        type="text"
                        value={newCustomImageUrl}
                        onChange={(e) => setNewCustomImageUrl(e.target.value)}
                        placeholder="Paste image URL or leave blank to auto-generate 3D model"
                        className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-white"
                      />
                    </div>
                    <div className="sm:col-span-4 pt-2 sm:pt-4">
                      <label className="w-full px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-xs text-white font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer">
                        <Upload className="w-3.5 h-3.5 text-amber-400" />
                        <span>Upload Product Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleImageFileUpload(e.target.files?.[0], (dataUrl) =>
                              setNewCustomImageUrl(dataUrl)
                            )
                          }
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label htmlFor="new-prod-league" className="block text-xs text-zinc-300 mb-1">
                        League
                      </label>
                      <select
                        id="new-prod-league"
                        value={newLeague}
                        onChange={(e) => setNewLeague(e.target.value as LeagueId)}
                        className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white"
                      >
                        <option value="Premier League">Premier League</option>
                        <option value="LaLiga">LaLiga</option>
                        <option value="Serie A">Serie A</option>
                        <option value="Ligue 1">Ligue 1</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="new-prod-model" className="block text-xs text-zinc-300 mb-1">
                        Model Type
                      </label>
                      <select
                        id="new-prod-model"
                        value={newModel}
                        onChange={(e) => setNewModel(e.target.value as KeychainModelType)}
                        className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white"
                      >
                        <option value="3D Kit Jersey">3D Kit Jersey</option>
                        <option value="Club Shield">Club Shield</option>
                        <option value="Striker Boot">Striker Boot</option>
                        <option value="Trophy Edition">Trophy Edition</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="new-prod-price" className="block text-xs text-zinc-300 mb-1">
                        Selling Price (IDR)
                      </label>
                      <input
                        id="new-prod-price"
                        type="number"
                        value={newPrice}
                        onChange={(e) => setNewPrice(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono-num text-white"
                      />
                    </div>

                    <div>
                      <label htmlFor="new-prod-orig" className="block text-xs text-zinc-300 mb-1">
                        Original Price (Optional)
                      </label>
                      <input
                        id="new-prod-orig"
                        type="number"
                        value={newOrigPrice}
                        onChange={(e) => setNewOrigPrice(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono-num text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label htmlFor="new-prod-num" className="block text-xs text-zinc-300 mb-1">
                        Kit / Badge Number
                      </label>
                      <input
                        id="new-prod-num"
                        type="text"
                        maxLength={2}
                        value={newKitNum}
                        onChange={(e) => setNewKitNum(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-mono-num text-white"
                      />
                    </div>
                    <div>
                      <label htmlFor="new-prod-c1" className="block text-xs text-zinc-300 mb-1">
                        Primary Enamel Hex
                      </label>
                      <input
                        id="new-prod-c1"
                        type="color"
                        value={newPrimaryColor}
                        onChange={(e) => setNewPrimaryColor(e.target.value)}
                        className="w-full h-9 rounded-lg bg-zinc-900 border border-zinc-800 cursor-pointer"
                      />
                    </div>
                    <div>
                      <label htmlFor="new-prod-c2" className="block text-xs text-zinc-300 mb-1">
                        Secondary Enamel Hex
                      </label>
                      <input
                        id="new-prod-c2"
                        type="color"
                        value={newSecondaryColor}
                        onChange={(e) => setNewSecondaryColor(e.target.value)}
                        className="w-full h-9 rounded-lg bg-zinc-900 border border-zinc-800 cursor-pointer"
                      />
                    </div>
                  </div>

                  {addError && <p className="text-xs text-rose-400">{addError}</p>}

                  <button
                    type="submit"
                    className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold text-xs uppercase tracking-wider rounded-lg inline-flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Keychain to Official Catalog</span>
                  </button>
                </form>
              )}

              {/* TAB 5: EDIT COLLABORATIONS & UPCOMING EVENTS */}
              {activeTab === 'events' && (
                <div className="space-y-4">
                  <p className="text-xs text-zinc-400">
                    Edit any collaboration or upcoming pop-up event shown on the main page:
                  </p>
                  {events.map((ev, idx) => (
                    <div
                      key={ev.id}
                      className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 space-y-3"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] text-zinc-400">
                            Event / Collaboration Title
                          </label>
                          <input
                            type="text"
                            value={ev.title}
                            onChange={(e) => {
                              const next = [...events];
                              next[idx] = { ...ev, title: e.target.value };
                              onUpdateEvents(next);
                            }}
                            className="w-full px-2.5 py-1.5 rounded bg-zinc-950 border border-zinc-800 text-xs text-white font-semibold"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-zinc-400">
                            Date & Time
                          </label>
                          <input
                            type="text"
                            value={ev.date}
                            onChange={(e) => {
                              const next = [...events];
                              next[idx] = { ...ev, date: e.target.value };
                              onUpdateEvents(next);
                            }}
                            className="w-full px-2.5 py-1.5 rounded bg-zinc-950 border border-zinc-800 text-xs text-zinc-200"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] text-zinc-400">
                            Location / Venue
                          </label>
                          <input
                            type="text"
                            value={ev.location}
                            onChange={(e) => {
                              const next = [...events];
                              next[idx] = { ...ev, location: e.target.value };
                              onUpdateEvents(next);
                            }}
                            className="w-full px-2.5 py-1.5 rounded bg-zinc-950 border border-zinc-800 text-xs text-zinc-200"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-zinc-400">
                            Exclusive Collector Note
                          </label>
                          <input
                            type="text"
                            value={ev.EditionNote}
                            onChange={(e) => {
                              const next = [...events];
                              next[idx] = { ...ev, EditionNote: e.target.value };
                              onUpdateEvents(next);
                            }}
                            className="w-full px-2.5 py-1.5 rounded bg-zinc-950 border border-zinc-800 text-xs text-amber-400"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
