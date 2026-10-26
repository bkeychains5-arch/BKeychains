import {
  KeychainProduct,
  SupporterReview,
  CollaborationEvent,
  StoreConfig,
  LeagueId,
} from '../types/store';

export const INITIAL_STORE_CONFIG: StoreConfig = {
  brandName: 'BKEYCHAINS',
  heroKicker: '2026 MATCHDAY METALCRAFT COLLECTION',
  heroHeadline: 'CARRY THE CREST. ENGINEERED IN HEAVY METAL.',
  heroSubheadline:
    'Die-cast 316L zinc-alloy football keychains crafted for supporters of Premier League, LaLiga, Serie A, and Ligue 1. Precision hard enamel, 18K PVD gold plating, and bespoke laser engraving.',
  promoVideoTitle: 'OFFICIAL CAMPAIGN FILM — FORGED FOR THE 90TH MINUTE',
  customVideoUrl: '',
  aboutHeadline: 'CRAFTED LIKE STADIUM SILVERWARE.',
  aboutStory:
    'Founded in 2024 by industrial designers and lifelong matchday collectors, BKeychains replaces flimsy plastic souvenirs with 68-gram architectural metal keychains. Every piece is CNC-milled, hand-filled with scratch-proof hard enamel, and tested for 10,000+ clasp cycles.',
  whatsappNumber: '6281298765432',
  publicShareUrl:
    'https://ais-pre-id3rvize275ixuf7dms6bl-356326806483.asia-northeast1.run.app/',
  freeShippingThresholdIdr: 250000,
  ownerEmail: 'bkeychains5@gmail.com',
  ownerPasscode: 'BKEY2026',
};

export interface LeagueProfile {
  id: LeagueId;
  country: string;
  tagline: string;
  clubsCovered: string[];
  signatureFinish: string;
  collectorCount: string;
  accentHex: string;
  description: string;
}

export const LEAGUE_PROFILES: LeagueProfile[] = [
  {
    id: 'Premier League',
    country: 'England',
    tagline: 'High-Tempo Heritage & Iconic Red-and-Blue Metalwork',
    clubsCovered: [
      'Manchester Red Devils',
      'North London Cannon',
      'Merseyside Reds',
      'Manchester Sky Blues',
      'West London Lions',
    ],
    signatureFinish: '18K Brushed Gold & Deep Crimson Hard Enamel',
    collectorCount: '19,400+ Pieces Delivered in ID & UK',
    accentHex: '#E11D48',
    description:
      'Built to survive rain-soaked away days. Our Premier League series features deeply recessed kit numbers, weighted carabiner clips, and authentic collar trim detailing.',
  },
  {
    id: 'LaLiga',
    country: 'Spain',
    tagline: 'Royal Gold Leaf & Catalan Blaugrana Precision',
    clubsCovered: [
      'Madrid Royal Blancos',
      'Barcelona Blaugrana',
      'Madrid Rojiblancos',
      'San Sebastian Txuri-Urdin',
    ],
    signatureFinish: 'Mirror PVD Gold & Royal Porcelain Enamel',
    collectorCount: '14,200+ Pieces Delivered',
    accentHex: '#F59E0B',
    description:
      'Inspired by European silverware and architectural stadium facades in Madrid and Barcelona. High-gloss enamel meets diamond-cut metallic borders.',
  },
  {
    id: 'Serie A',
    country: 'Italy',
    tagline: 'Milanese Sartorial Stripes & Scudetto Shield Craft',
    clubsCovered: [
      'Milano Nerazzurri',
      'Milano Rossoneri',
      'Torino Bianconeri',
      'Roma Giallorossi',
      'Napoli Azzurri',
    ],
    signatureFinish: 'Anodized Gunmetal & Cobalt Cloisonné Enamel',
    collectorCount: '8,900+ Pieces Delivered',
    accentHex: '#3B82F6',
    description:
      'Designed with Italian industrial geometry. Sharp vertical stripe recesses, braided full-grain leather wrist loops, and laser-etched stadium coordinates.',
  },
  {
    id: 'Ligue 1',
    country: 'France',
    tagline: 'Parisian Streetwear Luxury & Côte d’Azur Accents',
    clubsCovered: [
      'Paris Parc Capitale',
      'Marseille Olympique',
      'Lyon Les Gones',
      'Monaco Principality',
    ],
    signatureFinish: 'Satin Midnight Navy & Brushed Platinum Steel',
    collectorCount: '5,700+ Pieces Delivered',
    accentHex: '#6366F1',
    description:
      'Where football culture meets Parisian haute streetwear. Features dual-tone anodized clasps and heavy woven jacquard wrist tags.',
  },
];

