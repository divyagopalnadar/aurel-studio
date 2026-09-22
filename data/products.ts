export type Category =
  | "Audio"
  | "Wearables"
  | "Tech"
  | "Home & Living"
  | "Accessories";

export type StockStatus = "in_stock" | "low_stock" | "sold_out";

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  body: string;
}

export interface Product {
  id: number;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  category: Category;
  rating: number;
  reviewCount: number;
  stock: StockStatus;
  stockCount: number;
  featured: boolean;
  isNew: boolean;
  features: string[];
  colors: string[];
  images: string[];
  hue: number;
  glyph: Glyph;
  reviews: Review[];
}

export type Glyph =
  | "headphones"
  | "earbuds"
  | "speaker"
  | "watch"
  | "ring"
  | "camera"
  | "planter"
  | "diffuser"
  | "mouse"
  | "keyboard"
  | "bag"
  | "bottle"
  | "drone"
  | "lamp"
  | "hub"
  | "alarm"
  | "dock";

export const categories: Category[] = [
  "Audio",
  "Wearables",
  "Tech",
  "Home & Living",
  "Accessories",
];

export const glyphTheme: Record<
  Glyph,
  { label: string; base: number; glow: number }
> = {
  headphones: { label: "headphones", base: 230, glow: 250 },
  earbuds: { label: "earbuds", base: 210, glow: 235 },
  speaker: { label: "speaker", base: 190, glow: 220 },
  watch: { label: "watch", base: 245, glow: 260 },
  ring: { label: "ring", base: 265, glow: 280 },
  camera: { label: "camera", base: 205, glow: 230 },
  planter: { label: "planter", base: 150, glow: 170 },
  diffuser: { label: "diffuser", base: 330, glow: 20 },
  mouse: { label: "mouse", base: 225, glow: 250 },
  keyboard: { label: "keyboard", base: 175, glow: 200 },
  bag: { label: "bag", base: 30, glow: 50 },
  bottle: { label: "bottle", base: 200, glow: 225 },
  drone: { label: "drone", base: 220, glow: 240 },
  lamp: { label: "lamp", base: 40, glow: 60 },
  hub: { label: "hub", base: 260, glow: 280 },
  alarm: { label: "alarm", base: 100, glow: 120 },
  dock: { label: "dock", base: 285, glow: 300 },
};

