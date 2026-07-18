import type { Product } from "@/types";
import { mockCategories } from "./mock-categories";

type RawProduct = Omit<Product, "category">;

/**
 * Catalogue seed data. Prices are decimal strings and stock values are
 * deliberate: several low-stock items and one out-of-stock item exist so
 * stock messaging and disabled states can be demonstrated honestly.
 */
const rawProducts: RawProduct[] = [
  // ---- Audio ----
  {
    id: 1,
    category_id: 1,
    name: "Aurora Wireless Headphones",
    slug: "aurora-wireless-headphones",
    short_description: "Over-ear wireless headphones with soft-touch cushions.",
    description:
      "The Aurora wireless headphones are built for long, comfortable listening sessions. Memory-foam cushions and a lightweight adjustable headband keep them steady through a full workday, while 40 mm drivers deliver a balanced, detailed sound. A single charge lasts up to 32 hours, and a quick USB-C top-up adds several more.",
    price: "129.99",
    stock: 18,
    image_url: "/images/products/aurora-wireless-headphones.svg",
    is_featured: true,
    created_at: "2026-06-01T09:00:00Z",
    updated_at: "2026-07-01T09:00:00Z",
  },
  {
    id: 2,
    category_id: 1,
    name: "Pebble Bluetooth Speaker",
    slug: "pebble-bluetooth-speaker",
    short_description: "Palm-sized speaker with a surprisingly full sound.",
    description:
      "Pebble is a compact Bluetooth speaker designed for desks, kitchens, and weekend bags. Its rounded fabric-wrapped body houses a full-range driver and passive radiator that together produce a warm, room-filling sound. Twelve hours of playback and a splash-resistant shell make it an easy everyday companion.",
    price: "59.99",
    stock: 24,
    image_url: "/images/products/pebble-bluetooth-speaker.svg",
    is_featured: true,
    created_at: "2026-06-02T09:00:00Z",
    updated_at: "2026-07-01T09:00:00Z",
  },
  {
    id: 3,
    category_id: 1,
    name: "Halo Compact Earbuds",
    slug: "halo-compact-earbuds",
    short_description: "True wireless earbuds with a pocketable charging case.",
    description:
      "Halo earbuds pair quickly, sit securely, and stay out of the way. Touch controls handle playback and calls, and the slim charging case tops the buds up three times over before it needs power itself. Three sizes of silicone tips are included for a reliable fit.",
    price: "79.99",
    stock: 4,
    image_url: "/images/products/halo-compact-earbuds.svg",
    is_featured: true,
    created_at: "2026-06-03T09:00:00Z",
    updated_at: "2026-07-02T09:00:00Z",
  },
  {
    id: 4,
    category_id: 1,
    name: "Drift Wired Earphones",
    slug: "drift-wired-earphones",
    short_description: "Noise-isolating wired earphones with an in-line mic.",
    description:
      "Drift keeps things simple: a tangle-resistant cable, angled noise-isolating tips, and an in-line microphone with a single control button. No batteries, no pairing — just plug into any USB-C device and listen.",
    price: "34.99",
    stock: 30,
    image_url: "/images/products/drift-wired-earphones.svg",
    is_featured: false,
    created_at: "2026-06-04T09:00:00Z",
    updated_at: "2026-07-02T09:00:00Z",
  },

  // ---- Workspace ----
  {
    id: 5,
    category_id: 2,
    name: "Keystone Mechanical Keyboard",
    slug: "keystone-mechanical-keyboard",
    short_description: "Compact 75% mechanical keyboard with quiet tactile switches.",
    description:
      "Keystone is a 75% layout mechanical keyboard that keeps the keys you actually use and gives your mouse the desk space back. Quiet tactile switches provide satisfying feedback without disturbing a shared office, and the aluminium top plate keeps the board rigid and stable. Connects over USB-C or Bluetooth to three devices.",
    price: "94.99",
    stock: 12,
    image_url: "/images/products/keystone-mechanical-keyboard.svg",
    is_featured: true,
    created_at: "2026-06-05T09:00:00Z",
    updated_at: "2026-07-03T09:00:00Z",
  },
  {
    id: 6,
    category_id: 2,
    name: "Glide Wireless Mouse",
    slug: "glide-wireless-mouse",
    short_description: "Silent-click wireless mouse with an ergonomic shape.",
    description:
      "Glide fits naturally under the palm and tracks accurately on most surfaces, including glass desks with a mat. Its silent switches keep clicks discreet, and a single AA battery lasts up to twelve months. Pairs over Bluetooth or the included USB receiver.",
    price: "39.99",
    stock: 26,
    image_url: "/images/products/glide-wireless-mouse.svg",
    is_featured: false,
    created_at: "2026-06-06T09:00:00Z",
    updated_at: "2026-07-03T09:00:00Z",
  },
  {
    id: 7,
    category_id: 2,
    name: "Lumen LED Desk Lamp",
    slug: "lumen-led-desk-lamp",
    short_description: "Adjustable LED lamp with five colour temperatures.",
    description:
      "Lumen throws an even, flicker-free light across your desk without hot spots or glare. Five colour temperatures and stepless dimming adapt it from bright task lighting to a warm evening glow, and the folding arm tucks flat when not in use. A USB-A port in the base charges your phone while you work.",
    price: "49.99",
    stock: 3,
    image_url: "/images/products/lumen-led-desk-lamp.svg",
    is_featured: true,
    created_at: "2026-06-07T09:00:00Z",
    updated_at: "2026-07-04T09:00:00Z",
  },
  {
    id: 8,
    category_id: 2,
    name: "Summit Laptop Stand",
    slug: "summit-laptop-stand",
    short_description: "Aluminium stand that raises your screen to eye level.",
    description:
      "Summit lifts your laptop up to 15 cm, bringing the screen to a comfortable eye level and freeing airflow underneath. The single-piece aluminium frame holds machines up to 16 inches rock steady, with silicone pads protecting the chassis. It pairs naturally with an external keyboard for a healthier desk posture.",
    price: "44.99",
    stock: 15,
    image_url: "/images/products/summit-laptop-stand.svg",
    is_featured: false,
    created_at: "2026-06-08T09:00:00Z",
    updated_at: "2026-07-04T09:00:00Z",
  },
  {
    id: 9,
    category_id: 2,
    name: "Anchor Cable Organiser",
    slug: "anchor-cable-organiser",
    short_description: "Weighted desk dock that keeps charging cables in place.",
    description:
      "Anchor is a small weighted dock with three soft silicone slots that hold charging cables exactly where you left them. No more cables sliding off the back of the desk the moment you unplug. The non-slip base stays put, and the slots fit everything from thin earphone leads to braided laptop cables.",
    price: "19.99",
    stock: 40,
    image_url: "/images/products/anchor-cable-organiser.svg",
    is_featured: false,
    created_at: "2026-06-09T09:00:00Z",
    updated_at: "2026-07-05T09:00:00Z",
  },

  // ---- Smart Home ----
  {
    id: 10,
    category_id: 3,
    name: "Ember Smart Plug",
    slug: "ember-smart-plug",
    short_description: "Wi-Fi smart plug with scheduling and energy insights.",
    description:
      "Ember turns any lamp, fan, or heater into a connected device. Set on/off schedules, control it from your phone when away, and see how much energy the connected appliance actually uses. Setup takes under two minutes on a standard 2.4 GHz Wi-Fi network — no hub required.",
    price: "24.99",
    stock: 35,
    image_url: "/images/products/ember-smart-plug.svg",
    is_featured: false,
    created_at: "2026-06-10T09:00:00Z",
    updated_at: "2026-07-05T09:00:00Z",
  },
  {
    id: 11,
    category_id: 3,
    name: "Glow Smart Light Bulb",
    slug: "glow-smart-light-bulb",
    short_description: "Dimmable colour smart bulb with app and voice control.",
    description:
      "Glow replaces a standard E27 bulb and adds full colour, tunable whites, and smooth dimming, all controllable from the companion app or your voice assistant. Gentle wake-up and wind-down routines make mornings and evenings easier. Rated for 25,000 hours of use.",
    price: "21.99",
    stock: 0,
    image_url: "/images/products/glow-smart-light-bulb.svg",
    is_featured: false,
    created_at: "2026-06-11T09:00:00Z",
    updated_at: "2026-07-06T09:00:00Z",
  },
  {
    id: 12,
    category_id: 3,
    name: "Sentinel Indoor Camera",
    slug: "sentinel-indoor-camera",
    short_description: "1080p indoor camera with motion alerts and privacy shutter.",
    description:
      "Sentinel keeps a discreet eye on your home with sharp 1080p video, night vision, and instant motion notifications. A physical privacy shutter closes the lens completely whenever you want it off. Recordings can stay local on a microSD card — no subscription needed.",
    price: "89.99",
    stock: 9,
    image_url: "/images/products/sentinel-indoor-camera.svg",
    is_featured: true,
    created_at: "2026-06-12T09:00:00Z",
    updated_at: "2026-07-06T09:00:00Z",
  },
  {
    id: 13,
    category_id: 3,
    name: "Pulse Motion Sensor",
    slug: "pulse-motion-sensor",
    short_description: "Battery-powered motion sensor for lights and routines.",
    description:
      "Pulse detects movement up to seven metres away and triggers your connected lights or routines in under a second. Mount it with the included adhesive plate or let the magnetic base swivel it toward a doorway. A single coin cell keeps it running for around two years.",
    price: "29.99",
    stock: 22,
    image_url: null,
    is_featured: false,
    created_at: "2026-06-13T09:00:00Z",
    updated_at: "2026-07-07T09:00:00Z",
  },

  // ---- Mobile Accessories ----
  {
    id: 14,
    category_id: 4,
    name: "Perch Phone Stand",
    slug: "perch-phone-stand",
    short_description: "Foldable aluminium stand with adjustable viewing angles.",
    description:
      "Perch holds your phone at exactly the angle you want — for video calls, recipes, or a second screen beside your laptop. The hinge adjusts smoothly through 270 degrees and folds flat to slip into a pocket. Rubber pads keep both the phone and your desk scratch-free.",
    price: "18.99",
    stock: 28,
    image_url: "/images/products/perch-phone-stand.svg",
    is_featured: false,
    created_at: "2026-06-14T09:00:00Z",
    updated_at: "2026-07-07T09:00:00Z",
  },
  {
    id: 15,
    category_id: 4,
    name: "Loop Wireless Charger",
    slug: "loop-wireless-charger",
    short_description: "15 W fast wireless charging stand with case-friendly coils.",
    description:
      "Loop charges your phone upright, so notifications stay visible while it powers up at 15 W. Dual coils support both portrait and landscape, and it charges through most cases up to 5 mm thick. A soft LED shows charging status and dims automatically at night.",
    price: "42.99",
    stock: 16,
    image_url: "/images/products/loop-wireless-charger.svg",
    is_featured: true,
    created_at: "2026-06-15T09:00:00Z",
    updated_at: "2026-07-08T09:00:00Z",
  },
  {
    id: 16,
    category_id: 4,
    name: "Strand USB-C Cable (2 m)",
    slug: "strand-usb-c-cable",
    short_description: "Braided 100 W USB-C cable built for daily use.",
    description:
      "Strand is a two-metre braided USB-C cable rated for 100 W charging and 480 Mbps data. Reinforced strain relief at both ends survives the daily bag-stuffing routine, and the included silicone strap keeps it neatly coiled. Works with laptops, tablets, and phones alike.",
    price: "14.99",
    stock: 50,
    image_url: "/images/products/strand-usb-c-cable.svg",
    is_featured: false,
    created_at: "2026-06-16T09:00:00Z",
    updated_at: "2026-07-08T09:00:00Z",
  },
  {
    id: 17,
    category_id: 4,
    name: "Volt Power Bank 10K",
    slug: "volt-power-bank-10k",
    short_description: "Slim 10,000 mAh power bank with 20 W fast charging.",
    description:
      "Volt packs 10,000 mAh into a slim shell that disappears into a jacket pocket. The 20 W USB-C port fast-charges a phone to roughly half in half an hour, and a second USB-A port tops up earbuds or a watch at the same time. Four LEDs show the remaining charge at a glance.",
    price: "54.99",
    stock: 5,
    image_url: "/images/products/volt-power-bank-10k.svg",
    is_featured: false,
    created_at: "2026-06-17T09:00:00Z",
    updated_at: "2026-07-09T09:00:00Z",
  },

  // ---- Travel Tech ----
  {
    id: 18,
    category_id: 5,
    name: "Portal USB-C Hub",
    slug: "portal-usb-c-hub",
    short_description: "7-in-1 hub with HDMI, card readers, and pass-through power.",
    description:
      "Portal expands a single USB-C port into HDMI 4K output, two USB-A ports, USB-C data, SD and microSD card readers, and 100 W pass-through charging. The aluminium shell stays cool under load and matches most laptops. A built-in cable tucks away for travel.",
    price: "64.99",
    stock: 14,
    image_url: "/images/products/portal-usb-c-hub.svg",
    is_featured: true,
    created_at: "2026-06-18T09:00:00Z",
    updated_at: "2026-07-09T09:00:00Z",
  },
  {
    id: 19,
    category_id: 5,
    name: "Roam Travel Adapter",
    slug: "roam-travel-adapter",
    short_description: "Universal adapter covering outlets in 150+ countries.",
    description:
      "Roam combines UK, EU, US, and AU plugs into one compact unit that covers more than 150 countries. Two USB-C and two USB-A ports charge four devices alongside the mains socket, and a replaceable fuse plus safety shutters protect your gear. It weighs just 140 g.",
    price: "36.99",
    stock: 20,
    image_url: "/images/products/roam-travel-adapter.svg",
    is_featured: false,
    created_at: "2026-06-19T09:00:00Z",
    updated_at: "2026-07-10T09:00:00Z",
  },
  {
    id: 20,
    category_id: 5,
    name: "Caddy Tech Pouch",
    slug: "caddy-tech-pouch",
    short_description: "Structured organiser pouch for cables, chargers, and small gear.",
    description:
      "Caddy ends the loose-cable shuffle at the bottom of your bag. Elastic loops, mesh pockets, and a padded divider give chargers, cables, earbuds, and card readers each a fixed place, while the water-resistant shell keeps everything protected. Opens flat so nothing hides at the bottom.",
    price: "27.99",
    stock: 11,
    image_url: "/images/products/caddy-tech-pouch.svg",
    is_featured: false,
    created_at: "2026-06-20T09:00:00Z",
    updated_at: "2026-07-10T09:00:00Z",
  },
];

const categoryById = new Map(
  mockCategories.map((category) => [category.id, category]),
);

export const mockProducts: Product[] = rawProducts.map((product) => {
  const category = categoryById.get(product.category_id);
  if (!category) {
    throw new Error(`Unknown category_id ${product.category_id}`);
  }
  return { ...product, category };
});

export function findProductBySlug(slug: string): Product | undefined {
  return mockProducts.find((product) => product.slug === slug);
}

export function findProductById(id: number): Product | undefined {
  return mockProducts.find((product) => product.id === id);
}