export interface MaterialSpecItem {
  id: string;
  name: string;
  grade: string;
  metricValue: string;
  metricLabel: string;
  summary: string;
  testResult: string;
}

export const PREMIUM_MATERIALS: MaterialSpecItem[] = [
  {
    id: 'zinc-core',
    name: 'Die-Cast 316L Zinc-Alloy Core',
    grade: 'Aerospace Density Casting',
    metricValue: '68g',
    metricLabel: 'Solid Hand Weight',
    summary:
      'High-density molten metal injection produces sharp 0.2mm crest relief and a reassuring luxury heft in your palm—zero hollow rattle or brittle plastic.',
    testResult: 'Survived 2.5m drop impact onto concrete without deformation (ISO-9227 Verified).',
  },
  {
    id: 'hard-enamel',
    name: 'Kiln-Fired Vitreous Hard Enamel',
    grade: '800°C Cured Mineral Pigment',
    metricValue: '9H',
    metricLabel: 'Surface Hardness',
    summary:
      'Each club colorway is hand-pipetted into metal channels, kiln-cured, and stone-polished flush with the raised metal walls so keys never scratch the crest.',
    testResult: 'Zero UV fading or key-ring abrasion after 500 hours of pocket friction testing.',
  },
  {
    id: 'pvd-gold',
    name: '18K PVD Gold & Gunmetal Vacuum Plating',
    grade: 'Physical Vapor Deposition',
    metricValue: '3.5μm',
    metricLabel: 'Plating Thickness',
    summary:
      'The same vacuum-coating process used on luxury Swiss dive watches. Sweat-proof, corrosion-immune in tropical humidity, and hypoallergenic.',
    testResult: 'Passed 96-hour salt-spray corrosion chamber test with 0% tarnish.',
  },
  {
    id: 'tactical-clasp',
    name: 'Spring-Loaded Carabiner & Ballistic Strap',
    grade: '1680D Nylon + CNC Spring Gate',
    metricValue: '15,000+',
    metricLabel: 'Gate Snap Cycles',
    summary:
      'Custom-milled hexagonal carabiner with laser-etched league serial code, paired with a detachable woven matchday lanyard strap.',
    testResult: 'Rated to hold up to 18 kg of pull tension without spring fatigue.',
  },
];