export const products: Product[] = [
  {
    id: 1,
    slug: "aurelia-wireless-headphones",
    name: "Aurelia Wireless Headphones",
    tagline: "Studio-grade silence, featherweight",
    description:
      "The Aurelia pairs active noise cancellation with a driver tuned from hand-selected beryllium. Hours of reference-grade sound in a frame that disappears on your head, delivering clarity that cuts through every genre.",
    price: 349,
    compareAtPrice: 429,
    category: "Audio",
    rating: 4.8,
    reviewCount: 1284,
    stock: "in_stock",
    stockCount: 42,
    featured: true,
    isNew: true,
    features: [
      "Adaptive ANC with 40 dB reduction",
      "40mm beryllium drivers",
      "40-hour battery life",
      "Spatial audio with head tracking",
      "Multipoint Bluetooth 5.3",
    ],
    colors: ["#1a1b1e", "#eae6df", "#4f46e5"],
    images: ["/images/products/aurelia-wireless-headphones-1.svg",
      "/images/products/aurelia-wireless-headphones-2.svg",
      "/images/products/aurelia-wireless-headphones-3.svg"],
    hue: 230,
    glyph: "headphones",
    reviews: [
      { id: "r1", author: "Maya K.", rating: 5, date: "2026-08-12", title: "Feels like a private mixing studio", body: "The soundstage is unreal. ANC turns my commute into silence." },
      { id: "r2", author: "Jon P.", rating: 5, date: "2026-07-30", title: "Worth every cent", body: "Comfortable for 8-hour sessions and the battery outlasts my week." },
    ],
  },
  {
    id: 2,
    slug: "echolink-earbuds-pro",
    name: "EchoLink Earbuds Pro",
    tagline: "Pocket studio, all-day comfort",
    description:
      "EchoLink Pro delivers big sound from a sculpted 11mm driver and a hybrid fit that stays put through workouts, calls, and everything between. IPX5 rated and ready for the messier parts of life.",
    price: 199,
    compareAtPrice: 249,
    category: "Audio",
    rating: 4.7,
    reviewCount: 967,
    stock: "in_stock",
    stockCount: 88,
    featured: true,
    isNew: false,
    features: [
      "11mm dynamic drivers",
      "Hybrid active noise cancelling",
      "36-hour total battery",
      "Wireless charging case",
      "Instant pairing",
    ],
    colors: ["#0f1115", "#8b93a7", "#4f46e5"],
    images: ["/images/products/echolink-earbuds-pro-1.svg",
      "/images/products/echolink-earbuds-pro-2.svg",
      "/images/products/echolink-earbuds-pro-3.svg"],
    hue: 210,
    glyph: "earbuds",
    reviews: [
      { id: "r3", author: "Aria T.", rating: 5, date: "2026-08-02", title: "Invisible, reliable", body: "Barely feel them. Calls sound crisp on both ends." },
    ],
  },
  {
    id: 3,
    slug: "pulsebeat-speaker",
    name: "PulseBeat Speaker",
    tagline: "Room-filling sound, desk-sized body",
    description:
      "PulseBeat packs a 360-degree driver and passive radiators into a palm-sized cylinder. Deep bass, sparkling highs, and a 20-hour battery to keep the room alive anywhere you go.",
    price: 129,
    category: "Audio",
    rating: 4.6,
    reviewCount: 542,
    stock: "in_stock",
    stockCount: 61,
    featured: false,
    isNew: true,
    features: [
      "360° omnidirectional sound",
      "Passive bass radiators",
      "20-hour playtime",
      "Splashproof IPX6",
      "Stereo-pair two units",
    ],
    colors: ["#101218", "#dfe3ea", "#7c6cf0"],
    images: ["/images/products/pulsebeat-speaker-1.svg",
      "/images/products/pulsebeat-speaker-2.svg",
      "/images/products/pulsebeat-speaker-3.svg"],
    hue: 190,
    glyph: "speaker",
    reviews: [
      { id: "r4", author: "Leo M.", rating: 5, date: "2026-07-20", title: "Ridiculous for the size", body: "Bass from something this small still shocks me." },
    ],
  },
  {
    id: 4,
    slug: "lumina-smartwatch",
    name: "Lumina Smartwatch",
    tagline: "Your health, on your wrist",
    description:
      "Lumina combines a vivid always-on display with surgical-grade health sensing. Heart, sleep, recovery, and stress — tracked automatically and interpreted in plain language.",
    price: 299,
    compareAtPrice: 349,
    category: "Wearables",
    rating: 4.8,
    reviewCount: 1731,
    stock: "in_stock",
    stockCount: 35,
    featured: true,
    isNew: false,
    features: [
      "Always-on AMOLED display",
      "ECG and blood-oxygen sensing",
      "8-day battery life",
      "GPS built in",
      "300+ workouts tracked",
    ],
    colors: ["#0e1014", "#e8e6e2", "#4f46e5"],
    images: ["/images/products/lumina-smartwatch-1.svg",
      "/images/products/lumina-smartwatch-2.svg",
      "/images/products/lumina-smartwatch-3.svg"],
    hue: 245,
    glyph: "watch",
    reviews: [
      { id: "r5", author: "Priya D.", rating: 5, date: "2026-08-18", title: "A proper health companion", body: "Charging once a week feels like cheating after my old watch." },
    ],
  },
  {
    id: 5,
    slug: "halo-fitness-ring",
    name: "Halo Fitness Ring",
    tagline: "Gym-grade tracking, invisible",
    description:
      "Halo turns your index finger into a wellness lab. Sleep, heart rate, recovery readiness, and activity — tracked continuously without a single band or screen.",
    price: 279,
    category: "Wearables",
    rating: 4.5,
    reviewCount: 388,
    stock: "low_stock",
    stockCount: 9,
    featured: false,
    isNew: true,
    features: [
      "Medical-grade titanium",
      "7-day continuous tracking",
      "Readiness & recovery scores",
      "Sleep stage analysis",
      "Subtle haptic alerts",
    ],
    colors: ["#0f1116", "#e6e4e0", "#8b95c9"],
    images: ["/images/products/halo-fitness-ring-1.svg",
      "/images/products/halo-fitness-ring-2.svg",
      "/images/products/halo-fitness-ring-3.svg"],
    hue: 265,
    glyph: "ring",
    reviews: [
      { id: "r6", author: "Sam W.", rating: 4, date: "2026-07-27", title: "Lightweight and detailed", body: "Sleep tracking is shockingly accurate. Nearly forget I wear it." },
    ],
  },
  {
    id: 6,
    slug: "neoeeyes-camera",
    name: "NeoEyes Camera",
    tagline: "Full-frame vision in your hands",
    description:
      "NeoEyes pairs a back-illuminated full-frame sensor with a fast f/1.8 prime. 4K60 video, eight-stop IBIS, and a tilting touchscreen make it the camera you'll reach for and never put down.",
    price: 899,
    compareAtPrice: 1049,
    category: "Tech",
    rating: 4.9,
    reviewCount: 476,
    stock: "in_stock",
    stockCount: 18,
    featured: true,
    isNew: true,
    features: [
      "24MP back-illuminated sensor",
      "f/1.8 prime lens",
      "8-stop in-body stabilization",
      "4K60 / 10-bit internal recording",
      "Weather-sealed body",
    ],
    colors: ["#0c0d10", "#15161a", "#4f46e5"],
    images: ["/images/products/neoeeyes-camera-1.svg",
      "/images/products/neoeeyes-camera-2.svg",
      "/images/products/neoeeyes-camera-3.svg"],
    hue: 205,
    glyph: "camera",
    reviews: [
      { id: "r7", author: "Nadia F.", rating: 5, date: "2026-08-11", title: "Dream everyday camera", body: "Color science is gorgeous and the IBIS is absurd." },
    ],
  },
  {
    id: 7,
    slug: "terraplant-planter",
    name: "TerraPlant Smart Planter",
    tagline: "Self-care for your plants",
    description:
      "TerraPlant waters, lights, and watches over your greenery automatically. A built-in sensor adjusts the schedule so your plants thrive — even when you're weeks deep in a project.",
    price: 89,
    category: "Home & Living",
    rating: 4.4,
    reviewCount: 212,
    stock: "in_stock",
    stockCount: 54,
    featured: false,
    isNew: false,
    features: [
      "Self-watering reservoir",
      "Auto full-spectrum grow light",
      "Moisture & light sensing",
      "Works with any pot up to 10\"",
      "Quiet, USB-C powered",
    ],
    colors: ["#0e1111", "#d8e8d4", "#7ac74f"],
    images: ["/images/products/terraplant-planter-1.svg",
      "/images/products/terraplant-planter-2.svg",
      "/images/products/terraplant-planter-3.svg"],
    hue: 150,
    glyph: "planter",
    reviews: [
      { id: "r8", author: "Estelle R.", rating: 5, date: "2026-07-18", title: "My fern finally survived", body: "It figured out the watering rhythm I never could." },
    ],
  },
  {
    id: 8,
    slug: "driftwood-diffuser",
    name: "Driftwood Diffuser",
    tagline: "Calm that fills the room",
    description:
      "Driftwood turns essential oils into a fine, quiet mist with an ultrasonic pulse that hums at a whisper. Warm ambient light and a ceramic body make it part of the decor when it's off.",
    price: 79,
    category: "Home & Living",
    rating: 4.6,
    reviewCount: 154,
    stock: "in_stock",
    stockCount: 73,
    featured: false,
    isNew: false,
    features: [
      "Ultrasonic whisper-quiet mist",
      "12-hour run time",
      "Adjustable ambient glow",
      "Ceramic, hand-finished body",
      "Auto shut-off",
    ],
    colors: ["#120e14", "#efe2df", "#ec9db8"],
    images: ["/images/products/driftwood-diffuser-1.svg",
      "/images/products/driftwood-diffuser-2.svg",
      "/images/products/driftwood-diffuser-3.svg"],
    hue: 330,
    glyph: "diffuser",
    reviews: [
      { id: "r9", author: "Caleb H.", rating: 5, date: "2026-07-06", title: "Beautiful and silent", body: "You can't hear it, you just feel calmer." },
    ],
  },
  {
    id: 9,
    slug: "mercury-wireless-mouse",
    name: "Mercury Wireless Mouse",
    tagline: "Zero click lag, zero weight to it",
    description:
      "Mercury's 1kHz polling and a lightweight honeycomb shell give you an edge in every frame. A precise optical sensor tracks any surface, wired or wireless, for up to 95 hours.",
    price: 99,
    category: "Accessories",
    rating: 4.3,
    reviewCount: 318,
    stock: "in_stock",
    stockCount: 120,
    featured: false,
    isNew: true,
    features: [
      "58g lightweight shell",
      "26K DPI optical sensor",
      "1kHz wired & wireless",
      "95-hour battery",
      "Silent teflon feet",
    ],
    colors: ["#101218", "#e9e6e1", "#5b6470"],
    images: ["/images/products/mercury-wireless-mouse-1.svg",
      "/images/products/mercury-wireless-mouse-2.svg",
      "/images/products/mercury-wireless-mouse-3.svg"],
    hue: 225,
    glyph: "mouse",
    reviews: [
      { id: "r10", author: "Dex V.", rating: 4, date: "2026-07-14", title: "Fast and featherlight", body: "Almost forgot it was in my bag it's so light." },
    ],
  },
  {
    id: 10,
    slug: "keywave-mechanical-keyboard",
    name: "Keywave Mechanical Keyboard",
    tagline: "75% of your desk, 100% of the feel",
    description:
      "Keywave brings a gasket-mounted hydro-lubed build to a compact 75% layout. Hot-swappable switches, per-key RGB, and a pre-lubed experience that sounds as good as it types.",
    price: 159,
    compareAtPrice: 189,
    category: "Accessories",
    rating: 4.7,
    reviewCount: 842,
    stock: "in_stock",
    stockCount: 66,
    featured: true,
    isNew: false,
    features: [
      "Gasket-mounted silicone build",
      "Hot-swappable switches",
      "Per-key south-facing RGB",
      "Pre-lubed linear switches",
      "Tri-mode: wired / BT / 2.4G",
    ],
    colors: ["#0d0e12", "#f0ede7", "#e0a83a"],
    images: ["/images/products/keywave-mechanical-keyboard-1.svg",
      "/images/products/keywave-mechanical-keyboard-2.svg",
      "/images/products/keywave-mechanical-keyboard-3.svg"],
    hue: 175,
    glyph: "keyboard",
    reviews: [
      { id: "r11", author: "Riko S.", rating: 5, date: "2026-08-05", title: "Sounds like a dream", body: "The pre-lubed switches are impossibly smooth." },
    ],
  },
  {
    id: 11,
    slug: "aerolite-carry-bag",
    name: "AeroLite Carry Bag",
    tagline: "A daypack that matches your gear",
    description:
      "AeroLite is a weatherproof daypack with a dedicated padded 16\" laptop sleeve and smart internal organization — built from recycled ripstop that weighs almost nothing.",
    price: 189,
    category: "Accessories",
    rating: 4.6,
    reviewCount: 266,
    stock: "in_stock",
    stockCount: 47,
    featured: false,
    isNew: true,
    features: [
      "Recycled weatherproof ripstop",
      "Padded 16\" laptop sleeve",
      "Hidden anti-theft pocket",
      "Back airflow channel",
      "18L carry volume",
    ],
    colors: ["#101015", "#e7e4de", "#3a3f46"],
    images: ["/images/products/aerolite-carry-bag-1.svg",
      "/images/products/aerolite-carry-bag-2.svg",
      "/images/products/aerolite-carry-bag-3.svg"],
    hue: 30,
    glyph: "bag",
    reviews: [
      { id: "r12", author: "Olive B.", rating: 5, date: "2026-07-22", title: "Minimal and tough", body: "Holds a full work kit and still disappears on my back." },
    ],
  },
  {
    id: 12,
    slug: "hydra-smart-bottle",
    name: "Hydra Smart Bottle",
    tagline: "Hydration, on a schedule",
    description:
      "Hydra glows softly to nudge you toward your water goal and tracks intake in the app. Double-wall vacuum keeps drinks cold for 24 hours and hot for 12.",
    price: 59,
    category: "Home & Living",
    rating: 4.5,
    reviewCount: 201,
    stock: "in_stock",
    stockCount: 135,
    featured: false,
    isNew: false,
    features: [
      "LED hydration reminder",
      "Vacuum insulation, 24h cold",
      "App intake tracking",
      "Leak-proof, dishwasher safe",
      "713ml capacity",
    ],
    colors: ["#0e1114", "#1f232b", "#4f8ac9"],
    images: ["/images/products/hydra-smart-bottle-1.svg",
      "/images/products/hydra-smart-bottle-2.svg",
      "/images/products/hydra-smart-bottle-3.svg"],
    hue: 200,
    glyph: "bottle",
    reviews: [
      { id: "r13", author: "Mika L.", rating: 5, date: "2026-06-29", title: "Actually drinks water now", body: "The glow reminder is surprisingly effective." },
    ],
  },
  {
    id: 13,
    slug: "soundwave-studio-headphones",
    name: "Soundwave Studio Headphones",
    tagline: "Reference audio for the perfectionist",
    description:
      "Soundwave's open-back drivers deliver a flat, honest signature that mastering engineers trust. Airy, spacious, and unapologetically detailed.",
    price: 449,
    compareAtPrice: 519,
    category: "Audio",
    rating: 4.9,
    reviewCount: 312,
    stock: "in_stock",
    stockCount: 21,
    featured: false,
    isNew: true,
    features: [
      "Open-back reference drivers",
      "Flat, honest frequency curve",
      "Detachable 3m cable",
      "Reinforced aluminum frame",
      "Hand-stitched earcups",
    ],
    colors: ["#0d0e10", "#cdd2da", "#5b6470"],
    images: ["/images/products/soundwave-studio-headphones-1.svg",
      "/images/products/soundwave-studio-headphones-2.svg",
      "/images/products/soundwave-studio-headphones-3.svg"],
    hue: 205,
    glyph: "headphones",
    reviews: [
      { id: "r14", author: "Theo N.", rating: 5, date: "2026-08-09", title: "Mix decisions made easy", body: "Everything I second-guess on cheaper cans is obvious here." },
    ],
  },
  {
    id: 14,
    slug: "orbit-4k-drone",
    name: "Orbit 4K Drone",
    tagline: "Cinematic flight, one tap",
    description:
      "Orbit is a palm-sized drone with gimbal-stabilized 4K60 video and intelligent tracking. Fold it flat, toss it in the air, and watch smooth cinematic shots take themselves.",
    price: 999,
    compareAtPrice: 1199,
    category: "Tech",
    rating: 4.8,
    reviewCount: 157,
    stock: "in_stock",
    stockCount: 11,
    featured: true,
    isNew: true,
    features: [
      "Gimbal-stabilized 4K60",
      "3-axis obstacle avoidance",
      "28-minute flight time",
      "Object tracking modes",
      "Folds to palm size",
    ],
    colors: ["#0c0d10", "#e6e8ed", "#4f46e5"],
    images: ["/images/products/orbit-4k-drone-1.svg",
      "/images/products/orbit-4k-drone-2.svg",
      "/images/products/orbit-4k-drone-3.svg"],
    hue: 220,
    glyph: "drone",
    reviews: [
      { id: "r15", author: "Ivan G.", rating: 5, date: "2026-08-14", title: "Feels like it flies itself", body: "Tracking is shockingly smooth. Footage looks edited." },
    ],
  },
  {
    id: 15,
    slug: "glowthal-table-lamp",
    name: "GlowThal Table Lamp",
    tagline: "Light that follows your mood",
    description:
      "GlowThal blends a marble-textured base with a seamless diffuser that shifts warm to cool white. Pendant-light clarity with bedside softness, app and touch controlled.",
    price: 119,
    category: "Home & Living",
    rating: 4.5,
    reviewCount: 173,
    stock: "in_stock",
    stockCount: 58,
    featured: false,
    isNew: true,
    features: [
      "2700K–6500K tuneable white",
      "Seamless ripple diffuser",
      "Touch & app control",
      "Memory of last setting",
      "USB-C rechargeable",
    ],
    colors: ["#0e0d10", "#ece8e0", "#e0b25a"],
    images: ["/images/products/glowthal-table-lamp-1.svg",
      "/images/products/glowthal-table-lamp-2.svg",
      "/images/products/glowthal-table-lamp-3.svg"],
    hue: 40,
    glyph: "lamp",
    reviews: [
      { id: "r16", author: "Hana J.", rating: 4, date: "2026-07-11", title: "Mood lighting done right", body: "The warm range is perfect for winding down." },
    ],
  },
  {
    id: 16,
    slug: "solace-earbuds-lite",
    name: "Solace Earbuds Lite",
    tagline: "Daily audio, minus the cost",
    description:
      "Solace distills the essentials — clear sound, reliable fit, and all-day battery — into an honest everyday pair that just works.",
    price: 99,
    category: "Audio",
    rating: 4.4,
    reviewCount: 223,
    stock: "in_stock",
    stockCount: 190,
    featured: false,
    isNew: false,
    features: [
      "10mm dynamic drivers",
      "Transparency mode",
      "30-hour total battery",
      "Comfort-fit ear tips",
      "Quick-charge support",
    ],
    colors: ["#0f1115", "#eceae5", "#8b93a7"],
    images: ["/images/products/solace-earbuds-lite-1.svg",
      "/images/products/solace-earbuds-lite-2.svg",
      "/images/products/solace-earbuds-lite-3.svg"],
    hue: 205,
    glyph: "earbuds",
    reviews: [
      { id: "r17", author: "Rae J.", rating: 5, date: "2026-06-30", title: "No-nonsense earbuds", body: "Great value. Sound is warm and balanced." },
    ],
  },
  {
    id: 17,
    slug: "swift-usb-c-hub",
    name: "Swift USB-C Hub",
    tagline: "One cable, every port",
    description:
      "Swift turns your USB-C machine into a full workstation — 8K HDMI, 100W passthrough, and fast card read slots in a milled aluminum body that clips to your desk.",
    price: 139,
    category: "Tech",
    rating: 4.6,
    reviewCount: 289,
    stock: "in_stock",
    stockCount: 84,
    featured: false,
    isNew: false,
    features: [
      "8K / 60Hz HDMI output",
      "100W power delivery",
      "2x USB-C, 2x USB-A",
      "SD + microSD readers",
      "Desk-clip aluminum body",
    ],
    colors: ["#0c0d10", "#e3e6ec", "#7c6cf0"],
    images: ["/images/products/swift-usb-c-hub-1.svg",
      "/images/products/swift-usb-c-hub-2.svg",
      "/images/products/swift-usb-c-hub-3.svg"],
    hue: 260,
    glyph: "hub",
    reviews: [
      { id: "r18", author: "Gwen K.", rating: 5, date: "2026-07-08", title: "Clean desk, no cable mess", body: "Milled really well. Everything works first try." },
    ],
  },
  {
    id: 18,
    slug: "ember-smart-clock",
    name: "Ember Smart Alarm Clock",
    tagline: "Wake to light, not sound",
    description:
      "Ember simulates a sunrise with a gentle warm glow and wakes you with your pick of nature sounds. A quiet, screenless clock that helps you fall asleep and rise naturally.",
    price: 149,
    compareAtPrice: 179,
    category: "Home & Living",
    rating: 4.5,
    reviewCount: 146,
    stock: "low_stock",
    stockCount: 7,
    featured: false,
    isNew: false,
    features: [
      "Natural sunrise simulation",
      "Sleep-wind-down routine",
      "Nature-sound wake alarms",
      "Screenless ambient face",
      "Auto light metering",
    ],
    colors: ["#0f0e10", "#e8e4de", "#2c2f36"],
    images: ["/images/products/ember-smart-clock-1.svg",
      "/images/products/ember-smart-clock-2.svg",
      "/images/products/ember-smart-clock-3.svg"],
    hue: 100,
    glyph: "alarm",
    reviews: [
      { id: "r19", author: "Owen C.", rating: 5, date: "2026-07-01", title: "Fantastic way to wake up", body: "The sunrise cue has fixed my whole morning." },
    ],
  },
  {
    id: 19,
    slug: "nova-charging-dock",
    name: "Nova Charging Dock",
    tagline: "Charge every device in one place",
    description:
      "Nova is a 3-in-1 dock that charges your phone, earbuds, and watch simultaneously on a weighted, non-slip base — with a single clean cable from your desk to the wall.",
    price: 69,
    category: "Tech",
    rating: 4.3,
    reviewCount: 134,
    stock: "in_stock",
    stockCount: 99,
    featured: false,
    isNew: true,
    features: [
      "3-in-1 simultaneous charging",
      "15W fast wireless",
      "Weighted non-slip base",
      "Over-temp protection",
      "One-cable setup",
    ],
    colors: ["#0d0e11", "#e5e8ee", "#6366f1"],
    images: ["/images/products/nova-charging-dock-1.svg",
      "/images/products/nova-charging-dock-2.svg",
      "/images/products/nova-charging-dock-3.svg"],
    hue: 285,
    glyph: "dock",
    reviews: [
      { id: "r20", author: "Pat L.", rating: 4, date: "2026-06-24", title: "Decluttered my nightstand", body: "Everything charges at once. Love the weighted base." },
    ],
  },
  {
    id: 20,
    slug: "frost-insulated-bottle",
    name: "Frost Insulated Bottle",
    tagline: "Ice-cold, all day",
    description:
      "Frost keeps drinks ice-cold for up to 28 hours with triple-wall vacuum insulation and a martial-grade shell that shrugs off drops.",
    price: 49,
    category: "Home & Living",
    rating: 4.7,
    reviewCount: 405,
    stock: "in_stock",
    stockCount: 210,
    featured: false,
    isNew: false,
    features: [
      "28-hour cold retention",
      "12-hour hot retention",
      "Triple-wall vacuum",
      "Dust-tight flip lid",
      "Powder-coated grip",
    ],
    colors: ["#0e1114", "#dfe6f0", "#7aa8e0"],
    images: ["/images/products/frost-insulated-bottle-1.svg",
      "/images/products/frost-insulated-bottle-2.svg",
      "/images/products/frost-insulated-bottle-3.svg"],
    hue: 210,
    glyph: "bottle",
    reviews: [
      { id: "r21", author: "June S.", rating: 5, date: "2026-07-03", title: "Still ice-cold at midnight", body: "It genuinely beat every bottle I've tried." },
    ],
  },
];

export function getProductById(id: number): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductsByCategory(
  category: Category | "All",
  excludeId?: number
): Product[] {
  const filtered =
    category === "All"
      ? products
      : products.filter((p) => p.category === category);
  return excludeId ? filtered.filter((p) => p.id !== excludeId) : filtered;
}

export function getRelatedProducts(product: Product): Product[] {
  const sameCategory = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);
  if (sameCategory.length >= 4) return sameCategory;
  const others = products.filter(
    (p) => p.category !== product.category && p.id !== product.id
  );
  return [...sameCategory, ...others].slice(0, 4);
}