export const INITIAL_PRODUCTS: KeychainProduct[] = [
  // 4 Featured Discounted Products (Displayed on Page 1 & Page 2)
  {
    id: 'bk-pl-01',
    name: 'Manchester Theatre #7 Home Kit Keychain',
    clubInspiration: 'Manchester Red Devils · Old Trafford Edition',
    league: 'Premier League',
    modelType: '3D Kit Jersey',
    priceIdr: 129000,
    originalPriceIdr: 189000,
    isFeaturedDiscount: true,
    weightGrams: 68,
    materialSpec: '316L Zinc Alloy · Crimson Hard Enamel · 18K Gold Trim',
    primaryColor: '#DC2626',
    secondaryColor: '#18181B',
    accentColor: '#FBBF24',
    kitNumber: '07',
    engravingDefault: 'THEATRE OF DREAMS',
    rating: 4.9,
    reviewCount: 342,
    inStock: true,
    editionTag: 'Matchday Drop -32%',
    description:
      'Sculpted 3D home shirt featuring iconic collar trim, recessed #07 squad typography, and a detachable miniature Premier crown charm.',
  },
  {
    id: 'bk-ll-01',
    name: 'Bernabéu Royal XV Crown Crest Medallion',
    clubInspiration: 'Madrid Royal Blancos · 15x European Kings',
    league: 'LaLiga',
    modelType: 'Club Shield',
    priceIdr: 139000,
    originalPriceIdr: 199000,
    isFeaturedDiscount: true,
    weightGrams: 74,
    materialSpec: '18K PVD Gold · Porcelain White Enamel · Sapphire Accent',
    primaryColor: '#F8FAFC',
    secondaryColor: '#1E3A8A',
    accentColor: '#F59E0B',
    kitNumber: '15',
    engravingDefault: 'HALA MADRID XV',
    rating: 5.0,
    reviewCount: 418,
    inStock: true,
    editionTag: 'Matchday Drop -30%',
    description:
      'Heavy heirloom crest medallion finished in brushed 18K PVD gold and royal white vitreous enamel with 15 laser-etched stars on the reverse.',
  },
  {
    id: 'bk-sa-01',
    name: 'San Siro Nerazzurri Segunda Stella Shield',
    clubInspiration: 'Milano Nerazzurri · 20th Scudetto Edition',
    league: 'Serie A',
    modelType: 'Club Shield',
    priceIdr: 125000,
    originalPriceIdr: 175000,
    isFeaturedDiscount: true,
    weightGrams: 66,
    materialSpec: 'Anodized Gunmetal · Cobalt Cloisonné · Dual Gold Stars',
    primaryColor: '#1D4ED8',
    secondaryColor: '#09090B',
    accentColor: '#FACC15',
    kitNumber: '10',
    engravingDefault: 'CAMPIONI XX',
    rating: 4.9,
    reviewCount: 196,
    inStock: true,
    editionTag: 'Matchday Drop -29%',
    description:
      'Precision-machined Italian shield with deep cobalt and obsidian vertical channels, crowned by two raised gold Scudetto stars.',
  },
  {
    id: 'bk-l1-01',
    name: 'Parc des Princes Midnight Hechter Kit #10',
    clubInspiration: 'Paris Capitale · Avenue Stripe Edition',
    league: 'Ligue 1',
    modelType: '3D Kit Jersey',
    priceIdr: 119000,
    originalPriceIdr: 169000,
    isFeaturedDiscount: true,
    weightGrams: 64,
    materialSpec: 'Satin Navy Alloy · Crimson Center Stripe · Chrome Gate',
    primaryColor: '#1E293B',
    secondaryColor: '#E11D48',
    accentColor: '#F8FAFC',
    kitNumber: '10',
    engravingDefault: 'ICI C EST PARIS',
    rating: 4.8,
    reviewCount: 154,
    inStock: true,
    editionTag: 'Matchday Drop -30%',
    description:
      'Signature Parisian midnight navy jersey silhouette with the classic red central Hechter bar framed in crisp white enamel borders.',
  },

  // Additional 8 Catalog Products for Page 2 Flagship Store
  {
    id: 'bk-pl-02',
    name: 'North London Invincibles Golden Cannon Boot',
    clubInspiration: 'North London Gunners · 2004 Unbeaten Tribute',
    league: 'Premier League',
    modelType: 'Striker Boot',
    priceIdr: 165000,
    weightGrams: 72,
    materialSpec: 'Brushed Brass · Crimson Heel Counter · Studded Sole',
    primaryColor: '#DC2626',
    secondaryColor: '#F8FAFC',
    accentColor: '#D97706',
    kitNumber: '14',
    engravingDefault: '49 UNBEATEN',
    rating: 4.9,
    reviewCount: 289,
    inStock: true,
    editionTag: 'Collector Series',
    description:
      '3D sculpted striker cleat with six metallic studs, textured lace embossing, and a secondary mini cannon medallion on the split ring.',
  },
  {
    id: 'bk-pl-03',
    name: 'Anfield Kop Six-Star European Trophy Keychain',
    clubInspiration: 'Merseyside Reds · Shankly Gates Edition',
    league: 'Premier League',
    modelType: 'Trophy Edition',
    priceIdr: 179000,
    weightGrams: 78,
    materialSpec: 'Mirror Surgical Steel · Scarlet Ribbon Strap',
    primaryColor: '#B91C1C',
    secondaryColor: '#E2E8F0',
    accentColor: '#FBBF24',
    kitNumber: '06',
    engravingDefault: 'NEVER WALK ALONE',
    rating: 5.0,
    reviewCount: 311,
    inStock: true,
    editionTag: 'Heavyweight 78g',
    description:
      'Full-relief miniature silverware cup with twin handles and a scarlet jacquard wrist tag embroidered with golden liverbird geometry.',
  },
  {
    id: 'bk-ll-02',
    name: 'Camp Nou Blaugrana Centennial #10 Jersey',
    clubInspiration: 'Barcelona Blaugrana · La Masia Heritage',
    league: 'LaLiga',
    modelType: '3D Kit Jersey',
    priceIdr: 159000,
    weightGrams: 67,
    materialSpec: 'Garnet & Cobalt Hard Enamel · 18K Gold Collar',
    primaryColor: '#991B1B',
    secondaryColor: '#1E40AF',
    accentColor: '#FBBF24',
    kitNumber: '10',
    engravingDefault: 'MES QUE UN CLUB',
    rating: 4.9,
    reviewCount: 274,
    inStock: true,
    editionTag: 'Best Seller',
    description:
      'Split garnet-and-royal-blue enamel jersey with raised metallic gold #10 back print and Catalan senyera neck detail.',
  },
  {
    id: 'bk-ll-03',
    name: 'Metropolitano Rojiblanco Striker Boot #19',
    clubInspiration: 'Madrid Rojiblancos · Courage & Heart',
    league: 'LaLiga',
    modelType: 'Striker Boot',
    priceIdr: 149000,
    weightGrams: 65,
    materialSpec: 'Anodized Gunmetal · Red-White Stripe Inlay',
    primaryColor: '#EF4444',
    secondaryColor: '#F8FAFC',
    accentColor: '#1E3A8A',
    kitNumber: '19',
    engravingDefault: 'CORAJE Y CORAZON',
    rating: 4.7,
    reviewCount: 98,
    inStock: true,
    editionTag: 'Limited Run',
    description:
      'Aggressive aerodynamic football boot casting with crimson-and-white heel chevron and laser-engraved stadium coordinates.',
  },
  {
    id: 'bk-sa-02',
    name: 'Curva Sud Rossoneri Devil 7x Trophy Edition',
    clubInspiration: 'Milano Rossoneri · European Aristocracy',
    league: 'Serie A',
    modelType: 'Trophy Edition',
    priceIdr: 175000,
    weightGrams: 76,
    materialSpec: 'Obsidian Black Chrome · Crimson Enamel Inlay',
    primaryColor: '#991B1B',
    secondaryColor: '#09090B',
    accentColor: '#F8FAFC',
    kitNumber: '03',
    engravingDefault: 'SEMPRE MILAN VII',
    rating: 4.9,
    reviewCount: 205,
    inStock: true,
    editionTag: 'Archive Release',
    description:
      'Dual-piece keychain pairing a mirror-polished trophy silhouette with a red-and-black striped enamel dog tag.',
  },
  {
    id: 'bk-sa-03',
    name: 'Torino Bianconeri Zebra #10 Classic Kit',
    clubInspiration: 'Torino Bianconeri · Alpine Old Lady',
    league: 'Serie A',
    modelType: '3D Kit Jersey',
    priceIdr: 155000,
    weightGrams: 68,
    materialSpec: 'Matte Onyx & Pure White Enamel · Gold 3-Star Crest',
    primaryColor: '#18181B',
    secondaryColor: '#F8FAFC',
    accentColor: '#EAB308',
    kitNumber: '10',
    engravingDefault: 'FINO ALLA FINE',
    rating: 4.8,
    reviewCount: 162,
    inStock: true,
    editionTag: 'In Stock',
    description:
      'High-contrast black and white striped 3D jersey with three raised golden stars above the chest badge and gold squad numerals.',
  },
  {
    id: 'bk-l1-02',
    name: 'Vélodrome South Coast 1993 Star Shield',
    clubInspiration: 'Marseille Olympique · Mediterranean Kings',
    league: 'Ligue 1',
    modelType: 'Club Shield',
    priceIdr: 145000,
    weightGrams: 69,
    materialSpec: 'Polished Silver Alloy · Sky Azure Enamel · Gold Star',
    primaryColor: '#0284C7',
    secondaryColor: '#F8FAFC',
    accentColor: '#EAB308',
    kitNumber: '93',
    engravingDefault: 'DROIT AU BUT',
    rating: 4.8,
    reviewCount: 119,
    inStock: true,
    editionTag: 'Heritage Drop',
    description:
      'Architectural monogram shield in sky azure and crisp white enamel crowned with the iconic 1993 golden European star.',
  },
  {
    id: 'bk-l1-03',
    name: 'Principality Diagonal Red-White Striker Boot',
    clubInspiration: 'Monaco Principality · Riviera Royalty',
    league: 'Ligue 1',
    modelType: 'Striker Boot',
    priceIdr: 152000,
    weightGrams: 64,
    materialSpec: '18K Gold Plated Sole · 55° Red-White Enamel Split',
    primaryColor: '#DC2626',
    secondaryColor: '#F8FAFC',
    accentColor: '#F59E0B',
    kitNumber: '29',
    engravingDefault: 'DAGHE MUNEGU',
    rating: 4.7,
    reviewCount: 84,
    inStock: true,
    editionTag: 'Boutique Series',
    description:
      'Sculpted speed boot featuring the unmistakable 55-degree diagonal red-and-white enamel division and gold-plated torsion plate.',
  },
];

export const INITIAL_REVIEWS: SupporterReview[] = [
  {
    id: 'rev-1',
    authorName: 'Rizky Pratama',
    role: 'Matchday Collector & Chapter Lead',
    organization: 'United Indonesia Jakarta',
    league: 'Premier League',
    rating: 5,
    comment:
      'Before finding BKeychains, every jersey keychain I bought peeled within two months on my Vespa key fob. I switched to the Manchester #7 316L Zinc-Alloy drop 6 months ago—after 180+ daily commutes in Jakarta rain, the crimson hard enamel and 18K gold collar still look box-fresh.',
    verifiedPurchase: 'Manchester Theatre #7 Home Kit Keychain',
    date: 'October 2026',
  },
  {
    id: 'rev-2',
    authorName: 'Carlos Mendoza',
    role: 'Kit Curator',
    organization: 'Peña Madridista Asia',
    league: 'LaLiga',
    rating: 5,
    comment:
      'We ordered 45 custom-engraved Bernabéu Royal XV medallions for our Champions League final screening. The 74-gram weight feels like an actual watch case, and every member got their squad number laser-etched on the back plate with zero flaws.',
    verifiedPurchase: 'Bernabéu Royal XV Crown Crest Medallion',
    date: 'September 2026',
  },
  {
    id: 'rev-3',
    authorName: 'Dimas Santoso',
    role: 'Creative Director',
    organization: 'Curva Nord Collector Club Surabaya',
    league: 'Serie A',
    rating: 5,
    comment:
      'Most football merch ignores Serie A detail, especially the Segunda Stella two-star geometry. BKeychains nailed the exact cobalt tone and anodized gunmetal edge. Paid via QRIS in 10 seconds and arrived in a magnetic presentation box.',
    verifiedPurchase: 'San Siro Nerazzurri Segunda Stella Shield',
    date: 'October 2026',
  },
  {
    id: 'rev-4',
    authorName: 'Lucas Moreau',
    role: 'Founder',
    organization: 'Paname Football Streetwear Studio',
    league: 'Ligue 1',
    rating: 5,
    comment:
      'The Parc des Princes Hechter #10 keychain has the exact minimalist luxury vibe of a Nike Lab or Jordan PSG drop. The spring gate carabiner snaps onto heavy denim belt loops with a super crisp mechanical click.',
    verifiedPurchase: 'Parc des Princes Midnight Hechter Kit #10',
    date: 'August 2026',
  },
];

export const COLLABORATIONS_AND_EVENTS: CollaborationEvent[] = [
  {
    id: 'ev-1',
    type: 'Collaboration',
    title: 'BKeychains × Pitchside Jersey Archive Capsule',
    partner: 'Pitchside Vintage Football Jakarta',
    date: 'November 14–16, 2026',
    location: 'Senayan Park (SPARK) Atrium, Jakarta',
    description:
      'Limited 300-piece numbered collaboration pairing 1990s retro Serie A & Premier League match shirts with matching dual-plated BKeychains medallions and live laser engraving on site.',
    EditionNote: 'Numbered 001/300 Brushed Brass Finish',
    spotsRemaining: 42,
  },
  {
    id: 'ev-2',
    type: 'Upcoming Event',
    title: 'El Clásico & European Derby Live Customizer Pop-Up',
    partner: 'BKeychains Flagship Mobile Forge',
    date: 'November 28, 2026 · 19:00 WIB',
    location: 'SCBD Lot 8 Pitch Lounge, South Jakarta',
    description:
      'Bring your matchday kit and design your custom laser-etched keychain live before kickoff. Includes complimentary anodized carabiner upgrade and big-screen match viewing pass.',
    EditionNote: 'Free Custom Back-Plate Engraving for RSVP Guests',
    spotsRemaining: 19,
  },
  {
    id: 'ev-3',
    type: 'Collaboration',
    title: 'BKeychains × Southeast Asia Supporters Summit 2026',
    partner: '4-League Official Fan Chapters',
    date: 'December 12, 2026 · 14:00 WIB',
    location: ' Kemang Industrial Loft & Livestream',
    description:
      'Official community tournament and collector swap meet featuring exclusive Ligue 1 and LaLiga golden boot keychains engineered specifically for tournament winners.',
    EditionNote: 'Exclusive Tournament Winner 24K Gold Edition',
    spotsRemaining: 64,
  },
];
